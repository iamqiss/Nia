fanout-service

Rust gRPC service (tonic) implementing `sonet.fanout.FanoutService` per `time-server/proto/services/fanout.proto`.

Quick start

1. Install Rust and protoc
2. Build: `cargo build -p fanout-service`
3. Run: `FANOUT__GRPC__BIND=0.0.0.0:50055 cargo run -p fanout-service`

Env

- `FANOUT__GRPC__BIND`: host:port to bind gRPC server

Notes

- Protos are compiled directly from `../time-server/proto` at build time.
