/**
 * NotificationMigration - Migration from Expo Notifications to Time Push Notifications
 * 
 * This module provides a seamless migration path from Expo notifications to the
 * new Time push notification system. It maintains API compatibility while
 * providing enhanced features and better performance.
 */

import { Platform } from 'react-native';
import { timePushNotifications, NotificationData } from './TimePushNotifications';

// Expo notification types for compatibility
export interface ExpoNotificationRequest {
  content: {
    title?: string;
    subtitle?: string;
    body?: string;
    data?: Record<string, any>;
    sound?: string | boolean;
    badge?: number;
    categoryIdentifier?: string;
    launchImageName?: string;
    userInfo?: Record<string, any>;
    attachments?: Array<{
      identifier: string;
      url: string;
      type?: string;
    }>;
  };
  trigger?: {
    type: 'push' | 'timeInterval' | 'calendar' | 'location' | 'unknown';
    seconds?: number;
    repeats?: boolean;
    dateComponents?: any;
    region?: any;
  };
  identifier: string;
}

export interface ExpoNotificationBehavior {
  shouldShowAlert: boolean;
  shouldShowBanner: boolean;
  shouldPlaySound: boolean;
  shouldSetBadge: boolean;
}

export interface ExpoNotificationPermissions {
  status: 'granted' | 'denied' | 'undetermined';
  canAskAgain: boolean;
  expires: 'never' | 'hour' | 'day' | 'week' | 'month' | 'year';
  android?: {
    importance: 'min' | 'low' | 'default' | 'high' | 'max';
    interruptionFilter: 'all' | 'priority' | 'alarms' | 'none' | 'unknown';
  };
  ios?: {
    status: 'authorized' | 'denied' | 'not-determined' | 'provisional';
    allowsAlert: boolean;
    allowsBadge: boolean;
    allowsSound: boolean;
    allowsAnnouncements: boolean;
    allowsCriticalAlerts: boolean;
    allowsProvisional: boolean;
  };
}

export interface ExpoDevicePushToken {
  type: 'ios' | 'android' | 'web';
  data: string;
}

// Migration class
export class NotificationMigration {
  private static instance: NotificationMigration;
  private isMigrated: boolean = false;
  private expoNotificationHandlers: Map<string, Function> = new Map();

  private constructor() {}

  public static getInstance(): NotificationMigration {
    if (!NotificationMigration.instance) {
      NotificationMigration.instance = new NotificationMigration();
    }
    return NotificationMigration.instance;
  }

  /**
   * Initialize migration
   */
  public async initialize(): Promise<void> {
    if (this.isMigrated) {
      return;
    }

    try {
      // Set up event forwarding from Time notifications to Expo-style events
      this.setupEventForwarding();
      this.isMigrated = true;
    } catch (error) {
      console.error('Failed to initialize notification migration:', error);
      throw error;
    }
  }

  /**
   * Convert Expo notification request to Time notification data
   */
  public convertExpoNotificationToTime(notification: ExpoNotificationRequest): NotificationData {
    return {
      id: notification.identifier,
      title: notification.content.title || '',
      body: notification.content.body || '',
      category: notification.content.categoryIdentifier,
      data: notification.content.data || {},
      imageURL: notification.content.attachments?.[0]?.url,
      sound: typeof notification.content.sound === 'string' ? notification.content.sound : 'default',
      badge: notification.content.badge,
      customData: notification.content.userInfo || {},
    };
  }

  /**
   * Convert Time notification data to Expo notification request
   */
  public convertTimeNotificationToExpo(notification: NotificationData): ExpoNotificationRequest {
    return {
      identifier: notification.id,
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sound: notification.sound,
        badge: notification.badge,
        categoryIdentifier: notification.category,
        userInfo: notification.customData,
        attachments: notification.imageURL ? [{
          identifier: 'image',
          url: notification.imageURL,
          type: 'image',
        }] : undefined,
      },
      trigger: {
        type: 'push',
      },
    };
  }

  /**
   * Set up event forwarding
   */
  private setupEventForwarding(): void {
    // Forward Time notification events to Expo-style events
    timePushNotifications.on('notificationReceived', (data) => {
      this.forwardEvent('notificationReceived', data);
    });

    timePushNotifications.on('notificationOpened', (data) => {
      this.forwardEvent('notificationOpened', data);
    });

    timePushNotifications.on('notificationDismissed', (data) => {
      this.forwardEvent('notificationDismissed', data);
    });

    timePushNotifications.on('tokenUpdated', (data) => {
      this.forwardEvent('tokenUpdated', data);
    });

    timePushNotifications.on('permissionChanged', (data) => {
      this.forwardEvent('permissionChanged', data);
    });

    timePushNotifications.on('badgeCountChanged', (data) => {
      this.forwardEvent('badgeCountChanged', data);
    });
  }

  /**
   * Forward events to registered handlers
   */
  private forwardEvent(eventName: string, data: any): void {
    const handler = this.expoNotificationHandlers.get(eventName);
    if (handler) {
      handler(data);
    }
  }

  /**
   * Register event handler (Expo-compatible)
   */
  public addNotificationReceivedListener(listener: (notification: any) => void): { remove: () => void } {
    this.expoNotificationHandlers.set('notificationReceived', listener);
    return {
      remove: () => {
        this.expoNotificationHandlers.delete('notificationReceived');
      },
    };
  }

  /**
   * Register notification response listener (Expo-compatible)
   */
  public addNotificationResponseReceivedListener(listener: (response: any) => void): { remove: () => void } {
    this.expoNotificationHandlers.set('notificationOpened', listener);
    return {
      remove: () => {
        this.expoNotificationHandlers.delete('notificationOpened');
      },
    };
  }

  /**
   * Register push token listener (Expo-compatible)
   */
  public addPushTokenListener(listener: (token: ExpoDevicePushToken) => void): { remove: () => void } {
    this.expoNotificationHandlers.set('tokenUpdated', (data) => {
      const expoToken: ExpoDevicePushToken = {
        type: Platform.OS as 'ios' | 'android' | 'web',
        data: data.token,
      };
      listener(expoToken);
    });
    return {
      remove: () => {
        this.expoNotificationHandlers.delete('tokenUpdated');
      },
    };
  }

  /**
   * Get notification permissions (Expo-compatible)
   */
  public async getPermissionsAsync(): Promise<ExpoNotificationPermissions> {
    try {
      const granted = await timePushNotifications.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      });

      return {
        status: granted ? 'granted' : 'denied',
        canAskAgain: true,
        expires: 'never',
        android: {
          importance: 'high',
          interruptionFilter: 'all',
        },
        ios: {
          status: granted ? 'authorized' : 'denied',
          allowsAlert: true,
          allowsBadge: true,
          allowsSound: true,
          allowsAnnouncements: false,
          allowsCriticalAlerts: false,
          allowsProvisional: false,
        },
      };
    } catch (error) {
      return {
        status: 'denied',
        canAskAgain: false,
        expires: 'never',
      };
    }
  }

  /**
   * Request notification permissions (Expo-compatible)
   */
  public async requestPermissionsAsync(): Promise<ExpoNotificationPermissions> {
    return this.getPermissionsAsync();
  }

  /**
   * Get device push token (Expo-compatible)
   */
  public async getDevicePushTokenAsync(): Promise<ExpoDevicePushToken> {
    try {
      const state = timePushNotifications.getState();
      if (state.deviceToken) {
        return {
          type: Platform.OS as 'ios' | 'android' | 'web',
          data: state.deviceToken,
        };
      } else {
        throw new Error('Device token not available');
      }
    } catch (error) {
      throw new Error('Failed to get device push token');
    }
  }

  /**
   * Schedule notification (Expo-compatible)
   */
  public async scheduleNotificationAsync(notification: ExpoNotificationRequest): Promise<string> {
    try {
      const timeNotification = this.convertExpoNotificationToTime(notification);
      await timePushNotifications.sendLocalNotification(timeNotification);
      return notification.identifier;
    } catch (error) {
      throw new Error('Failed to schedule notification');
    }
  }

  /**
   * Cancel notification (Expo-compatible)
   */
  public async cancelScheduledNotificationAsync(identifier: string): Promise<void> {
    // Note: This would need to be implemented in the native module
    console.warn('cancelScheduledNotificationAsync not yet implemented');
  }

  /**
   * Cancel all notifications (Expo-compatible)
   */
  public async cancelAllScheduledNotificationsAsync(): Promise<void> {
    // Note: This would need to be implemented in the native module
    console.warn('cancelAllScheduledNotificationsAsync not yet implemented');
  }

  /**
   * Set notification handler (Expo-compatible)
   */
  public setNotificationHandler(handler: {
    handleNotification: (notification: any) => Promise<ExpoNotificationBehavior>;
  }): void {
    // Store the handler for use when notifications are received
    this.expoNotificationHandlers.set('notificationHandler', handler.handleNotification);
  }

  /**
   * Get badge count (Expo-compatible)
   */
  public async getBadgeCountAsync(): Promise<number> {
    try {
      return await timePushNotifications.getBadgeCount();
    } catch (error) {
      return 0;
    }
  }

  /**
   * Set badge count (Expo-compatible)
   */
  public async setBadgeCountAsync(count: number): Promise<void> {
    try {
      await timePushNotifications.updateBadgeCount(count);
    } catch (error) {
      throw new Error('Failed to set badge count');
    }
  }

  /**
   * Decrement badge count (Expo-compatible)
   */
  public async decrementBadgeCountAsync(by: number = 1): Promise<void> {
    try {
      const currentCount = await timePushNotifications.getBadgeCount();
      const newCount = Math.max(0, currentCount - by);
      await timePushNotifications.updateBadgeCount(newCount);
    } catch (error) {
      throw new Error('Failed to decrement badge count');
    }
  }

  /**
   * Reset badge count (Expo-compatible)
   */
  public async resetBadgeCountAsync(): Promise<void> {
    try {
      await timePushNotifications.clearBadge();
    } catch (error) {
      throw new Error('Failed to reset badge count');
    }
  }

  /**
   * Set notification channel (Android only, Expo-compatible)
   */
  public async setNotificationChannelAsync(
    channelId: string,
    channel: {
      name: string;
      description?: string;
      importance?: number;
      sound?: string | null;
      vibrationPattern?: number[];
      showBadge?: boolean;
      lockscreenVisibility?: number;
    }
  ): Promise<void> {
    // Note: This would need to be implemented in the native Android module
    console.warn('setNotificationChannelAsync not yet implemented');
  }

  /**
   * Set notification channel group (Android only, Expo-compatible)
   */
  public async setNotificationChannelGroupAsync(
    groupId: string,
    group: {
      name: string;
      description?: string;
    }
  ): Promise<void> {
    // Note: This would need to be implemented in the native Android module
    console.warn('setNotificationChannelGroupAsync not yet implemented');
  }

  /**
   * Clean up migration
   */
  public cleanup(): void {
    this.expoNotificationHandlers.clear();
    this.isMigrated = false;
  }
}

// Export singleton instance
export const notificationMigration = NotificationMigration.getInstance();

// Export default
export default notificationMigration;