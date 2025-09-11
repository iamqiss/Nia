import { NativeModules, NativeEventEmitter } from 'react-native';
import { VideoAnalytics, VideoSource } from './types';

const { TimeNativeVideoPlayerModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(TimeNativeVideoPlayerModule);

export interface AnalyticsEvent {
  eventType: string;
  timestamp: number;
  data: Record<string, any>;
}

export interface PerformanceMetrics {
  loadTime: number;
  bufferTime: number;
  rebufferCount: number;
  averageBitrate: number;
  qualityChanges: number;
  errorCount: number;
  cacheHitRate: number;
  networkRequests: number;
  dataTransferred: number;
}

export interface UserBehaviorMetrics {
  totalPlayTime: number;
  averageSessionLength: number;
  completionRate: number;
  seekFrequency: number;
  pauseFrequency: number;
  fullscreenUsage: number;
  qualityPreference: string;
}

export class VideoAnalytics {
  private static instance: VideoAnalytics;
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = true;
  private sessionId: string;
  private startTime: number;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.setupEventListeners();
  }

  public static getInstance(): VideoAnalytics {
    if (!VideoAnalytics.instance) {
      VideoAnalytics.instance = new VideoAnalytics();
    }
    return VideoAnalytics.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupEventListeners(): void {
    if (!this.isEnabled) return;

    const eventTypes = [
      'videoLoadStart',
      'videoLoad',
      'videoPlay',
      'videoPause',
      'videoSeek',
      'videoEnd',
      'videoError',
      'qualityChange',
      'bitrateChange',
      'bufferStart',
      'bufferEnd',
      'fullscreenEnter',
      'fullscreenExit',
    ];

    eventTypes.forEach(eventType => {
      eventEmitter.addListener(eventType, (data) => {
        this.trackEvent(eventType, data);
      });
    });
  }

  /**
   * Track a custom event
   */
  public trackEvent(eventType: string, data: Record<string, any> = {}): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      eventType,
      timestamp: Date.now(),
      data: {
        ...data,
        sessionId: this.sessionId,
        sessionDuration: Date.now() - this.startTime,
      },
    };

    this.events.push(event);
    
    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  /**
   * Track video load start
   */
  public trackVideoLoadStart(source: VideoSource): void {
    this.trackEvent('videoLoadStart', {
      source: source.uri,
      type: source.type,
    });
  }

  /**
   * Track video load completion
   */
  public trackVideoLoad(source: VideoSource, duration: number, naturalSize: { width: number; height: number }): void {
    this.trackEvent('videoLoad', {
      source: source.uri,
      duration,
      naturalSize,
      loadTime: Date.now() - this.startTime,
    });
  }

  /**
   * Track video play
   */
  public trackVideoPlay(source: VideoSource, currentTime: number): void {
    this.trackEvent('videoPlay', {
      source: source.uri,
      currentTime,
    });
  }

  /**
   * Track video pause
   */
  public trackVideoPause(source: VideoSource, currentTime: number, playDuration: number): void {
    this.trackEvent('videoPause', {
      source: source.uri,
      currentTime,
      playDuration,
    });
  }

  /**
   * Track video seek
   */
  public trackVideoSeek(source: VideoSource, fromTime: number, toTime: number): void {
    this.trackEvent('videoSeek', {
      source: source.uri,
      fromTime,
      toTime,
      seekDistance: Math.abs(toTime - fromTime),
    });
  }

  /**
   * Track video end
   */
  public trackVideoEnd(source: VideoSource, totalPlayTime: number, completionRate: number): void {
    this.trackEvent('videoEnd', {
      source: source.uri,
      totalPlayTime,
      completionRate,
    });
  }

  /**
   * Track video error
   */
  public trackVideoError(source: VideoSource, error: string, errorCode?: string): void {
    this.trackEvent('videoError', {
      source: source.uri,
      error,
      errorCode,
    });
  }

  /**
   * Track quality change
   */
  public trackQualityChange(source: VideoSource, fromQuality: string, toQuality: string): void {
    this.trackEvent('qualityChange', {
      source: source.uri,
      fromQuality,
      toQuality,
    });
  }

  /**
   * Track bitrate change
   */
  public trackBitrateChange(source: VideoSource, fromBitrate: number, toBitrate: number): void {
    this.trackEvent('bitrateChange', {
      source: source.uri,
      fromBitrate,
      toBitrate,
    });
  }

  /**
   * Track buffer start
   */
  public trackBufferStart(source: VideoSource, currentTime: number): void {
    this.trackEvent('bufferStart', {
      source: source.uri,
      currentTime,
    });
  }

  /**
   * Track buffer end
   */
  public trackBufferEnd(source: VideoSource, bufferDuration: number): void {
    this.trackEvent('bufferEnd', {
      source: source.uri,
      bufferDuration,
    });
  }

  /**
   * Track fullscreen enter
   */
  public trackFullscreenEnter(source: VideoSource): void {
    this.trackEvent('fullscreenEnter', {
      source: source.uri,
    });
  }

  /**
   * Track fullscreen exit
   */
  public trackFullscreenExit(source: VideoSource, fullscreenDuration: number): void {
    this.trackEvent('fullscreenExit', {
      source: source.uri,
      fullscreenDuration,
    });
  }

  /**
   * Get performance metrics
   */
  public async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return TimeNativeVideoPlayerModule.getPerformanceMetrics();
  }

  /**
   * Get user behavior metrics
   */
  public async getUserBehaviorMetrics(): Promise<UserBehaviorMetrics> {
    return TimeNativeVideoPlayerModule.getUserBehaviorMetrics();
  }

  /**
   * Get all events for current session
   */
  public getSessionEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Get events by type
   */
  public getEventsByType(eventType: string): AnalyticsEvent[] {
    return this.events.filter(event => event.eventType === eventType);
  }

  /**
   * Get events by time range
   */
  public getEventsByTimeRange(startTime: number, endTime: number): AnalyticsEvent[] {
    return this.events.filter(event => 
      event.timestamp >= startTime && event.timestamp <= endTime
    );
  }

  /**
   * Clear all events
   */
  public clearEvents(): void {
    this.events = [];
  }

  /**
   * Export analytics data
   */
  public exportAnalytics(): {
    sessionId: string;
    startTime: number;
    endTime: number;
    duration: number;
    events: AnalyticsEvent[];
    performanceMetrics: PerformanceMetrics;
    userBehaviorMetrics: UserBehaviorMetrics;
  } {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      endTime: Date.now(),
      duration: Date.now() - this.startTime,
      events: [...this.events],
      performanceMetrics: {} as PerformanceMetrics, // Will be populated by native
      userBehaviorMetrics: {} as UserBehaviorMetrics, // Will be populated by native
    };
  }

  /**
   * Enable/disable analytics
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    TimeNativeVideoPlayerModule.setAnalyticsEnabled(enabled);
  }

  /**
   * Check if analytics is enabled
   */
  public isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Start new session
   */
  public startNewSession(): void {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.clearEvents();
  }

  /**
   * Get session duration
   */
  public getSessionDuration(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Get session ID
   */
  public getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Set custom properties
   */
  public setCustomProperties(properties: Record<string, any>): void {
    TimeNativeVideoPlayerModule.setCustomProperties(properties);
  }

  /**
   * Get analytics summary
   */
  public async getAnalyticsSummary(): Promise<{
    totalSessions: number;
    totalPlayTime: number;
    averageSessionLength: number;
    mostPlayedVideos: Array<{ source: string; playCount: number }>;
    errorRate: number;
    averageLoadTime: number;
    cacheEfficiency: number;
  }> {
    return TimeNativeVideoPlayerModule.getAnalyticsSummary();
  }
}