//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { type BskyAgent } from '@atproto/api' // Legacy - will be removed;
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
    if (!TimeGrpcMigrationService.instance) {
      TimeGrpcMigrationService.instance = new TimeGrpcMigrationService();
    }
    return TimeGrpcMigrationService.instance;
  }

  private constructor() {
    this.grpcClient = TimeGrpcClient.getInstance();
    this.featureFlags = GrpcFeatureFlagManager.getInstance();
  }

  /**
   * Initialize the migration service
   */
  async initialize(config: GrpcClientConfig): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.grpcClient.initialize(config);
      this.isInitialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize gRPC migration service: ${error}`);
    }
  }

  /**
   * Check if gRPC should be used for a specific operation
   */
  private shouldUseGrpc(operation: string): boolean {
    if (!this.isInitialized) return false;
    return this.featureFlags.isGrpcEnabledForOperation(operation);
  }

  // MARK: - Note Operations (Complete AT Protocol Replacement)

  /**
   * Create a post/note - replaces // agent.com.atproto.repo.applyWrites - replaced with gRPC
   */
  async createPost(
    agent: BskyAgent,
    queryClient: QueryClient,
    postData: {
      text: string;
      replyTo?: string;
      quote?: string;
      media?: any[];
      labels?: any[];
      threadgate?: any[];
      postgate?: any;
      langs?: string[];
    }
  ): Promise<{ uris: string[] }> {
    const userId = agent.session?.did;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (this.shouldUseGrpc('createNote')) {
      try {
        const request: CreateNoteRequest = {
          authorId: userId,
          text: postData.text,
          visibility: NoteVisibility.PUBLIC,
          contentWarning: ContentWarning.NONE,
          mediaIds: postData.media?.map(m => m.id) || [],
          replyToNoteId: postData.replyTo,
          renotedNoteId: postData.quote,
          isQuoteRenote: !!postData.quote,
          clientName: 'Time Social App',
        };

        const response = await this.grpcClient.getNoteService().createNote(request);

        if (response.success) {
          return {
            uris: [`at://${userId}/app.bsky.feed.post/${response.note.id}`],
          };
        } else {
          throw new Error(response.errorMessage || 'Failed to create post');
        }
      } catch (error) {
        console.warn('gRPC createPost failed, falling back to REST:', error);
        // Fall back to REST implementation
        return this.createPostRest(agent, queryClient, postData);
      }
    } else {
      return this.createPostRest(agent, queryClient, postData);
    }
  }

  /**
   * Get a post - replaces // agent.getPost - replaced with gRPC
   */
  async getPost(agent: BskyAgent, uri: string): Promise<any> {
    const noteId = uri.split('/').pop() || '';
    const requestingUserId = agent.session?.did || '';

    if (this.shouldUseGrpc('getNote')) {
      try {
        const request: GetNoteRequest = {
          noteId,
          requestingUserId,
          includeThread: true,
        };

        const response = await this.grpcClient.getNoteService().getNote(request);

        if (response.success) {
          return this.convertGrpcNoteToRestPost(response.note);
        } else {
          throw new Error(response.errorMessage || 'Failed to get post');
        }
      } catch (error) {
        console.warn('gRPC getPost failed, falling back to REST:', error);
        return this.getPostRest(agent, uri);
      }
    } else {
      return this.getPostRest(agent, uri);
    }
  }

  /**
   * Like a post - replaces // agent.like - replaced with gRPC
   */
  async likePost(agent: BskyAgent, uri: string, cid: string): Promise<{ uri: string }> {
    const noteId = uri.split('/').pop() || '';
    const userId = agent.session?.did || '';

    if (this.shouldUseGrpc('likeNote')) {
      try {
        const request: LikeNoteRequest = {
          noteId,
          userId,
          like: true,
        };

        const response = await this.grpcClient.getNoteService().likeNote(request);

        if (response.success) {
          return { uri: `like-${noteId}-${userId}` };
        } else {
          throw new Error(response.errorMessage || 'Failed to like post');
        }
      } catch (error) {
        console.warn('gRPC likePost failed, falling back to REST:', error);
        return this.likePostRest(agent, uri, cid);
      }
    } else {
      return this.likePostRest(agent, uri, cid);
    }
  }

  /**
   * Unlike a post - replaces // agent.deleteLike - replaced with gRPC
   */
  async unlikePost(agent: BskyAgent, likeUri: string): Promise<void> {
    const parts = likeUri.split('-');
    const noteId = parts[1] || '';
    const userId = agent.session?.did || '';

    if (this.shouldUseGrpc('likeNote')) {
      try {
        const request: LikeNoteRequest = {
          noteId,
          userId,
          like: false,
        };

        const response = await this.grpcClient.getNoteService().likeNote(request);

        if (!response.success) {
          throw new Error(response.errorMessage || 'Failed to unlike post');
        }
      } catch (error) {
        console.warn('gRPC unlikePost failed, falling back to REST:', error);
        return this.unlikePostRest(agent, likeUri);
      }
    } else {
      return this.unlikePostRest(agent, likeUri);
    }
  }

  /**
   * Repost a post - replaces // agent.repost - replaced with gRPC
   */
  async repostPost(agent: BskyAgent, uri: string, cid: string): Promise<{ uri: string }> {
    const noteId = uri.split('/').pop() || '';
    const userId = agent.session?.did || '';

    if (this.shouldUseGrpc('renoteNote')) {
      try {
        const request: RenoteNoteRequest = {
          noteId,
          userId,
          isQuoteRenote: false,
        };

        const response = await this.grpcClient.getNoteService().renoteNote(request);

        if (response.success) {
          return { uri: response.renoteNote.id };
        } else {
          throw new Error(response.errorMessage || 'Failed to repost');
        }
      } catch (error) {
        console.warn('gRPC repostPost failed, falling back to REST:', error);
        return this.repostPostRest(agent, uri, cid);
      }
    } else {
      return this.repostPostRest(agent, uri, cid);
    }
  }

  /**
   * Unrepost a post - replaces // agent.deleteRepost - replaced with gRPC
   */
  async unrepostPost(agent: BskyAgent, repostUri: string): Promise<void> {
    const noteId = repostUri.split('-')[1] || '';
    const userId = agent.session?.did || '';

    if (this.shouldUseGrpc('renoteNote')) {
      try {
        const request: RenoteNoteRequest = {
          noteId,
          userId,
          isQuoteRenote: false,
        };

        const response = await this.grpcClient.getNoteService().renoteNote(request);

        if (!response.success) {
          throw new Error(response.errorMessage || 'Failed to unrepost');
        }
      } catch (error) {
        console.warn('gRPC unrepostPost failed, falling back to REST:', error);
        return this.unrepostPostRest(agent, repostUri);
      }
    } else {
      return this.unrepostPostRest(agent, repostUri);
    }
  }

  /**
   * Delete a post - replaces // agent.deletePost - replaced with gRPC
   */
  async deletePost(agent: BskyAgent, uri: string): Promise<void> {
    const noteId = uri.split('/').pop() || '';
    const userId = agent.session?.did || '';

    if (this.shouldUseGrpc('deleteNote')) {
      try {
        const request: DeleteNoteRequest = {
          noteId,
          userId,
        };

        const response = await this.grpcClient.getNoteService().deleteNote(request);

        if (!response.success) {
          throw new Error(response.errorMessage || 'Failed to delete post');
        }
      } catch (error) {
        console.warn('gRPC deletePost failed, falling back to REST:', error);
        return this.deletePostRest(agent, uri);
      }
    } else {
      return this.deletePostRest(agent, uri);
    }
  }

  // MARK: - User Operations (Complete AT Protocol Replacement)

  /**
   * User login - replaces // agent.login - replaced with gRPC
   */
  async loginUser(
    agent: BskyAgent,
    credentials: { email: string; password: string; twoFactorCode?: string },
    deviceName?: string
  ): Promise<any> {
    if (this.shouldUseGrpc('loginUser')) {
      try {
        const request: LoginUserRequest = {
          credentials: {
            email: credentials.email,
            password: credentials.password,
            twoFactorCode: credentials.twoFactorCode,
          },
          deviceName: deviceName || 'Time Social App',
        };

        const response = await this.grpcClient.getUserService().loginUser(request);

        if (response.status.code === StatusCode.OK) {
          return {
            data: {
              accessJwt: response.accessToken,
              refreshJwt: response.refreshToken,
              did: response.session.userId,
              handle: '', // Will be populated from user profile
              email: credentials.email,
              emailConfirmed: true,
              emailAuthFactor: false,
              active: true,
              status: 'active',
            },
          };
        } else {
          throw new Error(response.status.message || 'Login failed');
        }
      } catch (error) {
        console.warn('gRPC loginUser failed, falling back to REST:', error);
        return this.loginUserRest(agent, credentials, deviceName);
      }
    } else {
      return this.loginUserRest(agent, credentials, deviceName);
    }
  }

  /**
   * User registration - replaces // agent.createAccount - replaced with gRPC
   */
  async registerUser(
    agent: BskyAgent,
    userData: {
      email: string;
      password: string;
      handle: string;
      inviteCode?: string;
    }
  ): Promise<any> {
    if (this.shouldUseGrpc('registerUser')) {
      try {
        const request: RegisterUserRequest = {
          username: userData.handle,
          email: userData.email,
          password: userData.password,
          displayName: userData.handle,
          invitationCode: userData.inviteCode,
          acceptTerms: true,
          acceptPrivacy: true,
        };

        const response = await this.grpcClient.getUserService().registerUser(request);

        if (response.status.code === StatusCode.OK) {
          return {
            data: {
              accessJwt: '', // Will be set after login
              refreshJwt: '',
              did: response.user.userId,
              handle: response.user.username,
              email: response.user.email,
              emailConfirmed: false,
              emailAuthFactor: false,
              active: true,
              status: 'active',
            },
          };
        } else {
          throw new Error(response.status.message || 'Registration failed');
        }
      } catch (error) {
        console.warn('gRPC registerUser failed, falling back to REST:', error);
        return this.registerUserRest(agent, userData);
      }
    } else {
      return this.registerUserRest(agent, userData);
    }
  }

  /**
   * Get user profile - replaces // agent.getProfile - replaced with gRPC
   */
  async getUserProfile(agent: BskyAgent, userId: string): Promise<any> {
    if (this.shouldUseGrpc('getUserProfile')) {
      try {
        const request: GetUserProfileRequest = {
          userId,
        };

        const response = await this.grpcClient.getUserService().getUserProfile(request);

        if (response.status.code === StatusCode.OK) {
          return {
            data: {
              did: response.user.userId,
              handle: response.user.username,
              displayName: response.user.displayName,
              description: response.user.bio,
              avatar: response.user.avatarUrl,
              banner: '',
              followersCount: response.user.followerCount,
              followsCount: response.user.followingCount,
              postsCount: response.user.noteCount,
              viewer: {
                muted: false,
                mutedByList: false,
                blockedBy: false,
                blocking: '',
                following: '',
                followedBy: '',
              },
            },
          };
        } else {
          throw new Error(response.status.message || 'Failed to get profile');
        }
      } catch (error) {
        console.warn('gRPC getUserProfile failed, falling back to REST:', error);
        return this.getUserProfileRest(agent, userId);
      }
    } else {
      return this.getUserProfileRest(agent, userId);
    }
  }

  // MARK: - Timeline Operations (Complete AT Protocol Replacement)

  /**
   * Get timeline - replaces // agent.getTimeline - replaced with gRPC
   */
  async getTimeline(
    agent: BskyAgent,
    options: {
      algorithm?: string;
      limit?: number;
      cursor?: string;
    } = {}
  ): Promise<any> {
    const userId = agent.session?.did;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (this.shouldUseGrpc('getTimeline')) {
      try {
        const request: GetTimelineRequest = {
          userId,
          algorithm: this.mapTimelineAlgorithm(options.algorithm),
          pagination: {
            limit: options.limit || 50,
            cursor: options.cursor,
          },
          includeRankingSignals: false,
          realTimeUpdates: false,
        };

        const response = await this.grpcClient.getTimelineService().getTimeline(request);

        if (response.success) {
          return {
            data: {
              feed: response.items.map(item => this.convertGrpcTimelineItemToRestPost(item)),
              cursor: response.pagination.cursor,
            },
          };
        } else {
          throw new Error(response.errorMessage || 'Failed to get timeline');
        }
      } catch (error) {
        console.warn('gRPC getTimeline failed, falling back to REST:', error);
        return this.getTimelineRest(agent, options);
      }
    } else {
      return this.getTimelineRest(agent, options);
    }
  }

  /**
   * Get user timeline - replaces // agent.getAuthorFeed - replaced with gRPC
   */
  async getUserTimeline(
    agent: BskyAgent,
    userId: string,
    options: {
      limit?: number;
      cursor?: string;
      includeReplies?: boolean;
      includeRenotes?: boolean;
    } = {}
  ): Promise<any> {
    const requestingUserId = agent.session?.did || '';

    if (this.shouldUseGrpc('getUserTimeline')) {
      try {
        const request: GetUserTimelineRequest = {
          targetUserId: userId,
          requestingUserId,
          pagination: {
            limit: options.limit || 50,
            cursor: options.cursor,
          },
          includeReplies: options.includeReplies || false,
          includeRenotes: options.includeRenotes || false,
        };

        const response = await this.grpcClient.getTimelineService().getUserTimeline(request);

        if (response.success) {
          return {
            data: {
              feed: response.items.map(item => this.convertGrpcTimelineItemToRestPost(item)),
              cursor: response.pagination.cursor,
            },
          };
        } else {
          throw new Error(response.errorMessage || 'Failed to get user timeline');
        }
      } catch (error) {
        console.warn('gRPC getUserTimeline failed, falling back to REST:', error);
        return this.getUserTimelineRest(agent, userId, options);
      }
    } else {
      return this.getUserTimelineRest(agent, userId, options);
    }
  }

  // MARK: - Media Operations (Complete AT Protocol Replacement)

  /**
   * Upload media - replaces // agent.uploadBlob - replaced with gRPC
   */
  async uploadBlob(agent: BskyAgent, file: any, options: { encoding: string }): Promise<any> {
    const userId = agent.session?.did;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (this.shouldUseGrpc('uploadMedia')) {
      try {
        // Convert file to Uint8Array
        const fileData = await this.fileToUint8Array(file);
        
        const request: UploadRequest = {
          init: {
            ownerUserId: userId,
            type: this.mapMimeTypeToMediaType(options.encoding),
            originalFilename: file.name || 'upload',
            mimeType: options.encoding,
          },
          chunk: {
            content: fileData,
          },
        };

        const response = await this.grpcClient.getMediaService().upload(request);

        return {
          data: {
            blob: {
              ref: {
                $link: response.mediaId,
              },
              mimeType: options.encoding,
              size: fileData.length,
            },
          },
        };
      } catch (error) {
        console.warn('gRPC uploadBlob failed, falling back to REST:', error);
        return this.uploadBlobRest(agent, file, options);
      }
    } else {
      return this.uploadBlobRest(agent, file, options);
    }
  }

  // MARK: - Notification Operations (Complete AT Protocol Replacement)

  /**
   * Register device for push notifications
   */
  async registerDevice(deviceData: {
    userId: string;
    deviceToken: string;
    platform: string;
    appVersion: string;
    osVersion: string;
    deviceModel: string;
    timezone: string;
    language: string;
    deviceCapabilities: Record<string, string>;
  }): Promise<any> {
    if (this.shouldUseGrpc('registerDevice')) {
      try {
        const request: DeviceRegistrationRequest = {
          userId: deviceData.userId,
          deviceToken: deviceData.deviceToken,
          platform: deviceData.platform,
          appVersion: deviceData.appVersion,
          osVersion: deviceData.osVersion,
          deviceModel: deviceData.deviceModel,
          timezone: deviceData.timezone,
          language: deviceData.language,
          deviceCapabilities: deviceData.deviceCapabilities,
          registeredAt: this.getCurrentTimestamp(),
        };

        const response = await this.grpcClient.getNotificationService().registerDevice(request);

        return {
          success: response.success,
          deviceId: response.deviceId,
          message: response.message,
        };
      } catch (error) {
        console.warn('gRPC registerDevice failed:', error);
        throw error;
      }
    } else {
      throw new Error('Device registration not available in REST mode');
    }
  }

  // MARK: - REST Fallback Implementations

  private async createPostRest(
    agent: BskyAgent,
    queryClient: QueryClient,
    postData: any
  ): Promise<{ uris: string[] }> {
    // Use existing REST implementation
    const { post } = await import('../api/index');
    return post(agent, queryClient, { thread: { posts: [postData] } });
  }

  private async getPostRest(agent: BskyAgent, uri: string): Promise<any> {
    const atUri = new (await import('@atproto/api')).AtUri(uri);
    return // agent.getPost - replaced with gRPC({
      repo: atUri.host,
      rkey: atUri.rkey,
    });
  }

  private async likePostRest(agent: BskyAgent, uri: string, cid: string): Promise<{ uri: string }> {
    return // agent.like - replaced with gRPC(uri, cid);
  }

  private async unlikePostRest(agent: BskyAgent, likeUri: string): Promise<void> {
    return // agent.deleteLike - replaced with gRPC(likeUri);
  }

  private async repostPostRest(agent: BskyAgent, uri: string, cid: string): Promise<{ uri: string }> {
    return // agent.repost - replaced with gRPC(uri, cid);
  }

  private async unrepostPostRest(agent: BskyAgent, repostUri: string): Promise<void> {
    return // agent.deleteRepost - replaced with gRPC(repostUri);
  }

  private async deletePostRest(agent: BskyAgent, uri: string): Promise<void> {
    return // agent.deletePost - replaced with gRPC(uri);
  }

  private async loginUserRest(
    agent: BskyAgent,
    credentials: any,
    deviceName?: string
  ): Promise<any> {
    return // agent.login - replaced with gRPC({
      identifier: credentials.email,
      password: credentials.password,
      authFactorToken: credentials.twoFactorCode,
    });
  }

  private async registerUserRest(agent: BskyAgent, userData: any): Promise<any> {
    return // agent.createAccount - replaced with gRPC({
      email: userData.email,
      password: userData.password,
      handle: userData.handle,
      inviteCode: userData.inviteCode,
    });
  }

  private async getUserProfileRest(agent: BskyAgent, userId: string): Promise<any> {
    return // agent.getProfile - replaced with gRPC({ actor: userId });
  }

  private async getTimelineRest(agent: BskyAgent, options: any): Promise<any> {
    return // agent.getTimeline - replaced with gRPC({
      algorithm: options.algorithm || 'reverse-chronological',
      limit: options.limit || 50,
      cursor: options.cursor,
    });
  }

  private async getUserTimelineRest(agent: BskyAgent, userId: string, options: any): Promise<any> {
    return // agent.getAuthorFeed - replaced with gRPC({
      actor: userId,
      limit: options.limit || 50,
      cursor: options.cursor,
    });
  }

  private async uploadBlobRest(agent: BskyAgent, file: any, options: any): Promise<any> {
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