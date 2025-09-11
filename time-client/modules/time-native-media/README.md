# Time Native Media

A high-performance, PhD-level engineered native media solution for React Native applications, providing advanced video and image handling with sophisticated caching, optimization, and performance monitoring.

## 🚀 Features

### Video Player
- **Native Performance**: Built on AVPlayer (iOS) and ExoPlayer (Android)
- **Advanced Caching**: Intelligent disk and memory caching with LRU eviction
- **Adaptive Bitrate**: Dynamic quality adjustment based on network conditions
- **Hardware Acceleration**: GPU-accelerated video decoding
- **Background Playback**: Seamless audio playback in background
- **DRM Support**: Widevine, PlayReady, and FairPlay DRM integration
- **Analytics**: Comprehensive playback analytics and performance metrics

### Image Cache
- **High-Performance Loading**: Optimized image loading with progressive JPEG support
- **Smart Caching**: Multi-level caching with intelligent prefetching
- **Format Support**: JPEG, PNG, WebP, GIF, and more
- **Transformations**: Real-time image processing and transformations
- **Memory Management**: Advanced memory optimization and garbage collection
- **Network Optimization**: Adaptive loading based on network conditions

### Performance Monitoring
- **Real-time Metrics**: Memory, CPU, network, and battery monitoring
- **Intelligent Alerts**: Proactive performance issue detection
- **Optimization Engine**: Automatic performance optimization
- **Analytics Dashboard**: Comprehensive performance analytics
- **Device Adaptation**: Automatic optimization based on device capabilities

## 📦 Installation

### Prerequisites
- React Native 0.79+
- iOS 15.1+ / Android API 21+
- Node.js 20+

### Install Dependencies

```bash
# Install the main package
npm install time-native-media

# Install peer dependencies
npm install react-native-video react-native-fast-image
```

### iOS Setup

1. **Add to Podfile**:
```ruby
pod 'time-native-media', :path => '../node_modules/time-native-media'
```

2. **Install pods**:
```bash
cd ios && pod install
```

3. **Update Info.plist**:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### Android Setup

1. **Update android/settings.gradle**:
```gradle
include ':time-native-media'
project(':time-native-media').projectDir = new File(rootProject.projectDir, '../node_modules/time-native-media/android')
```

2. **Update android/app/build.gradle**:
```gradle
dependencies {
    implementation project(':time-native-media')
}
```

3. **Update MainApplication.java**:
```java
import com.timenativemedia.TimeNativeMediaPackage;

@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new TimeNativeMediaPackage()
    );
}
```

## 🎯 Quick Start

### Basic Video Player

```tsx
import React from 'react';
import { View } from 'react-native';
import { TimeNativeVideoPlayer, useVideoPlayer } from 'time-native-media';

const VideoScreen = () => {
  const {
    playerRef,
    isPlaying,
    isLoading,
    play,
    pause,
    seek,
  } = useVideoPlayer({
    source: {
      uri: 'https://example.com/video.mp4',
      type: 'video',
      priority: 'normal',
    },
    autoPlay: false,
    onLoad: (data) => console.log('Video loaded:', data),
    onError: (error) => console.error('Video error:', error),
  });

  return (
    <View style={{ flex: 1 }}>
      <TimeNativeVideoPlayer
        ref={playerRef}
        source={{
          uri: 'https://example.com/video.mp4',
          type: 'video',
        }}
        style={{ flex: 1 }}
        paused={!isPlaying}
        onLoadStart={() => console.log('Loading started')}
        onLoad={(data) => console.log('Video loaded:', data)}
        onError={(error) => console.error('Error:', error)}
      />
    </View>
  );
};
```

### Advanced Image Caching

```tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { TimeNativeImageCache, useImageCache } from 'time-native-media';

const ImageGallery = () => {
  const { imageRef, isLoading, load } = useImageCache({
    source: {
      uri: 'https://example.com/image.jpg',
      type: 'image',
      priority: 'high',
      cachePolicy: 'memory-disk',
    },
    autoLoad: true,
    onLoad: (result) => console.log('Image loaded:', result),
  });

  return (
    <ScrollView>
      <TimeNativeImageCache
        ref={imageRef}
        source={{
          uri: 'https://example.com/image.jpg',
          type: 'image',
        }}
        style={{ width: 300, height: 200 }}
        resizeMode="cover"
        blurRadius={2}
        borderRadius={10}
        onLoad={(result) => console.log('Image loaded:', result)}
        onError={(error) => console.error('Error:', error)}
      />
    </ScrollView>
  );
};
```

### Unified Media Component

```tsx
import React from 'react';
import { View } from 'react-native';
import { TimeMediaView, useMediaManager } from 'time-native-media';

const MediaScreen = () => {
  const { manager, configure, getCacheStats } = useMediaManager({
    config: {
      video: {
        preloadBufferSize: 30,
        maxBufferSize: 60,
        adaptiveBitrateEnabled: true,
      },
      image: {
        maxMemorySize: 100 * 1024 * 1024, // 100 MB
        compressionQuality: 0.8,
        enableWebP: true,
      },
    },
    autoOptimize: true,
  });

  return (
    <View style={{ flex: 1 }}>
      <TimeMediaView
        source={{
          uri: 'https://example.com/media.mp4',
          type: 'video',
          priority: 'high',
        }}
        style={{ flex: 1 }}
        config={{
          video: {
            adaptiveBitrateEnabled: true,
            hardwareAccelerationEnabled: true,
          },
        }}
        onLoad={(result) => console.log('Media loaded:', result)}
        onError={(error) => console.error('Error:', error)}
      />
    </View>
  );
};
```

## 🔧 Configuration

### Video Configuration

```typescript
const videoConfig = {
  // Buffer settings
  preloadBufferSize: 30, // seconds
  maxBufferSize: 60, // seconds
  minBufferSize: 5, // seconds
  
  // Quality settings
  preferredVideoQuality: 'auto', // 'low' | 'medium' | 'high' | 'ultra' | 'auto'
  adaptiveBitrateEnabled: true,
  maxBitrate: 8000000, // 8 Mbps
  
  // Audio settings
  audioFocusGain: 'gain_transient_may_duck',
  allowBackgroundPlayback: false,
  
  // Performance
  hardwareAccelerationEnabled: true,
  enableAnalytics: true,
};
```

### Image Configuration

```typescript
const imageConfig = {
  // Cache settings
  maxMemorySize: 100 * 1024 * 1024, // 100 MB
  maxDiskSize: 500 * 1024 * 1024, // 500 MB
  maxDiskAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  
  // Quality settings
  compressionQuality: 0.8, // 0-1
  maxImageSize: { width: 2048, height: 2048 },
  
  // Format support
  enableWebP: true,
  enableProgressiveJPEG: true,
  
  // Performance
  enablePrefetching: true,
  maxConcurrentDownloads: 5,
};
```

## 📊 Performance Monitoring

### Real-time Monitoring

```tsx
import { PerformanceUtils } from 'time-native-media';

const performance = PerformanceUtils.getInstance();

// Start monitoring
performance.startMonitoring(5000); // 5 second intervals

// Add alert listener
performance.addAlertListener('my-listener', (alert) => {
  console.log('Performance alert:', alert);
});

// Get current metrics
const metrics = await performance.collectMetrics();
console.log('Memory usage:', metrics.memoryUsage);
console.log('CPU usage:', metrics.cpuUsage);
console.log('Performance score:', metrics.performanceScore);
```

### Performance Optimization

```tsx
// Configure optimization
performance.configureOptimization({
  enableMemoryOptimization: true,
  memoryThreshold: 0.8, // 80%
  enableCPUOptimization: true,
  cpuThreshold: 0.7, // 70%
  enableBatteryOptimization: true,
  batteryThreshold: 0.2, // 20%
});

// Manual optimization
await performance.optimizePerformance();

// Get recommendations
const recommendations = performance.getPerformanceRecommendations();
console.log('Recommendations:', recommendations);
```

## 🧪 Testing

### Run Test Suite

```typescript
import { MediaTestSuite } from 'time-native-media';

const testSuite = MediaTestSuite.getInstance();

// Run all tests
const results = await testSuite.runAllTests();
console.log('Test results:', results);

// Generate report
const report = testSuite.generateReport();
console.log(report);
```

### Performance Testing

```typescript
// Run performance tests
const performanceResults = testSuite.getPerformanceResults();
console.log('Performance results:', performanceResults);

// Check specific metrics
const loadTimeTest = performanceResults.find(r => r.testName === 'Load Time Performance');
if (loadTimeTest && loadTimeTest.metrics.loadTime > 5000) {
  console.warn('Load time exceeds threshold');
}
```

## 🔄 Migration from Expo

### Automated Migration

```bash
# Run the migration script
node scripts/migrate-from-expo.js
```

### Manual Migration Steps

1. **Remove Expo dependencies**:
```bash
npm uninstall expo expo-video expo-image expo-camera
```

2. **Update imports**:
```typescript
// Before (Expo)
import { Video } from 'expo-video';
import { Image } from 'expo-image';

// After (Time Native Media)
import { TimeNativeVideoPlayer } from 'time-native-media';
import { TimeNativeImageCache } from 'time-native-media';
```

3. **Update components**:
```tsx
// Before
<Video source={{ uri: 'video.mp4' }} />

// After
<TimeNativeVideoPlayer 
  source={{ uri: 'video.mp4', type: 'video' }}
  style={{ flex: 1 }}
/>
```

## 🎨 Advanced Features

### Custom Transformations

```tsx
<TimeNativeImageCache
  source={{ uri: 'image.jpg', type: 'image' }}
  transform={{
    resize: { width: 400, height: 300, mode: 'cover' },
    blur: 5,
    borderRadius: 20,
    tintColor: '#ff0000',
    brightness: 0.2,
    contrast: 1.1,
    saturation: 0.8,
  }}
/>
```

### Batch Operations

```typescript
import { TimeMediaManager } from 'time-native-media';

const manager = TimeMediaManager.getInstance();

// Batch load
const results = await manager.loadMediaBatch({
  sources: [
    { uri: 'image1.jpg', type: 'image' },
    { uri: 'image2.jpg', type: 'image' },
    { uri: 'video1.mp4', type: 'video' },
  ],
  batchSize: 2,
  onProgress: (completed, total) => {
    console.log(`Progress: ${completed}/${total}`);
  },
});

// Prefetch for screen
await manager.preloadForScreen('GalleryScreen', [
  'image1.jpg',
  'image2.jpg',
  'image3.jpg',
], 'image');
```

### Cache Management

```typescript
// Check cache status
const isCached = await manager.isMediaCached('image.jpg');
const cacheInfo = await manager.getCachedMediaInfo('image.jpg');

// Cache statistics
const stats = await manager.getCacheStats();
console.log('Cache hit rate:', stats.hitRate);
console.log('Memory usage:', stats.memoryCacheSize);
console.log('Disk usage:', stats.diskCacheSize);

// Optimize cache
await manager.optimizeCache();

// Clear cache
await manager.clearCache();
await manager.clearMemoryCache();
await manager.clearDiskCache();
```

## 🚀 Performance Tips

### Video Optimization

1. **Use appropriate quality settings**:
```typescript
const videoConfig = {
  preferredVideoQuality: 'auto', // Let the system decide
  adaptiveBitrateEnabled: true,
  maxBitrate: 2000000, // 2 Mbps for mobile
};
```

2. **Enable hardware acceleration**:
```typescript
const videoConfig = {
  hardwareAccelerationEnabled: true,
};
```

3. **Optimize buffer settings**:
```typescript
const videoConfig = {
  preloadBufferSize: 30, // 30 seconds
  maxBufferSize: 60, // 60 seconds
  minBufferSize: 5, // 5 seconds
};
```

### Image Optimization

1. **Use appropriate cache policies**:
```typescript
const imageSource = {
  uri: 'image.jpg',
  type: 'image',
  cachePolicy: 'memory-disk', // For frequently accessed images
  priority: 'high', // For above-the-fold images
};
```

2. **Enable WebP support**:
```typescript
const imageConfig = {
  enableWebP: true,
  compressionQuality: 0.8,
};
```

3. **Use prefetching**:
```typescript
await manager.prefetchImages({
  sources: imageSources,
  priority: 'low',
  batchSize: 5,
});
```

### Memory Management

1. **Monitor memory usage**:
```typescript
const performance = PerformanceUtils.getInstance();
performance.startMonitoring();

performance.addAlertListener('memory', (alert) => {
  if (alert.level === 'critical') {
    // Clear caches or reduce quality
    manager.clearMemoryCache();
  }
});
```

2. **Configure appropriate limits**:
```typescript
const config = {
  image: {
    maxMemorySize: 100 * 1024 * 1024, // 100 MB
    maxMemoryItems: 1000,
  },
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Video not playing**:
   - Check network connectivity
   - Verify video URL is accessible
   - Ensure proper permissions
   - Check video format compatibility

2. **Images not loading**:
   - Verify image URL
   - Check cache configuration
   - Ensure proper headers if required
   - Check image format support

3. **Performance issues**:
   - Monitor memory usage
   - Check CPU usage
   - Verify network conditions
   - Review cache configuration

### Debug Mode

```typescript
// Enable debug logging
const config = {
  common: {
    enableLogging: true,
    enableAnalytics: true,
  },
};

// Get detailed metrics
const metrics = await performance.collectMetrics();
console.log('Detailed metrics:', metrics);

// Run diagnostics
const health = await manager.getCacheHealth();
console.log('Cache health:', health);
```

## 📚 API Reference

### Components

- `TimeNativeVideoPlayer` - High-performance video player
- `TimeNativeImageCache` - Advanced image caching component
- `TimeMediaView` - Unified media component

### Hooks

- `useVideoPlayer` - Video player state management
- `useImageCache` - Image cache state management
- `useMediaManager` - Media manager configuration

### Managers

- `VideoPlayerManager` - Video player management
- `ImageCacheManager` - Image cache management
- `TimeMediaManager` - Unified media management
- `PerformanceUtils` - Performance monitoring and optimization

### Types

- `MediaSource` - Media source configuration
- `MediaConfig` - Media configuration
- `MediaLoadResult` - Media loading result
- `PerformanceMetrics` - Performance metrics
- `PerformanceOptimization` - Performance optimization settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- GitHub Issues: [Create an issue](https://github.com/your-org/time-native-media/issues)
- Documentation: [Full documentation](https://docs.time-native-media.com)
- Community: [Discord server](https://discord.gg/time-native-media)

---

Built with ❤️ by the Time Engineering Team