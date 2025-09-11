# Time Native Media Integration Guide

This guide provides step-by-step instructions for integrating the high-performance native media solution into your React Native application.

## 🎯 Overview

The Time Native Media solution provides:
- **Native Video Player**: AVPlayer (iOS) + ExoPlayer (Android) with advanced caching
- **Native Image Cache**: High-performance image loading with LRU cache and disk persistence
- **Performance Monitoring**: Real-time metrics and intelligent optimization
- **Expo Migration**: Automated migration from Expo to bare React Native

## 📋 Prerequisites

- React Native 0.79+
- iOS 15.1+ / Android API 21+
- Node.js 20+
- Xcode 15+ (for iOS)
- Android Studio (for Android)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install the main package
npm install time-native-media

# Install peer dependencies
npm install react-native-video react-native-fast-image
```

### 2. iOS Setup

#### Add to Podfile
```ruby
# ios/Podfile
pod 'time-native-media', :path => '../node_modules/time-native-media'
```

#### Install Pods
```bash
cd ios && pod install
```

#### Update Info.plist
```xml
<!-- ios/Time/Info.plist -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### 3. Android Setup

#### Update settings.gradle
```gradle
// android/settings.gradle
include ':time-native-media'
project(':time-native-media').projectDir = new File(rootProject.projectDir, '../node_modules/time-native-media/android')
```

#### Update build.gradle
```gradle
// android/app/build.gradle
dependencies {
    implementation project(':time-native-media')
}
```

#### Update MainApplication.java
```java
// android/app/src/main/java/com/yourapp/MainApplication.java
import com.timenativemedia.TimeNativeMediaPackage;

@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new TimeNativeMediaPackage()
    );
}
```

## 🎬 Video Player Integration

### Basic Video Player

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TimeNativeVideoPlayer, useVideoPlayer } from 'time-native-media';

const VideoScreen = () => {
  const {
    playerRef,
    isPlaying,
    isLoading,
    hasError,
    error,
    play,
    pause,
    seek,
    setVolume,
    setMuted,
  } = useVideoPlayer({
    source: {
      uri: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      type: 'video',
      priority: 'normal',
    },
    autoPlay: false,
    onLoad: (data) => console.log('Video loaded:', data),
    onError: (error) => console.error('Video error:', error),
  });

  return (
    <View style={styles.container}>
      <TimeNativeVideoPlayer
        ref={playerRef}
        source={{
          uri: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          type: 'video',
        }}
        style={styles.video}
        paused={!isPlaying}
        muted={false}
        volume={1.0}
        resizeMode="contain"
        onLoadStart={() => console.log('Loading started')}
        onLoad={(data) => console.log('Video loaded:', data)}
        onError={(error) => console.error('Error:', error)}
        onPlaybackStateChange={(status) => console.log('Status:', status)}
        onProgress={(data) => console.log('Progress:', data)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
});
```

### Advanced Video Configuration

```tsx
import { TimeNativeVideoPlayer } from 'time-native-media';

const AdvancedVideoPlayer = () => {
  return (
    <TimeNativeVideoPlayer
      source={{
        uri: 'https://example.com/video.mp4',
        type: 'video',
        priority: 'high',
        headers: {
          'Authorization': 'Bearer token',
        },
        drm: {
          type: 'widevine',
          licenseUrl: 'https://example.com/license',
          headers: {
            'Authorization': 'Bearer token',
          },
        },
      }}
      config={{
        video: {
          preloadBufferSize: 30,
          maxBufferSize: 60,
          minBufferSize: 5,
          adaptiveBitrateEnabled: true,
          preferredVideoQuality: 'auto',
          hardwareAccelerationEnabled: true,
          allowBackgroundPlayback: true,
        },
      }}
      style={{ flex: 1 }}
      paused={false}
      muted={false}
      volume={1.0}
      repeat={false}
      resizeMode="contain"
      onLoad={(data) => console.log('Loaded:', data)}
      onError={(error) => console.error('Error:', error)}
      onPlaybackStateChange={(status) => console.log('Status:', status)}
      onQualityChange={(quality) => console.log('Quality:', quality)}
      onBitrateChange={(bitrate) => console.log('Bitrate:', bitrate)}
    />
  );
};
```

## 🖼️ Image Cache Integration

### Basic Image Loading

```tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TimeNativeImageCache, useImageCache } from 'time-native-media';

const ImageScreen = () => {
  const { imageRef, isLoading, hasError, error } = useImageCache({
    source: {
      uri: 'https://picsum.photos/800/600',
      type: 'image',
      priority: 'high',
      cachePolicy: 'memory-disk',
    },
    autoLoad: true,
    onLoad: (result) => console.log('Image loaded:', result),
    onError: (error) => console.error('Image error:', error),
  });

  return (
    <ScrollView style={styles.container}>
      <TimeNativeImageCache
        ref={imageRef}
        source={{
          uri: 'https://picsum.photos/800/600',
          type: 'image',
        }}
        style={styles.image}
        resizeMode="cover"
        onLoad={(result) => console.log('Image loaded:', result)}
        onError={(error) => console.error('Error:', error)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
});
```

### Advanced Image Configuration

```tsx
import { TimeNativeImageCache } from 'time-native-media';

const AdvancedImageCache = () => {
  return (
    <TimeNativeImageCache
      source={{
        uri: 'https://example.com/image.jpg',
        type: 'image',
        priority: 'high',
        cachePolicy: 'memory-disk',
        headers: {
          'Authorization': 'Bearer token',
        },
        resize: {
          width: 400,
          height: 300,
          mode: 'cover',
        },
      }}
      config={{
        image: {
          maxMemorySize: 100 * 1024 * 1024, // 100 MB
          maxDiskSize: 500 * 1024 * 1024, // 500 MB
          compressionQuality: 0.8,
          enableWebP: true,
          enableProgressiveJPEG: true,
        },
      }}
      style={{ width: 400, height: 300 }}
      resizeMode="cover"
      blurRadius={2}
      borderRadius={10}
      tintColor="#ff0000"
      transform={{
        resize: { width: 400, height: 300, mode: 'cover' },
        blur: 5,
        borderRadius: 20,
        brightness: 0.2,
        contrast: 1.1,
        saturation: 0.8,
      }}
      onLoad={(result) => console.log('Loaded:', result)}
      onError={(error) => console.error('Error:', error)}
      onProgress={(progress) => console.log('Progress:', progress)}
    />
  );
};
```

## 🎛️ Media Manager Integration

### Basic Media Manager

```tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMediaManager } from 'time-native-media';

const MediaManagerScreen = () => {
  const {
    manager,
    config,
    cacheStats,
    analytics,
    configure,
    clearCache,
    optimizeCache,
  } = useMediaManager({
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

  useEffect(() => {
    // Configure media manager
    configure({
      common: {
        enableAnalytics: true,
        enableLogging: true,
      },
    });
  }, [configure]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Media Manager</Text>
      
      {cacheStats && (
        <View style={styles.stats}>
          <Text>Cache Hit Rate: {(cacheStats.hitRate * 100).toFixed(1)}%</Text>
          <Text>Memory Usage: {(cacheStats.memoryCacheSize / 1024 / 1024).toFixed(1)} MB</Text>
          <Text>Disk Usage: {(cacheStats.diskCacheSize / 1024 / 1024).toFixed(1)} MB</Text>
        </View>
      )}
      
      {analytics && (
        <View style={styles.analytics}>
          <Text>Total Requests: {analytics.totalRequests}</Text>
          <Text>Cache Hits: {analytics.cacheHits}</Text>
          <Text>Average Load Time: {analytics.averageLoadTime.toFixed(0)}ms</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stats: {
    marginBottom: 20,
  },
  analytics: {
    marginBottom: 20,
  },
});
```

### Batch Operations

```tsx
import { TimeMediaManager } from 'time-native-media';

const BatchOperationsExample = () => {
  const manager = TimeMediaManager.getInstance();

  const handleBatchLoad = async () => {
    const sources = [
      { uri: 'https://picsum.photos/400/300?random=1', type: 'image' as const },
      { uri: 'https://picsum.photos/400/300?random=2', type: 'image' as const },
      { uri: 'https://picsum.photos/400/300?random=3', type: 'image' as const },
    ];

    const results = await manager.loadMediaBatch({
      sources,
      batchSize: 2,
      onProgress: (completed, total) => {
        console.log(`Progress: ${completed}/${total}`);
      },
    });

    console.log('Batch load results:', results);
  };

  const handlePrefetch = async () => {
    const sources = [
      { uri: 'https://picsum.photos/400/300?random=4', type: 'image' as const },
      { uri: 'https://picsum.photos/400/300?random=5', type: 'image' as const },
    ];

    await manager.prefetchMedia({
      sources,
      priority: 'low',
      batchSize: 2,
    });

    console.log('Prefetch completed');
  };

  return (
    <View>
      <Button title="Batch Load" onPress={handleBatchLoad} />
      <Button title="Prefetch" onPress={handlePrefetch} />
    </View>
  );
};
```

## 📊 Performance Monitoring Integration

### Basic Performance Monitoring

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PerformanceUtils } from 'time-native-media';

const PerformanceScreen = () => {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const performance = PerformanceUtils.getInstance();

    // Start monitoring
    performance.startMonitoring(5000); // 5 second intervals

    // Add alert listener
    performance.addAlertListener('performance-listener', (alert) => {
      setAlerts(prev => [...prev, alert]);
    });

    // Collect initial metrics
    performance.collectMetrics().then(setMetrics);

    // Collect metrics periodically
    const interval = setInterval(async () => {
      const newMetrics = await performance.collectMetrics();
      setMetrics(newMetrics);
    }, 10000); // 10 seconds

    return () => {
      performance.stopMonitoring();
      performance.removeAlertListener('performance-listener');
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Performance Monitoring</Text>
      
      {metrics && (
        <View style={styles.metrics}>
          <Text>Performance Score: {metrics.performanceScore}</Text>
          <Text>Memory Usage: {(metrics.memoryUsage / 1024 / 1024).toFixed(1)} MB</Text>
          <Text>CPU Usage: {(metrics.cpuUsage * 100).toFixed(1)}%</Text>
          <Text>Network Speed: {metrics.networkSpeed.toFixed(1)} Mbps</Text>
          <Text>Battery Level: {(metrics.batteryLevel * 100).toFixed(1)}%</Text>
        </View>
      )}
      
      {alerts.length > 0 && (
        <View style={styles.alerts}>
          <Text style={styles.alertTitle}>Recent Alerts:</Text>
          {alerts.slice(-5).map((alert, index) => (
            <Text key={index} style={styles.alert}>
              {alert.type}: {alert.message}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  metrics: {
    marginBottom: 20,
  },
  alerts: {
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alert: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});
```

### Advanced Performance Optimization

```tsx
import { PerformanceUtils } from 'time-native-media';

const AdvancedPerformanceExample = () => {
  const performance = PerformanceUtils.getInstance();

  const handleOptimize = async () => {
    // Configure optimization
    performance.configureOptimization({
      enableMemoryOptimization: true,
      memoryThreshold: 0.8, // 80%
      enableCPUOptimization: true,
      cpuThreshold: 0.7, // 70%
      enableBatteryOptimization: true,
      batteryThreshold: 0.2, // 20%
    });

    // Apply optimizations
    await performance.optimizePerformance();

    // Get recommendations
    const recommendations = performance.getPerformanceRecommendations();
    console.log('Recommendations:', recommendations);

    // Get performance summary
    const summary = performance.getPerformanceSummary();
    console.log('Performance summary:', summary);
  };

  return (
    <View>
      <Button title="Optimize Performance" onPress={handleOptimize} />
    </View>
  );
};
```

## 🔄 Migration from Expo

### Automated Migration

```bash
# Run the migration script
node scripts/migrate-from-expo.js
```

### Manual Migration Steps

#### 1. Remove Expo Dependencies

```bash
npm uninstall expo expo-video expo-image expo-camera expo-media-library
```

#### 2. Update Package.json

```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "build:android": "cd android && ./gradlew assembleRelease",
    "build:ios": "cd ios && xcodebuild -workspace Time.xcworkspace -scheme Time -configuration Release"
  }
}
```

#### 3. Update Imports

```typescript
// Before (Expo)
import { Video } from 'expo-video';
import { Image } from 'expo-image';
import { Camera } from 'expo-camera';

// After (Time Native Media)
import { TimeNativeVideoPlayer } from 'time-native-media';
import { TimeNativeImageCache } from 'time-native-media';
import { Camera } from 'react-native-camera';
```

#### 4. Update Components

```tsx
// Before (Expo)
<Video 
  source={{ uri: 'video.mp4' }}
  style={{ flex: 1 }}
  useNativeControls
/>

// After (Time Native Media)
<TimeNativeVideoPlayer
  source={{ uri: 'video.mp4', type: 'video' }}
  style={{ flex: 1 }}
  paused={false}
  onLoad={(data) => console.log('Loaded:', data)}
/>
```

```tsx
// Before (Expo)
<Image 
  source={{ uri: 'image.jpg' }}
  style={{ width: 200, height: 200 }}
  contentFit="cover"
/>

// After (Time Native Media)
<TimeNativeImageCache
  source={{ uri: 'image.jpg', type: 'image' }}
  style={{ width: 200, height: 200 }}
  resizeMode="cover"
  onLoad={(result) => console.log('Loaded:', result)}
/>
```

## 🧪 Testing Integration

### Run Test Suite

```typescript
import { MediaTestSuite } from 'time-native-media';

const TestExample = () => {
  const testSuite = MediaTestSuite.getInstance();

  const runTests = async () => {
    const results = await testSuite.runAllTests();
    console.log('Test results:', results);
    
    const report = testSuite.generateReport();
    console.log(report);
  };

  return (
    <View>
      <Button title="Run Tests" onPress={runTests} />
    </View>
  );
};
```

### Performance Testing

```typescript
const PerformanceTestExample = () => {
  const testSuite = MediaTestSuite.getInstance();

  const runPerformanceTests = async () => {
    const results = testSuite.getPerformanceResults();
    console.log('Performance results:', results);
    
    // Check specific metrics
    const loadTimeTest = results.find(r => r.testName === 'Load Time Performance');
    if (loadTimeTest && loadTimeTest.metrics.loadTime > 5000) {
      console.warn('Load time exceeds threshold');
    }
  };

  return (
    <View>
      <Button title="Run Performance Tests" onPress={runPerformanceTests} />
    </View>
  );
};
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
    hue: 180,
    gamma: 1.2,
    sharpen: 0.5,
    sepia: 0.3,
    grayscale: false,
    invert: false,
    flip: 'horizontal',
    rotate: 90,
  }}
/>
```

### DRM Support

```tsx
<TimeNativeVideoPlayer
  source={{
    uri: 'https://example.com/protected-video.mp4',
    type: 'video',
    drm: {
      type: 'widevine',
      licenseUrl: 'https://example.com/license',
      headers: {
        'Authorization': 'Bearer token',
      },
      keyRequestProperties: {
        'X-Custom-Header': 'value',
      },
    },
  }}
/>
```

### Cache Management

```typescript
const CacheManagementExample = () => {
  const manager = TimeMediaManager.getInstance();

  const handleCacheOperations = async () => {
    // Check cache status
    const isCached = await manager.isMediaCached('image.jpg');
    console.log('Is cached:', isCached);

    // Get cache info
    const cacheInfo = await manager.getCachedMediaInfo('image.jpg');
    console.log('Cache info:', cacheInfo);

    // Cache statistics
    const stats = await manager.getCacheStats();
    console.log('Cache stats:', stats);

    // Optimize cache
    await manager.optimizeCache();

    // Clear specific cache
    await manager.removeMediaFromCache('image.jpg');

    // Clear all cache
    await manager.clearCache();
  };

  return (
    <View>
      <Button title="Cache Operations" onPress={handleCacheOperations} />
    </View>
  );
};
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

## 📚 Additional Resources

- [Full API Documentation](https://docs.time-native-media.com)
- [Performance Best Practices](https://docs.time-native-media.com/performance)
- [Migration Guide](https://docs.time-native-media.com/migration)
- [Troubleshooting Guide](https://docs.time-native-media.com/troubleshooting)
- [Community Support](https://discord.gg/time-native-media)

---

Built with ❤️ by the Time Engineering Team