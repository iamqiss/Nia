//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

package com.timesocial.grpc;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Main gRPC client for Time Social App
 * Provides access to all gRPC services with connection management
 */
public class TimeGrpcClient {
    
    // MARK: - Properties
    
    private final ManagedChannel channel;
    private final NoteServiceGrpc.NoteServiceBlockingStub noteService;
    private final NoteServiceGrpc.NoteServiceStub noteServiceAsync;
    private final UserServiceGrpc.UserServiceBlockingStub userService;
    private final UserServiceGrpc.UserServiceStub userServiceAsync;
    private final TimelineServiceGrpc.TimelineServiceBlockingStub timelineService;
    private final TimelineServiceGrpc.TimelineServiceStub timelineServiceAsync;
    private final MediaServiceGrpc.MediaServiceBlockingStub mediaService;
    private final MediaServiceGrpc.MediaServiceStub mediaServiceAsync;
    private final NotificationServiceGrpc.NotificationServiceBlockingStub notificationService;
    private final NotificationServiceGrpc.NotificationServiceStub notificationServiceAsync;
    private final FanoutServiceGrpc.FanoutServiceBlockingStub fanoutService;
    private final FanoutServiceGrpc.FanoutServiceStub fanoutServiceAsync;
    private final MessagingServiceGrpc.MessagingServiceBlockingStub messagingService;
    private final MessagingServiceGrpc.MessagingServiceStub messagingServiceAsync;
    private final SearchServiceGrpc.SearchServiceBlockingStub searchService;
    private final SearchServiceGrpc.SearchServiceStub searchServiceAsync;
    private final DraftsServiceGrpc.DraftsServiceBlockingStub draftsService;
    private final DraftsServiceGrpc.DraftsServiceStub draftsServiceAsync;
    private final ListServiceGrpc.ListServiceBlockingStub listService;
    private final ListServiceGrpc.ListServiceStub listServiceAsync;
    private final StarterpackServiceGrpc.StarterpackServiceBlockingStub starterpackService;
    private final StarterpackServiceGrpc.StarterpackServiceStub starterpackServiceAsync;
    
    private final TimeGrpcModule.Config config;
    
    // MARK: - Initialization
    
    public TimeGrpcClient(TimeGrpcModule.Config config) {
        this.config = config;
        
        // Create gRPC channel
        ManagedChannelBuilder<?> channelBuilder = ManagedChannelBuilder
            .forAddress(config.host, config.port)
            .keepAliveTime(30, TimeUnit.SECONDS)
            .keepAliveTimeout(5, TimeUnit.SECONDS)
            .keepAliveWithoutCalls(true)
            .maxInboundMessageSize(4 * 1024 * 1024); // 4MB
        
        if (!config.useTLS) {
            channelBuilder.usePlaintext();
        }
        
        this.channel = channelBuilder.build();
        
        // Initialize service stubs
        this.noteService = NoteServiceGrpc.newBlockingStub(channel);
        this.noteServiceAsync = NoteServiceGrpc.newStub(channel);
        this.userService = UserServiceGrpc.newBlockingStub(channel);
        this.userServiceAsync = UserServiceGrpc.newStub(channel);
        this.timelineService = TimelineServiceGrpc.newBlockingStub(channel);
        this.timelineServiceAsync = TimelineServiceGrpc.newStub(channel);
        this.mediaService = MediaServiceGrpc.newBlockingStub(channel);
        this.mediaServiceAsync = MediaServiceGrpc.newStub(channel);
        this.notificationService = NotificationServiceGrpc.newBlockingStub(channel);
        this.notificationServiceAsync = NotificationServiceGrpc.newStub(channel);
        this.fanoutService = FanoutServiceGrpc.newBlockingStub(channel);
        this.fanoutServiceAsync = FanoutServiceGrpc.newStub(channel);
        this.messagingService = MessagingServiceGrpc.newBlockingStub(channel);
        this.messagingServiceAsync = MessagingServiceGrpc.newStub(channel);
        this.searchService = SearchServiceGrpc.newBlockingStub(channel);
        this.searchServiceAsync = SearchServiceGrpc.newStub(channel);
        this.draftsService = DraftsServiceGrpc.newBlockingStub(channel);
        this.draftsServiceAsync = DraftsServiceGrpc.newStub(channel);
        this.listService = ListServiceGrpc.newBlockingStub(channel);
        this.listServiceAsync = ListServiceGrpc.newStub(channel);
        this.starterpackService = StarterpackServiceGrpc.newBlockingStub(channel);
        this.starterpackServiceAsync = StarterpackServiceGrpc.newStub(channel);
    }
    
    public TimeGrpcClient(String host, int port) {
        this(new TimeGrpcModule.Config(host, port, false, 30));
    }
    
    // MARK: - Service Access
    
    public NoteServiceGrpc.NoteServiceBlockingStub getNoteService() {
        return noteService;
    }
    
    public NoteServiceGrpc.NoteServiceStub getNoteServiceAsync() {
        return noteServiceAsync;
    }
    
    public UserServiceGrpc.UserServiceBlockingStub getUserService() {
        return userService;
    }
    
    public UserServiceGrpc.UserServiceStub getUserServiceAsync() {
        return userServiceAsync;
    }
    
    public TimelineServiceGrpc.TimelineServiceBlockingStub getTimelineService() {
        return timelineService;
    }
    
    public TimelineServiceGrpc.TimelineServiceStub getTimelineServiceAsync() {
        return timelineServiceAsync;
    }
    
    public MediaServiceGrpc.MediaServiceBlockingStub getMediaService() {
        return mediaService;
    }
    
    public MediaServiceGrpc.MediaServiceStub getMediaServiceAsync() {
        return mediaServiceAsync;
    }
    
    public NotificationServiceGrpc.NotificationServiceBlockingStub getNotificationService() {
        return notificationService;
    }
    
    public NotificationServiceGrpc.NotificationServiceStub getNotificationServiceAsync() {
        return notificationServiceAsync;
    }
    
    public FanoutServiceGrpc.FanoutServiceBlockingStub getFanoutService() {
        return fanoutService;
    }
    
    public FanoutServiceGrpc.FanoutServiceStub getFanoutServiceAsync() {
        return fanoutServiceAsync;
    }
    
    public MessagingServiceGrpc.MessagingServiceBlockingStub getMessagingService() {
        return messagingService;
    }
    
    public MessagingServiceGrpc.MessagingServiceStub getMessagingServiceAsync() {
        return messagingServiceAsync;
    }
    
    public SearchServiceGrpc.SearchServiceBlockingStub getSearchService() {
        return searchService;
    }
    
    public SearchServiceGrpc.SearchServiceStub getSearchServiceAsync() {
        return searchServiceAsync;
    }
    
    public DraftsServiceGrpc.DraftsServiceBlockingStub getDraftsService() {
        return draftsService;
    }
    
    public DraftsServiceGrpc.DraftsServiceStub getDraftsServiceAsync() {
        return draftsServiceAsync;
    }
    
    public ListServiceGrpc.ListServiceBlockingStub getListService() {
        return listService;
    }
    
    public ListServiceGrpc.ListServiceStub getListServiceAsync() {
        return listServiceAsync;
    }
    
    public StarterpackServiceGrpc.StarterpackServiceBlockingStub getStarterpackService() {
        return starterpackService;
    }
    
    public StarterpackServiceGrpc.StarterpackServiceStub getStarterpackServiceAsync() {
        return starterpackServiceAsync;
    }
    
    // MARK: - Connection Management
    
    public void shutdown() throws InterruptedException {
        channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
    }
    
    public void reconnect() {
        try {
            shutdown();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        // Note: In a real implementation, you'd recreate the client
        // For now, we'll just log the reconnection attempt
        System.out.println("Reconnection requested - client needs to be recreated");
    }
    
    // MARK: - Note Service Methods
    
    public Note.CreateNoteResponse createNote(Note.CreateNoteRequest request) throws TimeGrpcException {
        try {
            return noteService.createNote(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to create note: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Note.GetNoteResponse getNote(Note.GetNoteRequest request) throws TimeGrpcException {
        try {
            return noteService.getNote(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to get note: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Note.DeleteNoteResponse deleteNote(Note.DeleteNoteRequest request) throws TimeGrpcException {
        try {
            return noteService.deleteNote(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to delete note: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Note.LikeNoteResponse likeNote(Note.LikeNoteRequest request) throws TimeGrpcException {
        try {
            return noteService.likeNote(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to like note: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Note.RenoteNoteResponse renoteNote(Note.RenoteNoteRequest request) throws TimeGrpcException {
        try {
            return noteService.renoteNote(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to renote note: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Note.GetUserNotesResponse getUserNotes(Note.GetUserNotesRequest request) throws TimeGrpcException {
        try {
            return noteService.getUserNotes(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to get user notes: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Note.GetNoteThreadResponse getNoteThread(Note.GetNoteThreadRequest request) throws TimeGrpcException {
        try {
            return noteService.getNoteThread(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to get note thread: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Note.SearchNotesResponse searchNotes(Note.SearchNotesRequest request) throws TimeGrpcException {
        try {
            return noteService.searchNotes(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to search notes: " + e.getStatus().getDescription(), e);
        }
    }
    
    // MARK: - User Service Methods
    
    public User.LoginUserResponse loginUser(User.LoginUserRequest request) throws TimeGrpcException {
        try {
            return userService.loginUser(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to login user: " + e.getStatus().getDescription(), e);
        }
    }
    
    public User.RegisterUserResponse registerUser(User.RegisterUserRequest request) throws TimeGrpcException {
        try {
            return userService.registerUser(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to register user: " + e.getStatus().getDescription(), e);
        }
    }
    
    public User.VerifyTokenResponse verifyToken(User.VerifyTokenRequest request) throws TimeGrpcException {
        try {
            return userService.verifyToken(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to verify token: " + e.getStatus().getDescription(), e);
        }
    }
    
    public User.RefreshTokenResponse refreshToken(User.RefreshTokenRequest request) throws TimeGrpcException {
        try {
            return userService.refreshToken(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to refresh token: " + e.getStatus().getDescription(), e);
        }
    }
    
    public User.LogoutResponse logoutUser(User.LogoutRequest request) throws TimeGrpcException {
        try {
            return userService.logoutUser(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to logout user: " + e.getStatus().getDescription(), e);
        }
    }
    
    public User.GetUserProfileResponse getUserProfile(User.GetUserProfileRequest request) throws TimeGrpcException {
        try {
            return userService.getUserProfile(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to get user profile: " + e.getStatus().getDescription(), e);
        }
    }
    
    public User.UpdateUserProfileResponse updateUserProfile(User.UpdateUserProfileRequest request) throws TimeGrpcException {
        try {
            return userService.updateUserProfile(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to update user profile: " + e.getStatus().getDescription(), e);
        }
    }
    
    // MARK: - Timeline Service Methods
    
    public Timeline.GetTimelineResponse getTimeline(Timeline.GetTimelineRequest request) throws TimeGrpcException {
        try {
            return timelineService.getTimeline(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to get timeline: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Timeline.GetUserTimelineResponse getUserTimeline(Timeline.GetUserTimelineRequest request) throws TimeGrpcException {
        try {
            return timelineService.getUserTimeline(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to get user timeline: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Timeline.RefreshTimelineResponse refreshTimeline(Timeline.RefreshTimelineRequest request) throws TimeGrpcException {
        try {
            return timelineService.refreshTimeline(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to refresh timeline: " + e.getStatus().getDescription(), e);
        }
    }
    
    // MARK: - Media Service Methods
    
    public Media.GetMediaResponse getMedia(Media.GetMediaRequest request) throws TimeGrpcException {
        try {
            return mediaService.getMedia(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to get media: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Media.DeleteMediaResponse deleteMedia(Media.DeleteMediaRequest request) throws TimeGrpcException {
        try {
            return mediaService.deleteMedia(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to delete media: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Media.ListUserMediaResponse listUserMedia(Media.ListUserMediaRequest request) throws TimeGrpcException {
        try {
            return mediaService.listUserMedia(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to list user media: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Media.ToggleMediaLikeResponse toggleMediaLike(Media.ToggleMediaLikeRequest request) throws TimeGrpcException {
        try {
            return mediaService.toggleMediaLike(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to toggle media like: " + e.getStatus().getDescription(), e);
        }
    }
    
    // MARK: - Notification Service Methods
    
    public Notification.ListNotificationsResponse listNotifications(Notification.ListNotificationsRequest request) throws TimeGrpcException {
        try {
            return notificationService.listNotifications(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to list notifications: " + e.getStatus().getDescription(), e);
        }
    }
    
    public Notification.MarkNotificationReadResponse markNotificationRead(Notification.MarkNotificationReadRequest request) throws TimeGrpcException {
        try {
            return notificationService.markNotificationRead(request);
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Failed to mark notification read: " + e.getStatus().getDescription(), e);
        }
    }
    
    // MARK: - Health Check
    
    public boolean healthCheck() throws TimeGrpcException {
        try {
            Note.HealthCheckRequest request = Note.HealthCheckRequest.getDefaultInstance();
            Note.HealthCheckResponse response = noteService.healthCheck(request);
            return "OK".equals(response.getStatus());
        } catch (StatusRuntimeException e) {
            throw new TimeGrpcException("Health check failed: " + e.getStatus().getDescription(), e);
        }
    }
    
    // MARK: - Async Methods with Callbacks
    
    public void createNoteAsync(Note.CreateNoteRequest request, GrpcCallback<Note.CreateNoteResponse> callback) {
        noteServiceAsync.createNote(request, new StreamObserver<Note.CreateNoteResponse>() {
            @Override
            public void onNext(Note.CreateNoteResponse response) {
                callback.onSuccess(response);
            }
            
            @Override
            public void onError(Throwable t) {
                callback.onError(new TimeGrpcException("Failed to create note", t));
            }
            
            @Override
            public void onCompleted() {
                // No-op for unary calls
            }
        });
    }
    
    public void getNoteAsync(Note.GetNoteRequest request, GrpcCallback<Note.GetNoteResponse> callback) {
        noteServiceAsync.getNote(request, new StreamObserver<Note.GetNoteResponse>() {
            @Override
            public void onNext(Note.GetNoteResponse response) {
                callback.onSuccess(response);
            }
            
            @Override
            public void onError(Throwable t) {
                callback.onError(new TimeGrpcException("Failed to get note", t));
            }
            
            @Override
            public void onCompleted() {
                // No-op for unary calls
            }
        });
    }
    
    public void loginUserAsync(User.LoginUserRequest request, GrpcCallback<User.LoginUserResponse> callback) {
        userServiceAsync.loginUser(request, new StreamObserver<User.LoginUserResponse>() {
            @Override
            public void onNext(User.LoginUserResponse response) {
                callback.onSuccess(response);
            }
            
            @Override
            public void onError(Throwable t) {
                callback.onError(new TimeGrpcException("Failed to login user", t));
            }
            
            @Override
            public void onCompleted() {
                // No-op for unary calls
            }
        });
    }
    
    // MARK: - Callback Interface
    
    public interface GrpcCallback<T> {
        void onSuccess(T response);
        void onError(TimeGrpcException error);
    }
}