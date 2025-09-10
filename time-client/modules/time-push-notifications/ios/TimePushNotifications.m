//
//  TimePushNotifications.m
//  time-client
//
//  Copyright (c) 2025 Neo Qiss. All rights reserved.
//

#import "TimePushNotifications.h"
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <FirebaseCore/FirebaseCore.h>
#import <FirebaseMessaging/FirebaseMessaging.h>
#import <UserNotifications/UserNotifications.h>
#import <UIKit/UIKit.h>

// gRPC imports
#import "TimeNotificationService.pbobjc.h"
#import "TimeNotificationService.pbrpc.h"

@interface TimePushNotifications () <UNUserNotificationCenterDelegate, FIRMessagingDelegate>

@property (nonatomic, strong) UNUserNotificationCenter *notificationCenter;
@property (nonatomic, strong) FIRMessaging *messaging;
@property (nonatomic, strong) TimeNotificationService *grpcService;
@property (nonatomic, strong) NSString *currentUserId;
@property (nonatomic, strong) NSString *deviceToken;
@property (nonatomic, strong) NSMutableDictionary *notificationStats;
@property (nonatomic, strong) dispatch_queue_t processingQueue;
@property (nonatomic, assign) BOOL isInitialized;
@property (nonatomic, assign) BOOL debugLoggingEnabled;

@end

@implementation TimePushNotifications

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _notificationCenter = [UNUserNotificationCenter currentNotificationCenter];
        _notificationCenter.delegate = self;
        _messaging = [FIRMessaging messaging];
        _messaging.delegate = self;
        _notificationStats = [NSMutableDictionary dictionary];
        _processingQueue = dispatch_queue_create("com.time.pushnotifications.processing", DISPATCH_QUEUE_SERIAL);
        _isInitialized = NO;
        _debugLoggingEnabled = NO;
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
        @"notificationReceived",
        @"notificationOpened",
        @"notificationDismissed",
        @"tokenUpdated",
        @"permissionChanged",
        @"badgeCountChanged",
        @"notificationActionPerformed"
    ];
}

// MARK: - Initialization and Configuration

+ (void)initializeWithServerConfig:(NSDictionary *)serverConfig
                         fcmConfig:(NSDictionary *)fcmConfig
                        completion:(void(^)(BOOL success, NSError * _Nullable error))completion {
    
    // Initialize Firebase if not already initialized
    if (![FIRApp defaultApp]) {
        [FIRApp configure];
    }
    
    // Configure FCM
    if (fcmConfig[@"autoInitEnabled"]) {
        [FIRMessaging messaging].autoInitEnabled = [fcmConfig[@"autoInitEnabled"] boolValue];
    }
    
    // Initialize gRPC service
    NSString *serverHost = serverConfig[@"host"] ?: @"localhost";
    NSNumber *serverPort = serverConfig[@"port"] ?: @50051;
    BOOL useSSL = [serverConfig[@"useSSL"] boolValue];
    
    GRPCMutableCallOptions *options = [[GRPCMutableCallOptions alloc] init];
    options.transport = useSSL ? GRPCTransportTypeChttp2BoringSSL : GRPCTransportTypeChttp2;
    
    // Create gRPC service
    TimeNotificationService *service = [[TimeNotificationService alloc] initWithHost:[NSString stringWithFormat:@"%@:%@", serverHost, serverPort]
                                                                              options:options];
    
    if (completion) {
        completion(YES, nil);
    }
}

+ (void)configureNotificationCategories:(NSArray<UNNotificationCategory *> *)categories {
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center setNotificationCategories:[NSSet setWithArray:categories]];
}

// MARK: - React Native Bridge Methods

RCT_EXPORT_METHOD(initialize:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSDictionary *serverConfig = config[@"server"];
    NSDictionary *fcmConfig = config[@"fcm"];
    
    [TimePushNotifications initializeWithServerConfig:serverConfig
                                             fcmConfig:fcmConfig
                                            completion:^(BOOL success, NSError *error) {
        if (success) {
            self.isInitialized = YES;
            [self setupNotificationCategories];
            [self requestInitialPermissions];
            resolve(@{@"success": @YES});
        } else {
            reject(@"INIT_ERROR", @"Failed to initialize push notifications", error);
        }
    }];
}

RCT_EXPORT_METHOD(registerDevice:(NSString *)userId
                  deviceInfo:(NSDictionary *)deviceInfo
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (!self.isInitialized) {
        reject(@"NOT_INITIALIZED", @"Push notifications not initialized", nil);
        return;
    }
    
    [self registerDeviceForUser:userId
                     deviceInfo:deviceInfo
                     completion:^(BOOL success, NSError *error) {
        if (success) {
            resolve(@{@"success": @YES});
        } else {
            reject(@"REGISTRATION_ERROR", @"Failed to register device", error);
        }
    }];
}

RCT_EXPORT_METHOD(requestPermissions:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    UNAuthorizationOptions authOptions = UNAuthorizationOptionNone;
    
    if ([options[@"alert"] boolValue]) {
        authOptions |= UNAuthorizationOptionAlert;
    }
    if ([options[@"badge"] boolValue]) {
        authOptions |= UNAuthorizationOptionBadge;
    }
    if ([options[@"sound"] boolValue]) {
        authOptions |= UNAuthorizationOptionSound;
    }
    if ([options[@"carPlay"] boolValue]) {
        authOptions |= UNAuthorizationOptionCarPlay;
    }
    if ([options[@"criticalAlert"] boolValue]) {
        authOptions |= UNAuthorizationOptionCriticalAlert;
    }
    if ([options[@"provisional"] boolValue]) {
        authOptions |= UNAuthorizationOptionProvisional;
    }
    if ([options[@"announcement"] boolValue]) {
        authOptions |= UNAuthorizationOptionAnnouncement;
    }
    
    [self requestPermissions:options completion:^(BOOL granted, NSError *error) {
        if (error) {
            reject(@"PERMISSION_ERROR", @"Failed to request permissions", error);
        } else {
            resolve(@{@"granted": @(granted)});
        }
    }];
}

RCT_EXPORT_METHOD(sendLocalNotification:(NSDictionary *)notificationData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    [self sendLocalNotification:notificationData completion:^(BOOL success, NSError *error) {
        if (success) {
            resolve(@{@"success": @YES});
        } else {
            reject(@"NOTIFICATION_ERROR", @"Failed to send notification", error);
        }
    }];
}

RCT_EXPORT_METHOD(updateBadgeCount:(NSInteger)count
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    [self updateBadgeCount:count completion:^(BOOL success, NSError *error) {
        if (success) {
            resolve(@{@"success": @YES});
        } else {
            reject(@"BADGE_ERROR", @"Failed to update badge count", error);
        }
    }];
}

RCT_EXPORT_METHOD(clearBadge:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    [self clearBadge:^(BOOL success, NSError *error) {
        if (success) {
            resolve(@{@"success": @YES});
        } else {
            reject(@"BADGE_ERROR", @"Failed to clear badge", error);
        }
    }];
}

RCT_EXPORT_METHOD(getBadgeCount:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    [self getBadgeCount:^(NSInteger count, NSError *error) {
        if (error) {
            reject(@"BADGE_ERROR", @"Failed to get badge count", error);
        } else {
            resolve(@{@"count": @(count)});
        }
    }];
}

RCT_EXPORT_METHOD(acknowledgeNotification:(NSString *)notificationId
                  action:(NSString *)action
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    [self acknowledgeNotification:notificationId
                            action:action
                        completion:^(BOOL success, NSError *error) {
        if (success) {
            resolve(@{@"success": @YES});
        } else {
            reject(@"ACK_ERROR", @"Failed to acknowledge notification", error);
        }
    }];
}

RCT_EXPORT_METHOD(sendTestNotification:(NSString *)title
                  body:(NSString *)body
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    [self sendTestNotification:title
                           body:body
                     completion:^(BOOL success, NSError *error) {
        if (success) {
            resolve(@{@"success": @YES});
        } else {
            reject(@"TEST_ERROR", @"Failed to send test notification", error);
        }
    }];
}

RCT_EXPORT_METHOD(getDebugInfo:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    [self getDebugInfo:^(NSDictionary *debugInfo, NSError *error) {
        if (error) {
            reject(@"DEBUG_ERROR", @"Failed to get debug info", error);
        } else {
            resolve(debugInfo);
        }
    }];
}

// MARK: - Implementation Methods

- (void)setupNotificationCategories {
    // Like notification category
    UNNotificationAction *likeAction = [UNNotificationAction actionWithIdentifier:@"LIKE_ACTION"
                                                                            title:@"Like"
                                                                          options:UNNotificationActionOptionNone];
    
    UNNotificationAction *replyAction = [UNNotificationAction actionWithIdentifier:@"REPLY_ACTION"
                                                                             title:@"Reply"
                                                                           options:UNNotificationActionOptionForeground];
    
    UNNotificationAction *dismissAction = [UNNotificationAction actionWithIdentifier:@"DISMISS_ACTION"
                                                                               title:@"Dismiss"
                                                                             options:UNNotificationActionOptionDestructive];
    
    UNNotificationCategory *likeCategory = [UNNotificationCategory categoryWithIdentifier:@"LIKE_CATEGORY"
                                                                                   actions:@[likeAction, replyAction, dismissAction]
                                                                         intentIdentifiers:@[]
                                                                                   options:UNNotificationCategoryOptionCustomDismissAction];
    
    // Follow notification category
    UNNotificationAction *followBackAction = [UNNotificationAction actionWithIdentifier:@"FOLLOW_BACK_ACTION"
                                                                                  title:@"Follow Back"
                                                                                options:UNNotificationActionOptionForeground];
    
    UNNotificationCategory *followCategory = [UNNotificationCategory categoryWithIdentifier:@"FOLLOW_CATEGORY"
                                                                                     actions:@[followBackAction, dismissAction]
                                                                           intentIdentifiers:@[]
                                                                                     options:UNNotificationCategoryOptionCustomDismissAction];
    
    // Mention notification category
    UNNotificationAction *viewAction = [UNNotificationAction actionWithIdentifier:@"VIEW_ACTION"
                                                                            title:@"View"
                                                                          options:UNNotificationActionOptionForeground];
    
    UNNotificationCategory *mentionCategory = [UNNotificationCategory categoryWithIdentifier:@"MENTION_CATEGORY"
                                                                                      actions:@[viewAction, replyAction, dismissAction]
                                                                            intentIdentifiers:@[]
                                                                                      options:UNNotificationCategoryOptionCustomDismissAction];
    
    // Chat message category
    UNNotificationAction *replyChatAction = [UNNotificationAction actionWithIdentifier:@"REPLY_CHAT_ACTION"
                                                                                 title:@"Reply"
                                                                               options:UNNotificationActionOptionForeground];
    
    UNNotificationCategory *chatCategory = [UNNotificationCategory categoryWithIdentifier:@"CHAT_CATEGORY"
                                                                                   actions:@[replyChatAction, dismissAction]
                                                                         intentIdentifiers:@[]
                                                                                   options:UNNotificationCategoryOptionCustomDismissAction];
    
    [TimePushNotifications configureNotificationCategories:@[likeCategory, followCategory, mentionCategory, chatCategory]];
}

- (void)requestInitialPermissions {
    UNAuthorizationOptions options = UNAuthorizationOptionAlert | UNAuthorizationOptionBadge | UNAuthorizationOptionSound;
    
    [self.notificationCenter requestAuthorizationWithOptions:options
                                           completionHandler:^(BOOL granted, NSError *error) {
        if (granted) {
            dispatch_async(dispatch_get_main_queue(), ^{
                [[UIApplication sharedApplication] registerForRemoteNotifications];
            });
        }
        
        [self sendEventWithName:@"permissionChanged" body:@{@"granted": @(granted)}];
    }];
}

- (void)registerDeviceForUser:(NSString *)userId
                   deviceInfo:(NSDictionary *)deviceInfo
                   completion:(void(^)(BOOL success, NSError * _Nullable error))completion {
    
    self.currentUserId = userId;
    
    // Get FCM token
    [[FIRMessaging messaging] tokenWithCompletion:^(NSString * _Nullable token, NSError * _Nullable error) {
        if (error) {
            if (completion) completion(NO, error);
            return;
        }
        
        self.deviceToken = token;
        
        // Register with time-server via gRPC
        [self registerDeviceWithServer:userId
                            deviceInfo:deviceInfo
                                 token:token
                            completion:completion];
    }];
}

- (void)registerDeviceWithServer:(NSString *)userId
                      deviceInfo:(NSDictionary *)deviceInfo
                           token:(NSString *)token
                      completion:(void(^)(BOOL success, NSError * _Nullable error))completion {
    
    // Create device registration request
    TimeDeviceRegistrationRequest *request = [[TimeDeviceRegistrationRequest alloc] init];
    request.userId = userId;
    request.deviceToken = token;
    request.platform = @"ios";
    request.appVersion = deviceInfo[@"appVersion"] ?: @"1.0.0";
    request.osVersion = deviceInfo[@"osVersion"] ?: [[UIDevice currentDevice] systemVersion];
    request.deviceModel = deviceInfo[@"deviceModel"] ?: [[UIDevice currentDevice] model];
    request.timezone = deviceInfo[@"timezone"] ?: [[NSTimeZone localTimeZone] name];
    request.language = deviceInfo[@"language"] ?: [[NSLocale currentLocale] languageCode];
    
    // Send registration request via gRPC
    GRPCUnaryProtoCall *call = [self.grpcService registerDeviceWithRequest:request
                                                                    handler:^(TimeDeviceRegistrationResponse *response, NSError *error) {
        if (error) {
            if (completion) completion(NO, error);
            return;
        }
        
        if (response.success) {
            [self sendEventWithName:@"tokenUpdated" body:@{@"token": token}];
            if (completion) completion(YES, nil);
        } else {
            NSError *registrationError = [NSError errorWithDomain:@"TimePushNotifications"
                                                             code:1001
                                                         userInfo:@{NSLocalizedDescriptionKey: @"Device registration failed"}];
            if (completion) completion(NO, registrationError);
        }
    }];
    
    [call start];
}

- (void)sendLocalNotification:(NSDictionary *)notificationData
                   completion:(void(^)(BOOL success, NSError * _Nullable error))completion {
    
    UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
    content.title = notificationData[@"title"] ?: @"";
    content.body = notificationData[@"body"] ?: @"";
    content.sound = [UNNotificationSound defaultSound];
    content.badge = notificationData[@"badge"];
    content.categoryIdentifier = notificationData[@"category"];
    content.userInfo = notificationData[@"data"];
    
    // Add media content if provided
    if (notificationData[@"imageURL"]) {
        UNNotificationAttachment *attachment = [UNNotificationAttachment attachmentWithIdentifier:@"image"
                                                                                              URL:[NSURL URLWithString:notificationData[@"imageURL"]]
                                                                                          options:nil
                                                                                            error:nil];
        if (attachment) {
            content.attachments = @[attachment];
        }
    }
    
    // Create trigger (immediate)
    UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:1.0
                                                                                                    repeats:NO];
    
    // Create request
    NSString *identifier = notificationData[@"id"] ?: [[NSUUID UUID] UUIDString];
    UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:identifier
                                                                          content:content
                                                                          trigger:trigger];
    
    // Add notification
    [self.notificationCenter addNotificationRequest:request
                              withCompletionHandler:^(NSError *error) {
        if (error) {
            if (completion) completion(NO, error);
        } else {
            if (completion) completion(YES, nil);
        }
    }];
}

- (void)updateBadgeCount:(NSInteger)count
              completion:(void(^)(BOOL success, NSError * _Nullable error))completion {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [[UIApplication sharedApplication] setApplicationIconBadgeNumber:count];
        
        [self sendEventWithName:@"badgeCountChanged" body:@{@"count": @(count)}];
        
        if (completion) completion(YES, nil);
    });
}

- (void)clearBadge:(void(^)(BOOL success, NSError * _Nullable error))completion {
    [self updateBadgeCount:0 completion:completion];
}

- (void)getBadgeCount:(void(^)(NSInteger count, NSError * _Nullable error))completion {
    NSInteger count = [UIApplication sharedApplication].applicationIconBadgeNumber;
    if (completion) completion(count, nil);
}

- (void)acknowledgeNotification:(NSString *)notificationId
                         action:(NSString *)action
                     completion:(void(^)(BOOL success, NSError * _Nullable error))completion {
    
    // Send acknowledgment to server via gRPC
    TimeNotificationAcknowledgmentRequest *request = [[TimeNotificationAcknowledgmentRequest alloc] init];
    request.notificationId = notificationId;
    request.userId = self.currentUserId;
    request.action = action;
    request.timestamp = [[NSDate date] timeIntervalSince1970];
    
    GRPCUnaryProtoCall *call = [self.grpcService acknowledgeNotificationWithRequest:request
                                                                             handler:^(TimeNotificationAcknowledgmentResponse *response, NSError *error) {
        if (error) {
            if (completion) completion(NO, error);
            return;
        }
        
        if (completion) completion(response.success, nil);
    }];
    
    [call start];
}

- (void)sendTestNotification:(NSString *)title
                        body:(NSString *)body
                  completion:(void(^)(BOOL success, NSError * _Nullable error))completion {
    
    NSDictionary *testData = @{
        @"title": title,
        @"body": body,
        @"id": [[NSUUID UUID] UUIDString],
        @"category": @"TEST_CATEGORY"
    };
    
    [self sendLocalNotification:testData completion:completion];
}

- (void)getDebugInfo:(void(^)(NSDictionary *debugInfo, NSError * _Nullable error))completion {
    NSDictionary *debugInfo = @{
        @"isInitialized": @(self.isInitialized),
        @"deviceToken": self.deviceToken ?: @"",
        @"currentUserId": self.currentUserId ?: @"",
        @"notificationStats": self.notificationStats,
        @"debugLoggingEnabled": @(self.debugLoggingEnabled)
    };
    
    if (completion) completion(debugInfo, nil);
}

// MARK: - UNUserNotificationCenterDelegate

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
    
    [self sendEventWithName:@"notificationReceived" body:notification.request.content.userInfo];
    
    // Show notification even when app is in foreground
    completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound);
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void(^)(void))completionHandler {
    
    NSMutableDictionary *responseData = [NSMutableDictionary dictionaryWithDictionary:response.notification.request.content.userInfo];
    responseData[@"actionIdentifier"] = response.actionIdentifier;
    responseData[@"userText"] = response.userText;
    
    [self sendEventWithName:@"notificationActionPerformed" body:responseData];
    
    // Track notification interaction
    [self trackNotificationEvent:response.notification.request.identifier
                       eventType:@"opened"
                        metadata:@{@"action": response.actionIdentifier}];
    
    completionHandler();
}

// MARK: - FIRMessagingDelegate

- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
    if (self.debugLoggingEnabled) {
        RCTLogInfo(@"FCM registration token: %@", fcmToken);
    }
    
    if (self.deviceToken && ![self.deviceToken isEqualToString:fcmToken]) {
        // Token updated, re-register with server
        [self updatePushToken:fcmToken completion:^(BOOL success, NSError *error) {
            if (self.debugLoggingEnabled) {
                RCTLogInfo(@"Token update result: %@", success ? @"Success" : @"Failed");
            }
        }];
    }
}

- (void)messaging:(FIRMessaging *)messaging didReceiveMessage:(FIRMessagingRemoteMessage *)remoteMessage {
    [self sendEventWithName:@"notificationReceived" body:remoteMessage.appData];
}

// MARK: - Helper Methods

- (void)updatePushToken:(NSString *)newToken
             completion:(void(^)(BOOL success, NSError * _Nullable error))completion {
    
    self.deviceToken = newToken;
    
    if (self.currentUserId) {
        // Update token on server
        TimeDeviceUpdateRequest *request = [[TimeDeviceUpdateRequest alloc] init];
        request.userId = self.currentUserId;
        request.deviceToken = newToken;
        request.platform = @"ios";
        
        GRPCUnaryProtoCall *call = [self.grpcService updateDeviceWithRequest:request
                                                                      handler:^(TimeDeviceUpdateResponse *response, NSError *error) {
            if (error) {
                if (completion) completion(NO, error);
                return;
            }
            
            if (completion) completion(response.success, nil);
        }];
        
        [call start];
    } else {
        if (completion) completion(YES, nil);
    }
}

- (void)trackNotificationEvent:(NSString *)notificationId
                     eventType:(NSString *)eventType
                      metadata:(NSDictionary *)metadata {
    
    NSMutableDictionary *stats = self.notificationStats[eventType] ?: [NSMutableDictionary dictionary];
    NSNumber *count = stats[@"count"] ?: @0;
    stats[@"count"] = @(count.integerValue + 1);
    stats[@"lastEvent"] = [[NSDate date] timeIntervalSince1970];
    
    self.notificationStats[eventType] = stats;
}

+ (void)setDebugLoggingEnabled:(BOOL)enabled {
    // This would be implemented to enable/disable debug logging
}

@end