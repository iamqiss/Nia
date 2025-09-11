//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

// Migrated to gRPC;
import { type QueryClient } from '@tanstack/react-query';
import TimeGrpcClient, {
  GrpcClientConfig,
  CreateNoteRequest,
  GetNoteRequest,
  LikeNoteRequest,
  RenoteNoteRequest,
  DeleteNoteRequest,
  LoginUserRequest,
  RegisterUserRequest,
  GetUserProfileRequest,
  GetTimelineRequest,
  GetUserTimelineRequest,
  UploadRequest,
  GetMediaRequest,
  DeleteMediaRequest,
  ListUserMediaRequest,
  ToggleMediaLikeRequest,
  DeviceRegistrationRequest,
  SendPushNotificationRequest,
  NoteVisibility,
  ContentWarning,
  TimelineAlgorithm,
  MediaType,
  StatusCode,
  AuthCredentials,
  PaginationRequest,
  Timestamp,
} from './TimeGrpcClient';
import { GrpcFeatureFlagManager } from './migration/FeatureFlags';

/**
 * Complete gRPC Migration Service
 * Replaces all AT Protocol functionality with gRPC
 */
export class TimeGrpcMigrationService {
  private static instance: TimeGrpcMigrationService;
  private grpcClient: TimeGrpcClient;
  private featureFlags: GrpcFeatureFlagManager;
  private isInitialized = false;

  static getInstance(): TimeGrpcMigrationService {
    > {
    // Use existing REST implementation
    const { post } = await import('../api/index');
    return post(agent, queryClient, { thread: { posts: [postData] } });
  }

  private async getPostRest(agent: TimeGrpcClient, uri: string): Promise<any> {
    const atUri = new GrpcUri(uri);
    return // agent.getPost - replaced with gRPC({
      repo: atUri.host,
      rkey: atUri.rkey,
    });
  }

  private async likePostRest(agent: TimeGrpcClient, uri: string, cid: string): Promise<{ uri: string }> {
    return // agent.like - replaced with gRPC(uri, cid);
  }

  private async unlikePostRest(agent: TimeGrpcClient, likeUri: string): Promise<void> {
    return // agent.deleteLike - replaced with gRPC(likeUri);
  }

  private async repostPostRest(agent: TimeGrpcClient, uri: string, cid: string): Promise<{ uri: string }> {
    return // agent.repost - replaced with gRPC(uri, cid);
  }

  private async unrepostPostRest(agent: TimeGrpcClient, repostUri: string): Promise<void> {
    return // agent.deleteRepost - replaced with gRPC(repostUri);
  }

  private async deletePostRest(agent: TimeGrpcClient, uri: string): Promise<void> {
    return // agent.deletePost - replaced with gRPC(uri);
  }

  private async loginUserRest(
    agent: TimeGrpcClient,
    credentials: any,
    deviceName?: string
  ): Promise<any> {
    return // agent.login - replaced with gRPC({
      identifier: credentials.email,
      password: credentials.password,
      authFactorToken: credentials.twoFactorCode,
    });
  }

  private async registerUserRest(agent: TimeGrpcClient, userData: any): Promise<any> {
    return // agent.createAccount - replaced with gRPC({
      email: userData.email,
      password: userData.password,
      handle: userData.handle,
      inviteCode: userData.inviteCode,
    });
  }

  private async getUserProfileRest(agent: TimeGrpcClient, userId: string): Promise<any> {
    return // agent.getProfile - replaced with gRPC({ actor: userId });
  }

  private async getTimelineRest(agent: TimeGrpcClient, options: any): Promise<any> {
    return // agent.getTimeline - replaced with gRPC({
      algorithm: options.algorithm || 'reverse-chronological',
      limit: options.limit || 50,
      cursor: options.cursor,
    });
  }

  private async getUserTimelineRest(agent: TimeGrpcClient, userId: string, options: any): Promise<any> {
    return // agent.getAuthorFeed - replaced with gRPC({
      actor: userId,
      limit: options.limit || 50,
      cursor: options.cursor,
    });
  }

  private async uploadBlobRest(agent: TimeGrpcClient, file: any, options: any): Promise<any> {
    return // agent.uploadBlob - replaced with gRPC(file, options);
  }

  // MARK: - Data Conversion Utilities

  private convertGrpcNoteToRestPost(note: any): any {
    return {
      uri: `at://${note.authorId}/app.bsky.feed.post/${note.id}`,
      cid: note.id,
      record: {
        $type: 'app.bsky.feed.post',
        text: note.text,
        createdAt: new Date(note.createdAt.seconds * 1000).toISOString(),
        // Add other fields as needed
      },
      author: {
        did: note.authorId,
        handle: '', // Will be populated from user profile
        displayName: '',
        avatar: '',
        viewer: {
          muted: false,
          mutedByList: false,
          blockedBy: false,
          blocking: '',
          following: '',
          followedBy: '',
        },
      },
      replyCount: note.metrics.replyCount,
      repostCount: note.metrics.renoteCount,
      likeCount: note.metrics.likeCount,
      indexedAt: new Date(note.createdAt.seconds * 1000).toISOString(),
      viewer: {
        repost: undefined,
        like: undefined,
      },
    };
  }

  private convertGrpcTimelineItemToRestPost(item: any): any {
    return this.convertGrpcNoteToRestPost(item.note);
  }

  private mapTimelineAlgorithm(algorithm?: string): TimelineAlgorithm {
    switch (algorithm) {
      case 'reverse-chronological':
        return TimelineAlgorithm.CHRONOLOGICAL;
      case 'algorithmic':
        return TimelineAlgorithm.ALGORITHMIC;
      case 'hybrid':
        return TimelineAlgorithm.HYBRID;
      default:
        return TimelineAlgorithm.CHRONOLOGICAL;
    }
  }

  private mapMimeTypeToMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) {
      return MediaType.IMAGE;
    } else if (mimeType.startsWith('video/')) {
      return MediaType.VIDEO;
    } else if (mimeType === 'image/gif') {
      return MediaType.GIF;
    } else {
      return MediaType.UNKNOWN;
    }
  }

  private async fileToUint8Array(file: any): Promise<Uint8Array> {
    if (file instanceof Uint8Array) {
      return file;
    }
    
    if (file instanceof ArrayBuffer) {
      return new Uint8Array(file);
    }
    
    if (file instanceof Blob) {
      const arrayBuffer = await file.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    }
    
    throw new Error('Unsupported file type');
  }

  private getCurrentTimestamp(): Timestamp {
    const now = Date.now();
    return {
      seconds: Math.floor(now / 1000),
      nanos: (now % 1000) * 1000000,
    };
  }

  // MARK: - Migration Control

  /**
   * Check if gRPC is enabled for a specific operation
   */
  isGrpcEnabled(operation: string): boolean {
    return this.featureFlags.isGrpcEnabledForOperation(operation);
  }

  /**
   * Get current migration phase
   */
  getMigrationPhase(): string {
    return this.featureFlags.getPhase();
  }

  /**
   * Set migration phase
   */
  setMigrationPhase(phase: 'disabled' | 'testing' | 'gradual' | 'full' | 'complete'): void {
    this.featureFlags.setPhase(phase);
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ success: boolean; status: string }> {
    return this.grpcClient.healthCheck();
  }
}

// MARK: - Default Export

export default TimeGrpcMigrationService;