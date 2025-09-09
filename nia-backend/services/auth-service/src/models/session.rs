use super::*;
use rand::Rng;

impl Session {
    pub fn new(user_id: Uuid, client_ip: String, user_agent: String, config: &AuthConfig) -> Self {
        let now = Utc::now();
        let expires_at = now + chrono::Duration::hours(config.session_expiry_hours as i64);
        
        Session {
            id: Uuid::new_v4(),
            user_id,
            client_ip,
            user_agent,
            created_at: now,
            last_activity: now,
            expires_at,
            is_active: true,
        }
    }
    
    pub fn is_expired(&self) -> bool {
        self.expires_at < Utc::now()
    }
    
    pub fn is_valid(&self) -> bool {
        self.is_active && !self.is_expired()
    }
    
    pub fn update_activity(&mut self) {
        self.last_activity = Utc::now();
    }
    
    pub fn extend(&mut self, config: &AuthConfig) {
        let now = Utc::now();
        self.expires_at = now + chrono::Duration::hours(config.session_expiry_hours as i64);
        self.last_activity = now;
    }
    
    pub fn revoke(&mut self) {
        self.is_active = false;
    }
    
    pub fn generate_session_token(&self) -> String {
        // Generate a secure session token
        let mut rng = rand::thread_rng();
        let random_bytes: Vec<u8> = (0..32).map(|_| rng.gen()).collect();
        base64::encode(random_bytes)
    }
    
    pub fn from_session_token(token: &str) -> Result<Uuid, AuthError> {
        // In a real implementation, you'd decode the token to get the session ID
        // For now, we'll assume the token is the base64 encoded session ID
        let decoded = base64::decode(token)
            .map_err(|_| AuthError::InvalidToken)?;
            
        if decoded.len() != 16 {
            return Err(AuthError::InvalidToken);
        }
        
        let mut bytes = [0u8; 16];
        bytes.copy_from_slice(&decoded[..16]);
        
        Ok(Uuid::from_bytes(bytes))
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionCreate {
    pub user_id: Uuid,
    pub client_ip: String,
    pub user_agent: String,
}

impl SessionCreate {
    pub fn new(user_id: Uuid, client_ip: String, user_agent: String) -> Self {
        Self {
            user_id,
            client_ip,
            user_agent,
        }
    }
}