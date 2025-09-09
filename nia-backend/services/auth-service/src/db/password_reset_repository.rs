use super::Database;
use crate::models::{PasswordReset, PasswordResetCreate, AuthError};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use tracing::{info, warn};

impl Database {
    pub async fn create_password_reset(&self, password_reset_create: PasswordResetCreate) -> Result<(PasswordReset, String), AuthError> {
        let (password_reset, token) = PasswordReset::new(
            password_reset_create.user_id,
            &crate::models::AuthConfig::default(),
        );
        
        // Revoke any existing password reset tokens for this user
        self.revoke_user_password_reset_tokens(password_reset_create.user_id).await?;
        
        let created_reset: Option<PasswordReset> = self.surreal
            .create(("password_reset", password_reset.id))
            .content(&password_reset)
            .await?;
            
        match created_reset {
            Some(password_reset) => {
                // Store in Redis for fast access
                self.store_password_reset_in_redis(&password_reset, &token).await?;
                
                info!("Created password reset token: {} for user: {}", password_reset.id, password_reset.user_id);
                Ok((password_reset, token))
            }
            None => Err(AuthError::InternalError),
        }
    }
    
    pub async fn get_password_reset_by_id(&self, reset_id: Uuid) -> Result<PasswordReset, AuthError> {
        let reset: Option<PasswordReset> = self.surreal
            .select(("password_reset", reset_id))
            .await?;
            
        reset.ok_or(AuthError::InvalidToken)
    }
    
    pub async fn get_password_reset_by_hash(&self, token_hash: &str) -> Result<PasswordReset, AuthError> {
        let mut result: Vec<PasswordReset> = self.surreal
            .query("SELECT * FROM password_reset WHERE token_hash = $token_hash")
            .bind(("token_hash", token_hash))
            .await?
            .take(0)?;
            
        result.pop().ok_or(AuthError::InvalidToken)
    }
    
    pub async fn verify_password_reset_token(&self, token: &str) -> Result<PasswordReset, AuthError> {
        // First try to get from Redis
        if let Ok(password_reset) = self.get_password_reset_from_redis(token).await {
            if password_reset.is_valid() && password_reset.verify_token(token)? {
                return Ok(password_reset);
            }
        }
        
        // Fallback to database
        let token_hash = PasswordReset::from_token(token)?;
        let password_reset = self.get_password_reset_by_hash(&token_hash).await?;
        
        if !password_reset.is_valid() {
            return Err(AuthError::TokenExpired);
        }
        
        if !password_reset.verify_token(token)? {
            return Err(AuthError::InvalidToken);
        }
        
        Ok(password_reset)
    }
    
    pub async fn use_password_reset_token(&self, token: &str) -> Result<PasswordReset, AuthError> {
        let mut password_reset = self.verify_password_reset_token(token).await?;
        password_reset.use_token();
        
        let updated_reset: Option<PasswordReset> = self.surreal
            .update(("password_reset", password_reset.id))
            .content(&password_reset)
            .await?;
            
        match updated_reset {
            Some(password_reset) => {
                // Remove from Redis since it's now used
                self.remove_password_reset_from_redis(&password_reset).await?;
                
                info!("Used password reset token: {} for user: {}", password_reset.id, password_reset.user_id);
                Ok(password_reset)
            }
            None => Err(AuthError::InternalError),
        }
    }
    
    pub async fn revoke_password_reset_token(&self, reset_id: Uuid) -> Result<(), AuthError> {
        let mut password_reset = self.get_password_reset_by_id(reset_id).await?;
        password_reset.use_token();
        
        let _: Option<PasswordReset> = self.surreal
            .update(("password_reset", reset_id))
            .content(&password_reset)
            .await?;
            
        // Remove from Redis
        self.remove_password_reset_from_redis(&password_reset).await?;
        
        info!("Revoked password reset token: {}", reset_id);
        Ok(())
    }
    
    pub async fn revoke_user_password_reset_tokens(&self, user_id: Uuid) -> Result<(), AuthError> {
        let _: Vec<PasswordReset> = self.surreal
            .query("UPDATE password_reset SET is_used = true WHERE user_id = $user_id AND is_used = false")
            .bind(("user_id", user_id))
            .await?
            .take(0)?;
            
        // Remove all user password reset tokens from Redis
        self.remove_all_user_password_reset_tokens_from_redis(user_id).await?;
        
        info!("Revoked all password reset tokens for user: {}", user_id);
        Ok(())
    }
    
    pub async fn get_user_password_reset_tokens(&self, user_id: Uuid) -> Result<Vec<PasswordReset>, AuthError> {
        let tokens: Vec<PasswordReset> = self.surreal
            .query("SELECT * FROM password_reset WHERE user_id = $user_id ORDER BY created_at DESC")
            .bind(("user_id", user_id))
            .await?
            .take(0)?;
            
        Ok(tokens)
    }
    
    pub async fn get_active_password_reset_tokens(&self, user_id: Uuid) -> Result<Vec<PasswordReset>, AuthError> {
        let tokens: Vec<PasswordReset> = self.surreal
            .query("SELECT * FROM password_reset WHERE user_id = $user_id AND is_used = false AND expires_at > $now ORDER BY created_at DESC")
            .bind(("user_id", user_id))
            .bind(("now", Utc::now()))
            .await?
            .take(0)?;
            
        Ok(tokens)
    }
    
    pub async fn cleanup_expired_password_reset_tokens(&self) -> Result<(), AuthError> {
        let now = Utc::now();
        
        let _: Vec<PasswordReset> = self.surreal
            .query("UPDATE password_reset SET is_used = true WHERE expires_at < $now")
            .bind(("now", now))
            .await?
            .take(0)?;
            
        info!("Cleaned up expired password reset tokens");
        Ok(())
    }
    
    // Redis operations for password reset token management
    async fn store_password_reset_in_redis(&self, password_reset: &PasswordReset, token: &str) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        let token_data = serde_json::to_string(password_reset)?;
        
        // Store with expiration
        let ttl = (password_reset.expires_at - Utc::now()).num_seconds() as usize;
        if ttl > 0 {
            redis::cmd("SETEX")
                .arg(format!("password_reset:{}", token))
                .arg(ttl)
                .arg(token_data)
                .execute_async(&mut *redis_conn)
                .await?;
        }
        
        Ok(())
    }
    
    async fn get_password_reset_from_redis(&self, token: &str) -> Result<PasswordReset, AuthError> {
        let mut redis_conn = self.redis.write().await;
        let token_data: String = redis::cmd("GET")
            .arg(format!("password_reset:{}", token))
            .query_async(&mut *redis_conn)
            .await?;
            
        let password_reset: PasswordReset = serde_json::from_str(&token_data)?;
        Ok(password_reset)
    }
    
    async fn remove_password_reset_from_redis(&self, password_reset: &PasswordReset) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        // Find and remove the password reset token
        let keys: Vec<String> = redis::cmd("KEYS")
            .arg(format!("password_reset:*"))
            .query_async(&mut *redis_conn)
            .await?;
            
        for key in keys {
            let existing_data: Option<String> = redis::cmd("GET")
                .arg(&key)
                .query_async(&mut *redis_conn)
                .await?;
                
            if let Some(data) = existing_data {
                if let Ok(existing_reset) = serde_json::from_str::<PasswordReset>(&data) {
                    if existing_reset.id == password_reset.id {
                        redis::cmd("DEL")
                            .arg(&key)
                            .execute_async(&mut *redis_conn)
                            .await?;
                        break;
                    }
                }
            }
        }
        
        Ok(())
    }
    
    async fn remove_all_user_password_reset_tokens_from_redis(&self, user_id: Uuid) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        let keys: Vec<String> = redis::cmd("KEYS")
            .arg(format!("password_reset:*"))
            .query_async(&mut *redis_conn)
            .await?;
            
        for key in keys {
            let existing_data: Option<String> = redis::cmd("GET")
                .arg(&key)
                .query_async(&mut *redis_conn)
                .await?;
                
            if let Some(data) = existing_data {
                if let Ok(existing_reset) = serde_json::from_str::<PasswordReset>(&data) {
                    if existing_reset.user_id == user_id {
                        redis::cmd("DEL")
                            .arg(&key)
                            .execute_async(&mut *redis_conn)
                            .await?;
                    }
                }
            }
        }
        
        Ok(())
    }
}