use super::Database;
use crate::models::{Session, SessionCreate, AuthError};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use tracing::{info, warn};

impl Database {
    pub async fn create_session(&self, session_create: SessionCreate) -> Result<(Session, String), AuthError> {
        let session = Session::new(
            session_create.user_id,
            session_create.client_ip,
            session_create.user_agent,
            &crate::models::AuthConfig::default(),
        );
        
        let session_token = session.generate_session_token();
        
        let created_session: Option<Session> = self.surreal
            .create(("session", session.id))
            .content(&session)
            .await?;
            
        match created_session {
            Some(session) => {
                // Store session in Redis for fast access
                self.store_session_in_redis(&session, &session_token).await?;
                
                info!("Created session: {} for user: {}", session.id, session.user_id);
                Ok((session, session_token))
            }
            None => Err(AuthError::InternalError),
        }
    }
    
    pub async fn get_session_by_id(&self, session_id: Uuid) -> Result<Session, AuthError> {
        let session: Option<Session> = self.surreal
            .select(("session", session_id))
            .await?;
            
        session.ok_or(AuthError::SessionExpired)
    }
    
    pub async fn get_session_by_token(&self, session_token: &str) -> Result<Session, AuthError> {
        // First try to get from Redis
        if let Ok(session) = self.get_session_from_redis(session_token).await {
            return Ok(session);
        }
        
        // Fallback to database
        let session_id = Session::from_session_token(session_token)?;
        self.get_session_by_id(session_id).await
    }
    
    pub async fn update_session_activity(&self, session_id: Uuid) -> Result<(), AuthError> {
        let mut session = self.get_session_by_id(session_id).await?;
        session.update_activity();
        
        let _: Option<Session> = self.surreal
            .update(("session", session_id))
            .content(&session)
            .await?;
            
        // Update in Redis as well
        self.update_session_in_redis(&session).await?;
        
        Ok(())
    }
    
    pub async fn extend_session(&self, session_id: Uuid) -> Result<(), AuthError> {
        let mut session = self.get_session_by_id(session_id).await?;
        session.extend(&crate::models::AuthConfig::default());
        
        let _: Option<Session> = self.surreal
            .update(("session", session_id))
            .content(&session)
            .await?;
            
        // Update in Redis as well
        self.update_session_in_redis(&session).await?;
        
        info!("Extended session: {}", session_id);
        Ok(())
    }
    
    pub async fn revoke_session(&self, session_id: Uuid) -> Result<(), AuthError> {
        let mut session = self.get_session_by_id(session_id).await?;
        session.revoke();
        
        let _: Option<Session> = self.surreal
            .update(("session", session_id))
            .content(&session)
            .await?;
            
        // Remove from Redis
        self.remove_session_from_redis(&session).await?;
        
        info!("Revoked session: {}", session_id);
        Ok(())
    }
    
    pub async fn revoke_all_user_sessions(&self, user_id: Uuid) -> Result<(), AuthError> {
        let _: Vec<Session> = self.surreal
            .query("UPDATE session SET is_active = false WHERE user_id = $user_id")
            .bind(("user_id", user_id))
            .await?
            .take(0)?;
            
        // Remove all user sessions from Redis
        self.remove_all_user_sessions_from_redis(user_id).await?;
        
        info!("Revoked all sessions for user: {}", user_id);
        Ok(())
    }
    
    pub async fn get_user_sessions(&self, user_id: Uuid) -> Result<Vec<Session>, AuthError> {
        let sessions: Vec<Session> = self.surreal
            .query("SELECT * FROM session WHERE user_id = $user_id AND is_active = true ORDER BY last_activity DESC")
            .bind(("user_id", user_id))
            .await?
            .take(0)?;
            
        Ok(sessions)
    }
    
    pub async fn get_active_sessions_count(&self, user_id: Uuid) -> Result<u64, AuthError> {
        let count: u64 = self.surreal
            .query("SELECT count() FROM session WHERE user_id = $user_id AND is_active = true")
            .bind(("user_id", user_id))
            .await?
            .take(0)?;
            
        Ok(count)
    }
    
    pub async fn cleanup_expired_sessions(&self) -> Result<(), AuthError> {
        let now = Utc::now();
        
        let _: Vec<Session> = self.surreal
            .query("UPDATE session SET is_active = false WHERE expires_at < $now")
            .bind(("now", now))
            .await?
            .take(0)?;
            
        info!("Cleaned up expired sessions");
        Ok(())
    }
    
    // Redis operations for session management
    async fn store_session_in_redis(&self, session: &Session, session_token: &str) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        let session_data = serde_json::to_string(session)?;
        
        // Store with expiration
        let ttl = (session.expires_at - Utc::now()).num_seconds() as usize;
        if ttl > 0 {
            redis::cmd("SETEX")
                .arg(format!("session:{}", session_token))
                .arg(ttl)
                .arg(session_data)
                .execute_async(&mut *redis_conn)
                .await?;
        }
        
        Ok(())
    }
    
    async fn get_session_from_redis(&self, session_token: &str) -> Result<Session, AuthError> {
        let mut redis_conn = self.redis.write().await;
        let session_data: String = redis::cmd("GET")
            .arg(format!("session:{}", session_token))
            .query_async(&mut *redis_conn)
            .await?;
            
        let session: Session = serde_json::from_str(&session_data)?;
        Ok(session)
    }
    
    async fn update_session_in_redis(&self, session: &Session) -> Result<(), AuthError> {
        // Find the session token in Redis (this is a simplified approach)
        // In a real implementation, you'd maintain a mapping between session_id and token
        let mut redis_conn = self.redis.write().await;
        let session_data = serde_json::to_string(session)?;
        
        // Update all session keys for this user (this is not optimal, but works for now)
        let keys: Vec<String> = redis::cmd("KEYS")
            .arg(format!("session:*"))
            .query_async(&mut *redis_conn)
            .await?;
            
        for key in keys {
            let existing_data: Option<String> = redis::cmd("GET")
                .arg(&key)
                .query_async(&mut *redis_conn)
                .await?;
                
            if let Some(data) = existing_data {
                if let Ok(existing_session) = serde_json::from_str::<Session>(&data) {
                    if existing_session.id == session.id {
                        let ttl = (session.expires_at - Utc::now()).num_seconds() as usize;
                        if ttl > 0 {
                            redis::cmd("SETEX")
                                .arg(&key)
                                .arg(ttl)
                                .arg(session_data.clone())
                                .execute_async(&mut *redis_conn)
                                .await?;
                        }
                        break;
                    }
                }
            }
        }
        
        Ok(())
    }
    
    async fn remove_session_from_redis(&self, session: &Session) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        // Find and remove the session token
        let keys: Vec<String> = redis::cmd("KEYS")
            .arg(format!("session:*"))
            .query_async(&mut *redis_conn)
            .await?;
            
        for key in keys {
            let existing_data: Option<String> = redis::cmd("GET")
                .arg(&key)
                .query_async(&mut *redis_conn)
                .await?;
                
            if let Some(data) = existing_data {
                if let Ok(existing_session) = serde_json::from_str::<Session>(&data) {
                    if existing_session.id == session.id {
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
    
    async fn remove_all_user_sessions_from_redis(&self, user_id: Uuid) -> Result<(), AuthError> {
        let mut redis_conn = self.redis.write().await;
        
        let keys: Vec<String> = redis::cmd("KEYS")
            .arg(format!("session:*"))
            .query_async(&mut *redis_conn)
            .await?;
            
        for key in keys {
            let existing_data: Option<String> = redis::cmd("GET")
                .arg(&key)
                .query_async(&mut *redis_conn)
                .await?;
                
            if let Some(data) = existing_data {
                if let Ok(existing_session) = serde_json::from_str::<Session>(&data) {
                    if existing_session.user_id == user_id {
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