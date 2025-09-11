#import "TimeNativeImageCache.h"
#import <React/RCTUIManager.h>
#import <React/RCTUtils.h>
#import <React/RCTLog.h>
#import <SDWebImage/SDWebImage.h>
#import <SDWebImageWebPCoder/SDWebImageWebPCoder.h>
#import <CommonCrypto/CommonCrypto.h>

// MARK: - Image Cache View

@interface TimeNativeImageCacheView : UIView

@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) UIActivityIndicatorView *loadingIndicator;
@property (nonatomic, strong) UILabel *errorLabel;

@property (nonatomic, copy) NSString *sourceUri;
@property (nonatomic, copy) NSDictionary *config;
@property (nonatomic, copy) NSString *resizeMode;
@property (nonatomic, copy) NSString *priority;
@property (nonatomic, assign) NSInteger timeout;
@property (nonatomic, assign) NSInteger retryCount;
@property (nonatomic, copy) NSString *placeholder;
@property (nonatomic, copy) NSString *fallback;
@property (nonatomic, assign) CGFloat blurRadius;
@property (nonatomic, assign) CGFloat borderRadius;
@property (nonatomic, copy) NSString *tintColor;
@property (nonatomic, copy) NSDictionary *transform;

@property (nonatomic, assign) BOOL isLoading;
@property (nonatomic, assign) BOOL hasError;
@property (nonatomic, copy) NSString *errorMessage;

@property (nonatomic, strong) SDWebImageManager *imageManager;
@property (nonatomic, strong) id<SDWebImageOperation> currentOperation;

- (void)setSource:(NSDictionary *)source;
- (void)setConfig:(NSDictionary *)config;
- (void)setResizeMode:(NSString *)resizeMode;
- (void)setPriority:(NSString *)priority;
- (void)setTimeout:(NSInteger)timeout;
- (void)setRetryCount:(NSInteger)retryCount;
- (void)setPlaceholder:(NSString *)placeholder;
- (void)setFallback:(NSString *)fallback;
- (void)setBlurRadius:(CGFloat)blurRadius;
- (void)setBorderRadius:(CGFloat)borderRadius;
- (void)setTintColor:(NSString *)tintColor;
- (void)setTransform:(NSDictionary *)transform;

- (void)loadImage;
- (void)reloadImage;
- (void)cancelLoad;
- (BOOL)isImageCached;
- (void)removeFromCache;
- (void)clearCache;

@end

@implementation TimeNativeImageCacheView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self setupView];
        [self setupImageManager];
    }
    return self;
}

- (void)dealloc {
    [self cancelLoad];
}

- (void)setupView {
    // Setup image view
    self.imageView = [[UIImageView alloc] init];
    self.imageView.contentMode = UIViewContentModeScaleAspectFit;
    self.imageView.clipsToBounds = YES;
    [self addSubview:self.imageView];
    
    // Setup loading indicator
    self.loadingIndicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
    self.loadingIndicator.hidesWhenStopped = YES;
    [self addSubview:self.loadingIndicator];
    
    // Setup error label
    self.errorLabel = [[UILabel alloc] init];
    self.errorLabel.textAlignment = NSTextAlignmentCenter;
    self.errorLabel.textColor = [UIColor redColor];
    self.errorLabel.font = [UIFont systemFontOfSize:12];
    self.errorLabel.numberOfLines = 0;
    self.errorLabel.hidden = YES;
    [self addSubview:self.errorLabel];
    
    // Setup constraints
    [self setupConstraints];
}

- (void)setupConstraints {
    self.imageView.translatesAutoresizingMaskIntoConstraints = NO;
    self.loadingIndicator.translatesAutoresizingMaskIntoConstraints = NO;
    self.errorLabel.translatesAutoresizingMaskIntoConstraints = NO;
    
    [NSLayoutConstraint activateConstraints:@[
        // Image view constraints
        [self.imageView.topAnchor constraintEqualToAnchor:self.topAnchor],
        [self.imageView.leadingAnchor constraintEqualToAnchor:self.leadingAnchor],
        [self.imageView.trailingAnchor constraintEqualToAnchor:self.trailingAnchor],
        [self.imageView.bottomAnchor constraintEqualToAnchor:self.bottomAnchor],
        
        // Loading indicator constraints
        [self.loadingIndicator.centerXAnchor constraintEqualToAnchor:self.centerXAnchor],
        [self.loadingIndicator.centerYAnchor constraintEqualToAnchor:self.centerYAnchor],
        
        // Error label constraints
        [self.errorLabel.centerXAnchor constraintEqualToAnchor:self.centerXAnchor],
        [self.errorLabel.centerYAnchor constraintEqualToAnchor:self.centerYAnchor],
        [self.errorLabel.leadingAnchor constraintGreaterThanOrEqualToAnchor:self.leadingAnchor constant:16],
        [self.errorLabel.trailingAnchor constraintLessThanOrEqualToAnchor:self.trailingAnchor constant:-16],
    ]];
}

- (void)setupImageManager {
    // Configure SDWebImage manager with optimized settings
    SDWebImageManager *manager = [SDWebImageManager sharedManager];
    
    // Configure cache
    SDImageCache *cache = [SDImageCache sharedImageCache];
    cache.config.maxMemoryCost = 100 * 1024 * 1024; // 100 MB
    cache.config.maxMemoryCount = 1000;
    cache.config.maxDiskSize = 500 * 1024 * 1024; // 500 MB
    cache.config.maxDiskAge = 7 * 24 * 60 * 60; // 7 days
    
    // Configure downloader
    SDWebImageDownloader *downloader = [SDWebImageDownloader sharedDownloader];
    downloader.config.maxConcurrentDownloads = 5;
    downloader.config.downloadTimeout = 30;
    
    // Enable WebP support
    [[SDImageCodersManager sharedManager] addCoder:[SDImageWebPCoder sharedCoder]];
    
    self.imageManager = manager;
}

- (void)setSource:(NSDictionary *)source {
    self.sourceUri = source[@"uri"];
    if (self.sourceUri) {
        [self loadImage];
    }
}

- (void)setConfig:(NSDictionary *)config {
    self.config = config;
    [self applyConfig];
}

- (void)setResizeMode:(NSString *)resizeMode {
    self.resizeMode = resizeMode;
    if (self.imageView) {
        if ([resizeMode isEqualToString:@"contain"]) {
            self.imageView.contentMode = UIViewContentModeScaleAspectFit;
        } else if ([resizeMode isEqualToString:@"cover"]) {
            self.imageView.contentMode = UIViewContentModeScaleAspectFill;
        } else if ([resizeMode isEqualToString:@"stretch"]) {
            self.imageView.contentMode = UIViewContentModeScaleToFill;
        } else if ([resizeMode isEqualToString:@"center"]) {
            self.imageView.contentMode = UIViewContentModeCenter;
        } else {
            self.imageView.contentMode = UIViewContentModeScaleAspectFit;
        }
    }
}

- (void)setPriority:(NSString *)priority {
    self.priority = priority;
}

- (void)setTimeout:(NSInteger)timeout {
    self.timeout = timeout;
}

- (void)setRetryCount:(NSInteger)retryCount {
    self.retryCount = retryCount;
}

- (void)setPlaceholder:(NSString *)placeholder {
    self.placeholder = placeholder;
}

- (void)setFallback:(NSString *)fallback {
    self.fallback = fallback;
}

- (void)setBlurRadius:(CGFloat)blurRadius {
    self.blurRadius = blurRadius;
}

- (void)setBorderRadius:(CGFloat)borderRadius {
    self.borderRadius = borderRadius;
    if (self.imageView) {
        self.imageView.layer.cornerRadius = borderRadius;
        self.imageView.layer.masksToBounds = borderRadius > 0;
    }
}

- (void)setTintColor:(NSString *)tintColor {
    self.tintColor = tintColor;
    if (self.imageView && tintColor) {
        UIColor *color = [self colorFromHexString:tintColor];
        self.imageView.tintColor = color;
    }
}

- (void)setTransform:(NSDictionary *)transform {
    self.transform = transform;
}

- (void)applyConfig {
    if (!self.config) return;
    
    // Apply configuration to SDWebImage
    SDImageCache *cache = [SDImageCache sharedImageCache];
    SDWebImageDownloader *downloader = [SDWebImageDownloader sharedDownloader];
    
    if (self.config[@"maxMemorySize"]) {
        cache.config.maxMemoryCost = [self.config[@"maxMemorySize"] integerValue];
    }
    
    if (self.config[@"maxDiskSize"]) {
        cache.config.maxDiskSize = [self.config[@"maxDiskSize"] integerValue];
    }
    
    if (self.config[@"maxDiskAge"]) {
        cache.config.maxDiskAge = [self.config[@"maxDiskAge"] integerValue] / 1000; // Convert to seconds
    }
    
    if (self.config[@"timeout"]) {
        downloader.config.downloadTimeout = [self.config[@"timeout"] integerValue];
    }
    
    if (self.config[@"maxConcurrentDownloads"]) {
        downloader.config.maxConcurrentDownloads = [self.config[@"maxConcurrentDownloads"] integerValue];
    }
}

- (void)loadImage {
    if (!self.sourceUri) return;
    
    [self cancelLoad];
    
    self.isLoading = YES;
    self.hasError = NO;
    self.errorMessage = nil;
    
    [self.loadingIndicator startAnimating];
    self.errorLabel.hidden = YES;
    
    // Emit load start event
    [self emitEvent:@"onLoadStart" data:@{@"uri": self.sourceUri}];
    
    NSURL *url = [NSURL URLWithString:self.sourceUri];
    if (!url) {
        [self onError:@"Invalid URL"];
        return;
    }
    
    // Configure options
    SDWebImageOptions options = SDWebImageRetryFailed | SDWebImageHighPriority;
    
    if ([self.priority isEqualToString:@"low"]) {
        options = SDWebImageRetryFailed | SDWebImageLowPriority;
    } else if ([self.priority isEqualToString:@"high"]) {
        options = SDWebImageRetryFailed | SDWebImageHighPriority;
    }
    
    // Add headers if provided
    NSMutableDictionary *headers = [NSMutableDictionary dictionary];
    if (self.config[@"headers"]) {
        [headers addEntriesFromDictionary:self.config[@"headers"]];
    }
    
    if (headers.count > 0) {
        [SDWebImageDownloader.sharedDownloader setValue:headers forHTTPHeaderField:@"User-Agent"];
    }
    
    // Load image
    __weak typeof(self) weakSelf = self;
    self.currentOperation = [self.imageManager loadImageWithURL:url
                                                        options:options
                                                       progress:^(NSInteger receivedSize, NSInteger expectedSize, NSURL * _Nullable targetURL) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (expectedSize > 0) {
                float progress = (float)receivedSize / (float)expectedSize;
                [weakSelf emitEvent:@"onProgress" data:@{
                    @"uri": weakSelf.sourceUri,
                    @"progress": @(progress)
                }];
            }
        });
    }
                                                      completed:^(UIImage * _Nullable image, NSData * _Nullable data, NSError * _Nullable error, SDImageCacheType cacheType, BOOL finished, NSURL * _Nullable imageURL) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [weakSelf.loadingIndicator stopAnimating];
            weakSelf.isLoading = NO;
            
            if (error) {
                [weakSelf onError:error.localizedDescription];
            } else if (image) {
                [weakSelf onLoad:image data:data cacheType:cacheType];
            } else {
                [weakSelf onError:@"Failed to load image"];
            }
        });
    }];
}

- (void)reloadImage {
    // Clear cache for this image and reload
    [[SDImageCache sharedImageCache] removeImageForKey:self.sourceUri withCompletion:nil];
    [self loadImage];
}

- (void)cancelLoad {
    if (self.currentOperation) {
        [self.currentOperation cancel];
        self.currentOperation = nil;
    }
}

- (BOOL)isImageCached {
    return [[SDImageCache sharedImageCache] diskImageExistsWithKey:self.sourceUri];
}

- (void)removeFromCache {
    [[SDImageCache sharedImageCache] removeImageForKey:self.sourceUri withCompletion:nil];
}

- (void)clearCache {
    [[SDImageCache sharedImageCache] clearMemory];
    [[SDImageCache sharedImageCache] clearDiskWithCompletion:nil];
}

- (void)onLoad:(UIImage *)image data:(NSData *)data cacheType:(SDImageCacheType)cacheType {
    self.hasError = NO;
    self.errorMessage = nil;
    
    // Apply transformations if needed
    UIImage *processedImage = [self processImage:image];
    self.imageView.image = processedImage;
    
    // Emit load event
    NSDictionary *loadData = @{
        @"uri": self.sourceUri,
        @"width": @(image.size.width),
        @"height": @(image.size.height),
        @"size": @(data.length),
        @"format": [self getImageFormat:data],
        @"fromCache": @(cacheType != SDImageCacheTypeNone),
        @"loadTime": @(0) // Would need to track actual load time
    };
    
    [self emitEvent:@"onLoad" data:loadData];
}

- (void)onError:(NSString *)error {
    self.hasError = YES;
    self.errorMessage = error;
    
    self.errorLabel.text = error;
    self.errorLabel.hidden = NO;
    
    // Try fallback if available
    if (self.fallback) {
        self.imageView.image = [UIImage imageNamed:self.fallback];
    }
    
    [self emitEvent:@"onError" data:@{
        @"uri": self.sourceUri,
        @"error": error
    }];
}

- (UIImage *)processImage:(UIImage *)image {
    if (!self.transform) return image;
    
    UIImage *processedImage = image;
    
    // Apply blur
    if (self.blurRadius > 0) {
        processedImage = [self applyBlur:processedImage radius:self.blurRadius];
    }
    
    // Apply other transformations from transform dictionary
    if (self.transform[@"resize"]) {
        NSDictionary *resize = self.transform[@"resize"];
        CGFloat width = [resize[@"width"] floatValue];
        CGFloat height = [resize[@"height"] floatValue];
        if (width > 0 && height > 0) {
            processedImage = [self resizeImage:processedImage toSize:CGSizeMake(width, height)];
        }
    }
    
    // Apply tint color
    if (self.tintColor) {
        UIColor *color = [self colorFromHexString:self.tintColor];
        processedImage = [processedImage imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
        self.imageView.tintColor = color;
    }
    
    return processedImage;
}

- (UIImage *)applyBlur:(UIImage *)image radius:(CGFloat)radius {
    CIContext *context = [CIContext context];
    CIImage *inputImage = [CIImage imageWithCGImage:image.CGImage];
    
    CIFilter *filter = [CIFilter filterWithName:@"CIGaussianBlur"];
    [filter setValue:inputImage forKey:kCIInputImageKey];
    [filter setValue:@(radius) forKey:kCIInputRadiusKey];
    
    CIImage *outputImage = filter.outputImage;
    CGImageRef cgImage = [context createCGImage:outputImage fromRect:inputImage.extent];
    
    UIImage *blurredImage = [UIImage imageWithCGImage:cgImage];
    CGImageRelease(cgImage);
    
    return blurredImage;
}

- (UIImage *)resizeImage:(UIImage *)image toSize:(CGSize)size {
    UIGraphicsBeginImageContextWithOptions(size, NO, 0.0);
    [image drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage *resizedImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return resizedImage;
}

- (NSString *)getImageFormat:(NSData *)data {
    if (data.length < 4) return @"unknown";
    
    const uint8_t *bytes = data.bytes;
    
    if (bytes[0] == 0xFF && bytes[1] == 0xD8 && bytes[2] == 0xFF) {
        return @"jpeg";
    } else if (bytes[0] == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47) {
        return @"png";
    } else if (bytes[0] == 0x47 && bytes[1] == 0x49 && bytes[2] == 0x46) {
        return @"gif";
    } else if (bytes[0] == 0x52 && bytes[1] == 0x49 && bytes[2] == 0x46 && bytes[3] == 0x46) {
        return @"webp";
    } else if (bytes[0] == 0x42 && bytes[1] == 0x4D) {
        return @"bmp";
    }
    
    return @"unknown";
}

- (UIColor *)colorFromHexString:(NSString *)hexString {
    NSString *cleanString = [hexString stringByReplacingOccurrencesOfString:@"#" withString:@""];
    if (cleanString.length == 3) {
        cleanString = [NSString stringWithFormat:@"%@%@%@%@%@%@",
                      [cleanString substringWithRange:NSMakeRange(0, 1)],
                      [cleanString substringWithRange:NSMakeRange(0, 1)],
                      [cleanString substringWithRange:NSMakeRange(1, 1)],
                      [cleanString substringWithRange:NSMakeRange(1, 1)],
                      [cleanString substringWithRange:NSMakeRange(2, 1)],
                      [cleanString substringWithRange:NSMakeRange(2, 1)]];
    }
    
    unsigned int rgbValue = 0;
    NSScanner *scanner = [NSScanner scannerWithString:cleanString];
    [scanner scanHexInt:&rgbValue];
    
    return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0
                           green:((rgbValue & 0xFF00) >> 8)/255.0
                            blue:(rgbValue & 0xFF)/255.0
                           alpha:1.0];
}

- (void)emitEvent:(NSString *)eventName data:(NSDictionary *)data {
    // This would emit events to React Native
    // Implementation depends on the bridge setup
}

@end

// MARK: - Module Implementation

@implementation TimeNativeImageCacheModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[
        @"onLoadStart",
        @"onLoad",
        @"onError",
        @"onProgress",
        @"onCacheHit",
        @"onCacheMiss"
    ];
}

// Configuration methods
RCT_EXPORT_METHOD(configure:(NSDictionary *)config) {
    // Apply configuration to SDWebImage
    SDImageCache *cache = [SDImageCache sharedImageCache];
    SDWebImageDownloader *downloader = [SDWebImageDownloader sharedDownloader];
    
    if (config[@"maxMemorySize"]) {
        cache.config.maxMemoryCost = [config[@"maxMemorySize"] integerValue];
    }
    
    if (config[@"maxDiskSize"]) {
        cache.config.maxDiskSize = [config[@"maxDiskSize"] integerValue];
    }
    
    if (config[@"maxDiskAge"]) {
        cache.config.maxDiskAge = [config[@"maxDiskAge"] integerValue] / 1000;
    }
    
    if (config[@"timeout"]) {
        downloader.config.downloadTimeout = [config[@"timeout"] integerValue];
    }
    
    if (config[@"maxConcurrentDownloads"]) {
        downloader.config.maxConcurrentDownloads = [config[@"maxConcurrentDownloads"] integerValue];
    }
}

RCT_EXPORT_METHOD(setMaxMemorySize:(NSInteger)size) {
    [SDImageCache sharedImageCache].config.maxMemoryCost = size;
}

RCT_EXPORT_METHOD(setMaxDiskSize:(NSInteger)size) {
    [SDImageCache sharedImageCache].config.maxDiskSize = size;
}

RCT_EXPORT_METHOD(setMaxCacheAge:(NSInteger)age) {
    [SDImageCache sharedImageCache].config.maxDiskAge = age / 1000;
}

RCT_EXPORT_METHOD(setMemoryCacheEnabled:(BOOL)enabled) {
    // SDWebImage doesn't have a direct way to disable memory cache
    // This would need custom implementation
}

RCT_EXPORT_METHOD(setDiskCacheEnabled:(BOOL)enabled) {
    // SDWebImage doesn't have a direct way to disable disk cache
    // This would need custom implementation
}

RCT_EXPORT_METHOD(setCompressionQuality:(float)quality) {
    // SDWebImage compression quality is handled per image
    // This would need custom implementation
}

RCT_EXPORT_METHOD(setWebPEnabled:(BOOL)enabled) {
    if (enabled) {
        [[SDImageCodersManager sharedManager] addCoder:[SDImageWebPCoder sharedCoder]];
    } else {
        [[SDImageCodersManager sharedManager] removeCoder:[SDImageWebPCoder sharedCoder]];
    }
}

RCT_EXPORT_METHOD(setMaxConcurrentDownloads:(NSInteger)max) {
    [SDWebImageDownloader sharedDownloader].config.maxConcurrentDownloads = max;
}

RCT_EXPORT_METHOD(setTimeout:(NSInteger)timeout) {
    [SDWebImageDownloader sharedDownloader].config.downloadTimeout = timeout;
}

RCT_EXPORT_METHOD(setRetryCount:(NSInteger)count) {
    // SDWebImage retry count is handled per request
    // This would need custom implementation
}

RCT_EXPORT_METHOD(setPrefetchingEnabled:(BOOL)enabled) {
    // This would need custom implementation
}

RCT_EXPORT_METHOD(setPrefetchBatchSize:(NSInteger)size) {
    // This would need custom implementation
}

RCT_EXPORT_METHOD(setAnalyticsEnabled:(BOOL)enabled) {
    // This would need custom implementation
}

// Loading methods
RCT_EXPORT_METHOD(loadImage:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *uri = options[@"source"][@"uri"];
    if (!uri) {
        reject(@"INVALID_URI", @"Invalid URI", nil);
        return;
    }
    
    NSURL *url = [NSURL URLWithString:uri];
    if (!url) {
        reject(@"INVALID_URL", @"Invalid URL", nil);
        return;
    }
    
    [[SDWebImageManager sharedManager] loadImageWithURL:url
                                                options:SDWebImageRetryFailed
                                               progress:nil
                                              completed:^(UIImage * _Nullable image, NSData * _Nullable data, NSError * _Nullable error, SDImageCacheType cacheType, BOOL finished, NSURL * _Nullable imageURL) {
        if (error) {
            reject(@"LOAD_ERROR", error.localizedDescription, error);
        } else if (image) {
            NSDictionary *result = @{
                @"uri": uri,
                @"width": @(image.size.width),
                @"height": @(image.size.height),
                @"size": @(data.length),
                @"format": @"unknown", // Would need to detect format
                @"fromCache": @(cacheType != SDImageCacheTypeNone),
                @"loadTime": @(0)
            };
            resolve(result);
        } else {
            reject(@"LOAD_ERROR", @"Failed to load image", nil);
        }
    }];
}

RCT_EXPORT_METHOD(loadImages:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // Implementation for batch loading
    resolve(@[]);
}

RCT_EXPORT_METHOD(prefetchImages:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // Implementation for prefetching
    resolve(@YES);
}

RCT_EXPORT_METHOD(cancelLoad:(NSString *)uri) {
    // Implementation for canceling load
}

RCT_EXPORT_METHOD(cancelAllLoads) {
    // Implementation for canceling all loads
}

// Cache management
RCT_EXPORT_METHOD(isImageCached:(NSString *)uri resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    BOOL isCached = [[SDImageCache sharedImageCache] diskImageExistsWithKey:uri];
    resolve(@(isCached));
}

RCT_EXPORT_METHOD(getCachedImageInfo:(NSString *)uri resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // Implementation for getting cached image info
    resolve([NSNull null]);
}

RCT_EXPORT_METHOD(removeImageFromCache:(NSString *)uri resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[SDImageCache sharedImageCache] removeImageForKey:uri withCompletion:^{
        resolve(@YES);
    }];
}

RCT_EXPORT_METHOD(clearCache:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[SDImageCache sharedImageCache] clearMemory];
    [[SDImageCache sharedImageCache] clearDiskWithCompletion:^{
        resolve(@YES);
    }];
}

RCT_EXPORT_METHOD(clearMemoryCache:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[SDImageCache sharedImageCache] clearMemory];
    resolve(@YES);
}

RCT_EXPORT_METHOD(clearDiskCache:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[SDImageCache sharedImageCache] clearDiskWithCompletion:^{
        resolve(@YES);
    }];
}

// Statistics and analytics
RCT_EXPORT_METHOD(getCacheStats:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    SDImageCache *cache = [SDImageCache sharedImageCache];
    
    NSDictionary *stats = @{
        @"memoryCacheSize": @(cache.config.maxMemoryCost),
        @"memoryCacheItems": @(cache.config.maxMemoryCount),
        @"diskCacheSize": @(cache.config.maxDiskSize),
        @"diskCacheItems": @(0), // Would need custom implementation
        @"hitRate": @(0.0), // Would need custom implementation
        @"missRate": @(0.0), // Would need custom implementation
        @"evictionCount": @(0), // Would need custom implementation
        @"totalRequests": @(0), // Would need custom implementation
        @"totalLoadTime": @(0), // Would need custom implementation
        @"averageLoadTime": @(0) // Would need custom implementation
    };
    
    resolve(stats);
}

RCT_EXPORT_METHOD(getAnalytics:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // Implementation for analytics
    NSDictionary *analytics = @{
        @"totalRequests": @(0),
        @"cacheHits": @(0),
        @"cacheMisses": @(0),
        @"totalLoadTime": @(0),
        @"averageLoadTime": @(0),
        @"errorCount": @(0),
        @"errorRate": @(0.0),
        @"dataTransferred": @(0),
        @"memoryUsage": @(0),
        @"diskUsage": @(0)
    };
    
    resolve(analytics);
}

RCT_EXPORT_METHOD(getCacheHealth:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // Implementation for cache health
    NSDictionary *health = @{
        @"status": @"healthy",
        @"issues": @[],
        @"recommendations": @[],
        @"memoryUsage": @(0),
        @"diskUsage": @(0),
        @"hitRate": @(0.0),
        @"averageLoadTime": @(0)
    };
    
    resolve(health);
}

// Image processing
RCT_EXPORT_METHOD(processImage:(NSString *)uri options:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // Implementation for image processing
    resolve(@{
        @"uri": uri,
        @"width": @(0),
        @"height": @(0),
        @"size": @(0),
        @"format": @"unknown",
        @"processingTime": @(0)
    });
}

RCT_EXPORT_METHOD(batchProcessImages:(NSArray *)uris options:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // Implementation for batch processing
    resolve(@[]);
}

// Cache optimization
RCT_EXPORT_METHOD(optimizeCache:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // Implementation for cache optimization
    resolve(@YES);
}

RCT_EXPORT_METHOD(getCacheRecommendations:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // Implementation for cache recommendations
    resolve(@{
        @"recommendedMaxMemorySize": @(100 * 1024 * 1024),
        @"recommendedMaxDiskSize": @(500 * 1024 * 1024),
        @"recommendedMaxAge": @(7 * 24 * 60 * 60 * 1000),
        @"shouldEnableCompression": @YES,
        @"shouldEnableWebP": @YES
    });
}

// Export/Import
RCT_EXPORT_METHOD(exportCacheData:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // Implementation for cache data export
    resolve(@{
        @"items": @[],
        @"totalSize": @(0),
        @"exportDate": @([[NSDate date] timeIntervalSince1970])
    });
}

RCT_EXPORT_METHOD(importCacheData:(NSDictionary *)data resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // Implementation for cache data import
    resolve(@YES);
}

@end

// MARK: - View Manager

@implementation TimeNativeImageCacheViewManager

RCT_EXPORT_MODULE(TimeNativeImageCacheView);

- (UIView *)view {
    return [[TimeNativeImageCacheView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(source, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(config, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(resizeMode, NSString);
RCT_EXPORT_VIEW_PROPERTY(priority, NSString);
RCT_EXPORT_VIEW_PROPERTY(timeout, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(retryCount, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString);
RCT_EXPORT_VIEW_PROPERTY(fallback, NSString);
RCT_EXPORT_VIEW_PROPERTY(blurRadius, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(borderRadius, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(tintColor, NSString);
RCT_EXPORT_VIEW_PROPERTY(transform, NSDictionary);

RCT_EXPORT_VIEW_PROPERTY(onLoadStart, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onProgress, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onCacheHit, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onCacheMiss, RCTDirectEventBlock);

@end