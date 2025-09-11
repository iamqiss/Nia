# Time gRPC Generated Files

This directory contains auto-generated Java files from Protocol Buffer definitions.

## Generated Files

- **Common Types**: `timestamp.proto`, `pagination.proto`, `common.proto`
- **Services**: `note.proto`, `user.proto`, `timeline.proto`, `media.proto`, `notification.proto`
- **Module**: `TimeGrpcModule.java` - Main module interface

## Usage

```java
import com.timesocial.grpc.*;

// Initialize gRPC client
TimeGrpcModule.Config config = TimeGrpcModule.Config.defaultConfig();
TimeGrpcClient client = TimeGrpcModule.ClientFactory.createClient(config);

// Use services
NoteServiceGrpc.NoteServiceBlockingStub noteService = client.getNoteService();
UserServiceGrpc.UserServiceBlockingStub userService = client.getUserService();
```

## Regeneration

To regenerate these files, run:

```bash
./scripts/generate-android-protos.sh
```

## Dependencies

- Protocol Buffer Compiler (protoc)
- gRPC Java plugin (grpc_java_plugin)
- gRPC Java library

## Notes

- Files are generated from `../../time-server/proto/`
- Do not manually edit generated files
- Regenerate when proto definitions change
