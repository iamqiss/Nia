use super::Database;
use crate::models::{RefreshToken, RefreshTokenCreate, AuthError};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use tracing::{info, warn};

impl Database {
    pub async fn create_refresh_token(&self, refresh_token_create: RefreshTokenCreate) -> Result<(RefreshToken, String), AuthError> {
        let (refresh_token, token) = RefreshToken::new(
            refresh_token_create.user_id,
            refresh_token_create.session_id,
            &crate::models::AuthConfig::default(),
        );
        
        let created_token: Option<RefreshToken> = self.surreal
            .create(("refresh_token", refresh_token.id))
            .content(&refresh_token)
            .await?;
            
        match created_token {
            Some(refresh_token) => {
                // Store in Redis for fast access
                self.store_refresh_token_in_redis(&refresh_token, &token).await?;
                
                info!("Created refresh token: {} for user: {}", refresh_token.id, refresh_token.user_id);
                Ok((refresh_token, token))
            }
            None => Err(AuthError::InternalError),
        }
    }
    
    pub async fn get_refresh_token_by_id(&self, token_id: Uuid) -> Result<RefreshToken, AuthError> {
        let token: Option<RefreshToken> = self.surreal
            .select(("refresh_token", token_id))
            .await?;
            
        token.ok_or(AuthError::InvalidToken)
    }
    
    pub async fn get_refresh_token_by_hash(&self, token_hash: &str) -> Result<RefreshToken, AuthError> {
        let mut result: Vec<RefreshToken> = self.surreal
            .query("SELECT * FROM refresh_token WHERE token_hash = $token_hash")
            .bind(("token_hash", token_hash))
            .await?
            .take(0)?;
            
        result.pop().ok_or(AuthError::InvalidToken)
    }
    
    pub async fn verify_refresh_token(&self, token: &str) -> Result<RefreshToken, AuthError> {
        // First try to get from Redis
        if let Ok(refresh_token) = self.get_refresh_token_from_redis(token).await {
            if refresh_token.is_valid() && refresh_token.verify_token(token)? {
                return Ok(refresh_token);
            }
        }
        
        // Fallback to database
        let token_hash = RefreshToken::from_token(token)?;
        let refresh_token = self.get_refresh_token_by_hash(&token_hash).await?;
        
        if !refresh_token.is_valid() {
            return Err(AuthError::TokenExpired);
        }
        
        if !refresh_token.verify_token(token)? {
            return Err(AuthError::InvalidToken);
        }
        
        Ok(refresh_token)
    }
    
    pub async fn revoke_refresh_token(&self, token_id: Uuid) -> Result<(), AuthError> {
        let mut refresh_token = self.get_refresh_token_by_id(token_id).await?;
        refresh_token.revoke();
        
        let _: Option<RefreshToken> = self.surreal
            .update(("refresh_token", token_id))
            .content(&refresh_token)
            .await?;
            
        // Remove from Redis
        self.remove_refresh_token_from_redis(&refresh_token).await?;
        
        info!("Revoked refresh token: {}", token_id);
        Ok(())
    }
    
    pub async fn revoke_refresh_token_by_hash(&self, token_hash: &str) -> Result<(), AuthError> {
        let mut refresh_token = self.get_refresh_token_by_hash(token_hash).await?;
        refresh_token.revoke();
        
        let _: Option<RefreshToken> = self.surreal
            .update(("refresh_token", refresh_token.id))
            .content(&refresh_token)
            .await?;
            
        // Remove from Redis
        self.remove_refresh_token_from_redis(&refresh_token).await?;
        
        info!("Revoked refresh token by hash: {}", token_hash);
        Ok(())
    }
    
    pub async fn revoke_all_user_refresh_tokens(&self, user_id: Uuid) -> Result<(), AuthError> {
        let _: Vec<RefreshToken> = self.surreal
            .query("UPDATE refresh_token SET is_revoked = true WHERE user_id = $user_id")
            .bind(("user_id", user_id))
            .await?
            .take(0)?;
            
        // Remove all user refresh tokens from Redis
        self.remove_all_user_refresh_tokens_from_redis(user_id).await?;
        
        info!("Revoked all refresh tokens for user: {}", user_id);
        Ok(())
    }
    
    pub async fn revoke_all_session_refresh_tokens(&self, session_id: Uuid) -> Result<(), AuthError> {
        let _: Vec<RefreshToken> = self.surreal
            .query("UPDATE refresh_token SET is_revoked = true WHERE session_id = $session_id")
            .bind(("session_id", session_id))
            .await?
            .take(0)?;
            
        // Remove all session refresh tokens from Redis
        self.remove_all_session_refresh_tokens_from_redis(session_id).await?;
        
        info!("Revoked all refresh tokens for session: {}", session_id);
        Ok(())
    }
    
    pub async fn get_user_refresh_tokens(&self, user_id: Uuid) -> Result<Vec<RefreshToken>, AuthError> {
        let tokens: Vec<RefreshToken> = self.surreal
            .query("SELECT * FROM refresh_token WHERE user_id = $user_id AND is_revoked = false ORDER BY created_at DESC")
            .bind(("user_id", user_id))
            .await?
            .take(0)?;
            
        Ok(tokens)
    }
    
    pub async fn get_session_refresh_tokens(&self, session_id: Uuid) -> Result<Vec<RefreshToken>, AuthError> {
        let tokens: Vec<RefreshToken> = self.surreal
            .query("SELECT * FROM refresh_token WHERE session_id = $session_id AND is_revoked = false ORDER BY created_at DESC")
            .bind(("session_id", session_id))
            .await?
            .take(0)?;
            
        Ok(tokens)
    }
    
    pub async fn cleanup_expired_refresh_tokens(&self) -> Result<(), AuthError> {
        let now = Utc::now();
        
        let _: Vec<RefreshToken> = self.surreal
            .query("UPDATE refresh_token SET is_revoked = true WHERE expires_at < $now")
            .bind(("now", now))
            .await?
            .take(0)?;
            
        info!("Cleaned up expired refresh tokens");
        Ok(())
    }
    
    // Redis operations for refresh token management
    async fn store_refresh_token_in_redis(&self, refresh_token: &RefreshToken, token: &str) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        let token_data = serde_json::to_string(refresh_token)?;
        
        // Store with expiration
        let ttl = (refresh_token.expires_at - Utc::now()).num_seconds() as usize;
        if ttl > 0 {
            redis::cmd("SETEX")
                .arg(format!("refresh_token:{}", token))
                .arg(ttl)
                .arg(token_data)
                .execute_async(&mut *redis_conn)
                .await?;
        }
        
        Ok(())
    }
    
    async fn get_refresh_token_from_redis(&self, token: &str) -> Result<RefreshToken, AuthError> {
        let mut redis_conn = self.redis.write().await;
        let token_data: String = redis::cmd("GET")
            .arg(format!("refresh_token:{}", token))
            .query_async(&mut *redis_conn)
            .await?;
            
        let refresh_token: RefreshToken = serde_json::from_str(&token_data)?;
        Ok(refresh_token)
    }
    
    async fn remove_refresh_token_from_redis(&self, refresh_token: &RefreshToken) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        // Find and remove the refresh token
        let keys: Vec<String> = redis::cmd("KEYS")
            .arg(format!("refresh_token:*"))
            .query_async(&mut *redis_conn)
            .await?;
            
        for key in keys {
            let existing_data: Option<String> = redis::cmd("GET")
                .arg(&key)
                .query_async(&mut *redis_conn)
                .await?;
                
            if let Some(data) = existing_data {
                if let Ok(existing_token) = serde_json::from_str::<RefreshToken>(&data) {
                    if existing_token.id == refresh_token.id {
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
    
    async fn remove_all_user_refresh_tokens_from_redis(&self, user_id: Uuid) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        let keys: Vec<String> = redis::cmd("KEYS")
            .arg(format!("refresh_token:*"))
            .query_async(&mut *redis_conn)
            .await?;
            
        for key in keys {
            let existing_data: Option<String> = redis::cmd("GET")
                .arg(&key)
                .query_async(&mut *redis_conn)
                .await?;
                
            if let Some(data) = existing_data {
                if let Ok(existing_token) = serde_json::from_str::<RefreshToken>(&data) {
                    if existing_token.user_id == user_id {
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
    
    async fn remove_all_session_refresh_tokens_from_redis(&self, session_id: Uuid) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        let keys: Vec<String> = redis::cmd("KEYS")
            .arg(format!("refresh_token:*"))
            .query_async(&mut *redis_conn)
            .await?;
            
        for key in keys {
            let existing_data: Option<String> = redis::cmd("GET")
                .arg(&key)
                .query_async(&mut *redis_conn)
                .await?;
                
            if let Some(data) = existing_data {
                if let Ok(existing_token) = serde_json::from_str::<RefreshToken>(&data) {
                    if existing_token.session_id == session_id {
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