import { NativeModules, NativeEventEmitter } from 'react-native';
import {
  MediaSource,
  MediaLoadResult,
  MediaConfig,
  MediaAnalytics,
  MediaCacheStats,
  MediaCacheHealth,
  MediaPrefetchOptions,
  MediaBatchLoadOptions,
  MediaLoadOptions,
  MediaManager
} from '../types';

const { TimeNativeMediaModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(TimeNativeMediaModule);

export class TimeMediaManager implements MediaManager {
  private static instance: TimeMediaManager;
  private config: MediaConfig;
  private activeLoads: Map<string, Promise<MediaLoadResult>> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
  }

  public static getInstance(): TimeMediaManager {
    if (!TimeMediaManager.instance) {
      TimeMediaManager.instance = new TimeMediaManager();
    }
    return TimeMediaManager.instance;
  }

  private getDefaultConfig(): MediaConfig {
    return {
      video: {
        preloadBufferSize: 30,
        maxBufferSize: 60,
        minBufferSize: 5,
        bufferForPlayback: 2.5,
        bufferForPlaybackAfterRebuffer: 5,
        maxInitialBitrate: 2000000,
        maxBitrate: 8000000,
        adaptiveBitrateEnabled: true,
        preferredVideoQuality: 'auto',
        allowQualityChange: true,
        audioFocusGain: 'gain_transient_may_duck',
        allowBackgroundPlayback: false,
        hardwareAccelerationEnabled: true,
      },
      image: {
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
      },
      common: {
        timeout: 30000, // 30 seconds
        retryCount: 3,
        retryDelay: 1000, // 1 second
        maxConcurrentDownloads: 5,
        enablePrefetching: true,
        prefetchBatchSize: 10,
        enableBackgroundProcessing: true,
        enableLogging: __DEV__,
        enableAnalytics: true,
      },
    };
  }

  /**
   * Configure the media manager
   */
  public configure(config: Partial<MediaConfig>): void {
    this.config = { ...this.config, ...config };
    TimeNativeMediaModule.configure(this.config);
  }

  /**
   * Get current configuration
   */
  public getConfig(): MediaConfig {
    return { ...this.config };
  }

  /**
   * Load a single media item
   */
  public async loadMedia(options: MediaLoadOptions): Promise<MediaLoadResult> {
    const { source, priority = 'normal', timeout, retryCount } = options;
    
    // Check if already loading
    const loadKey = `${source.uri}_${source.type}_${priority}`;
    if (this.activeLoads.has(loadKey)) {
      return this.activeLoads.get(loadKey)!;
    }

    const loadPromise = TimeNativeMediaModule.loadMedia({
      source,
      priority,
      timeout: timeout || this.config.common?.timeout,
      retryCount: retryCount || this.config.common?.retryCount,
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
   * Load multiple media items in batch
   */
  public async loadMediaBatch(options: MediaBatchLoadOptions): Promise<MediaLoadResult[]> {
    const { sources, priority = 'normal', batchSize = 5, timeout, retryCount } = options;
    
    const results: MediaLoadResult[] = [];
    const batches = this.chunkArray(sources, batchSize);
    
    for (const batch of batches) {
      const batchPromises = batch.map(source => 
        this.loadMedia({
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
            type: 'image',
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
   * Prefetch media for better performance
   */
  public async prefetchMedia(options: MediaPrefetchOptions): Promise<void> {
    const { sources, priority = 'normal', batchSize = 10 } = options;
    
    return TimeNativeMediaModule.prefetchMedia({
      sources,
      priority,
      batchSize,
      config: this.config,
    });
  }

  /**
   * Check if media is cached
   */
  public async isMediaCached(uri: string): Promise<boolean> {
    return TimeNativeMediaModule.isMediaCached(uri);
  }

  /**
   * Get cached media information
   */
  public async getCachedMediaInfo(uri: string): Promise<any> {
    return TimeNativeMediaModule.getCachedMediaInfo(uri);
  }

  /**
   * Remove media from cache
   */
  public async removeMediaFromCache(uri: string): Promise<void> {
    return TimeNativeMediaModule.removeMediaFromCache(uri);
  }

  /**
   * Clear all cache
   */
  public async clearCache(): Promise<void> {
    return TimeNativeMediaModule.clearCache();
  }

  /**
   * Clear memory cache only
   */
  public async clearMemoryCache(): Promise<void> {
    return TimeNativeMediaModule.clearMemoryCache();
  }

  /**
   * Clear disk cache only
   */
  public async clearDiskCache(): Promise<void> {
    return TimeNativeMediaModule.clearDiskCache();
  }

  /**
   * Get cache statistics
   */
  public async getCacheStats(): Promise<MediaCacheStats> {
    return TimeNativeMediaModule.getCacheStats();
  }

  /**
   * Get analytics data
   */
  public async getAnalytics(): Promise<MediaAnalytics> {
    return TimeNativeMediaModule.getAnalytics();
  }

  /**
   * Get cache health status
   */
  public async getCacheHealth(): Promise<MediaCacheHealth> {
    return TimeNativeMediaModule.getCacheHealth();
  }

  /**
   * Optimize cache based on usage patterns
   */
  public async optimizeCache(): Promise<void> {
    return TimeNativeMediaModule.optimizeCache();
  }

  /**
   * Get cache recommendations
   */
  public async getCacheRecommendations(): Promise<any> {
    return TimeNativeMediaModule.getCacheRecommendations();
  }

  /**
   * Export cache data for backup
   */
  public async exportCacheData(): Promise<any> {
    return TimeNativeMediaModule.exportCacheData();
  }

  /**
   * Import cache data from backup
   */
  public async importCacheData(data: any): Promise<void> {
    return TimeNativeMediaModule.importCacheData(data);
  }

  /**
   * Set memory cache size limit
   */
  public setMaxMemorySize(size: number): void {
    if (this.config.image) {
      this.config.image.maxMemorySize = size;
    }
    TimeNativeMediaModule.setMaxMemorySize(size);
  }

  /**
   * Set disk cache size limit
   */
  public setMaxDiskSize(size: number): void {
    if (this.config.image) {
      this.config.image.maxDiskSize = size;
    }
    TimeNativeMediaModule.setMaxDiskSize(size);
  }

  /**
   * Set cache age limit
   */
  public setMaxCacheAge(age: number): void {
    if (this.config.image) {
      this.config.image.maxDiskAge = age;
    }
    TimeNativeMediaModule.setMaxCacheAge(age);
  }

  /**
   * Enable/disable memory cache
   */
  public setMemoryCacheEnabled(enabled: boolean): void {
    if (this.config.image) {
      this.config.image.memoryCacheEnabled = enabled;
    }
    TimeNativeMediaModule.setMemoryCacheEnabled(enabled);
  }

  /**
   * Enable/disable disk cache
   */
  public setDiskCacheEnabled(enabled: boolean): void {
    if (this.config.image) {
      this.config.image.diskCacheEnabled = enabled;
    }
    TimeNativeMediaModule.setDiskCacheEnabled(enabled);
  }

  /**
   * Set compression quality
   */
  public setCompressionQuality(quality: number): void {
    if (this.config.image) {
      this.config.image.compressionQuality = Math.max(0, Math.min(1, quality));
    }
    TimeNativeMediaModule.setCompressionQuality(quality);
  }

  /**
   * Enable/disable WebP support
   */
  public setWebPEnabled(enabled: boolean): void {
    if (this.config.image) {
      this.config.image.enableWebP = enabled;
    }
    TimeNativeMediaModule.setWebPEnabled(enabled);
  }

  /**
   * Set maximum concurrent downloads
   */
  public setMaxConcurrentDownloads(max: number): void {
    if (this.config.common) {
      this.config.common.maxConcurrentDownloads = max;
    }
    TimeNativeMediaModule.setMaxConcurrentDownloads(max);
  }

  /**
   * Set timeout for downloads
   */
  public setTimeout(timeout: number): void {
    if (this.config.common) {
      this.config.common.timeout = timeout;
    }
    TimeNativeMediaModule.setTimeout(timeout);
  }

  /**
   * Set retry count for failed downloads
   */
  public setRetryCount(count: number): void {
    if (this.config.common) {
      this.config.common.retryCount = count;
    }
    TimeNativeMediaModule.setRetryCount(count);
  }

  /**
   * Enable/disable prefetching
   */
  public setPrefetchingEnabled(enabled: boolean): void {
    if (this.config.common) {
      this.config.common.enablePrefetching = enabled;
    }
    TimeNativeMediaModule.setPrefetchingEnabled(enabled);
  }

  /**
   * Set prefetch batch size
   */
  public setPrefetchBatchSize(size: number): void {
    if (this.config.common) {
      this.config.common.prefetchBatchSize = size;
    }
    TimeNativeMediaModule.setPrefetchBatchSize(size);
  }

  /**
   * Enable/disable analytics
   */
  public setAnalyticsEnabled(enabled: boolean): void {
    if (this.config.common) {
      this.config.common.enableAnalytics = enabled;
    }
    TimeNativeMediaModule.setAnalyticsEnabled(enabled);
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
    TimeNativeMediaModule.cancelAllLoads();
    this.activeLoads.clear();
  }

  /**
   * Cancel specific load
   */
  public cancelLoad(uri: string): void {
    TimeNativeMediaModule.cancelLoad(uri);
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
   * Preload media for a specific screen or component
   */
  public async preloadForScreen(screenName: string, mediaUris: string[], type: 'video' | 'image' = 'image'): Promise<void> {
    const sources: MediaSource[] = mediaUris.map(uri => ({
      uri,
      type,
      priority: 'normal',
      cachePolicy: 'memory-disk',
    }));

    return this.prefetchMedia({
      sources,
      priority: 'normal',
      batchSize: 5,
    });
  }

  /**
   * Warm up cache with commonly used media
   */
  public async warmUpCache(mediaUris: string[], type: 'video' | 'image' = 'image'): Promise<void> {
    const sources: MediaSource[] = mediaUris.map(uri => ({
      uri,
      type,
      priority: 'low',
      cachePolicy: 'memory-disk',
    }));

    return this.prefetchMedia({
      sources,
      priority: 'low',
      batchSize: 3,
    });
  }

  /**
   * Get performance metrics
   */
  public async getPerformanceMetrics(): Promise<{
    averageLoadTime: number;
    averageBufferTime: number;
    totalDataTransferred: number;
    cacheEfficiency: number;
    errorRate: number;
  }> {
    return TimeNativeMediaModule.getPerformanceMetrics();
  }

  /**
   * Get system capabilities
   */
  public async getSystemCapabilities(): Promise<{
    maxResolution: { width: number; height: number };
    supportedFormats: string[];
    hardwareAccelerationSupported: boolean;
    maxBitrate: number;
  }> {
    return TimeNativeMediaModule.getSystemCapabilities();
  }

  /**
   * Get device optimizations
   */
  public async getDeviceOptimizations(): Promise<{
    recommendedBufferSize: number;
    recommendedBitrate: number;
    recommendedQuality: string;
    hardwareAccelerationRecommended: boolean;
  }> {
    return TimeNativeMediaModule.getDeviceOptimizations();
  }
}