use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation, Algorithm};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: Uuid,           // User ID
    pub session_id: Uuid,    // Session ID
    pub exp: usize,          // Expiration time
    pub iat: usize,          // Issued at
    pub roles: Vec<String>,  // User roles
    pub permissions: Vec<String>, // User permissions
    pub jti: String,         // JWT ID for token revocation
}

#[derive(Debug, Clone)]
pub struct JwtConfig {
    pub secret: String,
    pub algorithm: Algorithm,
    pub access_token_expiry_hours: u64,
    pub refresh_token_expiry_days: u64,
    pub issuer: String,
    pub audience: String,
}

impl Default for JwtConfig {
    fn default() -> Self {
        Self {
            secret: "your-secret-key".to_string(),
            algorithm: Algorithm::HS256,
            access_token_expiry_hours: 1,
            refresh_token_expiry_days: 30,
            issuer: "nia-auth-service".to_string(),
            audience: "nia-app".to_string(),
        }
    }
}

pub struct JwtService {
    config: JwtConfig,
    encoding_key: EncodingKey,
    decoding_key: DecodingKey,
    validation: Validation,
}

impl JwtService {
    pub fn new(config: JwtConfig) -> Self {
        let mut validation = Validation::new(config.algorithm);
        validation.set_issuer(&[&config.issuer]);
        validation.set_audience(&[&config.audience]);
        validation.set_required_spec_claims(&["exp", "iat", "sub", "session_id", "jti"]);
        
        Self {
            encoding_key: EncodingKey::from_secret(config.secret.as_ref()),
            decoding_key: DecodingKey::from_secret(config.secret.as_ref()),
            validation,
            config,
        }
    }
    
    pub fn generate_access_token(
        &self,
        user_id: Uuid,
        session_id: Uuid,
        roles: Vec<String>,
        permissions: Vec<String>,
    ) -> Result<String, Box<dyn std::error::Error>> {
        let now = chrono::Utc::now().timestamp() as usize;
        let exp = now + (self.config.access_token_expiry_hours * 3600) as usize;
        let jti = Uuid::new_v4().to_string();
        
        let claims = Claims {
            sub: user_id,
            session_id,
            exp,
            iat: now,
            roles,
            permissions,
            jti,
        };
        
        let mut header = Header::new(self.config.algorithm);
        header.typ = Some("JWT".to_string());
        header.alg = self.config.algorithm;
        
        let token = encode(&header, &claims, &self.encoding_key)?;
        Ok(token)
    }
    
    pub fn generate_refresh_token(
        &self,
        user_id: Uuid,
        session_id: Uuid,
    ) -> Result<String, Box<dyn std::error::Error>> {
        let now = chrono::Utc::now().timestamp() as usize;
        let exp = now + (self.config.refresh_token_expiry_days * 24 * 3600) as usize;
        let jti = Uuid::new_v4().to_string();
        
        let claims = Claims {
            sub: user_id,
            session_id,
            exp,
            iat: now,
            roles: vec!["refresh".to_string()],
            permissions: vec!["refresh_token".to_string()],
            jti,
        };
        
        let mut header = Header::new(self.config.algorithm);
        header.typ = Some("JWT".to_string());
        header.alg = self.config.algorithm;
        
        let token = encode(&header, &claims, &self.encoding_key)?;
        Ok(token)
    }
    
    pub fn verify_token(&self, token: &str) -> Result<Claims, Box<dyn std::error::Error>> {
        let token_data = decode::<Claims>(token, &self.decoding_key, &self.validation)?;
        Ok(token_data.claims)
    }
    
    pub fn verify_access_token(&self, token: &str) -> Result<Claims, Box<dyn std::error::Error>> {
        let claims = self.verify_token(token)?;
        
        // Check if token is expired
        let now = chrono::Utc::now().timestamp() as usize;
        if claims.exp < now {
            return Err("Token expired".into());
        }
        
        // Check if it's a refresh token being used as access token
        if claims.roles.contains(&"refresh".to_string()) {
            return Err("Invalid token type".into());
        }
        
        Ok(claims)
    }
    
    pub fn verify_refresh_token(&self, token: &str) -> Result<Claims, Box<dyn std::error::Error>> {
        let claims = self.verify_token(token)?;
        
        // Check if token is expired
        let now = chrono::Utc::now().timestamp() as usize;
        if claims.exp < now {
            return Err("Token expired".into());
        }
        
        // Check if it's actually a refresh token
        if !claims.roles.contains(&"refresh".to_string()) {
            return Err("Invalid token type".into());
        }
        
        Ok(claims)
    }
    
    pub fn extract_user_id(&self, token: &str) -> Result<Uuid, Box<dyn std::error::Error>> {
        let claims = self.verify_access_token(token)?;
        Ok(claims.sub)
    }
    
    pub fn extract_session_id(&self, token: &str) -> Result<Uuid, Box<dyn std::error::Error>> {
        let claims = self.verify_access_token(token)?;
        Ok(claims.session_id)
    }
    
    pub fn has_permission(&self, token: &str, permission: &str) -> Result<bool, Box<dyn std::error::Error>> {
        let claims = self.verify_access_token(token)?;
        Ok(claims.permissions.contains(&permission.to_string()))
    }
    
    pub fn has_role(&self, token: &str, role: &str) -> Result<bool, Box<dyn std::error::Error>> {
        let claims = self.verify_access_token(token)?;
        Ok(claims.roles.contains(&role.to_string()))
    }
    
    pub fn get_token_info(&self, token: &str) -> Result<TokenInfo, Box<dyn std::error::Error>> {
        let claims = self.verify_access_token(token)?;
        let now = chrono::Utc::now().timestamp() as usize;
        
        Ok(TokenInfo {
            user_id: claims.sub,
            session_id: claims.session_id,
            roles: claims.roles,
            permissions: claims.permissions,
            expires_at: chrono::DateTime::from_timestamp(claims.exp as i64, 0)
                .unwrap_or_default(),
            issued_at: chrono::DateTime::from_timestamp(claims.iat as i64, 0)
                .unwrap_or_default(),
            time_until_expiry: if claims.exp > now {
                Some((claims.exp - now) as u64)
            } else {
                None
            },
            jti: claims.jti,
        })
    }
}

#[derive(Debug, Clone)]
pub struct TokenInfo {
    pub user_id: Uuid,
    pub session_id: Uuid,
    pub roles: Vec<String>,
    pub permissions: Vec<String>,
    pub expires_at: chrono::DateTime<chrono::Utc>,
    pub issued_at: chrono::DateTime<chrono::Utc>,
    pub time_until_expiry: Option<u64>,
    pub jti: String,
}

// Legacy functions for backward compatibility
pub fn generate_jwt(user_id: Uuid, secret: &str) -> Result<String, Box<dyn std::error::Error>> {
    let config = JwtConfig {
        secret: secret.to_string(),
        ..Default::default()
    };
    let jwt_service = JwtService::new(config);
    jwt_service.generate_access_token(
        user_id,
        Uuid::new_v4(), // Default session ID
        vec!["user".to_string()],
        vec!["read:own_profile".to_string()],
    )
}

pub fn verify_jwt(token: &str, secret: &str) -> Result<Claims, Box<dyn std::error::Error>> {
    let config = JwtConfig {
        secret: secret.to_string(),
        ..Default::default()
    };
    let jwt_service = JwtService::new(config);
    jwt_service.verify_access_token(token)
}
