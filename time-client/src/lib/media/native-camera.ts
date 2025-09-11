/**
 * Native Camera Integration
 * 
 * This module provides a React Native interface to the native camera module,
 * replacing the Expo image picker with native performance and gRPC integration.
 */

import { NativeModules, Platform } from 'react-native';
import TimeNativeCamera, {
  type CameraOptions,
  type MediaAsset,
  type CameraResult,
  type GalleryOptions,
  type GalleryResult,
  type MediaUploadOptions,
  type UploadResult,
  type CameraPermissions,
  type CameraCapabilities,
} from '../../modules/time-native-camera';
import { MediaServiceClient } from '../../modules/time-native-camera/src/grpc/MediaServiceClient';

// Re-export types for convenience
export type {
  CameraOptions,
  MediaAsset,
  CameraResult,
  GalleryOptions,
  GalleryResult,
  MediaUploadOptions,
  UploadResult,
  CameraPermissions,
  CameraCapabilities,
};

// Configuration
const MEDIA_SERVICE_URL = process.env.EXPO_PUBLIC_MEDIA_SERVICE_URL || 'localhost:50051';
const CHUNK_SIZE = 64 * 1024; // 64KB
const UPLOAD_TIMEOUT = 30000; // 30 seconds
const RETRY_ATTEMPTS = 3;

// Global gRPC client instance
let mediaServiceClient: MediaServiceClient | null = null;

/**
 * Initialize the media service client
 */
export function initializeMediaService(): MediaServiceClient {
  if (!mediaServiceClient) {
    mediaServiceClient = new MediaServiceClient(MEDIA_SERVICE_URL, {
      'grpc.keepalive_time_ms': 30000,
      'grpc.keepalive_timeout_ms': 5000,
      'grpc.keepalive_permit_without_calls': true,
    });
  }
  return mediaServiceClient;
}

/**
 * Get the media service client
 */
export function getMediaServiceClient(): MediaServiceClient {
  if (!mediaServiceClient) {
    return initializeMediaService();
  }
  return mediaServiceClient;
}

/**
 * Native Camera API
 */
export class NativeCameraAPI {
  private static instance: NativeCameraAPI;
  private camera: typeof TimeNativeCamera;
  private mediaClient: MediaServiceClient;

  private constructor() {
    this.camera = TimeNativeCamera;
    this.mediaClient = getMediaServiceClient();
  }

  public static getInstance(): NativeCameraAPI {
    if (!NativeCameraAPI.instance) {
      NativeCameraAPI.instance = new NativeCameraAPI();
    }
    return NativeCameraAPI.instance;
  }

  // Camera Methods
  public async openCamera(options: CameraOptions = {}): Promise<CameraResult> {
    return this.camera.openCamera(options);
  }

  public async openCameraWithPreview(options: CameraOptions = {}): Promise<CameraResult> {
    return this.camera.openCameraWithPreview(options);
  }

  public async startVideoRecording(options: CameraOptions = {}): Promise<void> {
    return this.camera.startVideoRecording(options);
  }

  public async stopVideoRecording(): Promise<CameraResult> {
    return this.camera.stopVideoRecording();
  }

  public async takePicture(options: CameraOptions = {}): Promise<MediaAsset> {
    return this.camera.takePicture(options);
  }

  public async switchCamera(): Promise<boolean> {
    return this.camera.switchCamera();
  }

  public async setFlashMode(mode: 'off' | 'on' | 'auto'): Promise<boolean> {
    return this.camera.setFlashMode(mode);
  }

  public async setFocusMode(mode: 'auto' | 'manual'): Promise<boolean> {
    return this.camera.setFocusMode(mode);
  }

  public async setExposureMode(mode: 'auto' | 'manual'): Promise<boolean> {
    return this.camera.setExposureMode(mode);
  }

  public async setWhiteBalanceMode(mode: 'auto' | 'manual'): Promise<boolean> {
    return this.camera.setWhiteBalanceMode(mode);
  }

  public async setZoom(level: number): Promise<boolean> {
    return this.camera.setZoom(level);
  }

  public async focusAtPoint(x: number, y: number): Promise<boolean> {
    return this.camera.focusAtPoint(x, y);
  }

  public async exposeAtPoint(x: number, y: number): Promise<boolean> {
    return this.camera.exposeAtPoint(x, y);
  }

  // Gallery Methods
  public async openGallery(options: GalleryOptions = {}): Promise<GalleryResult> {
    return this.camera.openGallery(options);
  }

  public async getAlbums(): Promise<Array<{ id: string; name: string; count: number; thumbnailUri?: string }>> {
    return this.camera.getAlbums();
  }

  public async getMediaFromAlbum(albumId: string, options: GalleryOptions = {}): Promise<GalleryResult> {
    return this.camera.getMediaFromAlbum(albumId, options);
  }

  // Media Processing Methods
  public async compressImage(uri: string, options: { quality?: number; maxWidth?: number; maxHeight?: number; format?: string } = {}): Promise<MediaAsset> {
    return this.camera.compressImage(uri, options);
  }

  public async compressVideo(uri: string, options: { quality?: number; maxWidth?: number; maxHeight?: number; bitrate?: number } = {}): Promise<MediaAsset> {
    return this.camera.compressVideo(uri, options);
  }

  public async generateThumbnail(uri: string, options: { width?: number; height?: number; quality?: number } = {}): Promise<string> {
    return this.camera.generateThumbnail(uri, options);
  }

  public async extractMetadata(uri: string): Promise<Record<string, any>> {
    return this.camera.extractMetadata(uri);
  }

  public async cropImage(uri: string, cropData: { x: number; y: number; width: number; height: number }): Promise<MediaAsset> {
    return this.camera.cropImage(uri, cropData);
  }

  public async rotateImage(uri: string, degrees: number): Promise<MediaAsset> {
    return this.camera.rotateImage(uri, degrees);
  }

  public async applyFilter(uri: string, filter: string, intensity: number = 1.0): Promise<MediaAsset> {
    return this.camera.applyFilter(uri, filter, intensity);
  }

  // Upload Methods
  public async uploadMedia(uri: string, options: MediaUploadOptions): Promise<UploadResult> {
    return this.camera.uploadMedia(uri, options);
  }

  public async uploadMediaWithProgress(
    uri: string, 
    options: MediaUploadOptions, 
    onProgress: (progress: { mediaId: string; uploadedBytes: number; totalBytes: number; percentage: number; speed: number; estimatedTimeRemaining: number }) => void
  ): Promise<UploadResult> {
    return this.camera.uploadMediaWithProgress(uri, options, onProgress);
  }

  public async cancelUpload(mediaId: string): Promise<boolean> {
    return this.camera.cancelUpload(mediaId);
  }

  // Permission Methods
  public async requestPermissions(): Promise<CameraPermissions> {
    return this.camera.requestPermissions();
  }

  public async checkPermissions(): Promise<CameraPermissions> {
    return this.camera.checkPermissions();
  }

  // Utility Methods
  public async getCameraCapabilities(): Promise<CameraCapabilities> {
    return this.camera.getCameraCapabilities();
  }

  public async getDeviceInfo(): Promise<{ platform: string; version: string; model: string; manufacturer?: string }> {
    return this.camera.getDeviceInfo();
  }

  public async isCameraAvailable(): Promise<boolean> {
    return this.camera.isCameraAvailable();
  }

  public async isGalleryAvailable(): Promise<boolean> {
    return this.camera.isGalleryAvailable();
  }

  // Event listener methods
  public addListener(eventName: string, callback: (data: any) => void): void {
    this.camera.addListener(eventName, callback);
  }

  public removeListener(eventName: string, callback: (data: any) => void): void {
    this.camera.removeListener(eventName, callback);
  }

  public removeAllListeners(eventName?: string): void {
    this.camera.removeAllListeners(eventName);
  }
}

// Export singleton instance
export const nativeCamera = NativeCameraAPI.getInstance();

// Legacy compatibility functions that match the Expo image picker API
export async function openPicker(opts?: CameraOptions): Promise<MediaAsset[]> {
  const result = await nativeCamera.openGallery({
    mediaTypes: ['image'],
    selectionLimit: 1,
    quality: opts?.quality || 'high',
    allowEditing: opts?.allowEditing || false,
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

export async function openUnifiedPicker({
  selectionCountRemaining,
}: {
  selectionCountRemaining: number;
}): Promise<{ assets: MediaAsset[]; canceled: boolean }> {
  const result = await nativeCamera.openGallery({
    mediaTypes: ['image', 'video'],
    selectionLimit: selectionCountRemaining,
    quality: 'high',
    allowEditing: false,
  });

  return {
    assets: result.assets || [],
    canceled: result.canceled,
  };
}

export async function openCamera(customOpts: CameraOptions): Promise<MediaAsset> {
  const result = await nativeCamera.openCamera({
    quality: 'high',
    allowEditing: false,
    ...customOpts,
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

// Export the native camera instance as default
export default nativeCamera;