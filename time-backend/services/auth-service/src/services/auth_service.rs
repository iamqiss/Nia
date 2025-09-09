use super::*;
use crate::models::{UserCreate, SessionCreate, RefreshTokenCreate, PasswordResetCreate, LoginAttempt};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use tracing::{info, warn, error};

impl AuthServiceManager {
    // Registration
    pub async fn register(&self, user_create: UserCreate, client_ip: String, user_agent: String) -> Result<RegisterResult, AuthError> {
        // Check rate limiting
        let rate_limit_key = format!("register:{}", client_ip);
        if !self.rate_limit_service.check_rate_limit(&self.db, &rate_limit_key, 5, 15).await? {
            return Err(AuthError::RateLimitExceeded);
        }
        
        // Validate user data
        user_create.validate()?;
        
        // Create user
        let user = self.db.create_user(user_create).await?;
        
        // Create session
        let session_create = SessionCreate::new(user.id, client_ip.clone(), user_agent.clone());
        let (session, session_token) = self.db.create_session(session_create).await?;
        
        // Create refresh token
        let refresh_token_create = RefreshTokenCreate::new(user.id, session.id);
        let (refresh_token, refresh_token_string) = self.db.create_refresh_token(refresh_token_create).await?;
        
        // Generate JWT tokens
        let roles: Vec<String> = user.roles.iter().cloned().collect();
        let permissions = self.get_user_permissions(&user);
        
        let access_token = self.jwt_service.generate_access_token(
            user.id,
            session.id,
            roles,
            permissions,
        )?;
        
        let jwt_refresh_token = self.jwt_service.generate_refresh_token(
            user.id,
            session.id,
        )?;
        
        // Record successful registration
        let login_attempt = LoginAttempt {
            id: Uuid::new_v4(),
            identifier: user.email.clone(),
            client_ip,
            user_agent,
            success: true,
            created_at: Utc::now(),
        };
        self.db.record_login_attempt(login_attempt).await?;
        
        info!("User registered successfully: {}", user.id);
        
        Ok(RegisterResult {
            user_id: user.id,
            access_token,
            refresh_token: refresh_token_string,
            expires_at: session.expires_at,
            user_info: self.user_to_user_info(&user),
        })
    }
    
    // Login
    pub async fn login(&self, identifier: String, password: String, client_ip: String, user_agent: String, remember_me: bool) -> Result<LoginResult, AuthError> {
        // Check rate limiting
        let rate_limit_key = format!("login:{}:{}", identifier, client_ip);
        if !self.rate_limit_service.check_rate_limit(&self.db, &rate_limit_key, 5, 15).await? {
            return Err(AuthError::RateLimitExceeded);
        }
        
        // Check if IP or identifier is blocked
        if self.rate_limit_service.is_ip_blocked(&self.db, &client_ip).await? {
            return Err(AuthError::RateLimitExceeded);
        }
        
        if self.rate_limit_service.is_identifier_blocked(&self.db, &identifier).await? {
            return Err(AuthError::RateLimitExceeded);
        }
        
        // Get user
        let user = match self.db.get_user_by_identifier(&identifier).await {
            Ok(user) => user,
            Err(_) => {
                // Record failed attempt
                let login_attempt = LoginAttempt {
                    id: Uuid::new_v4(),
                    identifier: identifier.clone(),
                    client_ip: client_ip.clone(),
                    user_agent: user_agent.clone(),
                    success: false,
                    created_at: Utc::now(),
                };
                self.db.record_login_attempt(login_attempt).await?;
                return Err(AuthError::InvalidCredentials);
            }
        };
        
        // Check if user can login
        user.can_login()?;
        
        // Verify password
        if !user.verify_password(&password)? {
            // Record failed attempt
            let login_attempt = LoginAttempt {
                id: Uuid::new_v4(),
                identifier: identifier.clone(),
                client_ip: client_ip.clone(),
                user_agent: user_agent.clone(),
                success: false,
                created_at: Utc::now(),
            };
            self.db.record_login_attempt(login_attempt).await?;
            
            // Record failed login in user record
            self.db.record_failed_login(user.id).await?;
            
            return Err(AuthError::InvalidCredentials);
        }
        
        // Create session
        let session_create = SessionCreate::new(user.id, client_ip.clone(), user_agent.clone());
        let (session, session_token) = self.db.create_session(session_create).await?;
        
        // Create refresh token
        let refresh_token_create = RefreshTokenCreate::new(user.id, session.id);
        let (refresh_token, refresh_token_string) = self.db.create_refresh_token(refresh_token_create).await?;
        
        // Generate JWT tokens
        let roles: Vec<String> = user.roles.iter().cloned().collect();
        let permissions = self.get_user_permissions(&user);
        
        let access_token = self.jwt_service.generate_access_token(
            user.id,
            session.id,
            roles,
            permissions,
        )?;
        
        let jwt_refresh_token = self.jwt_service.generate_refresh_token(
            user.id,
            session.id,
        )?;
        
        // Record successful login
        let login_attempt = LoginAttempt {
            id: Uuid::new_v4(),
            identifier: identifier.clone(),
            client_ip: client_ip.clone(),
            user_agent: user_agent.clone(),
            success: true,
            created_at: Utc::now(),
        };
        self.db.record_login_attempt(login_attempt).await?;
        self.db.record_successful_login(user.id).await?;
        
        info!("User logged in successfully: {}", user.id);
        
        Ok(LoginResult {
            user_id: user.id,
            access_token,
            refresh_token: refresh_token_string,
            expires_at: session.expires_at,
            user_info: self.user_to_user_info(&user),
        })
    }
    
    // Logout
    pub async fn logout(&self, access_token: String, refresh_token: String, client_ip: String) -> Result<(), AuthError> {
        // Verify access token
        let claims = self.jwt_service.verify_access_token(&access_token)?;
        
        // Revoke session
        self.db.revoke_session(claims.session_id).await?;
        
        // Revoke refresh token
        if let Ok(refresh_token_claims) = self.jwt_service.verify_refresh_token(&refresh_token) {
            self.db.revoke_refresh_token(refresh_token_claims.session_id).await?;
        }
        
        info!("User logged out: {}", claims.sub);
        Ok(())
    }
    
    // Refresh token
    pub async fn refresh_token(&self, refresh_token: String, client_ip: String, user_agent: String) -> Result<RefreshTokenResult, AuthError> {
        // Check rate limiting
        let rate_limit_key = format!("refresh:{}", client_ip);
        if !self.rate_limit_service.check_rate_limit(&self.db, &rate_limit_key, 10, 5).await? {
            return Err(AuthError::RateLimitExceeded);
        }
        
        // Verify refresh token
        let claims = self.jwt_service.verify_refresh_token(&refresh_token)?;
        
        // Verify refresh token in database
        let db_refresh_token = self.db.verify_refresh_token(&refresh_token).await?;
        
        // Get session
        let session = self.db.get_session_by_id(claims.session_id).await?;
        if !session.is_valid() {
            return Err(AuthError::SessionExpired);
        }
        
        // Get user
        let user = self.db.get_user_by_id(claims.sub).await?;
        user.can_login()?;
        
        // Create new session
        let session_create = SessionCreate::new(user.id, client_ip, user_agent);
        let (new_session, _) = self.db.create_session(session_create).await?;
        
        // Create new refresh token
        let refresh_token_create = RefreshTokenCreate::new(user.id, new_session.id);
        let (new_refresh_token, new_refresh_token_string) = self.db.create_refresh_token(refresh_token_create).await?;
        
        // Revoke old refresh token
        self.db.revoke_refresh_token(db_refresh_token.id).await?;
        
        // Generate new access token
        let roles: Vec<String> = user.roles.iter().cloned().collect();
        let permissions = self.get_user_permissions(&user);
        
        let new_access_token = self.jwt_service.generate_access_token(
            user.id,
            new_session.id,
            roles,
            permissions,
        )?;
        
        info!("Token refreshed for user: {}", user.id);
        
        Ok(RefreshTokenResult {
            access_token: new_access_token,
            refresh_token: new_refresh_token_string,
            expires_at: new_session.expires_at,
        })
    }
    
    // Verify token
    pub async fn verify_token(&self, token: String, client_ip: String) -> Result<VerifyTokenResult, AuthError> {
        let claims = self.jwt_service.verify_access_token(&token)?;
        
        // Verify session is still valid
        let session = self.db.get_session_by_id(claims.session_id).await?;
        if !session.is_valid() {
            return Err(AuthError::SessionExpired);
        }
        
        // Update session activity
        self.db.update_session_activity(claims.session_id).await?;
        
        Ok(VerifyTokenResult {
            valid: true,
            user_id: claims.sub,
            expires_at: DateTime::from_timestamp(claims.exp as i64, 0).unwrap_or_default(),
            permissions: claims.permissions,
        })
    }
    
    // Change password
    pub async fn change_password(&self, access_token: String, current_password: String, new_password: String, client_ip: String) -> Result<(), AuthError> {
        // Verify access token
        let claims = self.jwt_service.verify_access_token(&access_token)?;
        
        // Change password
        self.db.change_user_password(claims.sub, &current_password, &new_password).await?;
        
        // Revoke all sessions except current one
        self.db.revoke_all_user_sessions(claims.sub).await?;
        
        info!("Password changed for user: {}", claims.sub);
        Ok(())
    }
    
    // Reset password
    pub async fn reset_password(&self, email: String, client_ip: String) -> Result<(), AuthError> {
        // Check rate limiting
        let rate_limit_key = format!("reset_password:{}", client_ip);
        if !self.rate_limit_service.check_rate_limit(&self.db, &rate_limit_key, 3, 60).await? {
            return Err(AuthError::RateLimitExceeded);
        }
        
        // Get user
        let user = match self.db.get_user_by_email(&email).await {
            Ok(user) => user,
            Err(_) => {
                // Don't reveal if email exists
                return Ok(());
            }
        };
        
        // Create password reset token
        let password_reset_create = PasswordResetCreate::new(user.id);
        let (password_reset, token) = self.db.create_password_reset(password_reset_create).await?;
        
        // Send email
        self.email_service.send_password_reset_email(&user.email, &token).await?;
        
        info!("Password reset email sent to: {}", email);
        Ok(())
    }
    
    // Confirm password reset
    pub async fn confirm_password_reset(&self, reset_token: String, new_password: String, client_ip: String) -> Result<(), AuthError> {
        // Check rate limiting
        let rate_limit_key = format!("confirm_reset:{}", client_ip);
        if !self.rate_limit_service.check_rate_limit(&self.db, &rate_limit_key, 5, 15).await? {
            return Err(AuthError::RateLimitExceeded);
        }
        
        // Verify and use reset token
        let password_reset = self.db.use_password_reset_token(&reset_token).await?;
        
        // Change password
        self.db.change_user_password(password_reset.user_id, "", &new_password).await?;
        
        // Revoke all sessions
        self.db.revoke_all_user_sessions(password_reset.user_id).await?;
        
        info!("Password reset completed for user: {}", password_reset.user_id);
        Ok(())
    }
    
    // Get active sessions
    pub async fn get_active_sessions(&self, access_token: String) -> Result<Vec<SessionInfo>, AuthError> {
        let claims = self.jwt_service.verify_access_token(&access_token)?;
        
        let sessions = self.db.get_user_sessions(claims.sub).await?;
        
        Ok(sessions.into_iter().map(|session| SessionInfo {
            session_id: session.id.to_string(),
            client_ip: session.client_ip,
            user_agent: session.user_agent,
            created_at: session.created_at,
            last_activity: session.last_activity,
            expires_at: session.expires_at,
            is_current: session.id == claims.session_id,
        }).collect())
    }
    
    // Revoke session
    pub async fn revoke_session(&self, access_token: String, session_id: String) -> Result<(), AuthError> {
        let claims = self.jwt_service.verify_access_token(&access_token)?;
        
        let session_uuid = Uuid::parse_str(&session_id)
            .map_err(|_| AuthError::InvalidToken)?;
        
        self.db.revoke_session(session_uuid).await?;
        
        info!("Session revoked: {} by user: {}", session_id, claims.sub);
        Ok(())
    }
    
    // Revoke all sessions
    pub async fn revoke_all_sessions(&self, access_token: String) -> Result<(), AuthError> {
        let claims = self.jwt_service.verify_access_token(&access_token)?;
        
        self.db.revoke_all_user_sessions(claims.sub).await?;
        
        info!("All sessions revoked for user: {}", claims.sub);
        Ok(())
    }
    
    // Deactivate account
    pub async fn deactivate_account(&self, access_token: String, password: String, client_ip: String) -> Result<(), AuthError> {
        let claims = self.jwt_service.verify_access_token(&access_token)?;
        
        // Verify password
        let user = self.db.get_user_by_id(claims.sub).await?;
        if !user.verify_password(&password)? {
            return Err(AuthError::InvalidCredentials);
        }
        
        // Deactivate account
        self.db.deactivate_user(claims.sub).await?;
        
        // Revoke all sessions
        self.db.revoke_all_user_sessions(claims.sub).await?;
        
        info!("Account deactivated: {}", claims.sub);
        Ok(())
    }
    
    // Delete account
    pub async fn delete_account(&self, access_token: String, password: String, client_ip: String) -> Result<(), AuthError> {
        let claims = self.jwt_service.verify_access_token(&access_token)?;
        
        // Verify password
        let user = self.db.get_user_by_id(claims.sub).await?;
        if !user.verify_password(&password)? {
            return Err(AuthError::InvalidCredentials);
        }
        
        // Delete account
        self.db.delete_user(claims.sub).await?;
        
        info!("Account deleted: {}", claims.sub);
        Ok(())
    }
    
    // Helper methods
    fn get_user_permissions(&self, user: &User) -> Vec<String> {
        let mut permissions = Vec::new();
        
        for role in &user.roles {
            match role.as_str() {
                "user" => {
                    permissions.extend(vec![
                        "read:own_profile".to_string(),
                        "write:own_profile".to_string(),
                        "read:posts".to_string(),
                        "write:posts".to_string(),
                    ]);
                }
                "moderator" => {
                    permissions.extend(vec![
                        "moderate:content".to_string(),
                        "moderate:users".to_string(),
                    ]);
                }
                "admin" => {
                    permissions.extend(vec![
                        "admin:users".to_string(),
                        "admin:system".to_string(),
                    ]);
                }
                _ => {}
            }
        }
        
        permissions.sort();
        permissions.dedup();
        permissions
    }
    
    fn user_to_user_info(&self, user: &User) -> UserInfo {
        UserInfo {
            user_id: user.id.to_string(),
            username: user.username.clone(),
            email: user.email.clone(),
            display_name: user.display_name.clone(),
            bio: user.bio.clone(),
            avatar_url: user.avatar_url.clone(),
            created_at: user.created_at,
            updated_at: user.updated_at,
            email_verified: user.email_verified,
            account_active: user.account_active,
            roles: user.roles.iter().cloned().collect(),
        }
    }
}

// Result types
#[derive(Debug)]
pub struct RegisterResult {
    pub user_id: Uuid,
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: DateTime<Utc>,
    pub user_info: UserInfo,
}

#[derive(Debug)]
pub struct LoginResult {
    pub user_id: Uuid,
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: DateTime<Utc>,
    pub user_info: UserInfo,
}

#[derive(Debug)]
pub struct RefreshTokenResult {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: DateTime<Utc>,
}

#[derive(Debug)]
pub struct VerifyTokenResult {
    pub valid: bool,
    pub user_id: Uuid,
    pub expires_at: DateTime<Utc>,
    pub permissions: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct UserInfo {
    pub user_id: String,
    pub username: String,
    pub email: String,
    pub display_name: String,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub email_verified: bool,
    pub account_active: bool,
    pub roles: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct SessionInfo {
    pub session_id: String,
    pub client_ip: String,
    pub user_agent: String,
    pub created_at: DateTime<Utc>,
    pub last_activity: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub is_current: bool,
}