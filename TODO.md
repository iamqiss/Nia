# Time Social App - Native gRPC Implementation TODO

## 🎯 Project Overview

This document outlines the step-by-step implementation of native gRPC communication between the Time Social React Native client and the C++ time-server microservices. The goal is to replace REST API calls with high-performance gRPC communication for better performance, type safety, and real-time capabilities.

## 🏗️ Architecture Context

### Current State
- **Time Client**: React Native app (TypeScript/JavaScript) with iOS and Android native modules
- **Time Server**: C++ microservices communicating via gRPC
- **Current Communication**: REST APIs (to be replaced with gRPC)

### Target State
- **Native gRPC**: Direct gRPC communication from iOS (Swift) and Android (Java/Kotlin) native modules
- **React Native Bridge**: Native modules that expose gRPC functionality to JavaScript
- **Protocol Buffers**: Shared .proto definitions for type-safe communication

## 📋 Implementation Phases

### Phase 1: Environment Setup and Tool Installation

#### 1.1 Install Protocol Buffer Compiler (protoc)
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y protobuf-compiler

# macOS
brew install protobuf

# Verify installation
protoc --version
```

#### 1.2 Install gRPC Tools for Swift
```bash
# Install Swift gRPC plugin
brew install swift-protobuf
brew install grpc-swift

# Verify Swift protoc plugin
protoc --plugin=protoc-gen-swift --swift_out=. --version
```

#### 1.3 Install gRPC Tools for Java/Android
```bash
# Install Java gRPC plugin
brew install grpc-java

# Verify Java protoc plugin
protoc --plugin=protoc-gen-grpc-java --java_out=. --version
```

#### 1.4 Verify C++ gRPC Server Setup
- Ensure time-server gRPC services are running
- Verify proto files are properly compiled
- Test gRPC endpoints with grpcurl or similar tools

### Phase 2: Protocol Buffer Definitions Analysis

#### 2.1 Analyze Existing Proto Files
The time-server already has comprehensive proto definitions:

**Core Services:**
- `proto/services/note.proto` - Note creation, interaction, and management
- `proto/services/user.proto` - User authentication and profile management  
- `proto/services/timeline.proto` - Timeline algorithms and real-time updates
- `proto/services/media.proto` - Media upload and management
- `proto/services/notification.proto` - Real-time notifications
- `proto/services/follow.proto` - Social graph and relationships

**Common Types:**
- `proto/common/timestamp.proto` - Timestamp utilities
- `proto/common/pagination.proto` - Pagination support
- `proto/common/common.proto` - Shared common types

#### 2.2 Key gRPC Services to Implement

**Primary Services (High Priority):**
1. **NoteService** - Core social media functionality
   - `CreateNote`, `GetNote`, `DeleteNote`
   - `LikeNote`, `RenoteNote` (formerly renote)
   - `GetUserNotes`, `GetNoteThread`, `SearchNotes`

2. **UserService** - Authentication and profiles
   - `RegisterUser`, `LoginUser`, `LogoutUser`
   - `VerifyToken`, `RefreshToken`
   - `GetUserProfile`, `UpdateUserProfile`

3. **TimelineService** - Content feeds
   - `GetTimeline`, `GetUserTimeline`, `RefreshTimeline`
   - `SubscribeTimelineUpdates` (server streaming)

**Secondary Services (Medium Priority):**
4. **MediaService** - File handling
   - `Upload` (client streaming), `GetMedia`, `DeleteMedia`
   - `ToggleMediaLike`

5. **NotificationService** - Real-time updates
   - `ListNotifications`, `MarkNotificationRead`

### Phase 3: iOS Native gRPC Implementation

#### 3.1 Create iOS Proto Generation Script
Create `time-client/scripts/generate-ios-protos.sh`:
```bash
#!/bin/bash
# Generate Swift code from proto files

PROTO_DIR="../../time-server/proto"
OUTPUT_DIR="ios/Time/Generated"
SWIFT_GRPC_PLUGIN="$(which protoc-gen-grpc-swift)"
SWIFT_PLUGIN="$(which protoc-gen-swift)"

mkdir -p $OUTPUT_DIR

# Generate Swift files for each service
protoc --plugin=protoc-gen-swift=$SWIFT_PLUGIN \
       --plugin=protoc-gen-grpc-swift=$SWIFT_GRPC_PLUGIN \
       --swift_out=$OUTPUT_DIR \
       --grpc-swift_out=$OUTPUT_DIR \
       --proto_path=$PROTO_DIR \
       $PROTO_DIR/services/*.proto \
       $PROTO_DIR/common/*.proto
```

#### 3.2 Update iOS Podfile
Add gRPC dependencies to `time-client/ios/Podfile`:
```ruby
target 'Time' do
  # ... existing configuration ...
  
  # gRPC dependencies
  pod 'gRPC-Swift', '~> 1.0'
  pod 'SwiftProtobuf', '~> 1.0'
end
```

#### 3.3 Create iOS gRPC Client Manager
Create `time-client/ios/Time/TimeGrpcClient.swift`:
```swift
import Foundation
import gRPC
import SwiftProtobuf

@objc(TimeGrpcClient)
class TimeGrpcClient: NSObject {
    private var noteService: NoteServiceClient?
    private var userService: UserServiceClient?
    private var timelineService: TimelineServiceClient?
    private var mediaService: MediaServiceClient?
    private var notificationService: NotificationServiceClient?
    
    private let serverHost: String
    private let serverPort: Int
    
    @objc
    init(host: String, port: Int) {
        self.serverHost = host
        self.serverPort = port
        super.init()
        setupClients()
    }
    
    private func setupClients() {
        let group = PlatformSupport.makeEventLoopGroup(loopCount: 1)
        let channel = ClientConnection.insecure(group: group)
            .connect(host: serverHost, port: serverPort)
        
        self.noteService = NoteServiceClient(channel: channel)
        self.userService = UserServiceClient(channel: channel)
        self.timelineService = TimelineServiceClient(channel: channel)
        self.mediaService = MediaServiceClient(channel: channel)
        self.notificationService = NotificationServiceClient(channel: channel)
    }
    
    // Note Service Methods
    @objc
    func createNote(_ request: CreateNoteRequest, completion: @escaping (CreateNoteResponse?, Error?) -> Void) {
        // Implementation
    }
    
    @objc
    func getNote(_ request: GetNoteRequest, completion: @escaping (GetNoteResponse?, Error?) -> Void) {
        // Implementation
    }
    
    // Add other service methods...
}
```

#### 3.4 Create React Native Bridge Module
Create `time-client/ios/Time/TimeGrpcBridge.swift`:
```swift
import Foundation
import React

@objc(TimeGrpcBridge)
class TimeGrpcBridge: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "TimeGrpcBridge"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    private var grpcClient: TimeGrpcClient?
    
    @objc
    func initializeClient(_ host: String, port: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        grpcClient = TimeGrpcClient(host: host, port: port.intValue)
        resolver(["success": true])
    }
    
    @objc
    func createNote(_ requestData: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        // Convert requestData to CreateNoteRequest and call grpcClient
    }
    
    // Add other bridge methods...
}
```

#### 3.5 Update iOS Project Configuration
- Add generated Swift files to Xcode project
- Configure build settings for gRPC
- Update Info.plist with necessary permissions

### Phase 4: Android Native gRPC Implementation

#### 4.1 Create Android Proto Generation Script
Create `time-client/scripts/generate-android-protos.sh`:
```bash
#!/bin/bash
# Generate Java code from proto files

PROTO_DIR="../../time-server/proto"
OUTPUT_DIR="android/app/src/main/java/com/timesocial/grpc"
JAVA_GRPC_PLUGIN="$(which protoc-gen-grpc-java)"
JAVA_PLUGIN="$(which protoc-gen-java)"

mkdir -p $OUTPUT_DIR

# Generate Java files for each service
protoc --plugin=protoc-gen-java=$JAVA_PLUGIN \
       --plugin=protoc-gen-grpc-java=$JAVA_GRPC_PLUGIN \
       --java_out=$OUTPUT_DIR \
       --grpc-java_out=$OUTPUT_DIR \
       --proto_path=$PROTO_DIR \
       $PROTO_DIR/services/*.proto \
       $PROTO_DIR/common/*.proto
```

#### 4.2 Update Android build.gradle
Add gRPC dependencies to `time-client/android/app/build.gradle`:
```gradle
dependencies {
    // ... existing dependencies ...
    
    // gRPC dependencies
    implementation 'io.grpc:grpc-okhttp:1.58.0'
    implementation 'io.grpc:grpc-protobuf-lite:1.58.0'
    implementation 'io.grpc:grpc-stub:1.58.0'
    implementation 'com.google.protobuf:protobuf-javalite:3.24.0'
    
    // For streaming
    implementation 'io.grpc:grpc-netty-shaded:1.58.0'
}
```

#### 4.3 Create Android gRPC Client Manager
Create `time-client/android/app/src/main/java/com/timesocial/grpc/TimeGrpcClient.java`:
```java
package com.timesocial.grpc;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import java.util.concurrent.TimeUnit;

public class TimeGrpcClient {
    private final ManagedChannel channel;
    private final NoteServiceGrpc.NoteServiceBlockingStub noteService;
    private final UserServiceGrpc.UserServiceBlockingStub userService;
    private final TimelineServiceGrpc.TimelineServiceBlockingStub timelineService;
    private final MediaServiceGrpc.MediaServiceBlockingStub mediaService;
    private final NotificationServiceGrpc.NotificationServiceBlockingStub notificationService;
    
    public TimeGrpcClient(String host, int port) {
        this.channel = ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext()
                .build();
        
        this.noteService = NoteServiceGrpc.newBlockingStub(channel);
        this.userService = UserServiceGrpc.newBlockingStub(channel);
        this.timelineService = TimelineServiceGrpc.newBlockingStub(channel);
        this.mediaService = MediaServiceGrpc.newBlockingStub(channel);
        this.notificationService = NotificationServiceGrpc.newBlockingStub(channel);
    }
    
    public void shutdown() throws InterruptedException {
        channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
    }
    
    // Note Service Methods
    public CreateNoteResponse createNote(CreateNoteRequest request) {
        return noteService.createNote(request);
    }
    
    public GetNoteResponse getNote(GetNoteRequest request) {
        return noteService.getNote(request);
    }
    
    // Add other service methods...
}
```

#### 4.4 Create React Native Bridge Module
Create `time-client/android/app/src/main/java/com/timesocial/TimeGrpcModule.java`:
```java
package com.timesocial;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import com.timesocial.grpc.TimeGrpcClient;
import com.timesocial.grpc.*;

public class TimeGrpcModule extends ReactContextBaseJavaModule {
    private TimeGrpcClient grpcClient;
    
    public TimeGrpcModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    
    @Override
    public String getName() {
        return "TimeGrpcModule";
    }
    
    @ReactMethod
    public void initializeClient(String host, int port, Promise promise) {
        try {
            grpcClient = new TimeGrpcClient(host, port);
            promise.resolve("Client initialized successfully");
        } catch (Exception e) {
            promise.reject("INIT_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void createNote(ReadableMap requestData, Promise promise) {
        // Convert requestData to CreateNoteRequest and call grpcClient
    }
    
    // Add other bridge methods...
}
```

#### 4.5 Register Native Module
Create `time-client/android/app/src/main/java/com/timesocial/TimeGrpcPackage.java`:
```java
package com.timesocial;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TimeGrpcPackage implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
    
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new TimeGrpcModule(reactContext));
        return modules;
    }
}
```

### Phase 5: React Native Integration Layer

#### 5.1 Create TypeScript gRPC Service Wrapper
Create `time-client/src/lib/grpc/TimeGrpcService.ts`:
```typescript
import { NativeModules, Platform } from 'react-native';

const { TimeGrpcModule, TimeGrpcBridge } = NativeModules;

export interface GrpcConfig {
  host: string;
  port: number;
}

export class TimeGrpcService {
  private static instance: TimeGrpcService;
  private isInitialized = false;
  
  static getInstance(): TimeGrpcService {
    if (!TimeGrpcService.instance) {
      TimeGrpcService.instance = new TimeGrpcService();
    }
    return TimeGrpcService.instance;
  }
  
  async initialize(config: GrpcConfig): Promise<void> {
    if (this.isInitialized) return;
    
    const module = Platform.OS === 'ios' ? TimeGrpcBridge : TimeGrpcModule;
    await module.initializeClient(config.host, config.port);
    this.isInitialized = true;
  }
  
  // Note Service Methods
  async createNote(request: CreateNoteRequest): Promise<CreateNoteResponse> {
    const module = Platform.OS === 'ios' ? TimeGrpcBridge : TimeGrpcModule;
    return module.createNote(request);
  }
  
  async getNote(request: GetNoteRequest): Promise<GetNoteResponse> {
    const module = Platform.OS === 'ios' ? TimeGrpcBridge : TimeGrpcModule;
    return module.getNote(request);
  }
  
  // Add other service methods...
}
```

#### 5.2 Create Type Definitions
Create `time-client/src/lib/grpc/types.ts`:
```typescript
// Re-export all proto types for TypeScript
export interface CreateNoteRequest {
  author_id: string;
  text: string;
  visibility: NoteVisibility;
  content_warning?: ContentWarning;
  media_ids?: string[];
  location?: GeoLocation;
  reply_to_note_id?: string;
  renoted_note_id?: string;
  is_quote_renote?: boolean;
  client_name?: string;
  idempotency_key?: string;
}

export interface CreateNoteResponse {
  note: Note;
  success: boolean;
  error_message?: string;
}

// Add all other proto message types...
```

### Phase 6: Migration from REST to gRPC

#### 6.1 Identify REST API Usage
- Audit existing REST API calls in the codebase
- Map REST endpoints to corresponding gRPC services
- Identify streaming endpoints that can benefit from gRPC streaming

#### 6.2 Create Migration Strategy
1. **Parallel Implementation**: Run both REST and gRPC side by side
2. **Feature Flags**: Use feature flags to gradually enable gRPC
3. **A/B Testing**: Test gRPC performance vs REST
4. **Gradual Migration**: Migrate one service at a time

#### 6.3 Update API Layer
Replace REST calls with gRPC calls in:
- `src/state/queries/` - React Query hooks
- `src/state/mutations/` - Mutation hooks  
- `src/api/` - API service layer

### Phase 7: Testing and Validation

#### 7.1 Unit Tests
- Test native gRPC client implementations
- Test React Native bridge modules
- Test TypeScript service wrappers

#### 7.2 Integration Tests
- Test end-to-end gRPC communication
- Test error handling and retry logic
- Test streaming functionality

#### 7.3 Performance Testing
- Benchmark gRPC vs REST performance
- Test memory usage and battery impact
- Test network efficiency

### Phase 8: Production Deployment

#### 8.1 Configuration Management
- Environment-specific gRPC server endpoints
- SSL/TLS configuration for production
- Load balancing and failover

#### 8.2 Monitoring and Observability
- gRPC metrics and tracing
- Error monitoring and alerting
- Performance monitoring

#### 8.3 Rollout Strategy
- Staged rollout to user segments
- Feature flag management
- Rollback procedures

## 🔧 Technical Requirements

### Prerequisites
- **Protocol Buffer Compiler**: protoc 3.20+
- **gRPC Tools**: Platform-specific gRPC plugins
- **Node.js**: 20+ (for React Native)
- **Xcode**: 15+ (for iOS development)
- **Android Studio**: Latest (for Android development)

### Dependencies
- **iOS**: gRPC-Swift, SwiftProtobuf
- **Android**: gRPC-Java, Protocol Buffers
- **React Native**: Native module bridge

### Performance Considerations
- **Connection Pooling**: Reuse gRPC channels
- **Streaming**: Use server streaming for real-time updates
- **Compression**: Enable gRPC compression
- **Caching**: Implement appropriate caching strategies

## 🚨 Critical Success Factors

1. **Type Safety**: Ensure proto definitions match exactly between client and server
2. **Error Handling**: Implement comprehensive error handling and retry logic
3. **Performance**: gRPC should provide better performance than REST
4. **Reliability**: Maintain high availability and fault tolerance
5. **Security**: Implement proper authentication and encryption
6. **Monitoring**: Comprehensive observability for production debugging

## 📚 Additional Resources

- [gRPC Swift Documentation](https://github.com/grpc/grpc-swift)
- [gRPC Java Documentation](https://grpc.io/docs/languages/java/)
- [Protocol Buffers Guide](https://developers.google.com/protocol-buffers)
- [React Native Native Modules](https://reactnative.dev/docs/native-modules-intro)

---

**Note**: This implementation requires expert-level knowledge of gRPC, Protocol Buffers, React Native native modules, and mobile development. The code quality must be production-ready with proper error handling, testing, and documentation.