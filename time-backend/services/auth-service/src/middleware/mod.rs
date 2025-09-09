use tonic::{Request, Response, Status};
use tower::{Layer, Service};
use std::task::{Context, Poll};
use std::future::Future;
use std::pin::Pin;
use std::time::{Duration, Instant};
use tracing::{info, warn, error};
use serde::{Deserialize, Serialize};

pub mod rate_limit;
pub mod security_headers;
pub mod request_validation;
pub mod logging;

pub use rate_limit::*;
pub use security_headers::*;
pub use request_validation::*;
pub use logging::*;

// Security middleware trait
pub trait SecurityMiddleware {
    fn apply<T>(&self, service: T) -> impl Service<Request<()>, Response = Response<()>, Error = Status>
    where
        T: Service<Request<()>, Response = Response<()>, Error = Status> + Send + 'static,
        T::Future: Send + 'static;
}

// Request context for security middleware
#[derive(Debug, Clone)]
pub struct SecurityContext {
    pub client_ip: String,
    pub user_agent: String,
    pub request_id: String,
    pub timestamp: Instant,
    pub user_id: Option<String>,
    pub session_id: Option<String>,
}

impl SecurityContext {
    pub fn new(client_ip: String, user_agent: String) -> Self {
        Self {
            client_ip,
            user_agent,
            request_id: uuid::Uuid::new_v4().to_string(),
            timestamp: Instant::now(),
            user_id: None,
            session_id: None,
        }
    }
    
    pub fn with_user(mut self, user_id: String, session_id: String) -> Self {
        self.user_id = Some(user_id);
        self.session_id = Some(session_id);
        self
    }
}

// Security metrics
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityMetrics {
    pub total_requests: u64,
    pub blocked_requests: u64,
    pub rate_limited_requests: u64,
    pub suspicious_requests: u64,
    pub average_response_time: Duration,
    pub last_updated: Instant,
}

impl Default for SecurityMetrics {
    fn default() -> Self {
        Self {
            total_requests: 0,
            blocked_requests: 0,
            rate_limited_requests: 0,
            suspicious_requests: 0,
            average_response_time: Duration::from_millis(0),
            last_updated: Instant::now(),
        }
    }
}

// Security configuration
#[derive(Debug, Clone)]
pub struct SecurityConfig {
    pub enable_rate_limiting: bool,
    pub enable_security_headers: bool,
    pub enable_request_validation: bool,
    pub enable_logging: bool,
    pub max_request_size: usize,
    pub max_response_time: Duration,
    pub suspicious_patterns: Vec<String>,
    pub blocked_ips: Vec<String>,
    pub allowed_origins: Vec<String>,
}

impl Default for SecurityConfig {
    fn default() -> Self {
        Self {
            enable_rate_limiting: true,
            enable_security_headers: true,
            enable_request_validation: true,
            enable_logging: true,
            max_request_size: 1024 * 1024, // 1MB
            max_response_time: Duration::from_secs(30),
            suspicious_patterns: vec![
                "sql".to_string(),
                "script".to_string(),
                "javascript".to_string(),
                "eval".to_string(),
                "exec".to_string(),
            ],
            blocked_ips: vec![],
            allowed_origins: vec!["*".to_string()],
        }
    }
}

// Security manager
#[derive(Debug, Clone)]
pub struct SecurityManager {
    config: SecurityConfig,
    metrics: std::sync::Arc<std::sync::Mutex<SecurityMetrics>>,
}

impl SecurityManager {
    pub fn new(config: SecurityConfig) -> Self {
        Self {
            config,
            metrics: std::sync::Arc::new(std::sync::Mutex::new(SecurityMetrics::default())),
        }
    }
    
    pub fn update_metrics(&self, context: &SecurityContext, blocked: bool, rate_limited: bool, suspicious: bool) {
        if let Ok(mut metrics) = self.metrics.lock() {
            metrics.total_requests += 1;
            if blocked {
                metrics.blocked_requests += 1;
            }
            if rate_limited {
                metrics.rate_limited_requests += 1;
            }
            if suspicious {
                metrics.suspicious_requests += 1;
            }
            
            let response_time = context.timestamp.elapsed();
            metrics.average_response_time = Duration::from_millis(
                (metrics.average_response_time.as_millis() + response_time.as_millis()) / 2
            );
            metrics.last_updated = Instant::now();
        }
    }
    
    pub fn get_metrics(&self) -> SecurityMetrics {
        self.metrics.lock().unwrap().clone()
    }
    
    pub fn is_ip_blocked(&self, ip: &str) -> bool {
        self.config.blocked_ips.contains(&ip.to_string())
    }
    
    pub fn is_suspicious_request(&self, request: &str) -> bool {
        self.config.suspicious_patterns.iter().any(|pattern| {
            request.to_lowercase().contains(pattern)
        })
    }
    
    pub fn validate_origin(&self, origin: &str) -> bool {
        self.config.allowed_origins.contains(&"*".to_string()) ||
        self.config.allowed_origins.contains(&origin.to_string())
    }
}

// Security middleware layer
#[derive(Debug, Clone)]
pub struct SecurityLayer {
    manager: SecurityManager,
}

impl SecurityLayer {
    pub fn new(config: SecurityConfig) -> Self {
        Self {
            manager: SecurityManager::new(config),
        }
    }
}

impl<S> Layer<S> for SecurityLayer
where
    S: Service<Request<()>, Response = Response<()>, Error = Status> + Send + 'static,
    S::Future: Send + 'static,
{
    type Service = SecurityService<S>;

    fn layer(&self, service: S) -> Self::Service {
        SecurityService {
            inner: service,
            manager: self.manager.clone(),
        }
    }
}

// Security service
#[derive(Debug, Clone)]
pub struct SecurityService<S> {
    inner: S,
    manager: SecurityManager,
}

impl<S> Service<Request<()>> for SecurityService<S>
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
        let manager = self.manager.clone();
        let inner = std::mem::replace(&mut self.inner, unsafe { std::mem::zeroed() });
        
        Box::pin(async move {
            // Extract security context from request
            let client_ip = request
                .metadata()
                .get("x-forwarded-for")
                .or_else(|| request.metadata().get("x-real-ip"))
                .and_then(|v| v.to_str().ok())
                .unwrap_or("unknown")
                .to_string();
                
            let user_agent = request
                .metadata()
                .get("user-agent")
                .and_then(|v| v.to_str().ok())
                .unwrap_or("unknown")
                .to_string();
            
            let context = SecurityContext::new(client_ip, user_agent);
            
            // Apply security checks
            if manager.is_ip_blocked(&context.client_ip) {
                warn!("Blocked request from blocked IP: {}", context.client_ip);
                manager.update_metrics(&context, true, false, false);
                return Err(Status::permission_denied("IP address blocked"));
            }
            
            // Check for suspicious patterns
            let request_str = format!("{:?}", request);
            if manager.is_suspicious_request(&request_str) {
                warn!("Suspicious request detected: {}", context.request_id);
                manager.update_metrics(&context, false, false, true);
                // Don't block, but log for monitoring
            }
            
            // Call inner service
            let response = inner.call(request).await;
            
            // Update metrics
            manager.update_metrics(&context, false, false, false);
            
            response
        })
    }
}