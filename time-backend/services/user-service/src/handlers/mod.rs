use tonic::{Request, Response, Status};
use tonic::async_trait;
use uuid::Uuid;
use crate::services::UserService as DomainUserService;
use crate::models::User as DomainUser;

pub mod pb {
    tonic::include_proto!("user_service");
}

pub use pb::user_service_server::{UserService, UserServiceServer};
use pb::*;

pub fn into_public(u: &DomainUser) -> PublicUser {
    PublicUser {
        id: u.id.to_string(),
        username: u.username.clone(),
        display_name: u.display_name.clone(),
        bio: u.bio.clone(),
        avatar_url: u.avatar_url.clone(),
    }
}

pub fn into_user(u: &DomainUser) -> User {
    User {
        id: u.id.to_string(),
        username: u.username.clone(),
        email: u.email.clone(),
        display_name: u.display_name.clone(),
        bio: u.bio.clone(),
        avatar_url: u.avatar_url.clone(),
        created_at: Some(prost_types::Timestamp { seconds: u.created_at.timestamp(), nanos: u.created_at.timestamp_subsec_nanos() as i32 }),
        updated_at: Some(prost_types::Timestamp { seconds: u.updated_at.timestamp(), nanos: u.updated_at.timestamp_subsec_nanos() as i32 }),
        email_verified: u.email_verified,
        account_active: u.account_active,
    }
}

pub struct GrpcUserService {
    pub service: DomainUserService,
}

#[async_trait]
impl UserService for GrpcUserService {
    async fn health_check(&self, _request: Request<HealthCheckRequest>) -> Result<Response<HealthCheckResponse>, Status> {
        Ok(Response::new(HealthCheckResponse { healthy: true, version: env!("CARGO_PKG_VERSION").to_string(), timestamp: Some(prost_types::Timestamp { seconds: chrono::Utc::now().timestamp(), nanos: 0 }) }))
    }

    async fn create_user(&self, request: Request<CreateUserRequest>) -> Result<Response<CreateUserResponse>, Status> {
        let r = request.into_inner();
        let result = self.service.create_user(&r.username, &r.email, &r.display_name, r.bio.as_deref(), r.avatar_url.as_deref()).await;
        match result {
            Ok(user) => Ok(Response::new(CreateUserResponse { success: true, user_id: Some(user.id.to_string()), error_message: None })),
            Err(e) => Ok(Response::new(CreateUserResponse { success: false, user_id: None, error_message: Some(e.to_string()) })),
        }
    }

    async fn get_user(&self, request: Request<GetUserRequest>) -> Result<Response<GetUserResponse>, Status> {
        let r = request.into_inner();
        let user_opt = match r.lookup {
            Some(get_user_request::Lookup::Id(id)) => {
                let uuid = Uuid::parse_str(&id).map_err(|_| Status::invalid_argument("invalid id"))?;
                self.service.get_user_by_id(uuid).await.map_err(internal_err)?
            }
            Some(get_user_request::Lookup::Username(username)) => self.service.get_user_by_username(&username).await.map_err(internal_err)?,
            None => return Err(Status::invalid_argument("missing lookup")),
        };
        Ok(Response::new(GetUserResponse { user: user_opt.as_ref().map(into_user) }))
    }

    async fn get_users(&self, request: Request<GetUsersRequest>) -> Result<Response<GetUsersResponse>, Status> {
        let ids = request.into_inner().ids;
        let mut users = Vec::new();
        for id in ids {
            if let Ok(uuid) = Uuid::parse_str(&id) {
                if let Ok(Some(u)) = self.service.get_user_by_id(uuid).await { users.push(into_user(&u)); }
            }
        }
        Ok(Response::new(GetUsersResponse { users }))
    }

    async fn update_profile(&self, request: Request<UpdateProfileRequest>) -> Result<Response<UpdateProfileResponse>, Status> {
        let r = request.into_inner();
        let uid = Uuid::parse_str(&r.user_id).map_err(|_| Status::invalid_argument("invalid user_id"))?;
        match self.service.update_profile(uid, r.display_name.as_deref(), r.bio.as_deref(), r.avatar_url.as_deref()).await {
            Ok(_) => Ok(Response::new(UpdateProfileResponse { success: true, error_message: None })),
            Err(e) => Ok(Response::new(UpdateProfileResponse { success: false, error_message: Some(e.to_string()) })),
        }
    }

    async fn update_settings(&self, request: Request<UpdateSettingsRequest>) -> Result<Response<UpdateSettingsResponse>, Status> {
        let r = request.into_inner();
        let uid = Uuid::parse_str(&r.user_id).map_err(|_| Status::invalid_argument("invalid user_id"))?;
        match self.service.update_settings(uid, r.is_private, r.locale.as_deref(), r.timezone.as_deref()).await {
            Ok(_) => Ok(Response::new(UpdateSettingsResponse { success: true, error_message: None })),
            Err(e) => Ok(Response::new(UpdateSettingsResponse { success: false, error_message: Some(e.to_string()) })),
        }
    }

    async fn check_availability(&self, request: Request<CheckAvailabilityRequest>) -> Result<Response<CheckAvailabilityResponse>, Status> {
        let r = request.into_inner();
        let available = match r.query {
            Some(check_availability_request::Query::Username(u)) => self.service.is_username_available(&u).await.map_err(internal_err)?,
            Some(check_availability_request::Query::Email(e)) => self.service.is_email_available(&e).await.map_err(internal_err)?,
            None => return Err(Status::invalid_argument("missing query")),
        };
        Ok(Response::new(CheckAvailabilityResponse { available }))
    }

    async fn follow(&self, request: Request<FollowRequest>) -> Result<Response<FollowResponse>, Status> {
        let r = request.into_inner();
        let follower = Uuid::parse_str(&r.follower_id).map_err(|_| Status::invalid_argument("invalid follower_id"))?;
        let followee = Uuid::parse_str(&r.followee_id).map_err(|_| Status::invalid_argument("invalid followee_id"))?;
        match self.service.follow(follower, followee).await {
            Ok(_) => Ok(Response::new(FollowResponse { success: true, error_message: None })),
            Err(e) => Ok(Response::new(FollowResponse { success: false, error_message: Some(e.to_string()) })),
        }
    }

    async fn unfollow(&self, request: Request<UnfollowRequest>) -> Result<Response<UnfollowResponse>, Status> {
        let r = request.into_inner();
        let follower = Uuid::parse_str(&r.follower_id).map_err(|_| Status::invalid_argument("invalid follower_id"))?;
        let followee = Uuid::parse_str(&r.followee_id).map_err(|_| Status::invalid_argument("invalid followee_id"))?;
        match self.service.unfollow(follower, followee).await {
            Ok(_) => Ok(Response::new(UnfollowResponse { success: true, error_message: None })),
            Err(e) => Ok(Response::new(UnfollowResponse { success: false, error_message: Some(e.to_string()) })),
        }
    }

    async fn get_followers(&self, request: Request<GetFollowersRequest>) -> Result<Response<GetFollowersResponse>, Status> {
        let r = request.into_inner();
        let uid = Uuid::parse_str(&r.user_id).map_err(|_| Status::invalid_argument("invalid user_id"))?;
        let (users, next) = self.service.get_followers(uid, r.cursor, r.limit).await.map_err(internal_err)?;
        Ok(Response::new(GetFollowersResponse { users: users.iter().map(into_public).collect(), next_cursor: next }))
    }

    async fn get_following(&self, request: Request<GetFollowingRequest>) -> Result<Response<GetFollowingResponse>, Status> {
        let r = request.into_inner();
        let uid = Uuid::parse_str(&r.user_id).map_err(|_| Status::invalid_argument("invalid user_id"))?;
        let (users, next) = self.service.get_following(uid, r.cursor, r.limit).await.map_err(internal_err)?;
        Ok(Response::new(GetFollowingResponse { users: users.iter().map(into_public).collect(), next_cursor: next }))
    }

    async fn block(&self, request: Request<BlockRequest>) -> Result<Response<BlockResponse>, Status> {
        let r = request.into_inner();
        let blocker = Uuid::parse_str(&r.blocker_id).map_err(|_| Status::invalid_argument("invalid blocker_id"))?;
        let blockee = Uuid::parse_str(&r.blockee_id).map_err(|_| Status::invalid_argument("invalid blockee_id"))?;
        match self.service.block(blocker, blockee).await {
            Ok(_) => Ok(Response::new(BlockResponse { success: true, error_message: None })),
            Err(e) => Ok(Response::new(BlockResponse { success: false, error_message: Some(e.to_string()) })),
        }
    }

    async fn unblock(&self, request: Request<UnblockRequest>) -> Result<Response<UnblockResponse>, Status> {
        let r = request.into_inner();
        let blocker = Uuid::parse_str(&r.blocker_id).map_err(|_| Status::invalid_argument("invalid blocker_id"))?;
        let blockee = Uuid::parse_str(&r.blockee_id).map_err(|_| Status::invalid_argument("invalid blockee_id"))?;
        match self.service.unblock(blocker, blockee).await {
            Ok(_) => Ok(Response::new(UnblockResponse { success: true, error_message: None })),
            Err(e) => Ok(Response::new(UnblockResponse { success: false, error_message: Some(e.to_string()) })),
        }
    }

    async fn mute(&self, request: Request<MuteRequest>) -> Result<Response<MuteResponse>, Status> {
        let r = request.into_inner();
        let muter = Uuid::parse_str(&r.muter_id).map_err(|_| Status::invalid_argument("invalid muter_id"))?;
        let mutee = Uuid::parse_str(&r.mutee_id).map_err(|_| Status::invalid_argument("invalid mutee_id"))?;
        match self.service.mute(muter, mutee).await {
            Ok(_) => Ok(Response::new(MuteResponse { success: true, error_message: None })),
            Err(e) => Ok(Response::new(MuteResponse { success: false, error_message: Some(e.to_string()) })),
        }
    }

    async fn unmute(&self, request: Request<UnmuteRequest>) -> Result<Response<UnmuteResponse>, Status> {
        let r = request.into_inner();
        let muter = Uuid::parse_str(&r.muter_id).map_err(|_| Status::invalid_argument("invalid muter_id"))?;
        let mutee = Uuid::parse_str(&r.mutee_id).map_err(|_| Status::invalid_argument("invalid mutee_id"))?;
        match self.service.unmute(muter, mutee).await {
            Ok(_) => Ok(Response::new(UnmuteResponse { success: true, error_message: None })),
            Err(e) => Ok(Response::new(UnmuteResponse { success: false, error_message: Some(e.to_string()) })),
        }
    }

    async fn search_users(&self, request: Request<SearchUsersRequest>) -> Result<Response<SearchUsersResponse>, Status> {
        let r = request.into_inner();
        let users = self.service.search_users(&r.query, r.limit).await.map_err(internal_err)?;
        Ok(Response::new(SearchUsersResponse { users: users.iter().map(into_public).collect(), next_cursor: None }))
    }
}

fn internal_err(e: anyhow::Error) -> Status { Status::internal(e.to_string()) }

pub use pb::user_service_server::UserServiceServer as GrpcUserServiceServer;
