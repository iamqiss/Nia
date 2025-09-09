use super::*;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use tokio::time::interval;

#[derive(Debug, Clone)]
pub struct RateLimitConfig {
    pub requests_per_minute: u32,
    pub requests_per_hour: u32,
    pub requests_per_day: u32,
    pub burst_size: u32,
    pub window_size: Duration,
}

impl Default for RateLimitConfig {
    fn default() -> Self {
        Self {
            requests_per_minute: 60,
            requests_per_hour: 1000,
            requests_per_day: 10000,
            burst_size: 10,
            window_size: Duration::from_secs(60),
        }
    }
}

#[derive(Debug, Clone)]
pub struct RateLimitEntry {
    pub count: u32,
    pub window_start: Instant,
    pub last_request: Instant,
}

impl RateLimitEntry {
    pub fn new() -> Self {
        let now = Instant::now();
        Self {
            count: 1,
            window_start: now,
            last_request: now,
        }
    }
    
    pub fn is_expired(&self, window_size: Duration) -> bool {
        self.window_start.elapsed() > window_size
    }
    
    pub fn reset_window(&mut self) {
        let now = Instant::now();
        self.count = 1;
        self.window_start = now;
        self.last_request = now;
    }
    
    pub fn increment(&mut self) {
        self.count += 1;
        self.last_request = Instant::now();
    }
}

#[derive(Debug, Clone)]
pub struct RateLimiter {
    config: RateLimitConfig,
    entries: Arc<Mutex<HashMap<String, RateLimitEntry>>>,
}

impl RateLimiter {
    pub fn new(config: RateLimitConfig) -> Self {
        let limiter = Self {
            config,
            entries: Arc::new(Mutex::new(HashMap::new())),
        };
        
        // Start cleanup task
        limiter.start_cleanup_task();
        limiter
    }
    
    pub fn check_rate_limit(&self, key: &str) -> Result<(), RateLimitError> {
        let mut entries = self.entries.lock().unwrap();
        let now = Instant::now();
        
        // Get or create entry
        let entry = entries.entry(key.to_string()).or_insert_with(RateLimitEntry::new);
        
        // Check if window has expired
        if entry.is_expired(self.config.window_size) {
            entry.reset_window();
            return Ok(());
        }
        
        // Check rate limits
        if entry.count > self.config.requests_per_minute {
            return Err(RateLimitError::TooManyRequests);
        }
        
        // Check burst limit
        if entry.last_request.elapsed() < Duration::from_millis(100) && entry.count > self.config.burst_size {
            return Err(RateLimitError::BurstLimitExceeded);
        }
        
        // Increment counter
        entry.increment();
        
        Ok(())
    }
    
    pub fn get_remaining_requests(&self, key: &str) -> u32 {
        let entries = self.entries.lock().unwrap();
        
        if let Some(entry) = entries.get(key) {
            if entry.is_expired(self.config.window_size) {
                return self.config.requests_per_minute;
            }
            self.config.requests_per_minute.saturating_sub(entry.count)
        } else {
            self.config.requests_per_minute
        }
    }
    
    pub fn reset_rate_limit(&self, key: &str) {
        let mut entries = self.entries.lock().unwrap();
        entries.remove(key);
    }
    
    fn start_cleanup_task(&self) {
        let entries = self.entries.clone();
        let window_size = self.config.window_size;
        
        tokio::spawn(async move {
            let mut interval = interval(Duration::from_secs(60)); // Cleanup every minute
            
            loop {
                interval.tick().await;
                
                let mut entries = entries.lock().unwrap();
                entries.retain(|_, entry| !entry.is_expired(window_size));
            }
        });
    }
}

#[derive(Debug, thiserror::Error)]
pub enum RateLimitError {
    #[error("Too many requests")]
    TooManyRequests,
    
    #[error("Burst limit exceeded")]
    BurstLimitExceeded,
    
    #[error("Rate limit service unavailable")]
    ServiceUnavailable,
}

// Advanced rate limiting strategies
#[derive(Debug, Clone)]
pub struct AdvancedRateLimiter {
    basic_limiter: RateLimiter,
    ip_limiter: RateLimiter,
    user_limiter: RateLimiter,
    endpoint_limiter: RateLimiter,
}

impl AdvancedRateLimiter {
    pub fn new() -> Self {
        Self {
            basic_limiter: RateLimiter::new(RateLimitConfig::default()),
            ip_limiter: RateLimiter::new(RateLimitConfig {
                requests_per_minute: 100,
                requests_per_hour: 2000,
                requests_per_day: 20000,
                burst_size: 20,
                window_size: Duration::from_secs(60),
            }),
            user_limiter: RateLimiter::new(RateLimitConfig {
                requests_per_minute: 200,
                requests_per_hour: 5000,
                requests_per_day: 50000,
                burst_size: 50,
                window_size: Duration::from_secs(60),
            }),
            endpoint_limiter: RateLimiter::new(RateLimitConfig {
                requests_per_minute: 30,
                requests_per_hour: 500,
                requests_per_day: 5000,
                burst_size: 5,
                window_size: Duration::from_secs(60),
            }),
        }
    }
    
    pub fn check_comprehensive_rate_limit(
        &self,
        client_ip: &str,
        user_id: Option<&str>,
        endpoint: &str,
    ) -> Result<(), RateLimitError> {
        // Check basic rate limit
        self.basic_limiter.check_rate_limit("global")?;
        
        // Check IP-based rate limit
        self.ip_limiter.check_rate_limit(client_ip)?;
        
        // Check user-based rate limit (if authenticated)
        if let Some(user_id) = user_id {
            self.user_limiter.check_rate_limit(user_id)?;
        }
        
        // Check endpoint-specific rate limit
        let endpoint_key = format!("{}:{}", endpoint, client_ip);
        self.endpoint_limiter.check_rate_limit(&endpoint_key)?;
        
        Ok(())
    }
    
    pub fn get_rate_limit_info(&self, client_ip: &str, user_id: Option<&str>, endpoint: &str) -> RateLimitInfo {
        RateLimitInfo {
            global_remaining: self.basic_limiter.get_remaining_requests("global"),
            ip_remaining: self.ip_limiter.get_remaining_requests(client_ip),
            user_remaining: user_id.map(|id| self.user_limiter.get_remaining_requests(id)).unwrap_or(0),
            endpoint_remaining: self.endpoint_limiter.get_remaining_requests(&format!("{}:{}", endpoint, client_ip)),
        }
    }
}

#[derive(Debug, Clone)]
pub struct RateLimitInfo {
    pub global_remaining: u32,
    pub ip_remaining: u32,
    pub user_remaining: u32,
    pub endpoint_remaining: u32,
}

// Rate limiting middleware
#[derive(Debug, Clone)]
pub struct RateLimitLayer {
    limiter: AdvancedRateLimiter,
}

impl RateLimitLayer {
    pub fn new() -> Self {
        Self {
            limiter: AdvancedRateLimiter::new(),
        }
    }
}

impl<S> Layer<S> for RateLimitLayer
where
    S: Service<Request<()>, Response = Response<()>, Error = Status> + Send + 'static,
    S::Future: Send + 'static,
{
    type Service = RateLimitService<S>;

    fn layer(&self, service: S) -> Self::Service {
        RateLimitService {
            inner: service,
            limiter: self.limiter.clone(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct RateLimitService<S> {
    inner: S,
    limiter: AdvancedRateLimiter,
}

impl<S> Service<Request<()>> for RateLimitService<S>
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
        let limiter = self.limiter.clone();
        let inner = std::mem::replace(&mut self.inner, unsafe { std::mem::zeroed() });
        
        Box::pin(async move {
            // Extract client information
            let client_ip = request
                .metadata()
                .get("x-forwarded-for")
                .or_else(|| request.metadata().get("x-real-ip"))
                .and_then(|v| v.to_str().ok())
                .unwrap_or("unknown")
                .to_string();
            
            let user_id = request
                .metadata()
                .get("user-id")
                .and_then(|v| v.to_str().ok())
                .map(|s| s.to_string());
            
            let endpoint = request.uri().path();
            
            // Check rate limits
            if let Err(e) = limiter.check_comprehensive_rate_limit(&client_ip, user_id.as_deref(), endpoint) {
                warn!("Rate limit exceeded: {} for IP: {}", e, client_ip);
                return Err(Status::resource_exhausted("Rate limit exceeded"));
            }
            
            // Call inner service
            inner.call(request).await
        })
    }
}