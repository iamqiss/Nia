use anyhow::{Result, anyhow};
use uuid::Uuid;
use crate::db::UserRepository;
use crate::models::User;

pub struct UserService {
    pub(crate) repo: UserRepository,
}

impl UserService {
    pub fn new(repo: UserRepository) -> Self { Self { repo } }

    pub async fn create_user(&self, username: &str, email: &str, display_name: &str, bio: Option<&str>, avatar_url: Option<&str>) -> Result<User> {
        validate_username(username)?;
        validate_email(email)?;
        if display_name.trim().is_empty() { return Err(anyhow!("display_name required")); }
        if !self.repo.check_username_available(username).await? { return Err(anyhow!("username taken")); }
        if !self.repo.check_email_available(email).await? { return Err(anyhow!("email taken")); }
        self.repo.create_user(username, email, display_name, bio, avatar_url).await
    }

    pub async fn get_user_by_id(&self, id: Uuid) -> Result<Option<User>> {
        self.repo.get_user_by_id(id).await
    }

    pub async fn get_user_by_username(&self, username: &str) -> Result<Option<User>> {
        self.repo.get_user_by_username(username).await
    }

    pub async fn update_profile(&self, user_id: Uuid, display_name: Option<&str>, bio: Option<&str>, avatar_url: Option<&str>) -> Result<()> {
        if let Some(dn) = display_name { if dn.trim().is_empty() { return Err(anyhow!("display_name cannot be empty")); } }
        self.repo.update_profile(user_id, display_name, bio, avatar_url).await
    }

    pub async fn update_settings(&self, user_id: Uuid, is_private: Option<bool>, locale: Option<&str>, timezone: Option<&str>) -> Result<()> {
        self.repo.update_settings(user_id, is_private, locale, timezone).await
    }

    pub async fn follow(&self, follower_id: Uuid, followee_id: Uuid) -> Result<()> { self.repo.follow(follower_id, followee_id).await }
    pub async fn unfollow(&self, follower_id: Uuid, followee_id: Uuid) -> Result<()> { self.repo.unfollow(follower_id, followee_id).await }
    pub async fn block(&self, blocker_id: Uuid, blockee_id: Uuid) -> Result<()> { self.repo.block(blocker_id, blockee_id).await }
    pub async fn unblock(&self, blocker_id: Uuid, blockee_id: Uuid) -> Result<()> { self.repo.unblock(blocker_id, blockee_id).await }
    pub async fn mute(&self, muter_id: Uuid, mutee_id: Uuid) -> Result<()> { self.repo.mute(muter_id, mutee_id).await }
    pub async fn unmute(&self, muter_id: Uuid, mutee_id: Uuid) -> Result<()> { self.repo.unmute(muter_id, mutee_id).await }

    pub async fn get_followers(&self, user_id: Uuid, cursor: Option<String>, limit: u32) -> Result<(Vec<User>, Option<String>)> {
        self.repo.get_followers(user_id, cursor, limit).await
    }
    pub async fn get_following(&self, user_id: Uuid, cursor: Option<String>, limit: u32) -> Result<(Vec<User>, Option<String>)> {
        self.repo.get_following(user_id, cursor, limit).await
    }
    pub async fn search_users(&self, query: &str, limit: u32) -> Result<Vec<User>> { self.repo.search_users(query, limit).await }

    pub async fn is_username_available(&self, username: &str) -> Result<bool> {
        self.repo.check_username_available(username).await
    }

    pub async fn is_email_available(&self, email: &str) -> Result<bool> {
        self.repo.check_email_available(email).await
    }
}

fn validate_username(username: &str) -> Result<()> {
    let is_valid = username.len() >= 3 && username.len() <= 32 && username.chars().all(|c| c.is_ascii_alphanumeric() || c == '_' || c == '.');
    if !is_valid { return Err(anyhow!("invalid username")); }
    Ok(())
}

fn validate_email(email: &str) -> Result<()> {
    if !email.contains('@') { return Err(anyhow!("invalid email")); }
    Ok(())
}
// Business logic layer
// Put your core business logic here
