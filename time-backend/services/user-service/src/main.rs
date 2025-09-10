use tonic::transport::Server;
use tokio;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod handlers;
mod models;
mod services;
mod db;

use handlers::pb::user_service_server::UserServiceServer;
use handlers::UserServiceImpl;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let addr = "0.0.0.0:50051".parse()?;
    tracing::info!("user-service starting on {}", addr);

    let db = db::init_db().await?;
    let service = UserServiceImpl { db };

    Server::builder()
        .add_service(UserServiceServer::new(service))
        .serve(addr)
        .await?;

    Ok(())
}
