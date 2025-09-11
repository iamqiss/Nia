//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

/**
 * Cache entry with metadata
 */
export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  compressed?: boolean;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  ttlSeconds: number;
  maxSize: number;
  enableCompression: boolean;
  enablePersistence: boolean;
  maxMemoryUsageMB: number;
  cleanupIntervalMs: number;
  compressionThreshold: number;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  compressions: number;
  totalSize: number;
  entryCount: number;
  hitRate: number;
  memoryUsage: number;
}

/**
 * Cache key generator function
 */
export type CacheKeyGenerator<T> = (args: T) => string;

/**
 * Intelligent cache with LRU eviction, compression, and persistence
 */
export class IntelligentCache<TKey, TValue> {
  private cache = new Map<string, CacheEntry<TValue>>();
  private accessOrder: string[] = [];
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    compressions: 0,
    totalSize: 0,
    entryCount: 0,
    hitRate: 0,
    memoryUsage: 0,
  };
  private config: CacheConfig;
  private cleanupInterval?: NodeJS.Timeout;
  private keyGenerator: CacheKeyGenerator<TKey>;

  constructor(
    keyGenerator: CacheKeyGenerator<TKey>,
    config: Partial<CacheConfig> = {}
  ) {
    this.keyGenerator = keyGenerator;
    this.config = {
      ttlSeconds: 300,
      maxSize: 1000,
      enableCompression: true,
      enablePersistence: false,
      maxMemoryUsageMB: 100,
      cleanupIntervalMs: 60000,
      compressionThreshold: 1024,
      ...config,
    };

    this.startCleanupInterval();
    this.loadFromPersistence();
  }

  /**
   * Get value from cache
   */
  get(key: TKey): TValue | undefined {
    const cacheKey = this.keyGenerator(key);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return undefined;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.delete(cacheKey);
      this.stats.misses++;
      this.updateHitRate();
      return undefined;
    }

    // Update access tracking
    this.updateAccess(cacheKey, entry);
    this.stats.hits++;
    this.updateHitRate();

    // Decompress if needed
    if (entry.compressed) {
      return this.decompress(entry.value);
    }

    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(key: TKey, value: TValue, ttl?: number): void {
    const cacheKey = this.keyGenerator(key);
    const now = Date.now();
    const entryTtl = ttl || this.config.ttlSeconds * 1000;

    // Calculate size
    const serialized = JSON.stringify(value);
    const size = new Blob([serialized]).size;

    // Check if we need to compress
    const shouldCompress = this.config.enableCompression && 
      size > this.config.compressionThreshold;

    let processedValue = value;
    if (shouldCompress) {
      processedValue = this.compress(value);
      this.stats.compressions++;
    }

    const entry: CacheEntry<TValue> = {
      value: processedValue,
      timestamp: now,
      ttl: entryTtl,
      accessCount: 0,
      lastAccessed: now,
      size: shouldCompress ? new Blob([JSON.stringify(processedValue)]).size : size,
      compressed: shouldCompress,
    };

    // Remove existing entry if it exists
    if (this.cache.has(cacheKey)) {
      this.delete(cacheKey);
    }

    // Check memory limits
    this.enforceMemoryLimits();

    // Add new entry
    this.cache.set(cacheKey, entry);
    this.accessOrder.push(cacheKey);
    this.stats.entryCount++;
    this.stats.totalSize += entry.size;

    // Persist if enabled
    if (this.config.enablePersistence) {
      this.persist();
    }
  }

  /**
   * Delete value from cache
   */
  delete(key: TKey): boolean {
    const cacheKey = this.keyGenerator(key);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      return false;
    }

    this.cache.delete(cacheKey);
    this.removeFromAccessOrder(cacheKey);
    this.stats.entryCount--;
    this.stats.totalSize -= entry.size;

    return true;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      compressions: 0,
      totalSize: 0,
      entryCount: 0,
      hitRate: 0,
      memoryUsage: 0,
    };
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    this.stats.memoryUsage = this.calculateMemoryUsage();
    return { ...this.stats };
  }

  /**
   * Check if key exists in cache
   */
  has(key: TKey): boolean {
    const cacheKey = this.keyGenerator(key);
    const entry = this.cache.get(cacheKey);
    return entry !== undefined && !this.isExpired(entry);
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry<TValue>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Update access tracking for LRU
   */
  private updateAccess(cacheKey: string, entry: CacheEntry<TValue>): void {
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.removeFromAccessOrder(cacheKey);
    this.accessOrder.push(cacheKey);
  }

  /**
   * Remove key from access order
   */
  private removeFromAccessOrder(cacheKey: string): void {
    const index = this.accessOrder.indexOf(cacheKey);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  /**
   * Enforce memory limits
   */
  private enforceMemoryLimits(): void {
    // Check size limit
    while (this.cache.size > this.config.maxSize) {
      this.evictLRU();
    }

    // Check memory limit
    while (this.calculateMemoryUsage() > this.config.maxMemoryUsageMB * 1024 * 1024) {
      this.evictLRU();
    }
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    if (this.accessOrder.length === 0) {
      return;
    }

    const lruKey = this.accessOrder[0];
    const entry = this.cache.get(lruKey);

    if (entry) {
      this.cache.delete(lruKey);
      this.removeFromAccessOrder(lruKey);
      this.stats.evictions++;
      this.stats.entryCount--;
      this.stats.totalSize -= entry.size;
    }
  }

  /**
   * Calculate current memory usage
   */
  private calculateMemoryUsage(): number {
    let totalSize = 0;
    this.cache.forEach(entry => {
      totalSize += entry.size;
    });
    return totalSize;
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  /**
   * Compress value
   */
  private compress(value: TValue): TValue {
    // Simple compression simulation - in real implementation, use actual compression
    const serialized = JSON.stringify(value);
    const compressed = btoa(serialized); // Base64 encoding as simple compression
    return compressed as unknown as TValue;
  }

  /**
   * Decompress value
   */
  private decompress(value: TValue): TValue {
    try {
      const decompressed = atob(value as unknown as string);
      return JSON.parse(decompressed);
    } catch (error) {
      console.warn('Failed to decompress cache value:', error);
      return value;
    }
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupIntervalMs);
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      this.stats.entryCount--;
    });
  }

  /**
   * Persist cache to storage
   */
  private persist(): void {
    if (!this.config.enablePersistence) {
      return;
    }

    try {
      const data = {
        entries: Array.from(this.cache.entries()),
        stats: this.stats,
        timestamp: Date.now(),
      };
      localStorage.setItem('grpc_cache', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to persist cache:', error);
    }
  }

  /**
   * Load cache from storage
   */
  private loadFromPersistence(): void {
    if (!this.config.enablePersistence) {
      return;
    }

    try {
      const stored = localStorage.getItem('grpc_cache');
      if (stored) {
        const data = JSON.parse(stored);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (Date.now() - data.timestamp < maxAge) {
          this.cache = new Map(data.entries);
          this.stats = data.stats;
          this.accessOrder = Array.from(this.cache.keys());
        }
      }
    } catch (error) {
      console.warn('Failed to load cache from persistence:', error);
    }
  }

  /**
   * Destroy cache and cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

/**
 * Cache manager for multiple caches
 */
export class CacheManager {
  private static instance: CacheManager;
  private caches = new Map<string, IntelligentCache<any, any>>();

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Get or create a cache
   */
  getCache<TKey, TValue>(
    name: string,
    keyGenerator: CacheKeyGenerator<TKey>,
    config?: Partial<CacheConfig>
  ): IntelligentCache<TKey, TValue> {
    if (!this.caches.has(name)) {
      this.caches.set(name, new IntelligentCache(keyGenerator, config));
    }
    return this.caches.get(name)!;
  }

  /**
   * Get all cache statistics
   */
  getAllStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    this.caches.forEach((cache, name) => {
      stats[name] = cache.getStats();
    });
    return stats;
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.caches.forEach(cache => cache.clear());
  }

  /**
   * Destroy all caches
   */
  destroyAll(): void {
    this.caches.forEach(cache => cache.destroy());
    this.caches.clear();
  }
}

export default IntelligentCache;