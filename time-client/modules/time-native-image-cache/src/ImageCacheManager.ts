import { NativeModules, NativeEventEmitter } from 'react-native';
import {
  ImageSource,
  ImageLoadResult,
  ImageCacheConfig,
  ImageTransformOptions,
  ImageProcessingResult,
  ImageCacheStats,
  ImageAnalytics,
  ImageCacheHealth,
  ImagePrefetchOptions,
  ImageBatchLoadOptions,
  ImageLoadOptions,
  ImageCacheItem
} from './types';

const { TimeNativeImageCacheModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(TimeNativeImageCacheModule);

export class ImageCacheManager {
  private static instance: ImageCacheManager;
  private config: ImageCacheConfig;
  private activeLoads: Map<string, Promise<ImageLoadResult>> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
  }

  public static getInstance(): ImageCacheManager {
    if (!ImageCacheManager.instance) {
      ImageCacheManager.instance = new ImageCacheManager();
    }
    return ImageCacheManager.instance;
  }

  private getDefaultConfig(): ImageCacheConfig {
    return {
      maxMemorySize: 100 * 1024 * 1024, // 100 MB
      maxMemoryItems: 1000,
      memoryCacheEnabled: true,
      maxDiskSize: 500 * 1024 * 1024, // 500 MB
      maxDiskAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      diskCacheEnabled: true,
      maxImageSize: { width: 2048, height: 2048 },
      compressionQuality: 0.8,
      enableWebP: true,
      enableProgressiveJPEG: true,
      timeout: 30000, // 30 seconds
      retryCount: 3,
      retryDelay: 1000, // 1 second
      maxConcurrentDownloads: 5,
      enablePrefetching: true,
      prefetchBatchSize: 10,
      enableBackgroundProcessing: true,
      enableLogging: __DEV__,
      enableAnalytics: true,
    };
  }

  /**
   * Configure the image cache manager
   */
  public configure(config: Partial<ImageCacheConfig>): void {
    this.config = { ...this.config, ...config };
    TimeNativeImageCacheModule.configure(this.config);
  }

  /**
   * Get current configuration
   */
  public getConfig(): ImageCacheConfig {
    return { ...this.config };
  }

  /**
   * Load a single image
   */
  public async loadImage(options: ImageLoadOptions): Promise<ImageLoadResult> {
    const { source, priority = 'normal', timeout, retryCount } = options;
    
    // Check if already loading
    const loadKey = `${source.uri}_${priority}`;
    if (this.activeLoads.has(loadKey)) {
      return this.activeLoads.get(loadKey)!;
    }

    const loadPromise = TimeNativeImageCacheModule.loadImage({
      source,
      priority,
      timeout: timeout || this.config.timeout,
      retryCount: retryCount || this.config.retryCount,
      config: this.config,
    });

    this.activeLoads.set(loadKey, loadPromise);
    
    try {
      const result = await loadPromise;
      return result;
    } finally {
      this.activeLoads.delete(loadKey);
    }
  }

  /**
   * Load multiple images in batch
   */
  public async loadImages(options: ImageBatchLoadOptions): Promise<ImageLoadResult[]> {
    const { sources, priority = 'normal', batchSize = 5, timeout, retryCount } = options;
    
    const results: ImageLoadResult[] = [];
    const batches = this.chunkArray(sources, batchSize);
    
    for (const batch of batches) {
      const batchPromises = batch.map(source => 
        this.loadImage({
          source,
          priority,
          timeout,
          retryCount,
        })
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          // Handle rejected promises
          results.push({
            uri: '',
            width: 0,
            height: 0,
            size: 0,
            format: 'unknown',
            fromCache: false,
            loadTime: 0,
            error: result.reason?.message || 'Unknown error',
          });
        }
      }
      
      // Report progress
      options.onProgress?.(results.length, sources.length);
    }
    
    options.onLoad?.(results);
    return results;
  }

  /**
   * Prefetch images for better performance
   */
  public async prefetchImages(options: ImagePrefetchOptions): Promise<void> {
    const { sources, priority = 'normal', batchSize = 10 } = options;
    
    return TimeNativeImageCacheModule.prefetchImages({
      sources,
      priority,
      batchSize,
      config: this.config,
    });
  }

  /**
   * Check if image is cached
   */
  public async isImageCached(uri: string): Promise<boolean> {
    return TimeNativeImageCacheModule.isImageCached(uri);
  }

  /**
   * Get cached image information
   */
  public async getCachedImageInfo(uri: string): Promise<ImageCacheItem | null> {
    return TimeNativeImageCacheModule.getCachedImageInfo(uri);
  }

  /**
   * Remove image from cache
   */
  public async removeImageFromCache(uri: string): Promise<void> {
    return TimeNativeImageCacheModule.removeImageFromCache(uri);
  }

  /**
   * Clear all cache
   */
  public async clearCache(): Promise<void> {
    return TimeNativeImageCacheModule.clearCache();
  }

  /**
   * Clear memory cache only
   */
  public async clearMemoryCache(): Promise<void> {
    return TimeNativeImageCacheModule.clearMemoryCache();
  }

  /**
   * Clear disk cache only
   */
  public async clearDiskCache(): Promise<void> {
    return TimeNativeImageCacheModule.clearDiskCache();
  }

  /**
   * Get cache statistics
   */
  public async getCacheStats(): Promise<ImageCacheStats> {
    return TimeNativeImageCacheModule.getCacheStats();
  }

  /**
   * Get analytics data
   */
  public async getAnalytics(): Promise<ImageAnalytics> {
    return TimeNativeImageCacheModule.getAnalytics();
  }

  /**
   * Get cache health status
   */
  public async getCacheHealth(): Promise<ImageCacheHealth> {
    return TimeNativeImageCacheModule.getCacheHealth();
  }

  /**
   * Process image with transformations
   */
  public async processImage(uri: string, options: ImageTransformOptions): Promise<ImageProcessingResult> {
    return TimeNativeImageCacheModule.processImage(uri, options);
  }

  /**
   * Process multiple images with transformations
   */
  public async batchProcessImages(uris: string[], options: ImageTransformOptions): Promise<ImageProcessingResult[]> {
    return TimeNativeImageCacheModule.batchProcessImages(uris, options);
  }

  /**
   * Optimize cache based on usage patterns
   */
  public async optimizeCache(): Promise<void> {
    return TimeNativeImageCacheModule.optimizeCache();
  }

  /**
   * Get cache recommendations
   */
  public async getCacheRecommendations(): Promise<{
    recommendedMaxMemorySize: number;
    recommendedMaxDiskSize: number;
    recommendedMaxAge: number;
    shouldEnableCompression: boolean;
    shouldEnableWebP: boolean;
  }> {
    return TimeNativeImageCacheModule.getCacheRecommendations();
  }

  /**
   * Export cache data for backup
   */
  public async exportCacheData(): Promise<{
    items: ImageCacheItem[];
    totalSize: number;
    exportDate: number;
  }> {
    return TimeNativeImageCacheModule.exportCacheData();
  }

  /**
   * Import cache data from backup
   */
  public async importCacheData(data: {
    items: ImageCacheItem[];
    totalSize: number;
    exportDate: number;
  }): Promise<void> {
    return TimeNativeImageCacheModule.importCacheData(data);
  }

  /**
   * Set memory cache size limit
   */
  public setMaxMemorySize(size: number): void {
    this.config.maxMemorySize = size;
    TimeNativeImageCacheModule.setMaxMemorySize(size);
  }

  /**
   * Set disk cache size limit
   */
  public setMaxDiskSize(size: number): void {
    this.config.maxDiskSize = size;
    TimeNativeImageCacheModule.setMaxDiskSize(size);
  }

  /**
   * Set cache age limit
   */
  public setMaxCacheAge(age: number): void {
    this.config.maxDiskAge = age;
    TimeNativeImageCacheModule.setMaxCacheAge(age);
  }

  /**
   * Enable/disable memory cache
   */
  public setMemoryCacheEnabled(enabled: boolean): void {
    this.config.memoryCacheEnabled = enabled;
    TimeNativeImageCacheModule.setMemoryCacheEnabled(enabled);
  }

  /**
   * Enable/disable disk cache
   */
  public setDiskCacheEnabled(enabled: boolean): void {
    this.config.diskCacheEnabled = enabled;
    TimeNativeImageCacheModule.setDiskCacheEnabled(enabled);
  }

  /**
   * Set compression quality
   */
  public setCompressionQuality(quality: number): void {
    this.config.compressionQuality = Math.max(0, Math.min(1, quality));
    TimeNativeImageCacheModule.setCompressionQuality(this.config.compressionQuality);
  }

  /**
   * Enable/disable WebP support
   */
  public setWebPEnabled(enabled: boolean): void {
    this.config.enableWebP = enabled;
    TimeNativeImageCacheModule.setWebPEnabled(enabled);
  }

  /**
   * Set maximum concurrent downloads
   */
  public setMaxConcurrentDownloads(max: number): void {
    this.config.maxConcurrentDownloads = max;
    TimeNativeImageCacheModule.setMaxConcurrentDownloads(max);
  }

  /**
   * Set timeout for downloads
   */
  public setTimeout(timeout: number): void {
    this.config.timeout = timeout;
    TimeNativeImageCacheModule.setTimeout(timeout);
  }

  /**
   * Set retry count for failed downloads
   */
  public setRetryCount(count: number): void {
    this.config.retryCount = count;
    TimeNativeImageCacheModule.setRetryCount(count);
  }

  /**
   * Enable/disable prefetching
   */
  public setPrefetchingEnabled(enabled: boolean): void {
    this.config.enablePrefetching = enabled;
    TimeNativeImageCacheModule.setPrefetchingEnabled(enabled);
  }

  /**
   * Set prefetch batch size
   */
  public setPrefetchBatchSize(size: number): void {
    this.config.prefetchBatchSize = size;
    TimeNativeImageCacheModule.setPrefetchBatchSize(size);
  }

  /**
   * Enable/disable analytics
   */
  public setAnalyticsEnabled(enabled: boolean): void {
    this.config.enableAnalytics = enabled;
    TimeNativeImageCacheModule.setAnalyticsEnabled(enabled);
  }

  /**
   * Get cache hit rate
   */
  public async getCacheHitRate(): Promise<number> {
    const stats = await this.getCacheStats();
    return stats.hitRate;
  }

  /**
   * Get cache size in bytes
   */
  public async getCacheSize(): Promise<number> {
    const stats = await this.getCacheStats();
    return stats.memoryCacheSize + stats.diskCacheSize;
  }

  /**
   * Get memory cache size
   */
  public async getMemoryCacheSize(): Promise<number> {
    const stats = await this.getCacheStats();
    return stats.memoryCacheSize;
  }

  /**
   * Get disk cache size
   */
  public async getDiskCacheSize(): Promise<number> {
    const stats = await this.getCacheStats();
    return stats.diskCacheSize;
  }

  /**
   * Cancel all active loads
   */
  public cancelAllLoads(): void {
    TimeNativeImageCacheModule.cancelAllLoads();
    this.activeLoads.clear();
  }

  /**
   * Cancel specific load
   */
  public cancelLoad(uri: string): void {
    TimeNativeImageCacheModule.cancelLoad(uri);
    // Remove from active loads
    for (const [key, promise] of this.activeLoads.entries()) {
      if (key.startsWith(uri)) {
        this.activeLoads.delete(key);
      }
    }
  }

  /**
   * Get active loads count
   */
  public getActiveLoadsCount(): number {
    return this.activeLoads.size;
  }

  /**
   * Utility method to chunk array
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Preload images for a specific screen or component
   */
  public async preloadForScreen(screenName: string, imageUris: string[]): Promise<void> {
    const sources: ImageSource[] = imageUris.map(uri => ({
      uri,
      priority: 'normal',
      cachePolicy: 'memory-disk',
    }));

    return this.prefetchImages({
      sources,
      priority: 'normal',
      batchSize: 5,
    });
  }

  /**
   * Warm up cache with commonly used images
   */
  public async warmUpCache(imageUris: string[]): Promise<void> {
    const sources: ImageSource[] = imageUris.map(uri => ({
      uri,
      priority: 'low',
      cachePolicy: 'memory-disk',
    }));

    return this.prefetchImages({
      sources,
      priority: 'low',
      batchSize: 3,
    });
  }
}