export interface ImageCacheConfig {
  // Memory cache settings
  maxMemorySize: number; // in bytes
  maxMemoryItems: number;
  memoryCacheEnabled: boolean;
  
  // Disk cache settings
  maxDiskSize: number; // in bytes
  maxDiskAge: number; // in milliseconds
  diskCacheEnabled: boolean;
  cacheDirectory?: string;
  
  // Image processing settings
  maxImageSize: { width: number; height: number };
  compressionQuality: number; // 0-1
  enableWebP: boolean;
  enableProgressiveJPEG: boolean;
  
  // Network settings
  timeout: number; // in milliseconds
  retryCount: number;
  retryDelay: number; // in milliseconds
  maxConcurrentDownloads: number;
  
  // Performance settings
  enablePrefetching: boolean;
  prefetchBatchSize: number;
  enableBackgroundProcessing: boolean;
  
  // Debug settings
  enableLogging: boolean;
  enableAnalytics: boolean;
}

export interface ImageSource {
  uri: string;
  headers?: Record<string, string>;
  priority?: 'low' | 'normal' | 'high';
  cachePolicy?: 'memory' | 'disk' | 'memory-disk' | 'none';
  resize?: {
    width?: number;
    height?: number;
    mode?: 'contain' | 'cover' | 'stretch' | 'center';
  };
  blurRadius?: number;
  borderRadius?: number;
  tintColor?: string;
}

export interface ImageLoadResult {
  uri: string;
  width: number;
  height: number;
  size: number; // in bytes
  format: 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp' | 'unknown';
  fromCache: boolean;
  loadTime: number; // in milliseconds
  error?: string;
}

export interface ImageCacheStats {
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

export interface ImageAnalytics {
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
}

export interface ImagePrefetchOptions {
  sources: ImageSource[];
  priority?: 'low' | 'normal' | 'high';
  batchSize?: number;
  onProgress?: (completed: number, total: number) => void;
  onComplete?: (results: ImageLoadResult[]) => void;
  onError?: (error: string) => void;
}

export interface ImageTransformOptions {
  resize?: {
    width?: number;
    height?: number;
    mode?: 'contain' | 'cover' | 'stretch' | 'center';
  };
  blur?: number;
  borderRadius?: number;
  tintColor?: string;
  brightness?: number; // -1 to 1
  contrast?: number; // -1 to 1
  saturation?: number; // -1 to 1
  hue?: number; // 0 to 360
  gamma?: number; // 0.1 to 3.0
  sharpen?: number; // 0 to 1
  sepia?: number; // 0 to 1
  grayscale?: boolean;
  invert?: boolean;
  flip?: 'horizontal' | 'vertical' | 'both';
  rotate?: number; // degrees
}

export interface ImageProcessingResult {
  uri: string;
  width: number;
  height: number;
  size: number;
  format: string;
  processingTime: number;
  error?: string;
}

export interface ImageCacheItem {
  uri: string;
  width: number;
  height: number;
  size: number;
  format: string;
  lastAccessed: number;
  accessCount: number;
  priority: 'low' | 'normal' | 'high';
  expiresAt?: number;
}

export interface ImageCacheHealth {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
  memoryUsage: number;
  diskUsage: number;
  hitRate: number;
  averageLoadTime: number;
}

export interface ImageLoadOptions {
  source: ImageSource;
  onLoad?: (result: ImageLoadResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
  priority?: 'low' | 'normal' | 'high';
  timeout?: number;
  retryCount?: number;
}

export interface ImageBatchLoadOptions {
  sources: ImageSource[];
  onLoad?: (results: ImageLoadResult[]) => void;
  onError?: (error: string) => void;
  onProgress?: (completed: number, total: number) => void;
  priority?: 'low' | 'normal' | 'high';
  batchSize?: number;
  timeout?: number;
  retryCount?: number;
}

export interface ImageCacheManager {
  // Configuration
  configure(config: Partial<ImageCacheConfig>): void;
  getConfig(): ImageCacheConfig;
  
  // Loading
  loadImage(options: ImageLoadOptions): Promise<ImageLoadResult>;
  loadImages(options: ImageBatchLoadOptions): Promise<ImageLoadResult[]>;
  prefetchImages(options: ImagePrefetchOptions): Promise<void>;
  
  // Caching
  isImageCached(uri: string): Promise<boolean>;
  getCachedImageInfo(uri: string): Promise<ImageCacheItem | null>;
  removeImageFromCache(uri: string): Promise<void>;
  clearCache(): Promise<void>;
  clearMemoryCache(): Promise<void>;
  clearDiskCache(): Promise<void>;
  
  // Statistics
  getCacheStats(): Promise<ImageCacheStats>;
  getAnalytics(): Promise<ImageAnalytics>;
  getCacheHealth(): Promise<ImageCacheHealth>;
  
  // Processing
  processImage(uri: string, options: ImageTransformOptions): Promise<ImageProcessingResult>;
  batchProcessImages(uris: string[], options: ImageTransformOptions): Promise<ImageProcessingResult[]>;
  
  // Management
  optimizeCache(): Promise<void>;
  getCacheRecommendations(): Promise<{
    recommendedMaxMemorySize: number;
    recommendedMaxDiskSize: number;
    recommendedMaxAge: number;
    shouldEnableCompression: boolean;
    shouldEnableWebP: boolean;
  }>;
  
  // Export/Import
  exportCacheData(): Promise<{
    items: ImageCacheItem[];
    totalSize: number;
    exportDate: number;
  }>;
  importCacheData(data: {
    items: ImageCacheItem[];
    totalSize: number;
    exportDate: number;
  }): Promise<void>;
}