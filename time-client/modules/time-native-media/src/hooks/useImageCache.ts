import { useRef, useCallback, useEffect, useState } from 'react';
import { TimeNativeImageCache, TimeNativeImageCacheRef } from '../image/TimeNativeImageCache';
import { ImageSource, ImageCacheConfig, ImageLoadResult, ImageTransformOptions } from '../types';

export interface UseImageCacheOptions {
  source: ImageSource;
  config?: Partial<ImageCacheConfig>;
  autoLoad?: boolean;
  onLoad?: (result: ImageLoadResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export interface UseImageCacheReturn {
  // Image ref
  imageRef: React.RefObject<TimeNativeImageCacheRef>;
  
  // Image state
  isLoading: boolean;
  hasError: boolean;
  error: string | null;
  result: ImageLoadResult | null;
  progress: number;
  
  // Image controls
  load: () => Promise<ImageLoadResult>;
  reload: () => Promise<ImageLoadResult>;
  cancel: () => void;
  
  // Cache management
  isCached: () => Promise<boolean>;
  removeFromCache: () => Promise<void>;
  clearCache: () => Promise<void>;
  
  // Processing
  process: (options: ImageTransformOptions) => Promise<any>;
}

export function useImageCache(options: UseImageCacheOptions): UseImageCacheReturn {
  const {
    source,
    config,
    autoLoad = true,
    onLoad,
    onError,
    onProgress,
  } = options;

  const imageRef = useRef<TimeNativeImageCacheRef>(null);
  
  // Image state
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImageLoadResult | null>(null);
  const [progress, setProgress] = useState(0);

  // Event handlers
  const handleLoad = useCallback((loadResult: ImageLoadResult) => {
    setResult(loadResult);
    setIsLoading(false);
    setHasError(false);
    setError(null);
    onLoad?.(loadResult);
  }, [onLoad]);

  const handleError = useCallback((errorMessage: string) => {
    setHasError(true);
    setError(errorMessage);
    setIsLoading(false);
    onError?.(errorMessage);
  }, [onError]);

  const handleProgress = useCallback((progressValue: number) => {
    setProgress(progressValue);
    onProgress?.(progressValue);
  }, [onProgress]);

  // Image controls
  const load = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    setError(null);
    setProgress(0);
    
    try {
      const loadResult = await imageRef.current?.load();
      if (loadResult) {
        handleLoad(loadResult);
      }
      return loadResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      handleError(errorMessage);
      throw err;
    }
  }, [handleLoad, handleError]);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    setError(null);
    setProgress(0);
    
    try {
      const loadResult = await imageRef.current?.reload();
      if (loadResult) {
        handleLoad(loadResult);
      }
      return loadResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      handleError(errorMessage);
      throw err;
    }
  }, [handleLoad, handleError]);

  const cancel = useCallback(() => {
    imageRef.current?.cancel();
    setIsLoading(false);
  }, []);

  const isCached = useCallback(async () => {
    return imageRef.current?.isCached() || false;
  }, []);

  const removeFromCache = useCallback(async () => {
    return imageRef.current?.removeFromCache();
  }, []);

  const clearCache = useCallback(async () => {
    return imageRef.current?.clearCache();
  }, []);

  const process = useCallback(async (options: ImageTransformOptions) => {
    return imageRef.current?.process(options);
  }, []);

  // Auto-load effect
  useEffect(() => {
    if (autoLoad && source.uri && imageRef.current) {
      load();
    }
  }, [autoLoad, source.uri, load]);

  return {
    imageRef,
    isLoading,
    hasError,
    error,
    result,
    progress,
    load,
    reload,
    cancel,
    isCached,
    removeFromCache,
    clearCache,
    process,
  };
}