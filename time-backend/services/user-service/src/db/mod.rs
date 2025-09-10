use surrealdb::{Surreal, engine::remote::ws::{Ws, Client}};
use anyhow::Result;
use uuid::Uuid;
use chrono::{Utc};
use crate::models::{User, UserSettings, FollowRelation, BlockRelation, MuteRelation};

pub type DB = Surreal<Client>;

pub async fn init_db() -> Result<DB> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;
    db.use_ns("nia").use_db("social").await?;
    Ok(db)
}

pub struct UserRepository {
    pub db: DB,
}

impl UserRepository {
    pub fn new(db: DB) -> Self { Self { db } }

    pub async fn create_user(&self, username: &str, email: &str, display_name: &str, bio: Option<&str>, avatar_url: Option<&str>) -> Result<User> {
        let id = Uuid::new_v4();
        let now = Utc::now();
        let user = User {
            id,
            username: username.to_string(),
            email: email.to_string(),
            display_name: display_name.to_string(),
            bio: bio.map(|s| s.to_string()),
            avatar_url: avatar_url.map(|s| s.to_string()),
            email_verified: false,
            account_active: true,
            created_at: now,
            updated_at: now,
        };
        let _: Option<User> = self.db.create(("user", id.to_string())).content(&user).await?;
        let settings = UserSettings { user_id: id, is_private: false, locale: None, timezone: None, updated_at: now };
        let _settings: Option<UserSettings> = self.db.create(("user_settings", id.to_string())).content(&settings).await?;
        Ok(user)
    }

    pub async fn get_user_by_id(&self, id: Uuid) -> Result<Option<User>> {
        let user: Option<User> = self.db.select(("user", id.to_string())).await?;
        Ok(user)
    }

    pub async fn get_user_by_username(&self, username: &str) -> Result<Option<User>> {
        let sql = "SELECT * FROM user WHERE username = $username LIMIT 1";
        let mut response = self.db.query(sql).bind(("username", username)).await?;
        let user: Option<User> = response.take(0)?;
        Ok(user)
    }

    pub async fn update_profile(&self, user_id: Uuid, display_name: Option<&str>, bio: Option<&str>, avatar_url: Option<&str>) -> Result<()> {
        let mut user = match self.get_user_by_id(user_id).await? { Some(u) => u, None => return Ok(()) };
        if let Some(dn) = display_name { user.display_name = dn.to_string(); }
        if bio.is_some() { user.bio = bio.map(|s| s.to_string()); }
        if avatar_url.is_some() { user.avatar_url = avatar_url.map(|s| s.to_string()); }
        user.updated_at = Utc::now();
        let _: Option<User> = self.db.update(("user", user_id.to_string())).content(&user).await?;
        Ok(())
    }

    pub async fn update_settings(&self, user_id: Uuid, is_private: Option<bool>, locale: Option<&str>, timezone: Option<&str>) -> Result<()> {
        let key = ("user_settings", user_id.to_string());
        let mut settings: Option<UserSettings> = self.db.select(key.clone()).await?;
        let mut settings = settings.unwrap_or(UserSettings { user_id, is_private: false, locale: None, timezone: None, updated_at: Utc::now() });
        if let Some(p) = is_private { settings.is_private = p; }
        if locale.is_some() { settings.locale = locale.map(|s| s.to_string()); }
        if timezone.is_some() { settings.timezone = timezone.map(|s| s.to_string()); }
        settings.updated_at = Utc::now();
        let _: Option<UserSettings> = self.db.update(key).content(&settings).await?;
        Ok(())
    }

    pub async fn check_username_available(&self, username: &str) -> Result<bool> {
        Ok(self.get_user_by_username(username).await?.is_none())
    }

    pub async fn check_email_available(&self, email: &str) -> Result<bool> {
        let sql = "SELECT * FROM user WHERE email = $email LIMIT 1";
        let mut response = self.db.query(sql).bind(("email", email)).await?;
        let user: Option<User> = response.take(0)?;
        Ok(user.is_none())
    }

    pub async fn follow(&self, follower_id: Uuid, followee_id: Uuid) -> Result<()> {
        if follower_id == followee_id { return Ok(()); }
        let relation = FollowRelation { follower_id, followee_id, created_at: Utc::now() };
        let _r: Vec<FollowRelation> = self.db.create("follow").content(&relation).await?;
        Ok(())
    }

    pub async fn unfollow(&self, follower_id: Uuid, followee_id: Uuid) -> Result<()> {
        let sql = "DELETE FROM follow WHERE follower_id = $follower AND followee_id = $followee";
        let _ = self.db.query(sql).bind(("follower", follower_id.to_string())).bind(("followee", followee_id.to_string())).await?;
        Ok(())
    }

    pub async fn block(&self, blocker_id: Uuid, blockee_id: Uuid) -> Result<()> {
        if blocker_id == blockee_id { return Ok(()); }
        let relation = BlockRelation { blocker_id, blockee_id, created_at: Utc::now() };
        let _r: Vec<BlockRelation> = self.db.create("block").content(&relation).await?;
        Ok(())
    }

    pub async fn unblock(&self, blocker_id: Uuid, blockee_id: Uuid) -> Result<()> {
        let sql = "DELETE FROM block WHERE blocker_id = $blocker AND blockee_id = $blockee";
        let _ = self.db.query(sql).bind(("blocker", blocker_id.to_string())).bind(("blockee", blockee_id.to_string())).await?;
        Ok(())
    }

    pub async fn mute(&self, muter_id: Uuid, mutee_id: Uuid) -> Result<()> {
        if muter_id == mutee_id { return Ok(()); }
        let relation = MuteRelation { muter_id, mutee_id, created_at: Utc::now() };
        let _r: Vec<MuteRelation> = self.db.create("mute").content(&relation).await?;
        Ok(())
    }

    pub async fn unmute(&self, muter_id: Uuid, mutee_id: Uuid) -> Result<()> {
        let sql = "DELETE FROM mute WHERE muter_id = $muter AND mutee_id = $mutee";
        let _ = self.db.query(sql).bind(("muter", muter_id.to_string())).bind(("mutee", mutee_id.to_string())).await?;
        Ok(())
    }

    pub async fn get_followers(&self, user_id: Uuid, cursor: Option<String>, limit: u32) -> Result<(Vec<User>, Option<String>)> {
        let limit = limit.max(1).min(100) as usize;
        let sql = "SELECT follower_id FROM follow WHERE followee_id = $uid ORDER BY created_at DESC";
        let mut response = self.db.query(sql).bind(("uid", user_id.to_string())).await?;
        let rows: Vec<FollowRelation> = response.take(0)?;
        let mut users = Vec::new();
        for rel in rows.iter().take(limit) {
            if let Some(u) = self.get_user_by_id(rel.follower_id).await? { users.push(u); }
        }
        let next_cursor = None; // Replace with real cursor impl
        Ok((users, next_cursor))
    }

    pub async fn get_following(&self, user_id: Uuid, cursor: Option<String>, limit: u32) -> Result<(Vec<User>, Option<String>)> {
        let limit = limit.max(1).min(100) as usize;
        let sql = "SELECT followee_id FROM follow WHERE follower_id = $uid ORDER BY created_at DESC";
        let mut response = self.db.query(sql).bind(("uid", user_id.to_string())).await?;
        let rows: Vec<FollowRelation> = response.take(0)?;
        let mut users = Vec::new();
        for rel in rows.iter().take(limit) {
            if let Some(u) = self.get_user_by_id(rel.followee_id).await? { users.push(u); }
        }
        let next_cursor = None; // Replace with real cursor impl
        Ok((users, next_cursor))
    }

    pub async fn search_users(&self, query: &str, limit: u32) -> Result<Vec<User>> {
        let limit = limit.max(1).min(100) as usize;
        let sql = "SELECT * FROM user WHERE string::lower(username) CONTAINS string::lower($q) OR string::lower(display_name) CONTAINS string::lower($q) LIMIT $lim";
        let mut response = self.db.query(sql).bind(("q", query)).bind(("lim", limit)).await?;
        let users: Vec<User> = response.take(0)?;
        Ok(users)
    }
}
