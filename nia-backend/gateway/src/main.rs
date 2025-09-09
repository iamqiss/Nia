use axum::{
    routing::{get, post},
    Router,
};
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::init();
    
    let app = Router::new()
        .route("/health", get(health_check))
        .layer(CorsLayer::permissive());
    
    let addr = "0.0.0.0:3000".parse()?;
    println!("Gateway listening on {}", addr);
    
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;
        
    Ok(())
}

async fn health_check() -> &'static str {
    "OK"
}
