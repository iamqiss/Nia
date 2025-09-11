# Time gRPC Generated Files

This directory contains auto-generated Swift files from Protocol Buffer definitions.

## Generated Files

- **Common Types**: `timestamp.proto`, `pagination.proto`, `common.proto`
- **Services**: `note.proto`, `user.proto`, `timeline.proto`, `media.proto`, `notification.proto`
- **Module**: `TimeGrpc.swift` - Main module interface

## Usage

```swift
import TimeGrpc

// Initialize gRPC client
let config = TimeGrpcConfig(host: "api.timesocial.com", port: 443, useTLS: true)
let client = TimeGrpcClient(config: config)

// Use services
let noteService = client.noteService
let userService = client.userService
```

## Regeneration

To regenerate these files, run:

```bash
./scripts/generate-ios-protos.sh
```

## Dependencies

- Protocol Buffer Compiler (protoc)
- Swift gRPC plugin (protoc-gen-swift)
- gRPC Swift library

## Notes

- Files are generated from `../../time-server/proto/`
- Do not manually edit generated files
- Regenerate when proto definitions change
