//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { Platform } from 'react-native';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

// MARK: - Configuration

export interface GrpcClientConfig {
  host: string;
  port: number;
  useTLS?: boolean;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

// MARK: - Error Handling

export class GrpcError extends Error {
  constructor(
    public code: grpc.status,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GrpcError';
  }
}

// MARK: - Service Interfaces

export interface NoteService {
  createNote(request: CreateNoteRequest): Promise<CreateNoteResponse>;
  getNote(request: GetNoteRequest): Promise<GetNoteResponse>;
  deleteNote(request: DeleteNoteRequest): Promise<DeleteNoteResponse>;
  likeNote(request: LikeNoteRequest): Promise<LikeNoteResponse>;
  renoteNote(request: RenoteNoteRequest): Promise<RenoteNoteResponse>;
  getUserNotes(request: GetUserNotesRequest): Promise<GetUserNotesResponse>;
  getNoteThread(request: GetNoteThreadRequest): Promise<GetNoteThreadResponse>;
  searchNotes(request: SearchNotesRequest): Promise<SearchNotesResponse>;
}

export interface UserService {
  registerUser(request: RegisterUserRequest): Promise<RegisterUserResponse>;
  loginUser(request: LoginUserRequest): Promise<LoginUserResponse>;
  logoutUser(request: LogoutRequest): Promise<LogoutResponse>;
  verifyToken(request: VerifyTokenRequest): Promise<VerifyTokenResponse>;
  refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse>;
  getUserProfile(request: GetUserProfileRequest): Promise<GetUserProfileResponse>;
  updateUserProfile(request: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse>;
  changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse>;
  resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse>;
  confirmPasswordReset(request: ConfirmPasswordResetRequest): Promise<ConfirmPasswordResetResponse>;
}

export interface TimelineService {
  getTimeline(request: GetTimelineRequest): Promise<GetTimelineResponse>;
  getUserTimeline(request: GetUserTimelineRequest): Promise<GetUserTimelineResponse>;
  refreshTimeline(request: RefreshTimelineRequest): Promise<RefreshTimelineResponse>;
  markTimelineRead(request: MarkTimelineReadRequest): Promise<MarkTimelineReadResponse>;
  updateTimelinePreferences(request: UpdateTimelinePreferencesRequest): Promise<UpdateTimelinePreferencesResponse>;
  getTimelinePreferences(request: GetTimelinePreferencesRequest): Promise<GetTimelinePreferencesResponse>;
  subscribeTimelineUpdates(request: SubscribeTimelineUpdatesRequest): grpc.ClientReadableStream<TimelineUpdate>;
}

export interface MediaService {
  upload(request: grpc.ClientWritableStream<UploadRequest>): Promise<UploadResponse>;
  getMedia(request: GetMediaRequest): Promise<GetMediaResponse>;
  deleteMedia(request: DeleteMediaRequest): Promise<DeleteMediaResponse>;
  listUserMedia(request: ListUserMediaRequest): Promise<ListUserMediaResponse>;
  toggleMediaLike(request: ToggleMediaLikeRequest): Promise<ToggleMediaLikeResponse>;
}

export interface NotificationService {
  registerDevice(request: DeviceRegistrationRequest): Promise<DeviceRegistrationResponse>;
  updateDevice(request: DeviceUpdateRequest): Promise<DeviceUpdateResponse>;
  unregisterDevice(request: DeviceUnregistrationRequest): Promise<DeviceUnregistrationResponse>;
  getDeviceInfo(request: DeviceInfoRequest): Promise<DeviceInfoResponse>;
  sendPushNotification(request: SendPushNotificationRequest): Promise<SendPushNotificationResponse>;
  sendBatchPushNotification(request: SendBatchPushNotificationRequest): Promise<SendBatchPushNotificationResponse>;
  acknowledgeNotification(request: NotificationAcknowledgmentRequest): Promise<NotificationAcknowledgmentResponse>;
  syncNotificationPreferences(request: NotificationPreferencesRequest): Promise<NotificationPreferencesResponse>;
  getNotificationStats(request: NotificationStatsRequest): Promise<NotificationStatsResponse>;
  streamNotificationUpdates(): grpc.ClientReadableStream<NotificationUpdate>;
}

// MARK: - Request/Response Types

// Note Service Types
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

export interface GetUserNotesRequest {
  userId: string;
  requestingUserId: string;
  pagination: PaginationRequest;
  includeReplies?: boolean;
  includeRenotes?: boolean;
}

export interface GetUserNotesResponse {
  notes: Note[];
  pagination: PaginationResponse;
  success: boolean;
  errorMessage?: string;
}

export interface GetNoteThreadRequest {
  noteId: string;
  requestingUserId: string;
  pagination: PaginationRequest;
}

export interface GetNoteThreadResponse {
  rootNote: Note;
  replies: Note[];
  pagination: PaginationResponse;
  success: boolean;
  errorMessage?: string;
}

export interface SearchNotesRequest {
  query: string;
  requestingUserId: string;
  pagination: PaginationRequest;
  language?: string;
  authorId?: string;
  hashtags?: string[];
  since?: Timestamp;
  until?: Timestamp;
  verifiedOnly?: boolean;
}

export interface SearchNotesResponse {
  notes: Note[];
  pagination: PaginationResponse;
  success: boolean;
  errorMessage?: string;
}

// User Service Types
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

export interface LogoutRequest {
  sessionId: string;
  logoutAllDevices?: boolean;
}

export interface LogoutResponse {
  status: Status;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyTokenResponse {
  status: Status;
  user: UserProfile;
  session: Session;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  status: Status;
  accessToken: string;
  expiresIn: number;
}

export interface GetUserProfileRequest {
  userId: string;
}

export interface GetUserProfileResponse {
  status: Status;
  user: UserProfile;
}

export interface UpdateUserProfileRequest {
  userId: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  isPrivate?: boolean;
  settings?: Record<string, string>;
}

export interface UpdateUserProfileResponse {
  status: Status;
  user: UserProfile;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  status: Status;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  status: Status;
  resetToken: string;
}

export interface ConfirmPasswordResetRequest {
  resetToken: string;
  newPassword: string;
}

export interface ConfirmPasswordResetResponse {
  status: Status;
}

// Timeline Service Types
export interface GetTimelineRequest {
  userId: string;
  algorithm?: TimelineAlgorithm;
  pagination: PaginationRequest;
  includeRankingSignals?: boolean;
  realTimeUpdates?: boolean;
}

export interface GetTimelineResponse {
  items: TimelineItem[];
  metadata: TimelineMetadata;
  pagination: PaginationResponse;
  success: boolean;
  errorMessage?: string;
}

export interface GetUserTimelineRequest {
  targetUserId: string;
  requestingUserId: string;
  pagination: PaginationRequest;
  includeReplies?: boolean;
  includeRenotes?: boolean;
}

export interface GetUserTimelineResponse {
  items: TimelineItem[];
  pagination: PaginationResponse;
  success: boolean;
  errorMessage?: string;
}

export interface RefreshTimelineRequest {
  userId: string;
  since?: Timestamp;
  maxItems?: number;
}

export interface RefreshTimelineResponse {
  newItems: TimelineItem[];
  totalNewItems: number;
  hasMore: boolean;
  success: boolean;
  errorMessage?: string;
}

export interface MarkTimelineReadRequest {
  userId: string;
  readUntil: Timestamp;
}

export interface MarkTimelineReadResponse {
  success: boolean;
  errorMessage?: string;
}

export interface UpdateTimelinePreferencesRequest {
  userId: string;
  preferences: TimelinePreferences;
}

export interface UpdateTimelinePreferencesResponse {
  success: boolean;
  errorMessage?: string;
}

export interface GetTimelinePreferencesRequest {
  userId: string;
}

export interface GetTimelinePreferencesResponse {
  preferences: TimelinePreferences;
  success: boolean;
  errorMessage?: string;
}

export interface SubscribeTimelineUpdatesRequest {
  userId: string;
  includeMetadata?: boolean;
}

// Media Service Types
export interface UploadInit {
  ownerUserId: string;
  type: MediaType;
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
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  hlsUrl?: string;
  webpUrl?: string;
  mp4Url?: string;
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

// Notification Service Types
export interface DeviceRegistrationRequest {
  userId: string;
  deviceToken: string;
  platform: string;
  appVersion: string;
  osVersion: string;
  deviceModel: string;
  timezone: string;
  language: string;
  deviceCapabilities: Record<string, string>;
  registeredAt: Timestamp;
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
  updatedAt: Timestamp;
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
  metadata: Record<string, string>;
}

export interface NotificationAcknowledgmentResponse {
  success: boolean;
  message: string;
}

export interface NotificationPreferencesRequest {
  userId: string;
  preferences: Record<string, NotificationPreference>;
  updatedAt: Timestamp;
}

export interface NotificationPreference {
  enabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  frequency: string;
  customSettings: Record<string, string>;
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
  imageUrl?: string;
  sound?: string;
  badgeCount?: number;
  scheduledAt?: Timestamp;
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
  startDate: Timestamp;
  endDate: Timestamp;
  eventType: string;
}

export interface NotificationStatsResponse {
  success: boolean;
  stats: Record<string, number>;
  deliveryRate: number;
  openRate: number;
  dismissalRate: number;
  lastUpdated: Timestamp;
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
  lastSeen: Timestamp;
  registeredAt: Timestamp;
}

export interface NotificationUpdate {
  type: string;
  userId: string;
  data: Record<string, string>;
  timestamp: Timestamp;
}

// MARK: - Data Types

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

export enum TimelineAlgorithm {
  UNKNOWN = 0,
  CHRONOLOGICAL = 1,
  ALGORITHMIC = 2,
  HYBRID = 3,
}

export enum MediaType {
  UNKNOWN = 0,
  IMAGE = 1,
  VIDEO = 2,
  GIF = 3,
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

export interface PaginationRequest {
  limit: number;
  cursor?: string;
}

export interface PaginationResponse {
  limit: number;
  cursor?: string;
  hasMore: boolean;
  totalCount?: number;
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

export interface TimelineItem {
  note: Note;
  source: ContentSource;
  rankingSignals: RankingSignals;
  injectedAt: Timestamp;
  finalScore: number;
  injectionReason: string;
  positionInTimeline: number;
}

export interface ContentSource {
  type: string;
  name: string;
}

export interface RankingSignals {
  authorAffinityScore: number;
  contentQualityScore: number;
  engagementVelocity: number;
  recencyScore: number;
  personalizationScore: number;
  diversityScore: number;
  isReplyToFollowing: boolean;
  mutualFollowerInteractions: number;
}

export interface TimelineMetadata {
  totalItems: number;
  newItemsSinceLastFetch: number;
  lastUpdated: Timestamp;
  lastUserRead: Timestamp;
  algorithmUsed: TimelineAlgorithm;
  timelineVersion: string;
  algorithmParams: Record<string, number>;
}

export interface TimelinePreferences {
  preferredAlgorithm: TimelineAlgorithm;
  showReplies: boolean;
  showRenotes: boolean;
  showRecommendedContent: boolean;
  showTrendingContent: boolean;
  sensitiveContentWarning: boolean;
  mutedKeywords: string[];
  mutedUsers: string[];
  preferredLanguages: string[];
  timelineRefreshMinutes: number;
}

export interface TimelineUpdate {
  type: string;
  newItems: TimelineItem[];
  updatedItemIds: string[];
  deletedItemIds: string[];
  totalNewItems: number;
  updateTimestamp: Timestamp;
}

export interface Media {
  id: string;
  ownerUserId: string;
  type: MediaType;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  durationSeconds: number;
  originalUrl: string;
  thumbnailUrl?: string;
  hlsUrl?: string;
  createdAt: string;
  webpUrl?: string;
  mp4Url?: string;
}

// MARK: - Main gRPC Client

export class TimeGrpcClient {
  private static instance: TimeGrpcClient;
  private noteService: NoteService;
  private userService: UserService;
  private timelineService: TimelineService;
  private mediaService: MediaService;
  private notificationService: NotificationService;
  private isInitialized = false;
  private config?: GrpcClientConfig;

  private constructor() {
    // Initialize will be called separately
  }

  static getInstance(): TimeGrpcClient {
    if (!TimeGrpcClient.instance) {
      TimeGrpcClient.instance = new TimeGrpcClient();
    }
    return TimeGrpcClient.instance;
  }

  async initialize(config: GrpcClientConfig): Promise<void> {
    if (this.isInitialized) return;

    this.config = config;

    try {
      // Load proto files
      const protoPath = Platform.OS === 'ios' 
        ? join(__dirname, '../../../modules/time-push-notifications/proto')
        : join(__dirname, '../../../modules/time-push-notifications/proto');

      // Note Service
      const notePackageDefinition = protoLoader.loadSync(
        join(protoPath, 'note_service.proto'),
        {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        }
      );

      const noteProto = grpc.loadPackageDefinition(notePackageDefinition) as any;
      const noteServiceClient = new noteProto.sonet.note.NoteService(
        `${config.host}:${config.port}`,
        config.useTLS ? grpc.credentials.createSsl() : grpc.credentials.createInsecure()
      );

      this.noteService = {
        createNote: this.wrapGrpcCall(noteServiceClient.createNote.bind(noteServiceClient)),
        getNote: this.wrapGrpcCall(noteServiceClient.getNote.bind(noteServiceClient)),
        deleteNote: this.wrapGrpcCall(noteServiceClient.deleteNote.bind(noteServiceClient)),
        likeNote: this.wrapGrpcCall(noteServiceClient.likeNote.bind(noteServiceClient)),
        renoteNote: this.wrapGrpcCall(noteServiceClient.renoteNote.bind(noteServiceClient)),
        getUserNotes: this.wrapGrpcCall(noteServiceClient.getUserNotes.bind(noteServiceClient)),
        getNoteThread: this.wrapGrpcCall(noteServiceClient.getNoteThread.bind(noteServiceClient)),
        searchNotes: this.wrapGrpcCall(noteServiceClient.searchNotes.bind(noteServiceClient)),
      };

      // User Service
      const userPackageDefinition = protoLoader.loadSync(
        join(protoPath, 'user_service.proto'),
        {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        }
      );

      const userProto = grpc.loadPackageDefinition(userPackageDefinition) as any;
      const userServiceClient = new userProto.sonet.user.UserService(
        `${config.host}:${config.port}`,
        config.useTLS ? grpc.credentials.createSsl() : grpc.credentials.createInsecure()
      );

      this.userService = {
        registerUser: this.wrapGrpcCall(userServiceClient.registerUser.bind(userServiceClient)),
        loginUser: this.wrapGrpcCall(userServiceClient.loginUser.bind(userServiceClient)),
        logoutUser: this.wrapGrpcCall(userServiceClient.logoutUser.bind(userServiceClient)),
        verifyToken: this.wrapGrpcCall(userServiceClient.verifyToken.bind(userServiceClient)),
        refreshToken: this.wrapGrpcCall(userServiceClient.refreshToken.bind(userServiceClient)),
        getUserProfile: this.wrapGrpcCall(userServiceClient.getUserProfile.bind(userServiceClient)),
        updateUserProfile: this.wrapGrpcCall(userServiceClient.updateUserProfile.bind(userServiceClient)),
        changePassword: this.wrapGrpcCall(userServiceClient.changePassword.bind(userServiceClient)),
        resetPassword: this.wrapGrpcCall(userServiceClient.resetPassword.bind(userServiceClient)),
        confirmPasswordReset: this.wrapGrpcCall(userServiceClient.confirmPasswordReset.bind(userServiceClient)),
      };

      // Timeline Service
      const timelinePackageDefinition = protoLoader.loadSync(
        join(protoPath, 'timeline_service.proto'),
        {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        }
      );

      const timelineProto = grpc.loadPackageDefinition(timelinePackageDefinition) as any;
      const timelineServiceClient = new timelineProto.sonet.timeline.TimelineService(
        `${config.host}:${config.port}`,
        config.useTLS ? grpc.credentials.createSsl() : grpc.credentials.createInsecure()
      );

      this.timelineService = {
        getTimeline: this.wrapGrpcCall(timelineServiceClient.getTimeline.bind(timelineServiceClient)),
        getUserTimeline: this.wrapGrpcCall(timelineServiceClient.getUserTimeline.bind(timelineServiceClient)),
        refreshTimeline: this.wrapGrpcCall(timelineServiceClient.refreshTimeline.bind(timelineServiceClient)),
        markTimelineRead: this.wrapGrpcCall(timelineServiceClient.markTimelineRead.bind(timelineServiceClient)),
        updateTimelinePreferences: this.wrapGrpcCall(timelineServiceClient.updateTimelinePreferences.bind(timelineServiceClient)),
        getTimelinePreferences: this.wrapGrpcCall(timelineServiceClient.getTimelinePreferences.bind(timelineServiceClient)),
        subscribeTimelineUpdates: timelineServiceClient.subscribeTimelineUpdates.bind(timelineServiceClient),
      };

      // Media Service
      const mediaPackageDefinition = protoLoader.loadSync(
        join(protoPath, 'media_service.proto'),
        {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        }
      );

      const mediaProto = grpc.loadPackageDefinition(mediaPackageDefinition) as any;
      const mediaServiceClient = new mediaProto.sonet.media.MediaService(
        `${config.host}:${config.port}`,
        config.useTLS ? grpc.credentials.createSsl() : grpc.credentials.createInsecure()
      );

      this.mediaService = {
        upload: this.wrapGrpcStreamCall(mediaServiceClient.upload.bind(mediaServiceClient)),
        getMedia: this.wrapGrpcCall(mediaServiceClient.getMedia.bind(mediaServiceClient)),
        deleteMedia: this.wrapGrpcCall(mediaServiceClient.deleteMedia.bind(mediaServiceClient)),
        listUserMedia: this.wrapGrpcCall(mediaServiceClient.listUserMedia.bind(mediaServiceClient)),
        toggleMediaLike: this.wrapGrpcCall(mediaServiceClient.toggleMediaLike.bind(mediaServiceClient)),
      };

      // Notification Service
      const notificationPackageDefinition = protoLoader.loadSync(
        join(protoPath, 'time_notification_service.proto'),
        {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        }
      );

      const notificationProto = grpc.loadPackageDefinition(notificationPackageDefinition) as any;
      const notificationServiceClient = new notificationProto.time.notification.TimeNotificationService(
        `${config.host}:${config.port}`,
        config.useTLS ? grpc.credentials.createSsl() : grpc.credentials.createInsecure()
      );

      this.notificationService = {
        registerDevice: this.wrapGrpcCall(notificationServiceClient.registerDevice.bind(notificationServiceClient)),
        updateDevice: this.wrapGrpcCall(notificationServiceClient.updateDevice.bind(notificationServiceClient)),
        unregisterDevice: this.wrapGrpcCall(notificationServiceClient.unregisterDevice.bind(notificationServiceClient)),
        getDeviceInfo: this.wrapGrpcCall(notificationServiceClient.getDeviceInfo.bind(notificationServiceClient)),
        sendPushNotification: this.wrapGrpcCall(notificationServiceClient.sendPushNotification.bind(notificationServiceClient)),
        sendBatchPushNotification: this.wrapGrpcCall(notificationServiceClient.sendBatchPushNotification.bind(notificationServiceClient)),
        acknowledgeNotification: this.wrapGrpcCall(notificationServiceClient.acknowledgeNotification.bind(notificationServiceClient)),
        syncNotificationPreferences: this.wrapGrpcCall(notificationServiceClient.syncNotificationPreferences.bind(notificationServiceClient)),
        getNotificationStats: this.wrapGrpcCall(notificationServiceClient.getNotificationStats.bind(notificationServiceClient)),
        streamNotificationUpdates: notificationServiceClient.streamNotificationUpdates.bind(notificationServiceClient),
      };

      this.isInitialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize gRPC client: ${error}`);
    }
  }

  private wrapGrpcCall<TRequest, TResponse>(
    grpcCall: (request: TRequest, callback: (error: grpc.ServiceError | null, response: TResponse) => void) => void
  ): (request: TRequest) => Promise<TResponse> {
    return (request: TRequest): Promise<TResponse> => {
      return new Promise((resolve, reject) => {
        const timeout = this.config?.timeout || 30000;
        const deadline = new Date(Date.now() + timeout);

        grpcCall.call(this, request, { deadline }, (error, response) => {
          if (error) {
            reject(new GrpcError(error.code, error.message, error.details));
          } else {
            resolve(response);
          }
        });
      });
    };
  }

  private wrapGrpcStreamCall<TRequest, TResponse>(
    grpcCall: (callback: (error: grpc.ServiceError | null, response: TResponse) => void) => grpc.ClientWritableStream<TRequest>
  ): (request: TRequest) => Promise<TResponse> {
    return (request: TRequest): Promise<TResponse> => {
      return new Promise((resolve, reject) => {
        const timeout = this.config?.timeout || 30000;
        const deadline = new Date(Date.now() + timeout);

        const stream = grpcCall.call(this, { deadline });
        
        stream.on('error', (error: grpc.ServiceError) => {
          reject(new GrpcError(error.code, error.message, error.details));
        });

        stream.on('data', (response: TResponse) => {
          resolve(response);
        });

        stream.on('end', () => {
          // Stream ended without data
          reject(new GrpcError(grpc.status.UNKNOWN, 'Stream ended without data'));
        });

        // Write the request to the stream
        stream.write(request);
        stream.end();
      });
    };
  }

  // MARK: - Service Getters

  getNoteService(): NoteService {
    if (!this.isInitialized) {
      throw new Error('gRPC client not initialized. Call initialize() first.');
    }
    return this.noteService;
  }

  getUserService(): UserService {
    if (!this.isInitialized) {
      throw new Error('gRPC client not initialized. Call initialize() first.');
    }
    return this.userService;
  }

  getTimelineService(): TimelineService {
    if (!this.isInitialized) {
      throw new Error('gRPC client not initialized. Call initialize() first.');
    }
    return this.timelineService;
  }

  getMediaService(): MediaService {
    if (!this.isInitialized) {
      throw new Error('gRPC client not initialized. Call initialize() first.');
    }
    return this.mediaService;
  }

  getNotificationService(): NotificationService {
    if (!this.isInitialized) {
      throw new Error('gRPC client not initialized. Call initialize() first.');
    }
    return this.notificationService;
  }

  // MARK: - Utility Methods

  isReady(): boolean {
    return this.isInitialized;
  }

  getConfig(): GrpcClientConfig | undefined {
    return this.config;
  }

  async healthCheck(): Promise<{ success: boolean; status: string }> {
    if (!this.isInitialized) {
      throw new Error('gRPC client not initialized. Call initialize() first.');
    }

    try {
      // Use note service health check as a general health indicator
      const response = await this.noteService.getNote({
        noteId: 'health-check',
        requestingUserId: 'system',
        includeThread: false,
      });

      return {
        success: response.success,
        status: response.success ? 'healthy' : 'unhealthy',
      };
    } catch (error) {
      return {
        success: false,
        status: error instanceof Error ? error.message : 'unknown error',
      };
    }
  }
}

// MARK: - Default Export

export default TimeGrpcClient;