#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>
#import <SDWebImage/SDWebImage.h>
#import <SDWebImageWebPCoder/SDWebImageWebPCoder.h>

@interface TimeNativeImageCacheModule : RCTEventEmitter <RCTBridgeModule>

// Configuration methods
- (void)configure:(NSDictionary *)config;
- (void)setMaxMemorySize:(NSInteger)size;
- (void)setMaxDiskSize:(NSInteger)size;
- (void)setMaxCacheAge:(NSInteger)age;
- (void)setMemoryCacheEnabled:(BOOL)enabled;
- (void)setDiskCacheEnabled:(BOOL)enabled;
- (void)setCompressionQuality:(float)quality;
- (void)setWebPEnabled:(BOOL)enabled;
- (void)setMaxConcurrentDownloads:(NSInteger)max;
- (void)setTimeout:(NSInteger)timeout;
- (void)setRetryCount:(NSInteger)count;
- (void)setPrefetchingEnabled:(BOOL)enabled;
- (void)setPrefetchBatchSize:(NSInteger)size;
- (void)setAnalyticsEnabled:(BOOL)enabled;

// Loading methods
- (void)loadImage:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)loadImages:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)prefetchImages:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)cancelLoad:(NSString *)uri;
- (void)cancelAllLoads;

// Cache management
- (void)isImageCached:(NSString *)uri resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)getCachedImageInfo:(NSString *)uri resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)removeImageFromCache:(NSString *)uri resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)clearCache:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)clearMemoryCache:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)clearDiskCache:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

// Statistics and analytics
- (void)getCacheStats:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)getAnalytics:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)getCacheHealth:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

// Image processing
- (void)processImage:(NSString *)uri options:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)batchProcessImages:(NSArray *)uris options:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

// Cache optimization
- (void)optimizeCache:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)getCacheRecommendations:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

// Export/Import
- (void)exportCacheData:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)importCacheData:(NSDictionary *)data resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

@end

@interface TimeNativeImageCacheView : RCTViewManager

@end

@interface TimeNativeImageCacheViewManager : RCTViewManager

@end