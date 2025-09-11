Sonet Monorepo

This repository contains multiple services and clients that together implement a large-scale social network platform. Key components include:

- time-server: Core backend services implemented in C++ with gRPC.
- time-client: Mobile/web client code and gRPC integrations.
- moderation: Rust-based moderation service.
- overdrive / overdrive-serving: Media and AI-related services.

New: fanout-service (Rust, gRPC via tonic) — a horizontally scalable service responsible for fanning out notes to follower timelines using hybrid push/pull strategies, aligned with `time-server/proto/services/fanout.proto`.

See `fanout-service/README.md` for details once generated.