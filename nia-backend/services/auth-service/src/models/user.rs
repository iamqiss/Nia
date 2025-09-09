use super::*;
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::{rand_core::OsRng, SaltString};
use validator::Validate;

impl User {
    pub fn new(user_create: UserCreate, config: &AuthConfig) -> Result<Self, AuthError> {
        // Validate password strength
        Self::validate_password(&user_create.password, config)?;
        
        // Hash password
        let password_hash = Self::hash_password(&user_create.password)?;
        
        let now = Utc::now();
        let mut roles = HashSet::new();
        roles.insert("user".to_string());
        
        Ok(User {
            id: Uuid::new_v4(),
            email: user_create.email,
            username: user_create.username,
            password_hash,
            display_name: user_create.display_name,
            bio: user_create.bio,
            avatar_url: user_create.avatar_url,
            email_verified: !config.email_verification_required,
            account_active: config.account_auto_activate,
            roles,
            created_at: now,
            updated_at: now,
            last_login: None,
            failed_login_attempts: 0,
            locked_until: None,
        })
    }
    
    pub fn hash_password(password: &str) -> Result<String, AuthError> {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        
        let password_hash = argon2
            .hash_password(password.as_bytes(), &salt)
            .map_err(|e| AuthError::InternalError)?;
            
        Ok(password_hash.to_string())
    }
    
    pub fn verify_password(&self, password: &str) -> Result<bool, AuthError> {
        let parsed_hash = PasswordHash::new(&self.password_hash)
            .map_err(|_| AuthError::InternalError)?;
            
        let argon2 = Argon2::default();
        Ok(argon2.verify_password(password.as_bytes(), &parsed_hash).is_ok())
    }
    
    pub fn validate_password(password: &str, config: &AuthConfig) -> Result<(), AuthError> {
        if password.len() < config.password_min_length {
            return Err(AuthError::PasswordTooWeak);
        }
        
        if config.password_require_uppercase && !password.chars().any(|c| c.is_uppercase()) {
            return Err(AuthError::PasswordTooWeak);
        }
        
        if config.password_require_lowercase && !password.chars().any(|c| c.is_lowercase()) {
            return Err(AuthError::PasswordTooWeak);
        }
        
        if config.password_require_numbers && !password.chars().any(|c| c.is_numeric()) {
            return Err(AuthError::PasswordTooWeak);
        }
        
        if config.password_require_special_chars && !password.chars().any(|c| "!@#$%^&*()_+-=[]{}|;:,.<>?".contains(c)) {
            return Err(AuthError::PasswordTooWeak);
        }
        
        Ok(())
    }
    
    pub fn is_locked(&self) -> bool {
        if let Some(locked_until) = self.locked_until {
            locked_until > Utc::now()
        } else {
            false
        }
    }
    
    pub fn can_login(&self) -> Result<(), AuthError> {
        if !self.account_active {
            return Err(AuthError::AccountInactive);
        }
        
        if self.is_locked() {
            return Err(AuthError::AccountLocked);
        }
        
        Ok(())
    }
    
    pub fn record_failed_login(&mut self, config: &AuthConfig) {
        self.failed_login_attempts += 1;
        
        if self.failed_login_attempts >= config.max_login_attempts {
            self.locked_until = Some(Utc::now() + chrono::Duration::minutes(config.lockout_duration_minutes as i64));
        }
        
        self.updated_at = Utc::now();
    }
    
    pub fn record_successful_login(&mut self) {
        self.failed_login_attempts = 0;
        self.locked_until = None;
        self.last_login = Some(Utc::now());
        self.updated_at = Utc::now();
    }
    
    pub fn update(&mut self, user_update: UserUpdate) -> Result<(), AuthError> {
        if let Some(display_name) = user_update.display_name {
            self.display_name = display_name;
        }
        
        if let Some(bio) = user_update.bio {
            self.bio = Some(bio);
        }
        
        if let Some(avatar_url) = user_update.avatar_url {
            self.avatar_url = Some(avatar_url);
        }
        
        self.updated_at = Utc::now();
        Ok(())
    }
    
    pub fn change_password(&mut self, current_password: &str, new_password: &str, config: &AuthConfig) -> Result<(), AuthError> {
        // Verify current password
        if !self.verify_password(current_password)? {
            return Err(AuthError::InvalidCredentials);
        }
        
        // Validate new password
        Self::validate_password(new_password, config)?;
        
        // Hash new password
        self.password_hash = Self::hash_password(new_password)?;
        self.updated_at = Utc::now();
        
        Ok(())
    }
    
    pub fn deactivate(&mut self) {
        self.account_active = false;
        self.updated_at = Utc::now();
    }
    
    pub fn activate(&mut self) {
        self.account_active = true;
        self.updated_at = Utc::now();
    }
    
    pub fn verify_email(&mut self) {
        self.email_verified = true;
        self.updated_at = Utc::now();
    }
    
    pub fn add_role(&mut self, role: String) {
        self.roles.insert(role);
        self.updated_at = Utc::now();
    }
    
    pub fn remove_role(&mut self, role: &str) {
        self.roles.remove(role);
        self.updated_at = Utc::now();
    }
    
    pub fn has_role(&self, role: &str) -> bool {
        self.roles.contains(role)
    }
    
    pub fn has_permission(&self, permission: &str) -> bool {
        // This is a simplified permission system
        // In a real system, you'd have a more complex role-permission mapping
        match permission {
            "read:own_profile" => true,
            "write:own_profile" => true,
            "read:posts" => true,
            "write:posts" => self.has_role("user"),
            "moderate:content" => self.has_role("moderator") || self.has_role("admin"),
            "admin:users" => self.has_role("admin"),
            _ => false,
        }
    }
}

impl Validate for UserCreate {
    fn validate(&self) -> Result<(), validator::ValidationErrors> {
        let mut errors = validator::ValidationErrors::new();
        
        // Email validation
        if !validator::validate_email(&self.email) {
            errors.add("email", validator::ValidationError::new("invalid_email"));
        }
        
        // Username validation
        if self.username.len() < 3 || self.username.len() > 30 {
            errors.add("username", validator::ValidationError::new("length"));
        }
        
        if !self.username.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-') {
            errors.add("username", validator::ValidationError::new("invalid_characters"));
        }
        
        // Display name validation
        if self.display_name.trim().is_empty() {
            errors.add("display_name", validator::ValidationError::new("required"));
        }
        
        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }
}