/**
 * Native Media Picker
 * 
 * This module replaces the Expo image picker with native camera functionality
 * while maintaining the same API for backward compatibility.
 */

import { Platform } from 'react-native';
import { nativeCamera, type MediaAsset } from './native-camera';

// Re-export types for compatibility
export type PickerImage = MediaAsset & {
  size: number;
};

export type ImagePickerOptions = {
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
};

export type ImagePickerResult = {
  assets: MediaAsset[];
  canceled: boolean;
  error?: string;
};

/**
 * Open image picker (gallery)
 */
export async function openPicker(opts?: ImagePickerOptions): Promise<PickerImage[]> {
  const result = await nativeCamera.openGallery({
    mediaTypes: ['image'],
    selectionLimit: 1,
    quality: opts?.quality || 'high',
    allowEditing: opts?.allowEditing || false,
    enableCompression: true,
    compressionQuality: getCompressionQuality(opts?.quality),
  });

  if (result.canceled || !result.assets) {
    return [];
  }

  return result.assets.map(asset => ({
    uri: asset.uri,
    mime: asset.mimeType,
    height: asset.height,
    width: asset.width,
    path: asset.uri,
    size: asset.size,
  }));
}

/**
 * Open unified picker (gallery with images and videos)
 */
export async function openUnifiedPicker({
  selectionCountRemaining,
}: {
  selectionCountRemaining: number;
}): Promise<ImagePickerResult> {
  const result = await nativeCamera.openGallery({
    mediaTypes: ['image', 'video'],
    selectionLimit: selectionCountRemaining,
    quality: 'high',
    allowEditing: false,
    enableCompression: true,
    compressionQuality: 0.8,
  });

  return {
    assets: result.assets || [],
    canceled: result.canceled,
  };
}

/**
 * Open camera for taking photos
 */
export async function openCamera(customOpts: ImagePickerOptions): Promise<PickerImage> {
  const result = await nativeCamera.openCamera({
    quality: customOpts.quality || 'high',
    allowEditing: customOpts.allowEditing || false,
    cameraType: customOpts.cameraType || 'back',
    flashMode: customOpts.flashMode || 'auto',
    focusMode: customOpts.focusMode || 'auto',
    exposureMode: customOpts.exposureMode || 'auto',
    whiteBalanceMode: customOpts.whiteBalanceMode || 'auto',
    enableHDR: customOpts.enableHDR || false,
    enablePortraitMode: customOpts.enablePortraitMode || false,
    enableNightMode: customOpts.enableNightMode || false,
    enableStabilization: customOpts.enableStabilization || true,
    enableZoom: customOpts.enableZoom || true,
    maxZoom: customOpts.maxZoom || 10,
    enableTapToFocus: customOpts.enableTapToFocus || true,
    enableTapToExpose: customOpts.enableTapToExpose || true,
    enableGrid: customOpts.enableGrid || false,
    enableLevel: customOpts.enableLevel || false,
    enableTimer: customOpts.enableTimer || false,
    timerDuration: customOpts.timerDuration || 3,
    enableBurstMode: customOpts.enableBurstMode || false,
    burstCount: customOpts.burstCount || 3,
    enableRawCapture: customOpts.enableRawCapture || false,
    enableMetadata: customOpts.enableMetadata || true,
    customOverlay: customOpts.customOverlay,
    watermark: customOpts.watermark,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    throw new Error('Camera was closed before taking a photo');
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    mime: asset.mimeType,
    height: asset.height,
    width: asset.width,
    path: asset.uri,
    size: asset.size,
  };
}

/**
 * Open camera with live preview
 */
export async function openCameraWithPreview(customOpts: ImagePickerOptions): Promise<ImagePickerResult> {
  const result = await nativeCamera.openCameraWithPreview({
    quality: customOpts.quality || 'high',
    allowEditing: customOpts.allowEditing || false,
    cameraType: customOpts.cameraType || 'back',
    flashMode: customOpts.flashMode || 'auto',
    focusMode: customOpts.focusMode || 'auto',
    exposureMode: customOpts.exposureMode || 'auto',
    whiteBalanceMode: customOpts.whiteBalanceMode || 'auto',
    enableHDR: customOpts.enableHDR || false,
    enablePortraitMode: customOpts.enablePortraitMode || false,
    enableNightMode: customOpts.enableNightMode || false,
    enableStabilization: customOpts.enableStabilization || true,
    enableZoom: customOpts.enableZoom || true,
    maxZoom: customOpts.maxZoom || 10,
    enableTapToFocus: customOpts.enableTapToFocus || true,
    enableTapToExpose: customOpts.enableTapToExpose || true,
    enableGrid: customOpts.enableGrid || false,
    enableLevel: customOpts.enableLevel || false,
    enableTimer: customOpts.enableTimer || false,
    timerDuration: customOpts.timerDuration || 3,
    enableBurstMode: customOpts.enableBurstMode || false,
    burstCount: customOpts.burstCount || 3,
    enableRawCapture: customOpts.enableRawCapture || false,
    enableMetadata: customOpts.enableMetadata || true,
    customOverlay: customOpts.customOverlay,
    watermark: customOpts.watermark,
  });

  return {
    assets: result.assets || [],
    canceled: result.canceled,
  };
}

/**
 * Start video recording
 */
export async function startVideoRecording(customOpts: ImagePickerOptions): Promise<void> {
  await nativeCamera.startVideoRecording({
    quality: customOpts.quality || 'high',
    videoQuality: customOpts.videoQuality || 'high',
    videoMaxDuration: customOpts.videoMaxDuration || 300, // 5 minutes
    cameraType: customOpts.cameraType || 'back',
    flashMode: customOpts.flashMode || 'auto',
    focusMode: customOpts.focusMode || 'auto',
    exposureMode: customOpts.exposureMode || 'auto',
    whiteBalanceMode: customOpts.whiteBalanceMode || 'auto',
    enableHDR: customOpts.enableHDR || false,
    enablePortraitMode: customOpts.enablePortraitMode || false,
    enableNightMode: customOpts.enableNightMode || false,
    enableStabilization: customOpts.enableStabilization || true,
    enableZoom: customOpts.enableZoom || true,
    maxZoom: customOpts.maxZoom || 10,
    enableTapToFocus: customOpts.enableTapToFocus || true,
    enableTapToExpose: customOpts.enableTapToExpose || true,
    enableGrid: customOpts.enableGrid || false,
    enableLevel: customOpts.enableLevel || false,
    enableTimer: customOpts.enableTimer || false,
    timerDuration: customOpts.timerDuration || 3,
    enableBurstMode: customOpts.enableBurstMode || false,
    burstCount: customOpts.burstCount || 3,
    enableRawCapture: customOpts.enableRawCapture || false,
    enableMetadata: customOpts.enableMetadata || true,
    customOverlay: customOpts.customOverlay,
    watermark: customOpts.watermark,
  });
}

/**
 * Stop video recording
 */
export async function stopVideoRecording(): Promise<ImagePickerResult> {
  const result = await nativeCamera.stopVideoRecording();
  return {
    assets: result.assets || [],
    canceled: result.canceled,
  };
}

/**
 * Take a picture
 */
export async function takePicture(customOpts: ImagePickerOptions): Promise<MediaAsset> {
  return nativeCamera.takePicture({
    quality: customOpts.quality || 'high',
    allowEditing: customOpts.allowEditing || false,
    cameraType: customOpts.cameraType || 'back',
    flashMode: customOpts.flashMode || 'auto',
    focusMode: customOpts.focusMode || 'auto',
    exposureMode: customOpts.exposureMode || 'auto',
    whiteBalanceMode: customOpts.whiteBalanceMode || 'auto',
    enableHDR: customOpts.enableHDR || false,
    enablePortraitMode: customOpts.enablePortraitMode || false,
    enableNightMode: customOpts.enableNightMode || false,
    enableStabilization: customOpts.enableStabilization || true,
    enableZoom: customOpts.enableZoom || true,
    maxZoom: customOpts.maxZoom || 10,
    enableTapToFocus: customOpts.enableTapToFocus || true,
    enableTapToExpose: customOpts.enableTapToExpose || true,
    enableGrid: customOpts.enableGrid || false,
    enableLevel: customOpts.enableLevel || false,
    enableTimer: customOpts.enableTimer || false,
    timerDuration: customOpts.timerDuration || 3,
    enableBurstMode: customOpts.enableBurstMode || false,
    burstCount: customOpts.burstCount || 3,
    enableRawCapture: customOpts.enableRawCapture || false,
    enableMetadata: customOpts.enableMetadata || true,
    customOverlay: customOpts.customOverlay,
    watermark: customOpts.watermark,
  });
}

/**
 * Switch camera (front/back)
 */
export async function switchCamera(): Promise<boolean> {
  return nativeCamera.switchCamera();
}

/**
 * Set flash mode
 */
export async function setFlashMode(mode: 'off' | 'on' | 'auto'): Promise<boolean> {
  return nativeCamera.setFlashMode(mode);
}

/**
 * Set focus mode
 */
export async function setFocusMode(mode: 'auto' | 'manual'): Promise<boolean> {
  return nativeCamera.setFocusMode(mode);
}

/**
 * Set exposure mode
 */
export async function setExposureMode(mode: 'auto' | 'manual'): Promise<boolean> {
  return nativeCamera.setExposureMode(mode);
}

/**
 * Set white balance mode
 */
export async function setWhiteBalanceMode(mode: 'auto' | 'manual'): Promise<boolean> {
  return nativeCamera.setWhiteBalanceMode(mode);
}

/**
 * Set zoom level
 */
export async function setZoom(level: number): Promise<boolean> {
  return nativeCamera.setZoom(level);
}

/**
 * Focus at specific point
 */
export async function focusAtPoint(x: number, y: number): Promise<boolean> {
  return nativeCamera.focusAtPoint(x, y);
}

/**
 * Expose at specific point
 */
export async function exposeAtPoint(x: number, y: number): Promise<boolean> {
  return nativeCamera.exposeAtPoint(x, y);
}

/**
 * Get albums
 */
export async function getAlbums(): Promise<Array<{ id: string; name: string; count: number; thumbnailUri?: string }>> {
  return nativeCamera.getAlbums();
}

/**
 * Get media from specific album
 */
export async function getMediaFromAlbum(albumId: string, options: ImagePickerOptions = {}): Promise<ImagePickerResult> {
  const result = await nativeCamera.getMediaFromAlbum(albumId, {
    mediaTypes: ['image', 'video'],
    selectionLimit: options.selectionLimit || 1,
    quality: options.quality || 'high',
    allowEditing: options.allowEditing || false,
    enableCompression: true,
    compressionQuality: getCompressionQuality(options.quality),
  });

  return {
    assets: result.assets || [],
    canceled: result.canceled,
  };
}

/**
 * Compress image
 */
export async function compressImage(uri: string, options: { quality?: number; maxWidth?: number; maxHeight?: number; format?: string } = {}): Promise<MediaAsset> {
  return nativeCamera.compressImage(uri, options);
}

/**
 * Compress video
 */
export async function compressVideo(uri: string, options: { quality?: number; maxWidth?: number; maxHeight?: number; bitrate?: number } = {}): Promise<MediaAsset> {
  return nativeCamera.compressVideo(uri, options);
}

/**
 * Generate thumbnail
 */
export async function generateThumbnail(uri: string, options: { width?: number; height?: number; quality?: number } = {}): Promise<string> {
  return nativeCamera.generateThumbnail(uri, options);
}

/**
 * Extract metadata
 */
export async function extractMetadata(uri: string): Promise<Record<string, any>> {
  return nativeCamera.extractMetadata(uri);
}

/**
 * Crop image
 */
export async function cropImage(uri: string, cropData: { x: number; y: number; width: number; height: number }): Promise<MediaAsset> {
  return nativeCamera.cropImage(uri, cropData);
}

/**
 * Rotate image
 */
export async function rotateImage(uri: string, degrees: number): Promise<MediaAsset> {
  return nativeCamera.rotateImage(uri, degrees);
}

/**
 * Apply filter to image
 */
export async function applyFilter(uri: string, filter: string, intensity: number = 1.0): Promise<MediaAsset> {
  return nativeCamera.applyFilter(uri, filter, intensity);
}

/**
 * Upload media with progress
 */
export async function uploadMediaWithProgress(
  uri: string,
  options: {
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
  },
  onProgress: (progress: { mediaId: string; uploadedBytes: number; totalBytes: number; percentage: number; speed: number; estimatedTimeRemaining: number }) => void
): Promise<{ success: boolean; mediaId?: string; url?: string; thumbnailUrl?: string; hlsUrl?: string; webpUrl?: string; mp4Url?: string; error?: string }> {
  return nativeCamera.uploadMediaWithProgress(uri, options, onProgress);
}

/**
 * Cancel upload
 */
export async function cancelUpload(mediaId: string): Promise<boolean> {
  return nativeCamera.cancelUpload(mediaId);
}

/**
 * Request permissions
 */
export async function requestPermissions(): Promise<{
  camera: boolean;
  microphone: boolean;
  photoLibrary: boolean;
  location?: boolean;
}> {
  return nativeCamera.requestPermissions();
}

/**
 * Check permissions
 */
export async function checkPermissions(): Promise<{
  camera: boolean;
  microphone: boolean;
  photoLibrary: boolean;
  location?: boolean;
}> {
  return nativeCamera.checkPermissions();
}

/**
 * Get camera capabilities
 */
export async function getCameraCapabilities(): Promise<{
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
}> {
  return nativeCamera.getCameraCapabilities();
}

/**
 * Get device info
 */
export async function getDeviceInfo(): Promise<{ platform: string; version: string; model: string; manufacturer?: string }> {
  return nativeCamera.getDeviceInfo();
}

/**
 * Check if camera is available
 */
export async function isCameraAvailable(): Promise<boolean> {
  return nativeCamera.isCameraAvailable();
}

/**
 * Check if gallery is available
 */
export async function isGalleryAvailable(): Promise<boolean> {
  return nativeCamera.isGalleryAvailable();
}

/**
 * Add event listener
 */
export function addListener(eventName: string, callback: (data: any) => void): void {
  nativeCamera.addListener(eventName, callback);
}

/**
 * Remove event listener
 */
export function removeListener(eventName: string, callback: (data: any) => void): void {
  nativeCamera.removeListener(eventName, callback);
}

/**
 * Remove all listeners
 */
export function removeAllListeners(eventName?: string): void {
  nativeCamera.removeAllListeners(eventName);
}

// Helper functions
function getCompressionQuality(quality?: 'low' | 'medium' | 'high' | 'max'): number {
  switch (quality) {
    case 'low':
      return 0.3;
    case 'medium':
      return 0.6;
    case 'high':
      return 0.8;
    case 'max':
      return 1.0;
    default:
      return 0.8;
  }
}