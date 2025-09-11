#!/bin/bash

# Complete gRPC setup script for Time client
# This script sets up the entire gRPC infrastructure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_header() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the time-client directory"
    exit 1
fi

print_header "🚀 Setting up Time gRPC Implementation"
echo "=================================================="

# Step 1: Install dependencies
print_status "Step 1: Installing dependencies..."
npm install

# Step 2: Generate gRPC code
print_status "Step 2: Generating gRPC code..."
if [ -f "scripts/generate-grpc.sh" ]; then
    ./scripts/generate-grpc.sh
else
    print_warning "gRPC generation script not found, skipping..."
fi

# Step 3: Setup Android
print_status "Step 3: Setting up Android..."
if [ -d "android" ]; then
    cd android
    
    # Update build.gradle if needed
    if ! grep -q "grpc" app/build.gradle; then
        print_warning "gRPC dependencies not found in Android build.gradle"
        print_warning "Please add gRPC dependencies manually"
    fi
    
    # Build Android project
    print_status "Building Android project..."
    ./gradlew clean build || print_warning "Android build failed, continuing..."
    
    cd ..
else
    print_warning "Android directory not found, skipping Android setup"
fi

# Step 4: Setup iOS
print_status "Step 4: Setting up iOS..."
if [ -d "ios" ]; then
    cd ios
    
    # Install CocoaPods dependencies
    print_status "Installing CocoaPods dependencies..."
    pod install || print_warning "CocoaPods installation failed, continuing..."
    
    cd ..
else
    print_warning "iOS directory not found, skipping iOS setup"
fi

# Step 5: Create example configuration
print_status "Step 5: Creating example configuration..."
cat > src/config/grpc.ts << 'EOF'
// gRPC Configuration
export const GRPC_CONFIG = {
  // Development server
  development: {
    host: 'localhost',
    port: 50051,
    useTls: false,
    timeout: 10000,
  },
  
  // Production server
  production: {
    host: 'your-production-server.com',
    port: 443,
    useTls: true,
    timeout: 15000,
  },
  
  // Test server
  test: {
    host: 'localhost',
    port: 50051,
    useTls: false,
    timeout: 5000,
  },
};

// Get current environment
export function getGrpcConfig() {
  const env = process.env.NODE_ENV || 'development';
  return GRPC_CONFIG[env as keyof typeof GRPC_CONFIG] || GRPC_CONFIG.development;
}
EOF

# Step 6: Create test script
print_status "Step 6: Creating test script..."
cat > scripts/test-grpc-connection.js << 'EOF'
#!/usr/bin/env node

const { timeGrpcClient } = require('../src/lib/grpc/TimeGrpcBridge');

async function testGrpcConnection() {
    console.log('🧪 Testing gRPC Connection...');
    console.log('================================');
    
    try {
        // Test if the module is available
        if (!timeGrpcClient) {
            console.error('❌ gRPC client not available');
            console.log('Make sure the native modules are properly linked');
            return;
        }
        
        console.log('✅ gRPC client module loaded');
        
        // Test initialization
        console.log('🔌 Initializing connection...');
        const result = await timeGrpcClient.initialize('localhost', 50051, false);
        console.log('✅ Connection successful:', result);
        
        // Test getting current time
        console.log('⏰ Getting current time...');
        const time = await timeGrpcClient.getCurrentTime();
        console.log('✅ Current time:', time);
        
        // Test getting time stats
        console.log('📊 Getting time stats...');
        const stats = await timeGrpcClient.getTimeStats();
        console.log('✅ Time stats:', stats);
        
        // Test connection status
        console.log('🔍 Checking connection status...');
        const status = await timeGrpcClient.getConnectionStatus();
        console.log('✅ Connection status:', status);
        
        console.log('🎉 All tests passed!');
        
        // Cleanup
        timeGrpcClient.shutdown();
        console.log('🔌 Connection closed');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.log('');
        console.log('Troubleshooting:');
        console.log('1. Make sure time-server is running on localhost:50051');
        console.log('2. Check that native modules are properly linked');
        console.log('3. Verify gRPC dependencies are installed');
        console.log('4. Check the logs for detailed error information');
    }
}

testGrpcConnection();
EOF

chmod +x scripts/test-grpc-connection.js

# Step 7: Create development script
print_status "Step 7: Creating development script..."
cat > scripts/dev-grpc.sh << 'EOF'
#!/bin/bash

# Development script for gRPC Time service
# Starts the development server with gRPC support

echo "🚀 Starting Time client with gRPC support..."

# Check if time-server is running
if ! curl -s http://localhost:50051 > /dev/null 2>&1; then
    echo "⚠️  Warning: time-server not detected on localhost:50051"
    echo "   Make sure to start the time-server before running the client"
    echo ""
fi

# Start React Native development server
echo "📱 Starting React Native development server..."
npx expo start --dev-client

EOF

chmod +x scripts/dev-grpc.sh

# Step 8: Create production build script
print_status "Step 8: Creating production build script..."
cat > scripts/build-grpc.sh << 'EOF'
#!/bin/bash

# Production build script for gRPC Time service

echo "🏗️  Building Time client with gRPC support..."

# Build Android
echo "📱 Building Android..."
cd android
./gradlew assembleRelease
cd ..

# Build iOS
echo "🍎 Building iOS..."
cd ios
xcodebuild -workspace Time.xcworkspace -scheme Time -configuration Release
cd ..

echo "✅ Build complete!"
echo ""
echo "Generated files:"
echo "  - Android: android/app/build/outputs/apk/release/"
echo "  - iOS: ios/build/Release-iphoneos/"
EOF

chmod +x scripts/build-grpc.sh

# Step 9: Create documentation
print_status "Step 9: Creating documentation..."
cat > docs/QUICK_START.md << 'EOF'
# Time gRPC Quick Start Guide

## Prerequisites

1. **Node.js** (v20 or higher)
2. **React Native** development environment
3. **Android Studio** (for Android development)
4. **Xcode** (for iOS development)
5. **time-server** running on localhost:50051

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate gRPC code:**
   ```bash
   ./scripts/generate-grpc.sh
   ```

3. **Setup Android:**
   ```bash
   cd android
   ./gradlew build
   cd ..
   ```

4. **Setup iOS:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Running the App

1. **Start the development server:**
   ```bash
   ./scripts/dev-grpc.sh
   ```

2. **Test the connection:**
   ```bash
   node scripts/test-grpc-connection.js
   ```

## Usage

```typescript
import { timeService } from '#/lib/grpc/TimeService';

// Initialize
await timeService.initialize({
  host: 'localhost',
  port: 50051,
  useTls: false
});

// Get current time
const time = await timeService.getCurrentTime();
console.log('Current time:', time.formattedTime);

// Start streaming
timeService.startTimeStream();
```

## Troubleshooting

- **Module not found**: Run `npx react-native link` or `npx expo install`
- **Build errors**: Check that all dependencies are installed
- **Connection failed**: Verify time-server is running
- **iOS build issues**: Run `cd ios && pod install`

## Next Steps

1. Configure your server host/port
2. Enable TLS for production
3. Implement authentication
4. Add error handling
5. Test on real devices
EOF

# Step 10: Final verification
print_status "Step 10: Final verification..."

# Check if all files exist
required_files=(
    "src/lib/grpc/TimeGrpcBridge.ts"
    "src/lib/grpc/TimeService.ts"
    "src/lib/grpc/useTimeService.ts"
    "src/components/TimeDisplay.tsx"
    "src/screens/TimeScreen.tsx"
    "android/app/src/main/java/com/time/grpc/TimeGrpcClient.java"
    "ios/Time/TimeGrpcClient.swift"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    print_status "✅ All required files present"
else
    print_warning "Missing files:"
    for file in "${missing_files[@]}"; do
        print_warning "  - $file"
    done
fi

# Summary
echo ""
print_header "🎉 Setup Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Start your time-server: cd ../time-server && make run"
echo "2. Test the connection: node scripts/test-grpc-connection.js"
echo "3. Start the app: ./scripts/dev-grpc.sh"
echo "4. Check the TimeScreen for gRPC functionality"
echo ""
echo "Documentation:"
echo "- Quick Start: docs/QUICK_START.md"
echo "- Full Implementation: docs/GRPC_IMPLEMENTATION.md"
echo ""
echo "Happy coding! 🚀"