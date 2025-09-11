import { useCallback, useEffect, useState } from 'react';
import { TimeMediaManager } from '../media/TimeMediaManager';
import { MediaConfig, MediaAnalytics, MediaCacheStats, MediaCacheHealth } from '../types';

export interface UseMediaManagerOptions {
  config?: Partial<MediaConfig>;
  autoOptimize?: boolean;
  optimizationInterval?: number; // in milliseconds
}

export interface UseMediaManagerReturn {
  // Manager instance
  manager: TimeMediaManager;
  
  // Configuration
  config: MediaConfig;
  configure: (config: Partial<MediaConfig>) => void;
  
  // Cache management
  clearCache: () => Promise<void>;
  clearMemoryCache: () => Promise<void>;
  clearDiskCache: () => Promise<void>;
  optimizeCache: () => Promise<void>;
  
  // Statistics
  cacheStats: MediaCacheStats | null;
  analytics: MediaAnalytics | null;
  cacheHealth: MediaCacheHealth | null;
  
  // Cache settings
  setMaxMemorySize: (size: number) => void;
  setMaxDiskSize: (size: number) => void;
  setMaxCacheAge: (age: number) => void;
  setMemoryCacheEnabled: (enabled: boolean) => void;
  setDiskCacheEnabled: (enabled: boolean) => void;
  setCompressionQuality: (quality: number) => void;
  setWebPEnabled: (enabled: boolean) => void;
  setMaxConcurrentDownloads: (max: number) => void;
  setTimeout: (timeout: number) => void;
  setRetryCount: (count: number) => void;
  setPrefetchingEnabled: (enabled: boolean) => void;
  setPrefetchBatchSize: (size: number) => void;
  setAnalyticsEnabled: (enabled: boolean) => void;
  
  // Utility methods
  getCacheSize: () => Promise<number>;
  getMemoryCacheSize: () => Promise<number>;
  getDiskCacheSize: () => Promise<number>;
  getCacheHitRate: () => Promise<number>;
  getActiveLoadsCount: () => number;
  cancelAllLoads: () => void;
  
  // Preloading
  preloadForScreen: (screenName: string, mediaUris: string[], type?: 'video' | 'image') => Promise<void>;
  warmUpCache: (mediaUris: string[], type?: 'video' | 'image') => Promise<void>;
  
  // Performance
  getPerformanceMetrics: () => Promise<any>;
  getSystemCapabilities: () => Promise<any>;
  getDeviceOptimizations: () => Promise<any>;
  
  // Export/Import
  exportCacheData: () => Promise<any>;
  importCacheData: (data: any) => Promise<void>;
  
  // Refresh methods
  refreshStats: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  refreshHealth: () => Promise<void>;
}

export function useMediaManager(options: UseMediaManagerOptions = {}): UseMediaManagerReturn {
  const {
    config: initialConfig,
    autoOptimize = false,
    optimizationInterval = 5 * 60 * 1000, // 5 minutes
  } = options;

  const manager = TimeMediaManager.getInstance();
  
  // State
  const [config, setConfig] = useState<MediaConfig>(manager.getConfig());
  const [cacheStats, setCacheStats] = useState<MediaCacheStats | null>(null);
  const [analytics, setAnalytics] = useState<MediaAnalytics | null>(null);
  const [cacheHealth, setCacheHealth] = useState<MediaCacheHealth | null>(null);

  // Configuration
  const configure = useCallback((newConfig: Partial<MediaConfig>) => {
    manager.configure(newConfig);
    setConfig(manager.getConfig());
  }, [manager]);

  // Cache management
  const clearCache = useCallback(async () => {
    await manager.clearCache();
    await refreshStats();
  }, [manager]);

  const clearMemoryCache = useCallback(async () => {
    await manager.clearMemoryCache();
    await refreshStats();
  }, [manager]);

  const clearDiskCache = useCallback(async () => {
    await manager.clearDiskCache();
    await refreshStats();
  }, [manager]);

  const optimizeCache = useCallback(async () => {
    await manager.optimizeCache();
    await refreshStats();
    await refreshHealth();
  }, [manager]);

  // Statistics
  const refreshStats = useCallback(async () => {
    try {
      const stats = await manager.getCacheStats();
      setCacheStats(stats);
    } catch (error) {
      console.warn('Failed to refresh cache stats:', error);
    }
  }, [manager]);

  const refreshAnalytics = useCallback(async () => {
    try {
      const analyticsData = await manager.getAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.warn('Failed to refresh analytics:', error);
    }
  }, [manager]);

  const refreshHealth = useCallback(async () => {
    try {
      const health = await manager.getCacheHealth();
      setCacheHealth(health);
    } catch (error) {
      console.warn('Failed to refresh cache health:', error);
    }
  }, [manager]);

  // Cache settings
  const setMaxMemorySize = useCallback((size: number) => {
    manager.setMaxMemorySize(size);
    setConfig(manager.getConfig());
  }, [manager]);

  const setMaxDiskSize = useCallback((size: number) => {
    manager.setMaxDiskSize(size);
    setConfig(manager.getConfig());
  }, [manager]);

  const setMaxCacheAge = useCallback((age: number) => {
    manager.setMaxCacheAge(age);
    setConfig(manager.getConfig());
  }, [manager]);

  const setMemoryCacheEnabled = useCallback((enabled: boolean) => {
    manager.setMemoryCacheEnabled(enabled);
    setConfig(manager.getConfig());
  }, [manager]);

  const setDiskCacheEnabled = useCallback((enabled: boolean) => {
    manager.setDiskCacheEnabled(enabled);
    setConfig(manager.getConfig());
  }, [manager]);

  const setCompressionQuality = useCallback((quality: number) => {
    manager.setCompressionQuality(quality);
    setConfig(manager.getConfig());
  }, [manager]);

  const setWebPEnabled = useCallback((enabled: boolean) => {
    manager.setWebPEnabled(enabled);
    setConfig(manager.getConfig());
  }, [manager]);

  const setMaxConcurrentDownloads = useCallback((max: number) => {
    manager.setMaxConcurrentDownloads(max);
    setConfig(manager.getConfig());
  }, [manager]);

  const setTimeout = useCallback((timeout: number) => {
    manager.setTimeout(timeout);
    setConfig(manager.getConfig());
  }, [manager]);

  const setRetryCount = useCallback((count: number) => {
    manager.setRetryCount(count);
    setConfig(manager.getConfig());
  }, [manager]);

  const setPrefetchingEnabled = useCallback((enabled: boolean) => {
    manager.setPrefetchingEnabled(enabled);
    setConfig(manager.getConfig());
  }, [manager]);

  const setPrefetchBatchSize = useCallback((size: number) => {
    manager.setPrefetchBatchSize(size);
    setConfig(manager.getConfig());
  }, [manager]);

  const setAnalyticsEnabled = useCallback((enabled: boolean) => {
    manager.setAnalyticsEnabled(enabled);
    setConfig(manager.getConfig());
  }, [manager]);

  // Utility methods
  const getCacheSize = useCallback(async () => {
    return manager.getCacheSize();
  }, [manager]);

  const getMemoryCacheSize = useCallback(async () => {
    return manager.getMemoryCacheSize();
  }, [manager]);

  const getDiskCacheSize = useCallback(async () => {
    return manager.getDiskCacheSize();
  }, [manager]);

  const getCacheHitRate = useCallback(async () => {
    return manager.getCacheHitRate();
  }, [manager]);

  const getActiveLoadsCount = useCallback(() => {
    return manager.getActiveLoadsCount();
  }, [manager]);

  const cancelAllLoads = useCallback(() => {
    manager.cancelAllLoads();
  }, [manager]);

  // Preloading
  const preloadForScreen = useCallback(async (screenName: string, mediaUris: string[], type: 'video' | 'image' = 'image') => {
    return manager.preloadForScreen(screenName, mediaUris, type);
  }, [manager]);

  const warmUpCache = useCallback(async (mediaUris: string[], type: 'video' | 'image' = 'image') => {
    return manager.warmUpCache(mediaUris, type);
  }, [manager]);

  // Performance
  const getPerformanceMetrics = useCallback(async () => {
    return manager.getPerformanceMetrics();
  }, [manager]);

  const getSystemCapabilities = useCallback(async () => {
    return manager.getSystemCapabilities();
  }, [manager]);

  const getDeviceOptimizations = useCallback(async () => {
    return manager.getDeviceOptimizations();
  }, [manager]);

  // Export/Import
  const exportCacheData = useCallback(async () => {
    return manager.exportCacheData();
  }, [manager]);

  const importCacheData = useCallback(async (data: any) => {
    return manager.importCacheData(data);
  }, [manager]);

  // Initialize configuration
  useEffect(() => {
    if (initialConfig) {
      configure(initialConfig);
    }
  }, [initialConfig, configure]);

  // Initial data load
  useEffect(() => {
    refreshStats();
    refreshAnalytics();
    refreshHealth();
  }, [refreshStats, refreshAnalytics, refreshHealth]);

  // Auto-optimization
  useEffect(() => {
    if (!autoOptimize) return;

    const interval = setInterval(() => {
      optimizeCache();
    }, optimizationInterval);

    return () => clearInterval(interval);
  }, [autoOptimize, optimizationInterval, optimizeCache]);

  return {
    manager,
    config,
    configure,
    clearCache,
    clearMemoryCache,
    clearDiskCache,
    optimizeCache,
    cacheStats,
    analytics,
    cacheHealth,
    setMaxMemorySize,
    setMaxDiskSize,
    setMaxCacheAge,
    setMemoryCacheEnabled,
    setDiskCacheEnabled,
    setCompressionQuality,
    setWebPEnabled,
    setMaxConcurrentDownloads,
    setTimeout,
    setRetryCount,
    setPrefetchingEnabled,
    setPrefetchBatchSize,
    setAnalyticsEnabled,
    getCacheSize,
    getMemoryCacheSize,
    getDiskCacheSize,
    getCacheHitRate,
    getActiveLoadsCount,
    cancelAllLoads,
    preloadForScreen,
    warmUpCache,
    getPerformanceMetrics,
    getSystemCapabilities,
    getDeviceOptimizations,
    exportCacheData,
    importCacheData,
    refreshStats,
    refreshAnalytics,
    refreshHealth,
  };
}