use super::*;
use rand::Rng;
use sha2::{Sha256, Digest};

impl RefreshToken {
    pub fn new(user_id: Uuid, session_id: Uuid, config: &AuthConfig) -> (Self, String) {
        let now = Utc::now();
        let expires_at = now + chrono::Duration::days(config.refresh_token_expiry_days as i64);
        
        // Generate a secure random token
        let mut rng = rand::thread_rng();
        let random_bytes: Vec<u8> = (0..64).map(|_| rng.gen()).collect();
        let token = base64::encode(random_bytes);
        
        // Hash the token for storage
        let mut hasher = Sha256::new();
        hasher.update(token.as_bytes());
        let token_hash = format!("{:x}", hasher.finalize());
        
        let refresh_token = RefreshToken {
            id: Uuid::new_v4(),
            user_id,
            session_id,
            token_hash,
            created_at: now,
            expires_at,
            is_revoked: false,
        };
        
        (refresh_token, token)
    }
    
    pub fn is_expired(&self) -> bool {
        self.expires_at < Utc::now()
    }
    
    pub fn is_valid(&self) -> bool {
        !self.is_revoked && !self.is_expired()
    }
    
    pub fn revoke(&mut self) {
        self.is_revoked = true;
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
pub struct RefreshTokenCreate {
    pub user_id: Uuid,
    pub session_id: Uuid,
}

impl RefreshTokenCreate {
    pub fn new(user_id: Uuid, session_id: Uuid) -> Self {
        Self {
            user_id,
            session_id,
        }
    }
}