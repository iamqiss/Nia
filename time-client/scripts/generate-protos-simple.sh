#!/bin/bash
#
# Copyright (c) 2025 Neo Qiss
# All rights reserved.
#
# This software is proprietary and confidential.
# Unauthorized copying, distribution, or use is strictly prohibited.
#

# Simple Proto Generation Script for Time Social App
# Generates C++ code from Protocol Buffer definitions

set -e

# Configuration
PROTO_DIR="proto"
IOS_OUTPUT_DIR="ios/Time/Generated"
ANDROID_OUTPUT_DIR="android/app/src/main/java/com/timesocial/grpc"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Proto Generation...${NC}"

# Check if we're in the right directory
if [ ! -d "ios" ] || [ ! -d "android" ]; then
    echo -e "${RED}❌ Error: Must be run from time-client root directory${NC}"
    exit 1
fi

# Check if proto directory exists
if [ ! -d "$PROTO_DIR" ]; then
    echo -e "${RED}❌ Error: Proto directory not found at $PROTO_DIR${NC}"
    exit 1
fi

# Create output directories
echo -e "${YELLOW}📁 Creating output directories...${NC}"
mkdir -p "$IOS_OUTPUT_DIR/common"
mkdir -p "$IOS_OUTPUT_DIR/services"
mkdir -p "$ANDROID_OUTPUT_DIR/common"
mkdir -p "$ANDROID_OUTPUT_DIR/services"

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
    "common/video_types.proto"
)

# Generate common types first
echo -e "${YELLOW}📝 Generating common types...${NC}"
for proto_file in "${COMMON_FILES[@]}"; do
    if [ -f "$PROTO_DIR/$proto_file" ]; then
        echo -e "  Processing: $proto_file"
        
        # Generate C++ files for iOS
        protoc \
            --cpp_out="$IOS_OUTPUT_DIR" \
            --proto_path="$PROTO_DIR" \
            "$PROTO_DIR/$proto_file"
            
        # Generate Java files for Android
        protoc \
            --java_out="$ANDROID_OUTPUT_DIR" \
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
        
        # Generate C++ files for iOS
        protoc \
            --cpp_out="$IOS_OUTPUT_DIR" \
            --proto_path="$PROTO_DIR" \
            "$PROTO_DIR/$proto_file"
            
        # Generate Java files for Android
        protoc \
            --java_out="$ANDROID_OUTPUT_DIR" \
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
        
        # Generate C++ gRPC stubs for iOS
        protoc \
            --plugin=protoc-gen-grpc-cpp=/usr/bin/grpc_cpp_plugin \
            --grpc-cpp_out="$IOS_OUTPUT_DIR" \
            --proto_path="$PROTO_DIR" \
            "$PROTO_DIR/$proto_file"
            
        # Generate Java gRPC stubs for Android
        protoc \
            --plugin=protoc-gen-grpc-java=/usr/bin/grpc_java_plugin \
            --grpc-java_out="$ANDROID_OUTPUT_DIR" \
            --proto_path="$PROTO_DIR" \
            "$PROTO_DIR/$proto_file"
    fi
done

echo -e "${GREEN}✅ Proto generation completed successfully!${NC}"
echo -e "${GREEN}📁 iOS files in: $IOS_OUTPUT_DIR${NC}"
echo -e "${GREEN}📁 Android files in: $ANDROID_OUTPUT_DIR${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "  1. Add generated files to Xcode/Android projects"
echo -e "  2. Install gRPC dependencies"
echo -e "  3. Implement native gRPC clients"
echo -e "  4. Create React Native bridge modules"