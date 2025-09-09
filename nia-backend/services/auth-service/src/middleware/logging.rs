use super::*;
use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RequestLog {
    pub request_id: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub method: String,
    pub uri: String,
    pub client_ip: String,
    pub user_agent: String,
    pub user_id: Option<String>,
    pub session_id: Option<String>,
    pub response_status: u16,
    pub response_time_ms: u64,
    pub request_size: usize,
    pub response_size: usize,
    pub error_message: Option<String>,
}

#[derive(Debug, Clone)]
pub struct LoggingConfig {
    pub enable_request_logging: bool,
    pub enable_response_logging: bool,
    pub enable_error_logging: bool,
    pub enable_performance_logging: bool,
    pub log_level: LogLevel,
    pub sensitive_headers: Vec<String>,
    pub max_log_size: usize,
}

#[derive(Debug, Clone, PartialEq)]
pub enum LogLevel {
    Debug,
    Info,
    Warn,
    Error,
}

impl Default for LoggingConfig {
    fn default() -> Self {
        Self {
            enable_request_logging: true,
            enable_response_logging: true,
            enable_error_logging: true,
            enable_performance_logging: true,
            log_level: LogLevel::Info,
            sensitive_headers: vec![
                "authorization".to_string(),
                "cookie".to_string(),
                "x-api-key".to_string(),
                "x-auth-token".to_string(),
            ],
            max_log_size: 1024,
        }
    }
}

#[derive(Debug, Clone)]
pub struct LoggingLayer {
    config: LoggingConfig,
}

impl LoggingLayer {
    pub fn new(config: LoggingConfig) -> Self {
        Self { config }
    }
    
    fn should_log(&self, level: &LogLevel) -> bool {
        match (&self.config.log_level, level) {
            (LogLevel::Debug, _) => true,
            (LogLevel::Info, LogLevel::Info | LogLevel::Warn | LogLevel::Error) => true,
            (LogLevel::Warn, LogLevel::Warn | LogLevel::Error) => true,
            (LogLevel::Error, LogLevel::Error) => true,
            _ => false,
        }
    }
    
    fn sanitize_headers(&self, metadata: &MetadataMap) -> String {
        let mut headers = Vec::new();
        
        for (key, value) in metadata.iter() {
            let key_str = key.as_str();
            let value_str = if self.config.sensitive_headers.contains(&key_str.to_lowercase()) {
                "[REDACTED]"
            } else {
                value.to_str().unwrap_or("[INVALID]")
            };
            
            headers.push(format!("{}: {}", key_str, value_str));
        }
        
        headers.join(", ")
    }
    
    fn log_request(&self, request: &Request<()>, context: &SecurityContext) {
        if !self.config.enable_request_logging || !self.should_log(&LogLevel::Info) {
            return;
        }
        
        let method = request.uri().scheme_str().unwrap_or("unknown");
        let uri = request.uri().to_string();
        let headers = self.sanitize_headers(request.metadata());
        
        info!(
            request_id = %context.request_id,
            method = %method,
            uri = %uri,
            client_ip = %context.client_ip,
            user_agent = %context.user_agent,
            headers = %headers,
            "Incoming request"
        );
    }
    
    fn log_response(&self, response: &Response<()>, context: &SecurityContext, start_time: Instant) {
        if !self.config.enable_response_logging || !self.should_log(&LogLevel::Info) {
            return;
        }
        
        let response_time = start_time.elapsed();
        let status = response.get_ref().status().code() as u16;
        
        info!(
            request_id = %context.request_id,
            status = %status,
            response_time_ms = %response_time.as_millis(),
            "Request completed"
        );
    }
    
    fn log_error(&self, error: &Status, context: &SecurityContext) {
        if !self.config.enable_error_logging || !self.should_log(&LogLevel::Error) {
            return;
        }
        
        error!(
            request_id = %context.request_id,
            error_code = %error.code(),
            error_message = %error.message(),
            "Request failed"
        );
    }
    
    fn log_performance(&self, context: &SecurityContext, start_time: Instant) {
        if !self.config.enable_performance_logging || !self.should_log(&LogLevel::Debug) {
            return;
        }
        
        let response_time = start_time.elapsed();
        
        if response_time > Duration::from_secs(1) {
            warn!(
                request_id = %context.request_id,
                response_time_ms = %response_time.as_millis(),
                "Slow request detected"
            );
        }
    }
}

impl<S> Layer<S> for LoggingLayer
where
    S: Service<Request<()>, Response = Response<()>, Error = Status> + Send + 'static,
    S::Future: Send + 'static,
{
    type Service = LoggingService<S>;

    fn layer(&self, service: S) -> Self::Service {
        LoggingService {
            inner: service,
            config: self.config.clone(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct LoggingService<S> {
    inner: S,
    config: LoggingConfig,
}

impl<S> Service<Request<()>> for LoggingService<S>
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
        let start_time = Instant::now();
        
        // Extract security context
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
        
        Box::pin(async move {
            // Log request
            config.log_request(&request, &context);
            
            // Call inner service
            let result = inner.call(request).await;
            
            // Log response or error
            match &result {
                Ok(response) => {
                    config.log_response(response, &context, start_time);
                }
                Err(error) => {
                    config.log_error(error, &context);
                }
            }
            
            // Log performance metrics
            config.log_performance(&context, start_time);
            
            result
        })
    }
}

// Structured logging utilities
pub struct StructuredLogger;

impl StructuredLogger {
    pub fn log_auth_event(
        event_type: &str,
        user_id: Option<&str>,
        client_ip: &str,
        success: bool,
        details: Option<&str>,
    ) {
        info!(
            event_type = %event_type,
            user_id = %user_id.unwrap_or("anonymous"),
            client_ip = %client_ip,
            success = %success,
            details = %details.unwrap_or(""),
            "Authentication event"
        );
    }
    
    pub fn log_security_event(
        event_type: &str,
        severity: &str,
        client_ip: &str,
        details: &str,
    ) {
        match severity {
            "high" => error!(
                event_type = %event_type,
                severity = %severity,
                client_ip = %client_ip,
                details = %details,
                "Security event"
            ),
            "medium" => warn!(
                event_type = %event_type,
                severity = %severity,
                client_ip = %client_ip,
                details = %details,
                "Security event"
            ),
            _ => info!(
                event_type = %event_type,
                severity = %severity,
                client_ip = %client_ip,
                details = %details,
                "Security event"
            ),
        }
    }
    
    pub fn log_performance_metric(
        metric_name: &str,
        value: f64,
        unit: &str,
        tags: Option<Vec<(String, String)>>,
    ) {
        let tags_str = tags
            .map(|t| t.iter().map(|(k, v)| format!("{}={}", k, v)).collect::<Vec<_>>().join(","))
            .unwrap_or_default();
        
        info!(
            metric_name = %metric_name,
            value = %value,
            unit = %unit,
            tags = %tags_str,
            "Performance metric"
        );
    }
}