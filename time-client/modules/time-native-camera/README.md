# Time Native Camera Module

A comprehensive native camera module for iOS and Android that provides high-performance camera functionality with gRPC media service integration.

## Features

### Camera Capabilities
- **Native Performance**: Built with AVFoundation (iOS) and Camera2 API (Android)
- **Advanced Controls**: Flash, focus, exposure, white balance, zoom
- **Multiple Modes**: Photo, video recording, burst mode, time-lapse
- **Real-time Preview**: Live camera preview with customizable overlays
- **HDR Support**: High Dynamic Range photography
- **Portrait Mode**: Depth-based portrait photography
- **Night Mode**: Low-light photography optimization
- **Stabilization**: Video and photo stabilization
- **Raw Capture**: Support for RAW image formats
- **Custom Overlays**: Watermarks and custom UI elements

### Gallery Integration
- **Native Gallery**: Direct access to device photo library
- **Album Management**: Browse and select from specific albums
- **Multi-selection**: Select multiple images/videos
- **Metadata Extraction**: EXIF data and media information
- **Thumbnail Generation**: Fast thumbnail creation
- **Sorting Options**: Sort by date, name, size

### Media Processing
- **Image Compression**: Configurable quality and size
- **Video Compression**: H.264/H.265 encoding
- **Format Conversion**: JPEG, PNG, WebP, MP4, WebM
- **Image Manipulation**: Crop, rotate, apply filters
- **Metadata Handling**: Preserve and modify EXIF data
- **Location Data**: GPS coordinates in media

### gRPC Integration
- **Streaming Upload**: Chunked media upload with progress
- **Real-time Progress**: Upload progress callbacks
- **Retry Logic**: Automatic retry on network failures
- **Compression**: On-the-fly compression before upload
- **Encryption**: Optional client-side encryption
- **Cancellation**: Cancel ongoing uploads

### Permissions
- **Camera Access**: Front and back camera permissions
- **Microphone**: Video recording audio permissions
- **Photo Library**: Read/write access to media library
- **Location**: Optional GPS data for media

## Installation

### iOS Setup

1. Add the module to your iOS project:
```bash
cd ios && pod install
```

2. Add camera permissions to `Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take photos and videos</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone to record videos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to select media</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs access to location to add GPS data to photos</string>
```

3. Configure the module in your app delegate:
```swift
import TimeNativeCameraModule

// The module will be automatically linked
```

### Android Setup

1. Add permissions to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

2. The module will be automatically linked via autolinking.

## Usage

### Basic Camera Usage

```typescript
import { nativeCamera } from '../modules/time-native-camera';

// Take a photo
const photo = await nativeCamera.takePicture({
  quality: 'high',
  enableHDR: true,
  enablePortraitMode: true,
  flashMode: 'auto',
});

// Record video
await nativeCamera.startVideoRecording({
  quality: 'high',
  videoQuality: 'high',
  videoMaxDuration: 300, // 5 minutes
});

const videoResult = await nativeCamera.stopVideoRecording();

// Open gallery
const galleryResult = await nativeCamera.openGallery({
  mediaTypes: ['image', 'video'],
  selectionLimit: 5,
  quality: 'high',
});
```

### Advanced Camera Controls

```typescript
// Switch between front/back camera
await nativeCamera.switchCamera();

// Set flash mode
await nativeCamera.setFlashMode('on');

// Set focus mode
await nativeCamera.setFocusMode('manual');

// Set zoom level (0.0 to maxZoom)
await nativeCamera.setZoom(2.5);

// Focus at specific point (0.0 to 1.0)
await nativeCamera.focusAtPoint(0.5, 0.5);

// Expose at specific point
await nativeCamera.exposeAtPoint(0.3, 0.7);
```

### Media Processing

```typescript
// Compress image
const compressedImage = await nativeCamera.compressImage(uri, {
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'jpeg',
});

// Compress video
const compressedVideo = await nativeCamera.compressVideo(uri, {
  quality: 'high',
  maxWidth: 1920,
  maxHeight: 1080,
  bitrate: 5000000, // 5 Mbps
});

// Generate thumbnail
const thumbnailUri = await nativeCamera.generateThumbnail(uri, {
  width: 300,
  height: 300,
  quality: 0.7,
});

// Crop image
const croppedImage = await nativeCamera.cropImage(uri, {
  x: 100,
  y: 100,
  width: 500,
  height: 500,
});

// Rotate image
const rotatedImage = await nativeCamera.rotateImage(uri, 90);

// Apply filter
const filteredImage = await nativeCamera.applyFilter(uri, 'vintage', 0.8);
```

### gRPC Upload Integration

```typescript
// Upload with progress tracking
const uploadResult = await nativeCamera.uploadMediaWithProgress(
  uri,
  {
    serverUrl: 'https://your-media-service.com',
    userId: 'user123',
    chunkSize: 64 * 1024, // 64KB
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    enableCompression: true,
    compressionQuality: 0.8,
  },
  (progress) => {
    console.log(`Upload progress: ${progress.percentage}%`);
    console.log(`Speed: ${progress.speed} bytes/sec`);
    console.log(`ETA: ${progress.estimatedTimeRemaining} seconds`);
  }
);

// Cancel upload
await nativeCamera.cancelUpload(uploadResult.mediaId);
```

### Permissions

```typescript
// Request all permissions
const permissions = await nativeCamera.requestPermissions();
console.log('Camera:', permissions.camera);
console.log('Microphone:', permissions.microphone);
console.log('Photo Library:', permissions.photoLibrary);

// Check permissions without requesting
const currentPermissions = await nativeCamera.checkPermissions();
```

### Device Capabilities

```typescript
// Get camera capabilities
const capabilities = await nativeCamera.getCameraCapabilities();
console.log('HDR Support:', capabilities.supportsHDR);
console.log('Portrait Mode:', capabilities.supportsPortraitMode);
console.log('Max Zoom:', capabilities.maxZoom);
console.log('Supported Formats:', capabilities.supportedImageFormats);

// Get device info
const deviceInfo = await nativeCamera.getDeviceInfo();
console.log('Platform:', deviceInfo.platform);
console.log('Model:', deviceInfo.model);
console.log('Version:', deviceInfo.version);
```

### Event Listeners

```typescript
// Listen for camera events
nativeCamera.addListener('onCameraReady', () => {
  console.log('Camera is ready');
});

nativeCamera.addListener('onPhotoCaptured', (data) => {
  console.log('Photo captured:', data.uri);
});

nativeCamera.addListener('onVideoRecordingStarted', () => {
  console.log('Video recording started');
});

nativeCamera.addListener('onVideoRecordingStopped', () => {
  console.log('Video recording stopped');
});

nativeCamera.addListener('onUploadProgress', (progress) => {
  console.log('Upload progress:', progress.percentage);
});

// Remove listeners
nativeCamera.removeListener('onCameraReady', callback);
nativeCamera.removeAllListeners();
```

## API Reference

### Types

```typescript
interface CameraOptions {
  quality?: 'low' | 'medium' | 'high' | 'max';
  allowEditing?: boolean;
  aspect?: [number, number];
  videoMaxDuration?: number;
  videoQuality?: 'low' | 'medium' | 'high' | 'max';
  cameraType?: 'front' | 'back';
  flashMode?: 'off' | 'on' | 'auto';
  focusMode?: 'auto' | 'manual';
  exposureMode?: 'auto' | 'manual';
  whiteBalanceMode?: 'auto' | 'manual';
  enableHDR?: boolean;
  enablePortraitMode?: boolean;
  enableNightMode?: boolean;
  enableStabilization?: boolean;
  enableZoom?: boolean;
  maxZoom?: number;
  enableTapToFocus?: boolean;
  enableTapToExpose?: boolean;
  enableGrid?: boolean;
  enableLevel?: boolean;
  enableTimer?: boolean;
  timerDuration?: number;
  enableBurstMode?: boolean;
  burstCount?: number;
  enableRawCapture?: boolean;
  enableMetadata?: boolean;
  customOverlay?: string;
  watermark?: {
    text?: string;
    image?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity?: number;
  };
}

interface MediaAsset {
  uri: string;
  type: 'image' | 'video' | 'gif';
  mimeType: string;
  width: number;
  height: number;
  size: number;
  duration?: number;
  orientation?: number;
  exif?: Record<string, any>;
  location?: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
  };
  timestamp: number;
  filename?: string;
  thumbnailUri?: string;
  compressedUri?: string;
  originalUri?: string;
}

interface CameraResult {
  assets: MediaAsset[];
  canceled: boolean;
  error?: string;
}

interface GalleryOptions {
  mediaTypes?: ('image' | 'video' | 'gif')[];
  selectionLimit?: number;
  quality?: 'low' | 'medium' | 'high' | 'max';
  allowEditing?: boolean;
  enableCompression?: boolean;
  compressionQuality?: number;
  maxFileSize?: number;
  maxDuration?: number;
  enableMetadata?: boolean;
  enableLocation?: boolean;
  sortOrder?: 'newest' | 'oldest' | 'name' | 'size';
  albumName?: string;
}

interface MediaUploadOptions {
  serverUrl: string;
  userId: string;
  chunkSize?: number;
  timeout?: number;
  retryAttempts?: number;
  enableProgress?: boolean;
  enableCompression?: boolean;
  compressionQuality?: number;
  enableEncryption?: boolean;
  encryptionKey?: string;
}

interface UploadProgress {
  mediaId: string;
  uploadedBytes: number;
  totalBytes: number;
  percentage: number;
  speed: number;
  estimatedTimeRemaining: number;
}

interface UploadResult {
  success: boolean;
  mediaId?: string;
  url?: string;
  thumbnailUrl?: string;
  hlsUrl?: string;
  webpUrl?: string;
  mp4Url?: string;
  error?: string;
}

interface CameraPermissions {
  camera: boolean;
  microphone: boolean;
  photoLibrary: boolean;
  location?: boolean;
}

interface CameraCapabilities {
  supportsHDR: boolean;
  supportsPortraitMode: boolean;
  supportsNightMode: boolean;
  supportsStabilization: boolean;
  supportsRawCapture: boolean;
  supportsBurstMode: boolean;
  supportsSlowMotion: boolean;
  supportsTimeLapse: boolean;
  supportsLivePhotos: boolean;
  maxZoom: number;
  supportedVideoQualities: string[];
  supportedImageFormats: string[];
  supportedVideoFormats: string[];
  maxVideoDuration: number;
  maxImageResolution: { width: number; height: number };
  maxVideoResolution: { width: number; height: number };
}
```

## Configuration

### Environment Variables

```bash
# Media service URL for gRPC uploads
EXPO_PUBLIC_MEDIA_SERVICE_URL=localhost:50051

# Default upload settings
EXPO_PUBLIC_UPLOAD_CHUNK_SIZE=65536
EXPO_PUBLIC_UPLOAD_TIMEOUT=30000
EXPO_PUBLIC_UPLOAD_RETRY_ATTEMPTS=3
```

### iOS Configuration

Add to your `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take photos and videos</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone to record videos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to select media</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs access to location to add GPS data to photos</string>
```

### Android Configuration

Add to your `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

## Troubleshooting

### Common Issues

1. **Module not found**: Ensure the module is properly linked and the native code is built
2. **Permission denied**: Check that all required permissions are granted
3. **Camera not available**: Verify that the device has a camera and it's not being used by another app
4. **Upload failures**: Check network connectivity and gRPC service availability

### Debug Mode

Enable debug logging by setting:

```typescript
// Enable native module debug logging
console.log('Native camera available:', await nativeCamera.isCameraAvailable());
console.log('Native gallery available:', await nativeCamera.isGalleryAvailable());
```

### Performance Optimization

1. **Use appropriate quality settings** for your use case
2. **Enable compression** for uploads to reduce bandwidth
3. **Use thumbnails** for previews instead of full-resolution images
4. **Implement proper error handling** and retry logic
5. **Clean up resources** by removing event listeners when not needed

## License

UNLICENSED - Proprietary software owned by Neo Qiss. All rights reserved.