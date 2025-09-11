/**
 * Media Service gRPC Client
 * 
 * This module provides a TypeScript gRPC client for communicating with the
 * time-server media service. It handles all media operations including
 * upload, download, processing, and management.
 */

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { EventEmitter } from 'events';
import { promisify } from 'util';

// Load proto file
const PROTO_PATH = require.resolve('./media_service.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the service definition
const mediaProto = grpc.loadPackageDefinition(packageDefinition).sonet.media;

// Type definitions based on the proto file
export interface Media {
  id: string;
  ownerUserId: string;
  type: 'MEDIA_TYPE_UNKNOWN' | 'MEDIA_TYPE_IMAGE' | 'MEDIA_TYPE_VIDEO' | 'MEDIA_TYPE_GIF';
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  durationSeconds: number;
  originalUrl: string;
  thumbnailUrl: string;
  hlsUrl: string;
  createdAt: string;
  webpUrl: string;
  mp4Url: string;
}

export interface UploadInit {
  ownerUserId: string;
  type: 'MEDIA_TYPE_UNKNOWN' | 'MEDIA_TYPE_IMAGE' | 'MEDIA_TYPE_VIDEO' | 'MEDIA_TYPE_GIF';
  originalFilename: string;
  mimeType: string;
}

export interface UploadChunk {
  content: Uint8Array;
}

export interface UploadRequest {
  init?: UploadInit;
  chunk?: UploadChunk;
}

export interface UploadResponse {
  mediaId: string;
  type: 'MEDIA_TYPE_UNKNOWN' | 'MEDIA_TYPE_IMAGE' | 'MEDIA_TYPE_VIDEO' | 'MEDIA_TYPE_GIF';
  url: string;
  thumbnailUrl: string;
  hlsUrl: string;
  webpUrl: string;
  mp4Url: string;
}

export interface GetMediaRequest {
  mediaId: string;
}

export interface GetMediaResponse {
  media: Media;
}

export interface DeleteMediaRequest {
  mediaId: string;
}

export interface DeleteMediaResponse {
  deleted: boolean;
}

export interface ListUserMediaRequest {
  ownerUserId: string;
  page: number;
  pageSize: number;
}

export interface ListUserMediaResponse {
  items: Media[];
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ToggleMediaLikeRequest {
  mediaId: string;
  userId: string;
  isLiked: boolean;
}

export interface ToggleMediaLikeResponse {
  mediaId: string;
  likeCount: number;
  isLiked: boolean;
}

export interface HealthCheckRequest {}

export interface HealthCheckResponse {
  status: string;
}

export interface UploadProgress {
  mediaId: string;
  uploadedBytes: number;
  totalBytes: number;
  percentage: number;
  speed: number; // bytes per second
  estimatedTimeRemaining: number; // seconds
}

export interface UploadOptions {
  chunkSize?: number;
  timeout?: number;
  retryAttempts?: number;
  enableProgress?: boolean;
  enableCompression?: boolean;
  compressionQuality?: number;
  enableEncryption?: boolean;
  encryptionKey?: string;
}

// Main gRPC client class
export class MediaServiceClient extends EventEmitter {
  private client: any;
  private channel: grpc.Channel;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private activeUploads: Map<string, { call: any; cancel: () => void }> = new Map();

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
    this.client = new mediaProto.MediaService(
      address,
      credentials || grpc.credentials.createInsecure(),
      options
    );

    // Set up connection monitoring
    this.setupConnectionMonitoring();
  }

  /**
   * Upload media with streaming
   */
  public async uploadMedia(
    fileUri: string,
    ownerUserId: string,
    mediaType: 'MEDIA_TYPE_IMAGE' | 'MEDIA_TYPE_VIDEO' | 'MEDIA_TYPE_GIF',
    mimeType: string,
    originalFilename: string,
    options: UploadOptions = {},
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    const {
      chunkSize = 64 * 1024, // 64KB default
      timeout = 30000,
      retryAttempts = 3,
      enableProgress = true,
    } = options;

    return new Promise(async (resolve, reject) => {
      try {
        // Read file data
        const fileData = await this.readFileData(fileUri);
        const totalBytes = fileData.length;
        const mediaId = this.generateMediaId();

        // Create upload call
        const call = this.client.Upload();
        const uploadId = `${mediaId}_${Date.now()}`;

        // Set up call handlers
        call.on('data', (response: UploadResponse) => {
          resolve(response);
        });

        call.on('error', (error: any) => {
          this.activeUploads.delete(uploadId);
          this.handleError(error);
          reject(error);
        });

        call.on('end', () => {
          this.activeUploads.delete(uploadId);
        });

        // Store active upload
        this.activeUploads.set(uploadId, {
          call,
          cancel: () => call.cancel(),
        });

        // Send initial request
        const initRequest: UploadRequest = {
          init: {
            ownerUserId,
            type: mediaType,
            originalFilename,
            mimeType,
          },
        };
        call.write(initRequest);

        // Send file in chunks
        let uploadedBytes = 0;
        const startTime = Date.now();

        for (let i = 0; i < fileData.length; i += chunkSize) {
          const chunk = fileData.slice(i, i + chunkSize);
          const chunkRequest: UploadRequest = {
            chunk: {
              content: new Uint8Array(chunk),
            },
          };

          call.write(chunkRequest);
          uploadedBytes += chunk.length;

          // Report progress
          if (enableProgress && onProgress) {
            const elapsed = (Date.now() - startTime) / 1000;
            const speed = uploadedBytes / elapsed;
            const remainingBytes = totalBytes - uploadedBytes;
            const estimatedTimeRemaining = remainingBytes / speed;

            onProgress({
              mediaId,
              uploadedBytes,
              totalBytes,
              percentage: (uploadedBytes / totalBytes) * 100,
              speed,
              estimatedTimeRemaining: isFinite(estimatedTimeRemaining) ? estimatedTimeRemaining : 0,
            });
          }

          // Small delay to prevent overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 10));
        }

        // End the call
        call.end();

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get media by ID
   */
  public async getMedia(mediaId: string): Promise<GetMediaResponse> {
    return this.callUnaryMethod('GetMedia', { mediaId });
  }

  /**
   * Delete media by ID
   */
  public async deleteMedia(mediaId: string): Promise<DeleteMediaResponse> {
    return this.callUnaryMethod('DeleteMedia', { mediaId });
  }

  /**
   * List user media with pagination
   */
  public async listUserMedia(
    ownerUserId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ListUserMediaResponse> {
    return this.callUnaryMethod('ListUserMedia', {
      ownerUserId,
      page,
      pageSize,
    });
  }

  /**
   * Toggle media like
   */
  public async toggleMediaLike(
    mediaId: string,
    userId: string,
    isLiked: boolean
  ): Promise<ToggleMediaLikeResponse> {
    return this.callUnaryMethod('ToggleMediaLike', {
      mediaId,
      userId,
      isLiked,
    });
  }

  /**
   * Health check
   */
  public async healthCheck(): Promise<HealthCheckResponse> {
    return this.callUnaryMethod('HealthCheck', {});
  }

  /**
   * Cancel active upload
   */
  public cancelUpload(mediaId: string): boolean {
    const upload = this.activeUploads.get(mediaId);
    if (upload) {
      upload.cancel();
      this.activeUploads.delete(mediaId);
      return true;
    }
    return false;
  }

  /**
   * Get all active uploads
   */
  public getActiveUploads(): string[] {
    return Array.from(this.activeUploads.keys());
  }

  /**
   * Close the connection
   */
  public close(): void {
    // Cancel all active uploads
    this.activeUploads.forEach(({ cancel }) => cancel());
    this.activeUploads.clear();

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
   * Read file data from URI
   */
  private async readFileData(uri: string): Promise<ArrayBuffer> {
    // This is a placeholder - in a real implementation, you would read the file
    // from the file system using React Native's file system APIs
    throw new Error('readFileData not implemented - requires file system integration');
  }

  /**
   * Generate unique media ID
   */
  private generateMediaId(): string {
    return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      await this.healthCheck();
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
    console.error('Media Service gRPC Error:', {
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }
}

// Export the client class
export default MediaServiceClient;