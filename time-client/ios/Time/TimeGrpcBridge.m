#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(TimeGrpcModule, RCTEventEmitter)

RCT_EXTERN_METHOD(initialize:(NSString *)host
                  port:(NSNumber *)port
                  useTls:(BOOL)useTls
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(getCurrentTime:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(getTimeWithTimezone:(NSString *)timezone
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(getTimeStats:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(startTimeStream)

RCT_EXTERN_METHOD(stopTimeStream)

RCT_EXTERN_METHOD(getConnectionStatus:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(shutdown)

@end