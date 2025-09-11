import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { View, requireNativeComponent, NativeModules, NativeEventEmitter } from 'react-native';
import {
  MediaSource,
  MediaLoadResult,
  MediaConfig,
  MediaViewProps,
  MediaViewRef,
  VideoPlayerStatus,
  VideoQuality
} from '../types';

const { TimeNativeMediaModule } = NativeModules;
const TimeNativeMediaView = requireNativeComponent('TimeNativeMediaView');

const eventEmitter = new NativeEventEmitter(TimeNativeMediaModule);

export const TimeMediaView = forwardRef<MediaViewRef, MediaViewProps>(
  (props, ref) => {
    const {
      source,
      style,
      config = {},
      onLoad,
      onError,
      onProgress,
      priority = 'normal',
      timeout,
      retryCount,
      placeholder,
      fallback,
      // Video specific
      paused = false,
      muted = false,
      volume = 1.0,
      playbackRate = 1.0,
      repeat = false,
      resizeMode = 'contain',
      // Image specific
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
    const [result, setResult] = useState<MediaLoadResult | null>(null);
    const [progress, setProgress] = useState(0);
    const [playbackState, setPlaybackState] = useState<VideoPlayerStatus | null>(null);

    // Default configuration with performance optimizations
    const defaultConfig: MediaConfig = {
      video: {
        preloadBufferSize: 30,
        maxBufferSize: 60,
        minBufferSize: 5,
        bufferForPlayback: 2.5,
        bufferForPlaybackAfterRebuffer: 5,
        maxInitialBitrate: 2000000,
        maxBitrate: 8000000,
        adaptiveBitrateEnabled: true,
        preferredVideoQuality: VideoQuality.AUTO,
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

        // Video specific events
        eventEmitter.addListener('onPlaybackStateChange', (data) => {
          if (data.uri === source.uri) {
            setPlaybackState(data.status);
          }
        }),

        eventEmitter.addListener('onPlaybackRateChange', (data) => {
          if (data.uri === source.uri) {
            // Handle playback rate change
          }
        }),

        eventEmitter.addListener('onVolumeChange', (data) => {
          if (data.uri === source.uri) {
            // Handle volume change
          }
        }),

        eventEmitter.addListener('onMuteChange', (data) => {
          if (data.uri === source.uri) {
            // Handle mute change
          }
        }),

        eventEmitter.addListener('onEnd', (data) => {
          if (data.uri === source.uri) {
            // Handle video end
          }
        }),

        eventEmitter.addListener('onFullscreenChange', (data) => {
          if (data.uri === source.uri) {
            // Handle fullscreen change
          }
        }),

        eventEmitter.addListener('onQualityChange', (data) => {
          if (data.uri === source.uri) {
            // Handle quality change
          }
        }),

        eventEmitter.addListener('onBitrateChange', (data) => {
          if (data.uri === source.uri) {
            // Handle bitrate change
          }
        }),

        eventEmitter.addListener('onBufferUpdate', (data) => {
          if (data.uri === source.uri) {
            // Handle buffer update
          }
        }),

        // Image specific events
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
        return TimeNativeMediaModule.loadMedia({
          source,
          priority,
          timeout,
          retryCount,
          config: finalConfig,
        });
      },
      reload: async () => {
        // Clear cache for this media and reload
        await TimeNativeMediaModule.removeMediaFromCache(source.uri);
        return TimeNativeMediaModule.loadMedia({
          source,
          priority,
          timeout,
          retryCount,
          config: finalConfig,
        });
      },
      cancel: () => {
        TimeNativeMediaModule.cancelLoad(source.uri);
      },
      isCached: async () => {
        return TimeNativeMediaModule.isMediaCached(source.uri);
      },
      removeFromCache: async () => {
        return TimeNativeMediaModule.removeMediaFromCache(source.uri);
      },
      clearCache: async () => {
        return TimeNativeMediaModule.clearCache();
      },
      isLoading: () => isLoading,
      hasError: () => hasError,
      getError: () => error,
      getResult: () => result,
      
      // Video specific methods
      ...(source.type === 'video' && {
        play: () => {
          TimeNativeMediaModule.play(source.uri);
        },
        pause: () => {
          TimeNativeMediaModule.pause(source.uri);
        },
        stop: () => {
          TimeNativeMediaModule.stop(source.uri);
        },
        seek: (time: number) => {
          TimeNativeMediaModule.seek(source.uri, time);
        },
        setPlaybackRate: (rate: number) => {
          TimeNativeMediaModule.setPlaybackRate(source.uri, rate);
        },
        setVolume: (volume: number) => {
          TimeNativeMediaModule.setVolume(source.uri, volume);
        },
        setMuted: (muted: boolean) => {
          TimeNativeMediaModule.setMuted(source.uri, muted);
        },
        enterFullscreen: () => {
          TimeNativeMediaModule.enterFullscreen(source.uri);
        },
        exitFullscreen: () => {
          TimeNativeMediaModule.exitFullscreen(source.uri);
        },
      }),
      
      // Image specific methods
      ...(source.type === 'image' && {
        process: async (options: any) => {
          return TimeNativeMediaModule.processImage(source.uri, options);
        },
      }),
    }));

    // Auto-load on mount
    useEffect(() => {
      if (source.uri) {
        TimeNativeMediaModule.loadMedia({
          source,
          priority,
          timeout,
          retryCount,
          config: finalConfig,
        });
      }
    }, [source.uri]);

    return (
      <TimeNativeMediaView
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
        // Video specific props
        paused={paused}
        muted={muted}
        volume={volume}
        playbackRate={playbackRate}
        repeat={repeat}
        // Image specific props
        blurRadius={blurRadius}
        borderRadius={borderRadius}
        tintColor={tintColor}
        transform={transform}
        {...otherProps}
      />
    );
  }
);

TimeMediaView.displayName = 'TimeMediaView';

export default TimeMediaView;