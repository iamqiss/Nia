import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { View, requireNativeComponent, NativeModules, NativeEventEmitter } from 'react-native';
import {
  VideoPlayerProps,
  VideoPlayerRef,
  VideoPlayerState,
  VideoPlayerStatus,
  VideoPlayerConfig,
  VideoSource,
  VideoQuality,
  VideoAnalytics
} from './types';

const { TimeNativeVideoPlayerModule } = NativeModules;
const TimeNativeVideoPlayerView = requireNativeComponent('TimeNativeVideoPlayerView');

const eventEmitter = new NativeEventEmitter(TimeNativeVideoPlayerModule);

export const TimeNativeVideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (props, ref) => {
    const {
      source,
      config = {},
      style,
      resizeMode = 'contain',
      paused = false,
      muted = false,
      volume = 1.0,
      playbackRate = 1.0,
      repeat = false,
      onLoadStart,
      onLoad,
      onProgress,
      onPlaybackStateChange,
      onPlaybackRateChange,
      onVolumeChange,
      onMuteChange,
      onError,
      onEnd,
      onFullscreenChange,
      onQualityChange,
      onBitrateChange,
      onBufferUpdate,
      ...otherProps
    } = props;

    const nativeRef = useRef<any>(null);
    const [playerState, setPlayerState] = useState<VideoPlayerState>({
      status: VideoPlayerStatus.IDLE,
      currentTime: 0,
      duration: 0,
      bufferedTime: 0,
      playbackRate: 1.0,
      volume: 1.0,
      isMuted: false,
      isLoading: false,
      hasError: false,
      isFullscreen: false,
    });

    // Default configuration with performance optimizations
    const defaultConfig: VideoPlayerConfig = {
      preloadBufferSize: 30,
      maxBufferSize: 60,
      minBufferSize: 5,
      bufferForPlayback: 2.5,
      bufferForPlaybackAfterRebuffer: 5,
      maxInitialBitrate: 2000000, // 2 Mbps
      maxBitrate: 8000000, // 8 Mbps
      adaptiveBitrateEnabled: true,
      enableDiskCache: true,
      maxCacheSize: 500 * 1024 * 1024, // 500 MB
      preferredVideoQuality: VideoQuality.AUTO,
      allowQualityChange: true,
      audioFocusGain: 'gain_transient_may_duck',
      allowBackgroundPlayback: false,
      hardwareAccelerationEnabled: true,
      enableLogging: __DEV__,
      enableAnalytics: true,
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Event handlers
    useEffect(() => {
      const subscriptions = [
        eventEmitter.addListener('onLoadStart', () => {
          setPlayerState(prev => ({ ...prev, isLoading: true }));
          onLoadStart?.();
        }),

        eventEmitter.addListener('onLoad', (data) => {
          setPlayerState(prev => ({
            ...prev,
            isLoading: false,
            duration: data.duration,
            naturalSize: data.naturalSize,
            aspectRatio: data.naturalSize?.width / data.naturalSize?.height,
          }));
          onLoad?.(data);
        }),

        eventEmitter.addListener('onProgress', (data) => {
          setPlayerState(prev => ({
            ...prev,
            currentTime: data.currentTime,
            bufferedTime: data.bufferedTime,
          }));
          onProgress?.(data);
        }),

        eventEmitter.addListener('onPlaybackStateChange', (status) => {
          setPlayerState(prev => ({ ...prev, status }));
          onPlaybackStateChange?.(status);
        }),

        eventEmitter.addListener('onPlaybackRateChange', (rate) => {
          setPlayerState(prev => ({ ...prev, playbackRate: rate }));
          onPlaybackRateChange?.(rate);
        }),

        eventEmitter.addListener('onVolumeChange', (volume) => {
          setPlayerState(prev => ({ ...prev, volume }));
          onVolumeChange?.(volume);
        }),

        eventEmitter.addListener('onMuteChange', (isMuted) => {
          setPlayerState(prev => ({ ...prev, isMuted }));
          onMuteChange?.(isMuted);
        }),

        eventEmitter.addListener('onError', (error) => {
          setPlayerState(prev => ({
            ...prev,
            hasError: true,
            error,
            isLoading: false,
          }));
          onError?.(error);
        }),

        eventEmitter.addListener('onEnd', () => {
          setPlayerState(prev => ({ ...prev, status: VideoPlayerStatus.ENDED }));
          onEnd?.();
        }),

        eventEmitter.addListener('onFullscreenChange', (isFullscreen) => {
          setPlayerState(prev => ({ ...prev, isFullscreen }));
          onFullscreenChange?.(isFullscreen);
        }),

        eventEmitter.addListener('onQualityChange', (quality) => {
          setPlayerState(prev => ({ ...prev, currentQuality: quality }));
          onQualityChange?.(quality);
        }),

        eventEmitter.addListener('onBitrateChange', (bitrate) => {
          setPlayerState(prev => ({ ...prev, currentBitrate: bitrate }));
          onBitrateChange?.(bitrate);
        }),

        eventEmitter.addListener('onBufferUpdate', (data) => {
          setPlayerState(prev => ({ ...prev, bufferedTime: data.bufferedTime }));
          onBufferUpdate?.(data);
        }),
      ];

      return () => {
        subscriptions.forEach(subscription => subscription.remove());
      };
    }, [
      onLoadStart,
      onLoad,
      onProgress,
      onPlaybackStateChange,
      onPlaybackRateChange,
      onVolumeChange,
      onMuteChange,
      onError,
      onEnd,
      onFullscreenChange,
      onQualityChange,
      onBitrateChange,
      onBufferUpdate,
    ]);

    // Imperative API
    useImperativeHandle(ref, () => ({
      play: () => {
        TimeNativeVideoPlayerModule.play();
      },
      pause: () => {
        TimeNativeVideoPlayerModule.pause();
      },
      stop: () => {
        TimeNativeVideoPlayerModule.stop();
      },
      seek: (time: number) => {
        TimeNativeVideoPlayerModule.seek(time);
      },
      setPlaybackRate: (rate: number) => {
        TimeNativeVideoPlayerModule.setPlaybackRate(rate);
      },
      setVolume: (volume: number) => {
        TimeNativeVideoPlayerModule.setVolume(volume);
      },
      setMuted: (muted: boolean) => {
        TimeNativeVideoPlayerModule.setMuted(muted);
      },
      setQuality: (quality: VideoQuality) => {
        TimeNativeVideoPlayerModule.setQuality(quality);
      },
      getAvailableQualities: () => {
        return TimeNativeVideoPlayerModule.getAvailableQualities();
      },
      getCurrentQuality: () => {
        return TimeNativeVideoPlayerModule.getCurrentQuality();
      },
      enterFullscreen: () => {
        TimeNativeVideoPlayerModule.enterFullscreen();
      },
      exitFullscreen: () => {
        TimeNativeVideoPlayerModule.exitFullscreen();
      },
      getCurrentTime: () => {
        return playerState.currentTime;
      },
      getDuration: () => {
        return playerState.duration;
      },
      getBufferedTime: () => {
        return playerState.bufferedTime;
      },
      getPlaybackState: () => {
        return playerState.status;
      },
      getVolume: () => {
        return playerState.volume;
      },
      isMuted: () => {
        return playerState.isMuted;
      },
      isFullscreen: () => {
        return playerState.isFullscreen;
      },
      clearCache: () => {
        return TimeNativeVideoPlayerModule.clearCache();
      },
      getCacheSize: () => {
        return TimeNativeVideoPlayerModule.getCacheSize();
      },
      preloadVideo: (source: VideoSource) => {
        return TimeNativeVideoPlayerModule.preloadVideo(source);
      },
      getAnalytics: (): VideoAnalytics => {
        return TimeNativeVideoPlayerModule.getAnalytics();
      },
    }));

    return (
      <TimeNativeVideoPlayerView
        ref={nativeRef}
        style={style}
        source={source}
        config={finalConfig}
        resizeMode={resizeMode}
        paused={paused}
        muted={muted}
        volume={volume}
        playbackRate={playbackRate}
        repeat={repeat}
        {...otherProps}
      />
    );
  }
);

TimeNativeVideoPlayer.displayName = 'TimeNativeVideoPlayer';

export default TimeNativeVideoPlayer;