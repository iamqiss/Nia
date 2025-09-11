import { timeGrpcClient, TimeUpdateEvent, TimeStreamErrorEvent } from './TimeGrpcBridge';
import { logger } from '#/logger';

/**
 * High-level Time service that integrates gRPC with existing API patterns
 * Provides a clean interface for time-related operations
 */
export class TimeService {
  private static instance: TimeService;
  private isInitialized = false;
  private isStreaming = false;
  private eventListeners: Map<string, (data: any) => void> = new Map();
  
  // Server configuration
  private serverHost = 'localhost';
  private serverPort = 50051;
  private useTls = false;
  
  private constructor() {}
  
  /**
   * Get singleton instance
   */
  static getInstance(): TimeService {
    if (!TimeService.instance) {
      TimeService.instance = new TimeService();
    }
    return TimeService.instance;
  }
  
  /**
   * Initialize the service with server configuration
   */
  async initialize(config: {
    host?: string;
    port?: number;
    useTls?: boolean;
  } = {}): Promise<void> {
    try {
      this.serverHost = config.host || 'localhost';
      this.serverPort = config.port || 50051;
      this.useTls = config.useTls || false;
      
      logger.info('TimeService: Initializing gRPC client', {
        host: this.serverHost,
        port: this.serverPort,
        useTls: this.useTls
      });
      
      const result = await timeGrpcClient.initialize(
        this.serverHost,
        this.serverPort,
        this.useTls
      );
      
      this.isInitialized = true;
      
      logger.info('TimeService: Successfully initialized', {
        status: result.status,
        serverTime: result.serverTime
      });
      
    } catch (error) {
      logger.error('TimeService: Failed to initialize', error);
      throw error;
    }
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
    this.ensureInitialized();
    
    try {
      logger.debug('TimeService: Getting current time');
      const result = await timeGrpcClient.getCurrentTime();
      
      logger.debug('TimeService: Received current time', {
        formattedTime: result.formattedTime,
        timezone: result.timezone
      });
      
      return result;
    } catch (error) {
      logger.error('TimeService: Failed to get current time', error);
      throw error;
    }
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
    this.ensureInitialized();
    
    try {
      logger.debug('TimeService: Getting time with timezone', { timezone });
      const result = await timeGrpcClient.getTimeWithTimezone(timezone);
      
      logger.debug('TimeService: Received time with timezone', {
        formattedTime: result.formattedTime,
        timezone: result.timezone
      });
      
      return result;
    } catch (error) {
      logger.error('TimeService: Failed to get time with timezone', error);
      throw error;
    }
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
    this.ensureInitialized();
    
    try {
      logger.debug('TimeService: Getting time statistics');
      const result = await timeGrpcClient.getTimeStats();
      
      logger.debug('TimeService: Received time statistics', {
        serverVersion: result.serverVersion,
        uptimeSeconds: result.uptimeSeconds
      });
      
      return result;
    } catch (error) {
      logger.error('TimeService: Failed to get time statistics', error);
      throw error;
    }
  }
  
  /**
   * Start streaming time updates
   */
  startTimeStream(): void {
    this.ensureInitialized();
    
    if (this.isStreaming) {
      logger.warn('TimeService: Time stream already active');
      return;
    }
    
    try {
      logger.info('TimeService: Starting time stream');
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Start the stream
      timeGrpcClient.startTimeStream();
      this.isStreaming = true;
      
      logger.info('TimeService: Time stream started');
    } catch (error) {
      logger.error('TimeService: Failed to start time stream', error);
      throw error;
    }
  }
  
  /**
   * Stop streaming time updates
   */
  stopTimeStream(): void {
    if (!this.isStreaming) {
      logger.warn('TimeService: Time stream not active');
      return;
    }
    
    try {
      logger.info('TimeService: Stopping time stream');
      
      timeGrpcClient.stopTimeStream();
      this.isStreaming = false;
      
      // Clean up event listeners
      this.cleanupEventListeners();
      
      logger.info('TimeService: Time stream stopped');
    } catch (error) {
      logger.error('TimeService: Failed to stop time stream', error);
      throw error;
    }
  }
  
  /**
   * Check connection status
   */
  async getConnectionStatus(): Promise<{
    status: string;
    connected: boolean;
    streaming: boolean;
  }> {
    this.ensureInitialized();
    
    try {
      const result = await timeGrpcClient.getConnectionStatus();
      
      logger.debug('TimeService: Connection status', result);
      
      return result;
    } catch (error) {
      logger.error('TimeService: Failed to get connection status', error);
      throw error;
    }
  }
  
  /**
   * Shutdown the service
   */
  shutdown(): void {
    try {
      logger.info('TimeService: Shutting down');
      
      // Stop streaming if active
      if (this.isStreaming) {
        this.stopTimeStream();
      }
      
      // Clean up event listeners
      this.cleanupEventListeners();
      
      // Shutdown gRPC client
      timeGrpcClient.shutdown();
      
      this.isInitialized = false;
      
      logger.info('TimeService: Shutdown complete');
    } catch (error) {
      logger.error('TimeService: Error during shutdown', error);
    }
  }
  
  /**
   * Add listener for time updates
   */
  onTimeUpdate(callback: (data: TimeUpdateEvent) => void): () => void {
    return timeGrpcClient.addTimeUpdateListener(callback);
  }
  
  /**
   * Add listener for stream errors
   */
  onStreamError(callback: (data: TimeStreamErrorEvent) => void): () => void {
    return timeGrpcClient.addStreamErrorListener(callback);
  }
  
  /**
   * Add listener for stream completion
   */
  onStreamCompleted(callback: () => void): () => void {
    return timeGrpcClient.addStreamCompletedListener(callback);
  }
  
  /**
   * Add listener for stream stop
   */
  onStreamStopped(callback: () => void): () => void {
    return timeGrpcClient.addStreamStoppedListener(callback);
  }
  
  /**
   * Check if service is initialized
   */
  get initialized(): boolean {
    return this.isInitialized;
  }
  
  /**
   * Check if streaming is active
   */
  get streaming(): boolean {
    return this.isStreaming;
  }
  
  /**
   * Get server configuration
   */
  get config(): {
    host: string;
    port: number;
    useTls: boolean;
  } {
    return {
      host: this.serverHost,
      port: this.serverPort,
      useTls: this.useTls
    };
  }
  
  // Private methods
  
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('TimeService not initialized. Call initialize() first.');
    }
  }
  
  private setupEventListeners(): void {
    // Time update listener
    const timeUpdateListener = timeGrpcClient.addTimeUpdateListener((data) => {
      logger.debug('TimeService: Received time update', {
        formattedTime: data.formattedTime,
        timezone: data.timezone
      });
      
      // Emit to any registered listeners
      this.emit('timeUpdate', data);
    });
    
    // Stream error listener
    const streamErrorListener = timeGrpcClient.addStreamErrorListener((data) => {
      logger.error('TimeService: Stream error', { error: data.error });
      this.emit('streamError', data);
    });
    
    // Stream completed listener
    const streamCompletedListener = timeGrpcClient.addStreamCompletedListener(() => {
      logger.info('TimeService: Stream completed');
      this.isStreaming = false;
      this.emit('streamCompleted');
    });
    
    // Stream stopped listener
    const streamStoppedListener = timeGrpcClient.addStreamStoppedListener(() => {
      logger.info('TimeService: Stream stopped');
      this.isStreaming = false;
      this.emit('streamStopped');
    });
    
    // Store listeners for cleanup
    this.eventListeners.set('timeUpdate', timeUpdateListener);
    this.eventListeners.set('streamError', streamErrorListener);
    this.eventListeners.set('streamCompleted', streamCompletedListener);
    this.eventListeners.set('streamStopped', streamStoppedListener);
  }
  
  private cleanupEventListeners(): void {
    this.eventListeners.forEach((removeListener) => {
      removeListener();
    });
    this.eventListeners.clear();
  }
  
  private emit(event: string, data?: any): void {
    // This could be extended to use a proper event emitter
    // For now, we'll just log the events
    logger.debug(`TimeService: Emitting event ${event}`, data);
  }
}

// Export singleton instance
export const timeService = TimeService.getInstance();

// Export types
export type { TimeUpdateEvent, TimeStreamErrorEvent };