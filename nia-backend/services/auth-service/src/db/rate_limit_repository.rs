use super::Database;
use crate::models::{RateLimitEntry, LoginAttempt, AuthError};
use uuid::Uuid;
use chrono::{DateTime, Utc, Duration};
use tracing::{info, warn};

impl Database {
    pub async fn check_rate_limit(&self, key: &str, limit: u32, window_minutes: u64) -> Result<bool, AuthError> {
        let mut redis_conn = self.redis.write().await;
        let now = Utc::now();
        let window_start = now - Duration::minutes(window_minutes as i64);
        
        // Get current count from Redis
        let count: u32 = redis::cmd("GET")
            .arg(format!("rate_limit:{}", key))
            .query_async(&mut *redis_conn)
            .await
            .unwrap_or(0);
            
        if count >= limit {
            warn!("Rate limit exceeded for key: {}", key);
            return Ok(false);
        }
        
        // Increment counter
        let _: u32 = redis::cmd("INCR")
            .arg(format!("rate_limit:{}", key))
            .query_async(&mut *redis_conn)
            .await?;
            
        // Set expiration if this is the first request in the window
        if count == 0 {
            let _: () = redis::cmd("EXPIRE")
                .arg(format!("rate_limit:{}", key))
                .arg(window_minutes * 60)
                .query_async(&mut *redis_conn)
                .await?;
        }
        
        Ok(true)
    }
    
    pub async fn record_login_attempt(&self, login_attempt: LoginAttempt) -> Result<(), AuthError> {
        let _: Option<LoginAttempt> = self.surreal
            .create(("login_attempt", login_attempt.id))
            .content(&login_attempt)
            .await?;
            
        if !login_attempt.success {
            warn!("Failed login attempt for identifier: {} from IP: {}", 
                  login_attempt.identifier, login_attempt.client_ip);
        } else {
            info!("Successful login attempt for identifier: {} from IP: {}", 
                  login_attempt.identifier, login_attempt.client_ip);
        }
        
        Ok(())
    }
    
    pub async fn get_recent_failed_attempts(&self, identifier: &str, client_ip: &str, hours: i64) -> Result<u32, AuthError> {
        let since = Utc::now() - Duration::hours(hours);
        
        let count: u64 = self.surreal
            .query("SELECT count() FROM login_attempt WHERE (identifier = $identifier OR client_ip = $client_ip) AND success = false AND created_at > $since")
            .bind(("identifier", identifier))
            .bind(("client_ip", client_ip))
            .bind(("since", since))
            .await?
            .take(0)?;
            
        Ok(count as u32)
    }
    
    pub async fn get_recent_attempts_by_ip(&self, client_ip: &str, hours: i64) -> Result<u32, AuthError> {
        let since = Utc::now() - Duration::hours(hours);
        
        let count: u64 = self.surreal
            .query("SELECT count() FROM login_attempt WHERE client_ip = $client_ip AND created_at > $since")
            .bind(("client_ip", client_ip))
            .bind(("since", since))
            .await?
            .take(0)?;
            
        Ok(count as u32)
    }
    
    pub async fn get_recent_attempts_by_identifier(&self, identifier: &str, hours: i64) -> Result<u32, AuthError> {
        let since = Utc::now() - Duration::hours(hours);
        
        let count: u64 = self.surreal
            .query("SELECT count() FROM login_attempt WHERE identifier = $identifier AND created_at > $since")
            .bind(("identifier", identifier))
            .bind(("since", since))
            .await?
            .take(0)?;
            
        Ok(count as u32)
    }
    
    pub async fn cleanup_old_login_attempts(&self, days: i64) -> Result<(), AuthError> {
        let cutoff = Utc::now() - Duration::days(days);
        
        let _: Vec<LoginAttempt> = self.surreal
            .query("DELETE login_attempt WHERE created_at < $cutoff")
            .bind(("cutoff", cutoff))
            .await?
            .take(0)?;
            
        info!("Cleaned up login attempts older than {} days", days);
        Ok(())
    }
    
    pub async fn is_ip_blocked(&self, client_ip: &str) -> Result<bool, AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        let blocked: bool = redis::cmd("EXISTS")
            .arg(format!("blocked_ip:{}", client_ip))
            .query_async(&mut *redis_conn)
            .await?;
            
        Ok(blocked)
    }
    
    pub async fn block_ip(&self, client_ip: &str, duration_minutes: u64) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        redis::cmd("SETEX")
            .arg(format!("blocked_ip:{}", client_ip))
            .arg(duration_minutes * 60)
            .arg("blocked")
            .execute_async(&mut *redis_conn)
            .await?;
            
        warn!("Blocked IP: {} for {} minutes", client_ip, duration_minutes);
        Ok(())
    }
    
    pub async fn unblock_ip(&self, client_ip: &str) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        redis::cmd("DEL")
            .arg(format!("blocked_ip:{}", client_ip))
            .execute_async(&mut *redis_conn)
            .await?;
            
        info!("Unblocked IP: {}", client_ip);
        Ok(())
    }
    
    pub async fn is_identifier_blocked(&self, identifier: &str) -> Result<bool, AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        let blocked: bool = redis::cmd("EXISTS")
            .arg(format!("blocked_identifier:{}", identifier))
            .query_async(&mut *redis_conn)
            .await?;
            
        Ok(blocked)
    }
    
    pub async fn block_identifier(&self, identifier: &str, duration_minutes: u64) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        redis::cmd("SETEX")
            .arg(format!("blocked_identifier:{}", identifier))
            .arg(duration_minutes * 60)
            .arg("blocked")
            .execute_async(&mut *redis_conn)
            .await?;
            
        warn!("Blocked identifier: {} for {} minutes", identifier, duration_minutes);
        Ok(())
    }
    
    pub async fn unblock_identifier(&self, identifier: &str) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        redis::cmd("DEL")
            .arg(format!("blocked_identifier:{}", identifier))
            .execute_async(&mut *redis_conn)
            .await?;
            
        info!("Unblocked identifier: {}", identifier);
        Ok(())
    }
    
    pub async fn get_rate_limit_info(&self, key: &str) -> Result<Option<RateLimitEntry>, AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        let count: Option<u32> = redis::cmd("GET")
            .arg(format!("rate_limit:{}", key))
            .query_async(&mut *redis_conn)
            .await?;
            
        let ttl: Option<i64> = redis::cmd("TTL")
            .arg(format!("rate_limit:{}", key))
            .query_async(&mut *redis_conn)
            .await?;
            
        match (count, ttl) {
            (Some(count), Some(ttl)) => {
                let now = Utc::now();
                let expires_at = now + Duration::seconds(ttl);
                let window_start = expires_at - Duration::minutes(1); // Assuming 1 minute window
                
                Ok(Some(RateLimitEntry {
                    key: key.to_string(),
                    count,
                    window_start,
                    expires_at,
                }))
            }
            _ => Ok(None),
        }
    }
    
    pub async fn reset_rate_limit(&self, key: &str) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        redis::cmd("DEL")
            .arg(format!("rate_limit:{}", key))
            .execute_async(&mut *redis_conn)
            .await?;
            
        info!("Reset rate limit for key: {}", key);
        Ok(())
    }
}