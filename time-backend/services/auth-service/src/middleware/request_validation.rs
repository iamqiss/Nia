use super::*;
use serde::{Deserialize, Serialize};
use validator::{Validate, ValidationError};

#[derive(Debug, Clone)]
pub struct RequestValidationConfig {
    pub max_request_size: usize,
    pub allowed_methods: Vec<String>,
    pub required_headers: Vec<String>,
    pub forbidden_patterns: Vec<String>,
    pub max_parameter_count: usize,
    pub max_header_count: usize,
}

impl Default for RequestValidationConfig {
    fn default() -> Self {
        Self {
            max_request_size: 1024 * 1024, // 1MB
            allowed_methods: vec!["POST".to_string(), "GET".to_string()],
            required_headers: vec!["content-type".to_string()],
            forbidden_patterns: vec![
                "<script".to_string(),
                "javascript:".to_string(),
                "data:".to_string(),
                "vbscript:".to_string(),
            ],
            max_parameter_count: 100,
            max_header_count: 50,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Validate)]
pub struct RequestValidationData {
    #[validate(length(max = 1000000))]
    pub body: String,
    
    #[validate(length(max = 50))]
    pub headers: Vec<String>,
    
    #[validate(length(max = 100))]
    pub parameters: Vec<String>,
    
    #[validate(custom = "validate_method")]
    pub method: String,
}

fn validate_method(method: &str) -> Result<(), ValidationError> {
    let allowed_methods = vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"];
    if !allowed_methods.contains(&method.to_uppercase().as_str()) {
        return Err(ValidationError::new("invalid_method"));
    }
    Ok(())
}

#[derive(Debug, Clone)]
pub struct RequestValidationLayer {
    config: RequestValidationConfig,
}

impl RequestValidationLayer {
    pub fn new(config: RequestValidationConfig) -> Self {
        Self { config }
    }
    
    fn validate_request(&self, request: &Request<()>) -> Result<(), ValidationError> {
        // Check request size
        let body_size = request.get_ref().encoded_len();
        if body_size > self.config.max_request_size {
            return Err(ValidationError::new("request_too_large"));
        }
        
        // Check method
        let method = request.uri().scheme_str().unwrap_or("unknown");
        if !self.config.allowed_methods.contains(&method.to_string()) {
            return Err(ValidationError::new("method_not_allowed"));
        }
        
        // Check headers
        let metadata = request.metadata();
        if metadata.len() > self.config.max_header_count {
            return Err(ValidationError::new("too_many_headers"));
        }
        
        // Check for forbidden patterns
        let request_str = format!("{:?}", request);
        for pattern in &self.config.forbidden_patterns {
            if request_str.to_lowercase().contains(pattern) {
                return Err(ValidationError::new("forbidden_pattern"));
            }
        }
        
        // Check required headers
        for required_header in &self.config.required_headers {
            if !metadata.contains_key(required_header) {
                return Err(ValidationError::new("missing_required_header"));
            }
        }
        
        Ok(())
    }
}

#[derive(Debug, thiserror::Error)]
pub enum RequestValidationError {
    #[error("Request too large")]
    RequestTooLarge,
    
    #[error("Method not allowed")]
    MethodNotAllowed,
    
    #[error("Too many headers")]
    TooManyHeaders,
    
    #[error("Forbidden pattern detected")]
    ForbiddenPattern,
    
    #[error("Missing required header")]
    MissingRequiredHeader,
    
    #[error("Invalid request format")]
    InvalidFormat,
}

impl From<ValidationError> for RequestValidationError {
    fn from(err: ValidationError) -> Self {
        match err.code() {
            "request_too_large" => RequestValidationError::RequestTooLarge,
            "method_not_allowed" => RequestValidationError::MethodNotAllowed,
            "too_many_headers" => RequestValidationError::TooManyHeaders,
            "forbidden_pattern" => RequestValidationError::ForbiddenPattern,
            "missing_required_header" => RequestValidationError::MissingRequiredHeader,
            _ => RequestValidationError::InvalidFormat,
        }
    }
}

impl<S> Layer<S> for RequestValidationLayer
where
    S: Service<Request<()>, Response = Response<()>, Error = Status> + Send + 'static,
    S::Future: Send + 'static,
{
    type Service = RequestValidationService<S>;

    fn layer(&self, service: S) -> Self::Service {
        RequestValidationService {
            inner: service,
            config: self.config.clone(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct RequestValidationService<S> {
    inner: S,
    config: RequestValidationConfig,
}

impl<S> Service<Request<()>> for RequestValidationService<S>
where
    S: Service<Request<()>, Response = Response<()>, Error = Status> + Send + 'static,
    S::Future: Send + 'static,
{
    type Response = Response<()>;
    type Error = Status;
    type Future = Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>> + Send>>;

    fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.inner.poll_ready(cx)
    }

    fn call(&mut self, request: Request<()>) -> Self::Future {
        let config = self.config.clone();
        let inner = std::mem::replace(&mut self.inner, unsafe { std::mem::zeroed() });
        
        Box::pin(async move {
            // Validate request
            if let Err(e) = config.validate_request(&request) {
                let validation_error: RequestValidationError = e.into();
                warn!("Request validation failed: {}", validation_error);
                return Err(Status::invalid_argument(validation_error.to_string()));
            }
            
            // Call inner service
            inner.call(request).await
        })
    }
}

// Input sanitization utilities
pub struct InputSanitizer;

impl InputSanitizer {
    pub fn sanitize_string(input: &str) -> String {
        input
            .chars()
            .filter(|c| !c.is_control() || *c == '\n' || *c == '\r' || *c == '\t')
            .collect()
    }
    
    pub fn sanitize_html(input: &str) -> String {
        input
            .replace('<', "&lt;")
            .replace('>', "&gt;")
            .replace('"', "&quot;")
            .replace('\'', "&#x27;")
            .replace('&', "&amp;")
    }
    
    pub fn sanitize_sql(input: &str) -> String {
        // Basic SQL injection prevention
        input
            .replace('\'', "''")
            .replace(';', "")
            .replace("--", "")
            .replace("/*", "")
            .replace("*/", "")
    }
    
    pub fn validate_email(email: &str) -> bool {
        validator::validate_email(email)
    }
    
    pub fn validate_url(url: &str) -> bool {
        validator::validate_url(url)
    }
    
    pub fn validate_username(username: &str) -> bool {
        username.len() >= 3 
            && username.len() <= 30 
            && username.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-')
    }
}