/**
 * Time Push Notifications - Main Export
 * 
 * This is the main entry point for the Time push notification system.
 * It provides a unified interface for all notification functionality.
 */

// Core modules
export { timePushNotifications, TimePushNotifications } from './TimePushNotifications';
export { useTimePushNotifications } from '../hooks/useTimePushNotifications';
export { notificationService, NotificationService } from './NotificationService';
export { notificationOptimizer, NotificationOptimizer } from './NotificationOptimizer';
export { notificationMigration, NotificationMigration } from './NotificationMigration';

// gRPC client
export { TimeNotificationServiceClient } from './grpc/TimeNotificationService';

// Types
export type {
  TimePushNotificationsConfig,
  DeviceInfo,
  NotificationData,
  NotificationPermissionOptions,
  NotificationStats,
  DebugInfo,
  NotificationEventType,
  NotificationEvent,
} from './TimePushNotifications';

export type {
  UseTimePushNotificationsOptions,
  UseTimePushNotificationsReturn,
} from '../hooks/useTimePushNotifications';

export type {
  NotificationServiceConfig,
  NotificationPreferences,
} from './NotificationService';

export type {
  NotificationGroup,
  DeliveryOptimization,
  UserEngagementMetrics,
  PerformanceMetrics,
} from './NotificationOptimizer';

export type {
  ExpoNotificationRequest,
  ExpoNotificationBehavior,
  ExpoNotificationPermissions,
  ExpoDevicePushToken,
} from './NotificationMigration';

// Default export
export default {
  timePushNotifications,
  useTimePushNotifications,
  notificationService,
  notificationOptimizer,
  notificationMigration,
};