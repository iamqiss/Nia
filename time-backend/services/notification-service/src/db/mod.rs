use surrealdb::{Surreal, engine::remote::ws::Ws};

// Database operations and queries
pub async fn init_db() -> Result<Surreal<surrealdb::engine::remote::ws::Client>, Box<dyn std::error::Error>> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;
    db.use_ns("nia").use_db("social").await?;
    Ok(db)
}
