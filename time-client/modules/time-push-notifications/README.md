# Time Push Notifications

A comprehensive, PhD-level push notification system for React Native that eliminates Expo dependency and integrates directly with time-server's gRPC API.

## 🚀 Features

- **Native iOS & Android Support**: Direct integration with APNS and FCM
- **gRPC Integration**: Seamless communication with time-server
- **Rich Notifications**: Media content, custom actions, and interactive elements
- **Background Processing**: Advanced background notification handling
- **Device Management**: Automatic device registration and token management
- **Analytics & Monitoring**: Comprehensive notification tracking and statistics
- **Expo Migration**: Seamless migration from Expo notifications
- **TypeScript Support**: Full type safety and IntelliSense
- **Testing Framework**: Comprehensive test suite

## 📋 Requirements

- React Native 0.60+
- iOS 11.0+
- Android API 21+
- Node.js 16+
- Xcode 12+ (iOS)
- Android Studio (Android)

## 🛠 Installation

### 1. Install Dependencies

```bash
npm install @grpc/grpc-js @grpc/proto-loader
# or
yarn add @grpc/grpc-js @grpc/proto-loader
```

### 2. iOS Setup

Add to your `ios/Podfile`:

```ruby
pod 'TimePushNotifications', :path => '../modules/time-push-notifications'
```

Run:

```bash
cd ios && pod install
```

### 3. Android Setup

Add to your `android/settings.gradle`:

```gradle
include ':time-push-notifications'
project(':time-push-notifications').projectDir = new File(rootProject.projectDir, '../modules/time-push-notifications/android')
```

Add to your `android/app/build.gradle`:

```gradle
dependencies {
    implementation project(':time-push-notifications')
}
```

### 4. Firebase Setup

#### iOS
1. Add `GoogleService-Info.plist` to your iOS project
2. Enable Push Notifications capability in Xcode
3. Add Background Modes capability

#### Android
1. Add `google-services.json` to your `android/app` directory
2. Enable Firebase Cloud Messaging in Firebase Console

## 📖 Usage

### Basic Setup

```typescript
import { timePushNotifications, TimePushNotificationsConfig } from './modules/time-push-notifications';

const config: TimePushNotificationsConfig = {
  server: {
    host: 'your-server.com',
    port: 50051,
    useSSL: true,
  },
  fcm: {
    autoInitEnabled: true,
    projectId: 'your-project-id',
  },
};

// Initialize
await timePushNotifications.initialize(config);

// Register device
await timePushNotifications.registerDevice('user123', {
  appVersion: '1.0.0',
  osVersion: '15.0',
  deviceModel: 'iPhone',
  timezone: 'UTC',
  language: 'en',
});
```

### Using the React Hook

```typescript
import { useTimePushNotifications } from './modules/time-push-notifications';

function MyComponent() {
  const {
    isInitialized,
    isRegistered,
    deviceToken,
    badgeCount,
    initialize,
    registerDevice,
    sendNotification,
    onNotificationReceived,
    onNotificationOpened,
  } = useTimePushNotifications({
    config: {
      server: { host: 'localhost', port: 50051, useSSL: false },
      fcm: { autoInitEnabled: true, projectId: 'test' },
    },
    userId: 'user123',
    autoRegister: true,
  });

  useEffect(() => {
    onNotificationReceived((data) => {
      console.log('Notification received:', data);
    });

    onNotificationOpened((data) => {
      console.log('Notification opened:', data);
    });
  }, []);

  const handleSendNotification = async () => {
    await sendNotification({
      id: 'test-1',
      title: 'Hello World',
      body: 'This is a test notification',
      category: 'general',
    });
  };

  return (
    <View>
      <Text>Initialized: {isInitialized ? 'Yes' : 'No'}</Text>
      <Text>Registered: {isRegistered ? 'Yes' : 'No'}</Text>
      <Text>Badge Count: {badgeCount}</Text>
      <Button title="Send Notification" onPress={handleSendNotification} />
    </View>
  );
}
```

### Migration from Expo

```typescript
import { notificationMigration } from './modules/time-push-notifications';

// Initialize migration
await notificationMigration.initialize();

// Use Expo-compatible API
const permissions = await notificationMigration.getPermissionsAsync();
const token = await notificationMigration.getDevicePushTokenAsync();

// Set up listeners
notificationMigration.addNotificationReceivedListener((notification) => {
  console.log('Received:', notification);
});

notificationMigration.addNotificationResponseReceivedListener((response) => {
  console.log('Opened:', response);
});
```

## 🔧 Advanced Configuration

### Custom Notification Categories

```typescript
// iOS
import { TimePushNotifications } from './modules/time-push-notifications/ios';

const categories = [
  // Like notifications
  {
    identifier: 'LIKE_CATEGORY',
    actions: [
      { identifier: 'LIKE_ACTION', title: 'Like' },
      { identifier: 'REPLY_ACTION', title: 'Reply' },
    ],
  },
  // Follow notifications
  {
    identifier: 'FOLLOW_CATEGORY',
    actions: [
      { identifier: 'FOLLOW_BACK_ACTION', title: 'Follow Back' },
    ],
  },
];

TimePushNotifications.configureNotificationCategories(categories);
```

### Android Notification Channels

```typescript
// Android channels are automatically created, but you can customize them
await notificationMigration.setNotificationChannelAsync('like_notifications', {
  name: 'Like Notifications',
  description: 'Notifications for likes on your posts',
  importance: 4, // HIGH
  sound: 'like.mp3',
  vibrationPattern: [250, 250, 250],
  showBadge: true,
});
```

### gRPC Server Integration

```typescript
// Send notification via gRPC
await timePushNotifications.sendPushNotification({
  id: 'server-notification',
  title: 'Server Notification',
  body: 'This came from the server',
  category: 'server',
  data: { source: 'grpc' },
});

// Sync preferences
await timePushNotifications.syncNotificationPreferences({
  like: { enabled: true, pushEnabled: true, frequency: 'immediate' },
  follow: { enabled: true, pushEnabled: true, frequency: 'immediate' },
  mention: { enabled: true, pushEnabled: true, frequency: 'immediate' },
});

// Get statistics
const stats = await timePushNotifications.getNotificationStats();
console.log('Delivery rate:', stats.deliveryRate);
console.log('Open rate:', stats.openRate);
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test -- --coverage

# Run specific test
npm test -- --testNamePattern="Device Registration"
```

## 📊 Monitoring and Analytics

### Event Tracking

```typescript
// Track notification events
timePushNotifications.on('notificationReceived', (data) => {
  // Track with your analytics service
  analytics.track('notification_received', {
    notificationId: data.id,
    category: data.category,
    timestamp: new Date(),
  });
});

timePushNotifications.on('notificationOpened', (data) => {
  analytics.track('notification_opened', {
    notificationId: data.id,
    action: data.action,
    timestamp: new Date(),
  });
});
```

### Debug Information

```typescript
const debugInfo = await timePushNotifications.getDebugInfo();
console.log('Debug Info:', debugInfo);
```

## 🔒 Security Considerations

1. **Token Management**: Device tokens are automatically rotated and updated
2. **gRPC Security**: Use TLS/SSL for production gRPC connections
3. **Data Validation**: All notification data is validated before processing
4. **Rate Limiting**: Built-in rate limiting prevents spam
5. **Authentication**: gRPC calls require proper authentication

## 🚨 Troubleshooting

### Common Issues

1. **iOS Build Errors**
   - Ensure Push Notifications capability is enabled
   - Check that GoogleService-Info.plist is properly added
   - Verify iOS deployment target is 11.0+

2. **Android Build Errors**
   - Ensure google-services.json is in the correct location
   - Check that Firebase is properly configured
   - Verify minSdkVersion is 21+

3. **gRPC Connection Issues**
   - Check server host and port configuration
   - Verify SSL/TLS settings
   - Ensure network connectivity

4. **Notification Not Received**
   - Check device permissions
   - Verify device registration
   - Check server logs for errors

### Debug Mode

```typescript
// Enable debug logging
TimePushNotifications.setDebugLoggingEnabled(true);

// Get detailed debug information
const debugInfo = await timePushNotifications.getDebugInfo();
console.log('Debug Info:', debugInfo);
```

## 📈 Performance Optimization

1. **Batch Operations**: Use batch notification sending for better performance
2. **Background Processing**: Optimize background notification handling
3. **Memory Management**: Proper cleanup of event listeners and resources
4. **Network Optimization**: Use connection pooling and keep-alive

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- GitHub Issues: [Create an issue](https://github.com/time-app/time-push-notifications/issues)
- Documentation: [Read the docs](https://github.com/time-app/time-push-notifications/wiki)
- Email: support@time.app

## 🔄 Migration from Expo

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions.

## 📚 API Reference

See [API.md](./API.md) for complete API documentation.