use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,  // User ID
    pub exp: usize, // Expiration time
    pub iat: usize, // Issued at
}

pub fn generate_jwt(user_id: Uuid, secret: &str) -> Result<String, Box<dyn std::error::Error>> {
    let now = chrono::Utc::now().timestamp() as usize;
    let claims = Claims {
        sub: user_id,
        exp: now + 86400, // 24 hours
        iat: now,
    };
    
    let token = encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_ref()))?;
    Ok(token)
}

pub fn verify_jwt(token: &str, secret: &str) -> Result<Claims, Box<dyn std::error::Error>> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::default(),
    )?;
    Ok(token_data.claims)
}
