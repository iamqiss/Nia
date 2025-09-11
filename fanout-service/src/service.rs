use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;
use tokio::sync::RwLock;
use tonic::{Request, Response, Status};
use tracing::info;

use crate::pb::sonet::fanout::fanout_service_server::{FanoutService, FanoutServiceServer};
use crate::pb::sonet::fanout::*;
use crate::settings::Settings;

#[derive(Clone)]
pub struct FanoutGrpcService {
    settings: Settings,
    state: Arc<RwLock<ServiceState>>,
}

#[derive(Default)]
struct ServiceState {}

impl FanoutGrpcService {
    pub async fn new(settings: Settings) -> Result<Self> {
        Ok(Self { settings, state: Arc::new(RwLock::new(ServiceState::default())) })
    }
}

#[async_trait]
impl FanoutService for FanoutGrpcService {
    async fn initiate_fanout(
        &self,
        _request: Request<InitiateFanoutRequest>,
    ) -> Result<Response<InitiateFanoutResponse>, Status> {
        let reply = InitiateFanoutResponse { job_id: uuid::Uuid::new_v4().to_string(), strategy_used: FanoutStrategy::Hybrid as i32, estimated_deliveries: 0, estimated_completion_time_ms: 0.0, success: true, error_message: String::new() };
        Ok(Response::new(reply))
    }

    async fn get_fanout_job_status(
        &self,
        _request: Request<GetFanoutJobStatusRequest>,
    ) -> Result<Response<GetFanoutJobStatusResponse>, Status> {
        Ok(Response::new(GetFanoutJobStatusResponse { job: None, success: true, error_message: String::new() }))
    }

    async fn cancel_fanout_job(
        &self,
        _request: Request<CancelFanoutJobRequest>,
    ) -> Result<Response<CancelFanoutJobResponse>, Status> {
        Ok(Response::new(CancelFanoutJobResponse { success: true, error_message: String::new() }))
    }

    async fn get_user_tier(
        &self,
        _request: Request<GetUserTierRequest>,
    ) -> Result<Response<GetUserTierResponse>, Status> {
        Ok(Response::new(GetUserTierResponse { tier: UserTier::Regular as i32, follower_count: 0, recommended_strategy: FanoutStrategy::Push as i32, success: true, error_message: String::new() }))
    }

    async fn process_follower_batch(
        &self,
        _request: Request<ProcessFollowerBatchRequest>,
    ) -> Result<Response<ProcessFollowerBatchResponse>, Status> {
        Ok(Response::new(ProcessFollowerBatchResponse { batch_id: String::new(), successful_deliveries: 0, failed_deliveries: 0, failed_user_ids: vec![], success: true, error_message: String::new() }))
    }

    async fn get_fanout_metrics(
        &self,
        _request: Request<GetFanoutMetricsRequest>,
    ) -> Result<Response<GetFanoutMetricsResponse>, Status> {
        Ok(Response::new(GetFanoutMetricsResponse { metrics: vec![], summary_stats: Default::default(), success: true, error_message: String::new() }))
    }

    async fn health_check(
        &self,
        _request: Request<HealthCheckRequest>,
    ) -> Result<Response<HealthCheckResponse>, Status> {
        Ok(Response::new(HealthCheckResponse { status: "SERVING".into(), details: Default::default(), pending_jobs: 0, active_workers: 0 }))
    }
}

pub use FanoutGrpcService;

