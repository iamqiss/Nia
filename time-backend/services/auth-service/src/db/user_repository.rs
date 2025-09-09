use super::Database;
use crate::models::{User, UserCreate, UserUpdate, AuthError};
use uuid::Uuid;
use surrealdb::sql::Thing;
use tracing::{info, error, warn};

impl Database {
    pub async fn create_user(&self, user_create: UserCreate) -> Result<User, AuthError> {
        // Check if user already exists
        if self.get_user_by_email(&user_create.email).await.is_ok() {
            return Err(AuthError::UserAlreadyExists);
        }
        
        if self.get_user_by_username(&user_create.username).await.is_ok() {
            return Err(AuthError::UserAlreadyExists);
        }
        
        let user = User::new(user_create, &crate::models::AuthConfig::default())?;
        
        let created_user: Option<User> = self.surreal
            .create(("user", user.id))
            .content(&user)
            .await?;
            
        match created_user {
            Some(user) => {
                info!("Created user: {}", user.id);
                Ok(user)
            }
            None => Err(AuthError::InternalError),
        }
    }
    
    pub async fn get_user_by_id(&self, user_id: Uuid) -> Result<User, AuthError> {
        let user: Option<User> = self.surreal
            .select(("user", user_id))
            .await?;
            
        user.ok_or(AuthError::UserNotFound)
    }
    
    pub async fn get_user_by_email(&self, email: &str) -> Result<User, AuthError> {
        let mut result: Vec<User> = self.surreal
            .query("SELECT * FROM user WHERE email = $email")
            .bind(("email", email))
            .await?
            .take(0)?;
            
        result.pop().ok_or(AuthError::UserNotFound)
    }
    
    pub async fn get_user_by_username(&self, username: &str) -> Result<User, AuthError> {
        let mut result: Vec<User> = self.surreal
            .query("SELECT * FROM user WHERE username = $username")
            .bind(("username", username))
            .await?
            .take(0)?;
            
        result.pop().ok_or(AuthError::UserNotFound)
    }
    
    pub async fn get_user_by_identifier(&self, identifier: &str) -> Result<User, AuthError> {
        // Try email first, then username
        if identifier.contains('@') {
            self.get_user_by_email(identifier).await
        } else {
            self.get_user_by_username(identifier).await
        }
    }
    
    pub async fn update_user(&self, user_id: Uuid, user_update: UserUpdate) -> Result<User, AuthError> {
        let mut user = self.get_user_by_id(user_id).await?;
        user.update(user_update)?;
        
        let updated_user: Option<User> = self.surreal
            .update(("user", user_id))
            .content(&user)
            .await?;
            
        match updated_user {
            Some(user) => {
                info!("Updated user: {}", user.id);
                Ok(user)
            }
            None => Err(AuthError::UserNotFound),
        }
    }
    
    pub async fn change_user_password(&self, user_id: Uuid, current_password: &str, new_password: &str) -> Result<(), AuthError> {
        let mut user = self.get_user_by_id(user_id).await?;
        user.change_password(current_password, new_password, &crate::models::AuthConfig::default())?;
        
        let _: Option<User> = self.surreal
            .update(("user", user_id))
            .content(&user)
            .await?;
            
        info!("Changed password for user: {}", user_id);
        Ok(())
    }
    
    pub async fn record_failed_login(&self, user_id: Uuid) -> Result<(), AuthError> {
        let mut user = self.get_user_by_id(user_id).await?;
        user.record_failed_login(&crate::models::AuthConfig::default());
        
        let _: Option<User> = self.surreal
            .update(("user", user_id))
            .content(&user)
            .await?;
            
        warn!("Failed login attempt for user: {}", user_id);
        Ok(())
    }
    
    pub async fn record_successful_login(&self, user_id: Uuid) -> Result<(), AuthError> {
        let mut user = self.get_user_by_id(user_id).await?;
        user.record_successful_login();
        
        let _: Option<User> = self.surreal
            .update(("user", user_id))
            .content(&user)
            .await?;
            
        info!("Successful login for user: {}", user_id);
        Ok(())
    }
    
    pub async fn deactivate_user(&self, user_id: Uuid) -> Result<(), AuthError> {
        let mut user = self.get_user_by_id(user_id).await?;
        user.deactivate();
        
        let _: Option<User> = self.surreal
            .update(("user", user_id))
            .content(&user)
            .await?;
            
        info!("Deactivated user: {}", user_id);
        Ok(())
    }
    
    pub async fn activate_user(&self, user_id: Uuid) -> Result<(), AuthError> {
        let mut user = self.get_user_by_id(user_id).await?;
        user.activate();
        
        let _: Option<User> = self.surreal
            .update(("user", user_id))
            .content(&user)
            .await?;
            
        info!("Activated user: {}", user_id);
        Ok(())
    }
    
    pub async fn verify_user_email(&self, user_id: Uuid) -> Result<(), AuthError> {
        let mut user = self.get_user_by_id(user_id).await?;
        user.verify_email();
        
        let _: Option<User> = self.surreal
            .update(("user", user_id))
            .content(&user)
            .await?;
            
        info!("Verified email for user: {}", user_id);
        Ok(())
    }
    
    pub async fn delete_user(&self, user_id: Uuid) -> Result<(), AuthError> {
        // First, deactivate all sessions and revoke all refresh tokens
        self.revoke_all_user_sessions(user_id).await?;
        
        // Delete the user
        let _: Option<User> = self.surreal
            .delete(("user", user_id))
            .await?;
            
        info!("Deleted user: {}", user_id);
        Ok(())
    }
    
    pub async fn add_user_role(&self, user_id: Uuid, role: String) -> Result<(), AuthError> {
        let mut user = self.get_user_by_id(user_id).await?;
        user.add_role(role.clone());
        
        let _: Option<User> = self.surreal
            .update(("user", user_id))
            .content(&user)
            .await?;
            
        info!("Added role '{}' to user: {}", role, user_id);
        Ok(())
    }
    
    pub async fn remove_user_role(&self, user_id: Uuid, role: &str) -> Result<(), AuthError> {
        let mut user = self.get_user_by_id(user_id).await?;
        user.remove_role(role);
        
        let _: Option<User> = self.surreal
            .update(("user", user_id))
            .content(&user)
            .await?;
            
        info!("Removed role '{}' from user: {}", role, user_id);
        Ok(())
    }
    
    pub async fn get_users_by_role(&self, role: &str) -> Result<Vec<User>, AuthError> {
        let users: Vec<User> = self.surreal
            .query("SELECT * FROM user WHERE roles CONTAINS $role")
            .bind(("role", role))
            .await?
            .take(0)?;
            
        Ok(users)
    }
    
    pub async fn search_users(&self, query: &str, limit: u32) -> Result<Vec<User>, AuthError> {
        let users: Vec<User> = self.surreal
            .query("SELECT * FROM user WHERE username ~* $query OR display_name ~* $query LIMIT $limit")
            .bind(("query", query))
            .bind(("limit", limit))
            .await?
            .take(0)?;
            
        Ok(users)
    }
    
    pub async fn get_user_stats(&self, user_id: Uuid) -> Result<UserStats, AuthError> {
        let user = self.get_user_by_id(user_id).await?;
        
        // Get session count
        let session_count: u64 = self.surreal
            .query("SELECT count() FROM session WHERE user_id = $user_id AND is_active = true")
            .bind(("user_id", user_id))
            .await?
            .take(0)?;
            
        // Get last login
        let last_login = user.last_login;
        
        Ok(UserStats {
            user_id,
            created_at: user.created_at,
            last_login,
            session_count,
            failed_login_attempts: user.failed_login_attempts,
            is_locked: user.is_locked(),
            email_verified: user.email_verified,
            account_active: user.account_active,
        })
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct UserStats {
    pub user_id: Uuid,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub last_login: Option<chrono::DateTime<chrono::Utc>>,
    pub session_count: u64,
    pub failed_login_attempts: u32,
    pub is_locked: bool,
    pub email_verified: bool,
    pub account_active: bool,
}