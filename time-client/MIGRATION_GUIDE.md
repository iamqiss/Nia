# Migration Guide: Expo Image Picker to Native Camera Module

This guide explains how to migrate from Expo Image Picker to the new native camera module for improved performance and gRPC integration.

## Overview

The native camera module provides:
- **Native Performance**: Built with AVFoundation (iOS) and Camera2 API (Android)
- **gRPC Integration**: Direct upload to your media service
- **Advanced Features**: HDR, portrait mode, night mode, stabilization
- **Better UX**: Real-time preview, custom overlays, watermarks
- **Backward Compatibility**: Same API as Expo Image Picker

## Migration Steps

### 1. Install the Native Module

The native camera module is already included in the project. No additional installation is required.

### 2. Update Imports

**Before:**
```typescript
import { launchImageLibraryAsync, launchCameraAsync } from 'expo-image-picker';
```

**After:**
```typescript
import { nativeCamera } from '#/lib/media/native-camera';
// Or use the compatibility layer
import { openPicker, openUnifiedPicker, openCamera } from '#/lib/media/picker';
```

### 3. Update Camera Usage

**Before:**
```typescript
const result = await launchCameraAsync({
  mediaTypes: 'images',
  quality: 1,
  allowsEditing: true,
});
```

**After:**
```typescript
// Using native camera directly
const result = await nativeCamera.openCamera({
  quality: 'high',
  allowEditing: true,
  enableHDR: true,
  enablePortraitMode: true,
});

// Or using compatibility layer (same API as before)
const result = await openCamera({
  mediaTypes: 'images',
  quality: 1,
  allowsEditing: true,
});
```

### 4. Update Gallery Usage

**Before:**
```typescript
const result = await launchImageLibraryAsync({
  mediaTypes: ['images', 'videos'],
  quality: 1,
  allowsMultipleSelection: true,
  selectionLimit: 4,
});
```

**After:**
```typescript
// Using native camera directly
const result = await nativeCamera.openGallery({
  mediaTypes: ['image', 'video'],
  quality: 'high',
  selectionLimit: 4,
  enableCompression: true,
  compressionQuality: 0.8,
});

// Or using compatibility layer
const result = await openUnifiedPicker({
  selectionCountRemaining: 4,
});
```

### 5. Add gRPC Upload Integration

**New Feature - Upload with Progress:**
```typescript
const uploadResult = await nativeCamera.uploadMediaWithProgress(
  asset.uri,
  {
    serverUrl: 'https://your-media-service.com',
    userId: 'user123',
    chunkSize: 64 * 1024,
    timeout: 30000,
    retryAttempts: 3,
    enableCompression: true,
    compressionQuality: 0.8,
  },
  (progress) => {
    console.log(`Upload: ${progress.percentage}%`);
    // Update UI with progress
  }
);
```

### 6. Add Advanced Camera Features

**New Features Available:**
```typescript
// Switch camera
await nativeCamera.switchCamera();

// Set flash mode
await nativeCamera.setFlashMode('auto');

// Set zoom level
await nativeCamera.setZoom(2.5);

// Focus at point
await nativeCamera.focusAtPoint(0.5, 0.5);

// Take HDR photo
const hdrPhoto = await nativeCamera.takePicture({
  enableHDR: true,
  enablePortraitMode: true,
  quality: 'high',
});
```

### 7. Update Permission Handling

**Before:**
```typescript
import { requestMediaLibraryPermissionsAsync } from 'expo-image-picker';

const permission = await requestMediaLibraryPermissionsAsync();
```

**After:**
```typescript
// Request all permissions at once
const permissions = await nativeCamera.requestPermissions();
console.log('Camera:', permissions.camera);
console.log('Photo Library:', permissions.photoLibrary);
console.log('Microphone:', permissions.microphone);

// Or check without requesting
const currentPermissions = await nativeCamera.checkPermissions();
```

### 8. Add Event Listeners

**New Feature - Real-time Events:**
```typescript
// Listen for camera events
nativeCamera.addListener('onCameraReady', () => {
  console.log('Camera is ready');
});

nativeCamera.addListener('onPhotoCaptured', (data) => {
  console.log('Photo captured:', data.uri);
});

nativeCamera.addListener('onUploadProgress', (progress) => {
  console.log('Upload progress:', progress.percentage);
});
```

## API Changes

### Camera Options

The camera options have been expanded with new features:

```typescript
interface CameraOptions {
  // Existing options (compatible)
  quality?: 'low' | 'medium' | 'high' | 'max';
  allowEditing?: boolean;
  aspect?: [number, number];
  videoMaxDuration?: number;
  videoQuality?: 'low' | 'medium' | 'high' | 'max';
  cameraType?: 'front' | 'back';
  
  // New advanced options
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
```

### Media Asset

The media asset structure has been enhanced:

```typescript
interface MediaAsset {
  uri: string;
  type: 'image' | 'video' | 'gif';
  mimeType: string;
  width: number;
  height: number;
  size: number;
  duration?: number; // for video/gif
  orientation?: number;
  exif?: Record<string, any>; // EXIF metadata
  location?: { // GPS data
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
```

## Performance Improvements

### 1. Native Performance
- **Faster Camera Access**: Direct native camera APIs
- **Better Memory Management**: Native memory handling
- **Smoother UI**: 60fps camera preview
- **Lower Battery Usage**: Optimized native code

### 2. Upload Optimization
- **Chunked Upload**: Upload large files in chunks
- **Progress Tracking**: Real-time upload progress
- **Retry Logic**: Automatic retry on failures
- **Compression**: On-the-fly compression before upload

### 3. Media Processing
- **Hardware Acceleration**: Use device GPU for processing
- **Background Processing**: Non-blocking operations
- **Memory Efficient**: Process large files without memory issues

## Testing

### 1. Test Camera Functionality
```typescript
// Test basic camera
const photo = await nativeCamera.takePicture();
console.log('Photo taken:', photo.uri);

// Test video recording
await nativeCamera.startVideoRecording();
// ... wait ...
const video = await nativeCamera.stopVideoRecording();
console.log('Video recorded:', video.assets[0].uri);
```

### 2. Test Gallery Integration
```typescript
// Test gallery access
const albums = await nativeCamera.getAlbums();
console.log('Available albums:', albums);

// Test media selection
const result = await nativeCamera.openGallery({
  mediaTypes: ['image', 'video'],
  selectionLimit: 5,
});
console.log('Selected media:', result.assets.length);
```

### 3. Test Upload Integration
```typescript
// Test upload with progress
const uploadResult = await nativeCamera.uploadMediaWithProgress(
  asset.uri,
  {
    serverUrl: 'https://your-media-service.com',
    userId: 'test-user',
  },
  (progress) => {
    console.log(`Upload: ${progress.percentage}%`);
  }
);
console.log('Upload result:', uploadResult);
```

## Troubleshooting

### Common Issues

1. **Module not found**
   - Ensure the native module is properly linked
   - Rebuild the native code after adding the module

2. **Permission denied**
   - Check that all required permissions are granted
   - Request permissions before using camera/gallery

3. **Camera not available**
   - Verify device has a camera
   - Check if camera is being used by another app

4. **Upload failures**
   - Check network connectivity
   - Verify gRPC service is running
   - Check server URL configuration

### Debug Mode

Enable debug logging:
```typescript
// Check module availability
console.log('Camera available:', await nativeCamera.isCameraAvailable());
console.log('Gallery available:', await nativeCamera.isGalleryAvailable());

// Check permissions
const permissions = await nativeCamera.checkPermissions();
console.log('Permissions:', permissions);

// Check device capabilities
const capabilities = await nativeCamera.getCameraCapabilities();
console.log('Capabilities:', capabilities);
```

## Rollback Plan

If you need to rollback to Expo Image Picker:

1. **Revert imports** to use `expo-image-picker` directly
2. **Remove native module** from the project
3. **Update package.json** to ensure Expo Image Picker is available
4. **Test functionality** to ensure everything works

The compatibility layer ensures that existing code continues to work while providing the option to use native features.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the native module logs
3. Test with the debug mode enabled
4. Contact the development team

## Conclusion

The native camera module provides significant performance improvements and new features while maintaining backward compatibility. The migration can be done gradually, starting with the compatibility layer and then adopting native features as needed.