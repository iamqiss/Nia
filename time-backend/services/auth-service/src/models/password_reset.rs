use super::*;
use rand::Rng;
use sha2::{Sha256, Digest};

impl PasswordReset {
    pub fn new(user_id: Uuid, config: &AuthConfig) -> (Self, String) {
        let now = Utc::now();
        let expires_at = now + chrono::Duration::hours(config.password_reset_expiry_hours as i64);
        
        // Generate a secure random token
        let mut rng = rand::thread_rng();
        let random_bytes: Vec<u8> = (0..64).map(|_| rng.gen()).collect();
        let token = base64::encode(random_bytes);
        
        // Hash the token for storage
        let mut hasher = Sha256::new();
        hasher.update(token.as_bytes());
        let token_hash = format!("{:x}", hasher.finalize());
        
        let password_reset = PasswordReset {
            id: Uuid::new_v4(),
            user_id,
            token_hash,
            created_at: now,
            expires_at,
            used_at: None,
            is_used: false,
        };
        
        (password_reset, token)
    }
    
    pub fn is_expired(&self) -> bool {
        self.expires_at < Utc::now()
    }
    
    pub fn is_valid(&self) -> bool {
        !self.is_used && !self.is_expired()
    }
    
    pub fn use_token(&mut self) {
        self.is_used = true;
        self.used_at = Some(Utc::now());
    }
    
    pub fn verify_token(&self, token: &str) -> Result<bool, AuthError> {
        let mut hasher = Sha256::new();
        hasher.update(token.as_bytes());
        let token_hash = format!("{:x}", hasher.finalize());
        
        Ok(token_hash == self.token_hash)
    }
    
    pub fn from_token(token: &str) -> Result<String, AuthError> {
        // Hash the provided token to compare with stored hash
        let mut hasher = Sha256::new();
        hasher.update(token.as_bytes());
        Ok(format!("{:x}", hasher.finalize()))
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PasswordResetCreate {
    pub user_id: Uuid,
}

impl PasswordResetCreate {
    pub fn new(user_id: Uuid) -> Self {
        Self { user_id }
    }
}