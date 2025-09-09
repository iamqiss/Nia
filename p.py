#!/usr/bin/env python3
import os
import sys

def create_file(path, content=""):
    """Create a file with given content, creating directories if needed"""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f"Created: {path}")

def create_directory(path):
    """Create a directory"""
    os.makedirs(path, exist_ok=True)
    print(f"Created directory: {path}")

def scaffold_nia_backend():
    """Scaffold the entire Nia backend microservices structure"""
    
    base_dir = "nia-backend"
    
    # Main services
    services = [
        "auth-service",
        "user-service", 
        "post-service",
        "timeline-service",
        "notification-service",
        "media-service",
        "moderation-service",
        "dm-service"
    ]
    
    # Create base directory
    create_directory(base_dir)
    
    # Create services
    for service in services:
        service_path = f"{base_dir}/services/{service}"
        
        # Service directories
        create_directory(f"{service_path}/src/handlers")
        create_directory(f"{service_path}/src/models")
        create_directory(f"{service_path}/src/services")
        create_directory(f"{service_path}/src/db")
        create_directory(f"{service_path}/proto")
        
        # main.rs
        main_rs_content = f'''use tonic::{{transport::Server, Request, Response, Status}};
use tokio;

mod handlers;
mod models;
mod services;
mod db;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {{
    let addr = "0.0.0.0:50051".parse()?;
    
    println!("{service} starting on {{}}", addr);
    
    Server::builder()
        .serve(addr)
        .await?;
        
    Ok(())
}}
'''
        
        # Cargo.toml
        cargo_toml_content = f'''[package]
name = "{service}"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = {{ version = "1.0", features = ["full"] }}
tonic = "0.10"
prost = "0.12"
surrealdb = "1.0"
serde = {{ version = "1.0", features = ["derive"] }}
uuid = {{ version = "1.0", features = ["v4"] }}
tracing = "0.1"
tracing-subscriber = "0.3"

[build-dependencies]
tonic-build = "0.10"
'''
        
        # build.rs
        build_rs_content = '''fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::compile_protos("proto/service.proto")?;
    Ok(())
}
'''
        
        # Dockerfile
        dockerfile_content = f'''FROM rust:1.70 as builder

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY proto ./proto
COPY build.rs ./

RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/{service} /usr/local/bin/{service}

EXPOSE 50051

CMD ["{service}"]
'''
        
        # Proto file template
        proto_content = f'''syntax = "proto3";

package {service.replace("-", "_")};

service {service.replace("-", "").title()}Service {{
    rpc Ping(PingRequest) returns (PingResponse);
}}

message PingRequest {{
    string message = 1;
}}

message PingResponse {{
    string message = 1;
}}
'''
        
        # Handler template
        handlers_mod_content = f'''use tonic::{{Request, Response, Status}};

pub struct {service.replace("-", "").title()}ServiceImpl;

// Implement your gRPC service handlers here
'''
        
        # Models template
        models_mod_content = '''use serde::{Deserialize, Serialize};
use uuid::Uuid;

// Define your data models here
'''
        
        # Services template (business logic)
        services_mod_content = '''// Business logic layer
// Put your core business logic here
'''
        
        # DB template
        db_mod_content = '''use surrealdb::{Surreal, engine::remote::ws::Ws};

// Database operations and queries
pub async fn init_db() -> Result<Surreal<surrealdb::engine::remote::ws::Client>, Box<dyn std::error::Error>> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;
    db.use_ns("nia").use_db("social").await?;
    Ok(db)
}
'''
        
        # Create files
        create_file(f"{service_path}/src/main.rs", main_rs_content)
        create_file(f"{service_path}/Cargo.toml", cargo_toml_content)
        create_file(f"{service_path}/build.rs", build_rs_content)
        create_file(f"{service_path}/Dockerfile", dockerfile_content)
        create_file(f"{service_path}/proto/service.proto", proto_content)
        create_file(f"{service_path}/src/handlers/mod.rs", handlers_mod_content)
        create_file(f"{service_path}/src/models/mod.rs", models_mod_content)
        create_file(f"{service_path}/src/services/mod.rs", services_mod_content)
        create_file(f"{service_path}/src/db/mod.rs", db_mod_content)
    
    # Shared directory structure
    create_directory(f"{base_dir}/shared/proto")
    create_directory(f"{base_dir}/shared/types") 
    create_directory(f"{base_dir}/shared/database")
    create_directory(f"{base_dir}/shared/auth")
    create_directory(f"{base_dir}/shared/utils")
    
    # Shared Cargo.toml
    shared_cargo_content = '''[package]
name = "nia-shared"
version = "0.1.0"
edition = "2021"

[dependencies]
surrealdb = "1.0"
serde = { version = "1.0", features = ["derive"] }
uuid = { version = "1.0", features = ["v4"] }
jsonwebtoken = "8.0"
chrono = { version = "0.4", features = ["serde"] }
'''
    
    # Shared types
    shared_types_content = '''use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub display_name: Option<String>,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Post {
    pub id: Uuid,
    pub author_id: Uuid,
    pub content: String,
    pub media_urls: Vec<String>,
    pub reply_to: Option<Uuid>,
    pub likes: u64,
    pub reposts: u64,
    pub replies: u64,
    pub created_at: DateTime<Utc>,
}

// Add more shared types as needed
'''
    
    # Database connection helper
    shared_db_content = '''use surrealdb::{Surreal, engine::remote::ws::{Ws, Client}};

pub type DB = Surreal<Client>;

pub async fn connect() -> Result<DB, Box<dyn std::error::Error>> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;
    db.use_ns("nia").use_db("social").await?;
    Ok(db)
}
'''
    
    # Auth helpers
    shared_auth_content = '''use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,  // User ID
    pub exp: usize, // Expiration time
    pub iat: usize, // Issued at
}

pub fn generate_jwt(user_id: Uuid, secret: &str) -> Result<String, Box<dyn std::error::Error>> {
    let now = chrono::Utc::now().timestamp() as usize;
    let claims = Claims {
        sub: user_id,
        exp: now + 86400, // 24 hours
        iat: now,
    };
    
    let token = encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_ref()))?;
    Ok(token)
}

pub fn verify_jwt(token: &str, secret: &str) -> Result<Claims, Box<dyn std::error::Error>> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::default(),
    )?;
    Ok(token_data.claims)
}
'''
    
    create_file(f"{base_dir}/shared/Cargo.toml", shared_cargo_content)
    create_file(f"{base_dir}/shared/types/mod.rs", shared_types_content)
    create_file(f"{base_dir}/shared/database/mod.rs", shared_db_content)
    create_file(f"{base_dir}/shared/auth/mod.rs", shared_auth_content)
    create_file(f"{base_dir}/shared/utils/mod.rs", "// Utility functions")
    
    # Gateway
    create_directory(f"{base_dir}/gateway/src")
    
    gateway_cargo_content = '''[package]
name = "nia-gateway"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1.0", features = ["full"] }
axum = "0.7"
tower = "0.4"
tower-http = { version = "0.5", features = ["cors"] }
tonic = "0.10"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tracing = "0.1"
tracing-subscriber = "0.3"
uuid = { version = "1.0", features = ["v4"] }
'''
    
    gateway_main_content = '''use axum::{
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
'''
    
    create_file(f"{base_dir}/gateway/Cargo.toml", gateway_cargo_content)
    create_file(f"{base_dir}/gateway/src/main.rs", gateway_main_content)
    
    # Docker Compose
    docker_compose_content = '''version: '3.8'

services:
  surrealdb:
    image: surrealdb/surrealdb:latest
    ports:
      - "8000:8000"
    command: start --user root --pass root memory
    
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
      
  gateway:
    build: ./gateway
    ports:
      - "3000:3000"
    depends_on:
      - surrealdb
      - redis
      
  auth-service:
    build: ./services/auth-service
    ports:
      - "50051:50051"
    depends_on:
      - surrealdb
      - redis
      
  user-service:
    build: ./services/user-service
    ports:
      - "50052:50051"
    depends_on:
      - surrealdb
      
  post-service:
    build: ./services/post-service
    ports:
      - "50053:50051" 
    depends_on:
      - surrealdb
      
  timeline-service:
    build: ./services/timeline-service
    ports:
      - "50054:50051"
    depends_on:
      - surrealdb
      
  notification-service:
    build: ./services/notification-service
    ports:
      - "50055:50051"
    depends_on:
      - surrealdb
      - redis
      
  media-service:
    build: ./services/media-service
    ports:
      - "50056:50051"
      
  moderation-service:
    build: ./services/moderation-service
    ports:
      - "50057:50051"
    depends_on:
      - surrealdb
      
  dm-service:
    build: ./services/dm-service
    ports:
      - "50058:50051"
    depends_on:
      - surrealdb
      - redis
'''
    
    # Root workspace Cargo.toml
    workspace_cargo_content = '''[workspace]
members = [
    "services/auth-service",
    "services/user-service", 
    "services/post-service",
    "services/timeline-service",
    "services/notification-service",
    "services/media-service",
    "services/moderation-service",
    "services/dm-service",
    "gateway",
    "shared"
]

[workspace.dependencies]
tokio = { version = "1.0", features = ["full"] }
tonic = "0.10"
prost = "0.12"
surrealdb = "1.0"
serde = { version = "1.0", features = ["derive"] }
uuid = { version = "1.0", features = ["v4"] }
'''
    
    # README
    readme_content = '''# Nia Backend

A microservices-based social media backend built with Rust, gRPC, and SurrealDB.

## Services

- **auth-service**: User authentication and JWT management
- **user-service**: User profiles, follows, blocks  
- **post-service**: Posts, likes, reposts
- **timeline-service**: Feed generation and algorithms
- **notification-service**: Push notifications and mentions
- **media-service**: Image/video upload and processing
- **moderation-service**: Content filtering and reports
- **dm-service**: Direct messaging
- **gateway**: API Gateway and HTTP endpoints

## Quick Start

```bash
# Start all services with Docker Compose
docker-compose up -d

# Or run individual services for development
cd services/auth-service
cargo run
```

## Architecture

- **gRPC**: Inter-service communication
- **SurrealDB**: Multi-model database
- **Redis**: Caching and sessions
- **Tokio**: Async runtime

## Development

Each service is a separate Rust crate with its own Cargo.toml and can be developed independently.

The `shared` crate contains common types, database helpers, and utilities used across services.
'''
    
    create_file(f"{base_dir}/docker-compose.yml", docker_compose_content)
    create_file(f"{base_dir}/Cargo.toml", workspace_cargo_content)  
    create_file(f"{base_dir}/README.md", readme_content)
    
    # K8s directory (basic structure)
    create_directory(f"{base_dir}/k8s")
    create_file(f"{base_dir}/k8s/namespace.yaml", '''apiVersion: v1
kind: Namespace
metadata:
  name: nia
''')
    
    # .gitignore
    gitignore_content = '''# Rust
target/
Cargo.lock
*.pdb

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Environment
.env
.env.local

# Docker
.dockerignore
'''
    
    create_file(f"{base_dir}/.gitignore", gitignore_content)
    
    print(f"\n🎉 Nia backend scaffolding complete!")
    print(f"\nNext steps:")
    print(f"1. cd {base_dir}")
    print(f"2. docker-compose up -d  # Start SurrealDB and Redis")
    print(f"3. cd services/auth-service && cargo run  # Start a service")
    print(f"4. Start building your social media empire! 🚀")

if __name__ == "__main__":
    scaffold_nia_backend()
