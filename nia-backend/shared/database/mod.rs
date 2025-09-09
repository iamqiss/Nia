use surrealdb::{Surreal, engine::remote::ws::{Ws, Client}};

pub type DB = Surreal<Client>;

pub async fn connect() -> Result<DB, Box<dyn std::error::Error>> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;
    db.use_ns("nia").use_db("social").await?;
    Ok(db)
}
