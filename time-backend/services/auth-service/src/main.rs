use tonic::transport::Server;
use tokio;
use std::sync::Arc;
use tracing::{info, error};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod handlers;
mod models;
mod services;
mod db;
mod middleware;

use handlers::AuthServiceImpl;
use services::AuthServiceManager;
use models::AuthConfig;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "auth_service=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("Starting Nia Auth Service...");

    // Load configuration
    let config = load_config()?;
    
    // Initialize database
    info!("Connecting to database...");
    let db = db::init_db().await?;
    info!("Database connected successfully");

    // Initialize auth service manager
    let auth_manager = Arc::new(AuthServiceManager::new(db, config));
    
    // Initialize gRPC service
    let auth_service = AuthServiceImpl::new(auth_manager.clone());
    
    // Start cleanup task
    let cleanup_manager = auth_manager.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(3600)); // Every hour
        loop {
            interval.tick().await;
            if let Err(e) = cleanup_manager.cleanup_expired_data().await {
                error!("Failed to cleanup expired data: {}", e);
            }
        }
    });

    // Start server
    let addr = "0.0.0.0:50051".parse()?;
    info!("Auth service starting on {}", addr);
    
    Server::builder()
        .add_service(handlers::auth_service::auth_service_server::AuthServiceServer::new(auth_service))
        .serve(addr)
        .await?;
        
    Ok(())
}

fn load_config() -> Result<AuthConfig, Box<dyn std::error::Error>> {
    // Load from environment variables
    let config = AuthConfig {
        jwt_secret: std::env::var("JWT_SECRET")
            .unwrap_or_else(|_| "your-super-secret-jwt-key-change-this-in-production".to_string()),
        jwt_expiry_hours: std::env::var("JWT_EXPIRY_HOURS")
            .unwrap_or_else(|_| "1".to_string())
            .parse()
            .unwrap_or(1),
        refresh_token_expiry_days: std::env::var("REFRESH_TOKEN_EXPIRY_DAYS")
            .unwrap_or_else(|_| "30".to_string())
            .parse()
            .unwrap_or(30),
        session_expiry_hours: std::env::var("SESSION_EXPIRY_HOURS")
            .unwrap_or_else(|_| "24".to_string())
            .parse()
            .unwrap_or(24),
        password_reset_expiry_hours: std::env::var("PASSWORD_RESET_EXPIRY_HOURS")
            .unwrap_or_else(|_| "1".to_string())
            .parse()
            .unwrap_or(1),
        max_login_attempts: std::env::var("MAX_LOGIN_ATTEMPTS")
            .unwrap_or_else(|_| "5".to_string())
            .parse()
            .unwrap_or(5),
        lockout_duration_minutes: std::env::var("LOCKOUT_DURATION_MINUTES")
            .unwrap_or_else(|_| "30".to_string())
            .parse()
            .unwrap_or(30),
        rate_limit_requests_per_minute: std::env::var("RATE_LIMIT_REQUESTS_PER_MINUTE")
            .unwrap_or_else(|_| "60".to_string())
            .parse()
            .unwrap_or(60),
        rate_limit_window_minutes: std::env::var("RATE_LIMIT_WINDOW_MINUTES")
            .unwrap_or_else(|_| "1".to_string())
            .parse()
            .unwrap_or(1),
        password_min_length: std::env::var("PASSWORD_MIN_LENGTH")
            .unwrap_or_else(|_| "8".to_string())
            .parse()
            .unwrap_or(8),
        password_require_uppercase: std::env::var("PASSWORD_REQUIRE_UPPERCASE")
            .unwrap_or_else(|_| "true".to_string())
            .parse()
            .unwrap_or(true),
        password_require_lowercase: std::env::var("PASSWORD_REQUIRE_LOWERCASE")
            .unwrap_or_else(|_| "true".to_string())
            .parse()
            .unwrap_or(true),
        password_require_numbers: std::env::var("PASSWORD_REQUIRE_NUMBERS")
            .unwrap_or_else(|_| "true".to_string())
            .parse()
            .unwrap_or(true),
        password_require_special_chars: std::env::var("PASSWORD_REQUIRE_SPECIAL_CHARS")
            .unwrap_or_else(|_| "true".to_string())
            .parse()
            .unwrap_or(true),
        email_verification_required: std::env::var("EMAIL_VERIFICATION_REQUIRED")
            .unwrap_or_else(|_| "true".to_string())
            .parse()
            .unwrap_or(true),
        account_auto_activate: std::env::var("ACCOUNT_AUTO_ACTIVATE")
            .unwrap_or_else(|_| "false".to_string())
            .parse()
            .unwrap_or(false),
    };
    
    info!("Configuration loaded successfully");
    Ok(config)
}
