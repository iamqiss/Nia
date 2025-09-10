use tonic::{Request, Response, Status};
use nia_shared::database::DB;
use crate::models::{User, FollowEdge};
use chrono::Utc;
use uuid::Uuid;

pub mod pb {
    tonic::include_proto!("user_service");
}

pub struct UserServiceImpl {
    pub db: DB,
}

#[tonic::async_trait]
impl pb::user_service_server::UserService for UserServiceImpl {
    async fn ping(&self, request: Request<pb::PingRequest>) -> Result<Response<pb::PingResponse>, Status> {
        let msg = request.into_inner().message;
        Ok(Response::new(pb::PingResponse { message: format!("pong: {}", msg) }))
    }

    async fn create_user(&self, request: Request<pb::CreateUserRequest>) -> Result<Response<pb::UserResponse>, Status> {
        let req = request.into_inner();
        let id = Uuid::new_v4();
        let now = Utc::now();

        // Insert
        let sql = "CREATE users SET id = $id, username = $username, email = $email, display_name = $display_name, bio = $bio, avatar_url = $avatar_url, created_at = $now, updated_at = $now RETURN *";
        let mut res = self.db.query(sql)
            .bind(("id", id.to_string()))
            .bind(("username", req.username))
            .bind(("email", req.email))
            .bind(("display_name", req.display_name))
            .bind(("bio", req.bio))
            .bind(("avatar_url", req.avatar_url))
            .bind(("now", now))
            .await.map_err(internal)?;

        let created: Option<serde_json::Value> = res.take(0).map_err(internal)?;
        let user = json_to_pb_user(created.ok_or_else(|| Status::internal("failed to create user"))?)?;
        Ok(Response::new(pb::UserResponse { user: Some(user) }))
    }

    async fn get_user(&self, request: Request<pb::GetUserRequest>) -> Result<Response<pb::UserResponse>, Status> {
        let req = request.into_inner();
        let (field, value) = match req.by {
            Some(pb::get_user_request::By::Id(v)) => ("id", v),
            Some(pb::get_user_request::By::Username(v)) => ("username", v),
            Some(pb::get_user_request::By::Email(v)) => ("email", v),
            None => return Err(Status::invalid_argument("missing identifier")),
        };

        let sql = format!("SELECT *, string::len(id) as _dummy FROM users WHERE {} = $value LIMIT 1", field);
        let mut res = self.db.query(sql)
            .bind(("value", value))
            .await.map_err(internal)?;
        let row: Option<serde_json::Value> = res.take(0).map_err(internal)?;
        let user = json_to_pb_user(row.ok_or_else(|| Status::not_found("user not found"))?)?;
        Ok(Response::new(pb::UserResponse { user: Some(user) }))
    }

    async fn update_user(&self, request: Request<pb::UpdateUserRequest>) -> Result<Response<pb::UserResponse>, Status> {
        let req = request.into_inner();
        let now = Utc::now();
        let mut sql = String::from("UPDATE users SET updated_at = $now");
        if req.display_name.is_some() { sql.push_str(", display_name = $display_name"); }
        if req.bio.is_some() { sql.push_str(", bio = $bio"); }
        if req.avatar_url.is_some() { sql.push_str(", avatar_url = $avatar_url"); }
        sql.push_str(" WHERE id = $id RETURN *");
        let mut q = self.db.query(sql)
            .bind(("now", now))
            .bind(("id", req.id));
        if let Some(v) = req.display_name { q = q.bind(("display_name", v)); }
        if let Some(v) = req.bio { q = q.bind(("bio", v)); }
        if let Some(v) = req.avatar_url { q = q.bind(("avatar_url", v)); }
        let mut res = q.await.map_err(internal)?;
        let row: Option<serde_json::Value> = res.take(0).map_err(internal)?;
        let user = json_to_pb_user(row.ok_or_else(|| Status::not_found("user not found"))?)?;
        Ok(Response::new(pb::UserResponse { user: Some(user) }))
    }

    async fn delete_user(&self, request: Request<pb::DeleteUserRequest>) -> Result<Response<pb::DeleteUserResponse>, Status> {
        let req = request.into_inner();
        let sql = "DELETE users WHERE id = $id";
        self.db.query(sql).bind(("id", req.id)).await.map_err(internal)?;
        Ok(Response::new(pb::DeleteUserResponse { success: true }))
    }

    async fn search_users(&self, request: Request<pb::SearchUsersRequest>) -> Result<Response<pb::SearchUsersResponse>, Status> {
        let req = request.into_inner();
        let limit = req.page.as_ref().map(|p| p.limit).unwrap_or(50).min(200);
        let cursor = req.page.and_then(|p| if p.cursor.is_empty() { None } else { Some(p.cursor) });
        let query = req.query;
        let sql = "SELECT * FROM users WHERE username ~ $q OR display_name ~ $q OR bio ~ $q ORDER BY username LIMIT $limit";
        let mut res = self.db.query(sql)
            .bind(("q", query))
            .bind(("limit", limit as i64))
            .await.map_err(internal)?;
        let items: Vec<serde_json::Value> = res.take(0).map_err(internal)?;
        let users = items.into_iter().filter_map(|v| json_to_pb_user(v).ok()).collect();
        Ok(Response::new(pb::SearchUsersResponse { users, page: Some(pb::PageInfo { next_cursor: "".into(), has_more: false }) }))
    }

    async fn list_users(&self, request: Request<pb::ListUsersRequest>) -> Result<Response<pb::ListUsersResponse>, Status> {
        let limit = request.into_inner().page.map(|p| p.limit).unwrap_or(50).min(200);
        let sql = "SELECT * FROM users ORDER BY created_at DESC LIMIT $limit";
        let mut res = self.db.query(sql)
            .bind(("limit", limit as i64))
            .await.map_err(internal)?;
        let items: Vec<serde_json::Value> = res.take(0).map_err(internal)?;
        let users = items.into_iter().filter_map(|v| json_to_pb_user(v).ok()).collect();
        Ok(Response::new(pb::ListUsersResponse { users, page: Some(pb::PageInfo { next_cursor: "".into(), has_more: false }) }))
    }

    async fn follow_user(&self, request: Request<pb::FollowUserRequest>) -> Result<Response<pb::FollowUserResponse>, Status> {
        let req = request.into_inner();
        let now = Utc::now();
        let sql = "CREATE follows SET id = rand::uuid(), follower_id = $follower, followee_id = $followee, created_at = $now RETURN id";
        self.db.query(sql)
            .bind(("follower", req.follower_id))
            .bind(("followee", req.followee_id))
            .bind(("now", now))
            .await.map_err(|e| map_unique(e, "already following"))?;
        Ok(Response::new(pb::FollowUserResponse { success: true }))
    }

    async fn unfollow_user(&self, request: Request<pb::UnfollowUserRequest>) -> Result<Response<pb::UnfollowUserResponse>, Status> {
        let req = request.into_inner();
        let sql = "DELETE follows WHERE follower_id = $follower AND followee_id = $followee";
        self.db.query(sql)
            .bind(("follower", req.follower_id))
            .bind(("followee", req.followee_id))
            .await.map_err(internal)?;
        Ok(Response::new(pb::UnfollowUserResponse { success: true }))
    }

    async fn list_followers(&self, request: Request<pb::ListFollowersRequest>) -> Result<Response<pb::ListFollowersResponse>, Status> {
        let req = request.into_inner();
        let limit = req.page.as_ref().map(|p| p.limit).unwrap_or(50).min(200);
        let sql = "SELECT users.* FROM follows JOIN users ON follows.follower_id = users.id WHERE follows.followee_id = $id LIMIT $limit";
        let mut res = self.db.query(sql)
            .bind(("id", req.user_id))
            .bind(("limit", limit as i64))
            .await.map_err(internal)?;
        let items: Vec<serde_json::Value> = res.take(0).map_err(internal)?;
        let users = items.into_iter().filter_map(|v| json_to_pb_user(v).ok()).collect();
        Ok(Response::new(pb::ListFollowersResponse { users, page: Some(pb::PageInfo { next_cursor: "".into(), has_more: false }) }))
    }

    async fn list_following(&self, request: Request<pb::ListFollowingRequest>) -> Result<Response<pb::ListFollowingResponse>, Status> {
        let req = request.into_inner();
        let limit = req.page.as_ref().map(|p| p.limit).unwrap_or(50).min(200);
        let sql = "SELECT users.* FROM follows JOIN users ON follows.followee_id = users.id WHERE follows.follower_id = $id LIMIT $limit";
        let mut res = self.db.query(sql)
            .bind(("id", req.user_id))
            .bind(("limit", limit as i64))
            .await.map_err(internal)?;
        let items: Vec<serde_json::Value> = res.take(0).map_err(internal)?;
        let users = items.into_iter().filter_map(|v| json_to_pb_user(v).ok()).collect();
        Ok(Response::new(pb::ListFollowingResponse { users, page: Some(pb::PageInfo { next_cursor: "".into(), has_more: false }) }))
    }
}

fn internal<E: std::fmt::Display>(e: E) -> Status { Status::internal(e.to_string()) }

fn map_unique<E: std::fmt::Display>(e: E, msg: &str) -> Status {
    let s = e.to_string();
    if s.contains("idx_follows_pair") || s.contains("UNIQUE") { Status::already_exists(msg.into()) } else { Status::internal(s) }
}

fn json_to_pb_user(v: serde_json::Value) -> Result<pb::User, Status> {
    let id = v.get("id").and_then(|x| x.as_str()).ok_or_else(|| Status::internal("missing id"))?.to_string();
    let username = v.get("username").and_then(|x| x.as_str()).unwrap_or_default().to_string();
    let email = v.get("email").and_then(|x| x.as_str()).unwrap_or_default().to_string();
    let display_name = v.get("display_name").and_then(|x| x.as_str()).unwrap_or("").to_string();
    let bio = v.get("bio").and_then(|x| x.as_str()).unwrap_or("").to_string();
    let avatar_url = v.get("avatar_url").and_then(|x| x.as_str()).unwrap_or("").to_string();
    let created_at = v.get("created_at").and_then(|x| x.as_str()).unwrap_or("0").parse().unwrap_or(0);
    let updated_at = v.get("updated_at").and_then(|x| x.as_str()).unwrap_or("0").parse().unwrap_or(0);
    Ok(pb::User {
        id,
        username,
        email,
        display_name,
        bio,
        avatar_url,
        created_at,
        updated_at,
        followers_count: 0,
        following_count: 0,
    })
}
