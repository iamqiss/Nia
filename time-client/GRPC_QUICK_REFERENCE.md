# Time gRPC Quick Reference Guide

## 🚀 Quick Start

### 1. Initialize Service
```typescript
import { timeGrpcService } from './src/services/TimeGrpcService';

// Initialize
await timeGrpcService.initializeClient('api.timesocial.com', 443);
```

### 2. Use React Hooks
```typescript
import { useNotes, useUsers, useMessaging } from './src/hooks/useTimeGrpc';

const { createNote, getNote } = useNotes();
const { loginUser } = useUsers();
const { sendMessage } = useMessaging();
```

## 📋 Service Methods

### Note Service
```typescript
// Create note
await createNote({
  authorId: 'user123',
  text: 'Hello world!',
  visibility: 0, // Public
  contentWarning: 0 // None
});

// Get note
await getNote({
  noteId: 'note123',
  requestingUserId: 'user123'
});

// Like note
await likeNote({
  noteId: 'note123',
  userId: 'user123',
  like: true
});
```

### User Service
```typescript
// Login
await loginUser({
  email: 'user@example.com',
  password: 'password123',
  deviceName: 'React Native App'
});

// Register
await registerUser({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'password123',
  displayName: 'John Doe'
});

// Get profile
await getUserProfile({
  userId: 'user123'
});
```

### Messaging Service
```typescript
// Send message
await sendMessage({
  senderId: 'user123',
  recipientId: 'user456',
  content: 'Hello!',
  messageType: 0 // Text
});

// Get messages
await getMessages({
  userId: 'user123',
  chatId: 'chat123',
  limit: 50,
  offset: 0
});
```

### Search Service
```typescript
// Search users
await searchUsers({
  query: 'john',
  limit: 20,
  offset: 0
});

// Search notes
await searchNotes({
  query: 'react native',
  limit: 20,
  offset: 0
});
```

### Drafts Service
```typescript
// Create draft
await createDraft({
  userId: 'user123',
  content: 'This is a draft',
  title: 'My Draft'
});

// Get user drafts
await getUserDrafts({
  userId: 'user123',
  limit: 20,
  offset: 0
});
```

### Lists Service
```typescript
// Create list
await createList({
  userId: 'user123',
  name: 'My Favorites',
  description: 'A list of my favorite users',
  isPrivate: false
});

// Get user lists
await getUserLists({
  userId: 'user123',
  limit: 20,
  offset: 0
});
```

### Starterpacks Service
```typescript
// Create starterpack
await createStarterpack({
  userId: 'user123',
  name: 'Tech News',
  description: 'A starterpack for tech enthusiasts',
  category: 'Technology',
  isPublic: true
});

// Get user starterpacks
await getUserStarterpacks({
  userId: 'user123',
  limit: 20,
  offset: 0
});
```

### Fanout Service
```typescript
// Initiate fanout
await initiateFanout({
  noteId: 'note123',
  userId: 'user123'
});

// Get fanout status
await getFanoutJobStatus({
  jobId: 'job123'
});
```

## 🔧 Error Handling

```typescript
try {
  const result = await createNote({
    authorId: 'user123',
    text: 'Hello world!'
  });
  
  if (result.success) {
    console.log('Note created:', result.data);
  } else {
    console.error('Error:', result.errorMessage);
  }
} catch (error) {
  console.error('Exception:', error.message);
}
```

## 📱 Platform-Specific Usage

### iOS Swift
```swift
// Access native bridge
TimeGrpcBridge.createNote([
  "authorId": "user123",
  "text": "Hello from iOS!"
]) { result, error in
  if let error = error {
    print("Error: \(error)")
  } else {
    print("Success: \(result)")
  }
}
```

### Android Java
```java
// Access native bridge
TimeGrpcReactModule module = new TimeGrpcReactModule(reactContext);
module.createNote(requestData, new Promise() {
  @Override
  public void resolve(Object value) {
    // Handle success
  }
  
  @Override
  public void reject(String code, String message) {
    // Handle error
  }
});
```

## 🧪 Testing

```typescript
// Health check
const health = await timeGrpcService.healthCheck();
console.log('Service health:', health);

// Test connection
const isConnected = timeGrpcService.isClientInitialized();
console.log('Connected:', isConnected);
```

## 🔄 Regeneration

When server APIs change:

```bash
# Regenerate all files
./scripts/generate-protos-simple.sh

# Test integration
node scripts/test-grpc-integration.js
```

## 📊 Response Types

### Common Response
```typescript
interface GrpcResponse<T = any> {
  success: boolean;
  errorMessage?: string;
  data?: T;
}
```

### Note Response
```typescript
interface Note {
  id: string;
  authorId: string;
  text: string;
  visibility: number;
  contentWarning: number;
  mediaIds: string[];
  createdAt: { seconds: number; nanos: number };
  updatedAt: { seconds: number; nanos: number };
  metrics: {
    likeCount: number;
    renoteCount: number;
    replyCount: number;
    // ... more metrics
  };
}
```

### User Response
```typescript
interface UserProfile {
  userId: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  isPrivate: boolean;
  followerCount: number;
  followingCount: number;
  noteCount: number;
}
```

## 🚨 Common Issues

### 1. Client Not Initialized
```typescript
// Check initialization
if (!timeGrpcService.isClientInitialized()) {
  await timeGrpcService.initializeClient('host', port);
}
```

### 2. Network Errors
```typescript
// Handle network issues
try {
  const result = await createNote(data);
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    // Retry or show offline message
  }
}
```

### 3. Type Errors
```typescript
// Ensure proper typing
import { CreateNoteRequest } from './src/services/TimeGrpcService';

const request: CreateNoteRequest = {
  authorId: 'user123',
  text: 'Hello world!'
};
```

## 📚 More Resources

- [Complete Integration Guide](./GRPC_INTEGRATION_COMPLETE.md)
- [Example Component](./src/examples/GrpcServiceExample.tsx)
- [Service Interface](./src/services/TimeGrpcService.ts)
- [React Hooks](./src/hooks/useTimeGrpc.ts)