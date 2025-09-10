/**
 * TimePushNotifications - React Native Bridge for Native Push Notifications
 * 
 * This module provides a comprehensive React Native interface for the native
 * push notification system, eliminating the dependency on Expo notifications.
 * 
 * Features:
 * - Direct integration with iOS APNS and Android FCM
 * - gRPC communication with time-server
 * - Rich notification support with media and actions
 * - Background processing and badge management
 * - Device registration and token management
 * - Notification preferences and analytics
 * - Real-time event handling
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { EventEmitter } from 'events';

// Import generated gRPC types
import { TimeNotificationServiceClient } from './grpc/TimeNotificationService';

// Type definitions
export interface TimePushNotificationsConfig {
  server: {
    host: string;
    port: number;
    useSSL: boolean;
  };
  fcm: {
    autoInitEnabled: boolean;
    projectId: string;
  };
}

export interface DeviceInfo {
  appVersion: string;
  osVersion: string;
  deviceModel: string;
  timezone: string;
  language: string;
  deviceCapabilities?: Record<string, string>;
}

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  category?: string;
  data?: Record<string, any>;
  imageURL?: string;
  sound?: string;
  badge?: number;
  scheduledAt?: Date;
  customData?: Record<string, any>;
}

export interface NotificationPermissionOptions {
  alert: boolean;
  badge: boolean;
  sound: boolean;
  carPlay?: boolean;
  criticalAlert?: boolean;
  provisional?: boolean;
  announcement?: boolean;
}

export interface NotificationStats {
  sent: number;
  delivered: number;
  opened: number;
  dismissed: number;
  deliveryRate: number;
  openRate: number;
  dismissalRate: number;
  lastUpdated: Date;
}

export interface DebugInfo {
  isInitialized: boolean;
  deviceToken: string;
  currentUserId: string;
  notificationStats: Record<string, any>;
  debugLoggingEnabled: boolean;
}

// Event types
export type NotificationEventType = 
  | 'notificationReceived'
  | 'notificationOpened'
  | 'notificationDismissed'
  | 'tokenUpdated'
  | 'permissionChanged'
  | 'badgeCountChanged'
  | 'notificationActionPerformed';

export interface NotificationEvent {
  type: NotificationEventType;
  data: any;
}

// Native module interface
interface TimePushNotificationsNative {
  initialize(config: TimePushNotificationsConfig): Promise<{ success: boolean }>;
  registerDevice(userId: string, deviceInfo: DeviceInfo): Promise<{ success: boolean }>;
  requestPermissions(options: NotificationPermissionOptions): Promise<{ granted: boolean }>;
  sendLocalNotification(notificationData: NotificationData): Promise<{ success: boolean }>;
  updateBadgeCount(count: number): Promise<{ success: boolean }>;
  clearBadge(): Promise<{ success: boolean }>;
  getBadgeCount(): Promise<{ count: number }>;
  acknowledgeNotification(notificationId: string, action: string): Promise<{ success: boolean }>;
  sendTestNotification(title: string, body: string): Promise<{ success: boolean }>;
  getDebugInfo(): Promise<DebugInfo>;
}

// Main class
export class TimePushNotifications extends EventEmitter {
  private static instance: TimePushNotifications;
  private nativeModule: TimePushNotificationsNative;
  private eventEmitter: NativeEventEmitter;
  private grpcClient: TimeNotificationServiceClient | null = null;
  private isInitialized: boolean = false;
  private currentUserId: string | null = null;
  private deviceToken: string | null = null;

  private constructor() {
    super();
    
    // Get native module
    this.nativeModule = NativeModules.TimePushNotifications;
    if (!this.nativeModule) {
      throw new Error('TimePushNotifications native module not found. Make sure the native module is properly linked.');
    }

    // Create event emitter
    this.eventEmitter = new NativeEventEmitter(this.nativeModule);
    
    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): TimePushNotifications {
    if (!TimePushNotifications.instance) {
      TimePushNotifications.instance = new TimePushNotifications();
    }
    return TimePushNotifications.instance;
  }

  /**
   * Initialize the push notification system
   */
  public async initialize(config: TimePushNotificationsConfig): Promise<void> {
    try {
      const result = await this.nativeModule.initialize(config);
      
      if (result.success) {
        this.isInitialized = true;
        
        // Initialize gRPC client
        this.grpcClient = new TimeNotificationServiceClient(
          `${config.server.host}:${config.server.port}`,
          {
            'grpc.keepalive_time_ms': 30000,
            'grpc.keepalive_timeout_ms': 5000,
            'grpc.keepalive_permit_without_calls': true,
            'grpc.http2.max_pings_without_data': 0,
            'grpc.http2.min_time_between_pings_ms': 10000,
            'grpc.http2.min_ping_interval_without_data_ms': 300000,
          }
        );
        
        this.emit('initialized');
      } else {
        throw new Error('Failed to initialize push notifications');
      }
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Register device for push notifications
   */
  public async registerDevice(userId: string, deviceInfo: DeviceInfo): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Push notifications not initialized');
    }

    try {
      const result = await this.nativeModule.registerDevice(userId, deviceInfo);
      
      if (result.success) {
        this.currentUserId = userId;
        this.emit('deviceRegistered', { userId, deviceInfo });
      } else {
        throw new Error('Failed to register device');
      }
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Request notification permissions
   */
  public async requestPermissions(options: NotificationPermissionOptions): Promise<boolean> {
    try {
      const result = await this.nativeModule.requestPermissions(options);
      this.emit('permissionChanged', { granted: result.granted });
      return result.granted;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Send local notification
   */
  public async sendLocalNotification(notificationData: NotificationData): Promise<void> {
    try {
      const result = await this.nativeModule.sendLocalNotification(notificationData);
      
      if (result.success) {
        this.emit('notificationSent', notificationData);
      } else {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Update badge count
   */
  public async updateBadgeCount(count: number): Promise<void> {
    try {
      const result = await this.nativeModule.updateBadgeCount(count);
      
      if (result.success) {
        this.emit('badgeCountChanged', { count });
      } else {
        throw new Error('Failed to update badge count');
      }
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Clear badge
   */
  public async clearBadge(): Promise<void> {
    return this.updateBadgeCount(0);
  }

  /**
   * Get current badge count
   */
  public async getBadgeCount(): Promise<number> {
    try {
      const result = await this.nativeModule.getBadgeCount();
      return result.count;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Acknowledge notification
   */
  public async acknowledgeNotification(notificationId: string, action: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Push notifications not initialized');
    }

    try {
      const result = await this.nativeModule.acknowledgeNotification(notificationId, action);
      
      if (result.success) {
        this.emit('notificationAcknowledged', { notificationId, action });
      } else {
        throw new Error('Failed to acknowledge notification');
      }
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Send test notification
   */
  public async sendTestNotification(title: string, body: string): Promise<void> {
    try {
      const result = await this.nativeModule.sendTestNotification(title, body);
      
      if (result.success) {
        this.emit('testNotificationSent', { title, body });
      } else {
        throw new Error('Failed to send test notification');
      }
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get debug information
   */
  public async getDebugInfo(): Promise<DebugInfo> {
    try {
      return await this.nativeModule.getDebugInfo();
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Send push notification via gRPC
   */
  public async sendPushNotification(notificationData: NotificationData): Promise<void> {
    if (!this.grpcClient || !this.currentUserId) {
      throw new Error('Push notifications not initialized or user not registered');
    }

    try {
      const request = {
        userId: this.currentUserId,
        title: notificationData.title,
        body: notificationData.body,
        category: notificationData.category || 'general',
        data: notificationData.data || {},
        imageUrl: notificationData.imageURL || '',
        sound: notificationData.sound || 'default',
        badgeCount: notificationData.badge || 0,
        scheduledAt: notificationData.scheduledAt ? {
          seconds: Math.floor(notificationData.scheduledAt.getTime() / 1000),
          nanos: (notificationData.scheduledAt.getTime() % 1000) * 1000000,
        } : undefined,
        customData: notificationData.customData || {},
      };

      const response = await this.grpcClient.sendPushNotification(request);
      
      if (response.success) {
        this.emit('pushNotificationSent', { 
          notificationData, 
          messageId: response.messageId 
        });
      } else {
        throw new Error(response.message || 'Failed to send push notification');
      }
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Sync notification preferences with server
   */
  public async syncNotificationPreferences(preferences: Record<string, any>): Promise<void> {
    if (!this.grpcClient || !this.currentUserId) {
      throw new Error('Push notifications not initialized or user not registered');
    }

    try {
      const request = {
        userId: this.currentUserId,
        preferences: preferences,
        updatedAt: {
          seconds: Math.floor(Date.now() / 1000),
          nanos: (Date.now() % 1000) * 1000000,
        },
      };

      const response = await this.grpcClient.syncNotificationPreferences(request);
      
      if (response.success) {
        this.emit('preferencesSynced', preferences);
      } else {
        throw new Error(response.message || 'Failed to sync preferences');
      }
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  public async getNotificationStats(startDate?: Date, endDate?: Date): Promise<NotificationStats> {
    if (!this.grpcClient || !this.currentUserId) {
      throw new Error('Push notifications not initialized or user not registered');
    }

    try {
      const request = {
        userId: this.currentUserId,
        startDate: startDate ? {
          seconds: Math.floor(startDate.getTime() / 1000),
          nanos: (startDate.getTime() % 1000) * 1000000,
        } : undefined,
        endDate: endDate ? {
          seconds: Math.floor(endDate.getTime() / 1000),
          nanos: (endDate.getTime() % 1000) * 1000000,
        } : undefined,
      };

      const response = await this.grpcClient.getNotificationStats(request);
      
      if (response.success) {
        return {
          sent: response.stats.sent || 0,
          delivered: response.stats.delivered || 0,
          opened: response.stats.opened || 0,
          dismissed: response.stats.dismissed || 0,
          deliveryRate: response.deliveryRate || 0,
          openRate: response.openRate || 0,
          dismissalRate: response.dismissalRate || 0,
          lastUpdated: new Date(response.lastUpdated.seconds * 1000),
        };
      } else {
        throw new Error('Failed to get notification stats');
      }
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Notification received
    this.eventEmitter.addListener('notificationReceived', (data) => {
      this.emit('notificationReceived', data);
    });

    // Notification opened
    this.eventEmitter.addListener('notificationOpened', (data) => {
      this.emit('notificationOpened', data);
    });

    // Notification dismissed
    this.eventEmitter.addListener('notificationDismissed', (data) => {
      this.emit('notificationDismissed', data);
    });

    // Token updated
    this.eventEmitter.addListener('tokenUpdated', (data) => {
      this.deviceToken = data.token;
      this.emit('tokenUpdated', data);
    });

    // Permission changed
    this.eventEmitter.addListener('permissionChanged', (data) => {
      this.emit('permissionChanged', data);
    });

    // Badge count changed
    this.eventEmitter.addListener('badgeCountChanged', (data) => {
      this.emit('badgeCountChanged', data);
    });

    // Notification action performed
    this.eventEmitter.addListener('notificationActionPerformed', (data) => {
      this.emit('notificationActionPerformed', data);
    });
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    this.eventEmitter.removeAllListeners();
    this.removeAllListeners();
    
    if (this.grpcClient) {
      this.grpcClient.close();
      this.grpcClient = null;
    }
  }

  /**
   * Get current state
   */
  public getState(): {
    isInitialized: boolean;
    currentUserId: string | null;
    deviceToken: string | null;
  } {
    return {
      isInitialized: this.isInitialized,
      currentUserId: this.currentUserId,
      deviceToken: this.deviceToken,
    };
  }
}

// Export singleton instance
export const timePushNotifications = TimePushNotifications.getInstance();

// Export types
export * from './types';