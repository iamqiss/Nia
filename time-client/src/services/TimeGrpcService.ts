//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { NativeModules, Platform } from 'react-native';

const { TimeGrpcBridge } = NativeModules;

// Type definitions for gRPC service responses
export interface GrpcResponse<T = any> {
  success: boolean;
  errorMessage?: string;
  data?: T;
}

export interface Note {
  id: string;
  authorId: string;
  text: string;
  visibility: number;
  contentWarning: number;
  mediaIds: string[];
  entities: {
    mentions: Array<{
      userId: string;
      username: string;
      startOffset: number;
      endOffset: number;
    }>;
    hashtags: Array<{
      tag: string;
      startOffset: number;
      endOffset: number;
    }>;
    links: Array<{
      url: string;
      title: string;
      description: string;
      imageUrl: string;
      startOffset: number;
      endOffset: number;
    }>;
  };
  location?: {
    latitude: number;
    longitude: number;
    placeName: string;
    countryCode: string;
  };
  replyToNoteId?: string;
  replyToUserId?: string;
  threadRootId?: string;
  renotedNoteId?: string;
  renotedUserId?: string;
  isQuoteRenote: boolean;
  createdAt: {
    seconds: number;
    nanos: number;
  };
  updatedAt: {
    seconds: number;
    nanos: number;
  };
  deletedAt?: {
    seconds: number;
    nanos: number;
  };
  metrics: {
    likeCount: number;
    renoteCount: number;
    replyCount: number;
    quoteCount: number;
    bookmarkCount: number;
    viewCount: number;
    engagementRate: number;
  };
  languageCode: string;
  flags: number;
  isVerifiedContent: boolean;
  clientName?: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  location: string;
  website: string;
  status: number;
  isVerified: boolean;
  isPrivate: boolean;
  createdAt: {
    seconds: number;
    nanos: number;
  };
  updatedAt: {
    seconds: number;
    nanos: number;
  };
  lastLogin: {
    seconds: number;
    nanos: number;
  };
  followerCount: number;
  followingCount: number;
  noteCount: number;
  settings: any;
  privacySettings: any;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  messageType: number;
  attachmentIds: string[];
  createdAt: {
    seconds: number;
    nanos: number;
  };
  updatedAt: {
    seconds: number;
    nanos: number;
  };
  isRead: boolean;
  isEdited: boolean;
}

export interface Draft {
  id: string;
  userId: string;
  title?: string;
  content: string;
  mediaIds: string[];
  createdAt: {
    seconds: number;
    nanos: number;
  };
  updatedAt: {
    seconds: number;
    nanos: number;
  };
  isAutoSaved: boolean;
}

export interface List {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  memberCount: number;
  createdAt: {
    seconds: number;
    nanos: number;
  };
  updatedAt: {
    seconds: number;
    nanos: number;
  };
}

export interface Starterpack {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category?: string;
  isPublic: boolean;
  itemCount: number;
  createdAt: {
    seconds: number;
    nanos: number;
  };
  updatedAt: {
    seconds: number;
    nanos: number;
  };
}

// Request interfaces
export interface CreateNoteRequest {
  authorId: string;
  text: string;
  visibility?: number;
  contentWarning?: number;
  mediaIds?: string[];
  location?: {
    latitude: number;
    longitude: number;
    placeName?: string;
    countryCode?: string;
  };
  replyToNoteId?: string;
  renotedNoteId?: string;
  isQuoteRenote?: boolean;
  clientName?: string;
  idempotencyKey?: string;
}

export interface GetNoteRequest {
  noteId: string;
  requestingUserId: string;
  includeThread?: boolean;
}

export interface DeleteNoteRequest {
  noteId: string;
  userId: string;
}

export interface LikeNoteRequest {
  noteId: string;
  userId: string;
  like: boolean;
}

export interface RenoteNoteRequest {
  noteId: string;
  userId: string;
  isQuoteRenote?: boolean;
  quoteText?: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
  deviceName?: string;
}

export interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  invitationCode?: string;
  acceptTerms?: boolean;
  acceptPrivacy?: boolean;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface GetUserProfileRequest {
  userId: string;
}

export interface InitiateFanoutRequest {
  noteId: string;
  userId: string;
}

export interface GetFanoutJobStatusRequest {
  jobId: string;
}

export interface SendMessageRequest {
  senderId: string;
  recipientId: string;
  content: string;
  messageType?: number;
  attachmentIds?: string[];
}

export interface GetMessagesRequest {
  userId: string;
  chatId: string;
  limit?: number;
  offset?: number;
}

export interface SearchUsersRequest {
  query: string;
  limit?: number;
  offset?: number;
}

export interface SearchNotesRequest {
  query: string;
  limit?: number;
  offset?: number;
}

export interface CreateDraftRequest {
  userId: string;
  content: string;
  title?: string;
  mediaIds?: string[];
}

export interface GetUserDraftsRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface CreateListRequest {
  userId: string;
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface GetUserListsRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface CreateStarterpackRequest {
  userId: string;
  name: string;
  description?: string;
  category?: string;
  isPublic?: boolean;
}

export interface GetUserStarterpacksRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

/**
 * Time gRPC Service - React Native interface to native gRPC functionality
 * Provides type-safe access to all gRPC services from JavaScript/TypeScript
 */
export class TimeGrpcService {
  private static instance: TimeGrpcService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): TimeGrpcService {
    if (!TimeGrpcService.instance) {
      TimeGrpcService.instance = new TimeGrpcService();
    }
    return TimeGrpcService.instance;
  }

  /**
   * Initialize the gRPC client
   */
  public async initializeClient(host: string, port: number): Promise<GrpcResponse> {
    try {
      const result = await TimeGrpcBridge.initializeClient(host, port);
      this.isInitialized = true;
      return result;
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to initialize gRPC client'
      };
    }
  }

  /**
   * Check if the client is initialized
   */
  public isClientInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Health check
   */
  public async healthCheck(): Promise<GrpcResponse> {
    try {
      return await TimeGrpcBridge.healthCheck();
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Health check failed'
      };
    }
  }

  // MARK: - Note Service Methods

  /**
   * Create a new note
   */
  public async createNote(request: CreateNoteRequest): Promise<GrpcResponse<{ note: Note }>> {
    try {
      return await TimeGrpcBridge.createNote(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to create note'
      };
    }
  }

  /**
   * Get a note by ID
   */
  public async getNote(request: GetNoteRequest): Promise<GrpcResponse<{ note: Note; userInteraction: any; threadNotes: Note[] }>> {
    try {
      return await TimeGrpcBridge.getNote(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to get note'
      };
    }
  }

  /**
   * Delete a note
   */
  public async deleteNote(request: DeleteNoteRequest): Promise<GrpcResponse> {
    try {
      return await TimeGrpcBridge.deleteNote(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to delete note'
      };
    }
  }

  /**
   * Like or unlike a note
   */
  public async likeNote(request: LikeNoteRequest): Promise<GrpcResponse<{ newLikeCount: number }>> {
    try {
      return await TimeGrpcBridge.likeNote(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to like note'
      };
    }
  }

  /**
   * Renote a note
   */
  public async renoteNote(request: RenoteNoteRequest): Promise<GrpcResponse<{ renoteNote: Note }>> {
    try {
      return await TimeGrpcBridge.renoteNote(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to renote note'
      };
    }
  }

  // MARK: - User Service Methods

  /**
   * Login user
   */
  public async loginUser(request: LoginUserRequest): Promise<GrpcResponse<{ accessToken: string; refreshToken: string; expiresIn: number; session: any; requires2fa: boolean }>> {
    try {
      return await TimeGrpcBridge.loginUser(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to login user'
      };
    }
  }

  /**
   * Register user
   */
  public async registerUser(request: RegisterUserRequest): Promise<GrpcResponse<{ user: UserProfile; verificationToken: string }>> {
    try {
      return await TimeGrpcBridge.registerUser(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to register user'
      };
    }
  }

  /**
   * Verify token
   */
  public async verifyToken(request: VerifyTokenRequest): Promise<GrpcResponse<{ user: UserProfile; session: any }>> {
    try {
      return await TimeGrpcBridge.verifyToken(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to verify token'
      };
    }
  }

  /**
   * Get user profile
   */
  public async getUserProfile(request: GetUserProfileRequest): Promise<GrpcResponse<{ user: UserProfile }>> {
    try {
      return await TimeGrpcBridge.getUserProfile(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to get user profile'
      };
    }
  }

  // MARK: - Fanout Service Methods

  /**
   * Initiate fanout for a note
   */
  public async initiateFanout(request: InitiateFanoutRequest): Promise<GrpcResponse<{ jobId: string }>> {
    try {
      return await TimeGrpcBridge.initiateFanout(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to initiate fanout'
      };
    }
  }

  /**
   * Get fanout job status
   */
  public async getFanoutJobStatus(request: GetFanoutJobStatusRequest): Promise<GrpcResponse<{ status: string; progress: number; totalFollowers: number; processedFollowers: number }>> {
    try {
      return await TimeGrpcBridge.getFanoutJobStatus(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to get fanout job status'
      };
    }
  }

  // MARK: - Messaging Service Methods

  /**
   * Send a message
   */
  public async sendMessage(request: SendMessageRequest): Promise<GrpcResponse<{ message: Message }>> {
    try {
      return await TimeGrpcBridge.sendMessage(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to send message'
      };
    }
  }

  /**
   * Get messages
   */
  public async getMessages(request: GetMessagesRequest): Promise<GrpcResponse<{ messages: Message[]; hasMore: boolean }>> {
    try {
      return await TimeGrpcBridge.getMessages(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to get messages'
      };
    }
  }

  // MARK: - Search Service Methods

  /**
   * Search users
   */
  public async searchUsers(request: SearchUsersRequest): Promise<GrpcResponse<{ users: UserProfile[]; hasMore: boolean }>> {
    try {
      return await TimeGrpcBridge.searchUsers(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to search users'
      };
    }
  }

  /**
   * Search notes
   */
  public async searchNotes(request: SearchNotesRequest): Promise<GrpcResponse<{ notes: Note[]; hasMore: boolean }>> {
    try {
      return await TimeGrpcBridge.searchNotes(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to search notes'
      };
    }
  }

  // MARK: - Drafts Service Methods

  /**
   * Create a draft
   */
  public async createDraft(request: CreateDraftRequest): Promise<GrpcResponse<{ draft: Draft }>> {
    try {
      return await TimeGrpcBridge.createDraft(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to create draft'
      };
    }
  }

  /**
   * Get user drafts
   */
  public async getUserDrafts(request: GetUserDraftsRequest): Promise<GrpcResponse<{ drafts: Draft[]; hasMore: boolean }>> {
    try {
      return await TimeGrpcBridge.getUserDrafts(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to get user drafts'
      };
    }
  }

  // MARK: - List Service Methods

  /**
   * Create a list
   */
  public async createList(request: CreateListRequest): Promise<GrpcResponse<{ list: List }>> {
    try {
      return await TimeGrpcBridge.createList(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to create list'
      };
    }
  }

  /**
   * Get user lists
   */
  public async getUserLists(request: GetUserListsRequest): Promise<GrpcResponse<{ lists: List[]; hasMore: boolean }>> {
    try {
      return await TimeGrpcBridge.getUserLists(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to get user lists'
      };
    }
  }

  // MARK: - Starterpack Service Methods

  /**
   * Create a starterpack
   */
  public async createStarterpack(request: CreateStarterpackRequest): Promise<GrpcResponse<{ starterpack: Starterpack }>> {
    try {
      return await TimeGrpcBridge.createStarterpack(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to create starterpack'
      };
    }
  }

  /**
   * Get user starterpacks
   */
  public async getUserStarterpacks(request: GetUserStarterpacksRequest): Promise<GrpcResponse<{ starterpacks: Starterpack[]; hasMore: boolean }>> {
    try {
      return await TimeGrpcBridge.getUserStarterpacks(request);
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Failed to get user starterpacks'
      };
    }
  }
}

// Export singleton instance
export const timeGrpcService = TimeGrpcService.getInstance();

// Export default
export default timeGrpcService;