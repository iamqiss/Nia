//
//  TimeNativeCameraModule.m
//  time-native-camera
//
//  Created by Neo Qiss on 2025-01-27.
//

#import "TimeNativeCameraModule.h"
#import <React/RCTUtils.h>
#import <React/RCTImageLoader.h>
#import <React/RCTLog.h>
#import <MobileCoreServices/MobileCoreServices.h>
#import <ImageIO/ImageIO.h>
#import <AVFoundation/AVFoundation.h>
#import <Photos/Photos.h>
#import <CoreLocation/CoreLocation.h>

@interface TimeNativeCameraModule () <CLLocationManagerDelegate>

@property (nonatomic, strong) AVCaptureSession *captureSession;
@property (nonatomic, strong) AVCaptureDevice *captureDevice;
@property (nonatomic, strong) AVCaptureDeviceInput *captureInput;
@property (nonatomic, strong) AVCapturePhotoOutput *photoOutput;
@property (nonatomic, strong) AVCaptureVideoFileOutput *videoOutput;
@property (nonatomic, strong) AVCaptureVideoPreviewLayer *previewLayer;
@property (nonatomic, strong) UIViewController *cameraViewController;
@property (nonatomic, strong) UIView *cameraPreviewView;
@property (nonatomic, strong) CLLocationManager *locationManager;
@property (nonatomic, strong) NSMutableDictionary *activeUploads;
@property (nonatomic, assign) BOOL isRecording;
@property (nonatomic, assign) BOOL isCapturingPhoto;
@property (nonatomic, strong) NSURL *currentVideoURL;
@property (nonatomic, strong) RCTPromiseResolveBlock currentResolve;
@property (nonatomic, strong) RCTPromiseRejectBlock currentReject;
@property (nonatomic, strong) NSDictionary *currentOptions;

@end

@implementation TimeNativeCameraModule

RCT_EXPORT_MODULE();

- (instancetype)init {
    self = [super init];
    if (self) {
        _activeUploads = [NSMutableDictionary dictionary];
        _isRecording = NO;
        _isCapturingPhoto = NO;
        
        // Initialize location manager
        _locationManager = [[CLLocationManager alloc] init];
        _locationManager.delegate = self;
        _locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onCameraReady", @"onCameraError", @"onPhotoCaptured", @"onVideoRecordingStarted", 
             @"onVideoRecordingStopped", @"onUploadProgress", @"onUploadComplete", @"onUploadError"];
}

#pragma mark - Camera Methods

RCT_EXPORT_METHOD(openCamera:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self requestCameraPermissionWithCompletion:^(BOOL granted) {
            if (!granted) {
                reject(@"CAMERA_PERMISSION_DENIED", @"Camera permission is required", nil);
                return;
            }
            
            [self setupCameraWithOptions:options completion:^(BOOL success, NSError *error) {
                if (success) {
                    [self presentCameraViewController];
                    resolve(@{@"success": @YES});
                } else {
                    reject(@"CAMERA_SETUP_FAILED", error.localizedDescription, error);
                }
            }];
        }];
    });
}

RCT_EXPORT_METHOD(openCameraWithPreview:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self requestCameraPermissionWithCompletion:^(BOOL granted) {
            if (!granted) {
                reject(@"CAMERA_PERMISSION_DENIED", @"Camera permission is required", nil);
                return;
            }
            
            [self setupCameraWithOptions:options completion:^(BOOL success, NSError *error) {
                if (success) {
                    [self presentCameraViewControllerWithPreview];
                    resolve(@{@"success": @YES});
                } else {
                    reject(@"CAMERA_SETUP_FAILED", error.localizedDescription, error);
                }
            }];
        }];
    });
}

RCT_EXPORT_METHOD(startVideoRecording:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (self.isRecording) {
        reject(@"ALREADY_RECORDING", @"Video recording is already in progress", nil);
        return;
    }
    
    if (!self.videoOutput) {
        reject(@"NO_VIDEO_OUTPUT", @"Video output not available", nil);
        return;
    }
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self startVideoRecordingWithOptions:options];
        resolve(@{@"success": @YES});
    });
}

RCT_EXPORT_METHOD(stopVideoRecording:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (!self.isRecording) {
        reject(@"NOT_RECORDING", @"No video recording in progress", nil);
        return;
    }
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self stopVideoRecordingWithCompletion:^(NSURL *videoURL, NSError *error) {
            if (error) {
                reject(@"RECORDING_FAILED", error.localizedDescription, error);
            } else {
                [self processVideoAsset:videoURL completion:^(NSDictionary *asset, NSError *error) {
                    if (error) {
                        reject(@"PROCESSING_FAILED", error.localizedDescription, error);
                    } else {
                        resolve(@{@"assets": @[asset], @"canceled": @NO});
                    }
                }];
            }
        }];
    });
}

RCT_EXPORT_METHOD(takePicture:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (self.isCapturingPhoto) {
        reject(@"ALREADY_CAPTURING", @"Photo capture is already in progress", nil);
        return;
    }
    
    if (!self.photoOutput) {
        reject(@"NO_PHOTO_OUTPUT", @"Photo output not available", nil);
        return;
    }
    
    self.currentResolve = resolve;
    self.currentReject = reject;
    self.currentOptions = options;
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self capturePhotoWithOptions:options];
    });
}

RCT_EXPORT_METHOD(switchCamera:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self switchCameraWithCompletion:^(BOOL success, NSError *error) {
            if (success) {
                resolve(@YES);
            } else {
                reject(@"SWITCH_FAILED", error.localizedDescription, error);
            }
        }];
    });
}

RCT_EXPORT_METHOD(setFlashMode:(NSString *)mode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self setFlashMode:mode completion:^(BOOL success, NSError *error) {
            if (success) {
                resolve(@YES);
            } else {
                reject(@"FLASH_MODE_FAILED", error.localizedDescription, error);
            }
        }];
    });
}

RCT_EXPORT_METHOD(setFocusMode:(NSString *)mode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self setFocusMode:mode completion:^(BOOL success, NSError *error) {
            if (success) {
                resolve(@YES);
            } else {
                reject(@"FOCUS_MODE_FAILED", error.localizedDescription, error);
            }
        }];
    });
}

RCT_EXPORT_METHOD(setExposureMode:(NSString *)mode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self setExposureMode:mode completion:^(BOOL success, NSError *error) {
            if (success) {
                resolve(@YES);
            } else {
                reject(@"EXPOSURE_MODE_FAILED", error.localizedDescription, error);
            }
        }];
    });
}

RCT_EXPORT_METHOD(setWhiteBalanceMode:(NSString *)mode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self setWhiteBalanceMode:mode completion:^(BOOL success, NSError *error) {
            if (success) {
                resolve(@YES);
            } else {
                reject(@"WHITE_BALANCE_MODE_FAILED", error.localizedDescription, error);
            }
        }];
    });
}

RCT_EXPORT_METHOD(setZoom:(NSNumber *)level
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self setZoom:level.floatValue completion:^(BOOL success, NSError *error) {
            if (success) {
                resolve(@YES);
            } else {
                reject(@"ZOOM_FAILED", error.localizedDescription, error);
            }
        }];
    });
}

RCT_EXPORT_METHOD(focusAtPoint:(NSNumber *)x
                        y:(NSNumber *)y
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self focusAtPoint:CGPointMake(x.floatValue, y.floatValue) completion:^(BOOL success, NSError *error) {
            if (success) {
                resolve(@YES);
            } else {
                reject(@"FOCUS_FAILED", error.localizedDescription, error);
            }
        }];
    });
}

RCT_EXPORT_METHOD(exposeAtPoint:(NSNumber *)x
                         y:(NSNumber *)y
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self exposeAtPoint:CGPointMake(x.floatValue, y.floatValue) completion:^(BOOL success, NSError *error) {
            if (success) {
                resolve(@YES);
            } else {
                reject(@"EXPOSE_FAILED", error.localizedDescription, error);
            }
        }];
    });
}

#pragma mark - Gallery Methods

RCT_EXPORT_METHOD(openGallery:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self requestPhotoLibraryPermissionWithCompletion:^(BOOL granted) {
            if (!granted) {
                reject(@"PHOTO_LIBRARY_PERMISSION_DENIED", @"Photo library permission is required", nil);
                return;
            }
            
            [self presentImagePickerWithOptions:options completion:^(NSArray *assets, NSError *error) {
                if (error) {
                    reject(@"GALLERY_ERROR", error.localizedDescription, error);
                } else {
                    resolve(@{@"assets": assets, @"canceled": @NO});
                }
            }];
        }];
    });
}

RCT_EXPORT_METHOD(getAlbums:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self fetchAlbumsWithCompletion:^(NSArray *albums, NSError *error) {
            if (error) {
                reject(@"ALBUMS_ERROR", error.localizedDescription, error);
            } else {
                resolve(albums);
            }
        }];
    });
}

RCT_EXPORT_METHOD(getMediaFromAlbum:(NSString *)albumId
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self fetchMediaFromAlbum:albumId options:options completion:^(NSArray *assets, NSError *error) {
            if (error) {
                reject(@"MEDIA_ERROR", error.localizedDescription, error);
            } else {
                resolve(@{@"assets": assets, @"canceled": @NO});
            }
        }];
    });
}

#pragma mark - Media Processing Methods

RCT_EXPORT_METHOD(compressImage:(NSString *)uri
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self compressImageAtURI:uri options:options completion:^(NSDictionary *asset, NSError *error) {
            if (error) {
                reject(@"COMPRESSION_FAILED", error.localizedDescription, error);
            } else {
                resolve(asset);
            }
        }];
    });
}

RCT_EXPORT_METHOD(compressVideo:(NSString *)uri
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self compressVideoAtURI:uri options:options completion:^(NSDictionary *asset, NSError *error) {
            if (error) {
                reject(@"COMPRESSION_FAILED", error.localizedDescription, error);
            } else {
                resolve(asset);
            }
        }];
    });
}

RCT_EXPORT_METHOD(generateThumbnail:(NSString *)uri
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self generateThumbnailForURI:uri options:options completion:^(NSString *thumbnailURI, NSError *error) {
            if (error) {
                reject(@"THUMBNAIL_FAILED", error.localizedDescription, error);
            } else {
                resolve(thumbnailURI);
            }
        }];
    });
}

RCT_EXPORT_METHOD(extractMetadata:(NSString *)uri
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self extractMetadataFromURI:uri completion:^(NSDictionary *metadata, NSError *error) {
            if (error) {
                reject(@"METADATA_FAILED", error.localizedDescription, error);
            } else {
                resolve(metadata);
            }
        }];
    });
}

RCT_EXPORT_METHOD(cropImage:(NSString *)uri
                  cropData:(NSDictionary *)cropData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self cropImageAtURI:uri cropData:cropData completion:^(NSDictionary *asset, NSError *error) {
            if (error) {
                reject(@"CROP_FAILED", error.localizedDescription, error);
            } else {
                resolve(asset);
            }
        }];
    });
}

RCT_EXPORT_METHOD(rotateImage:(NSString *)uri
                  degrees:(NSNumber *)degrees
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self rotateImageAtURI:uri degrees:degrees.floatValue completion:^(NSDictionary *asset, NSError *error) {
            if (error) {
                reject(@"ROTATE_FAILED", error.localizedDescription, error);
            } else {
                resolve(asset);
            }
        }];
    });
}

RCT_EXPORT_METHOD(applyFilter:(NSString *)uri
                  filter:(NSString *)filter
                  intensity:(NSNumber *)intensity
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self applyFilterToImageAtURI:uri filter:filter intensity:intensity.floatValue completion:^(NSDictionary *asset, NSError *error) {
            if (error) {
                reject(@"FILTER_FAILED", error.localizedDescription, error);
            } else {
                resolve(asset);
            }
        }];
    });
}

#pragma mark - Upload Methods

RCT_EXPORT_METHOD(uploadMedia:(NSString *)uri
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self uploadMediaAtURI:uri options:options completion:^(NSDictionary *result, NSError *error) {
            if (error) {
                reject(@"UPLOAD_FAILED", error.localizedDescription, error);
            } else {
                resolve(result);
            }
        }];
    });
}

RCT_EXPORT_METHOD(uploadMediaWithProgress:(NSString *)uri
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self uploadMediaAtURI:uri options:options withProgress:^(NSDictionary *progress) {
            [self sendEventWithName:@"onUploadProgress" body:progress];
        } completion:^(NSDictionary *result, NSError *error) {
            if (error) {
                [self sendEventWithName:@"onUploadError" body:@{@"error": error.localizedDescription}];
                reject(@"UPLOAD_FAILED", error.localizedDescription, error);
            } else {
                [self sendEventWithName:@"onUploadComplete" body:result];
                resolve(result);
            }
        }];
    });
}

RCT_EXPORT_METHOD(cancelUpload:(NSString *)mediaId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        BOOL cancelled = [self cancelUploadWithMediaId:mediaId];
        resolve(@(cancelled));
    });
}

#pragma mark - Permission Methods

RCT_EXPORT_METHOD(requestPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self requestAllPermissionsWithCompletion:^(NSDictionary *permissions, NSError *error) {
            if (error) {
                reject(@"PERMISSION_ERROR", error.localizedDescription, error);
            } else {
                resolve(permissions);
            }
        }];
    });
}

RCT_EXPORT_METHOD(checkPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        NSDictionary *permissions = [self checkAllPermissions];
        resolve(permissions);
    });
}

#pragma mark - Utility Methods

RCT_EXPORT_METHOD(getCameraCapabilities:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        NSDictionary *capabilities = [self getCameraCapabilities];
        resolve(capabilities);
    });
}

RCT_EXPORT_METHOD(getDeviceInfo:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        NSDictionary *deviceInfo = [self getDeviceInfo];
        resolve(deviceInfo);
    });
}

RCT_EXPORT_METHOD(isCameraAvailable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        BOOL available = [self isCameraAvailable];
        resolve(@(available));
    });
}

RCT_EXPORT_METHOD(isGalleryAvailable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        BOOL available = [self isGalleryAvailable];
        resolve(@(available));
    });
}

#pragma mark - Private Methods

- (void)requestCameraPermissionWithCompletion:(void(^)(BOOL granted))completion {
    AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    
    if (status == AVAuthorizationStatusAuthorized) {
        completion(YES);
    } else if (status == AVAuthorizationStatusNotDetermined) {
        [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(granted);
            });
        }];
    } else {
        completion(NO);
    }
}

- (void)requestPhotoLibraryPermissionWithCompletion:(void(^)(BOOL granted))completion {
    PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
    
    if (status == PHAuthorizationStatusAuthorized || status == PHAuthorizationStatusLimited) {
        completion(YES);
    } else if (status == PHAuthorizationStatusNotDetermined) {
        [PHPhotoLibrary requestAuthorizationForAccessLevel:PHAccessLevelReadWrite completionHandler:^(PHAuthorizationStatus status) {
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(status == PHAuthorizationStatusAuthorized || status == PHAuthorizationStatusLimited);
            });
        }];
    } else {
        completion(NO);
    }
}

- (void)setupCameraWithOptions:(NSDictionary *)options completion:(void(^)(BOOL success, NSError *error))completion {
    // Implementation for camera setup
    // This is a simplified version - full implementation would include:
    // - Creating AVCaptureSession
    // - Configuring input/output
    // - Setting up preview layer
    // - Handling different camera types and configurations
    
    NSError *error = nil;
    self.captureSession = [[AVCaptureSession alloc] init];
    
    if ([self.captureSession canSetSessionPreset:AVCaptureSessionPresetHigh]) {
        [self.captureSession setSessionPreset:AVCaptureSessionPresetHigh];
    }
    
    // Configure camera device
    AVCaptureDeviceType deviceType = AVCaptureDeviceTypeBuiltInWideAngleCamera;
    if (options[@"cameraType"] && [options[@"cameraType"] isEqualToString:@"front"]) {
        deviceType = AVCaptureDeviceTypeBuiltInWideAngleCamera;
    }
    
    AVCaptureDeviceDiscoverySession *discoverySession = [AVCaptureDeviceDiscoverySession discoverySessionWithDeviceTypes:@[deviceType] mediaType:AVMediaTypeVideo position:AVCaptureDevicePositionUnspecified];
    
    self.captureDevice = discoverySession.devices.firstObject;
    if (!self.captureDevice) {
        error = [NSError errorWithDomain:@"TimeNativeCamera" code:1001 userInfo:@{NSLocalizedDescriptionKey: @"No camera device available"}];
        completion(NO, error);
        return;
    }
    
    // Create input
    self.captureInput = [AVCaptureDeviceInput deviceInputWithDevice:self.captureDevice error:&error];
    if (error) {
        completion(NO, error);
        return;
    }
    
    if ([self.captureSession canAddInput:self.captureInput]) {
        [self.captureSession addInput:self.captureInput];
    }
    
    // Create photo output
    self.photoOutput = [[AVCapturePhotoOutput alloc] init];
    if ([self.captureSession canAddOutput:self.photoOutput]) {
        [self.captureSession addOutput:self.photoOutput];
    }
    
    // Create video output
    self.videoOutput = [[AVCaptureVideoFileOutput alloc] init];
    if ([self.captureSession canAddOutput:self.videoOutput]) {
        [self.captureSession addOutput:self.videoOutput];
    }
    
    completion(YES, nil);
}

- (void)presentCameraViewController {
    // Implementation for presenting camera view controller
    // This would create a custom camera UI with controls
}

- (void)presentCameraViewControllerWithPreview {
    // Implementation for presenting camera with live preview
}

- (void)startVideoRecordingWithOptions:(NSDictionary *)options {
    // Implementation for starting video recording
    self.isRecording = YES;
    [self sendEventWithName:@"onVideoRecordingStarted" body:@{}];
}

- (void)stopVideoRecordingWithCompletion:(void(^)(NSURL *videoURL, NSError *error))completion {
    // Implementation for stopping video recording
    self.isRecording = NO;
    [self sendEventWithName:@"onVideoRecordingStopped" body:@{}];
    
    // Process the recorded video
    if (self.currentVideoURL) {
        completion(self.currentVideoURL, nil);
    } else {
        NSError *error = [NSError errorWithDomain:@"TimeNativeCamera" code:1002 userInfo:@{NSLocalizedDescriptionKey: @"No video recorded"}];
        completion(nil, error);
    }
}

- (void)capturePhotoWithOptions:(NSDictionary *)options {
    // Implementation for capturing photo
    self.isCapturingPhoto = YES;
    
    AVCapturePhotoSettings *settings = [AVCapturePhotoSettings photoSettings];
    
    // Configure settings based on options
    if (options[@"quality"]) {
        // Set quality based on options
    }
    
    if (options[@"enableHDR"] && [options[@"enableHDR"] boolValue]) {
        settings.highResolutionPhotoEnabled = YES;
    }
    
    [self.photoOutput capturePhotoWithSettings:settings delegate:self];
}

- (void)switchCameraWithCompletion:(void(^)(BOOL success, NSError *error))completion {
    // Implementation for switching camera
    completion(YES, nil);
}

- (void)setFlashMode:(NSString *)mode completion:(void(^)(BOOL success, NSError *error))completion {
    // Implementation for setting flash mode
    completion(YES, nil);
}

- (void)setFocusMode:(NSString *)mode completion:(void(^)(BOOL success, NSError *error))completion {
    // Implementation for setting focus mode
    completion(YES, nil);
}

- (void)setExposureMode:(NSString *)mode completion:(void(^)(BOOL success, NSError *error))completion {
    // Implementation for setting exposure mode
    completion(YES, nil);
}

- (void)setWhiteBalanceMode:(NSString *)mode completion:(void(^)(BOOL success, NSError *error))completion {
    // Implementation for setting white balance mode
    completion(YES, nil);
}

- (void)setZoom:(float)level completion:(void(^)(BOOL success, NSError *error))completion {
    // Implementation for setting zoom level
    completion(YES, nil);
}

- (void)focusAtPoint:(CGPoint)point completion:(void(^)(BOOL success, NSError *error))completion {
    // Implementation for focusing at point
    completion(YES, nil);
}

- (void)exposeAtPoint:(CGPoint)point completion:(void(^)(BOOL success, NSError *error))completion {
    // Implementation for exposing at point
    completion(YES, nil);
}

- (void)presentImagePickerWithOptions:(NSDictionary *)options completion:(void(^)(NSArray *assets, NSError *error))completion {
    // Implementation for presenting image picker
    completion(@[], nil);
}

- (void)fetchAlbumsWithCompletion:(void(^)(NSArray *albums, NSError *error))completion {
    // Implementation for fetching albums
    completion(@[], nil);
}

- (void)fetchMediaFromAlbum:(NSString *)albumId options:(NSDictionary *)options completion:(void(^)(NSArray *assets, NSError *error))completion {
    // Implementation for fetching media from album
    completion(@[], nil);
}

- (void)compressImageAtURI:(NSString *)uri options:(NSDictionary *)options completion:(void(^)(NSDictionary *asset, NSError *error))completion {
    // Implementation for image compression
    completion(@{}, nil);
}

- (void)compressVideoAtURI:(NSString *)uri options:(NSDictionary *)options completion:(void(^)(NSDictionary *asset, NSError *error))completion {
    // Implementation for video compression
    completion(@{}, nil);
}

- (void)generateThumbnailForURI:(NSString *)uri options:(NSDictionary *)options completion:(void(^)(NSString *thumbnailURI, NSError *error))completion {
    // Implementation for thumbnail generation
    completion(uri, nil);
}

- (void)extractMetadataFromURI:(NSString *)uri completion:(void(^)(NSDictionary *metadata, NSError *error))completion {
    // Implementation for metadata extraction
    completion(@{}, nil);
}

- (void)cropImageAtURI:(NSString *)uri cropData:(NSDictionary *)cropData completion:(void(^)(NSDictionary *asset, NSError *error))completion {
    // Implementation for image cropping
    completion(@{}, nil);
}

- (void)rotateImageAtURI:(NSString *)uri degrees:(float)degrees completion:(void(^)(NSDictionary *asset, NSError *error))completion {
    // Implementation for image rotation
    completion(@{}, nil);
}

- (void)applyFilterToImageAtURI:(NSString *)uri filter:(NSString *)filter intensity:(float)intensity completion:(void(^)(NSDictionary *asset, NSError *error))completion {
    // Implementation for filter application
    completion(@{}, nil);
}

- (void)uploadMediaAtURI:(NSString *)uri options:(NSDictionary *)options completion:(void(^)(NSDictionary *result, NSError *error))completion {
    // Implementation for media upload
    completion(@{}, nil);
}

- (void)uploadMediaAtURI:(NSString *)uri options:(NSDictionary *)options withProgress:(void(^)(NSDictionary *progress))progressBlock completion:(void(^)(NSDictionary *result, NSError *error))completion {
    // Implementation for media upload with progress
    completion(@{}, nil);
}

- (BOOL)cancelUploadWithMediaId:(NSString *)mediaId {
    // Implementation for canceling upload
    return YES;
}

- (void)requestAllPermissionsWithCompletion:(void(^)(NSDictionary *permissions, NSError *error))completion {
    // Implementation for requesting all permissions
    completion(@{}, nil);
}

- (NSDictionary *)checkAllPermissions {
    // Implementation for checking all permissions
    return @{};
}

- (NSDictionary *)getCameraCapabilities {
    // Implementation for getting camera capabilities
    return @{};
}

- (NSDictionary *)getDeviceInfo {
    // Implementation for getting device info
    return @{};
}

- (BOOL)isCameraAvailable {
    // Implementation for checking camera availability
    return YES;
}

- (BOOL)isGalleryAvailable {
    // Implementation for checking gallery availability
    return YES;
}

- (void)processVideoAsset:(NSURL *)videoURL completion:(void(^)(NSDictionary *asset, NSError *error))completion {
    // Implementation for processing video asset
    completion(@{}, nil);
}

#pragma mark - AVCapturePhotoCaptureDelegate

- (void)captureOutput:(AVCapturePhotoOutput *)output didFinishProcessingPhoto:(AVCapturePhoto *)photo error:(NSError *)error {
    self.isCapturingPhoto = NO;
    
    if (error) {
        if (self.currentReject) {
            self.currentReject(@"PHOTO_CAPTURE_FAILED", error.localizedDescription, error);
        }
    } else {
        // Process the captured photo
        [self processPhotoAsset:photo completion:^(NSDictionary *asset, NSError *error) {
            if (error) {
                if (self.currentReject) {
                    self.currentReject(@"PHOTO_PROCESSING_FAILED", error.localizedDescription, error);
                }
            } else {
                if (self.currentResolve) {
                    self.currentResolve(asset);
                }
            }
        }];
    }
    
    self.currentResolve = nil;
    self.currentReject = nil;
}

- (void)processPhotoAsset:(AVCapturePhoto *)photo completion:(void(^)(NSDictionary *asset, NSError *error))completion {
    // Implementation for processing photo asset
    completion(@{}, nil);
}

#pragma mark - CLLocationManagerDelegate

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {
    // Handle location updates
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    // Handle location errors
}

@end