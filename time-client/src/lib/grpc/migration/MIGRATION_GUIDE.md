# gRPC Migration Guide

## Overview

This guide outlines the complete migration from REST APIs to gRPC for the Time Social app. The migration is designed to be gradual, safe, and reversible.

## Architecture

### Components

1. **Feature Flags** (`FeatureFlags.ts`)
   - Controls which features use gRPC vs REST
   - Supports A/B testing and gradual rollout
   - Persistent storage for configuration

2. **Migration Adapter** (`MigrationAdapter.ts`)
   - Switches between gRPC and REST based on feature flags
   - Provides fallback to REST if gRPC fails
   - Handles request/response format conversion

3. **API Migration Service** (`ApiMigrationService.ts`)
   - High-level API for common operations
   - Integrates with existing React Query hooks
   - Maintains compatibility with existing code

4. **Migration Script** (`MigrationScript.ts`)
   - Manages migration phases
   - Provides health checks and reporting
   - Enables gradual rollout control

## Migration Phases

### Phase 1: Disabled (Default)
- All operations use REST APIs
- gRPC services are not initialized
- Safe fallback state

### Phase 2: Testing
- gRPC services initialized
- Core operations (createNote, getNote, loginUser) use gRPC
- Internal testing only
- Full REST fallback

### Phase 3: Gradual Rollout
- A/B testing with subset of users (10-50%)
- More operations migrated to gRPC
- Performance monitoring
- Easy rollback capability

### Phase 4: Full Rollout
- All users use gRPC
- All operations migrated
- REST APIs still available as fallback
- Performance optimization

### Phase 5: Complete
- REST APIs removed
- gRPC only
- Final optimization

## Usage

### Basic Setup

```typescript
import MigrationScript from '#/lib/grpc/migration/MigrationScript';

const migrationScript = new MigrationScript();

// Initialize with gRPC configuration
await migrationScript.initialize({
  host: 'api.timesocial.com',
  port: 443,
  useTLS: true,
});
```

### Starting Migration

```typescript
// Start testing phase
await migrationScript.startTestingPhase();

// Start gradual rollout (25% of users)
await migrationScript.startGradualRollout(25);

// Start full rollout
await migrationScript.startFullRollout();

// Complete migration
await migrationScript.completeMigration();
```

### Using in Components

```typescript
import { useGrpcFeatureFlags } from '#/lib/grpc/migration/FeatureFlags';
import { usePostQuery } from '#/state/queries/grpc-migration/post';

function MyComponent() {
  const { isGrpcEnabledForOperation } = useGrpcFeatureFlags();
  const { data: post } = usePostQuery('post-uri');
  
  // The hook automatically uses gRPC or REST based on feature flags
  return <div>{post?.text}</div>;
}
```

### Direct API Usage

```typescript
import ApiMigrationService from '#/lib/grpc/migration/ApiMigrationService';

const apiService = ApiMigrationService.getInstance();

// Create a post (uses gRPC or REST based on flags)
const result = await apiService.createPost(agent, queryClient, {
  text: 'Hello from migration!',
  media: [],
});

// Like a post
await apiService.likePost(agent, postUri, postCid);
```

## Feature Flags

### Core Services
- `enableNoteService`: Note operations
- `enableUserService`: User operations
- `enableTimelineService`: Timeline operations
- `enableMediaService`: Media operations
- `enableNotificationService`: Notification operations

### Specific Operations
- `enableCreateNote`: Create note operation
- `enableGetNote`: Get note operation
- `enableLikeNote`: Like note operation
- `enableRenoteNote`: Renote note operation
- `enableDeleteNote`: Delete note operation
- `enableLoginUser`: User login operation
- `enableRegisterUser`: User registration operation
- `enableGetTimeline`: Get timeline operation
- `enableGetUserTimeline`: Get user timeline operation
- `enableUploadMedia`: Media upload operation
- `enableGetNotifications`: Get notifications operation

### Advanced Features
- `enableStreaming`: Real-time streaming
- `enableRealTimeUpdates`: Real-time updates
- `enableConnectionPooling`: Connection pooling
- `enableCompression`: gRPC compression

## Monitoring

### Health Checks

```typescript
const health = await migrationScript.healthCheck();
console.log('Health status:', health);
```

### Migration Report

```typescript
const report = migrationScript.generateReport();
console.log('Migration report:', report);
```

### Status Monitoring

```typescript
const status = migrationScript.getStatus();
console.log('Current status:', status);
```

## Rollback

### Automatic Rollback
- gRPC failures automatically fall back to REST
- No user impact during failures
- Logs all fallback events

### Manual Rollback

```typescript
// Rollback to previous phase
await migrationScript.rollback();

// Rollback to specific phase
migrationScript.setMigrationPhase('testing');
```

## Testing

### Unit Tests
- Test each migration adapter method
- Test feature flag logic
- Test fallback behavior

### Integration Tests
- Test gRPC service integration
- Test REST fallback
- Test A/B testing logic

### Performance Tests
- Compare gRPC vs REST performance
- Test connection pooling
- Test streaming performance

## Configuration

### Environment Variables
```bash
GRPC_HOST=api.timesocial.com
GRPC_PORT=443
GRPC_USE_TLS=true
GRPC_TIMEOUT=30
```

### Feature Flag Overrides
```typescript
// Override specific features
migrationScript.enableFeatures({
  enableCreateNote: true,
  enableGetNote: true,
  enableLikeNote: false,
});
```

## Troubleshooting

### Common Issues

1. **gRPC Service Not Available**
   - Check network connectivity
   - Verify gRPC server is running
   - Check TLS configuration

2. **Feature Flags Not Working**
   - Clear localStorage
   - Check feature flag configuration
   - Verify migration phase

3. **Performance Issues**
   - Enable connection pooling
   - Enable compression
   - Check network latency

### Debug Mode

```typescript
// Enable debug logging
console.log('gRPC enabled for createNote:', 
  migrationScript.isGrpcEnabled('createNote'));
console.log('Current phase:', migrationScript.getMigrationPhase());
```

## Best Practices

1. **Start Small**: Begin with testing phase
2. **Monitor Closely**: Watch performance and error rates
3. **Gradual Rollout**: Use A/B testing for safe rollout
4. **Keep Fallbacks**: Always have REST fallback ready
5. **Test Thoroughly**: Comprehensive testing at each phase
6. **Document Changes**: Keep migration log updated
7. **Monitor Performance**: Track gRPC vs REST performance
8. **User Communication**: Inform users of improvements

## Migration Checklist

### Pre-Migration
- [ ] gRPC services deployed and tested
- [ ] Feature flags configured
- [ ] Migration scripts ready
- [ ] Monitoring in place
- [ ] Rollback plan prepared

### Phase 1: Testing
- [ ] Enable testing phase
- [ ] Test core operations
- [ ] Verify fallback behavior
- [ ] Monitor error rates

### Phase 2: Gradual Rollout
- [ ] Enable gradual rollout
- [ ] A/B test with subset of users
- [ ] Monitor performance metrics
- [ ] Collect user feedback

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

For questions or issues during migration:
1. Check this guide
2. Review migration logs
3. Check feature flag status
4. Contact development team

---

**Note**: This migration is designed to be safe and reversible. Always test thoroughly and monitor closely during rollout.