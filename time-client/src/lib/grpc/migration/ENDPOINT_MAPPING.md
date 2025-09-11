# REST to gRPC Endpoint Mapping

## Overview

This document maps all REST API endpoints used in the Time Social app to their corresponding gRPC services and methods.

## Core Services Mapping

### 1. Note Service (sonet.note.NoteService)

#### REST Endpoints → gRPC Methods

| REST Endpoint | gRPC Method | Description | Status |
|---------------|-------------|-------------|---------|
| `POST /com.atproto.repo.applyWrites` (create post) | `CreateNote` | Create a new note/post | ✅ Mapped |
| `GET /com.atproto.repo.getRecord` (get post) | `GetNote` | Get a note by ID | ✅ Mapped |
| `POST /com.atproto.repo.deleteRecord` (delete post) | `DeleteNote` | Delete a note | ✅ Mapped |
| `POST /com.atproto.repo.createRecord` (like) | `LikeNote` | Like/unlike a note | ✅ Mapped |
| `POST /com.atproto.repo.createRecord` (repost) | `RenoteNote` | Repost/renote a note | ✅ Mapped |
| `GET /app.bsky.feed.getAuthorFeed` | `GetUserNotes` | Get user's notes/timeline | ✅ Mapped |
| `GET /app.bsky.feed.getPostThread` | `GetNoteThread` | Get note thread/replies | ✅ Mapped |
| `GET /app.bsky.feed.searchPosts` | `SearchNotes` | Search notes | ✅ Mapped |

#### Implementation Details

**Create Note:**
```typescript
// REST
await agent.com.atproto.repo.applyWrites({
  repo: did,
  writes: [{
    $type: 'com.atproto.repo.applyWrites#create',
    collection: 'app.bsky.feed.post',
    rkey: rkey,
    value: record,
  }]
});

// gRPC
await grpcService.createNote({
  authorId: userId,
  text: text,
  visibility: NoteVisibility.PUBLIC,
  contentWarning: ContentWarning.NONE,
  // ... other fields
});
```

**Get Note:**
```typescript
// REST
await agent.getPost({ repo: did, rkey: rkey });

// gRPC
await grpcService.getNote({
  noteId: noteId,
  requestingUserId: userId,
  includeThread: true
});
```

**Like Note:**
```typescript
// REST
await agent.like(uri, cid);

// gRPC
await grpcService.likeNote({
  noteId: noteId,
  userId: userId,
  like: true
});
```

### 2. User Service (sonet.user.UserService)

#### REST Endpoints → gRPC Methods

| REST Endpoint | gRPC Method | Description | Status |
|---------------|-------------|-------------|---------|
| `POST /com.atproto.server.createAccount` | `RegisterUser` | User registration | ✅ Mapped |
| `POST /com.atproto.server.createSession` | `LoginUser` | User login | ✅ Mapped |
| `POST /com.atproto.server.refreshSession` | `RefreshToken` | Refresh session | ✅ Mapped |
| `POST /com.atproto.server.deleteSession` | `LogoutUser` | User logout | ✅ Mapped |
| `GET /com.atproto.identity.resolveHandle` | `GetUserProfile` | Get user profile | ✅ Mapped |
| `POST /com.atproto.repo.putRecord` (profile) | `UpdateUserProfile` | Update profile | ✅ Mapped |
| `POST /com.atproto.server.requestPasswordReset` | `ResetPassword` | Password reset | ✅ Mapped |
| `POST /com.atproto.server.resetPassword` | `ConfirmPasswordReset` | Confirm password reset | ✅ Mapped |

#### Implementation Details

**User Login:**
```typescript
// REST
await agent.login({
  identifier: email,
  password: password
});

// gRPC
await grpcService.loginUser({
  credentials: {
    email: email,
    password: password
  },
  deviceName: 'Time Social App'
});
```

**User Registration:**
```typescript
// REST
await agent.createAccount({
  email: email,
  password: password,
  handle: handle
});

// gRPC
await grpcService.registerUser({
  username: handle,
  email: email,
  password: password,
  displayName: handle,
  acceptTerms: true,
  acceptPrivacy: true
});
```

### 3. Timeline Service (sonet.timeline.TimelineService)

#### REST Endpoints → gRPC Methods

| REST Endpoint | gRPC Method | Description | Status |
|---------------|-------------|-------------|---------|
| `GET /app.bsky.feed.getTimeline` | `GetTimeline` | Get home timeline | ✅ Mapped |
| `GET /app.bsky.feed.getAuthorFeed` | `GetUserTimeline` | Get user timeline | ✅ Mapped |
| `GET /app.bsky.feed.getTimeline` (refresh) | `RefreshTimeline` | Refresh timeline | ✅ Mapped |
| `POST /app.bsky.feed.getTimeline` (stream) | `SubscribeTimelineUpdates` | Real-time updates | ✅ Mapped |

#### Implementation Details

**Get Timeline:**
```typescript
// REST
await agent.getTimeline({
  algorithm: 'reverse-chronological',
  limit: 50,
  cursor: cursor
});

// gRPC
await grpcService.getTimeline({
  userId: userId,
  algorithm: TimelineAlgorithm.CHRONOLOGICAL,
  pagination: {
    limit: 50,
    cursor: cursor
  }
});
```

### 4. Media Service (sonet.media.MediaService)

#### REST Endpoints → gRPC Methods

| REST Endpoint | gRPC Method | Description | Status |
|---------------|-------------|-------------|---------|
| `POST /com.atproto.repo.uploadBlob` | `Upload` | Upload media | ✅ Mapped |
| `GET /com.atproto.repo.getRecord` (media) | `GetMedia` | Get media by ID | ✅ Mapped |
| `POST /com.atproto.repo.deleteRecord` (media) | `DeleteMedia` | Delete media | ✅ Mapped |
| `GET /app.bsky.actor.getProfile` (media list) | `ListUserMedia` | List user's media | ✅ Mapped |

#### Implementation Details

**Upload Media:**
```typescript
// REST
await agent.uploadBlob(file, {
  encoding: mimeType
});

// gRPC
await grpcService.upload({
  userId: userId,
  fileData: fileData,
  mimeType: mimeType,
  fileName: fileName
});
```

### 5. Notification Service (sonet.notification.NotificationService)

#### REST Endpoints → gRPC Methods

| REST Endpoint | gRPC Method | Description | Status |
|---------------|-------------|-------------|---------|
| `GET /app.bsky.notification.listNotifications` | `ListNotifications` | Get notifications | ✅ Mapped |
| `POST /app.bsky.notification.updateSeen` | `MarkNotificationRead` | Mark as read | ✅ Mapped |

## Advanced Features Mapping

### Real-time Updates

| REST Feature | gRPC Feature | Description | Status |
|--------------|--------------|-------------|---------|
| WebSocket connections | Server streaming | Real-time timeline updates | ✅ Mapped |
| Polling for updates | Client streaming | Efficient data transfer | ✅ Mapped |
| Event subscriptions | Bidirectional streaming | Full duplex communication | ✅ Mapped |

### Authentication & Authorization

| REST Feature | gRPC Feature | Description | Status |
|--------------|--------------|-------------|---------|
| JWT tokens | Metadata headers | Authentication | ✅ Mapped |
| Session management | gRPC interceptors | Authorization | ✅ Mapped |
| Rate limiting | gRPC middleware | Request throttling | ✅ Mapped |

## Migration Strategy by Endpoint

### Phase 1: Core Operations (Testing)
- ✅ Create Note
- ✅ Get Note
- ✅ Like Note
- ✅ User Login
- ✅ User Registration

### Phase 2: Timeline Operations (Gradual Rollout)
- ✅ Get Timeline
- ✅ Get User Timeline
- ✅ Refresh Timeline

### Phase 3: Media Operations (Full Rollout)
- ✅ Upload Media
- ✅ Get Media
- ✅ Delete Media

### Phase 4: Advanced Features (Complete)
- ✅ Real-time Updates
- ✅ Notifications
- ✅ Search

## Error Handling Mapping

| REST Error | gRPC Error | Description |
|------------|------------|-------------|
| `400 Bad Request` | `INVALID_ARGUMENT` | Invalid request parameters |
| `401 Unauthorized` | `UNAUTHENTICATED` | Authentication required |
| `403 Forbidden` | `PERMISSION_DENIED` | Insufficient permissions |
| `404 Not Found` | `NOT_FOUND` | Resource not found |
| `409 Conflict` | `ALREADY_EXISTS` | Resource already exists |
| `429 Too Many Requests` | `RESOURCE_EXHAUSTED` | Rate limit exceeded |
| `500 Internal Server Error` | `INTERNAL` | Server error |
| `503 Service Unavailable` | `UNAVAILABLE` | Service unavailable |

## Performance Considerations

### Request/Response Size
- **REST**: JSON format, larger payload
- **gRPC**: Binary format, smaller payload (~30% reduction)

### Connection Management
- **REST**: HTTP/1.1, multiple connections
- **gRPC**: HTTP/2, single connection with multiplexing

### Streaming
- **REST**: WebSocket or Server-Sent Events
- **gRPC**: Native streaming support

### Compression
- **REST**: Optional gzip compression
- **gRPC**: Built-in compression (gzip, deflate)

## Testing Strategy

### Unit Tests
- Test each endpoint mapping
- Test error handling conversion
- Test data format conversion

### Integration Tests
- Test gRPC service integration
- Test REST fallback behavior
- Test feature flag switching

### Performance Tests
- Compare REST vs gRPC performance
- Test streaming performance
- Test connection pooling

## Monitoring & Observability

### Metrics
- Request latency (REST vs gRPC)
- Error rates by endpoint
- Feature flag usage
- A/B test results

### Logging
- Request/response logging
- Error tracking
- Performance metrics
- Migration progress

### Alerting
- gRPC service health
- High error rates
- Performance degradation
- Migration issues

## Rollback Strategy

### Automatic Rollback
- gRPC service unavailable → REST fallback
- High error rate → REST fallback
- Performance degradation → REST fallback

### Manual Rollback
- Feature flag disable
- Phase rollback
- Service restart

## Success Criteria

### Performance
- 30% reduction in request size
- 20% improvement in latency
- 50% improvement in throughput

### Reliability
- 99.9% uptime
- <1% error rate
- <100ms response time

### User Experience
- No visible changes to users
- Improved app performance
- Better real-time updates

---

**Note**: This mapping is continuously updated as new endpoints are identified and migrated. All mappings are tested and validated before production deployment.