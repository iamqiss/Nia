use tonic::{transport::Server, Request, Response, Status};
use tokio;

mod handlers;
mod models;
mod services;
mod db;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "0.0.0.0:50051".parse()?;
    
    println!("timeline-service starting on {}", addr);
    
    Server::builder()
        .serve(addr)
        .await?;
        
    Ok(())
}
