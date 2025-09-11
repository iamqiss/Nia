// Re-export all types from video and image modules
export * from '../time-native-video-player/src/types';
export * from '../time-native-image-cache/src/types';

// Unified media types
export interface MediaSource {
  uri: string;
  type: 'video' | 'image';
  headers?: Record<string, string>;
  priority?: 'low' | 'normal' | 'high';
  cachePolicy?: 'memory' | 'disk' | 'memory-disk' | 'none';
  resize?: {
    width?: number;
    height?: number;
    mode?: 'contain' | 'cover' | 'stretch' | 'center';
  };
  // Video specific
  drm?: {
    type: 'widevine' | 'playready' | 'fairplay';
    licenseUrl: string;
    headers?: Record<string, string>;
    keyRequestProperties?: Record<string, string>;
  };
  startTime?: number;
  endTime?: number;
  // Image specific
  blurRadius?: number;
  borderRadius?: number;
  tintColor?: string;
}

export interface MediaConfig {
  // Video config
  video?: {
    preloadBufferSize: number;
    maxBufferSize: number;
    minBufferSize: number;
    bufferForPlayback: number;
    bufferForPlaybackAfterRebuffer: number;
    maxInitialBitrate: number;
    maxBitrate: number;
    adaptiveBitrateEnabled: boolean;
    preferredVideoQuality: 'auto' | 'low' | 'medium' | 'high' | 'ultra';
    allowQualityChange: boolean;
    audioFocusGain: 'gain' | 'gain_transient' | 'gain_transient_may_duck' | 'gain_transient_exclusive';
    allowBackgroundPlayback: boolean;
    hardwareAccelerationEnabled: boolean;
  };
  
  // Image config
  image?: {
    maxMemorySize: number;
    maxMemoryItems: number;
    memoryCacheEnabled: boolean;
    maxDiskSize: number;
    maxDiskAge: number;
    diskCacheEnabled: boolean;
    maxImageSize: { width: number; height: number };
    compressionQuality: number;
    enableWebP: boolean;
    enableProgressiveJPEG: boolean;
  };
  
  // Common config
  common?: {
    timeout: number;
    retryCount: number;
    retryDelay: number;
    maxConcurrentDownloads: number;
    enablePrefetching: boolean;
    prefetchBatchSize: number;
    enableBackgroundProcessing: boolean;
    enableLogging: boolean;
    enableAnalytics: boolean;
  };
}

export interface MediaLoadResult {
  uri: string;
  type: 'video' | 'image';
  width: number;
  height: number;
  size: number;
  format: string;
  fromCache: boolean;
  loadTime: number;
  error?: string;
  // Video specific
  duration?: number;
  naturalSize?: { width: number; height: number };
  // Image specific
  aspectRatio?: number;
}

export interface MediaAnalytics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  totalLoadTime: number;
  averageLoadTime: number;
  errorCount: number;
  errorRate: number;
  dataTransferred: number;
  memoryUsage: number;
  diskUsage: number;
  // Video specific
  totalPlayTime?: number;
  totalBufferTime?: number;
  rebufferCount?: number;
  averageBitrate?: number;
  qualityChanges?: number;
  // Image specific
  imageProcessingTime?: number;
  compressionRatio?: number;
}

export interface MediaCacheStats {
  memoryCacheSize: number;
  memoryCacheItems: number;
  diskCacheSize: number;
  diskCacheItems: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
  totalRequests: number;
  totalLoadTime: number;
  averageLoadTime: number;
}

export interface MediaCacheHealth {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
  memoryUsage: number;
  diskUsage: number;
  hitRate: number;
  averageLoadTime: number;
}

export interface MediaPrefetchOptions {
  sources: MediaSource[];
  priority?: 'low' | 'normal' | 'high';
  batchSize?: number;
  onProgress?: (completed: number, total: number) => void;
  onComplete?: (results: MediaLoadResult[]) => void;
  onError?: (error: string) => void;
}

export interface MediaBatchLoadOptions {
  sources: MediaSource[];
  onLoad?: (results: MediaLoadResult[]) => void;
  onError?: (error: string) => void;
  onProgress?: (completed: number, total: number) => void;
  priority?: 'low' | 'normal' | 'high';
  batchSize?: number;
  timeout?: number;
  retryCount?: number;
}

export interface MediaLoadOptions {
  source: MediaSource;
  onLoad?: (result: MediaLoadResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
  priority?: 'low' | 'normal' | 'high';
  timeout?: number;
  retryCount?: number;
}

export interface MediaManager {
  // Configuration
  configure(config: Partial<MediaConfig>): void;
  getConfig(): MediaConfig;
  
  // Loading
  loadMedia(options: MediaLoadOptions): Promise<MediaLoadResult>;
  loadMediaBatch(options: MediaBatchLoadOptions): Promise<MediaLoadResult[]>;
  prefetchMedia(options: MediaPrefetchOptions): Promise<void>;
  
  // Caching
  isMediaCached(uri: string): Promise<boolean>;
  getCachedMediaInfo(uri: string): Promise<any>;
  removeMediaFromCache(uri: string): Promise<void>;
  clearCache(): Promise<void>;
  clearMemoryCache(): Promise<void>;
  clearDiskCache(): Promise<void>;
  
  // Statistics
  getCacheStats(): Promise<MediaCacheStats>;
  getAnalytics(): Promise<MediaAnalytics>;
  getCacheHealth(): Promise<MediaCacheHealth>;
  
  // Management
  optimizeCache(): Promise<void>;
  getCacheRecommendations(): Promise<any>;
  
  // Export/Import
  exportCacheData(): Promise<any>;
  importCacheData(data: any): Promise<void>;
}

export interface MediaViewProps {
  source: MediaSource;
  style?: any;
  config?: Partial<MediaConfig>;
  onLoad?: (result: MediaLoadResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
  priority?: 'low' | 'normal' | 'high';
  timeout?: number;
  retryCount?: number;
  placeholder?: string;
  fallback?: string;
  // Video specific
  paused?: boolean;
  muted?: boolean;
  volume?: number;
  playbackRate?: number;
  repeat?: boolean;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  // Image specific
  blurRadius?: number;
  borderRadius?: number;
  tintColor?: string;
  transform?: any;
}

export interface MediaViewRef {
  // Loading control
  load: () => Promise<MediaLoadResult>;
  reload: () => Promise<MediaLoadResult>;
  cancel: () => void;
  
  // Cache management
  isCached: () => Promise<boolean>;
  removeFromCache: () => Promise<void>;
  clearCache: () => Promise<void>;
  
  // State queries
  isLoading: () => boolean;
  hasError: () => boolean;
  getError: () => string | null;
  getResult: () => MediaLoadResult | null;
  
  // Video specific
  play?: () => void;
  pause?: () => void;
  stop?: () => void;
  seek?: (time: number) => void;
  setPlaybackRate?: (rate: number) => void;
  setVolume?: (volume: number) => void;
  setMuted?: (muted: boolean) => void;
  enterFullscreen?: () => void;
  exitFullscreen?: () => void;
  
  // Image specific
  process?: (options: any) => Promise<any>;
}