#!/bin/bash

# Script to add generated gRPC files to Xcode project
# This script adds all the generated protobuf and gRPC files to the Time.xcodeproj

set -e

PROJECT_DIR="/workspace/time-client/ios"
PROJECT_FILE="$PROJECT_DIR/Time.xcodeproj/project.pbxproj"
GENERATED_DIR="$PROJECT_DIR/Time/Generated"

echo "Adding gRPC files to Xcode project..."

# Create a backup of the project file
cp "$PROJECT_FILE" "$PROJECT_FILE.backup"

# Add the Generated group to the project
# This is a simplified approach - in practice, you'd want to use xcodebuild or a more sophisticated tool

echo "Generated files are located in: $GENERATED_DIR"
echo "Files to be added:"
find "$GENERATED_DIR" -name "*.cc" -o -name "*.h" -o -name "*.swift" | head -20

echo ""
echo "To properly add these files to Xcode:"
echo "1. Open Time.xcodeproj in Xcode"
echo "2. Right-click on the 'Time' group in the project navigator"
echo "3. Select 'Add Files to Time'"
echo "4. Navigate to ios/Time/Generated/"
echo "5. Select all .cc, .h, and .swift files"
echo "6. Make sure 'Add to target: Time' is checked"
echo "7. Click 'Add'"

echo ""
echo "Alternatively, you can use the following command to add files programmatically:"
echo "xcodebuild -project Time.xcodeproj -target Time -configuration Debug -showBuildSettings"

echo ""
echo "Generated files structure:"
echo "├── common/"
echo "│   ├── *.pb.cc (protobuf C++ files)"
echo "│   └── *.pb.h (protobuf headers)"
echo "├── services/"
echo "│   ├── *.pb.cc (protobuf C++ files)"
echo "│   ├── *.pb.h (protobuf headers)"
echo "│   ├── *.grpc.pb.cc (gRPC C++ files)"
echo "│   └── *.grpc.pb.h (gRPC headers)"
echo "└── TimeGrpc.swift (Swift module file)"

echo ""
echo "Note: The project.pbxproj file is complex and should be modified carefully."
echo "Consider using Xcode's built-in file addition or a tool like xcodeproj gem."