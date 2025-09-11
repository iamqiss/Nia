use std::net::SocketAddr;

use anyhow::Result;
use once_cell::sync::Lazy;
use tokio::signal;
use tonic::transport::Server;
use tracing::{error, info};

pub mod pb {
    include!(concat!(env!("OUT_DIR"), "/mod.rs"));
}

mod service;
mod settings;

#[tokio::main]
async fn main() -> Result<()> {
    settings::init_tracing();
    let settings = settings::Settings::from_env()?;

    let addr: SocketAddr = settings.grpc.bind.parse()?;
    let health = tonic_health::server::health_reporter();
    let (mut health_reporter, health_service) = health;

    let fanout_svc = service::FanoutGrpcService::new(settings.clone()).await?;

    health_reporter.set_serving::<pb::sonet::fanout::fanout_service_server::FanoutServiceServer<FanoutGrpcService>>().await;

    info!(%addr, "starting fanout-service gRPC server");
    let server = Server::builder()
        .accept_http1(true)
        .add_service(tonic_health::server::HealthServer::new(health_service))
        .add_service(pb::sonet::fanout::fanout_service_server::FanoutServiceServer::new(
            fanout_svc,
        ));

    tokio::select! {
        res = server.serve(addr) => {
            if let Err(err) = res { error!(?err, "gRPC server error"); }
        }
        _ = signal::ctrl_c() => {
            info!("shutdown signal received");
        }
    }

    Ok(())
}

