//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

// Migrated to gRPC;
import { GrpcFeatureFlagManager } from './FeatureFlags';
import TimeGrpcService, { 
  CreateNoteRequest, 
  CreateNoteResponse,
  GetNoteRequest,
  GetNoteResponse,
  LikeNoteRequest,
  LikeNoteResponse,
  RenoteNoteRequest,
  RenoteNoteResponse,
  DeleteNoteRequest,
  DeleteNoteResponse,
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  GetUserProfileRequest,
  GetUserProfileResponse,
} from '../TimeGrpcService';

/**
 * Migration adapter that switches between REST and gRPC based on feature flags
 */
export class MigrationAdapter {
  private static instance: MigrationAdapter;
  private grpcService: TimeGrpcService;
  private featureFlags: GrpcFeatureFlagManager;
  private isInitialized = false;
  
  static getInstance(): MigrationAdapter {
    if (!MigrationAdapter.instance) {
      MigrationAdapter.instance = new MigrationAdapter();
    }
    return MigrationAdapter.instance;
  }
  
  private constructor() {
    this.grpcService = TimeGrpcService.getInstance();
    this.featureFlags = GrpcFeatureFlagManager.getInstance();
  }
  
  /**
   * Initialize the migration adapter
   */
  async initialize(grpcConfig: { host: string; port: number; useTLS?: boolean }): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      await this.grpcService.initialize(grpcConfig);
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize gRPC service, falling back to REST:', error);
      this.isInitialized = false;
    }
  }
  
  /**
   * Check if gRPC should be used for a specific operation
   */
  private shouldUseGrpc(operation: string): boolean {
    if (!this.isInitialized) return false;
    return this.featureFlags.isGrpcEnabledForOperation(operation);
  }
  
  /**
   * Create a note using either gRPC or REST
   */
  async createNote(
    request: CreateNoteRequest,
    restAgent: TimeGrpcClient,
    restQueryClient: any
  ): Promise<CreateNoteResponse> {
    if (this.shouldUseGrpc('createNote')) {
      try {
        return await this.grpcService.createNote(request);
      } catch (error) {
        console.warn('gRPC createNote failed, falling back to REST:', error);
        // Fall back to REST implementation
        return this.createNoteRest(request, restAgent, restQueryClient);
      }
    } else {
      return this.createNoteRest(request, restAgent, restQueryClient);
    }
  }
  
  /**
   * Get a note using either gRPC or REST
   */
  async getNote(
    request: GetNoteRequest,
    restAgent: TimeGrpcClient
  ): Promise<GetNoteResponse> {
    if (this.shouldUseGrpc('getNote')) {
      try {
        return await this.grpcService.getNote(request);
      } catch (error) {
        console.warn('gRPC getNote failed, falling back to REST:', error);
        return this.getNoteRest(request, restAgent);
      }
    } else {
      return this.getNoteRest(request, restAgent);
    }
  }
  
  /**
   * Like a note using either gRPC or REST
   */
  async likeNote(
    request: LikeNoteRequest,
    restAgent: TimeGrpcClient
  ): Promise<LikeNoteResponse> {
    if (this.shouldUseGrpc('likeNote')) {
      try {
        return await this.grpcService.likeNote(request);
      } catch (error) {
        console.warn('gRPC likeNote failed, falling back to REST:', error);
        return this.likeNoteRest(request, restAgent);
      }
    } else {
      return this.likeNoteRest(request, restAgent);
    }
  }
  
  /**
   * Renote a note using either gRPC or REST
   */
  async renoteNote(
    request: RenoteNoteRequest,
    restAgent: TimeGrpcClient
  ): Promise<RenoteNoteResponse> {
    if (this.shouldUseGrpc('renoteNote')) {
      try {
        return await this.grpcService.renoteNote(request);
      } catch (error) {
        console.warn('gRPC renoteNote failed, falling back to REST:', error);
        return this.renoteNoteRest(request, restAgent);
      }
    } else {
      return this.renoteNoteRest(request, restAgent);
    }
  }
  
  /**
   * Delete a note using either gRPC or REST
   */
  async deleteNote(
    request: DeleteNoteRequest,
    restAgent: TimeGrpcClient
  ): Promise<DeleteNoteResponse> {
    if (this.shouldUseGrpc('deleteNote')) {
      try {
        return await this.grpcService.deleteNote(request);
      } catch (error) {
        console.warn('gRPC deleteNote failed, falling back to REST:', error);
        return this.deleteNoteRest(request, restAgent);
      }
    } else {
      return this.deleteNoteRest(request, restAgent);
    }
  }
  
  /**
   * Login user using either gRPC or REST
   */
  async loginUser(
    request: LoginUserRequest,
    restAgent: TimeGrpcClient
  ): Promise<LoginUserResponse> {
    if (this.shouldUseGrpc('loginUser')) {
      try {
        return await this.grpcService.loginUser(request);
      } catch (error) {
        console.warn('gRPC loginUser failed, falling back to REST:', error);
        return this.loginUserRest(request, restAgent);
      }
    } else {
      return this.loginUserRest(request, restAgent);
    }
  }
  
  /**
   * Register user using either gRPC or REST
   */
  async registerUser(
    request: RegisterUserRequest,
    restAgent: TimeGrpcClient
  ): Promise<RegisterUserResponse> {
    if (this.shouldUseGrpc('registerUser')) {
      try {
        return await this.grpcService.registerUser(request);
      } catch (error) {
        console.warn('gRPC registerUser failed, falling back to REST:', error);
        return this.registerUserRest(request, restAgent);
      }
    } else {
      return this.registerUserRest(request, restAgent);
    }
  }
  
  /**
   * Get user profile using either gRPC or REST
   */
  async getUserProfile(
    request: GetUserProfileRequest,
    restAgent: TimeGrpcClient
  ): Promise<GetUserProfileResponse> {
    if (this.shouldUseGrpc('getUserProfile')) {
      try {
        return await this.grpcService.getUserProfile(request);
      } catch (error) {
        console.warn('gRPC getUserProfile failed, falling back to REST:', error);
        return this.getUserProfileRest(request, restAgent);
      }
    } else {
      return this.getUserProfileRest(request, restAgent);
    }
  }
  
  // ============= REST IMPLEMENTATIONS =============
  
  /**
   * REST implementation for creating a note
   */
  private async createNoteRest(
    request: CreateNoteRequest,
    restAgent: TimeGrpcClient,
    restQueryClient: any
  ): Promise<CreateNoteResponse> {
    try {
      // Convert gRPC request to REST format
      const restRequest = {
        text: request.text,
        // Add other fields as needed
      };
      
      // Use existing REST API
      const response = await restAgent.post(restRequest);
      
      // Convert REST response to gRPC format
      return {
        success: true,
        note: this.convertRestNoteToGrpcNote(response.data),
        errorMessage: undefined,
      };
    } catch (error) {
      return {
        success: false,
        note: {} as any,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * REST implementation for getting a note
   */
  private async getNoteRest(
    request: GetNoteRequest,
    restAgent: TimeGrpcClient
  ): Promise<GetNoteResponse> {
    try {
      // Use existing REST API
      const response = await restAgent.getPost({
        repo: request.requestingUserId,
        rkey: request.noteId,
      });
      
      return {
        success: true,
        note: this.convertRestNoteToGrpcNote(response.data),
        userInteraction: {
          userId: request.requestingUserId,
          noteId: request.noteId,
          hasLiked: false, // Extract from response
          hasRenoted: false,
          hasBookmarked: false,
          hasReported: false,
          lastViewedAt: { seconds: Date.now() / 1000, nanos: 0 },
          interactedAt: { seconds: Date.now() / 1000, nanos: 0 },
        },
        threadNotes: [], // Extract from response if includeThread
        errorMessage: undefined,
      };
    } catch (error) {
      return {
        success: false,
        note: {} as any,
        userInteraction: {} as any,
        threadNotes: [],
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * REST implementation for liking a note
   */
  private async likeNoteRest(
    request: LikeNoteRequest,
    restAgent: TimeGrpcClient
  ): Promise<LikeNoteResponse> {
    try {
      if (request.like) {
        await restAgent.like(request.noteId, '');
      } else {
        await restAgent.deleteLike(request.noteId);
      }
      
      return {
        success: true,
        newLikeCount: 0, // Extract from response
        errorMessage: undefined,
      };
    } catch (error) {
      return {
        success: false,
        newLikeCount: 0,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * REST implementation for renoting a note
   */
  private async renoteNoteRest(
    request: RenoteNoteRequest,
    restAgent: TimeGrpcClient
  ): Promise<RenoteNoteResponse> {
    try {
      const response = await restAgent.repost(request.noteId, '');
      
      return {
        renoteNote: this.convertRestNoteToGrpcNote(response.data),
        success: true,
        errorMessage: undefined,
      };
    } catch (error) {
      return {
        renoteNote: {} as any,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * REST implementation for deleting a note
   */
  private async deleteNoteRest(
    request: DeleteNoteRequest,
    restAgent: TimeGrpcClient
  ): Promise<DeleteNoteResponse> {
    try {
      await restAgent.deletePost(request.noteId);
      
      return {
        success: true,
        errorMessage: undefined,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * REST implementation for user login
   */
  private async loginUserRest(
    request: LoginUserRequest,
    restAgent: TimeGrpcClient
  ): Promise<LoginUserResponse> {
    try {
      const response = await restAgent.login({
        identifier: request.credentials.email,
        password: request.credentials.password,
      });
      
      return {
        status: {
          code: 1, // OK
          message: 'Success',
          details: {},
        },
        accessToken: response.data.accessJwt,
        refreshToken: response.data.refreshJwt,
        expiresIn: 3600, // Extract from token
        session: {
          sessionId: response.data.did,
          userId: response.data.did,
          deviceId: '',
          deviceName: request.deviceName || 'Unknown',
          ipAddress: '',
          userAgent: '',
          type: 2, // MOBILE
          createdAt: { seconds: Date.now() / 1000, nanos: 0 },
          lastActivity: { seconds: Date.now() / 1000, nanos: 0 },
          expiresAt: { seconds: Date.now() / 1000 + 3600, nanos: 0 },
          isActive: true,
          isSuspicious: false,
          locationInfo: '',
        },
        requires2fa: false,
      };
    } catch (error) {
      return {
        status: {
          code: 2, // ERROR
          message: error instanceof Error ? error.message : 'Login failed',
          details: {},
        },
        accessToken: '',
        refreshToken: '',
        expiresIn: 0,
        session: {} as any,
        requires2fa: false,
      };
    }
  }
  
  /**
   * REST implementation for user registration
   */
  private async registerUserRest(
    request: RegisterUserRequest,
    restAgent: TimeGrpcClient
  ): Promise<RegisterUserResponse> {
    try {
      const response = await restAgent.createAccount({
        email: request.email,
        password: request.password,
        handle: request.username,
        inviteCode: request.invitationCode,
      });
      
      return {
        status: {
          code: 1, // OK
          message: 'Success',
          details: {},
        },
        user: {
          userId: response.data.did,
          username: response.data.handle,
          email: request.email,
          displayName: request.displayName,
          bio: '',
          avatarUrl: '',
          location: '',
          website: '',
          status: 1, // ACTIVE
          isVerified: false,
          isPrivate: false,
          createdAt: { seconds: Date.now() / 1000, nanos: 0 },
          updatedAt: { seconds: Date.now() / 1000, nanos: 0 },
          lastLogin: { seconds: Date.now() / 1000, nanos: 0 },
          followerCount: 0,
          followingCount: 0,
          noteCount: 0,
          settings: {},
          privacySettings: {},
        },
        verificationToken: '', // Extract from response
      };
    } catch (error) {
      return {
        status: {
          code: 2, // ERROR
          message: error instanceof Error ? error.message : 'Registration failed',
          details: {},
        },
        user: {} as any,
        verificationToken: '',
      };
    }
  }
  
  /**
   * REST implementation for getting user profile
   */
  private async getUserProfileRest(
    request: GetUserProfileRequest,
    restAgent: TimeGrpcClient
  ): Promise<GetUserProfileResponse> {
    try {
      const response = await restAgent.getProfile({
        actor: request.userId,
      });
      
      return {
        status: {
          code: 1, // OK
          message: 'Success',
          details: {},
        },
        user: {
          userId: response.data.did,
          username: response.data.handle,
          email: '',
          displayName: response.data.displayName || '',
          bio: response.data.description || '',
          avatarUrl: response.data.avatar || '',
          location: '',
          website: '',
          status: 1, // ACTIVE
          isVerified: response.data.viewer?.followedBy || false,
          isPrivate: false,
          createdAt: { seconds: Date.now() / 1000, nanos: 0 },
          updatedAt: { seconds: Date.now() / 1000, nanos: 0 },
          lastLogin: { seconds: Date.now() / 1000, nanos: 0 },
          followerCount: response.data.followersCount || 0,
          followingCount: response.data.followsCount || 0,
          noteCount: response.data.postsCount || 0,
          settings: {},
          privacySettings: {},
        },
      };
    } catch (error) {
      return {
        status: {
          code: 2, // ERROR
          message: error instanceof Error ? error.message : 'Failed to get profile',
          details: {},
        },
        user: {} as any,
      };
    }
  }
  
  /**
   * Convert REST note to gRPC note format
   */
  private convertRestNoteToGrpcNote(restNote: any): any {
    return {
      id: restNote.uri || '',
      authorId: restNote.author?.did || '',
      text: restNote.record?.text || '',
      visibility: 1, // PUBLIC
      contentWarning: 0, // NONE
      mediaIds: [],
      entities: {
        mentions: [],
        hashtags: [],
        links: [],
      },
      location: undefined,
      replyToNoteId: restNote.record?.reply?.parent?.uri,
      replyToUserId: restNote.record?.reply?.parent?.author?.did,
      threadRootId: restNote.record?.reply?.root?.uri,
      renotedNoteId: restNote.record?.repost?.uri,
      renotedUserId: restNote.record?.repost?.author?.did,
      isQuoteRenote: false,
      createdAt: { seconds: Date.now() / 1000, nanos: 0 },
      updatedAt: { seconds: Date.now() / 1000, nanos: 0 },
      deletedAt: undefined,
      metrics: {
        likeCount: restNote.likeCount || 0,
        renoteCount: restNote.repostCount || 0,
        replyCount: restNote.replyCount || 0,
        quoteCount: 0,
        bookmarkCount: 0,
        viewCount: 0,
        engagementRate: 0,
      },
      languageCode: 'en',
      flags: [],
      isVerifiedContent: false,
      clientName: 'Time Social App',
    };
  }
}

export default MigrationAdapter;