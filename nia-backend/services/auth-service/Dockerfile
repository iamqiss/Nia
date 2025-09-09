# Multi-stage build for production-ready auth service
FROM rust:1.70-slim as builder

# Install system dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./
COPY build.rs ./

# Copy proto files
COPY proto/ ./proto/

# Copy shared library
COPY ../../shared ./shared

# Create a dummy main.rs to build dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Build dependencies (this layer will be cached)
RUN cargo build --release

# Copy source code
COPY src/ ./src/

# Build the application
RUN cargo build --release

# Production stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r authservice && useradd -r -g authservice authservice

# Set working directory
WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/target/release/auth-service /usr/local/bin/auth-service

# Create necessary directories
RUN mkdir -p /app/logs && chown -R authservice:authservice /app

# Switch to non-root user
USER authservice

# Expose port
EXPOSE 50051

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:50051/health || exit 1

# Run the service
CMD ["auth-service"]
