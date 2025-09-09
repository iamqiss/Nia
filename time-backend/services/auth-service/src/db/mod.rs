use surrealdb::{Surreal, engine::remote::ws::Ws, SurrealClient};
use redis::Client as RedisClient;
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{info, error};

pub mod user_repository;
pub mod session_repository;
pub mod refresh_token_repository;
pub mod password_reset_repository;
pub mod rate_limit_repository;

pub use user_repository::*;
pub use session_repository::*;
pub use refresh_token_repository::*;
pub use password_reset_repository::*;
pub use rate_limit_repository::*;

#[derive(Clone)]
pub struct Database {
    pub surreal: Surreal<SurrealClient>,
    pub redis: Arc<RwLock<redis::aio::Connection>>,
}

impl Database {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
        // Initialize SurrealDB
        let surreal = Surreal::new::<Ws>("127.0.0.1:8000").await?;
        surreal.use_ns("nia").use_db("auth").await?;
        
        // Initialize Redis
        let redis_client = RedisClient::open("redis://127.0.0.1:6379")?;
        let redis_conn = redis_client.get_async_connection().await?;
        
        let db = Database {
            surreal,
            redis: Arc::new(RwLock::new(redis_conn)),
        };
        
        // Initialize database schema
        db.init_schema().await?;
        
        Ok(db)
    }
    
    async fn init_schema(&self) -> Result<(), Box<dyn std::error::Error>> {
        info!("Initializing database schema...");
        
        // Create indexes for better performance
        let _: Vec<surrealdb::Response> = self.surreal.query(r#"
            -- User indexes
            DEFINE INDEX user_email ON user FIELDS email UNIQUE;
            DEFINE INDEX user_username ON user FIELDS username UNIQUE;
            DEFINE INDEX user_created_at ON user FIELDS created_at;
            DEFINE INDEX user_account_active ON user FIELDS account_active;
            
            -- Session indexes
            DEFINE INDEX session_user_id ON session FIELDS user_id;
            DEFINE INDEX session_expires_at ON session FIELDS expires_at;
            DEFINE INDEX session_is_active ON session FIELDS is_active;
            
            -- Refresh token indexes
            DEFINE INDEX refresh_token_user_id ON refresh_token FIELDS user_id;
            DEFINE INDEX refresh_token_session_id ON refresh_token FIELDS session_id;
            DEFINE INDEX refresh_token_expires_at ON refresh_token FIELDS expires_at;
            DEFINE INDEX refresh_token_is_revoked ON refresh_token FIELDS is_revoked;
            
            -- Password reset indexes
            DEFINE INDEX password_reset_user_id ON password_reset FIELDS user_id;
            DEFINE INDEX password_reset_expires_at ON password_reset FIELDS expires_at;
            DEFINE INDEX password_reset_is_used ON password_reset FIELDS is_used;
            
            -- Login attempt indexes
            DEFINE INDEX login_attempt_identifier ON login_attempt FIELDS identifier;
            DEFINE INDEX login_attempt_client_ip ON login_attempt FIELDS client_ip;
            DEFINE INDEX login_attempt_created_at ON login_attempt FIELDS created_at;
        "#).await?;
        
        info!("Database schema initialized successfully");
        Ok(())
    }
    
    pub async fn health_check(&self) -> Result<bool, Box<dyn std::error::Error>> {
        // Check SurrealDB connection
        let _: Vec<surrealdb::Response> = self.surreal.query("SELECT 1").await?;
        
        // Check Redis connection
        let mut redis_conn = self.redis.write().await;
        redis::cmd("PING").execute_async(&mut *redis_conn).await?;
        
        Ok(true)
    }
    
    pub async fn cleanup_expired_data(&self) -> Result<(), Box<dyn std::error::Error>> {
        let now = chrono::Utc::now();
        
        // Clean up expired sessions
        let _: Vec<surrealdb::Response> = self.surreal.query(r#"
            UPDATE session SET is_active = false WHERE expires_at < $now
        "#).bind(("now", now)).await?;
        
        // Clean up expired refresh tokens
        let _: Vec<surrealdb::Response> = self.surreal.query(r#"
            UPDATE refresh_token SET is_revoked = true WHERE expires_at < $now
        "#).bind(("now", now)).await?;
        
        // Clean up expired password reset tokens
        let _: Vec<surrealdb::Response> = self.surreal.query(r#"
            UPDATE password_reset SET is_used = true WHERE expires_at < $now
        "#).bind(("now", now)).await?;
        
        // Clean up old login attempts (older than 30 days)
        let thirty_days_ago = now - chrono::Duration::days(30);
        let _: Vec<surrealdb::Response> = self.surreal.query(r#"
            DELETE login_attempt WHERE created_at < $thirty_days_ago
        "#).bind(("thirty_days_ago", thirty_days_ago)).await?;
        
        info!("Cleaned up expired data");
        Ok(())
    }
}

// Database initialization function
pub async fn init_db() -> Result<Database, Box<dyn std::error::Error>> {
    Database::new().await
}
