# gRPC Migration API Reference

## Overview

This document provides a comprehensive API reference for the advanced gRPC migration system. The system includes feature flags, circuit breakers, intelligent caching, monitoring, and advanced testing capabilities.

## Core Components

### 1. Feature Flags (`FeatureFlags.ts`)

#### `GrpcFeatureFlagManager`

The central manager for controlling gRPC migration features with advanced A/B testing and user segmentation.

```typescript
import { GrpcFeatureFlagManager } from './FeatureFlags';

const manager = GrpcFeatureFlagManager.getInstance();

// Get current flags
const flags = manager.getFlags();

// Update flags
manager.updateFlags({
  enableCreateNote: true,
  enableGetNote: true,
  phase: 'testing'
});

// Check if feature is enabled
const isEnabled = manager.isEnabled('enableCreateNote');

// Check if gRPC is enabled for operation
const useGrpc = manager.isGrpcEnabledForOperation('createNote');

// Check A/B test group
const inTestGroup = manager.isInAbTestGroup();

// Check performance criteria
const meetsCriteria = manager.meetsPerformanceCriteria();
```

#### Advanced Configuration

```typescript
// Advanced feature flags with user segmentation
const advancedFlags = {
  // Core services
  enableNoteService: true,
  enableUserService: true,
  
  // Advanced features
  enableCircuitBreaker: true,
  enableRequestBatching: true,
  enableIntelligentCaching: true,
  enablePerformanceMonitoring: true,
  
  // User segmentation
  userSegments: ['power_user', 'premium_user'],
  geographicRegions: ['us-west', 'eu-central'],
  deviceTypes: ['mobile', 'desktop'],
  appVersions: ['1.0.0', '1.1.0'],
  
  // Performance thresholds
  performanceThresholds: {
    maxLatencyMs: 1000,
    maxErrorRate: 0.05,
    minThroughput: 100,
    maxMemoryUsageMB: 100,
  },
  
  // Circuit breaker configuration
  circuitBreakerConfig: {
    failureThreshold: 5,
    recoveryTimeoutMs: 30000,
    halfOpenMaxCalls: 3,
  },
  
  // Caching configuration
  cachingConfig: {
    ttlSeconds: 300,
    maxSize: 1000,
    enableCompression: true,
    enablePersistence: false,
  },
  
  // Monitoring configuration
  monitoringConfig: {
    enableMetrics: true,
    enableTracing: true,
    enableLogging: true,
    samplingRate: 0.1,
  },
};
```

### 2. Circuit Breaker (`CircuitBreaker.ts`)

#### `CircuitBreaker`

Protects against cascading failures with automatic recovery.

```typescript
import { CircuitBreaker, CircuitBreakerManager } from './CircuitBreaker';

// Create circuit breaker
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  recoveryTimeoutMs: 30000,
  halfOpenMaxCalls: 3,
  successThreshold: 3,
  timeoutMs: 5000,
});

// Execute with circuit breaker protection
try {
  const result = await circuitBreaker.execute(async () => {
    return await riskyOperation();
  });
} catch (error) {
  if (error instanceof CircuitBreakerError) {
    console.log('Circuit breaker is OPEN');
  }
}

// Get metrics
const metrics = circuitBreaker.getMetrics();
console.log('State:', metrics.state);
console.log('Failure count:', metrics.failureCount);
console.log('Success count:', metrics.successCount);

// Get health status
const health = circuitBreaker.getHealthStatus();
console.log('Healthy:', health.healthy);
console.log('Failure rate:', health.failureRate);
```

#### `CircuitBreakerManager`

Manages multiple circuit breakers for different services.

```typescript
const manager = CircuitBreakerManager.getInstance();

// Get circuit breaker for service
const breaker = manager.getBreaker('grpc_createNote', {
  failureThreshold: 5,
  recoveryTimeoutMs: 30000,
  halfOpenMaxCalls: 3,
});

// Get all metrics
const allMetrics = manager.getAllMetrics();

// Get overall health
const overallHealth = manager.getOverallHealth();
console.log('Healthy services:', overallHealth.healthy);
console.log('Unhealthy services:', overallHealth.unhealthyServices);

// Reset all circuit breakers
manager.resetAll();
```

### 3. Intelligent Cache (`IntelligentCache.ts`)

#### `IntelligentCache`

High-performance cache with LRU eviction, compression, and persistence.

```typescript
import { IntelligentCache, CacheManager } from './IntelligentCache';

// Create cache
const cache = new IntelligentCache(
  (key: string) => key, // Key generator
  {
    ttlSeconds: 300,
    maxSize: 1000,
    enableCompression: true,
    enablePersistence: false,
    maxMemoryUsageMB: 50,
    cleanupIntervalMs: 60000,
    compressionThreshold: 1024,
  }
);

// Basic operations
cache.set('key1', { data: 'value1' });
const value = cache.get('key1');
const exists = cache.has('key1');
cache.delete('key1');

// Get statistics
const stats = cache.getStats();
console.log('Hit rate:', stats.hitRate);
console.log('Memory usage:', stats.memoryUsage);
console.log('Entry count:', stats.entryCount);

// Clear cache
cache.clear();

// Destroy cache
cache.destroy();
```

#### `CacheManager`

Manages multiple caches.

```typescript
const manager = CacheManager.getInstance();

// Get or create cache
const cache = manager.getCache('my_cache', (key: string) => key, {
  ttlSeconds: 600,
  maxSize: 500,
});

// Get all statistics
const allStats = manager.getAllStats();

// Clear all caches
manager.clearAll();

// Destroy all caches
manager.destroyAll();
```

### 4. Migration Adapter (`MigrationAdapter.ts`)

#### `MigrationAdapter`

Seamlessly switches between gRPC and REST with circuit breaker and caching.

```typescript
import MigrationAdapter from './MigrationAdapter';

const adapter = MigrationAdapter.getInstance();

// Initialize
await adapter.initialize({
  host: 'api.timesocial.com',
  port: 443,
  useTLS: true,
});

// Create note (automatically uses gRPC or REST)
const response = await adapter.createNote(
  {
    authorId: 'user123',
    text: 'Hello world!',
    visibility: 1,
    contentWarning: 0,
    mediaIds: [],
    clientName: 'Time Social App',
  },
  restAgent,
  queryClient
);

// Get note (with caching)
const note = await adapter.getNote(
  {
    noteId: 'note123',
    requestingUserId: 'user123',
    includeThread: true,
  },
  restAgent
);

// Get health status
const health = adapter.getHealthStatus();
console.log('Initialized:', health.initialized);
console.log('Circuit breakers:', health.circuitBreakers);
console.log('Cache stats:', health.cacheStats);

// Clear cache
adapter.clearCache();

// Reset circuit breakers
adapter.resetCircuitBreakers();
```

### 5. Monitoring System (`MonitoringSystem.ts`)

#### `MonitoringSystem`

Advanced monitoring with metrics, tracing, and alerting.

```typescript
import { MonitoringSystem, monitorPerformance } from './MonitoringSystem';

const monitoring = MonitoringSystem.getInstance();

// Record metrics
monitoring.recordCounter('requests_total', 1, { operation: 'createNote' });
monitoring.recordGauge('memory_usage', 100, { unit: 'MB' });
monitoring.recordHistogram('request_duration_ms', 150, { operation: 'createNote' });

// Start trace
const trace = monitoring.startTrace('createNote');
try {
  // Perform operation
  const result = await createNote();
  monitoring.addTraceTag(trace, 'success', 'true');
  monitoring.addTraceLog(trace, 'info', 'Note created successfully');
} catch (error) {
  monitoring.addTraceTag(trace, 'error', error.message);
  monitoring.addTraceLog(trace, 'error', 'Failed to create note', { error: error.message });
} finally {
  monitoring.finishTrace(trace);
}

// Record request metrics
monitoring.recordRequest('createNote', 150, true);

// Subscribe to metrics updates
const unsubscribe = monitoring.subscribe((metrics) => {
  console.log('Performance metrics:', metrics);
});

// Subscribe to alerts
const unsubscribeAlerts = monitoring.subscribeToAlerts((alert) => {
  console.log('Alert triggered:', alert.config.name, alert.config.severity);
});

// Get performance metrics
const metrics = monitoring.getPerformanceMetrics();
console.log('Request latency:', metrics.requestLatency);
console.log('Success rate:', metrics.successRate);
console.log('Throughput:', metrics.throughput);

// Get health status
const health = monitoring.getHealthStatus();
console.log('Healthy:', health.healthy);
console.log('Active alerts:', health.alerts);

// Performance monitoring decorator
class NoteService {
  @monitorPerformance('createNote')
  async createNote(data: any) {
    // Implementation
  }
}
```

### 6. Advanced Testing Suite (`AdvancedTestingSuite.ts`)

#### `AdvancedTestingSuite`

Comprehensive testing with load testing, chaos engineering, and benchmarking.

```typescript
import AdvancedTestingSuite from './AdvancedTestingSuite';

const testingSuite = new AdvancedTestingSuite();

// Load test
const loadTestResult = await testingSuite.runLoadTest(
  'createNote',
  () => ({
    authorId: 'user123',
    text: 'Load test note',
    visibility: 1,
    contentWarning: 0,
    mediaIds: [],
    clientName: 'Test App',
  }),
  {
    duration: 60000, // 1 minute
    concurrency: 10,
    rampUpTime: 10000,
    rampDownTime: 10000,
    maxErrorRate: 5,
  }
);

console.log('Total requests:', loadTestResult.totalRequests);
console.log('Success rate:', (loadTestResult.successfulRequests / loadTestResult.totalRequests) * 100);
console.log('Average latency:', loadTestResult.averageLatency);
console.log('Throughput:', loadTestResult.throughput);

// Chaos test
const chaosTestResult = await testingSuite.runChaosTest(
  'createNote',
  () => ({ /* request data */ }),
  {
    duration: 30000,
    failureRate: 20, // 20% failure rate
    latencyInjection: 1000, // 1 second additional latency
    memoryPressure: true,
    networkPartition: false,
    serviceUnavailable: false,
  }
);

console.log('Resilience score:', chaosTestResult.resilienceScore);
console.log('Recovery time:', chaosTestResult.recoveryTime);

// Performance benchmark
const benchmarkResults = await testingSuite.runBenchmark(['createNote', 'getNote', 'likeNote']);

benchmarkResults.forEach(result => {
  console.log(`${result.operation}:`);
  console.log(`  gRPC latency: ${result.grpcLatency}ms`);
  console.log(`  REST latency: ${result.restLatency}ms`);
  console.log(`  Improvement: ${result.improvement.latency.toFixed(1)}%`);
});

// Stress test
const stressTestResult = await testingSuite.runStressTest(
  'createNote',
  () => ({ /* request data */ }),
  50 // max concurrency
);

console.log('Breaking point:', stressTestResult.breakingPoint);

// Reliability test
const reliabilityResult = await testingSuite.runReliabilityTest(
  'createNote',
  () => ({ /* request data */ }),
  300000 // 5 minutes
);

console.log('Stability score:', reliabilityResult.stabilityScore);
console.log('Success rate:', reliabilityResult.successRate);
```

## Migration Phases

### Phase 1: Disabled
```typescript
// All operations use REST
const flags = {
  phase: 'disabled',
  enableNoteService: false,
  enableUserService: false,
  // ... all features disabled
};
```

### Phase 2: Testing
```typescript
// Core operations use gRPC for internal testing
const flags = {
  phase: 'testing',
  enableNoteService: true,
  enableUserService: true,
  enableCreateNote: true,
  enableGetNote: true,
  enableLoginUser: true,
  enableRegisterUser: true,
};
```

### Phase 3: Gradual Rollout
```typescript
// A/B testing with subset of users
const flags = {
  phase: 'gradual',
  enableNoteService: true,
  enableUserService: true,
  enableTimelineService: true,
  abTestGroup: 'treatment',
  abTestPercentage: 25,
  userSegments: ['power_user', 'premium_user'],
};
```

### Phase 4: Full Rollout
```typescript
// All users use gRPC with advanced features
const flags = {
  phase: 'full',
  enableNoteService: true,
  enableUserService: true,
  enableTimelineService: true,
  enableMediaService: true,
  enableNotificationService: true,
  enableCircuitBreaker: true,
  enableRequestBatching: true,
  enableIntelligentCaching: true,
  enablePerformanceMonitoring: true,
};
```

### Phase 5: Complete
```typescript
// REST APIs removed, gRPC only
const flags = {
  phase: 'complete',
  // All features enabled
};
```

## Best Practices

### 1. Feature Flag Management

```typescript
// Use feature flags for gradual rollout
const manager = GrpcFeatureFlagManager.getInstance();

// Check if user meets criteria before enabling gRPC
if (manager.isGrpcEnabledForOperation('createNote') && 
    manager.meetsPerformanceCriteria()) {
  // Use gRPC
} else {
  // Use REST
}

// Monitor feature flag changes
manager.subscribe((flags) => {
  console.log('Feature flags updated:', flags);
});
```

### 2. Circuit Breaker Usage

```typescript
// Always use circuit breaker for external calls
const circuitBreaker = circuitBreakerManager.getBreaker('grpc_createNote', {
  failureThreshold: 5,
  recoveryTimeoutMs: 30000,
  halfOpenMaxCalls: 3,
});

try {
  const result = await circuitBreaker.execute(async () => {
    return await grpcService.createNote(request);
  });
} catch (error) {
  if (error instanceof CircuitBreakerError) {
    // Fall back to REST
    return await restService.createNote(request);
  }
  throw error;
}
```

### 3. Caching Strategy

```typescript
// Cache read operations
const cacheKey = `getNote_${noteId}_${userId}`;
let result = cache.get(cacheKey);

if (!result) {
  result = await adapter.getNote(request, agent);
  cache.set(cacheKey, result);
}

// Invalidate cache on write operations
await adapter.createNote(request, agent, queryClient);
cache.delete(`getNote_${noteId}_*`); // Invalidate related cache entries
```

### 4. Monitoring and Alerting

```typescript
// Set up monitoring
const monitoring = MonitoringSystem.getInstance();

// Subscribe to alerts
monitoring.subscribeToAlerts((alert) => {
  if (alert.config.severity === 'critical') {
    // Send notification to ops team
    sendSlackNotification(alert);
  }
});

// Use performance decorators
class NoteService {
  @monitorPerformance('createNote')
  async createNote(data: any) {
    // Implementation
  }
}
```

### 5. Testing Strategy

```typescript
// Run comprehensive tests before deployment
const testingSuite = new AdvancedTestingSuite();

// Load test
await testingSuite.runLoadTest('createNote', requestFactory, {
  duration: 300000, // 5 minutes
  concurrency: 20,
  rampUpTime: 30000,
  rampDownTime: 30000,
});

// Chaos test
await testingSuite.runChaosTest('createNote', requestFactory, {
  duration: 120000, // 2 minutes
  failureRate: 10,
  latencyInjection: 500,
});

// Performance benchmark
const results = await testingSuite.runBenchmark(['createNote', 'getNote']);
```

## Error Handling

### Common Error Types

1. **CircuitBreakerError**: Circuit breaker is OPEN
2. **TimeoutError**: Request timed out
3. **NetworkError**: Network connectivity issues
4. **ValidationError**: Invalid request data
5. **AuthenticationError**: Authentication failed

### Error Handling Strategy

```typescript
try {
  const result = await adapter.createNote(request, agent, queryClient);
} catch (error) {
  if (error instanceof CircuitBreakerError) {
    // Circuit breaker is open, use REST fallback
    console.warn('Circuit breaker open, falling back to REST');
    return await restService.createNote(request);
  } else if (error instanceof TimeoutError) {
    // Request timed out, retry with exponential backoff
    return await retryWithBackoff(() => adapter.createNote(request, agent, queryClient));
  } else if (error instanceof NetworkError) {
    // Network issue, use REST fallback
    console.warn('Network error, falling back to REST');
    return await restService.createNote(request);
  } else {
    // Other errors, re-throw
    throw error;
  }
}
```

## Performance Optimization

### 1. Connection Pooling

```typescript
// Enable connection pooling in gRPC config
const grpcConfig = {
  host: 'api.timesocial.com',
  port: 443,
  useTLS: true,
  connectionPooling: true,
  maxConnections: 10,
  keepAlive: true,
};
```

### 2. Request Batching

```typescript
// Enable request batching for multiple operations
const flags = {
  enableRequestBatching: true,
  batchSize: 10,
  batchTimeout: 100, // milliseconds
};
```

### 3. Intelligent Caching

```typescript
// Configure cache for optimal performance
const cacheConfig = {
  ttlSeconds: 300,
  maxSize: 1000,
  enableCompression: true,
  enablePersistence: true,
  maxMemoryUsageMB: 100,
};
```

### 4. Monitoring and Metrics

```typescript
// Enable comprehensive monitoring
const monitoringConfig = {
  enableMetrics: true,
  enableTracing: true,
  enableLogging: true,
  samplingRate: 0.1,
  alertThresholds: {
    maxLatency: 1000,
    maxErrorRate: 0.05,
    minThroughput: 100,
  },
};
```

## Troubleshooting

### Common Issues

1. **Circuit breaker keeps opening**
   - Check gRPC service health
   - Verify network connectivity
   - Review error logs
   - Adjust circuit breaker thresholds

2. **High cache miss rate**
   - Check cache configuration
   - Verify cache key generation
   - Review TTL settings
   - Monitor memory usage

3. **Performance degradation**
   - Check monitoring metrics
   - Review circuit breaker states
   - Verify feature flag configuration
   - Check system resources

4. **Feature flags not working**
   - Verify user segmentation
   - Check performance criteria
   - Review A/B test configuration
   - Clear localStorage

### Debug Commands

```typescript
// Get migration status
const status = MigrationControls.getStatus();
console.log('Migration status:', status);

// Get health status
const health = adapter.getHealthStatus();
console.log('Health status:', health);

// Get cache statistics
const cacheStats = adapter.getCacheStats();
console.log('Cache stats:', cacheStats);

// Reset circuit breakers
adapter.resetCircuitBreakers();

// Clear cache
adapter.clearCache();

// Generate migration report
const report = MigrationControls.generateReport();
console.log('Migration report:', report);
```

## Migration Checklist

### Pre-Migration
- [ ] gRPC services deployed and tested
- [ ] Feature flags configured
- [ ] Circuit breakers configured
- [ ] Caching configured
- [ ] Monitoring configured
- [ ] Testing suite validated

### Phase 1: Testing
- [ ] Enable testing phase
- [ ] Test core operations
- [ ] Verify fallback behavior
- [ ] Monitor error rates
- [ ] Check performance metrics

### Phase 2: Gradual Rollout
- [ ] Enable gradual rollout
- [ ] A/B test with subset of users
- [ ] Monitor performance metrics
- [ ] Collect user feedback
- [ ] Adjust configuration as needed

### Phase 3: Full Rollout
- [ ] Enable full rollout
- [ ] Monitor all users
- [ ] Optimize performance
- [ ] Prepare for completion

### Phase 4: Complete
- [ ] Remove REST APIs
- [ ] Final optimization
- [ ] Update documentation
- [ ] Celebrate! 🎉

## Support

For issues or questions:
1. Check this API reference
2. Review migration logs
3. Check feature flag status
4. Contact development team

---

**Note**: This API reference is continuously updated as new features are added. Always refer to the latest version for the most up-to-date information.