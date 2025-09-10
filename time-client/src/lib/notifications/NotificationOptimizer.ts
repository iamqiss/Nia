/**
 * NotificationOptimizer - Advanced notification optimization and management
 * 
 * This module provides advanced features for notification optimization including:
 * - Notification grouping and batching
 * - Smart delivery timing
 * - User engagement analytics
 * - Performance monitoring
 * - Resource management
 */

import { timePushNotifications, NotificationData } from './TimePushNotifications';
import { EventEmitter } from 'events';

export interface NotificationGroup {
  id: string;
  category: string;
  notifications: NotificationData[];
  maxNotifications: number;
  collapseKey: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  deliveryTime?: Date;
  expiresAt?: Date;
}

export interface DeliveryOptimization {
  enableBatching: boolean;
  batchSize: number;
  batchDelay: number; // milliseconds
  enableGrouping: boolean;
  maxGroupSize: number;
  enableSmartTiming: boolean;
  quietHours: {
    start: string; // HH:MM format
    end: string; // HH:MM format
    timezone: string;
  };
  enableRateLimiting: boolean;
  maxNotificationsPerMinute: number;
  maxNotificationsPerHour: number;
}

export interface UserEngagementMetrics {
  userId: string;
  totalNotificationsReceived: number;
  totalNotificationsOpened: number;
  totalNotificationsDismissed: number;
  averageTimeToOpen: number; // milliseconds
  averageTimeToDismiss: number; // milliseconds
  mostEngagingCategories: string[];
  leastEngagingCategories: string[];
  optimalDeliveryTimes: string[]; // HH:MM format
  lastUpdated: Date;
}

export interface PerformanceMetrics {
  averageDeliveryTime: number; // milliseconds
  successRate: number; // percentage
  errorRate: number; // percentage
  queueSize: number;
  processingRate: number; // notifications per second
  memoryUsage: number; // bytes
  cpuUsage: number; // percentage
  lastUpdated: Date;
}

export class NotificationOptimizer extends EventEmitter {
  private static instance: NotificationOptimizer;
  private optimizationConfig: DeliveryOptimization;
  private notificationQueue: NotificationData[] = [];
  private notificationGroups: Map<string, NotificationGroup> = new Map();
  private userMetrics: Map<string, UserEngagementMetrics> = new Map();
  private performanceMetrics: PerformanceMetrics;
  private isProcessing: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;
  private rateLimiter: Map<string, number[]> = new Map();

  private constructor() {
    super();
    
    this.optimizationConfig = {
      enableBatching: true,
      batchSize: 10,
      batchDelay: 5000, // 5 seconds
      enableGrouping: true,
      maxGroupSize: 5,
      enableSmartTiming: true,
      quietHours: {
        start: '22:00',
        end: '08:00',
        timezone: 'UTC',
      },
      enableRateLimiting: true,
      maxNotificationsPerMinute: 10,
      maxNotificationsPerHour: 100,
    };

    this.performanceMetrics = {
      averageDeliveryTime: 0,
      successRate: 100,
      errorRate: 0,
      queueSize: 0,
      processingRate: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      lastUpdated: new Date(),
    };

    this.startProcessing();
  }

  public static getInstance(): NotificationOptimizer {
    if (!NotificationOptimizer.instance) {
      NotificationOptimizer.instance = new NotificationOptimizer();
    }
    return NotificationOptimizer.instance;
  }

  /**
   * Configure optimization settings
   */
  public configure(config: Partial<DeliveryOptimization>): void {
    this.optimizationConfig = { ...this.optimizationConfig, ...config };
    this.emit('configurationUpdated', this.optimizationConfig);
  }

  /**
   * Queue notification for optimized delivery
   */
  public async queueNotification(notification: NotificationData): Promise<void> {
    try {
      // Check rate limiting
      if (this.optimizationConfig.enableRateLimiting) {
        if (!this.checkRateLimit(notification)) {
          console.log('Notification rate limited:', notification.id);
          return;
        }
      }

      // Check quiet hours
      if (this.optimizationConfig.enableSmartTiming) {
        if (this.isQuietHours()) {
          console.log('Notification delayed due to quiet hours:', notification.id);
          // Schedule for later delivery
          this.scheduleForLater(notification);
          return;
        }
      }

      // Add to queue
      this.notificationQueue.push(notification);
      this.performanceMetrics.queueSize = this.notificationQueue.length;
      this.performanceMetrics.lastUpdated = new Date();

      this.emit('notificationQueued', notification);

      // Process immediately if batching is disabled
      if (!this.optimizationConfig.enableBatching) {
        await this.processNotification(notification);
      }

    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Queue multiple notifications for batch processing
   */
  public async queueBatchNotifications(notifications: NotificationData[]): Promise<void> {
    try {
      for (const notification of notifications) {
        await this.queueNotification(notification);
      }
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Create notification group
   */
  public createNotificationGroup(
    category: string,
    maxNotifications: number = 5,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): string {
    const groupId = `group_${category}_${Date.now()}`;
    const group: NotificationGroup = {
      id: groupId,
      category,
      notifications: [],
      maxNotifications,
      collapseKey: category,
      priority,
    };

    this.notificationGroups.set(groupId, group);
    this.emit('groupCreated', group);

    return groupId;
  }

  /**
   * Add notification to group
   */
  public async addToGroup(groupId: string, notification: NotificationData): Promise<void> {
    const group = this.notificationGroups.get(groupId);
    if (!group) {
      throw new Error(`Group ${groupId} not found`);
    }

    if (group.notifications.length >= group.maxNotifications) {
      // Group is full, deliver it
      await this.deliverGroup(groupId);
    }

    group.notifications.push(notification);
    this.emit('notificationAddedToGroup', { groupId, notification });

    // If this is the first notification in the group, set delivery time
    if (group.notifications.length === 1) {
      group.deliveryTime = new Date(Date.now() + this.optimizationConfig.batchDelay);
    }
  }

  /**
   * Deliver notification group
   */
  private async deliverGroup(groupId: string): Promise<void> {
    const group = this.notificationGroups.get(groupId);
    if (!group || group.notifications.length === 0) {
      return;
    }

    try {
      // Create grouped notification
      const groupedNotification = this.createGroupedNotification(group);
      
      // Send the grouped notification
      await timePushNotifications.sendLocalNotification(groupedNotification);
      
      // Track metrics
      this.trackGroupDelivery(group);
      
      // Clear the group
      this.notificationGroups.delete(groupId);
      
      this.emit('groupDelivered', { groupId, notificationCount: group.notifications.length });

    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Create grouped notification from group
   */
  private createGroupedNotification(group: NotificationGroup): NotificationData {
    const notificationCount = group.notifications.length;
    const firstNotification = group.notifications[0];
    
    let title: string;
    let body: string;

    switch (group.category) {
      case 'like':
        title = notificationCount === 1 
          ? 'New like' 
          : `${notificationCount} new likes`;
        body = notificationCount === 1 
          ? firstNotification.body 
          : `You have ${notificationCount} new likes`;
        break;
      case 'follow':
        title = notificationCount === 1 
          ? 'New follower' 
          : `${notificationCount} new followers`;
        body = notificationCount === 1 
          ? firstNotification.body 
          : `You have ${notificationCount} new followers`;
        break;
      case 'mention':
        title = notificationCount === 1 
          ? 'New mention' 
          : `${notificationCount} new mentions`;
        body = notificationCount === 1 
          ? firstNotification.body 
          : `You were mentioned ${notificationCount} times`;
        break;
      default:
        title = `${notificationCount} new notifications`;
        body = `You have ${notificationCount} new ${group.category} notifications`;
    }

    return {
      id: `grouped_${group.id}`,
      title,
      body,
      category: group.category,
      data: {
        groupId: group.id,
        notificationCount: notificationCount.toString(),
        originalNotifications: JSON.stringify(group.notifications.map(n => n.id)),
      },
      customData: {
        isGrouped: 'true',
        groupCategory: group.category,
        groupSize: notificationCount.toString(),
      },
    };
  }

  /**
   * Start processing queue
   */
  private startProcessing(): void {
    if (this.processingInterval) {
      return;
    }

    this.processingInterval = setInterval(async () => {
      await this.processQueue();
    }, 1000); // Process every second
  }

  /**
   * Process notification queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.notificationQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      if (this.optimizationConfig.enableBatching) {
        await this.processBatch();
      } else {
        await this.processIndividual();
      }

      this.updatePerformanceMetrics();

    } catch (error) {
      this.emit('error', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process notifications in batch
   */
  private async processBatch(): Promise<void> {
    const batchSize = Math.min(this.optimizationConfig.batchSize, this.notificationQueue.length);
    const batch = this.notificationQueue.splice(0, batchSize);

    if (batch.length === 0) {
      return;
    }

    try {
      // Send batch notifications
      await timePushNotifications.sendPushNotification({
        id: `batch_${Date.now()}`,
        title: `${batch.length} new notifications`,
        body: `You have ${batch.length} new notifications`,
        category: 'batch',
        data: {
          batchSize: batch.length.toString(),
          notifications: JSON.stringify(batch.map(n => n.id)),
        },
        customData: {
          isBatch: 'true',
          batchSize: batch.length.toString(),
        },
      });

      this.emit('batchProcessed', { batchSize: batch.length });

    } catch (error) {
      // If batch fails, process individually
      for (const notification of batch) {
        try {
          await this.processNotification(notification);
        } catch (individualError) {
          console.error('Failed to process individual notification:', individualError);
        }
      }
    }
  }

  /**
   * Process notifications individually
   */
  private async processIndividual(): Promise<void> {
    const notification = this.notificationQueue.shift();
    if (!notification) {
      return;
    }

    await this.processNotification(notification);
  }

  /**
   * Process single notification
   */
  private async processNotification(notification: NotificationData): Promise<void> {
    const startTime = Date.now();

    try {
      await timePushNotifications.sendLocalNotification(notification);
      
      const deliveryTime = Date.now() - startTime;
      this.trackNotificationDelivery(notification, deliveryTime, true);
      
      this.emit('notificationProcessed', notification);

    } catch (error) {
      this.trackNotificationDelivery(notification, 0, false);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(notification: NotificationData): boolean {
    const now = Date.now();
    const minute = Math.floor(now / 60000);
    const hour = Math.floor(now / 3600000);
    
    const minuteKey = `minute_${minute}`;
    const hourKey = `hour_${hour}`;

    // Check minute limit
    const minuteCount = this.rateLimiter.get(minuteKey) || 0;
    if (minuteCount >= this.optimizationConfig.maxNotificationsPerMinute) {
      return false;
    }

    // Check hour limit
    const hourCount = this.rateLimiter.get(hourKey) || 0;
    if (hourCount >= this.optimizationConfig.maxNotificationsPerHour) {
      return false;
    }

    // Update counters
    this.rateLimiter.set(minuteKey, minuteCount + 1);
    this.rateLimiter.set(hourKey, hourCount + 1);

    // Clean up old entries
    this.cleanupRateLimiter();

    return true;
  }

  /**
   * Clean up old rate limiter entries
   */
  private cleanupRateLimiter(): void {
    const now = Date.now();
    const cutoff = now - 3600000; // 1 hour ago

    for (const [key, timestamp] of this.rateLimiter.entries()) {
      if (timestamp < cutoff) {
        this.rateLimiter.delete(key);
      }
    }
  }

  /**
   * Check if current time is within quiet hours
   */
  private isQuietHours(): boolean {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      timeZone: this.optimizationConfig.quietHours.timezone 
    });
    
    const start = this.optimizationConfig.quietHours.start;
    const end = this.optimizationConfig.quietHours.end;

    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    } else {
      return currentTime >= start && currentTime <= end;
    }
  }

  /**
   * Schedule notification for later delivery
   */
  private scheduleForLater(notification: NotificationData): void {
    // This would implement delayed delivery
    // For now, just add to queue with a delay
    setTimeout(() => {
      this.notificationQueue.push(notification);
    }, this.optimizationConfig.batchDelay);
  }

  /**
   * Track notification delivery metrics
   */
  private trackNotificationDelivery(
    notification: NotificationData, 
    deliveryTime: number, 
    success: boolean
  ): void {
    // Update performance metrics
    this.performanceMetrics.averageDeliveryTime = 
      (this.performanceMetrics.averageDeliveryTime + deliveryTime) / 2;
    
    if (success) {
      this.performanceMetrics.successRate = 
        (this.performanceMetrics.successRate + 100) / 2;
    } else {
      this.performanceMetrics.errorRate = 
        (this.performanceMetrics.errorRate + 100) / 2;
    }

    this.performanceMetrics.lastUpdated = new Date();
  }

  /**
   * Track group delivery metrics
   */
  private trackGroupDelivery(group: NotificationGroup): void {
    // Track metrics for grouped notifications
    this.performanceMetrics.processingRate = 
      (this.performanceMetrics.processingRate + group.notifications.length) / 2;
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(): void {
    this.performanceMetrics.queueSize = this.notificationQueue.length;
    this.performanceMetrics.memoryUsage = process.memoryUsage().heapUsed;
    this.performanceMetrics.cpuUsage = process.cpuUsage().user / 1000000; // Convert to percentage
    this.performanceMetrics.lastUpdated = new Date();
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Get user engagement metrics
   */
  public getUserMetrics(userId: string): UserEngagementMetrics | null {
    return this.userMetrics.get(userId) || null;
  }

  /**
   * Get queue status
   */
  public getQueueStatus(): {
    queueSize: number;
    groupCount: number;
    isProcessing: boolean;
  } {
    return {
      queueSize: this.notificationQueue.length,
      groupCount: this.notificationGroups.size,
      isProcessing: this.isProcessing,
    };
  }

  /**
   * Clear queue
   */
  public clearQueue(): void {
    this.notificationQueue = [];
    this.notificationGroups.clear();
    this.performanceMetrics.queueSize = 0;
    this.emit('queueCleared');
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }

    this.clearQueue();
    this.removeAllListeners();
  }
}

// Export singleton instance
export const notificationOptimizer = NotificationOptimizer.getInstance();

// Export default
export default notificationOptimizer;