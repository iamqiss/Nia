#!/bin/bash

# Generate gRPC code for both Android and iOS
# This script should be run from the time-client directory

set -e

echo "🚀 Generating gRPC code for Time service..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the time-client directory"
    exit 1
fi

# Check if protoc is installed
if ! command -v protoc &> /dev/null; then
    print_error "protoc is not installed. Please install Protocol Buffers compiler."
    print_warning "Install instructions:"
    print_warning "  macOS: brew install protobuf"
    print_warning "  Ubuntu: sudo apt-get install protobuf-compiler"
    print_warning "  Windows: Download from https://github.com/protocolbuffers/protobuf/releases"
    exit 1
fi

# Check if grpc_tools_node_protoc_plugin is installed
if ! command -v grpc_tools_node_protoc_plugin &> /dev/null; then
    print_warning "grpc_tools_node_protoc_plugin not found. Installing..."
    npm install -g grpc-tools
fi

# Create directories
print_status "Creating output directories..."
mkdir -p android/app/src/main/proto
mkdir -p ios/Time/proto
mkdir -p src/lib/grpc/generated

# Copy proto files
print_status "Copying proto files..."
cp ../time-server/proto/common/timestamp.proto android/app/src/main/proto/
cp ../time-server/proto/common/pagination.proto android/app/src/main/proto/
cp ../time-server/proto/common/common.proto android/app/src/main/proto/
cp ../time-server/proto/services/user.proto android/app/src/main/proto/
cp ../time-server/proto/services/note_service.proto android/app/src/main/proto/

cp ../time-server/proto/common/timestamp.proto ios/Time/proto/
cp ../time-server/proto/common/pagination.proto ios/Time/proto/
cp ../time-server/proto/common/common.proto ios/Time/proto/
cp ../time-server/proto/services/user.proto ios/Time/proto/
cp ../time-server/proto/services/note_service.proto ios/Time/proto/

# Generate Android Java code
print_status "Generating Android Java code..."
cd android/app/src/main/proto

# Generate Java files
protoc --java_out=java \
  --grpc-java_out=java \
  --plugin=protoc-gen-grpc-java=$(which grpc_java_plugin) \
  --proto_path=. \
  time_service.proto

# Generate Kotlin files (if needed)
# protoc --kotlin_out=java \
#   --grpc-kotlin_out=java \
#   --plugin=protoc-gen-grpc-kotlin=$(which grpc_kotlin_plugin) \
#   --proto_path=. \
#   time_service.proto

print_status "Android Java code generated successfully"

# Generate iOS Swift code
print_status "Generating iOS Swift code..."
cd ../../../../ios/Time/proto

# Generate Swift files
protoc --swift_out=. \
  --grpc-swift_out=Client=true,Server=false:. \
  --proto_path=. \
  time_service.proto

print_status "iOS Swift code generated successfully"

# Generate Node.js/TypeScript code
print_status "Generating Node.js/TypeScript code..."
cd ../../../../src/lib/grpc/generated

# Generate TypeScript files
protoc --js_out=import_style=commonjs,binary:. \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:. \
  --plugin=protoc-gen-grpc-web=$(which protoc-gen-grpc-web) \
  --proto_path=../../../ios/Time/proto \
  ../../../ios/Time/proto/time_service.proto

print_status "Node.js/TypeScript code generated successfully"

# Generate JavaScript files for React Native
print_status "Generating React Native JavaScript code..."
protoc --js_out=import_style=commonjs,binary:. \
  --grpc_out=grpc_js:. \
  --plugin=protoc-gen-grpc=$(which grpc_tools_node_protoc_plugin) \
  --proto_path=../../../ios/Time/proto \
  ../../../ios/Time/proto/time_service.proto

print_status "React Native JavaScript code generated successfully"

# Go back to project root
cd ../../../../

# Update Android build.gradle to include generated files
print_status "Updating Android build.gradle..."
cat >> android/app/build.gradle << 'EOF'

// gRPC generated files
sourceSets {
    main {
        java {
            srcDirs += 'src/main/proto/java'
        }
    }
}
EOF

# Update iOS project to include generated files
print_status "Updating iOS project configuration..."
# Note: This would typically be done through Xcode, but we can create a script
cat > ios/Time/generated_files.txt << 'EOF'
Generated gRPC files:
- time_service.pb.swift
- time_service.grpc.swift

Add these files to your Xcode project:
1. Open Time.xcodeproj
2. Right-click on Time folder
3. Add Files to "Time"
4. Select the generated .swift files
5. Make sure they're added to the target
EOF

# Create a simple test script
print_status "Creating test script..."
cat > scripts/test-grpc.js << 'EOF'
#!/usr/bin/env node

const { timeGrpcClient } = require('../src/lib/grpc/TimeGrpcBridge');

async function testGrpcConnection() {
    try {
        console.log('Testing gRPC connection...');
        
        // Test if the module is available
        if (!timeGrpcClient) {
            console.error('gRPC client not available');
            return;
        }
        
        // Test initialization
        const result = await timeGrpcClient.initialize('localhost', 50051, false);
        console.log('Connection successful:', result);
        
        // Test getting current time
        const time = await timeGrpcClient.getCurrentTime();
        console.log('Current time:', time);
        
        // Test getting time stats
        const stats = await timeGrpcClient.getTimeStats();
        console.log('Time stats:', stats);
        
        console.log('All tests passed!');
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testGrpcConnection();
EOF

chmod +x scripts/test-grpc.js

print_status "✅ gRPC code generation complete!"
print_status "Generated files:"
print_status "  - Android: java/com/time/grpc/"
print_status "  - iOS: Time/proto/"
print_status "  - React Native: src/lib/grpc/generated/"
print_status ""
print_status "Next steps:"
print_status "1. Add generated files to your Xcode project (iOS)"
print_status "2. Run 'cd ios && pod install' to install gRPC dependencies"
print_status "3. Run 'cd android && ./gradlew build' to build Android"
print_status "4. Test the connection with 'node scripts/test-grpc.js'"
print_status ""
print_warning "Note: Make sure your time-server is running on localhost:50051"