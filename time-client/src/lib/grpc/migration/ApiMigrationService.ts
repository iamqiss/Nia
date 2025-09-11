//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { type BskyAgent } from '@atproto/api' // Legacy - will be removed;
import { type QueryClient } from '@tanstack/react-query';
import MigrationAdapter from './MigrationAdapter';
import { GrpcFeatureFlagManager } from './FeatureFlags';
import { 
  CreateNoteRequest, 
  GetNoteRequest, 
  LikeNoteRequest, 
  RenoteNoteRequest, 
  DeleteNoteRequest,
  LoginUserRequest,
  RegisterUserRequest,
  GetUserProfileRequest,
  NoteVisibility,
  ContentWarning,
} from '../TimeGrpcService';

/**
 * API Migration Service
 * Handles migration of API calls from REST to gRPC
 */
export class ApiMigrationService {
  private static instance: ApiMigrationService;
  private migrationAdapter: MigrationAdapter;
  private featureFlags: GrpcFeatureFlagManager;
  
  static getInstance(): ApiMigrationService {
    if (!ApiMigrationService.instance) {
      ApiMigrationService.instance = new ApiMigrationService();
    }
    return ApiMigrationService.instance;
  }
  
  private constructor() {
    this.migrationAdapter = MigrationAdapter.getInstance();
    this.featureFlags = GrpcFeatureFlagManager.getInstance();
  }
  
  /**
   * Initialize the API migration service
   */
  async initialize(grpcConfig: { host: string; port: number; useTLS?: boolean }): Promise<void> {
    await this.migrationAdapter.initialize(grpcConfig);
  }
  
  /**
   * Create a post using gRPC or REST
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
    }
  ): Promise<{ uris: string[] }> {
    const userId = agent.session?.did;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Convert to gRPC request format
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
    
    const response = await this.migrationAdapter.createNote(request, agent, queryClient);
    
    if (response.success) {
      return {
        uris: [`at://${userId}/app.bsky.feed.post/${response.note.id}`],
      };
    } else {
      throw new Error(response.errorMessage || 'Failed to create post');
    }
  }
  
  /**
   * Get a post using gRPC or REST
   */
  async getPost(
    agent: BskyAgent,
    uri: string
  ): Promise<any> {
    const noteId = uri.split('/').pop() || '';
    const requestingUserId = agent.session?.did || '';
    
    const request: GetNoteRequest = {
      noteId,
      requestingUserId,
      includeThread: true,
    };
    
    const response = await this.migrationAdapter.getNote(request, agent);
    
    if (response.success) {
      return this.convertGrpcNoteToRestPost(response.note);
    } else {
      throw new Error(response.errorMessage || 'Failed to get post');
    }
  }
  
  /**
   * Like a post using gRPC or REST
   */
  async likePost(
    agent: BskyAgent,
    uri: string,
    cid: string
  ): Promise<{ uri: string }> {
    const noteId = uri.split('/').pop() || '';
    const userId = agent.session?.did || '';
    
    const request: LikeNoteRequest = {
      noteId,
      userId,
      like: true,
    };
    
    const response = await this.migrationAdapter.likeNote(request, agent);
    
    if (response.success) {
      return { uri: `like-${noteId}-${userId}` };
    } else {
      throw new Error(response.errorMessage || 'Failed to like post');
    }
  }
  
  /**
   * Unlike a post using gRPC or REST
   */
  async unlikePost(
    agent: BskyAgent,
    likeUri: string
  ): Promise<void> {
    // Extract note ID from like URI
    const parts = likeUri.split('-');
    const noteId = parts[1] || '';
    const userId = agent.session?.did || '';
    
    const request: LikeNoteRequest = {
      noteId,
      userId,
      like: false,
    };
    
    const response = await this.migrationAdapter.likeNote(request, agent);
    
    if (!response.success) {
      throw new Error(response.errorMessage || 'Failed to unlike post');
    }
  }
  
  /**
   * Repost a post using gRPC or REST
   */
  async repostPost(
    agent: BskyAgent,
    uri: string,
    cid: string
  ): Promise<{ uri: string }> {
    const noteId = uri.split('/').pop() || '';
    const userId = agent.session?.did || '';
    
    const request: RenoteNoteRequest = {
      noteId,
      userId,
      isQuoteRenote: false,
      quoteText: undefined,
    };
    
    const response = await this.migrationAdapter.renoteNote(request, agent);
    
    if (response.success) {
      return { uri: response.renoteNote.id };
    } else {
      throw new Error(response.errorMessage || 'Failed to repost');
    }
  }
  
  /**
   * Unrepost a post using gRPC or REST
   */
  async unrepostPost(
    agent: BskyAgent,
    repostUri: string
  ): Promise<void> {
    // For unrepost, we need to find the original note ID
    // This is a simplified implementation
    const noteId = repostUri.split('-')[1] || '';
    const userId = agent.session?.did || '';
    
    const request: RenoteNoteRequest = {
      noteId,
      userId,
      isQuoteRenote: false,
      quoteText: undefined,
    };
    
    const response = await this.migrationAdapter.renoteNote(request, agent);
    
    if (!response.success) {
      throw new Error(response.errorMessage || 'Failed to unrepost');
    }
  }
  
  /**
   * Delete a post using gRPC or REST
   */
  async deletePost(
    agent: BskyAgent,
    uri: string
  ): Promise<void> {
    const noteId = uri.split('/').pop() || '';
    const userId = agent.session?.did || '';
    
    const request: DeleteNoteRequest = {
      noteId,
      userId,
    };
    
    const response = await this.migrationAdapter.deleteNote(request, agent);
    
    if (!response.success) {
      throw new Error(response.errorMessage || 'Failed to delete post');
    }
  }
  
  /**
   * Login user using gRPC or REST
   */
  async loginUser(
    agent: BskyAgent,
    credentials: { email: string; password: string; twoFactorCode?: string },
    deviceName?: string
  ): Promise<any> {
    const request: LoginUserRequest = {
      credentials: {
        email: credentials.email,
        password: credentials.password,
        twoFactorCode: credentials.twoFactorCode,
      },
      deviceName: deviceName || 'Time Social App',
    };
    
    const response = await this.migrationAdapter.loginUser(request, agent);
    
    if (response.status.code === 1) { // OK
      return {
        data: {
          accessJwt: response.accessToken,
          refreshJwt: response.refreshToken,
          did: response.session.userId,
          handle: '', // Extract from user profile
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
  }
  
  /**
   * Register user using gRPC or REST
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
    const request: RegisterUserRequest = {
      username: userData.handle,
      email: userData.email,
      password: userData.password,
      displayName: userData.handle,
      invitationCode: userData.inviteCode,
      acceptTerms: true,
      acceptPrivacy: true,
    };
    
    const response = await this.migrationAdapter.registerUser(request, agent);
    
    if (response.status.code === 1) { // OK
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
  }
  
  /**
   * Get user profile using gRPC or REST
   */
  async getUserProfile(
    agent: BskyAgent,
    userId: string
  ): Promise<any> {
    const request: GetUserProfileRequest = {
      userId,
    };
    
    const response = await this.migrationAdapter.getUserProfile(request, agent);
    
    if (response.status.code === 1) { // OK
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
  }
  
  /**
   * Convert gRPC note to REST post format
   */
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
        handle: '', // Extract from user profile
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
}

export default ApiMigrationService;