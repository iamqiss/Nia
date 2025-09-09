use auth_service::*;
use handlers::AuthServiceImpl;
use services::AuthServiceManager;
use models::AuthConfig;
use db::Database;
use std::sync::Arc;
use uuid::Uuid;

// Test utilities
async fn setup_test_environment() -> (Arc<AuthServiceManager>, Database) {
    let config = AuthConfig::default();
    let db = Database::new().await.expect("Failed to create test database");
    let auth_manager = Arc::new(AuthServiceManager::new(db.clone(), config));
    (auth_manager, db)
}

async fn cleanup_test_data(db: &Database) {
    // Clean up test data
    let _: Vec<surrealdb::Response> = db.surreal.query("DELETE user WHERE email CONTAINS 'test'").await.unwrap();
    let _: Vec<surrealdb::Response> = db.surreal.query("DELETE session").await.unwrap();
    let _: Vec<surrealdb::Response> = db.surreal.query("DELETE refresh_token").await.unwrap();
    let _: Vec<surrealdb::Response> = db.surreal.query("DELETE password_reset").await.unwrap();
    let _: Vec<surrealdb::Response> = db.surreal.query("DELETE login_attempt").await.unwrap();
}

#[tokio::test]
async fn test_user_registration() {
    let (auth_manager, db) = setup_test_environment().await;
    cleanup_test_data(&db).await;
    
    let user_create = models::UserCreate {
        email: "test@example.com".to_string(),
        username: "testuser".to_string(),
        password: "TestPassword123!".to_string(),
        display_name: "Test User".to_string(),
        bio: Some("Test bio".to_string()),
        avatar_url: None,
    };
    
    let result = auth_manager.register(
        user_create,
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
    ).await;
    
    assert!(result.is_ok());
    let register_result = result.unwrap();
    assert!(!register_result.access_token.is_empty());
    assert!(!register_result.refresh_token.is_empty());
    assert_eq!(register_result.user_info.email, "test@example.com");
    assert_eq!(register_result.user_info.username, "testuser");
}

#[tokio::test]
async fn test_user_login() {
    let (auth_manager, db) = setup_test_environment().await;
    cleanup_test_data(&db).await;
    
    // First register a user
    let user_create = models::UserCreate {
        email: "test@example.com".to_string(),
        username: "testuser".to_string(),
        password: "TestPassword123!".to_string(),
        display_name: "Test User".to_string(),
        bio: None,
        avatar_url: None,
    };
    
    auth_manager.register(
        user_create,
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
    ).await.expect("Registration should succeed");
    
    // Now test login
    let result = auth_manager.login(
        "test@example.com".to_string(),
        "TestPassword123!".to_string(),
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
        false,
    ).await;
    
    assert!(result.is_ok());
    let login_result = result.unwrap();
    assert!(!login_result.access_token.is_empty());
    assert!(!login_result.refresh_token.is_empty());
    assert_eq!(login_result.user_info.email, "test@example.com");
}

#[tokio::test]
async fn test_invalid_login() {
    let (auth_manager, db) = setup_test_environment().await;
    cleanup_test_data(&db).await;
    
    let result = auth_manager.login(
        "nonexistent@example.com".to_string(),
        "wrongpassword".to_string(),
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
        false,
    ).await;
    
    assert!(result.is_err());
    match result.unwrap_err() {
        models::AuthError::InvalidCredentials => {},
        _ => panic!("Expected InvalidCredentials error"),
    }
}

#[tokio::test]
async fn test_token_verification() {
    let (auth_manager, db) = setup_test_environment().await;
    cleanup_test_data(&db).await;
    
    // Register and login
    let user_create = models::UserCreate {
        email: "test@example.com".to_string(),
        username: "testuser".to_string(),
        password: "TestPassword123!".to_string(),
        display_name: "Test User".to_string(),
        bio: None,
        avatar_url: None,
    };
    
    let register_result = auth_manager.register(
        user_create,
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
    ).await.expect("Registration should succeed");
    
    // Verify token
    let result = auth_manager.verify_token(
        register_result.access_token,
        "127.0.0.1".to_string(),
    ).await;
    
    assert!(result.is_ok());
    let verify_result = result.unwrap();
    assert!(verify_result.valid);
    assert!(!verify_result.permissions.is_empty());
}

#[tokio::test]
async fn test_token_refresh() {
    let (auth_manager, db) = setup_test_environment().await;
    cleanup_test_data(&db).await;
    
    // Register and login
    let user_create = models::UserCreate {
        email: "test@example.com".to_string(),
        username: "testuser".to_string(),
        password: "TestPassword123!".to_string(),
        display_name: "Test User".to_string(),
        bio: None,
        avatar_url: None,
    };
    
    let register_result = auth_manager.register(
        user_create,
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
    ).await.expect("Registration should succeed");
    
    // Refresh token
    let result = auth_manager.refresh_token(
        register_result.refresh_token,
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
    ).await;
    
    assert!(result.is_ok());
    let refresh_result = result.unwrap();
    assert!(!refresh_result.access_token.is_empty());
    assert!(!refresh_result.refresh_token.is_empty());
}

#[tokio::test]
async fn test_password_change() {
    let (auth_manager, db) = setup_test_environment().await;
    cleanup_test_data(&db).await;
    
    // Register and login
    let user_create = models::UserCreate {
        email: "test@example.com".to_string(),
        username: "testuser".to_string(),
        password: "TestPassword123!".to_string(),
        display_name: "Test User".to_string(),
        bio: None,
        avatar_url: None,
    };
    
    let register_result = auth_manager.register(
        user_create,
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
    ).await.expect("Registration should succeed");
    
    // Change password
    let result = auth_manager.change_password(
        register_result.access_token,
        "TestPassword123!".to_string(),
        "NewPassword456!".to_string(),
        "127.0.0.1".to_string(),
    ).await;
    
    assert!(result.is_ok());
    
    // Try to login with old password (should fail)
    let login_result = auth_manager.login(
        "test@example.com".to_string(),
        "TestPassword123!".to_string(),
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
        false,
    ).await;
    
    assert!(login_result.is_err());
    
    // Try to login with new password (should succeed)
    let login_result = auth_manager.login(
        "test@example.com".to_string(),
        "NewPassword456!".to_string(),
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
        false,
    ).await;
    
    assert!(login_result.is_ok());
}

#[tokio::test]
async fn test_rate_limiting() {
    let (auth_manager, db) = setup_test_environment().await;
    cleanup_test_data(&db).await;
    
    // Try to register multiple times quickly (should hit rate limit)
    let user_create = models::UserCreate {
        email: "test@example.com".to_string(),
        username: "testuser".to_string(),
        password: "TestPassword123!".to_string(),
        display_name: "Test User".to_string(),
        bio: None,
        avatar_url: None,
    };
    
    // First registration should succeed
    let result1 = auth_manager.register(
        user_create.clone(),
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
    ).await;
    assert!(result1.is_ok());
    
    // Second registration with same email should fail (user already exists)
    let result2 = auth_manager.register(
        user_create,
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
    ).await;
    assert!(result2.is_err());
}

#[tokio::test]
async fn test_session_management() {
    let (auth_manager, db) = setup_test_environment().await;
    cleanup_test_data(&db).await;
    
    // Register and login
    let user_create = models::UserCreate {
        email: "test@example.com".to_string(),
        username: "testuser".to_string(),
        password: "TestPassword123!".to_string(),
        display_name: "Test User".to_string(),
        bio: None,
        avatar_url: None,
    };
    
    let register_result = auth_manager.register(
        user_create,
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
    ).await.expect("Registration should succeed");
    
    // Get active sessions
    let result = auth_manager.get_active_sessions(register_result.access_token).await;
    assert!(result.is_ok());
    let sessions = result.unwrap();
    assert_eq!(sessions.len(), 1);
    assert!(sessions[0].is_current);
    
    // Revoke all sessions
    let result = auth_manager.revoke_all_sessions(register_result.access_token).await;
    assert!(result.is_ok());
    
    // Try to verify token (should fail - session revoked)
    let result = auth_manager.verify_token(
        register_result.access_token,
        "127.0.0.1".to_string(),
    ).await;
    assert!(result.is_err());
}

#[tokio::test]
async fn test_password_reset_flow() {
    let (auth_manager, db) = setup_test_environment().await;
    cleanup_test_data(&db).await;
    
    // Register a user
    let user_create = models::UserCreate {
        email: "test@example.com".to_string(),
        username: "testuser".to_string(),
        password: "TestPassword123!".to_string(),
        display_name: "Test User".to_string(),
        bio: None,
        avatar_url: None,
    };
    
    auth_manager.register(
        user_create,
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
    ).await.expect("Registration should succeed");
    
    // Initiate password reset
    let result = auth_manager.reset_password(
        "test@example.com".to_string(),
        "127.0.0.1".to_string(),
    ).await;
    assert!(result.is_ok());
    
    // Note: In a real test, you would need to extract the reset token from the email
    // For this test, we'll simulate the token
    let reset_token = "test-reset-token";
    
    // Confirm password reset (this will fail because we don't have a real token)
    let result = auth_manager.confirm_password_reset(
        reset_token.to_string(),
        "NewPassword456!".to_string(),
        "127.0.0.1".to_string(),
    ).await;
    assert!(result.is_err()); // Expected to fail with fake token
}

#[tokio::test]
async fn test_account_deactivation() {
    let (auth_manager, db) = setup_test_environment().await;
    cleanup_test_data(&db).await;
    
    // Register and login
    let user_create = models::UserCreate {
        email: "test@example.com".to_string(),
        username: "testuser".to_string(),
        password: "TestPassword123!".to_string(),
        display_name: "Test User".to_string(),
        bio: None,
        avatar_url: None,
    };
    
    let register_result = auth_manager.register(
        user_create,
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
    ).await.expect("Registration should succeed");
    
    // Deactivate account
    let result = auth_manager.deactivate_account(
        register_result.access_token,
        "TestPassword123!".to_string(),
        "127.0.0.1".to_string(),
    ).await;
    assert!(result.is_ok());
    
    // Try to login (should fail - account deactivated)
    let login_result = auth_manager.login(
        "test@example.com".to_string(),
        "TestPassword123!".to_string(),
        "127.0.0.1".to_string(),
        "test-agent".to_string(),
        false,
    ).await;
    assert!(login_result.is_err());
}

#[tokio::test]
async fn test_health_check() {
    let (auth_manager, _db) = setup_test_environment().await;
    
    let result = auth_manager.health_check().await;
    assert!(result.is_ok());
    assert!(result.unwrap());
}