#!/bin/bash
#
# Copyright (c) 2025 Neo Qiss
# All rights reserved.
#
# This software is proprietary and confidential.
# Unauthorized copying, distribution, or use is strictly prohibited.
#

# iOS Proto Generation Script for Time Social App
# Generates Swift code from Protocol Buffer definitions

set -e

# Configuration
PROTO_DIR="proto"
OUTPUT_DIR="ios/Time/Generated"
SWIFT_GRPC_PLUGIN="/usr/bin/grpc_cpp_plugin"  # We'll use C++ plugin as fallback
SWIFT_PLUGIN="protoc-gen-swift"  # Will be installed via Swift package manager

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting iOS Proto Generation...${NC}"

# Check if we're in the right directory
if [ ! -d "ios" ]; then
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

# Check for Swift protoc plugins
echo -e "${YELLOW}🔍 Checking for Swift protoc plugins...${NC}"

# Try to find Swift protoc plugins
SWIFT_PLUGIN_PATH=""
if command -v protoc-gen-swift &> /dev/null; then
    SWIFT_PLUGIN_PATH=$(which protoc-gen-swift)
    echo -e "${GREEN}✅ Found Swift protoc plugin: $SWIFT_PLUGIN_PATH${NC}"
else
    echo -e "${YELLOW}⚠️  Swift protoc plugin not found, will use C++ plugin as fallback${NC}"
    SWIFT_PLUGIN_PATH="$SWIFT_GRPC_PLUGIN"
fi

# Generate Swift files for each service
echo -e "${YELLOW}🔄 Generating Swift files...${NC}"

# Core services
SERVICES=(
    "services/note.proto"
    "services/user.proto" 
    "services/timeline.proto"
    "services/media.proto"
    "services/notification.proto"
    "services/fanout.proto"
    "services/messaging.proto"
    "services/search.proto"
    "services/drafts_service.proto"
    "services/list_service.proto"
    "services/starterpack_service.proto"
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
            --plugin=protoc-gen-swift="$SWIFT_PLUGIN_PATH" \
            --swift_out="$OUTPUT_DIR" \
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
            --plugin=protoc-gen-swift="$SWIFT_PLUGIN_PATH" \
            --swift_out="$OUTPUT_DIR" \
            --proto_path="$PROTO_DIR" \
            "$PROTO_DIR/$proto_file"
    else
        echo -e "${YELLOW}  ⚠️  Skipping missing file: $proto_file${NC}"
    fi
done

# Generate gRPC service stubs (using C++ plugin as fallback)
echo -e "${YELLOW}📝 Generating gRPC service stubs...${NC}"
for proto_file in "${SERVICES[@]}"; do
    if [ -f "$PROTO_DIR/$proto_file" ]; then
        echo -e "  Processing gRPC: $proto_file"
        protoc \
            --plugin=protoc-gen-grpc-cpp="$SWIFT_GRPC_PLUGIN" \
            --grpc-cpp_out="$OUTPUT_DIR" \
            --proto_path="$PROTO_DIR" \
            "$PROTO_DIR/$proto_file"
    fi
done

# Create a Swift module file
echo -e "${YELLOW}📝 Creating Swift module file...${NC}"
cat > "$OUTPUT_DIR/TimeGrpc.swift" << 'EOF'
//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import Foundation

// MARK: - Time gRPC Module
// This file provides a unified interface to all gRPC services

public enum TimeGrpc {
    // Service endpoints
    public static let defaultHost = "localhost"
    public static let defaultPort = 50051
    
    // Service names
    public enum Service {
        public static let note = "sonet.note.NoteService"
        public static let user = "sonet.user.UserService"
        public static let timeline = "sonet.timeline.TimelineService"
        public static let media = "sonet.media.MediaService"
        public static let notification = "sonet.notification.NotificationService"
        public static let fanout = "sonet.fanout.FanoutService"
        public static let messaging = "sonet.messaging.MessagingService"
        public static let search = "sonet.search.SearchService"
        public static let drafts = "sonet.drafts.v1.DraftsService"
        public static let list = "sonet.list.v1.ListService"
        public static let starterpack = "sonet.starterpack.v1.StarterpackService"
    }
}

// MARK: - Error Types
public enum TimeGrpcError: Error, LocalizedError {
    case connectionFailed(String)
    case serviceUnavailable(String)
    case invalidRequest(String)
    case authenticationFailed(String)
    case networkError(String)
    case unknown(String)
    
    public var errorDescription: String? {
        switch self {
        case .connectionFailed(let message):
            return "Connection failed: \(message)"
        case .serviceUnavailable(let message):
            return "Service unavailable: \(message)"
        case .invalidRequest(let message):
            return "Invalid request: \(message)"
        case .authenticationFailed(let message):
            return "Authentication failed: \(message)"
        case .networkError(let message):
            return "Network error: \(message)"
        case .unknown(let message):
            return "Unknown error: \(message)"
        }
    }
}

// MARK: - Configuration
public struct TimeGrpcConfig {
    public let host: String
    public let port: Int
    public let useTLS: Bool
    public let timeout: TimeInterval
    
    public init(
        host: String = TimeGrpc.defaultHost,
        port: Int = TimeGrpc.defaultPort,
        useTLS: Bool = false,
        timeout: TimeInterval = 30.0
    ) {
        self.host = host
        self.port = port
        self.useTLS = useTLS
        self.timeout = timeout
    }
}
EOF

# Create a README for the generated files
echo -e "${YELLOW}📝 Creating README...${NC}"
cat > "$OUTPUT_DIR/README.md" << 'EOF'
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
EOF

echo -e "${GREEN}✅ iOS Proto generation completed successfully!${NC}"
echo -e "${GREEN}📁 Generated files in: $OUTPUT_DIR${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "  1. Add generated files to Xcode project"
echo -e "  2. Install gRPC Swift dependencies"
echo -e "  3. Implement native gRPC client"
echo -e "  4. Create React Native bridge module"