export interface VideoPlayerConfig {
  // Performance settings
  preloadBufferSize: number; // in seconds
  maxBufferSize: number; // in seconds
  minBufferSize: number; // in seconds
  bufferForPlayback: number; // in seconds
  bufferForPlaybackAfterRebuffer: number; // in seconds
  
  // Network settings
  maxInitialBitrate: number; // in bps
  maxBitrate: number; // in bps
  adaptiveBitrateEnabled: boolean;
  
  // Caching settings
  enableDiskCache: boolean;
  maxCacheSize: number; // in bytes
  cacheDirectory?: string;
  
  // Quality settings
  preferredVideoQuality: VideoQuality;
  allowQualityChange: boolean;
  
  // Audio settings
  audioFocusGain: AudioFocusGain;
  allowBackgroundPlayback: boolean;
  
  // Hardware acceleration
  hardwareAccelerationEnabled: boolean;
  
  // Debug settings
  enableLogging: boolean;
  enableAnalytics: boolean;
}

export enum VideoQuality {
  AUTO = 'auto',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  ULTRA = 'ultra'
}

export enum AudioFocusGain {
  GAIN = 'gain',
  GAIN_TRANSIENT = 'gain_transient',
  GAIN_TRANSIENT_MAY_DUCK = 'gain_transient_may_duck',
  GAIN_TRANSIENT_EXCLUSIVE = 'gain_transient_exclusive'
}

export interface VideoSource {
  uri: string;
  type?: 'hls' | 'dash' | 'mp4' | 'webm' | 'auto';
  headers?: Record<string, string>;
  drm?: DRMConfig;
  startTime?: number; // in seconds
  endTime?: number; // in seconds
}

export interface DRMConfig {
  type: 'widevine' | 'playready' | 'fairplay';
  licenseUrl: string;
  headers?: Record<string, string>;
  keyRequestProperties?: Record<string, string>;
}

export interface VideoPlayerState {
  status: VideoPlayerStatus;
  currentTime: number;
  duration: number;
  bufferedTime: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  hasError: boolean;
  error?: string;
  currentBitrate?: number;
  availableBitrates?: number[];
  currentQuality?: VideoQuality;
  availableQualities?: VideoQuality[];
  isFullscreen: boolean;
  aspectRatio?: number;
  naturalSize?: { width: number; height: number };
}

export enum VideoPlayerStatus {
  IDLE = 'idle',
  PREPARING = 'preparing',
  READY = 'ready',
  BUFFERING = 'buffering',
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  ERROR = 'error',
  ENDED = 'ended'
}

export interface VideoPlayerEvents {
  onLoadStart?: () => void;
  onLoad?: (data: { duration: number; naturalSize: { width: number; height: number } }) => void;
  onProgress?: (data: { currentTime: number; bufferedTime: number }) => void;
  onPlaybackStateChange?: (status: VideoPlayerStatus) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onVolumeChange?: (volume: number) => void;
  onMuteChange?: (isMuted: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onQualityChange?: (quality: VideoQuality) => void;
  onBitrateChange?: (bitrate: number) => void;
  onBufferUpdate?: (data: { bufferedTime: number; bufferHealth: number }) => void;
}

export interface VideoPlayerProps {
  source: VideoSource;
  config?: Partial<VideoPlayerConfig>;
  style?: any;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  paused?: boolean;
  muted?: boolean;
  volume?: number;
  playbackRate?: number;
  repeat?: boolean;
  onLoadStart?: () => void;
  onLoad?: (data: { duration: number; naturalSize: { width: number; height: number } }) => void;
  onProgress?: (data: { currentTime: number; bufferedTime: number }) => void;
  onPlaybackStateChange?: (status: VideoPlayerStatus) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onVolumeChange?: (volume: number) => void;
  onMuteChange?: (isMuted: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onQualityChange?: (quality: VideoQuality) => void;
  onBitrateChange?: (bitrate: number) => void;
  onBufferUpdate?: (data: { bufferedTime: number; bufferHealth: number }) => void;
}

export interface VideoPlayerRef {
  // Playback control
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  
  // Quality control
  setQuality: (quality: VideoQuality) => void;
  getAvailableQualities: () => VideoQuality[];
  getCurrentQuality: () => VideoQuality;
  
  // Fullscreen control
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  
  // State queries
  getCurrentTime: () => number;
  getDuration: () => number;
  getBufferedTime: () => number;
  getPlaybackState: () => VideoPlayerStatus;
  getVolume: () => number;
  isMuted: () => boolean;
  isFullscreen: () => boolean;
  
  // Cache management
  clearCache: () => Promise<void>;
  getCacheSize: () => Promise<number>;
  preloadVideo: (source: VideoSource) => Promise<void>;
  
  // Analytics
  getAnalytics: () => VideoAnalytics;
}

export interface VideoAnalytics {
  totalPlayTime: number;
  totalBufferTime: number;
  rebufferCount: number;
  averageBitrate: number;
  qualityChanges: number;
  errorCount: number;
  cacheHitRate: number;
  networkRequests: number;
  dataTransferred: number;
}

export interface CacheConfig {
  maxSize: number; // in bytes
  maxAge: number; // in milliseconds
  enableDiskCache: boolean;
  enableMemoryCache: boolean;
  cacheDirectory?: string;
  compressionEnabled: boolean;
}

export interface CacheStats {
  memoryCacheSize: number;
  diskCacheSize: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
}