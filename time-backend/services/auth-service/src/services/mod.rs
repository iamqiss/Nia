use crate::models::*;
use crate::db::Database;
use nia_shared::auth::{JwtService, JwtConfig};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use tracing::{info, warn, error};
use std::sync::Arc;

pub mod auth_service;
pub mod email_service;
pub mod rate_limit_service;

pub use auth_service::*;
pub use email_service::*;
pub use rate_limit_service::*;

#[derive(Clone)]
pub struct AuthServiceManager {
    pub db: Database,
    pub jwt_service: JwtService,
    pub email_service: EmailService,
    pub rate_limit_service: RateLimitService,
    pub config: AuthConfig,
}

impl AuthServiceManager {
    pub fn new(db: Database, config: AuthConfig) -> Self {
        let jwt_config = JwtConfig {
            secret: config.jwt_secret.clone(),
            access_token_expiry_hours: config.jwt_expiry_hours,
            refresh_token_expiry_days: config.refresh_token_expiry_days,
            ..Default::default()
        };
        
        let jwt_service = JwtService::new(jwt_config);
        let email_service = EmailService::new();
        let rate_limit_service = RateLimitService::new();
        
        Self {
            db,
            jwt_service,
            email_service,
            rate_limit_service,
            config,
        }
    }
    
    pub async fn health_check(&self) -> Result<bool, AuthError> {
        self.db.health_check().await
    }
    
    pub async fn cleanup_expired_data(&self) -> Result<(), AuthError> {
        self.db.cleanup_expired_data().await
    }
}
