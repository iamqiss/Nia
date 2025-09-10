/**
 * NotificationService - High-level notification service for Time app
 * 
 * This service provides a unified interface for all notification operations
 * in the Time app, integrating with the native push notification system
 * and the time-server gRPC API.
 */

import { timePushNotifications, TimePushNotificationsConfig, NotificationData } from './TimePushNotifications';
import { notificationMigration } from './NotificationMigration';
import { EventEmitter } from 'events';

export interface NotificationServiceConfig {
  server: {
    host: string;
    port: number;
    useSSL: boolean;
  };
  fcm: {
    autoInitEnabled: boolean;
    projectId: string;
  };
  enableMigration: boolean;
  enableAnalytics: boolean;
  enableBackgroundProcessing: boolean;
}

export interface NotificationPreferences {
  like: {
    enabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  };
  follow: {
    enabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  };
  mention: {
    enabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  };
  reply: {
    enabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  };
  repost: {
    enabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  };
  chat: {
    enabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  };
}

export interface NotificationStats {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalDismissed: number;
  deliveryRate: number;
  openRate: number;
  dismissalRate: number;
  lastUpdated: Date;
}

export class NotificationService extends EventEmitter {
  private static instance: NotificationService;
  private config: NotificationServiceConfig | null = null;
  private isInitialized: boolean = false;
  private currentUserId: string | null = null;
  private preferences: NotificationPreferences | null = null;
  private stats: NotificationStats | null = null;

  private constructor() {
    super();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize the notification service
   */
  public async initialize(config: NotificationServiceConfig): Promise<void> {
    try {
      this.config = config;
      
      // Initialize native push notifications
      await timePushNotifications.initialize({
        server: config.server,
        fcm: config.fcm,
      });

      // Initialize migration if enabled
      if (config.enableMigration) {
        await notificationMigration.initialize();
      }

      // Set up event listeners
      this.setupEventListeners();

      this.isInitialized = true;
      this.emit('initialized');
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Register user for notifications
   */
  public async registerUser(userId: string, deviceInfo?: any): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Notification service not initialized');
    }

    try {
      await timePushNotifications.registerDevice(userId, deviceInfo);
      this.currentUserId = userId;
      
      // Load user preferences
      await this.loadUserPreferences();
      
      this.emit('userRegistered', { userId });
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Request notification permissions
   */
  public async requestPermissions(): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('Notification service not initialized');
    }

    try {
      const granted = await timePushNotifications.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        announcement: false,
      });

      this.emit('permissionsChanged', { granted });
      return granted;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Send notification
   */
  public async sendNotification(notification: NotificationData): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Notification service not initialized');
    }

    try {
      // Check if notification type is enabled
      if (notification.category && this.preferences) {
        const categoryPrefs = this.preferences[notification.category as keyof NotificationPreferences];
        if (categoryPrefs && !categoryPrefs.enabled) {
          console.log(`Notification category ${notification.category} is disabled`);
          return;
        }
      }

      await timePushNotifications.sendLocalNotification(notification);
      this.emit('notificationSent', notification);
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Send push notification via server
   */
  public async sendPushNotification(notification: NotificationData): Promise<void> {
    if (!this.isInitialized || !this.currentUserId) {
      throw new Error('Notification service not initialized or user not registered');
    }

    try {
      await timePushNotifications.sendPushNotification(notification);
      this.emit('pushNotificationSent', notification);
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   */
  public async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    if (!this.isInitialized || !this.currentUserId) {
      throw new Error('Notification service not initialized or user not registered');
    }

    try {
      this.preferences = { ...this.preferences, ...preferences } as NotificationPreferences;
      
      // Sync with server
      await timePushNotifications.syncNotificationPreferences(this.preferences);
      
      this.emit('preferencesUpdated', this.preferences);
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get notification preferences
   */
  public getPreferences(): NotificationPreferences | null {
    return this.preferences;
  }

  /**
   * Load user preferences from server
   */
  private async loadUserPreferences(): Promise<void> {
    if (!this.currentUserId) return;

    try {
      // This would load preferences from the server
      // For now, use default preferences
      this.preferences = {
        like: { enabled: true, pushEnabled: true, inAppEnabled: true, frequency: 'immediate' },
        follow: { enabled: true, pushEnabled: true, inAppEnabled: true, frequency: 'immediate' },
        mention: { enabled: true, pushEnabled: true, inAppEnabled: true, frequency: 'immediate' },
        reply: { enabled: true, pushEnabled: true, inAppEnabled: true, frequency: 'immediate' },
        repost: { enabled: true, pushEnabled: true, inAppEnabled: true, frequency: 'immediate' },
        chat: { enabled: true, pushEnabled: true, inAppEnabled: true, frequency: 'immediate' },
      };
      
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  }

  /**
   * Get notification statistics
   */
  public async getStats(): Promise<NotificationStats | null> {
    if (!this.isInitialized || !this.currentUserId) {
      return null;
    }

    try {
      const stats = await timePushNotifications.getNotificationStats();
      this.stats = {
        totalSent: stats.sent,
        totalDelivered: stats.delivered,
        totalOpened: stats.opened,
        totalDismissed: stats.dismissed,
        deliveryRate: stats.deliveryRate,
        openRate: stats.openRate,
        dismissalRate: stats.dismissalRate,
        lastUpdated: stats.lastUpdated,
      };
      
      return this.stats;
      
    } catch (error) {
      console.error('Failed to get notification stats:', error);
      return null;
    }
  }

  /**
   * Update badge count
   */
  public async updateBadgeCount(count: number): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Notification service not initialized');
    }

    try {
      await timePushNotifications.updateBadgeCount(count);
      this.emit('badgeCountChanged', { count });
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Clear badge
   */
  public async clearBadge(): Promise<void> {
    await this.updateBadgeCount(0);
  }

  /**
   * Get current badge count
   */
  public async getBadgeCount(): Promise<number> {
    if (!this.isInitialized) {
      return 0;
    }

    try {
      return await timePushNotifications.getBadgeCount();
    } catch (error) {
      console.error('Failed to get badge count:', error);
      return 0;
    }
  }

  /**
   * Acknowledge notification
   */
  public async acknowledgeNotification(notificationId: string, action: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Notification service not initialized');
    }

    try {
      await timePushNotifications.acknowledgeNotification(notificationId, action);
      this.emit('notificationAcknowledged', { notificationId, action });
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Forward events from timePushNotifications
    timePushNotifications.on('notificationReceived', (data) => {
      this.emit('notificationReceived', data);
    });

    timePushNotifications.on('notificationOpened', (data) => {
      this.emit('notificationOpened', data);
    });

    timePushNotifications.on('notificationDismissed', (data) => {
      this.emit('notificationDismissed', data);
    });

    timePushNotifications.on('tokenUpdated', (data) => {
      this.emit('tokenUpdated', data);
    });

    timePushNotifications.on('permissionChanged', (data) => {
      this.emit('permissionChanged', data);
    });

    timePushNotifications.on('badgeCountChanged', (data) => {
      this.emit('badgeCountChanged', data);
    });
  }

  /**
   * Get service state
   */
  public getState(): {
    isInitialized: boolean;
    currentUserId: string | null;
    preferences: NotificationPreferences | null;
    stats: NotificationStats | null;
  } {
    return {
      isInitialized: this.isInitialized,
      currentUserId: this.currentUserId,
      preferences: this.preferences,
      stats: this.stats,
    };
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    timePushNotifications.cleanup();
    notificationMigration.cleanup();
    this.removeAllListeners();
    this.isInitialized = false;
    this.currentUserId = null;
    this.preferences = null;
    this.stats = null;
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Export default
export default notificationService;