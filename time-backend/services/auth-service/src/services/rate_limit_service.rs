use super::*;
use crate::models::{LoginAttempt, AuthError};
use uuid::Uuid;
use chrono::{DateTime, Utc, Duration};
use tracing::{info, warn};

#[derive(Clone)]
pub struct RateLimitService;

impl RateLimitService {
    pub fn new() -> Self {
        Self
    }
    
    pub async fn check_rate_limit(&self, db: &Database, key: &str, limit: u32, window_minutes: u64) -> Result<bool, AuthError> {
        db.check_rate_limit(key, limit, window_minutes).await
    }
    
    pub async fn is_ip_blocked(&self, db: &Database, client_ip: &str) -> Result<bool, AuthError> {
        db.is_ip_blocked(client_ip).await
    }
    
    pub async fn block_ip(&self, db: &Database, client_ip: &str, duration_minutes: u64) -> Result<(), AuthError> {
        db.block_ip(client_ip, duration_minutes).await
    }
    
    pub async fn unblock_ip(&self, db: &Database, client_ip: &str) -> Result<(), AuthError> {
        db.unblock_ip(client_ip).await
    }
    
    pub async fn is_identifier_blocked(&self, db: &Database, identifier: &str) -> Result<bool, AuthError> {
        db.is_identifier_blocked(identifier).await
    }
    
    pub async fn block_identifier(&self, db: &Database, identifier: &str, duration_minutes: u64) -> Result<(), AuthError> {
        db.block_identifier(identifier, duration_minutes).await
    }
    
    pub async fn unblock_identifier(&self, db: &Database, identifier: &str) -> Result<(), AuthError> {
        db.unblock_identifier(identifier).await
    }
    
    pub async fn record_login_attempt(&self, db: &Database, login_attempt: LoginAttempt) -> Result<(), AuthError> {
        db.record_login_attempt(login_attempt).await
    }
    
    pub async fn get_recent_failed_attempts(&self, db: &Database, identifier: &str, client_ip: &str, hours: i64) -> Result<u32, AuthError> {
        db.get_recent_failed_attempts(identifier, client_ip, hours).await
    }
    
    pub async fn get_recent_attempts_by_ip(&self, db: &Database, client_ip: &str, hours: i64) -> Result<u32, AuthError> {
        db.get_recent_attempts_by_ip(client_ip, hours).await
    }
    
    pub async fn get_recent_attempts_by_identifier(&self, db: &Database, identifier: &str, hours: i64) -> Result<u32, AuthError> {
        db.get_recent_attempts_by_identifier(identifier, hours).await
    }
    
    pub async fn check_brute_force_protection(&self, db: &Database, identifier: &str, client_ip: &str) -> Result<(), AuthError> {
        // Check for too many failed attempts in the last hour
        let failed_attempts = self.get_recent_failed_attempts(db, identifier, client_ip, 1).await?;
        
        if failed_attempts >= 10 {
            // Block IP for 1 hour
            self.block_ip(db, client_ip, 60).await?;
            warn!("IP blocked due to brute force attempts: {}", client_ip);
            return Err(AuthError::RateLimitExceeded);
        }
        
        // Check for too many failed attempts by identifier in the last hour
        let failed_attempts_by_identifier = self.get_recent_attempts_by_identifier(db, identifier, 1).await?;
        
        if failed_attempts_by_identifier >= 5 {
            // Block identifier for 30 minutes
            self.block_identifier(db, identifier, 30).await?;
            warn!("Identifier blocked due to brute force attempts: {}", identifier);
            return Err(AuthError::RateLimitExceeded);
        }
        
        Ok(())
    }
    
    pub async fn check_suspicious_activity(&self, db: &Database, client_ip: &str) -> Result<(), AuthError> {
        // Check for too many requests from the same IP in the last hour
        let recent_attempts = self.get_recent_attempts_by_ip(db, client_ip, 1).await?;
        
        if recent_attempts >= 100 {
            // Block IP for 2 hours
            self.block_ip(db, client_ip, 120).await?;
            warn!("IP blocked due to suspicious activity: {}", client_ip);
            return Err(AuthError::RateLimitExceeded);
        }
        
        Ok(())
    }
    
    pub async fn cleanup_old_attempts(&self, db: &Database, days: i64) -> Result<(), AuthError> {
        db.cleanup_old_login_attempts(days).await
    }
    
    pub async fn get_rate_limit_info(&self, db: &Database, key: &str) -> Result<Option<RateLimitEntry>, AuthError> {
        db.get_rate_limit_info(key).await
    }
    
    pub async fn reset_rate_limit(&self, db: &Database, key: &str) -> Result<(), AuthError> {
        db.reset_rate_limit(key).await
    }
    
    // Advanced rate limiting strategies
    pub async fn check_adaptive_rate_limit(&self, db: &Database, key: &str, base_limit: u32, window_minutes: u64) -> Result<bool, AuthError> {
        // Get recent activity to determine if we should apply stricter limits
        let recent_attempts = self.get_recent_attempts_by_ip(db, key, 1).await?;
        
        // Apply stricter limits if there's been recent activity
        let adjusted_limit = if recent_attempts > 50 {
            base_limit / 2
        } else if recent_attempts > 20 {
            (base_limit * 3) / 4
        } else {
            base_limit
        };
        
        self.check_rate_limit(db, key, adjusted_limit, window_minutes).await
    }
    
    pub async fn check_geolocation_rate_limit(&self, db: &Database, client_ip: &str, country_code: &str) -> Result<bool, AuthError> {
        // Different rate limits for different countries
        let (limit, window) = match country_code {
            "US" | "CA" | "GB" | "DE" | "FR" => (100, 5), // Higher limits for trusted countries
            "CN" | "RU" | "KP" => (10, 5), // Lower limits for high-risk countries
            _ => (50, 5), // Default limits
        };
        
        let key = format!("geo:{}:{}", country_code, client_ip);
        self.check_rate_limit(db, &key, limit, window).await
    }
    
    pub async fn check_user_agent_rate_limit(&self, db: &Database, user_agent: &str, client_ip: &str) -> Result<bool, AuthError> {
        // Check for suspicious user agents
        let suspicious_patterns = [
            "bot", "crawler", "spider", "scraper", "curl", "wget", "python", "java", "go-http"
        ];
        
        let is_suspicious = suspicious_patterns.iter().any(|pattern| {
            user_agent.to_lowercase().contains(pattern)
        });
        
        if is_suspicious {
            // Apply stricter rate limits for suspicious user agents
            let key = format!("ua:{}", client_ip);
            self.check_rate_limit(db, &key, 5, 5).await
        } else {
            Ok(true)
        }
    }
    
    pub async fn check_time_based_rate_limit(&self, db: &Database, client_ip: &str) -> Result<bool, AuthError> {
        let now = Utc::now();
        let hour = now.hour();
        
        // Apply different rate limits based on time of day
        let (limit, window) = match hour {
            0..=5 => (20, 5),   // Very low limits during night hours
            6..=8 => (50, 5),   // Low limits during early morning
            9..=17 => (100, 5), // Normal limits during business hours
            18..=22 => (80, 5), // Slightly lower limits during evening
            _ => (30, 5),       // Low limits during late night
        };
        
        let key = format!("time:{}:{}", hour, client_ip);
        self.check_rate_limit(db, &key, limit, window).await
    }
    
    pub async fn check_combined_rate_limit(&self, db: &Database, client_ip: &str, user_agent: &str, country_code: &str) -> Result<bool, AuthError> {
        // Check all rate limiting strategies
        let basic_check = self.check_rate_limit(db, &format!("basic:{}", client_ip), 60, 5).await?;
        let geo_check = self.check_geolocation_rate_limit(db, client_ip, country_code).await?;
        let ua_check = self.check_user_agent_rate_limit(db, user_agent, client_ip).await?;
        let time_check = self.check_time_based_rate_limit(db, client_ip).await?;
        
        // All checks must pass
        Ok(basic_check && geo_check && ua_check && time_check)
    }
}