/**
 * TimeNotificationService - gRPC Client for Time Push Notifications
 * 
 * This module provides a TypeScript gRPC client for communicating with the
 * time-server notification service. It handles all server communication
 * for push notifications, device management, and analytics.
 */

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { promisify } from 'util';
import { EventEmitter } from 'events';

// Load proto file
const PROTO_PATH = require.resolve('./time_notification_service.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the service definition
const timeNotificationProto = grpc.loadPackageDefinition(packageDefinition).time.notification;

// Type definitions
export interface DeviceRegistrationRequest {
  userId: string;
  deviceToken: string;
  platform: string;
  appVersion: string;
  osVersion: string;
  deviceModel: string;
  timezone: string;
  language: string;
  deviceCapabilities?: Record<string, string>;
  registeredAt?: {
    seconds: number;
    nanos: number;
  };
}

export interface DeviceRegistrationResponse {
  success: boolean;
  deviceId: string;
  message: string;
}

export interface DeviceUpdateRequest {
  userId: string;
  deviceToken: string;
  platform: string;
  updatedAt?: {
    seconds: number;
    nanos: number;
  };
}

export interface DeviceUpdateResponse {
  success: boolean;
  message: string;
}

export interface DeviceUnregistrationRequest {
  userId: string;
  deviceId: string;
}

export interface DeviceUnregistrationResponse {
  success: boolean;
  message: string;
}

export interface NotificationAcknowledgmentRequest {
  notificationId: string;
  userId: string;
  action: string;
  timestamp: number;
  metadata?: Record<string, string>;
}

export interface NotificationAcknowledgmentResponse {
  success: boolean;
  message: string;
}

export interface NotificationPreferencesRequest {
  userId: string;
  preferences: Record<string, NotificationPreference>;
  updatedAt: {
    seconds: number;
    nanos: number;
  };
}

export interface NotificationPreference {
  enabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  frequency: string;
  customSettings?: Record<string, string>;
}

export interface NotificationPreferencesResponse {
  success: boolean;
  message: string;
}

export interface SendPushNotificationRequest {
  userId: string;
  title: string;
  body: string;
  category: string;
  data: Record<string, string>;
  imageUrl: string;
  sound: string;
  badgeCount: number;
  scheduledAt?: {
    seconds: number;
    nanos: number;
  };
  customData: Record<string, string>;
}

export interface SendPushNotificationResponse {
  success: boolean;
  messageId: string;
  message: string;
}

export interface SendBatchPushNotificationRequest {
  notifications: SendPushNotificationRequest[];
  useBatching: boolean;
  batchSize: number;
}

export interface SendBatchPushNotificationResponse {
  success: boolean;
  messageIds: string[];
  successCount: number;
  failureCount: number;
  message: string;
}

export interface NotificationStatsRequest {
  userId: string;
  startDate?: {
    seconds: number;
    nanos: number;
  };
  endDate?: {
    seconds: number;
    nanos: number;
  };
  eventType?: string;
}

export interface NotificationStatsResponse {
  success: boolean;
  stats: Record<string, number>;
  deliveryRate: number;
  openRate: number;
  dismissalRate: number;
  lastUpdated: {
    seconds: number;
    nanos: number;
  };
}

export interface DeviceInfoRequest {
  userId: string;
}

export interface DeviceInfoResponse {
  success: boolean;
  devices: DeviceInfo[];
}

export interface DeviceInfo {
  deviceId: string;
  platform: string;
  appVersion: string;
  osVersion: string;
  deviceModel: string;
  isActive: boolean;
  lastSeen: {
    seconds: number;
    nanos: number;
  };
  registeredAt: {
    seconds: number;
    nanos: number;
  };
}

export interface HealthCheckRequest {
  service: string;
}

export interface HealthCheckResponse {
  healthy: boolean;
  status: string;
  details: Record<string, string>;
  timestamp: {
    seconds: number;
    nanos: number;
  };
}

export interface NotificationUpdate {
  type: string;
  userId: string;
  data: Record<string, string>;
  timestamp: {
    seconds: number;
    nanos: number;
  };
}

// Main gRPC client class
export class TimeNotificationServiceClient extends EventEmitter {
  private client: any;
  private channel: grpc.Channel;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  constructor(
    address: string,
    options: grpc.ChannelOptions = {},
    credentials?: grpc.ChannelCredentials
  ) {
    super();

    // Create channel
    this.channel = new grpc.Channel(
      address,
      credentials || grpc.credentials.createInsecure(),
      {
        'grpc.keepalive_time_ms': 30000,
        'grpc.keepalive_timeout_ms': 5000,
        'grpc.keepalive_permit_without_calls': true,
        'grpc.http2.max_pings_without_data': 0,
        'grpc.http2.min_time_between_pings_ms': 10000,
        'grpc.http2.min_ping_interval_without_data_ms': 300000,
        ...options,
      }
    );

    // Create client
    this.client = new timeNotificationProto.TimeNotificationService(
      address,
      credentials || grpc.credentials.createInsecure(),
      options
    );

    // Set up connection monitoring
    this.setupConnectionMonitoring();
  }

  /**
   * Register device for push notifications
   */
  public async registerDevice(request: DeviceRegistrationRequest): Promise<DeviceRegistrationResponse> {
    return this.callUnaryMethod('registerDevice', request);
  }

  /**
   * Update device information
   */
  public async updateDevice(request: DeviceUpdateRequest): Promise<DeviceUpdateResponse> {
    return this.callUnaryMethod('updateDevice', request);
  }

  /**
   * Unregister device
   */
  public async unregisterDevice(request: DeviceUnregistrationRequest): Promise<DeviceUnregistrationResponse> {
    return this.callUnaryMethod('unregisterDevice', request);
  }

  /**
   * Get device information
   */
  public async getDeviceInfo(request: DeviceInfoRequest): Promise<DeviceInfoResponse> {
    return this.callUnaryMethod('getDeviceInfo', request);
  }

  /**
   * Send push notification
   */
  public async sendPushNotification(request: SendPushNotificationRequest): Promise<SendPushNotificationResponse> {
    return this.callUnaryMethod('sendPushNotification', request);
  }

  /**
   * Send batch push notifications
   */
  public async sendBatchPushNotification(request: SendBatchPushNotificationRequest): Promise<SendBatchPushNotificationResponse> {
    return this.callUnaryMethod('sendBatchPushNotification', request);
  }

  /**
   * Acknowledge notification
   */
  public async acknowledgeNotification(request: NotificationAcknowledgmentRequest): Promise<NotificationAcknowledgmentResponse> {
    return this.callUnaryMethod('acknowledgeNotification', request);
  }

  /**
   * Sync notification preferences
   */
  public async syncNotificationPreferences(request: NotificationPreferencesRequest): Promise<NotificationPreferencesResponse> {
    return this.callUnaryMethod('syncNotificationPreferences', request);
  }

  /**
   * Get notification statistics
   */
  public async getNotificationStats(request: NotificationStatsRequest): Promise<NotificationStatsResponse> {
    return this.callUnaryMethod('getNotificationStats', request);
  }

  /**
   * Health check
   */
  public async healthCheck(request: HealthCheckRequest): Promise<HealthCheckResponse> {
    return this.callUnaryMethod('healthCheck', request);
  }

  /**
   * Stream notification updates
   */
  public streamNotificationUpdates(): grpc.ClientReadableStream<NotificationUpdate> {
    const call = this.client.streamNotificationUpdates({});
    
    call.on('data', (update: NotificationUpdate) => {
      this.emit('notificationUpdate', update);
    });

    call.on('error', (error: Error) => {
      this.emit('error', error);
    });

    call.on('end', () => {
      this.emit('streamEnd');
    });

    return call;
  }

  /**
   * Close the connection
   */
  public close(): void {
    this.channel.close();
    this.isConnected = false;
    this.emit('closed');
  }

  /**
   * Check if connected
   */
  public isHealthy(): boolean {
    return this.isConnected;
  }

  /**
   * Get connection state
   */
  public getConnectionState(): grpc.ConnectivityState {
    return this.channel.getConnectivityState(false);
  }

  /**
   * Wait for connection
   */
  public async waitForReady(deadline: Date): Promise<void> {
    return new Promise((resolve, reject) => {
      this.channel.watchConnectivityState(
        this.channel.getConnectivityState(false),
        deadline,
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }

  /**
   * Call unary gRPC method
   */
  private async callUnaryMethod(methodName: string, request: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const method = this.client[methodName];
      if (!method) {
        reject(new Error(`Method ${methodName} not found`));
        return;
      }

      method.call(this.client, request, (error: any, response: any) => {
        if (error) {
          this.handleError(error);
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Set up connection monitoring
   */
  private setupConnectionMonitoring(): void {
    // Monitor connection state
    const checkConnection = () => {
      const state = this.channel.getConnectivityState(false);
      
      if (state === grpc.ConnectivityState.READY) {
        if (!this.isConnected) {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connected');
        }
      } else if (state === grpc.ConnectivityState.TRANSIENT_FAILURE || 
                 state === grpc.ConnectivityState.SHUTDOWN) {
        if (this.isConnected) {
          this.isConnected = false;
          this.emit('disconnected');
          this.attemptReconnect();
        }
      }
    };

    // Check connection every 5 seconds
    setInterval(checkConnection, 5000);
    
    // Initial check
    checkConnection();
  }

  /**
   * Attempt to reconnect
   */
  private async attemptReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('reconnectFailed');
      return;
    }

    this.reconnectAttempts++;
    this.emit('reconnecting', { attempt: this.reconnectAttempts });

    // Wait before attempting reconnection
    await new Promise(resolve => setTimeout(resolve, this.reconnectDelay * this.reconnectAttempts));

    try {
      // Try to reconnect by making a simple call
      await this.healthCheck({ service: 'notification' });
    } catch (error) {
      // If reconnection fails, try again
      this.attemptReconnect();
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: any): void {
    this.emit('error', error);
    
    // Log error details
    console.error('gRPC Error:', {
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }
}

// Export the client class
export default TimeNotificationServiceClient;