//
//  TimePushNotifications.h
//  time-client
//
//  Copyright (c) 2025 Neo Qiss. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <UserNotifications/UserNotifications.h>
#import <FirebaseCore/FirebaseCore.h>
#import <FirebaseMessaging/FirebaseMessaging.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * TimePushNotifications - Native iOS Push Notification Module
 * 
 * This module provides a comprehensive push notification system that:
 * - Integrates directly with Apple Push Notification Service (APNS)
 * - Uses Firebase Cloud Messaging (FCM) for cross-platform compatibility
 * - Communicates with time-server via gRPC for notification management
 * - Handles device registration, token management, and notification processing
 * - Supports rich notifications, background processing, and user interactions
 * 
 * Architecture:
 * - APNS for iOS native push notifications
 * - FCM for unified push token management
 * - gRPC client for server communication
 * - Background task processing for notification handling
 * - Rich notification support with media, actions, and custom UI
 */

@interface TimePushNotifications : RCTEventEmitter <RCTBridgeModule, UNUserNotificationCenterDelegate, FIRMessagingDelegate>

// MARK: - Initialization and Configuration

/**
 * Initialize the push notification system
 * @param serverConfig Configuration for time-server gRPC connection
 * @param fcmConfig Firebase Cloud Messaging configuration
 * @param completion Completion handler with success status
 */
+ (void)initializeWithServerConfig:(NSDictionary *)serverConfig
                         fcmConfig:(NSDictionary *)fcmConfig
                        completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

/**
 * Configure notification categories and actions
 * @param categories Array of notification categories with custom actions
 */
+ (void)configureNotificationCategories:(NSArray<UNNotificationCategory *> *)categories;

// MARK: - Device Registration and Token Management

/**
 * Register device for push notifications
 * @param userId User identifier from time-server
 * @param deviceInfo Device information dictionary
 * @param completion Completion handler with registration result
 */
- (void)registerDeviceForUser:(NSString *)userId
                   deviceInfo:(NSDictionary *)deviceInfo
                   completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

/**
 * Update device push token
 * @param newToken New push token from FCM/APNS
 * @param completion Completion handler
 */
- (void)updatePushToken:(NSString *)newToken
             completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

/**
 * Unregister device from push notifications
 * @param userId User identifier
 * @param completion Completion handler
 */
- (void)unregisterDeviceForUser:(NSString *)userId
                     completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

// MARK: - Notification Management

/**
 * Send local notification for testing
 * @param notificationData Notification payload
 * @param completion Completion handler
 */
- (void)sendLocalNotification:(NSDictionary *)notificationData
                   completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

/**
 * Schedule notification for future delivery
 * @param notificationData Notification payload
 * @param triggerDate Date when notification should be delivered
 * @param completion Completion handler
 */
- (void)scheduleNotification:(NSDictionary *)notificationData
                 triggerDate:(NSDate *)triggerDate
                  completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

/**
 * Cancel scheduled notification
 * @param notificationId Unique notification identifier
 * @param completion Completion handler
 */
- (void)cancelNotification:(NSString *)notificationId
                completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

/**
 * Cancel all pending notifications
 * @param completion Completion handler
 */
- (void)cancelAllNotifications:(void(^)(BOOL success, NSError * _Nullable error))completion;

// MARK: - Badge Management

/**
 * Update application badge count
 * @param count Badge count
 * @param completion Completion handler
 */
- (void)updateBadgeCount:(NSInteger)count
              completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

/**
 * Clear application badge
 * @param completion Completion handler
 */
- (void)clearBadge:(void(^)(BOOL success, NSError * _Nullable error))completion;

/**
 * Get current badge count
 * @param completion Completion handler with current badge count
 */
- (void)getBadgeCount:(void(^)(NSInteger count, NSError * _Nullable error))completion;

// MARK: - Notification Settings

/**
 * Request notification permissions
 * @param options Permission options (alert, badge, sound, etc.)
 * @param completion Completion handler with permission status
 */
- (void)requestPermissions:(NSDictionary *)options
                completion:(void(^)(BOOL granted, NSError * _Nullable error))completion;

/**
 * Get current notification settings
 * @param completion Completion handler with current settings
 */
- (void)getNotificationSettings:(void(^)(NSDictionary *settings, NSError * _Nullable error))completion;

/**
 * Open notification settings in system preferences
 */
- (void)openNotificationSettings;

// MARK: - Background Processing

/**
 * Handle background notification processing
 * @param userInfo Notification payload
 * @param completionHandler Background completion handler
 */
- (void)handleBackgroundNotification:(NSDictionary *)userInfo
                  completionHandler:(void(^)(UIBackgroundFetchResult))completionHandler;

/**
 * Process notification data and update local state
 * @param notificationData Notification payload
 * @param completion Completion handler
 */
- (void)processNotificationData:(NSDictionary *)notificationData
                     completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

// MARK: - Analytics and Monitoring

/**
 * Track notification delivery metrics
 * @param notificationId Notification identifier
 * @param eventType Event type (delivered, opened, dismissed, etc.)
 * @param metadata Additional metadata
 */
- (void)trackNotificationEvent:(NSString *)notificationId
                     eventType:(NSString *)eventType
                      metadata:(NSDictionary * _Nullable)metadata;

/**
 * Get notification delivery statistics
 * @param completion Completion handler with statistics
 */
- (void)getNotificationStats:(void(^)(NSDictionary *stats, NSError * _Nullable error))completion;

// MARK: - gRPC Communication

/**
 * Send notification acknowledgment to server
 * @param notificationId Notification identifier
 * @param action Action taken by user (opened, dismissed, etc.)
 * @param completion Completion handler
 */
- (void)acknowledgeNotification:(NSString *)notificationId
                         action:(NSString *)action
                     completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

/**
 * Sync notification preferences with server
 * @param preferences User notification preferences
 * @param completion Completion handler
 */
- (void)syncNotificationPreferences:(NSDictionary *)preferences
                         completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

// MARK: - Rich Notifications

/**
 * Create rich notification with media content
 * @param notificationData Notification payload
 * @param mediaURL URL to media content (image, video, etc.)
 * @param completion Completion handler
 */
- (void)createRichNotification:(NSDictionary *)notificationData
                      mediaURL:(NSString *)mediaURL
                    completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

/**
 * Create notification with custom actions
 * @param notificationData Notification payload
 * @param actions Array of custom action dictionaries
 * @param completion Completion handler
 */
- (void)createNotificationWithActions:(NSDictionary *)notificationData
                              actions:(NSArray<NSDictionary *> *)actions
                           completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

// MARK: - Testing and Debugging

/**
 * Send test notification
 * @param title Notification title
 * @param body Notification body
 * @param completion Completion handler
 */
- (void)sendTestNotification:(NSString *)title
                        body:(NSString *)body
                  completion:(void(^)(BOOL success, NSError * _Nullable error))completion;

/**
 * Enable debug logging
 * @param enabled Whether debug logging should be enabled
 */
+ (void)setDebugLoggingEnabled:(BOOL)enabled;

/**
 * Get debug information
 * @param completion Completion handler with debug info
 */
- (void)getDebugInfo:(void(^)(NSDictionary *debugInfo, NSError * _Nullable error))completion;

@end

NS_ASSUME_NONNULL_END