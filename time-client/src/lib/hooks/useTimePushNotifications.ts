/**
 * useTimePushNotifications - React Hook for Time Push Notifications
 * 
 * This hook provides a convenient way to integrate the Time push notification
 * system into React Native components. It handles initialization, device
 * registration, and event management.
 */

import { useEffect, useCallback, useState, useRef } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import { timePushNotifications, TimePushNotificationsConfig, DeviceInfo, NotificationData } from '../notifications/TimePushNotifications';

export interface UseTimePushNotificationsOptions {
  config: TimePushNotificationsConfig;
  userId?: string;
  deviceInfo?: DeviceInfo;
  autoRegister?: boolean;
  enableBackgroundProcessing?: boolean;
  enableAnalytics?: boolean;
}

export interface UseTimePushNotificationsReturn {
  // State
  isInitialized: boolean;
  isRegistered: boolean;
  deviceToken: string | null;
  currentUserId: string | null;
  badgeCount: number;
  
  // Methods
  initialize: () => Promise<void>;
  registerDevice: (userId: string, deviceInfo?: DeviceInfo) => Promise<void>;
  unregisterDevice: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  sendNotification: (notification: NotificationData) => Promise<void>;
  sendTestNotification: (title: string, body: string) => Promise<void>;
  updateBadgeCount: (count: number) => Promise<void>;
  clearBadge: () => Promise<void>;
  acknowledgeNotification: (notificationId: string, action: string) => Promise<void>;
  
  // Event handlers
  onNotificationReceived: (callback: (data: any) => void) => void;
  onNotificationOpened: (callback: (data: any) => void) => void;
  onNotificationDismissed: (callback: (data: any) => void) => void;
  onTokenUpdated: (callback: (data: any) => void) => void;
  onPermissionChanged: (callback: (data: any) => void) => void;
  onBadgeCountChanged: (callback: (data: any) => void) => void;
  onNotificationActionPerformed: (callback: (data: any) => void) => void;
  
  // Cleanup
  cleanup: () => void;
}

export function useTimePushNotifications(options: UseTimePushNotificationsOptions): UseTimePushNotificationsReturn {
  const {
    config,
    userId,
    deviceInfo,
    autoRegister = true,
    enableBackgroundProcessing = true,
    enableAnalytics = true,
  } = options;

  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [badgeCount, setBadgeCount] = useState(0);

  // Refs for cleanup
  const eventListeners = useRef<Array<() => void>>([]);
  const appStateSubscription = useRef<any>(null);

  // Initialize push notifications
  const initialize = useCallback(async () => {
    try {
      await timePushNotifications.initialize(config);
      setIsInitialized(true);
      
      // Get initial badge count
      const count = await timePushNotifications.getBadgeCount();
      setBadgeCount(count);
      
      // Auto-register if userId is provided
      if (autoRegister && userId) {
        await registerDevice(userId, deviceInfo);
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      throw error;
    }
  }, [config, autoRegister, userId, deviceInfo]);

  // Register device
  const registerDevice = useCallback(async (userId: string, deviceInfo?: DeviceInfo) => {
    try {
      const defaultDeviceInfo: DeviceInfo = {
        appVersion: '1.0.0', // This should come from app config
        osVersion: Platform.Version.toString(),
        deviceModel: Platform.select({
          ios: 'iPhone', // This should be more specific
          android: 'Android Device',
          default: 'Unknown',
        }),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: Intl.DateTimeFormat().resolvedOptions().locale,
        ...deviceInfo,
      };

      await timePushNotifications.registerDevice(userId, defaultDeviceInfo);
      setCurrentUserId(userId);
      setIsRegistered(true);
    } catch (error) {
      console.error('Failed to register device:', error);
      throw error;
    }
  }, []);

  // Unregister device
  const unregisterDevice = useCallback(async () => {
    try {
      // Note: This would need to be implemented in the native module
      // await timePushNotifications.unregisterDevice();
      setIsRegistered(false);
      setCurrentUserId(null);
    } catch (error) {
      console.error('Failed to unregister device:', error);
      throw error;
    }
  }, []);

  // Request permissions
  const requestPermissions = useCallback(async () => {
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
      return granted;
    } catch (error) {
      console.error('Failed to request permissions:', error);
      throw error;
    }
  }, []);

  // Send notification
  const sendNotification = useCallback(async (notification: NotificationData) => {
    try {
      await timePushNotifications.sendLocalNotification(notification);
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }, []);

  // Send test notification
  const sendTestNotification = useCallback(async (title: string, body: string) => {
    try {
      await timePushNotifications.sendTestNotification(title, body);
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  }, []);

  // Update badge count
  const updateBadgeCount = useCallback(async (count: number) => {
    try {
      await timePushNotifications.updateBadgeCount(count);
      setBadgeCount(count);
    } catch (error) {
      console.error('Failed to update badge count:', error);
      throw error;
    }
  }, []);

  // Clear badge
  const clearBadge = useCallback(async () => {
    try {
      await timePushNotifications.clearBadge();
      setBadgeCount(0);
    } catch (error) {
      console.error('Failed to clear badge:', error);
      throw error;
    }
  }, []);

  // Acknowledge notification
  const acknowledgeNotification = useCallback(async (notificationId: string, action: string) => {
    try {
      await timePushNotifications.acknowledgeNotification(notificationId, action);
    } catch (error) {
      console.error('Failed to acknowledge notification:', error);
      throw error;
    }
  }, []);

  // Event handler setup
  const onNotificationReceived = useCallback((callback: (data: any) => void) => {
    const listener = (data: any) => {
      if (enableAnalytics) {
        // Track notification received
        console.log('Notification received:', data);
      }
      callback(data);
    };
    
    timePushNotifications.on('notificationReceived', listener);
    
    const cleanup = () => {
      timePushNotifications.off('notificationReceived', listener);
    };
    
    eventListeners.current.push(cleanup);
  }, [enableAnalytics]);

  const onNotificationOpened = useCallback((callback: (data: any) => void) => {
    const listener = (data: any) => {
      if (enableAnalytics) {
        // Track notification opened
        console.log('Notification opened:', data);
      }
      callback(data);
    };
    
    timePushNotifications.on('notificationOpened', listener);
    
    const cleanup = () => {
      timePushNotifications.off('notificationOpened', listener);
    };
    
    eventListeners.current.push(cleanup);
  }, [enableAnalytics]);

  const onNotificationDismissed = useCallback((callback: (data: any) => void) => {
    const listener = (data: any) => {
      if (enableAnalytics) {
        // Track notification dismissed
        console.log('Notification dismissed:', data);
      }
      callback(data);
    };
    
    timePushNotifications.on('notificationDismissed', listener);
    
    const cleanup = () => {
      timePushNotifications.off('notificationDismissed', listener);
    };
    
    eventListeners.current.push(cleanup);
  }, [enableAnalytics]);

  const onTokenUpdated = useCallback((callback: (data: any) => void) => {
    const listener = (data: any) => {
      setDeviceToken(data.token);
      callback(data);
    };
    
    timePushNotifications.on('tokenUpdated', listener);
    
    const cleanup = () => {
      timePushNotifications.off('tokenUpdated', listener);
    };
    
    eventListeners.current.push(cleanup);
  }, []);

  const onPermissionChanged = useCallback((callback: (data: any) => void) => {
    const listener = (data: any) => {
      callback(data);
    };
    
    timePushNotifications.on('permissionChanged', listener);
    
    const cleanup = () => {
      timePushNotifications.off('permissionChanged', listener);
    };
    
    eventListeners.current.push(cleanup);
  }, []);

  const onBadgeCountChanged = useCallback((callback: (data: any) => void) => {
    const listener = (data: any) => {
      setBadgeCount(data.count);
      callback(data);
    };
    
    timePushNotifications.on('badgeCountChanged', listener);
    
    const cleanup = () => {
      timePushNotifications.off('badgeCountChanged', listener);
    };
    
    eventListeners.current.push(cleanup);
  }, []);

  const onNotificationActionPerformed = useCallback((callback: (data: any) => void) => {
    const listener = (data: any) => {
      if (enableAnalytics) {
        // Track notification action
        console.log('Notification action performed:', data);
      }
      callback(data);
    };
    
    timePushNotifications.on('notificationActionPerformed', listener);
    
    const cleanup = () => {
      timePushNotifications.off('notificationActionPerformed', listener);
    };
    
    eventListeners.current.push(cleanup);
  }, [enableAnalytics]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Remove all event listeners
    eventListeners.current.forEach(cleanup => cleanup());
    eventListeners.current = [];
    
    // Remove app state listener
    if (appStateSubscription.current) {
      appStateSubscription.current.remove();
      appStateSubscription.current = null;
    }
    
    // Cleanup push notifications
    timePushNotifications.cleanup();
  }, []);

  // Set up app state monitoring for background processing
  useEffect(() => {
    if (enableBackgroundProcessing) {
      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          // App became active, refresh badge count
          timePushNotifications.getBadgeCount()
            .then(count => setBadgeCount(count))
            .catch(error => console.error('Failed to get badge count:', error));
        }
      };

      appStateSubscription.current = AppState.addEventListener('change', handleAppStateChange);
    }

    return () => {
      if (appStateSubscription.current) {
        appStateSubscription.current.remove();
      }
    };
  }, [enableBackgroundProcessing]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Initialize on mount if auto-initialize is enabled
  useEffect(() => {
    if (autoRegister && config) {
      initialize().catch(error => {
        console.error('Auto-initialization failed:', error);
      });
    }
  }, [autoRegister, config, initialize]);

  return {
    // State
    isInitialized,
    isRegistered,
    deviceToken,
    currentUserId,
    badgeCount,
    
    // Methods
    initialize,
    registerDevice,
    unregisterDevice,
    requestPermissions,
    sendNotification,
    sendTestNotification,
    updateBadgeCount,
    clearBadge,
    acknowledgeNotification,
    
    // Event handlers
    onNotificationReceived,
    onNotificationOpened,
    onNotificationDismissed,
    onTokenUpdated,
    onPermissionChanged,
    onBadgeCountChanged,
    onNotificationActionPerformed,
    
    // Cleanup
    cleanup,
  };
}

// Export the hook
export default useTimePushNotifications;