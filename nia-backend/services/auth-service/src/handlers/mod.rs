use tonic::{Request, Response, Status};
use crate::services::AuthServiceManager;
use crate::models::{UserCreate, AuthError};
use uuid::Uuid;
use std::sync::Arc;
use tracing::{info, error, warn};

// Import the generated gRPC code
pub mod auth_service {
    tonic::include_proto!("auth_service");
}

pub mod grpc_impl;

use auth_service::{
    auth_service_server::AuthService,
    *,
};

pub struct AuthServiceImpl {
    pub auth_manager: Arc<AuthServiceManager>,
}

impl AuthServiceImpl {
    pub fn new(auth_manager: Arc<AuthServiceManager>) -> Self {
        Self { auth_manager }
    }
}
