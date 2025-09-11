import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { View, requireNativeComponent, NativeModules, NativeEventEmitter } from 'react-native';
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
  ImageLoadOptions
} from './types';

const { TimeNativeImageCacheModule } = NativeModules;
const TimeNativeImageCacheView = requireNativeComponent('TimeNativeImageCacheView');

const eventEmitter = new NativeEventEmitter(TimeNativeImageCacheModule);

export interface TimeNativeImageCacheProps {
  source: ImageSource;
  style?: any;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  config?: Partial<ImageCacheConfig>;
  onLoad?: (result: ImageLoadResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
  priority?: 'low' | 'normal' | 'high';
  timeout?: number;
  retryCount?: number;
  placeholder?: string;
  fallback?: string;
  blurRadius?: number;
  borderRadius?: number;
  tintColor?: string;
  transform?: ImageTransformOptions;
}

export interface TimeNativeImageCacheRef {
  // Loading control
  load: () => Promise<ImageLoadResult>;
  reload: () => Promise<ImageLoadResult>;
  cancel: () => void;
  
  // Cache management
  isCached: () => Promise<boolean>;
  removeFromCache: () => Promise<void>;
  clearCache: () => Promise<void>;
  
  // Processing
  process: (options: ImageTransformOptions) => Promise<ImageProcessingResult>;
  
  // State queries
  isLoading: () => boolean;
  hasError: () => boolean;
  getError: () => string | null;
  getResult: () => ImageLoadResult | null;
}

export const TimeNativeImageCache = forwardRef<TimeNativeImageCacheRef, TimeNativeImageCacheProps>(
  (props, ref) => {
    const {
      source,
      style,
      resizeMode = 'contain',
      config = {},
      onLoad,
      onError,
      onProgress,
      priority = 'normal',
      timeout,
      retryCount,
      placeholder,
      fallback,
      blurRadius,
      borderRadius,
      tintColor,
      transform,
      ...otherProps
    } = props;

    const nativeRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ImageLoadResult | null>(null);
    const [progress, setProgress] = useState(0);

    // Default configuration with performance optimizations
    const defaultConfig: ImageCacheConfig = {
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

    const finalConfig = { ...defaultConfig, ...config };

    // Event handlers
    useEffect(() => {
      const subscriptions = [
        eventEmitter.addListener('onLoadStart', (data) => {
          if (data.uri === source.uri) {
            setIsLoading(true);
            setHasError(false);
            setError(null);
            setProgress(0);
          }
        }),

        eventEmitter.addListener('onLoad', (data) => {
          if (data.uri === source.uri) {
            setIsLoading(false);
            setHasError(false);
            setError(null);
            setResult(data);
            onLoad?.(data);
          }
        }),

        eventEmitter.addListener('onError', (data) => {
          if (data.uri === source.uri) {
            setIsLoading(false);
            setHasError(true);
            setError(data.error);
            onError?.(data.error);
          }
        }),

        eventEmitter.addListener('onProgress', (data) => {
          if (data.uri === source.uri) {
            setProgress(data.progress);
            onProgress?.(data.progress);
          }
        }),

        eventEmitter.addListener('onCacheHit', (data) => {
          if (data.uri === source.uri) {
            // Handle cache hit
          }
        }),

        eventEmitter.addListener('onCacheMiss', (data) => {
          if (data.uri === source.uri) {
            // Handle cache miss
          }
        }),
      ];

      return () => {
        subscriptions.forEach(subscription => subscription.remove());
      };
    }, [source.uri, onLoad, onError, onProgress]);

    // Imperative API
    useImperativeHandle(ref, () => ({
      load: async () => {
        return TimeNativeImageCacheModule.loadImage({
          source,
          priority,
          timeout,
          retryCount,
          config: finalConfig,
        });
      },
      reload: async () => {
        // Clear cache for this image and reload
        await TimeNativeImageCacheModule.removeImageFromCache(source.uri);
        return TimeNativeImageCacheModule.loadImage({
          source,
          priority,
          timeout,
          retryCount,
          config: finalConfig,
        });
      },
      cancel: () => {
        TimeNativeImageCacheModule.cancelLoad(source.uri);
      },
      isCached: async () => {
        return TimeNativeImageCacheModule.isImageCached(source.uri);
      },
      removeFromCache: async () => {
        return TimeNativeImageCacheModule.removeImageFromCache(source.uri);
      },
      clearCache: async () => {
        return TimeNativeImageCacheModule.clearCache();
      },
      process: async (options: ImageTransformOptions) => {
        return TimeNativeImageCacheModule.processImage(source.uri, options);
      },
      isLoading: () => isLoading,
      hasError: () => hasError,
      getError: () => error,
      getResult: () => result,
    }));

    // Auto-load on mount
    useEffect(() => {
      if (source.uri) {
        TimeNativeImageCacheModule.loadImage({
          source,
          priority,
          timeout,
          retryCount,
          config: finalConfig,
        });
      }
    }, [source.uri]);

    return (
      <TimeNativeImageCacheView
        ref={nativeRef}
        style={style}
        source={source}
        config={finalConfig}
        resizeMode={resizeMode}
        priority={priority}
        timeout={timeout}
        retryCount={retryCount}
        placeholder={placeholder}
        fallback={fallback}
        blurRadius={blurRadius}
        borderRadius={borderRadius}
        tintColor={tintColor}
        transform={transform}
        {...otherProps}
      />
    );
  }
);

TimeNativeImageCache.displayName = 'TimeNativeImageCache';

export default TimeNativeImageCache;