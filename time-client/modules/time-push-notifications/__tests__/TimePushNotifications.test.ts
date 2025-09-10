/**
 * TimePushNotifications Tests
 * 
 * Comprehensive test suite for the Time push notification system
 */

import { timePushNotifications, TimePushNotificationsConfig } from '../src/TimePushNotifications';
import { notificationMigration } from '../src/NotificationMigration';

// Mock React Native modules
jest.mock('react-native', () => ({
  NativeModules: {
    TimePushNotifications: {
      initialize: jest.fn(),
      registerDevice: jest.fn(),
      requestPermissions: jest.fn(),
      sendLocalNotification: jest.fn(),
      updateBadgeCount: jest.fn(),
      clearBadge: jest.fn(),
      getBadgeCount: jest.fn(),
      acknowledgeNotification: jest.fn(),
      sendTestNotification: jest.fn(),
      getDebugInfo: jest.fn(),
    },
  },
  NativeEventEmitter: jest.fn(() => ({
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
  })),
  Platform: {
    OS: 'ios',
    Version: '15.0',
    select: jest.fn((obj) => obj.ios),
  },
}));

// Mock gRPC client
jest.mock('../src/grpc/TimeNotificationService', () => ({
  TimeNotificationServiceClient: jest.fn().mockImplementation(() => ({
    registerDevice: jest.fn(),
    updateDevice: jest.fn(),
    unregisterDevice: jest.fn(),
    sendPushNotification: jest.fn(),
    acknowledgeNotification: jest.fn(),
    syncNotificationPreferences: jest.fn(),
    getNotificationStats: jest.fn(),
    healthCheck: jest.fn(),
    close: jest.fn(),
  })),
}));

describe('TimePushNotifications', () => {
  const mockConfig: TimePushNotificationsConfig = {
    server: {
      host: 'localhost',
      port: 50051,
      useSSL: false,
    },
    fcm: {
      autoInitEnabled: true,
      projectId: 'test-project',
    },
  };

  const mockDeviceInfo = {
    appVersion: '1.0.0',
    osVersion: '15.0',
    deviceModel: 'iPhone',
    timezone: 'UTC',
    language: 'en',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.initialize.mockResolvedValue({ success: true });

      await timePushNotifications.initialize(mockConfig);

      expect(NativeModules.TimePushNotifications.initialize).toHaveBeenCalledWith(mockConfig);
    });

    it('should handle initialization failure', async () => {
      const { NativeModules } = require('react-native');
      const error = new Error('Initialization failed');
      NativeModules.TimePushNotifications.initialize.mockRejectedValue(error);

      await expect(timePushNotifications.initialize(mockConfig)).rejects.toThrow('Initialization failed');
    });
  });

  describe('Device Registration', () => {
    it('should register device successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.registerDevice.mockResolvedValue({ success: true });

      await timePushNotifications.registerDevice('user123', mockDeviceInfo);

      expect(NativeModules.TimePushNotifications.registerDevice).toHaveBeenCalledWith('user123', mockDeviceInfo);
    });

    it('should handle registration failure', async () => {
      const { NativeModules } = require('react-native');
      const error = new Error('Registration failed');
      NativeModules.TimePushNotifications.registerDevice.mockRejectedValue(error);

      await expect(timePushNotifications.registerDevice('user123', mockDeviceInfo)).rejects.toThrow('Registration failed');
    });
  });

  describe('Permissions', () => {
    it('should request permissions successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.requestPermissions.mockResolvedValue({ granted: true });

      const result = await timePushNotifications.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      });

      expect(result).toBe(true);
      expect(NativeModules.TimePushNotifications.requestPermissions).toHaveBeenCalledWith({
        alert: true,
        badge: true,
        sound: true,
      });
    });

    it('should handle permission denial', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.requestPermissions.mockResolvedValue({ granted: false });

      const result = await timePushNotifications.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      });

      expect(result).toBe(false);
    });
  });

  describe('Notifications', () => {
    it('should send local notification successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.sendLocalNotification.mockResolvedValue({ success: true });

      const notificationData = {
        id: 'test-notification',
        title: 'Test Title',
        body: 'Test Body',
        category: 'test',
      };

      await timePushNotifications.sendLocalNotification(notificationData);

      expect(NativeModules.TimePushNotifications.sendLocalNotification).toHaveBeenCalledWith(notificationData);
    });

    it('should send test notification successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.sendTestNotification.mockResolvedValue({ success: true });

      await timePushNotifications.sendTestNotification('Test Title', 'Test Body');

      expect(NativeModules.TimePushNotifications.sendTestNotification).toHaveBeenCalledWith('Test Title', 'Test Body');
    });
  });

  describe('Badge Management', () => {
    it('should update badge count successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.updateBadgeCount.mockResolvedValue({ success: true });

      await timePushNotifications.updateBadgeCount(5);

      expect(NativeModules.TimePushNotifications.updateBadgeCount).toHaveBeenCalledWith(5);
    });

    it('should clear badge successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.updateBadgeCount.mockResolvedValue({ success: true });

      await timePushNotifications.clearBadge();

      expect(NativeModules.TimePushNotifications.updateBadgeCount).toHaveBeenCalledWith(0);
    });

    it('should get badge count successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.getBadgeCount.mockResolvedValue({ count: 3 });

      const count = await timePushNotifications.getBadgeCount();

      expect(count).toBe(3);
      expect(NativeModules.TimePushNotifications.getBadgeCount).toHaveBeenCalled();
    });
  });

  describe('Notification Acknowledgment', () => {
    it('should acknowledge notification successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.acknowledgeNotification.mockResolvedValue({ success: true });

      await timePushNotifications.acknowledgeNotification('notification123', 'opened');

      expect(NativeModules.TimePushNotifications.acknowledgeNotification).toHaveBeenCalledWith('notification123', 'opened');
    });
  });

  describe('Debug Information', () => {
    it('should get debug info successfully', async () => {
      const { NativeModules } = require('react-native');
      const mockDebugInfo = {
        isInitialized: true,
        deviceToken: 'test-token',
        currentUserId: 'user123',
        notificationStats: {},
        debugLoggingEnabled: false,
      };
      NativeModules.TimePushNotifications.getDebugInfo.mockResolvedValue(mockDebugInfo);

      const debugInfo = await timePushNotifications.getDebugInfo();

      expect(debugInfo).toEqual(mockDebugInfo);
      expect(NativeModules.TimePushNotifications.getDebugInfo).toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    it('should emit events correctly', () => {
      const mockCallback = jest.fn();
      timePushNotifications.on('notificationReceived', mockCallback);

      // Simulate event emission
      timePushNotifications.emit('notificationReceived', { test: 'data' });

      expect(mockCallback).toHaveBeenCalledWith({ test: 'data' });
    });

    it('should remove event listeners correctly', () => {
      const mockCallback = jest.fn();
      timePushNotifications.on('notificationReceived', mockCallback);
      timePushNotifications.off('notificationReceived', mockCallback);

      // Simulate event emission
      timePushNotifications.emit('notificationReceived', { test: 'data' });

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    it('should return correct state', () => {
      const state = timePushNotifications.getState();

      expect(state).toHaveProperty('isInitialized');
      expect(state).toHaveProperty('currentUserId');
      expect(state).toHaveProperty('deviceToken');
    });
  });

  describe('Cleanup', () => {
    it('should cleanup resources correctly', () => {
      const removeAllListenersSpy = jest.spyOn(timePushNotifications, 'removeAllListeners');
      
      timePushNotifications.cleanup();

      expect(removeAllListenersSpy).toHaveBeenCalled();
    });
  });
});

describe('NotificationMigration', () => {
  describe('Expo Compatibility', () => {
    it('should convert Expo notification to Time notification', () => {
      const expoNotification = {
        identifier: 'test-id',
        content: {
          title: 'Test Title',
          body: 'Test Body',
          data: { test: 'data' },
          sound: 'default',
          badge: 1,
          categoryIdentifier: 'test-category',
        },
        trigger: {
          type: 'push' as const,
        },
      };

      const timeNotification = notificationMigration.convertExpoNotificationToTime(expoNotification);

      expect(timeNotification).toEqual({
        id: 'test-id',
        title: 'Test Title',
        body: 'Test Body',
        data: { test: 'data' },
        sound: 'default',
        badge: 1,
        category: 'test-category',
        customData: {},
      });
    });

    it('should convert Time notification to Expo notification', () => {
      const timeNotification = {
        id: 'test-id',
        title: 'Test Title',
        body: 'Test Body',
        data: { test: 'data' },
        sound: 'default',
        badge: 1,
        category: 'test-category',
        customData: { custom: 'data' },
      };

      const expoNotification = notificationMigration.convertTimeNotificationToExpo(timeNotification);

      expect(expoNotification).toEqual({
        identifier: 'test-id',
        content: {
          title: 'Test Title',
          body: 'Test Body',
          data: { test: 'data' },
          sound: 'default',
          badge: 1,
          categoryIdentifier: 'test-category',
          userInfo: { custom: 'data' },
        },
        trigger: {
          type: 'push',
        },
      });
    });
  });

  describe('Event Listeners', () => {
    it('should add and remove notification received listener', () => {
      const mockListener = jest.fn();
      const subscription = notificationMigration.addNotificationReceivedListener(mockListener);

      expect(subscription).toHaveProperty('remove');
      
      subscription.remove();
      // Listener should be removed
    });

    it('should add and remove notification response listener', () => {
      const mockListener = jest.fn();
      const subscription = notificationMigration.addNotificationResponseReceivedListener(mockListener);

      expect(subscription).toHaveProperty('remove');
      
      subscription.remove();
      // Listener should be removed
    });

    it('should add and remove push token listener', () => {
      const mockListener = jest.fn();
      const subscription = notificationMigration.addPushTokenListener(mockListener);

      expect(subscription).toHaveProperty('remove');
      
      subscription.remove();
      // Listener should be removed
    });
  });

  describe('Permissions', () => {
    it('should get permissions successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.requestPermissions.mockResolvedValue({ granted: true });

      const permissions = await notificationMigration.getPermissionsAsync();

      expect(permissions.status).toBe('granted');
      expect(permissions.canAskAgain).toBe(true);
    });

    it('should request permissions successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.requestPermissions.mockResolvedValue({ granted: true });

      const permissions = await notificationMigration.requestPermissionsAsync();

      expect(permissions.status).toBe('granted');
    });
  });

  describe('Device Token', () => {
    it('should get device push token successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.getDebugInfo.mockResolvedValue({
        deviceToken: 'test-token',
      });

      const token = await notificationMigration.getDevicePushTokenAsync();

      expect(token.type).toBe('ios');
      expect(token.data).toBe('test-token');
    });
  });

  describe('Badge Management', () => {
    it('should get badge count successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.getBadgeCount.mockResolvedValue({ count: 3 });

      const count = await notificationMigration.getBadgeCountAsync();

      expect(count).toBe(3);
    });

    it('should set badge count successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.updateBadgeCount.mockResolvedValue({ success: true });

      await notificationMigration.setBadgeCountAsync(5);

      expect(NativeModules.TimePushNotifications.updateBadgeCount).toHaveBeenCalledWith(5);
    });

    it('should decrement badge count successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.getBadgeCount.mockResolvedValue({ count: 5 });
      NativeModules.TimePushNotifications.updateBadgeCount.mockResolvedValue({ success: true });

      await notificationMigration.decrementBadgeCountAsync(2);

      expect(NativeModules.TimePushNotifications.updateBadgeCount).toHaveBeenCalledWith(3);
    });

    it('should reset badge count successfully', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.TimePushNotifications.clearBadge.mockResolvedValue({ success: true });

      await notificationMigration.resetBadgeCountAsync();

      expect(NativeModules.TimePushNotifications.clearBadge).toHaveBeenCalled();
    });
  });
});