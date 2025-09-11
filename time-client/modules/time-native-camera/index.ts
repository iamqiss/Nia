/**
 * Time Native Camera Module
 * 
 * A comprehensive native camera module for iOS and Android that provides:
 * - Native camera capture with advanced controls
 * - Gallery selection with native performance
 * - gRPC media service integration
 * - Real-time preview and recording
 * - Image/video processing and compression
 * - Permission handling
 */

import { NativeModules, Platform } from 'react-native';

// Type definitions
export interface CameraOptions {
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
  customOverlay?: string; // Base64 encoded overlay image
  watermark?: {
    text?: string;
    image?: string; // Base64 encoded
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity?: number;
  };
}

export interface MediaAsset {
  uri: string;
  type: 'image' | 'video' | 'gif';
  mimeType: string;
  width: number;
  height: number;
  size: number;
  duration?: number; // for video/gif
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

export interface CameraResult {
  assets: MediaAsset[];
  canceled: boolean;
  error?: string;
}

export interface GalleryOptions {
  mediaTypes?: ('image' | 'video' | 'gif')[];
  selectionLimit?: number;
  quality?: 'low' | 'medium' | 'high' | 'max';
  allowEditing?: boolean;
  enableCompression?: boolean;
  compressionQuality?: number;
  maxFileSize?: number;
  maxDuration?: number; // for video
  enableMetadata?: boolean;
  enableLocation?: boolean;
  sortOrder?: 'newest' | 'oldest' | 'name' | 'size';
  albumName?: string;
}

export interface GalleryResult {
  assets: MediaAsset[];
  canceled: boolean;
  error?: string;
}

export interface MediaUploadOptions {
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

export interface UploadProgress {
  mediaId: string;
  uploadedBytes: number;
  totalBytes: number;
  percentage: number;
  speed: number; // bytes per second
  estimatedTimeRemaining: number; // seconds
}

export interface UploadResult {
  success: boolean;
  mediaId?: string;
  url?: string;
  thumbnailUrl?: string;
  hlsUrl?: string;
  webpUrl?: string;
  mp4Url?: string;
  error?: string;
}

export interface CameraPermissions {
  camera: boolean;
  microphone: boolean;
  photoLibrary: boolean;
  location?: boolean;
}

export interface CameraCapabilities {
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

// Native module interface
interface TimeNativeCameraModuleInterface {
  // Camera methods
  openCamera(options?: CameraOptions): Promise<CameraResult>;
  openCameraWithPreview(options?: CameraOptions): Promise<CameraResult>;
  startVideoRecording(options?: CameraOptions): Promise<void>;
  stopVideoRecording(): Promise<CameraResult>;
  takePicture(options?: CameraOptions): Promise<MediaAsset>;
  switchCamera(): Promise<boolean>;
  setFlashMode(mode: 'off' | 'on' | 'auto'): Promise<boolean>;
  setFocusMode(mode: 'auto' | 'manual'): Promise<boolean>;
  setExposureMode(mode: 'auto' | 'manual'): Promise<boolean>;
  setWhiteBalanceMode(mode: 'auto' | 'manual'): Promise<boolean>;
  setZoom(level: number): Promise<boolean>;
  focusAtPoint(x: number, y: number): Promise<boolean>;
  exposeAtPoint(x: number, y: number): Promise<boolean>;
  
  // Gallery methods
  openGallery(options?: GalleryOptions): Promise<GalleryResult>;
  getAlbums(): Promise<Array<{ id: string; name: string; count: number; thumbnailUri?: string }>>;
  getMediaFromAlbum(albumId: string, options?: GalleryOptions): Promise<GalleryResult>;
  
  // Media processing methods
  compressImage(uri: string, options?: { quality?: number; maxWidth?: number; maxHeight?: number; format?: string }): Promise<MediaAsset>;
  compressVideo(uri: string, options?: { quality?: number; maxWidth?: number; maxHeight?: number; bitrate?: number }): Promise<MediaAsset>;
  generateThumbnail(uri: string, options?: { width?: number; height?: number; quality?: number }): Promise<string>;
  extractMetadata(uri: string): Promise<Record<string, any>>;
  cropImage(uri: string, cropData: { x: number; y: number; width: number; height: number }): Promise<MediaAsset>;
  rotateImage(uri: string, degrees: number): Promise<MediaAsset>;
  applyFilter(uri: string, filter: string, intensity?: number): Promise<MediaAsset>;
  
  // Upload methods
  uploadMedia(uri: string, options: MediaUploadOptions): Promise<UploadResult>;
  uploadMediaWithProgress(uri: string, options: MediaUploadOptions, onProgress: (progress: UploadProgress) => void): Promise<UploadResult>;
  cancelUpload(mediaId: string): Promise<boolean>;
  
  // Permission methods
  requestPermissions(): Promise<CameraPermissions>;
  checkPermissions(): Promise<CameraPermissions>;
  
  // Utility methods
  getCameraCapabilities(): Promise<CameraCapabilities>;
  getDeviceInfo(): Promise<{ platform: string; version: string; model: string; manufacturer?: string }>;
  isCameraAvailable(): Promise<boolean>;
  isGalleryAvailable(): Promise<boolean>;
  
  // Event listeners
  addListener(eventName: string, callback: (data: any) => void): void;
  removeListener(eventName: string, callback: (data: any) => void): void;
  removeAllListeners(eventName?: string): void;
}

// Get the native module
const { TimeNativeCameraModule } = NativeModules;

// Validate platform support
if (!TimeNativeCameraModule) {
  throw new Error('TimeNativeCameraModule is not available on this platform');
}

// Main module class
export class TimeNativeCamera {
  private static instance: TimeNativeCamera;
  private module: TimeNativeCameraModuleInterface;
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  private constructor() {
    this.module = TimeNativeCameraModule;
  }

  public static getInstance(): TimeNativeCamera {
    if (!TimeNativeCamera.instance) {
      TimeNativeCamera.instance = new TimeNativeCamera();
    }
    return TimeNativeCamera.instance;
  }

  // Camera methods
  public async openCamera(options: CameraOptions = {}): Promise<CameraResult> {
    return this.module.openCamera(options);
  }

  public async openCameraWithPreview(options: CameraOptions = {}): Promise<CameraResult> {
    return this.module.openCameraWithPreview(options);
  }

  public async startVideoRecording(options: CameraOptions = {}): Promise<void> {
    return this.module.startVideoRecording(options);
  }

  public async stopVideoRecording(): Promise<CameraResult> {
    return this.module.stopVideoRecording();
  }

  public async takePicture(options: CameraOptions = {}): Promise<MediaAsset> {
    return this.module.takePicture(options);
  }

  public async switchCamera(): Promise<boolean> {
    return this.module.switchCamera();
  }

  public async setFlashMode(mode: 'off' | 'on' | 'auto'): Promise<boolean> {
    return this.module.setFlashMode(mode);
  }

  public async setFocusMode(mode: 'auto' | 'manual'): Promise<boolean> {
    return this.module.setFocusMode(mode);
  }

  public async setExposureMode(mode: 'auto' | 'manual'): Promise<boolean> {
    return this.module.setExposureMode(mode);
  }

  public async setWhiteBalanceMode(mode: 'auto' | 'manual'): Promise<boolean> {
    return this.module.setWhiteBalanceMode(mode);
  }

  public async setZoom(level: number): Promise<boolean> {
    return this.module.setZoom(level);
  }

  public async focusAtPoint(x: number, y: number): Promise<boolean> {
    return this.module.focusAtPoint(x, y);
  }

  public async exposeAtPoint(x: number, y: number): Promise<boolean> {
    return this.module.exposeAtPoint(x, y);
  }

  // Gallery methods
  public async openGallery(options: GalleryOptions = {}): Promise<GalleryResult> {
    return this.module.openGallery(options);
  }

  public async getAlbums(): Promise<Array<{ id: string; name: string; count: number; thumbnailUri?: string }>> {
    return this.module.getAlbums();
  }

  public async getMediaFromAlbum(albumId: string, options: GalleryOptions = {}): Promise<GalleryResult> {
    return this.module.getMediaFromAlbum(albumId, options);
  }

  // Media processing methods
  public async compressImage(uri: string, options: { quality?: number; maxWidth?: number; maxHeight?: number; format?: string } = {}): Promise<MediaAsset> {
    return this.module.compressImage(uri, options);
  }

  public async compressVideo(uri: string, options: { quality?: number; maxWidth?: number; maxHeight?: number; bitrate?: number } = {}): Promise<MediaAsset> {
    return this.module.compressVideo(uri, options);
  }

  public async generateThumbnail(uri: string, options: { width?: number; height?: number; quality?: number } = {}): Promise<string> {
    return this.module.generateThumbnail(uri, options);
  }

  public async extractMetadata(uri: string): Promise<Record<string, any>> {
    return this.module.extractMetadata(uri);
  }

  public async cropImage(uri: string, cropData: { x: number; y: number; width: number; height: number }): Promise<MediaAsset> {
    return this.module.cropImage(uri, cropData);
  }

  public async rotateImage(uri: string, degrees: number): Promise<MediaAsset> {
    return this.module.rotateImage(uri, degrees);
  }

  public async applyFilter(uri: string, filter: string, intensity: number = 1.0): Promise<MediaAsset> {
    return this.module.applyFilter(uri, filter, intensity);
  }

  // Upload methods
  public async uploadMedia(uri: string, options: MediaUploadOptions): Promise<UploadResult> {
    return this.module.uploadMedia(uri, options);
  }

  public async uploadMediaWithProgress(uri: string, options: MediaUploadOptions, onProgress: (progress: UploadProgress) => void): Promise<UploadResult> {
    return this.module.uploadMediaWithProgress(uri, options, onProgress);
  }

  public async cancelUpload(mediaId: string): Promise<boolean> {
    return this.module.cancelUpload(mediaId);
  }

  // Permission methods
  public async requestPermissions(): Promise<CameraPermissions> {
    return this.module.requestPermissions();
  }

  public async checkPermissions(): Promise<CameraPermissions> {
    return this.module.checkPermissions();
  }

  // Utility methods
  public async getCameraCapabilities(): Promise<CameraCapabilities> {
    return this.module.getCameraCapabilities();
  }

  public async getDeviceInfo(): Promise<{ platform: string; version: string; model: string; manufacturer?: string }> {
    return this.module.getDeviceInfo();
  }

  public async isCameraAvailable(): Promise<boolean> {
    return this.module.isCameraAvailable();
  }

  public async isGalleryAvailable(): Promise<boolean> {
    return this.module.isGalleryAvailable();
  }

  // Event listener methods
  public addListener(eventName: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, new Set());
    }
    this.eventListeners.get(eventName)!.add(callback);
    this.module.addListener(eventName, callback);
  }

  public removeListener(eventName: string, callback: (data: any) => void): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.delete(callback);
      this.module.removeListener(eventName, callback);
    }
  }

  public removeAllListeners(eventName?: string): void {
    if (eventName) {
      const listeners = this.eventListeners.get(eventName);
      if (listeners) {
        listeners.forEach(callback => {
          this.module.removeListener(eventName, callback);
        });
        listeners.clear();
      }
    } else {
      this.eventListeners.forEach((listeners, event) => {
        listeners.forEach(callback => {
          this.module.removeListener(event, callback);
        });
        listeners.clear();
      });
      this.eventListeners.clear();
    }
    this.module.removeAllListeners(eventName);
  }
}

// Export singleton instance
export default TimeNativeCamera.getInstance();

// Export types
export type {
  CameraOptions,
  MediaAsset,
  CameraResult,
  GalleryOptions,
  GalleryResult,
  MediaUploadOptions,
  UploadProgress,
  UploadResult,
  CameraPermissions,
  CameraCapabilities,
};