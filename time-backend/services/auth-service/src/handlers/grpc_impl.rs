use super::*;
use tonic::async_trait;

#[async_trait]
impl AuthService for AuthServiceImpl {
    async fn register(&self, request: Request<RegisterRequest>) -> Result<Response<RegisterResponse>, Status> {
        let req = request.into_inner();
        
        info!("Register request for email: {}", req.email);
        
        let user_create = UserCreate {
            email: req.email,
            username: req.username,
            password: req.password,
            display_name: req.display_name,
            bio: req.bio,
            avatar_url: req.avatar_url,
        };
        
        match self.auth_manager.register(user_create, req.client_ip, req.user_agent).await {
            Ok(result) => {
                let response = RegisterResponse {
                    success: true,
                    user_id: Some(result.user_id.to_string()),
                    access_token: Some(result.access_token),
                    refresh_token: Some(result.refresh_token),
                    error_message: None,
                    expires_at: Some(prost_types::Timestamp {
                        seconds: result.expires_at.timestamp(),
                        nanos: result.expires_at.timestamp_subsec_nanos() as i32,
                    }),
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Registration failed: {}", e);
                let response = RegisterResponse {
                    success: false,
                    user_id: None,
                    access_token: None,
                    refresh_token: None,
                    error_message: Some(e.to_string()),
                    expires_at: None,
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn login(&self, request: Request<LoginRequest>) -> Result<Response<LoginResponse>, Status> {
        let req = request.into_inner();
        
        info!("Login request for identifier: {}", req.identifier);
        
        match self.auth_manager.login(
            req.identifier,
            req.password,
            req.client_ip,
            req.user_agent,
            req.remember_me,
        ).await {
            Ok(result) => {
                let user_info = Some(UserInfo {
                    user_id: result.user_info.user_id,
                    username: result.user_info.username,
                    email: result.user_info.email,
                    display_name: result.user_info.display_name,
                    bio: result.user_info.bio,
                    avatar_url: result.user_info.avatar_url,
                    created_at: Some(prost_types::Timestamp {
                        seconds: result.user_info.created_at.timestamp(),
                        nanos: result.user_info.created_at.timestamp_subsec_nanos() as i32,
                    }),
                    updated_at: Some(prost_types::Timestamp {
                        seconds: result.user_info.updated_at.timestamp(),
                        nanos: result.user_info.updated_at.timestamp_subsec_nanos() as i32,
                    }),
                    email_verified: result.user_info.email_verified,
                    account_active: result.user_info.account_active,
                    roles: result.user_info.roles,
                });
                
                let response = LoginResponse {
                    success: true,
                    user_id: Some(result.user_id.to_string()),
                    access_token: Some(result.access_token),
                    refresh_token: Some(result.refresh_token),
                    error_message: None,
                    expires_at: Some(prost_types::Timestamp {
                        seconds: result.expires_at.timestamp(),
                        nanos: result.expires_at.timestamp_subsec_nanos() as i32,
                    }),
                    user_info,
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Login failed: {}", e);
                let response = LoginResponse {
                    success: false,
                    user_id: None,
                    access_token: None,
                    refresh_token: None,
                    error_message: Some(e.to_string()),
                    expires_at: None,
                    user_info: None,
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn logout(&self, request: Request<LogoutRequest>) -> Result<Response<LogoutResponse>, Status> {
        let req = request.into_inner();
        
        match self.auth_manager.logout(req.access_token, req.refresh_token, req.client_ip).await {
            Ok(_) => {
                let response = LogoutResponse {
                    success: true,
                    error_message: None,
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Logout failed: {}", e);
                let response = LogoutResponse {
                    success: false,
                    error_message: Some(e.to_string()),
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn refresh_token(&self, request: Request<RefreshTokenRequest>) -> Result<Response<RefreshTokenResponse>, Status> {
        let req = request.into_inner();
        
        match self.auth_manager.refresh_token(req.refresh_token, req.client_ip, req.user_agent).await {
            Ok(result) => {
                let response = RefreshTokenResponse {
                    success: true,
                    access_token: Some(result.access_token),
                    refresh_token: Some(result.refresh_token),
                    error_message: None,
                    expires_at: Some(prost_types::Timestamp {
                        seconds: result.expires_at.timestamp(),
                        nanos: result.expires_at.timestamp_subsec_nanos() as i32,
                    }),
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Token refresh failed: {}", e);
                let response = RefreshTokenResponse {
                    success: false,
                    access_token: None,
                    refresh_token: None,
                    error_message: Some(e.to_string()),
                    expires_at: None,
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn verify_token(&self, request: Request<VerifyTokenRequest>) -> Result<Response<VerifyTokenResponse>, Status> {
        let req = request.into_inner();
        
        match self.auth_manager.verify_token(req.token, req.client_ip).await {
            Ok(result) => {
                let response = VerifyTokenResponse {
                    valid: result.valid,
                    user_id: Some(result.user_id.to_string()),
                    error_message: None,
                    expires_at: Some(prost_types::Timestamp {
                        seconds: result.expires_at.timestamp(),
                        nanos: result.expires_at.timestamp_subsec_nanos() as i32,
                    }),
                    permissions: result.permissions,
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Token verification failed: {}", e);
                let response = VerifyTokenResponse {
                    valid: false,
                    user_id: None,
                    error_message: Some(e.to_string()),
                    expires_at: None,
                    permissions: vec![],
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn validate_session(&self, request: Request<ValidateSessionRequest>) -> Result<Response<ValidateSessionResponse>, Status> {
        let req = request.into_inner();
        
        // This would need to be implemented in the auth manager
        // For now, return a placeholder response
        let response = ValidateSessionResponse {
            valid: false,
            user_id: None,
            error_message: Some("Not implemented".to_string()),
            expires_at: None,
        };
        Ok(Response::new(response))
    }
    
    async fn change_password(&self, request: Request<ChangePasswordRequest>) -> Result<Response<ChangePasswordResponse>, Status> {
        let req = request.into_inner();
        
        match self.auth_manager.change_password(req.access_token, req.current_password, req.new_password, req.client_ip).await {
            Ok(_) => {
                let response = ChangePasswordResponse {
                    success: true,
                    error_message: None,
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Password change failed: {}", e);
                let response = ChangePasswordResponse {
                    success: false,
                    error_message: Some(e.to_string()),
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn reset_password(&self, request: Request<ResetPasswordRequest>) -> Result<Response<ResetPasswordResponse>, Status> {
        let req = request.into_inner();
        
        match self.auth_manager.reset_password(req.email, req.client_ip).await {
            Ok(_) => {
                let response = ResetPasswordResponse {
                    success: true,
                    error_message: None,
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Password reset failed: {}", e);
                let response = ResetPasswordResponse {
                    success: false,
                    error_message: Some(e.to_string()),
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn confirm_password_reset(&self, request: Request<ConfirmPasswordResetRequest>) -> Result<Response<ConfirmPasswordResetResponse>, Status> {
        let req = request.into_inner();
        
        match self.auth_manager.confirm_password_reset(req.reset_token, req.new_password, req.client_ip).await {
            Ok(_) => {
                let response = ConfirmPasswordResetResponse {
                    success: true,
                    error_message: None,
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Password reset confirmation failed: {}", e);
                let response = ConfirmPasswordResetResponse {
                    success: false,
                    error_message: Some(e.to_string()),
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn get_active_sessions(&self, request: Request<GetActiveSessionsRequest>) -> Result<Response<GetActiveSessionsResponse>, Status> {
        let req = request.into_inner();
        
        match self.auth_manager.get_active_sessions(req.access_token).await {
            Ok(sessions) => {
                let session_infos: Vec<SessionInfo> = sessions.into_iter().map(|session| SessionInfo {
                    session_id: session.session_id,
                    client_ip: session.client_ip,
                    user_agent: session.user_agent,
                    created_at: Some(prost_types::Timestamp {
                        seconds: session.created_at.timestamp(),
                        nanos: session.created_at.timestamp_subsec_nanos() as i32,
                    }),
                    last_activity: Some(prost_types::Timestamp {
                        seconds: session.last_activity.timestamp(),
                        nanos: session.last_activity.timestamp_subsec_nanos() as i32,
                    }),
                    expires_at: Some(prost_types::Timestamp {
                        seconds: session.expires_at.timestamp(),
                        nanos: session.expires_at.timestamp_subsec_nanos() as i32,
                    }),
                    is_current: session.is_current,
                }).collect();
                
                let response = GetActiveSessionsResponse {
                    success: true,
                    sessions: session_infos,
                    error_message: None,
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Get active sessions failed: {}", e);
                let response = GetActiveSessionsResponse {
                    success: false,
                    sessions: vec![],
                    error_message: Some(e.to_string()),
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn revoke_session(&self, request: Request<RevokeSessionRequest>) -> Result<Response<RevokeSessionResponse>, Status> {
        let req = request.into_inner();
        
        match self.auth_manager.revoke_session(req.access_token, req.session_id).await {
            Ok(_) => {
                let response = RevokeSessionResponse {
                    success: true,
                    error_message: None,
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Revoke session failed: {}", e);
                let response = RevokeSessionResponse {
                    success: false,
                    error_message: Some(e.to_string()),
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn revoke_all_sessions(&self, request: Request<RevokeAllSessionsRequest>) -> Result<Response<RevokeAllSessionsResponse>, Status> {
        let req = request.into_inner();
        
        match self.auth_manager.revoke_all_sessions(req.access_token).await {
            Ok(_) => {
                let response = RevokeAllSessionsResponse {
                    success: true,
                    error_message: None,
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Revoke all sessions failed: {}", e);
                let response = RevokeAllSessionsResponse {
                    success: false,
                    error_message: Some(e.to_string()),
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn deactivate_account(&self, request: Request<DeactivateAccountRequest>) -> Result<Response<DeactivateAccountResponse>, Status> {
        let req = request.into_inner();
        
        match self.auth_manager.deactivate_account(req.access_token, req.password, req.client_ip).await {
            Ok(_) => {
                let response = DeactivateAccountResponse {
                    success: true,
                    error_message: None,
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Account deactivation failed: {}", e);
                let response = DeactivateAccountResponse {
                    success: false,
                    error_message: Some(e.to_string()),
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn delete_account(&self, request: Request<DeleteAccountRequest>) -> Result<Response<DeleteAccountResponse>, Status> {
        let req = request.into_inner();
        
        match self.auth_manager.delete_account(req.access_token, req.password, req.client_ip).await {
            Ok(_) => {
                let response = DeleteAccountResponse {
                    success: true,
                    error_message: None,
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Account deletion failed: {}", e);
                let response = DeleteAccountResponse {
                    success: false,
                    error_message: Some(e.to_string()),
                };
                Ok(Response::new(response))
            }
        }
    }
    
    async fn health_check(&self, _request: Request<HealthCheckRequest>) -> Result<Response<HealthCheckResponse>, Status> {
        match self.auth_manager.health_check().await {
            Ok(healthy) => {
                let response = HealthCheckResponse {
                    healthy,
                    version: env!("CARGO_PKG_VERSION").to_string(),
                    timestamp: Some(prost_types::Timestamp {
                        seconds: chrono::Utc::now().timestamp(),
                        nanos: 0,
                    }),
                };
                Ok(Response::new(response))
            }
            Err(e) => {
                error!("Health check failed: {}", e);
                let response = HealthCheckResponse {
                    healthy: false,
                    version: env!("CARGO_PKG_VERSION").to_string(),
                    timestamp: Some(prost_types::Timestamp {
                        seconds: chrono::Utc::now().timestamp(),
                        nanos: 0,
                    }),
                };
                Ok(Response::new(response))
            }
        }
    }
}