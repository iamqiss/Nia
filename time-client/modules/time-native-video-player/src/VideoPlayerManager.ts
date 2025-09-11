import { NativeModules, NativeEventEmitter } from 'react-native';
import { VideoSource, VideoPlayerConfig, VideoQuality, VideoAnalytics } from './types';

const { TimeNativeVideoPlayerModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(TimeNativeVideoPlayerModule);

export class VideoPlayerManager {
  private static instance: VideoPlayerManager;
  private activePlayers: Map<string, any> = new Map();
  private globalConfig: VideoPlayerConfig;

  private constructor() {
    this.globalConfig = this.getDefaultConfig();
  }

  public static getInstance(): VideoPlayerManager {
    if (!VideoPlayerManager.instance) {
      VideoPlayerManager.instance = new VideoPlayerManager();
    }
    return VideoPlayerManager.instance;
  }

  private getDefaultConfig(): VideoPlayerConfig {
    return {
      preloadBufferSize: 30,
      maxBufferSize: 60,
      minBufferSize: 5,
      bufferForPlayback: 2.5,
      bufferForPlaybackAfterRebuffer: 5,
      maxInitialBitrate: 2000000,
      maxBitrate: 8000000,
      adaptiveBitrateEnabled: true,
      enableDiskCache: true,
      maxCacheSize: 500 * 1024 * 1024,
      preferredVideoQuality: VideoQuality.AUTO,
      allowQualityChange: true,
      audioFocusGain: 'gain_transient_may_duck',
      allowBackgroundPlayback: false,
      hardwareAccelerationEnabled: true,
      enableLogging: __DEV__,
      enableAnalytics: true,
    };
  }

  /**
   * Set global configuration for all video players
   */
  public setGlobalConfig(config: Partial<VideoPlayerConfig>): void {
    this.globalConfig = { ...this.globalConfig, ...config };
    TimeNativeVideoPlayerModule.setGlobalConfig(this.globalConfig);
  }

  /**
   * Get current global configuration
   */
  public getGlobalConfig(): VideoPlayerConfig {
    return { ...this.globalConfig };
  }

  /**
   * Preload multiple videos for better performance
   */
  public async preloadVideos(sources: VideoSource[]): Promise<void> {
    return TimeNativeVideoPlayerModule.preloadVideos(sources);
  }

  /**
   * Clear all cached videos
   */
  public async clearAllCache(): Promise<void> {
    return TimeNativeVideoPlayerModule.clearAllCache();
  }

  /**
   * Get cache statistics
   */
  public async getCacheStats(): Promise<{
    totalSize: number;
    videoCount: number;
    hitRate: number;
    missRate: number;
  }> {
    return TimeNativeVideoPlayerModule.getCacheStats();
  }

  /**
   * Set network conditions for adaptive bitrate
   */
  public setNetworkConditions(conditions: {
    bandwidth: number; // in bps
    latency: number; // in ms
    packetLoss: number; // 0-1
  }): void {
    TimeNativeVideoPlayerModule.setNetworkConditions(conditions);
  }

  /**
   * Get analytics for all players
   */
  public async getGlobalAnalytics(): Promise<VideoAnalytics> {
    return TimeNativeVideoPlayerModule.getGlobalAnalytics();
  }

  /**
   * Set audio focus policy
   */
  public setAudioFocusPolicy(policy: {
    gainOnPlay: boolean;
    duckOnInterruption: boolean;
    pauseOnLoss: boolean;
  }): void {
    TimeNativeVideoPlayerModule.setAudioFocusPolicy(policy);
  }

  /**
   * Enable/disable hardware acceleration globally
   */
  public setHardwareAcceleration(enabled: boolean): void {
    this.globalConfig.hardwareAccelerationEnabled = enabled;
    TimeNativeVideoPlayerModule.setHardwareAcceleration(enabled);
  }

  /**
   * Set maximum concurrent video players
   */
  public setMaxConcurrentPlayers(max: number): void {
    TimeNativeVideoPlayerModule.setMaxConcurrentPlayers(max);
  }

  /**
   * Get system video capabilities
   */
  public async getSystemCapabilities(): Promise<{
    maxResolution: { width: number; height: number };
    supportedFormats: string[];
    hardwareAccelerationSupported: boolean;
    maxBitrate: number;
  }> {
    return TimeNativeVideoPlayerModule.getSystemCapabilities();
  }

  /**
   * Register a player instance
   */
  public registerPlayer(id: string, player: any): void {
    this.activePlayers.set(id, player);
  }

  /**
   * Unregister a player instance
   */
  public unregisterPlayer(id: string): void {
    this.activePlayers.delete(id);
  }

  /**
   * Get all active players
   */
  public getActivePlayers(): string[] {
    return Array.from(this.activePlayers.keys());
  }

  /**
   * Pause all active players
   */
  public pauseAllPlayers(): void {
    TimeNativeVideoPlayerModule.pauseAllPlayers();
  }

  /**
   * Resume all active players
   */
  public resumeAllPlayers(): void {
    TimeNativeVideoPlayerModule.resumeAllPlayers();
  }

  /**
   * Set global volume for all players
   */
  public setGlobalVolume(volume: number): void {
    TimeNativeVideoPlayerModule.setGlobalVolume(volume);
  }

  /**
   * Set global mute state for all players
   */
  public setGlobalMute(muted: boolean): void {
    TimeNativeVideoPlayerModule.setGlobalMute(muted);
  }

  /**
   * Enable/disable analytics globally
   */
  public setAnalyticsEnabled(enabled: boolean): void {
    this.globalConfig.enableAnalytics = enabled;
    TimeNativeVideoPlayerModule.setAnalyticsEnabled(enabled);
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
    return TimeNativeVideoPlayerModule.getPerformanceMetrics();
  }

  /**
   * Set quality limits based on device capabilities
   */
  public setQualityLimits(limits: {
    maxResolution: { width: number; height: number };
    maxBitrate: number;
    maxFrameRate: number;
  }): void {
    TimeNativeVideoPlayerModule.setQualityLimits(limits);
  }

  /**
   * Enable/disable background playback
   */
  public setBackgroundPlayback(enabled: boolean): void {
    this.globalConfig.allowBackgroundPlayback = enabled;
    TimeNativeVideoPlayerModule.setBackgroundPlayback(enabled);
  }

  /**
   * Set DRM configuration for protected content
   */
  public setDRMConfig(config: {
    type: 'widevine' | 'playready' | 'fairplay';
    licenseUrl: string;
    headers?: Record<string, string>;
  }): void {
    TimeNativeVideoPlayerModule.setDRMConfig(config);
  }

  /**
   * Get device-specific optimizations
   */
  public async getDeviceOptimizations(): Promise<{
    recommendedBufferSize: number;
    recommendedBitrate: number;
    recommendedQuality: VideoQuality;
    hardwareAccelerationRecommended: boolean;
  }> {
    return TimeNativeVideoPlayerModule.getDeviceOptimizations();
  }
}