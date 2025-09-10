use tonic::{transport::Server};
use tokio;
use tracing_subscriber::{fmt, EnvFilter};

mod handlers;
mod models;
mod services;
mod db;

use handlers::{GrpcUserService, GrpcUserServiceServer};
use services::UserService;
use db::{init_db, UserRepository};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    fmt().with_env_filter(EnvFilter::from_default_env()).init();

    let addr = "0.0.0.0:50051".parse()?;
    let db = init_db().await?;
    let repo = UserRepository::new(db);
    let domain_service = UserService::new(repo);
    let grpc = GrpcUserService { service: domain_service };

    let reflection = tonic_reflection::server::Builder::configure()
        .register_encoded_file_descriptor_set(include_bytes!("../descriptor.bin"))
        .build()
        .unwrap();

    tracing::info!("user-service starting on {}", addr);

    Server::builder()
        .add_service(GrpcUserServiceServer::new(grpc))
        .add_service(reflection)
        .serve(addr)
        .await?;
    Ok(())
}
