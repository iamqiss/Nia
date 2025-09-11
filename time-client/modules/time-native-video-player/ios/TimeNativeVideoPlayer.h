#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTViewManager.h>
#import <AVFoundation/AVFoundation.h>
#import <AVKit/AVKit.h>

@interface TimeNativeVideoPlayerModule : RCTEventEmitter <RCTBridgeModule>

// Configuration methods
- (void)setGlobalConfig:(NSDictionary *)config;
- (void)setHardwareAcceleration:(BOOL)enabled;
- (void)setMaxConcurrentPlayers:(NSInteger)max;
- (void)setAudioFocusPolicy:(NSDictionary *)policy;
- (void)setNetworkConditions:(NSDictionary *)conditions;
- (void)setAnalyticsEnabled:(BOOL)enabled;
- (void)setBackgroundPlayback:(BOOL)enabled;
- (void)setDRMConfig:(NSDictionary *)config;
- (void)setQualityLimits:(NSDictionary *)limits;

// Cache management
- (void)configureCache:(NSDictionary *)config;
- (void)preloadVideo:(NSDictionary *)source priority:(NSString *)priority resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)preloadVideos:(NSArray *)sources priority:(NSString *)priority resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)isVideoCached:(NSDictionary *)source resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)getCachedVideoInfo:(NSDictionary *)source resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)removeVideoFromCache:(NSDictionary *)source resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)clearCache:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)clearCacheByAge:(NSInteger)maxAge resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)clearCacheBySize:(NSInteger)maxSize resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)getCacheStats:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)getCacheSize:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)getCacheDirectory:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)setCacheDirectory:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)setCompressionEnabled:(BOOL)enabled;
- (void)setMaxCacheSize:(NSInteger)size;
- (void)setMaxCacheAge:(NSInteger)age;
- (void)setDiskCacheEnabled:(BOOL)enabled;
- (void)setMemoryCacheEnabled:(BOOL)enabled;
- (void)getCacheHitRate:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)optimizeCache:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)getCacheRecommendations:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)exportCacheData:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)importCacheData:(NSDictionary *)data resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)setEvictionPolicy:(NSString *)policy;
- (void)getCacheHealth:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

// Analytics
- (void)getPerformanceMetrics:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)getUserBehaviorMetrics:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)setCustomProperties:(NSDictionary *)properties;
- (void)getAnalyticsSummary:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

// System capabilities
- (void)getSystemCapabilities:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)getDeviceOptimizations:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

// Global player control
- (void)pauseAllPlayers;
- (void)resumeAllPlayers;
- (void)setGlobalVolume:(float)volume;
- (void)setGlobalMute:(BOOL)muted;

@end

@interface TimeNativeVideoPlayerView : RCTViewManager

@end

@interface TimeNativeVideoPlayerViewManager : RCTViewManager

@end