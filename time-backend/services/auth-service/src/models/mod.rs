use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use validator::Validate;
use std::collections::HashSet;

pub mod user;
pub mod session;
pub mod refresh_token;
pub mod password_reset;

pub use user::*;
pub use session::*;
pub use refresh_token::*;
pub use password_reset::*;

#[derive(Debug, Clone, Serialize, Deserialize, Validate)]
pub struct User {
    pub id: Uuid,
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 3, max = 30))]
    pub username: String,
    pub password_hash: String,
    pub display_name: String,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
    pub email_verified: bool,
    pub account_active: bool,
    pub roles: HashSet<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_login: Option<DateTime<Utc>>,
    pub failed_login_attempts: u32,
    pub locked_until: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserCreate {
    pub email: String,
    pub username: String,
    pub password: String,
    pub display_name: String,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserUpdate {
    pub display_name: Option<String>,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: Uuid,
    pub user_id: Uuid,
    pub client_ip: String,
    pub user_agent: String,
    pub created_at: DateTime<Utc>,
    pub last_activity: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub is_active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RefreshToken {
    pub id: Uuid,
    pub user_id: Uuid,
    pub session_id: Uuid,
    pub token_hash: String,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub is_revoked: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PasswordReset {
    pub id: Uuid,
    pub user_id: Uuid,
    pub token_hash: String,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub used_at: Option<DateTime<Utc>>,
    pub is_used: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginAttempt {
    pub id: Uuid,
    pub identifier: String, // email or username
    pub client_ip: String,
    pub user_agent: String,
    pub success: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RateLimitEntry {
    pub key: String,
    pub count: u32,
    pub window_start: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
}

// JWT Claims structure
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,           // User ID
    pub session_id: Uuid,    // Session ID
    pub exp: usize,          // Expiration time
    pub iat: usize,          // Issued at
    pub roles: Vec<String>,  // User roles
    pub permissions: Vec<String>, // User permissions
}

// Configuration structures
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthConfig {
    pub jwt_secret: String,
    pub jwt_expiry_hours: u64,
    pub refresh_token_expiry_days: u64,
    pub session_expiry_hours: u64,
    pub password_reset_expiry_hours: u64,
    pub max_login_attempts: u32,
    pub lockout_duration_minutes: u64,
    pub rate_limit_requests_per_minute: u32,
    pub rate_limit_window_minutes: u64,
    pub password_min_length: usize,
    pub password_require_uppercase: bool,
    pub password_require_lowercase: bool,
    pub password_require_numbers: bool,
    pub password_require_special_chars: bool,
    pub email_verification_required: bool,
    pub account_auto_activate: bool,
}

impl Default for AuthConfig {
    fn default() -> Self {
        Self {
            jwt_secret: "your-secret-key".to_string(),
            jwt_expiry_hours: 1,
            refresh_token_expiry_days: 30,
            session_expiry_hours: 24,
            password_reset_expiry_hours: 1,
            max_login_attempts: 5,
            lockout_duration_minutes: 30,
            rate_limit_requests_per_minute: 60,
            rate_limit_window_minutes: 1,
            password_min_length: 8,
            password_require_uppercase: true,
            password_require_lowercase: true,
            password_require_numbers: true,
            password_require_special_chars: true,
            email_verification_required: true,
            account_auto_activate: false,
        }
    }
}

// Error types
#[derive(Debug, thiserror::Error)]
pub enum AuthError {
    #[error("Invalid credentials")]
    InvalidCredentials,
    
    #[error("User not found")]
    UserNotFound,
    
    #[error("User already exists")]
    UserAlreadyExists,
    
    #[error("Account locked")]
    AccountLocked,
    
    #[error("Account inactive")]
    AccountInactive,
    
    #[error("Email not verified")]
    EmailNotVerified,
    
    #[error("Invalid token")]
    InvalidToken,
    
    #[error("Token expired")]
    TokenExpired,
    
    #[error("Session expired")]
    SessionExpired,
    
    #[error("Rate limit exceeded")]
    RateLimitExceeded,
    
    #[error("Password too weak")]
    PasswordTooWeak,
    
    #[error("Database error: {0}")]
    DatabaseError(String),
    
    #[error("Redis error: {0}")]
    RedisError(String),
    
    #[error("JWT error: {0}")]
    JwtError(String),
    
    #[error("Validation error: {0}")]
    ValidationError(String),
    
    #[error("Internal server error")]
    InternalError,
}

impl From<surrealdb::Error> for AuthError {
    fn from(err: surrealdb::Error) -> Self {
        AuthError::DatabaseError(err.to_string())
    }
}

impl From<redis::RedisError> for AuthError {
    fn from(err: redis::RedisError) -> Self {
        AuthError::RedisError(err.to_string())
    }
}

impl From<jsonwebtoken::errors::Error> for AuthError {
    fn from(err: jsonwebtoken::errors::Error) -> Self {
        AuthError::JwtError(err.to_string())
    }
}

impl From<validator::ValidationErrors> for AuthError {
    fn from(err: validator::ValidationErrors) -> Self {
        AuthError::ValidationError(err.to_string())
    }
}
