//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { NativeModules, Platform } from 'react-native';

const { TimeGrpcModule, TimeGrpcBridge } = NativeModules;

// MARK: - Types

export interface GrpcConfig {
  host: string;
  port: number;
  useTLS?: boolean;
  timeout?: number;
}

export interface TimeGrpcError {
  code: string;
  message: string;
  details?: any;
}

// MARK: - Note Types

export interface CreateNoteRequest {
  authorId: string;
  text: string;
  visibility: NoteVisibility;
  contentWarning?: ContentWarning;
  mediaIds?: string[];
  location?: GeoLocation;
  replyToNoteId?: string;
  renotedNoteId?: string;
  isQuoteRenote?: boolean;
  clientName?: string;
  idempotencyKey?: string;
}

export interface CreateNoteResponse {
  success: boolean;
  note: Note;
  errorMessage?: string;
}

export interface GetNoteRequest {
  noteId: string;
  requestingUserId: string;
  includeThread?: boolean;
}

export interface GetNoteResponse {
  success: boolean;
  note: Note;
  userInteraction: UserNoteInteraction;
  threadNotes: Note[];
  errorMessage?: string;
}

export interface DeleteNoteRequest {
  noteId: string;
  userId: string;
}

export interface DeleteNoteResponse {
  success: boolean;
  errorMessage?: string;
}

export interface LikeNoteRequest {
  noteId: string;
  userId: string;
  like: boolean;
}

export interface LikeNoteResponse {
  success: boolean;
  newLikeCount: number;
  errorMessage?: string;
}

export interface RenoteNoteRequest {
  noteId: string;
  userId: string;
  isQuoteRenote?: boolean;
  quoteText?: string;
}

export interface RenoteNoteResponse {
  renoteNote: Note;
  success: boolean;
  errorMessage?: string;
}

// MARK: - User Types

export interface LoginUserRequest {
  credentials: AuthCredentials;
  deviceName?: string;
}

export interface LoginUserResponse {
  status: Status;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  session: Session;
  requires2fa: boolean;
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

export interface RegisterUserResponse {
  status: Status;
  user: UserProfile;
  verificationToken: string;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyTokenResponse {
  status: Status;
  user: UserProfile;
  session: Session;
}

export interface GetUserProfileRequest {
  userId: string;
}

export interface GetUserProfileResponse {
  status: Status;
  user: UserProfile;
}

// MARK: - Common Types

export enum NoteVisibility {
  UNKNOWN = 0,
  PUBLIC = 1,
  FOLLOWERS = 2,
  FRIENDS = 3,
  PRIVATE = 4,
  MENTIONED = 5,
}

export enum ContentWarning {
  NONE = 0,
  SENSITIVE = 1,
  ADULT = 2,
  VIOLENCE = 3,
  POLITICAL = 4,
}

export enum StatusCode {
  UNKNOWN = 0,
  OK = 1,
  ERROR = 2,
  INVALID_REQUEST = 3,
  UNAUTHORIZED = 4,
  FORBIDDEN = 5,
  NOT_FOUND = 6,
  CONFLICT = 7,
  INTERNAL_ERROR = 8,
  SERVICE_UNAVAILABLE = 9,
}

export interface Status {
  code: StatusCode;
  message: string;
  details: Record<string, string>;
}

export interface Timestamp {
  seconds: number;
  nanos: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  placeName: string;
  countryCode: string;
}

export interface NoteEntities {
  mentions: NoteMention[];
  hashtags: NoteHashtag[];
  links: NoteLink[];
}

export interface NoteMention {
  userId: string;
  username: string;
  startOffset: number;
  endOffset: number;
}

export interface NoteHashtag {
  tag: string;
  startOffset: number;
  endOffset: number;
}

export interface NoteLink {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  startOffset: number;
  endOffset: number;
}

export interface NoteMetrics {
  likeCount: number;
  renoteCount: number;
  replyCount: number;
  quoteCount: number;
  bookmarkCount: number;
  viewCount: number;
  engagementRate: number;
}

export interface Note {
  id: string;
  authorId: string;
  text: string;
  visibility: NoteVisibility;
  contentWarning: ContentWarning;
  mediaIds: string[];
  entities: NoteEntities;
  location?: GeoLocation;
  replyToNoteId?: string;
  replyToUserId?: string;
  threadRootId?: string;
  renotedNoteId?: string;
  renotedUserId?: string;
  isQuoteRenote: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
  metrics: NoteMetrics;
  languageCode: string;
  flags: string[];
  isVerifiedContent: boolean;
  clientName: string;
}

export interface UserNoteInteraction {
  userId: string;
  noteId: string;
  hasLiked: boolean;
  hasRenoted: boolean;
  hasBookmarked: boolean;
  hasReported: boolean;
  lastViewedAt: Timestamp;
  interactedAt: Timestamp;
}

export interface AuthCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface Session {
  sessionId: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  userAgent: string;
  type: number;
  createdAt: Timestamp;
  lastActivity: Timestamp;
  expiresAt: Timestamp;
  isActive: boolean;
  isSuspicious: boolean;
  locationInfo: string;
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin: Timestamp;
  followerCount: number;
  followingCount: number;
  noteCount: number;
  settings: Record<string, string>;
  privacySettings: Record<string, string>;
}

// MARK: - Time gRPC Service

/**
 * Main Time gRPC service providing access to all gRPC functionality
 * Handles platform-specific native module calls
 */
export class TimeGrpcService {
  private static instance: TimeGrpcService;
  private isInitialized = false;
  private config?: GrpcConfig;
  
  static getInstance(): TimeGrpcService {
    if (!TimeGrpcService.instance) {
      TimeGrpcService.instance = new TimeGrpcService();
    }
    return TimeGrpcService.instance;
  }
  
  async initialize(config: GrpcConfig): Promise<void> {
    if (this.isInitialized) return;
    
    this.config = config;
    
    const module = Platform.OS === 'ios' ? TimeGrpcBridge : TimeGrpcModule;
    
    try {
      await module.initializeClient(config.host, config.port);
      this.isInitialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize gRPC client: ${error}`);
    }
  }
  
  private getModule() {
    if (!this.isInitialized) {
      throw new Error('gRPC service not initialized. Call initialize() first.');
    }
    return Platform.OS === 'ios' ? TimeGrpcBridge : TimeGrpcModule;
  }
  
  // MARK: - Note Service Methods
  
  async createNote(request: CreateNoteRequest): Promise<CreateNoteResponse> {
    const module = this.getModule();
    return module.createNote(request);
  }
  
  async getNote(request: GetNoteRequest): Promise<GetNoteResponse> {
    const module = this.getModule();
    return module.getNote(request);
  }
  
  async deleteNote(request: DeleteNoteRequest): Promise<DeleteNoteResponse> {
    const module = this.getModule();
    return module.deleteNote(request);
  }
  
  async likeNote(request: LikeNoteRequest): Promise<LikeNoteResponse> {
    const module = this.getModule();
    return module.likeNote(request);
  }
  
  async renoteNote(request: RenoteNoteRequest): Promise<RenoteNoteResponse> {
    const module = this.getModule();
    return module.renoteNote(request);
  }
  
  // MARK: - User Service Methods
  
  async loginUser(request: LoginUserRequest): Promise<LoginUserResponse> {
    const module = this.getModule();
    return module.loginUser(request);
  }
  
  async registerUser(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const module = this.getModule();
    return module.registerUser(request);
  }
  
  async verifyToken(request: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    const module = this.getModule();
    return module.verifyToken(request);
  }
  
  async getUserProfile(request: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    const module = this.getModule();
    return module.getUserProfile(request);
  }
  
  // MARK: - Health Check
  
  async healthCheck(): Promise<{ success: boolean; status: string }> {
    const module = this.getModule();
    return module.healthCheck();
  }
  
  // MARK: - Utility Methods
  
  isReady(): boolean {
    return this.isInitialized;
  }
  
  getConfig(): GrpcConfig | undefined {
    return this.config;
  }
}

// MARK: - Default Export

export default TimeGrpcService;