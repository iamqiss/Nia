use nia_shared::database::{connect, DB};
use surrealdb::sql::Value;

pub async fn init_db() -> Result<DB, Box<dyn std::error::Error>> {
    let db = connect().await?;
    // Ensure tables and indexes exist (idempotent)
    // Users table
    db.query("DEFINE TABLE users SCHEMAFULL;").await.ok();
    db.query("DEFINE FIELD username ON TABLE users TYPE string ASSERT $value != '';").await.ok();
    db.query("DEFINE FIELD email ON TABLE users TYPE string ASSERT $value != '';").await.ok();
    db.query("DEFINE INDEX idx_users_username ON TABLE users COLUMNS username UNIQUE;").await.ok();
    db.query("DEFINE INDEX idx_users_email ON TABLE users COLUMNS email UNIQUE;").await.ok();
    db.query("DEFINE FIELD display_name ON TABLE users TYPE string;").await.ok();
    db.query("DEFINE FIELD bio ON TABLE users TYPE string;").await.ok();
    db.query("DEFINE FIELD avatar_url ON TABLE users TYPE string;").await.ok();
    db.query("DEFINE FIELD created_at ON TABLE users TYPE datetime;").await.ok();
    db.query("DEFINE FIELD updated_at ON TABLE users TYPE datetime;").await.ok();

    // Follows table as edges
    db.query("DEFINE TABLE follows SCHEMAFULL;").await.ok();
    db.query("DEFINE FIELD follower_id ON TABLE follows TYPE string;").await.ok();
    db.query("DEFINE FIELD followee_id ON TABLE follows TYPE string;").await.ok();
    db.query("DEFINE INDEX idx_follows_pair ON TABLE follows COLUMNS follower_id, followee_id UNIQUE;").await.ok();
    db.query("DEFINE INDEX idx_followers ON TABLE follows COLUMNS followee_id;").await.ok();
    db.query("DEFINE INDEX idx_following ON TABLE follows COLUMNS follower_id;").await.ok();

    Ok(db)
}
