import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

// Native module interface
interface TimeGrpcModule {
  initialize(host: string, port: number, useTls: boolean): Promise<{
    status: string;
    serverTime: string;
    unixTimestamp: number;
    timezone: string;
  }>;
  
  getCurrentTime(): Promise<{
    formattedTime: string;
    unixTimestamp: number;
    timezone: string;
    isUtc: boolean;
  }>;
  
  getTimeWithTimezone(timezone: string): Promise<{
    formattedTime: string;
    unixTimestamp: number;
    timezone: string;
    isUtc: boolean;
  }>;
  
  getTimeStats(): Promise<{
    serverVersion: string;
    uptimeSeconds: number;
    totalRequests: number;
    averageResponseTimeMs: number;
  }>;
  
  startTimeStream(): void;
  stopTimeStream(): void;
  
  getConnectionStatus(): Promise<{
    status: string;
    connected: boolean;
    streaming: boolean;
  }>;
  
  shutdown(): void;
}

// Event types
interface TimeUpdateEvent {
  formattedTime: string;
  unixTimestamp: number;
  timezone: string;
  updateIntervalMs: number;
}

interface TimeStreamErrorEvent {
  error: string;
}

// Get the native module
const { TimeGrpc } = NativeModules;
const timeGrpcModule = TimeGrpc as TimeGrpcModule;

// Create event emitter
const timeGrpcEmitter = new NativeEventEmitter(TimeGrpc);

/**
 * High-level TypeScript interface for Time gRPC client
 * Provides type-safe access to native gRPC functionality
 */
export class TimeGrpcClient {
  private eventListeners: Map<string, (data: any) => void> = new Map();
  
  /**
   * Initialize gRPC client with server configuration
   */
  async initialize(host: string, port: number, useTls: boolean = false): Promise<{
    status: string;
    serverTime: string;
    unixTimestamp: number;
    timezone: string;
  }> {
    if (!timeGrpcModule) {
      throw new Error('TimeGrpc native module not available');
    }
    
    return await timeGrpcModule.initialize(host, port, useTls);
  }
  
  /**
   * Get current server time
   */
  async getCurrentTime(): Promise<{
    formattedTime: string;
    unixTimestamp: number;
    timezone: string;
    isUtc: boolean;
  }> {
    if (!timeGrpcModule) {
      throw new Error('TimeGrpc native module not available');
    }
    
    return await timeGrpcModule.getCurrentTime();
  }
  
  /**
   * Get time with specific timezone
   */
  async getTimeWithTimezone(timezone: string): Promise<{
    formattedTime: string;
    unixTimestamp: number;
    timezone: string;
    isUtc: boolean;
  }> {
    if (!timeGrpcModule) {
      throw new Error('TimeGrpc native module not available');
    }
    
    return await timeGrpcModule.getTimeWithTimezone(timezone);
  }
  
  /**
   * Get time statistics
   */
  async getTimeStats(): Promise<{
    serverVersion: string;
    uptimeSeconds: number;
    totalRequests: number;
    averageResponseTimeMs: number;
  }> {
    if (!timeGrpcModule) {
      throw new Error('TimeGrpc native module not available');
    }
    
    return await timeGrpcModule.getTimeStats();
  }
  
  /**
   * Start streaming time updates
   */
  startTimeStream(): void {
    if (!timeGrpcModule) {
      throw new Error('TimeGrpc native module not available');
    }
    
    timeGrpcModule.startTimeStream();
  }
  
  /**
   * Stop streaming time updates
   */
  stopTimeStream(): void {
    if (!timeGrpcModule) {
      throw new Error('TimeGrpc native module not available');
    }
    
    timeGrpcModule.stopTimeStream();
  }
  
  /**
   * Check connection status
   */
  async getConnectionStatus(): Promise<{
    status: string;
    connected: boolean;
    streaming: boolean;
  }> {
    if (!timeGrpcModule) {
      throw new Error('TimeGrpc native module not available');
    }
    
    return await timeGrpcModule.getConnectionStatus();
  }
  
  /**
   * Shutdown gRPC client
   */
  shutdown(): void {
    if (!timeGrpcModule) {
      throw new Error('TimeGrpc native module not available');
    }
    
    timeGrpcModule.shutdown();
  }
  
  /**
   * Add event listener for time updates
   */
  addTimeUpdateListener(callback: (data: TimeUpdateEvent) => void): () => void {
    const listener = timeGrpcEmitter.addListener('TimeUpdate', callback);
    this.eventListeners.set('TimeUpdate', callback);
    
    return () => {
      listener.remove();
      this.eventListeners.delete('TimeUpdate');
    };
  }
  
  /**
   * Add event listener for stream errors
   */
  addStreamErrorListener(callback: (data: TimeStreamErrorEvent) => void): () => void {
    const listener = timeGrpcEmitter.addListener('TimeStreamError', callback);
    this.eventListeners.set('TimeStreamError', callback);
    
    return () => {
      listener.remove();
      this.eventListeners.delete('TimeStreamError');
    };
  }
  
  /**
   * Add event listener for stream completion
   */
  addStreamCompletedListener(callback: () => void): () => void {
    const listener = timeGrpcEmitter.addListener('TimeStreamCompleted', callback);
    this.eventListeners.set('TimeStreamCompleted', callback);
    
    return () => {
      listener.remove();
      this.eventListeners.delete('TimeStreamCompleted');
    };
  }
  
  /**
   * Add event listener for stream stop
   */
  addStreamStoppedListener(callback: () => void): () => void {
    const listener = timeGrpcEmitter.addListener('TimeStreamStopped', callback);
    this.eventListeners.set('TimeStreamStopped', callback);
    
    return () => {
      listener.remove();
      this.eventListeners.delete('TimeStreamStopped');
    };
  }
  
  /**
   * Remove all event listeners
   */
  removeAllListeners(): void {
    this.eventListeners.forEach((_, eventName) => {
      timeGrpcEmitter.removeAllListeners(eventName);
    });
    this.eventListeners.clear();
  }
  
  /**
   * Check if native module is available
   */
  static isAvailable(): boolean {
    return Platform.OS === 'ios' || Platform.OS === 'android';
  }
  
  /**
   * Get platform-specific information
   */
  static getPlatformInfo(): {
    platform: string;
    available: boolean;
  } {
    return {
      platform: Platform.OS,
      available: TimeGrpcClient.isAvailable()
    };
  }
}

// Export singleton instance
export const timeGrpcClient = new TimeGrpcClient();

// Export types
export type { TimeUpdateEvent, TimeStreamErrorEvent };