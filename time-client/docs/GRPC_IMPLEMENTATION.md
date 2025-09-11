# Time gRPC Implementation

This document describes the comprehensive gRPC implementation for the Time client, providing real-time communication between React Native, Android, and iOS platforms with the time-server.

## Architecture Overview

The gRPC implementation follows a multi-layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Layer                       │
├─────────────────────────────────────────────────────────────┤
│  TimeDisplay Component  │  useTimeService Hook  │  TimeService │
├─────────────────────────────────────────────────────────────┤
│                    Bridge Layer                            │
├─────────────────────────────────────────────────────────────┤
│  TimeGrpcBridge.ts  │  TimeGrpcModule.java  │  TimeGrpcModule.swift │
├─────────────────────────────────────────────────────────────┤
│                    Native gRPC Layer                       │
├─────────────────────────────────────────────────────────────┤
│  TimeGrpcClient.java  │  TimeGrpcClient.swift  │  Generated Code │
├─────────────────────────────────────────────────────────────┤
│                    Network Layer                           │
├─────────────────────────────────────────────────────────────┤
│                    time-server (gRPC)                      │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Core Functionality
- **Real-time Time Synchronization**: Get current server time with sub-millisecond precision
- **Timezone Support**: Request time for specific timezones
- **Streaming Updates**: Real-time time updates via gRPC streaming
- **Connection Management**: Automatic reconnection and error handling
- **Cross-platform**: Native implementations for Android (Java) and iOS (Swift)

### Performance Optimizations
- **Connection Pooling**: Efficient connection management
- **Keep-alive**: Maintains persistent connections
- **Compression**: gRPC compression for reduced bandwidth
- **Batching**: Batch operations for improved performance
- **Caching**: Intelligent caching of time data

### Error Handling
- **Graceful Degradation**: Fallback mechanisms for network issues
- **Retry Logic**: Exponential backoff for failed requests
- **Timeout Management**: Configurable timeouts for all operations
- **Error Reporting**: Comprehensive error logging and reporting

## Platform Implementation

### Android (Java)

**Location**: `android/app/src/main/java/com/time/grpc/`

**Key Files**:
- `TimeGrpcClient.java`: Core gRPC client implementation
- `TimeGrpcModule.java`: React Native bridge module
- `TimeGrpcPackage.java`: Package registration

**Features**:
- Full gRPC client with connection management
- React Native bridge for JavaScript integration
- Automatic connection pooling and keep-alive
- Error handling and retry logic

**Dependencies** (in `build.gradle`):
```gradle
implementation 'io.grpc:grpc-okhttp:1.58.0'
implementation 'io.grpc:grpc-protobuf-lite:1.58.0'
implementation 'io.grpc:grpc-stub:1.58.0'
implementation 'javax.annotation:javax.annotation-api:1.3.2'
implementation 'com.google.protobuf:protobuf-javalite:3.25.1'
```

### iOS (Swift)

**Location**: `ios/Time/`

**Key Files**:
- `TimeGrpcClient.swift`: Core gRPC client implementation
- `TimeGrpcModule.swift`: React Native bridge module
- `TimeGrpcBridge.m`: Objective-C bridge

**Features**:
- Swift-native gRPC client
- Event-driven architecture with callbacks
- Memory management and cleanup
- Type-safe protocol buffer handling

**Dependencies** (in `Podfile`):
```ruby
pod 'gRPC-Swift', '~> 1.20.0'
pod 'SwiftProtobuf', '~> 1.25.0'
```

### React Native (TypeScript)

**Location**: `src/lib/grpc/`

**Key Files**:
- `TimeGrpcBridge.ts`: Native module interface
- `TimeService.ts`: High-level service layer
- `useTimeService.ts`: React hooks for easy integration

**Features**:
- Type-safe native module interface
- React hooks for component integration
- Event-driven updates
- Error handling and state management

## Protocol Buffer Definitions

### Time Service Proto

```protobuf
syntax = "proto3";

package sonet.time;

service TimeService {
  rpc GetCurrentTime(google.protobuf.Empty) returns (TimeResponse);
  rpc GetTimeWithTimezone(TimezoneRequest) returns (TimeResponse);
  rpc StreamTime(google.protobuf.Empty) returns (stream TimeUpdate);
  rpc GetTimeStats(google.protobuf.Empty) returns (TimeStatsResponse);
}
```

### Message Types

- **TimeResponse**: Current time with timezone information
- **TimeUpdate**: Real-time time updates for streaming
- **TimeStatsResponse**: Server statistics and health information
- **TimezoneRequest**: Request for timezone-specific time

## Usage Examples

### Basic Usage

```typescript
import { timeService } from '#/lib/grpc/TimeService';

// Initialize the service
await timeService.initialize({
  host: 'localhost',
  port: 50051,
  useTls: false
});

// Get current time
const time = await timeService.getCurrentTime();
console.log('Current time:', time.formattedTime);

// Get time with timezone
const nycTime = await timeService.getTimeWithTimezone('America/New_York');
console.log('NYC time:', nycTime.formattedTime);
```

### React Hook Usage

```typescript
import { useTimeService } from '#/lib/grpc/useTimeService';

function TimeComponent() {
  const {
    isInitialized,
    currentTime,
    isStreaming,
    startTimeStream,
    stopTimeStream
  } = useTimeService();

  useEffect(() => {
    // Initialize on mount
    initialize({ host: 'localhost', port: 50051 });
  }, []);

  return (
    <View>
      <Text>Time: {currentTime?.formattedTime}</Text>
      <Button
        title={isStreaming ? 'Stop Stream' : 'Start Stream'}
        onPress={isStreaming ? stopTimeStream : startTimeStream}
      />
    </View>
  );
}
```

### Streaming Updates

```typescript
// Start streaming
timeService.startTimeStream();

// Listen for updates
const unsubscribe = timeService.onTimeUpdate((update) => {
  console.log('Time update:', update.formattedTime);
});

// Stop streaming
timeService.stopTimeStream();
unsubscribe();
```

## Configuration

### Server Configuration

```typescript
const config = {
  host: 'your-server.com',     // Server hostname
  port: 50051,                 // Server port
  useTls: true,                // Use TLS encryption
  timeout: 10000,              // Request timeout (ms)
  keepAlive: true,             // Enable keep-alive
  keepAliveInterval: 30000,    // Keep-alive interval (ms)
};
```

### Connection Options

- **Host**: Server hostname or IP address
- **Port**: Server port (default: 50051)
- **TLS**: Enable/disable encryption
- **Timeout**: Request timeout in milliseconds
- **Keep-alive**: Maintain persistent connections
- **Compression**: Enable gRPC compression

## Error Handling

### Common Error Types

- **INIT_ERROR**: Service initialization failed
- **GRPC_ERROR**: gRPC communication error
- **NOT_INITIALIZED**: Service not initialized
- **CONNECTION_ERROR**: Network connection failed
- **TIMEOUT_ERROR**: Request timed out

### Error Handling Example

```typescript
try {
  const time = await timeService.getCurrentTime();
} catch (error) {
  if (error.code === 'INIT_ERROR') {
    // Handle initialization error
    console.error('Failed to initialize service');
  } else if (error.code === 'GRPC_ERROR') {
    // Handle gRPC error
    console.error('gRPC communication failed');
  } else {
    // Handle other errors
    console.error('Unknown error:', error);
  }
}
```

## Performance Considerations

### Optimization Strategies

1. **Connection Pooling**: Reuse connections for multiple requests
2. **Keep-alive**: Maintain persistent connections
3. **Compression**: Use gRPC compression for large payloads
4. **Batching**: Batch multiple requests together
5. **Caching**: Cache frequently accessed data

### Memory Management

- **Android**: Automatic garbage collection
- **iOS**: ARC (Automatic Reference Counting)
- **React Native**: JavaScript garbage collection

### Network Optimization

- **HTTP/2**: gRPC uses HTTP/2 for efficient multiplexing
- **Compression**: Built-in compression support
- **Keep-alive**: Persistent connections reduce overhead
- **TLS**: Optional encryption with minimal overhead

## Testing

### Unit Tests

```typescript
import { timeService } from '#/lib/grpc/TimeService';

describe('TimeService', () => {
  beforeEach(async () => {
    await timeService.initialize({ host: 'localhost', port: 50051 });
  });

  it('should get current time', async () => {
    const time = await timeService.getCurrentTime();
    expect(time).toBeDefined();
    expect(time.formattedTime).toBeDefined();
  });

  it('should handle errors gracefully', async () => {
    await expect(timeService.getCurrentTime()).rejects.toThrow();
  });
});
```

### Integration Tests

```bash
# Run the test script
node scripts/test-grpc.js

# Run Android tests
cd android && ./gradlew test

# Run iOS tests
cd ios && xcodebuild test
```

## Deployment

### Android

1. **Build**: `cd android && ./gradlew assembleRelease`
2. **Test**: `cd android && ./gradlew test`
3. **Deploy**: Install APK on device/emulator

### iOS

1. **Install Dependencies**: `cd ios && pod install`
2. **Build**: Open `Time.xcodeproj` and build
3. **Test**: Run tests in Xcode
4. **Deploy**: Install on device/simulator

### React Native

1. **Install Dependencies**: `npm install`
2. **Build**: `npm run build`
3. **Test**: `npm test`

## Troubleshooting

### Common Issues

1. **Module Not Found**: Ensure native modules are properly linked
2. **Connection Failed**: Check server host/port configuration
3. **Build Errors**: Verify all dependencies are installed
4. **Runtime Errors**: Check logs for detailed error messages

### Debug Mode

```typescript
// Enable debug logging
import { logger } from '#/logger';
logger.setLevel('debug');

// Check connection status
const status = await timeService.getConnectionStatus();
console.log('Connection status:', status);
```

### Logs

- **Android**: Check Logcat for detailed logs
- **iOS**: Check Xcode console for logs
- **React Native**: Check Metro bundler console

## Security Considerations

### TLS/SSL

- Enable TLS for production deployments
- Use proper certificate validation
- Implement certificate pinning for enhanced security

### Authentication

- Implement proper authentication mechanisms
- Use secure token-based authentication
- Validate all incoming requests

### Data Protection

- Encrypt sensitive data in transit
- Implement proper data validation
- Follow platform security best practices

## Future Enhancements

### Planned Features

1. **Authentication**: JWT-based authentication
2. **Caching**: Advanced caching strategies
3. **Metrics**: Performance monitoring and metrics
4. **Load Balancing**: Multiple server support
5. **Offline Support**: Offline mode with sync

### Performance Improvements

1. **Connection Multiplexing**: Multiple streams per connection
2. **Compression**: Advanced compression algorithms
3. **Batching**: Intelligent request batching
4. **Prefetching**: Predictive data loading

## Contributing

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Generate gRPC code: `./scripts/generate-grpc.sh`
4. Run tests: `npm test`
5. Build: `npm run build`

### Code Style

- Follow existing code patterns
- Use TypeScript for type safety
- Write comprehensive tests
- Document all public APIs

### Pull Request Process

1. Create feature branch
2. Implement changes
3. Add tests
4. Update documentation
5. Submit pull request

## License

This implementation is part of the Time project and follows the same license terms.

## Support

For questions and support:

1. Check this documentation
2. Review the code examples
3. Check the issue tracker
4. Contact the development team

---

*Last updated: January 2025*