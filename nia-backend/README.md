# Nia Backend

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
