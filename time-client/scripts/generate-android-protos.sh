#!/bin/bash
#
# Copyright (c) 2025 Neo Qiss
# All rights reserved.
#
# This software is proprietary and confidential.
# Unauthorized copying, distribution, or use is strictly prohibited.
#

# Android Proto Generation Script for Time Social App
# Generates Java code from Protocol Buffer definitions

set -e

# Configuration
PROTO_DIR="../time-server/proto"
OUTPUT_DIR="android/app/src/main/java/com/timesocial/grpc"
JAVA_GRPC_PLUGIN="/usr/bin/grpc_java_plugin"  # Will be installed
JAVA_PLUGIN="protoc-gen-java"  # Built-in with protoc

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Android Proto Generation...${NC}"

# Check if we're in the right directory
if [ ! -d "android" ]; then
    echo -e "${RED}❌ Error: Must be run from time-client root directory${NC}"
    exit 1
fi

# Check if proto directory exists
if [ ! -d "$PROTO_DIR" ]; then
    echo -e "${RED}❌ Error: Proto directory not found at $PROTO_DIR${NC}"
    exit 1
fi

# Create output directory
echo -e "${YELLOW}📁 Creating output directory: $OUTPUT_DIR${NC}"
mkdir -p "$OUTPUT_DIR"

# Check for Java gRPC plugin
echo -e "${YELLOW}🔍 Checking for Java gRPC plugin...${NC}"

# Try to find Java gRPC plugin
JAVA_GRPC_PLUGIN_PATH=""
if command -v grpc_java_plugin &> /dev/null; then
    JAVA_GRPC_PLUGIN_PATH=$(which grpc_java_plugin)
    echo -e "${GREEN}✅ Found Java gRPC plugin: $JAVA_GRPC_PLUGIN_PATH${NC}"
else
    echo -e "${YELLOW}⚠️  Java gRPC plugin not found, will use C++ plugin as fallback${NC}"
    JAVA_GRPC_PLUGIN_PATH="/usr/bin/grpc_cpp_plugin"
fi

# Generate Java files for each service
echo -e "${YELLOW}🔄 Generating Java files...${NC}"

# Core services
SERVICES=(
    "services/note.proto"
    "services/user.proto" 
    "services/timeline.proto"
    "services/media.proto"
    "services/notification.proto"
)

# Common types
COMMON_FILES=(
    "common/timestamp.proto"
    "common/pagination.proto"
    "common/common.proto"
)

# Generate common types first
echo -e "${YELLOW}📝 Generating common types...${NC}"
for proto_file in "${COMMON_FILES[@]}"; do
    if [ -f "$PROTO_DIR/$proto_file" ]; then
        echo -e "  Processing: $proto_file"
        protoc \
            --java_out="$OUTPUT_DIR" \
            --proto_path="$PROTO_DIR" \
            "$PROTO_DIR/$proto_file"
    else
        echo -e "${YELLOW}  ⚠️  Skipping missing file: $proto_file${NC}"
    fi
done

# Generate service files
echo -e "${YELLOW}📝 Generating service files...${NC}"
for proto_file in "${SERVICES[@]}"; do
    if [ -f "$PROTO_DIR/$proto_file" ]; then
        echo -e "  Processing: $proto_file"
        protoc \
            --java_out="$OUTPUT_DIR" \
            --proto_path="$PROTO_DIR" \
            "$PROTO_DIR/$proto_file"
    else
        echo -e "${YELLOW}  ⚠️  Skipping missing file: $proto_file${NC}"
    fi
done

# Generate gRPC service stubs
echo -e "${YELLOW}📝 Generating gRPC service stubs...${NC}"
for proto_file in "${SERVICES[@]}"; do
    if [ -f "$PROTO_DIR/$proto_file" ]; then
        echo -e "  Processing gRPC: $proto_file"
        protoc \
            --plugin=protoc-gen-grpc-java="$JAVA_GRPC_PLUGIN_PATH" \
            --grpc-java_out="$OUTPUT_DIR" \
            --proto_path="$PROTO_DIR" \
            "$PROTO_DIR/$proto_file"
    fi
done

# Create a Java module file
echo -e "${YELLOW}📝 Creating Java module file...${NC}"
cat > "$OUTPUT_DIR/TimeGrpcModule.java" << 'EOF'
//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

package com.timesocial.grpc;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;
import java.util.concurrent.TimeUnit;

/**
 * Main Time gRPC module providing access to all services
 */
public class TimeGrpcModule {
    
    // Service endpoints
    public static final String DEFAULT_HOST = "localhost";
    public static final int DEFAULT_PORT = 50051;
    
    // Service names
    public static class Service {
        public static final String NOTE = "sonet.note.NoteService";
        public static final String USER = "sonet.user.UserService";
        public static final String TIMELINE = "sonet.timeline.TimelineService";
        public static final String MEDIA = "sonet.media.MediaService";
        public static final String NOTIFICATION = "sonet.notification.NotificationService";
    }
    
    // Error types
    public static class TimeGrpcException extends Exception {
        public TimeGrpcException(String message) {
            super(message);
        }
        
        public TimeGrpcException(String message, Throwable cause) {
            super(message, cause);
        }
    }
    
    // Configuration
    public static class Config {
        public final String host;
        public final int port;
        public final boolean useTLS;
        public final long timeoutSeconds;
        
        public Config(String host, int port, boolean useTLS, long timeoutSeconds) {
            this.host = host;
            this.port = port;
            this.useTLS = useTLS;
            this.timeoutSeconds = timeoutSeconds;
        }
        
        public static Config defaultConfig() {
            return new Config(DEFAULT_HOST, DEFAULT_PORT, false, 30);
        }
    }
    
    // Client factory
    public static class ClientFactory {
        public static TimeGrpcClient createClient(Config config) {
            return new TimeGrpcClient(config);
        }
        
        public static TimeGrpcClient createDefaultClient() {
            return createClient(Config.defaultConfig());
        }
    }
}
EOF

# Create a README for the generated files
echo -e "${YELLOW}📝 Creating README...${NC}"
cat > "$OUTPUT_DIR/README.md" << 'EOF'
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
EOF

echo -e "${GREEN}✅ Android Proto generation completed successfully!${NC}"
echo -e "${GREEN}📁 Generated files in: $OUTPUT_DIR${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "  1. Add generated files to Android project"
echo -e "  2. Add gRPC Java dependencies to build.gradle"
echo -e "  3. Implement native gRPC client"
echo -e "  4. Create React Native bridge module"