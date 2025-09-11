import { useRef, useCallback, useEffect, useState } from 'react';
import { TimeNativeVideoPlayer, VideoPlayerRef } from '../video/TimeNativeVideoPlayer';
import { VideoSource, VideoPlayerConfig, VideoPlayerStatus } from '../types';

export interface UseVideoPlayerOptions {
  source: VideoSource;
  config?: Partial<VideoPlayerConfig>;
  autoPlay?: boolean;
  onLoad?: (data: any) => void;
  onError?: (error: string) => void;
  onPlaybackStateChange?: (status: VideoPlayerStatus) => void;
  onProgress?: (data: any) => void;
  onEnd?: () => void;
}

export interface UseVideoPlayerReturn {
  // Player ref
  playerRef: React.RefObject<VideoPlayerRef>;
  
  // Player state
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  hasError: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  bufferedTime: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  
  // Player controls
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  
  // Quality control
  setQuality: (quality: string) => void;
  getAvailableQualities: () => string[];
  getCurrentQuality: () => string;
  
  // Cache management
  isCached: () => Promise<boolean>;
  removeFromCache: () => Promise<void>;
  clearCache: () => Promise<void>;
  
  // Analytics
  getAnalytics: () => any;
}

export function useVideoPlayer(options: UseVideoPlayerOptions): UseVideoPlayerReturn {
  const {
    source,
    config,
    autoPlay = false,
    onLoad,
    onError,
    onPlaybackStateChange,
    onProgress,
    onEnd,
  } = options;

  const playerRef = useRef<VideoPlayerRef>(null);
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Event handlers
  const handleLoad = useCallback((data: any) => {
    setDuration(data.duration);
    setIsLoading(false);
    onLoad?.(data);
  }, [onLoad]);

  const handleError = useCallback((error: string) => {
    setHasError(true);
    setError(error);
    setIsLoading(false);
    onError?.(error);
  }, [onError]);

  const handlePlaybackStateChange = useCallback((status: VideoPlayerStatus) => {
    setIsPlaying(status === 'playing');
    setIsPaused(status === 'paused');
    setIsLoading(status === 'buffering' || status === 'preparing');
    onPlaybackStateChange?.(status);
  }, [onPlaybackStateChange]);

  const handleProgress = useCallback((data: any) => {
    setCurrentTime(data.currentTime);
    setBufferedTime(data.bufferedTime);
    onProgress?.(data);
  }, [onProgress]);

  const handleEnd = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(true);
    onEnd?.();
  }, [onEnd]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);

  const handleMuteChange = useCallback((muted: boolean) => {
    setIsMuted(muted);
  }, []);

  const handleFullscreenChange = useCallback((fullscreen: boolean) => {
    setIsFullscreen(fullscreen);
  }, []);

  // Player controls
  const play = useCallback(() => {
    playerRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    playerRef.current?.stop();
  }, []);

  const seek = useCallback((time: number) => {
    playerRef.current?.seek(time);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    playerRef.current?.setPlaybackRate(rate);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    playerRef.current?.setVolume(newVolume);
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    playerRef.current?.setMuted(muted);
  }, []);

  const enterFullscreen = useCallback(() => {
    playerRef.current?.enterFullscreen();
  }, []);

  const exitFullscreen = useCallback(() => {
    playerRef.current?.exitFullscreen();
  }, []);

  const setQuality = useCallback((quality: string) => {
    playerRef.current?.setQuality(quality as any);
  }, []);

  const getAvailableQualities = useCallback(() => {
    return playerRef.current?.getAvailableQualities() || [];
  }, []);

  const getCurrentQuality = useCallback(() => {
    return playerRef.current?.getCurrentQuality() || 'auto';
  }, []);

  const isCached = useCallback(async () => {
    return playerRef.current?.isCached() || false;
  }, []);

  const removeFromCache = useCallback(async () => {
    return playerRef.current?.removeFromCache();
  }, []);

  const clearCache = useCallback(async () => {
    return playerRef.current?.clearCache();
  }, []);

  const getAnalytics = useCallback(() => {
    return playerRef.current?.getAnalytics() || {};
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && playerRef.current && !isLoading && !hasError) {
      play();
    }
  }, [autoPlay, isLoading, hasError, play]);

  return {
    playerRef,
    isPlaying,
    isPaused,
    isLoading,
    hasError,
    error,
    currentTime,
    duration,
    bufferedTime,
    volume,
    isMuted,
    isFullscreen,
    play,
    pause,
    stop,
    seek,
    setPlaybackRate,
    setVolume,
    setMuted,
    enterFullscreen,
    exitFullscreen,
    setQuality,
    getAvailableQualities,
    getCurrentQuality,
    isCached,
    removeFromCache,
    clearCache,
    getAnalytics,
  };
}