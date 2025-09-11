import { NativeModules } from 'react-native';
import { VideoSource, CacheConfig, CacheStats } from './types';

const { TimeNativeVideoPlayerModule } = NativeModules;

export class VideoCacheManager {
  private static instance: VideoCacheManager;
  private config: CacheConfig;

  private constructor() {
    this.config = this.getDefaultConfig();
  }

  public static getInstance(): VideoCacheManager {
    if (!VideoCacheManager.instance) {
      VideoCacheManager.instance = new VideoCacheManager();
    }
    return VideoCacheManager.instance;
  }

  private getDefaultConfig(): CacheConfig {
    return {
      maxSize: 500 * 1024 * 1024, // 500 MB
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      enableDiskCache: true,
      enableMemoryCache: true,
      compressionEnabled: true,
    };
  }

  /**
   * Configure cache settings
   */
  public configure(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
    TimeNativeVideoPlayerModule.configureCache(this.config);
  }

  /**
   * Get current cache configuration
   */
  public getConfig(): CacheConfig {
    return { ...this.config };
  }

  /**
   * Preload video into cache
   */
  public async preloadVideo(source: VideoSource, priority: 'low' | 'normal' | 'high' = 'normal'): Promise<void> {
    return TimeNativeVideoPlayerModule.preloadVideo(source, priority);
  }

  /**
   * Preload multiple videos
   */
  public async preloadVideos(sources: VideoSource[], priority: 'low' | 'normal' | 'high' = 'normal'): Promise<void> {
    return TimeNativeVideoPlayerModule.preloadVideos(sources, priority);
  }

  /**
   * Check if video is cached
   */
  public async isVideoCached(source: VideoSource): Promise<boolean> {
    return TimeNativeVideoPlayerModule.isVideoCached(source);
  }

  /**
   * Get cached video info
   */
  public async getCachedVideoInfo(source: VideoSource): Promise<{
    size: number;
    lastAccessed: number;
    accessCount: number;
    quality: string;
  } | null> {
    return TimeNativeVideoPlayerModule.getCachedVideoInfo(source);
  }

  /**
   * Remove specific video from cache
   */
  public async removeVideoFromCache(source: VideoSource): Promise<void> {
    return TimeNativeVideoPlayerModule.removeVideoFromCache(source);
  }

  /**
   * Clear all cache
   */
  public async clearCache(): Promise<void> {
    return TimeNativeVideoPlayerModule.clearCache();
  }

  /**
   * Clear cache by age
   */
  public async clearCacheByAge(maxAge: number): Promise<void> {
    return TimeNativeVideoPlayerModule.clearCacheByAge(maxAge);
  }

  /**
   * Clear cache by size limit
   */
  public async clearCacheBySize(maxSize: number): Promise<void> {
    return TimeNativeVideoPlayerModule.clearCacheBySize(maxSize);
  }

  /**
   * Get cache statistics
   */
  public async getCacheStats(): Promise<CacheStats> {
    return TimeNativeVideoPlayerModule.getCacheStats();
  }

  /**
   * Get cache size in bytes
   */
  public async getCacheSize(): Promise<number> {
    return TimeNativeVideoPlayerModule.getCacheSize();
  }

  /**
   * Get cache directory path
   */
  public async getCacheDirectory(): Promise<string> {
    return TimeNativeVideoPlayerModule.getCacheDirectory();
  }

  /**
   * Set cache directory
   */
  public async setCacheDirectory(path: string): Promise<void> {
    return TimeNativeVideoPlayerModule.setCacheDirectory(path);
  }

  /**
   * Enable/disable compression
   */
  public setCompressionEnabled(enabled: boolean): void {
    this.config.compressionEnabled = enabled;
    TimeNativeVideoPlayerModule.setCompressionEnabled(enabled);
  }

  /**
   * Set cache size limit
   */
  public setMaxCacheSize(size: number): void {
    this.config.maxSize = size;
    TimeNativeVideoPlayerModule.setMaxCacheSize(size);
  }

  /**
   * Set cache age limit
   */
  public setMaxCacheAge(age: number): void {
    this.config.maxAge = age;
    TimeNativeVideoPlayerModule.setMaxCacheAge(age);
  }

  /**
   * Enable/disable disk cache
   */
  public setDiskCacheEnabled(enabled: boolean): void {
    this.config.enableDiskCache = enabled;
    TimeNativeVideoPlayerModule.setDiskCacheEnabled(enabled);
  }

  /**
   * Enable/disable memory cache
   */
  public setMemoryCacheEnabled(enabled: boolean): void {
    this.config.enableMemoryCache = enabled;
    TimeNativeVideoPlayerModule.setMemoryCacheEnabled(enabled);
  }

  /**
   * Get cache hit rate
   */
  public async getCacheHitRate(): Promise<number> {
    const stats = await this.getCacheStats();
    return stats.hitRate;
  }

  /**
   * Optimize cache based on usage patterns
   */
  public async optimizeCache(): Promise<void> {
    return TimeNativeVideoPlayerModule.optimizeCache();
  }

  /**
   * Get cache recommendations
   */
  public async getCacheRecommendations(): Promise<{
    recommendedMaxSize: number;
    recommendedMaxAge: number;
    shouldEnableCompression: boolean;
    shouldEnableDiskCache: boolean;
    shouldEnableMemoryCache: boolean;
  }> {
    return TimeNativeVideoPlayerModule.getCacheRecommendations();
  }

  /**
   * Export cache data for backup
   */
  public async exportCacheData(): Promise<{
    videos: Array<{
      source: VideoSource;
      size: number;
      lastAccessed: number;
      accessCount: number;
    }>;
    totalSize: number;
    exportDate: number;
  }> {
    return TimeNativeVideoPlayerModule.exportCacheData();
  }

  /**
   * Import cache data from backup
   */
  public async importCacheData(data: {
    videos: Array<{
      source: VideoSource;
      size: number;
      lastAccessed: number;
      accessCount: number;
    }>;
    totalSize: number;
    exportDate: number;
  }): Promise<void> {
    return TimeNativeVideoPlayerModule.importCacheData(data);
  }

  /**
   * Set cache eviction policy
   */
  public setEvictionPolicy(policy: 'lru' | 'lfu' | 'fifo' | 'ttl'): void {
    TimeNativeVideoPlayerModule.setEvictionPolicy(policy);
  }

  /**
   * Get cache health status
   */
  public async getCacheHealth(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  }> {
    return TimeNativeVideoPlayerModule.getCacheHealth();
  }
}