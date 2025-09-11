FROM rust:1.80 as builder
RUN apt-get update && apt-get install -y protobuf-compiler pkg-config libssl-dev cmake && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY Cargo.toml /app/Cargo.toml
COPY fanout-service/Cargo.toml /app/fanout-service/Cargo.toml
RUN mkdir -p /app/fanout-service/src && echo "fn main(){}" > /app/fanout-service/src/main.rs && cargo build -p fanout-service --release || true
COPY . /app
RUN cargo build -p fanout-service --release

FROM gcr.io/distroless/cc-debian12
WORKDIR /app
COPY --from=builder /app/target/release/fanout-service /usr/local/bin/fanout-service
USER 65532:65532
EXPOSE 50055
ENTRYPOINT ["/usr/local/bin/fanout-service"]
