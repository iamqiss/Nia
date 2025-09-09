use super::*;
use tonic::metadata::MetadataMap;

#[derive(Debug, Clone)]
pub struct SecurityHeadersConfig {
    pub enable_cors: bool,
    pub enable_hsts: bool,
    pub enable_csp: bool,
    pub enable_xss_protection: bool,
    pub enable_content_type_options: bool,
    pub enable_frame_options: bool,
    pub allowed_origins: Vec<String>,
    pub csp_policy: String,
}

impl Default for SecurityHeadersConfig {
    fn default() -> Self {
        Self {
            enable_cors: true,
            enable_hsts: true,
            enable_csp: true,
            enable_xss_protection: true,
            enable_content_type_options: true,
            enable_frame_options: true,
            allowed_origins: vec!["*".to_string()],
            csp_policy: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';".to_string(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct SecurityHeadersLayer {
    config: SecurityHeadersConfig,
}

impl SecurityHeadersLayer {
    pub fn new(config: SecurityHeadersConfig) -> Self {
        Self { config }
    }
    
    fn add_security_headers(&self, metadata: &mut MetadataMap) {
        // CORS headers
        if self.config.enable_cors {
            if self.config.allowed_origins.contains(&"*".to_string()) {
                metadata.insert("access-control-allow-origin", "*".parse().unwrap());
            }
            metadata.insert("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS".parse().unwrap());
            metadata.insert("access-control-allow-headers", "Content-Type, Authorization, X-Requested-With".parse().unwrap());
            metadata.insert("access-control-max-age", "86400".parse().unwrap());
        }
        
        // HSTS (HTTP Strict Transport Security)
        if self.config.enable_hsts {
            metadata.insert("strict-transport-security", "max-age=31536000; includeSubDomains".parse().unwrap());
        }
        
        // Content Security Policy
        if self.config.enable_csp {
            metadata.insert("content-security-policy", self.config.csp_policy.parse().unwrap());
        }
        
        // XSS Protection
        if self.config.enable_xss_protection {
            metadata.insert("x-xss-protection", "1; mode=block".parse().unwrap());
        }
        
        // Content Type Options
        if self.config.enable_content_type_options {
            metadata.insert("x-content-type-options", "nosniff".parse().unwrap());
        }
        
        // Frame Options
        if self.config.enable_frame_options {
            metadata.insert("x-frame-options", "DENY".parse().unwrap());
        }
        
        // Additional security headers
        metadata.insert("x-permitted-cross-domain-policies", "none".parse().unwrap());
        metadata.insert("referrer-policy", "strict-origin-when-cross-origin".parse().unwrap());
        metadata.insert("permissions-policy", "geolocation=(), microphone=(), camera=()".parse().unwrap());
    }
}

impl<S> Layer<S> for SecurityHeadersLayer
where
    S: Service<Request<()>, Response = Response<()>, Error = Status> + Send + 'static,
    S::Future: Send + 'static,
{
    type Service = SecurityHeadersService<S>;

    fn layer(&self, service: S) -> Self::Service {
        SecurityHeadersService {
            inner: service,
            config: self.config.clone(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct SecurityHeadersService<S> {
    inner: S,
    config: SecurityHeadersConfig,
}

impl<S> Service<Request<()>> for SecurityHeadersService<S>
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
            let response = inner.call(request).await?;
            
            // Add security headers to response
            let mut response = response;
            let metadata = response.metadata_mut();
            config.add_security_headers(metadata);
            
            Ok(response)
        })
    }
}