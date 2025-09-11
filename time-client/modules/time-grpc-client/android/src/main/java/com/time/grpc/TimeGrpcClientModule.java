//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

package com.time.grpc;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

// Import generated gRPC classes
import com.time.grpc.proto.note.NoteServiceGrpc;
import com.time.grpc.proto.note.NoteServiceOuterClass.*;
import com.time.grpc.proto.user.UserServiceGrpc;
import com.time.grpc.proto.user.UserServiceOuterClass.*;
import com.time.grpc.proto.timeline.TimelineServiceGrpc;
import com.time.grpc.proto.timeline.TimelineServiceOuterClass.*;
import com.time.grpc.proto.media.MediaServiceGrpc;
import com.time.grpc.proto.media.MediaServiceOuterClass.*;
import com.time.grpc.proto.notification.TimeNotificationServiceGrpc;
import com.time.grpc.proto.notification.TimeNotificationServiceOuterClass.*;

public class TimeGrpcClientModule extends ReactContextBaseJavaModule {
    
    private static final String TAG = "TimeGrpcClient";
    
    private ManagedChannel channel;
    private NoteServiceGrpc.NoteServiceBlockingStub noteServiceStub;
    private UserServiceGrpc.UserServiceBlockingStub userServiceStub;
    private TimelineServiceGrpc.TimelineServiceBlockingStub timelineServiceStub;
    private MediaServiceGrpc.MediaServiceBlockingStub mediaServiceStub;
    private TimeNotificationServiceGrpc.TimeNotificationServiceBlockingStub notificationServiceStub;
    
    private ExecutorService executorService;
    private boolean isInitialized = false;
    
    public TimeGrpcClientModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.executorService = Executors.newCachedThreadPool();
    }
    
    @Override
    public String getName() {
        return "TimeGrpcClient";
    }
    
    @ReactMethod
    public void initializeClient(String host, int port, Promise promise) {
        executorService.execute(() -> {
            try {
                // Create gRPC channel
                this.channel = ManagedChannelBuilder.forAddress(host, port)
                    .useTransportSecurity()
                    .keepAliveTime(30, TimeUnit.SECONDS)
                    .keepAliveTimeout(5, TimeUnit.SECONDS)
                    .keepAliveWithoutCalls(true)
                    .maxInboundMessageSize(4 * 1024 * 1024) // 4MB
                    .build();
                
                // Create service stubs
                this.noteServiceStub = NoteServiceGrpc.newBlockingStub(channel);
                this.userServiceStub = UserServiceGrpc.newBlockingStub(channel);
                this.timelineServiceStub = TimelineServiceGrpc.newBlockingStub(channel);
                this.mediaServiceStub = MediaServiceGrpc.newBlockingStub(channel);
                this.notificationServiceStub = TimeNotificationServiceGrpc.newBlockingStub(channel);
                
                this.isInitialized = true;
                
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", true);
                promise.resolve(result);
                
            } catch (Exception e) {
                Log.e(TAG, "Failed to initialize gRPC client", e);
                promise.reject("INIT_ERROR", "Failed to initialize gRPC client: " + e.getMessage(), e);
            }
        });
    }
    
    // MARK: - Note Service Methods
    
    @ReactMethod
    public void createNote(ReadableMap request, Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                CreateNoteRequest.Builder grpcRequest = CreateNoteRequest.newBuilder()
                    .setAuthorId(request.getString("authorId"))
                    .setText(request.getString("text"))
                    .setVisibility(NoteVisibility.forNumber(request.getInt("visibility")))
                    .setContentWarning(ContentWarning.forNumber(request.getInt("contentWarning")))
                    .setClientName(request.getString("clientName"));
                
                if (request.hasKey("mediaIds")) {
                    grpcRequest.addAllMediaIds(request.getArray("mediaIds").toArrayList());
                }
                
                if (request.hasKey("replyToNoteId")) {
                    grpcRequest.setReplyToNoteId(request.getString("replyToNoteId"));
                }
                
                if (request.hasKey("renotedNoteId")) {
                    grpcRequest.setRenotedNoteId(request.getString("renotedNoteId"));
                }
                
                grpcRequest.setIsQuoteRenote(request.getBoolean("isQuoteRenote"));
                
                CreateNoteResponse response = noteServiceStub.createNote(grpcRequest.build());
                
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", response.getSuccess());
                result.putMap("note", convertNoteToMap(response.getNote()));
                result.putString("errorMessage", response.getErrorMessage());
                
                promise.resolve(result);
                
            } catch (StatusRuntimeException e) {
                Log.e(TAG, "gRPC call failed", e);
                promise.reject("CREATE_NOTE_ERROR", "Failed to create note: " + e.getStatus().getDescription(), e);
            } catch (Exception e) {
                Log.e(TAG, "Unexpected error", e);
                promise.reject("CREATE_NOTE_ERROR", "Failed to create note: " + e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void getNote(ReadableMap request, Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                GetNoteRequest grpcRequest = GetNoteRequest.newBuilder()
                    .setNoteId(request.getString("noteId"))
                    .setRequestingUserId(request.getString("requestingUserId"))
                    .setIncludeThread(request.getBoolean("includeThread"))
                    .build();
                
                GetNoteResponse response = noteServiceStub.getNote(grpcRequest);
                
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", response.getSuccess());
                result.putMap("note", convertNoteToMap(response.getNote()));
                result.putMap("userInteraction", convertUserNoteInteractionToMap(response.getUserInteraction()));
                
                WritableArray threadNotes = Arguments.createArray();
                for (Note note : response.getThreadNotesList()) {
                    threadNotes.pushMap(convertNoteToMap(note));
                }
                result.putArray("threadNotes", threadNotes);
                result.putString("errorMessage", response.getErrorMessage());
                
                promise.resolve(result);
                
            } catch (StatusRuntimeException e) {
                Log.e(TAG, "gRPC call failed", e);
                promise.reject("GET_NOTE_ERROR", "Failed to get note: " + e.getStatus().getDescription(), e);
            } catch (Exception e) {
                Log.e(TAG, "Unexpected error", e);
                promise.reject("GET_NOTE_ERROR", "Failed to get note: " + e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void deleteNote(ReadableMap request, Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                DeleteNoteRequest grpcRequest = DeleteNoteRequest.newBuilder()
                    .setNoteId(request.getString("noteId"))
                    .setUserId(request.getString("userId"))
                    .build();
                
                DeleteNoteResponse response = noteServiceStub.deleteNote(grpcRequest);
                
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", response.getSuccess());
                result.putString("errorMessage", response.getErrorMessage());
                
                promise.resolve(result);
                
            } catch (StatusRuntimeException e) {
                Log.e(TAG, "gRPC call failed", e);
                promise.reject("DELETE_NOTE_ERROR", "Failed to delete note: " + e.getStatus().getDescription(), e);
            } catch (Exception e) {
                Log.e(TAG, "Unexpected error", e);
                promise.reject("DELETE_NOTE_ERROR", "Failed to delete note: " + e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void likeNote(ReadableMap request, Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                LikeNoteRequest grpcRequest = LikeNoteRequest.newBuilder()
                    .setNoteId(request.getString("noteId"))
                    .setUserId(request.getString("userId"))
                    .setLike(request.getBoolean("like"))
                    .build();
                
                LikeNoteResponse response = noteServiceStub.likeNote(grpcRequest);
                
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", response.getSuccess());
                result.putDouble("newLikeCount", response.getNewLikeCount());
                result.putString("errorMessage", response.getErrorMessage());
                
                promise.resolve(result);
                
            } catch (StatusRuntimeException e) {
                Log.e(TAG, "gRPC call failed", e);
                promise.reject("LIKE_NOTE_ERROR", "Failed to like note: " + e.getStatus().getDescription(), e);
            } catch (Exception e) {
                Log.e(TAG, "Unexpected error", e);
                promise.reject("LIKE_NOTE_ERROR", "Failed to like note: " + e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void renoteNote(ReadableMap request, Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                RenoteNoteRequest.Builder grpcRequest = RenoteNoteRequest.newBuilder()
                    .setNoteId(request.getString("noteId"))
                    .setUserId(request.getString("userId"))
                    .setIsQuoteRenote(request.getBoolean("isQuoteRenote"));
                
                if (request.hasKey("quoteText")) {
                    grpcRequest.setQuoteText(request.getString("quoteText"));
                }
                
                RenoteNoteResponse response = noteServiceStub.renoteNote(grpcRequest.build());
                
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", response.getSuccess());
                result.putMap("renoteNote", convertNoteToMap(response.getRenoteNote()));
                result.putString("errorMessage", response.getErrorMessage());
                
                promise.resolve(result);
                
            } catch (StatusRuntimeException e) {
                Log.e(TAG, "gRPC call failed", e);
                promise.reject("RENOTE_NOTE_ERROR", "Failed to renote note: " + e.getStatus().getDescription(), e);
            } catch (Exception e) {
                Log.e(TAG, "Unexpected error", e);
                promise.reject("RENOTE_NOTE_ERROR", "Failed to renote note: " + e.getMessage(), e);
            }
        });
    }
    
    // MARK: - User Service Methods
    
    @ReactMethod
    public void loginUser(ReadableMap request, Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                ReadableMap credentials = request.getMap("credentials");
                
                AuthCredentials.Builder authCredentials = AuthCredentials.newBuilder()
                    .setEmail(credentials.getString("email"))
                    .setPassword(credentials.getString("password"));
                
                if (credentials.hasKey("twoFactorCode")) {
                    authCredentials.setTwoFactorCode(credentials.getString("twoFactorCode"));
                }
                
                LoginUserRequest grpcRequest = LoginUserRequest.newBuilder()
                    .setCredentials(authCredentials.build())
                    .setDeviceName(request.getString("deviceName"))
                    .build();
                
                LoginUserResponse response = userServiceStub.loginUser(grpcRequest);
                
                WritableMap result = Arguments.createMap();
                result.putMap("status", convertStatusToMap(response.getStatus()));
                result.putString("accessToken", response.getAccessToken());
                result.putString("refreshToken", response.getRefreshToken());
                result.putInt("expiresIn", response.getExpiresIn());
                result.putMap("session", convertSessionToMap(response.getSession()));
                result.putBoolean("requires2fa", response.getRequires2Fa());
                
                promise.resolve(result);
                
            } catch (StatusRuntimeException e) {
                Log.e(TAG, "gRPC call failed", e);
                promise.reject("LOGIN_USER_ERROR", "Failed to login user: " + e.getStatus().getDescription(), e);
            } catch (Exception e) {
                Log.e(TAG, "Unexpected error", e);
                promise.reject("LOGIN_USER_ERROR", "Failed to login user: " + e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void registerUser(ReadableMap request, Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                RegisterUserRequest.Builder grpcRequest = RegisterUserRequest.newBuilder()
                    .setUsername(request.getString("username"))
                    .setEmail(request.getString("email"))
                    .setPassword(request.getString("password"))
                    .setDisplayName(request.getString("displayName"))
                    .setAcceptTerms(request.getBoolean("acceptTerms"))
                    .setAcceptPrivacy(request.getBoolean("acceptPrivacy"));
                
                if (request.hasKey("invitationCode")) {
                    grpcRequest.setInvitationCode(request.getString("invitationCode"));
                }
                
                RegisterUserResponse response = userServiceStub.registerUser(grpcRequest.build());
                
                WritableMap result = Arguments.createMap();
                result.putMap("status", convertStatusToMap(response.getStatus()));
                result.putMap("user", convertUserProfileToMap(response.getUser()));
                result.putString("verificationToken", response.getVerificationToken());
                
                promise.resolve(result);
                
            } catch (StatusRuntimeException e) {
                Log.e(TAG, "gRPC call failed", e);
                promise.reject("REGISTER_USER_ERROR", "Failed to register user: " + e.getStatus().getDescription(), e);
            } catch (Exception e) {
                Log.e(TAG, "Unexpected error", e);
                promise.reject("REGISTER_USER_ERROR", "Failed to register user: " + e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void getUserProfile(ReadableMap request, Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                GetUserProfileRequest grpcRequest = GetUserProfileRequest.newBuilder()
                    .setUserId(request.getString("userId"))
                    .build();
                
                GetUserProfileResponse response = userServiceStub.getUserProfile(grpcRequest);
                
                WritableMap result = Arguments.createMap();
                result.putMap("status", convertStatusToMap(response.getStatus()));
                result.putMap("user", convertUserProfileToMap(response.getUser()));
                
                promise.resolve(result);
                
            } catch (StatusRuntimeException e) {
                Log.e(TAG, "gRPC call failed", e);
                promise.reject("GET_USER_PROFILE_ERROR", "Failed to get user profile: " + e.getStatus().getDescription(), e);
            } catch (Exception e) {
                Log.e(TAG, "Unexpected error", e);
                promise.reject("GET_USER_PROFILE_ERROR", "Failed to get user profile: " + e.getMessage(), e);
            }
        });
    }
    
    // MARK: - Health Check
    
    @ReactMethod
    public void healthCheck(Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                // Use note service health check as a general health indicator
                GetNoteRequest grpcRequest = GetNoteRequest.newBuilder()
                    .setNoteId("health-check")
                    .setRequestingUserId("system")
                    .setIncludeThread(false)
                    .build();
                
                GetNoteResponse response = noteServiceStub.getNote(grpcRequest);
                
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", response.getSuccess());
                result.putString("status", response.getSuccess() ? "healthy" : "unhealthy");
                
                promise.resolve(result);
                
            } catch (Exception e) {
                Log.e(TAG, "Health check failed", e);
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", false);
                result.putString("status", "unhealthy: " + e.getMessage());
                promise.resolve(result);
            }
        });
    }
    
    // MARK: - Data Conversion Helpers
    
    private WritableMap convertNoteToMap(Note note) {
        WritableMap map = Arguments.createMap();
        map.putString("id", note.getId());
        map.putString("authorId", note.getAuthorId());
        map.putString("text", note.getText());
        map.putInt("visibility", note.getVisibility().getNumber());
        map.putInt("contentWarning", note.getContentWarning().getNumber());
        
        WritableArray mediaIds = Arguments.createArray();
        for (String mediaId : note.getMediaIdsList()) {
            mediaIds.pushString(mediaId);
        }
        map.putArray("mediaIds", mediaIds);
        
        map.putMap("entities", convertNoteEntitiesToMap(note.getEntities()));
        
        if (note.hasLocation()) {
            map.putMap("location", convertGeoLocationToMap(note.getLocation()));
        }
        
        map.putString("replyToNoteId", note.getReplyToNoteId());
        map.putString("replyToUserId", note.getReplyToUserId());
        map.putString("threadRootId", note.getThreadRootId());
        map.putString("renotedNoteId", note.getRenotedNoteId());
        map.putString("renotedUserId", note.getRenotedUserId());
        map.putBoolean("isQuoteRenote", note.getIsQuoteRenote());
        
        map.putMap("createdAt", convertTimestampToMap(note.getCreatedAt()));
        map.putMap("updatedAt", convertTimestampToMap(note.getUpdatedAt()));
        
        if (note.hasDeletedAt()) {
            map.putMap("deletedAt", convertTimestampToMap(note.getDeletedAt()));
        }
        
        map.putMap("metrics", convertNoteMetricsToMap(note.getMetrics()));
        map.putString("languageCode", note.getLanguageCode());
        
        WritableArray flags = Arguments.createArray();
        for (String flag : note.getFlagsList()) {
            flags.pushString(flag);
        }
        map.putArray("flags", flags);
        
        map.putBoolean("isVerifiedContent", note.getIsVerifiedContent());
        map.putString("clientName", note.getClientName());
        
        return map;
    }
    
    private WritableMap convertUserNoteInteractionToMap(UserNoteInteraction interaction) {
        WritableMap map = Arguments.createMap();
        map.putString("userId", interaction.getUserId());
        map.putString("noteId", interaction.getNoteId());
        map.putBoolean("hasLiked", interaction.getHasLiked());
        map.putBoolean("hasRenoted", interaction.getHasRenoted());
        map.putBoolean("hasBookmarked", interaction.getHasBookmarked());
        map.putBoolean("hasReported", interaction.getHasReported());
        map.putMap("lastViewedAt", convertTimestampToMap(interaction.getLastViewedAt()));
        map.putMap("interactedAt", convertTimestampToMap(interaction.getInteractedAt()));
        return map;
    }
    
    private WritableMap convertStatusToMap(Status status) {
        WritableMap map = Arguments.createMap();
        map.putInt("code", status.getCode().getNumber());
        map.putString("message", status.getMessage());
        
        WritableMap details = Arguments.createMap();
        for (String key : status.getDetailsMap().keySet()) {
            details.putString(key, status.getDetailsMap().get(key));
        }
        map.putMap("details", details);
        
        return map;
    }
    
    private WritableMap convertSessionToMap(Session session) {
        WritableMap map = Arguments.createMap();
        map.putString("sessionId", session.getSessionId());
        map.putString("userId", session.getUserId());
        map.putString("deviceId", session.getDeviceId());
        map.putString("deviceName", session.getDeviceName());
        map.putString("ipAddress", session.getIpAddress());
        map.putString("userAgent", session.getUserAgent());
        map.putInt("type", session.getType().getNumber());
        map.putMap("createdAt", convertTimestampToMap(session.getCreatedAt()));
        map.putMap("lastActivity", convertTimestampToMap(session.getLastActivity()));
        map.putMap("expiresAt", convertTimestampToMap(session.getExpiresAt()));
        map.putBoolean("isActive", session.getIsActive());
        map.putBoolean("isSuspicious", session.getIsSuspicious());
        map.putString("locationInfo", session.getLocationInfo());
        return map;
    }
    
    private WritableMap convertUserProfileToMap(UserProfile user) {
        WritableMap map = Arguments.createMap();
        map.putString("userId", user.getUserId());
        map.putString("username", user.getUsername());
        map.putString("email", user.getEmail());
        map.putString("displayName", user.getDisplayName());
        map.putString("bio", user.getBio());
        map.putString("avatarUrl", user.getAvatarUrl());
        map.putString("location", user.getLocation());
        map.putString("website", user.getWebsite());
        map.putInt("status", user.getStatus().getNumber());
        map.putBoolean("isVerified", user.getIsVerified());
        map.putBoolean("isPrivate", user.getIsPrivate());
        map.putMap("createdAt", convertTimestampToMap(user.getCreatedAt()));
        map.putMap("updatedAt", convertTimestampToMap(user.getUpdatedAt()));
        map.putMap("lastLogin", convertTimestampToMap(user.getLastLogin()));
        map.putDouble("followerCount", user.getFollowerCount());
        map.putDouble("followingCount", user.getFollowingCount());
        map.putDouble("noteCount", user.getNoteCount());
        
        WritableMap settings = Arguments.createMap();
        for (String key : user.getSettingsMap().keySet()) {
            settings.putString(key, user.getSettingsMap().get(key));
        }
        map.putMap("settings", settings);
        
        WritableMap privacySettings = Arguments.createMap();
        for (String key : user.getPrivacySettingsMap().keySet()) {
            privacySettings.putString(key, user.getPrivacySettingsMap().get(key));
        }
        map.putMap("privacySettings", privacySettings);
        
        return map;
    }
    
    private WritableMap convertNoteEntitiesToMap(NoteEntities entities) {
        WritableMap map = Arguments.createMap();
        
        WritableArray mentions = Arguments.createArray();
        for (NoteMention mention : entities.getMentionsList()) {
            mentions.pushMap(convertNoteMentionToMap(mention));
        }
        map.putArray("mentions", mentions);
        
        WritableArray hashtags = Arguments.createArray();
        for (NoteHashtag hashtag : entities.getHashtagsList()) {
            hashtags.pushMap(convertNoteHashtagToMap(hashtag));
        }
        map.putArray("hashtags", hashtags);
        
        WritableArray links = Arguments.createArray();
        for (NoteLink link : entities.getLinksList()) {
            links.pushMap(convertNoteLinkToMap(link));
        }
        map.putArray("links", links);
        
        return map;
    }
    
    private WritableMap convertNoteMentionToMap(NoteMention mention) {
        WritableMap map = Arguments.createMap();
        map.putString("userId", mention.getUserId());
        map.putString("username", mention.getUsername());
        map.putInt("startOffset", mention.getStartOffset());
        map.putInt("endOffset", mention.getEndOffset());
        return map;
    }
    
    private WritableMap convertNoteHashtagToMap(NoteHashtag hashtag) {
        WritableMap map = Arguments.createMap();
        map.putString("tag", hashtag.getTag());
        map.putInt("startOffset", hashtag.getStartOffset());
        map.putInt("endOffset", hashtag.getEndOffset());
        return map;
    }
    
    private WritableMap convertNoteLinkToMap(NoteLink link) {
        WritableMap map = Arguments.createMap();
        map.putString("url", link.getUrl());
        map.putString("title", link.getTitle());
        map.putString("description", link.getDescription());
        map.putString("imageUrl", link.getImageUrl());
        map.putInt("startOffset", link.getStartOffset());
        map.putInt("endOffset", link.getEndOffset());
        return map;
    }
    
    private WritableMap convertGeoLocationToMap(GeoLocation location) {
        WritableMap map = Arguments.createMap();
        map.putDouble("latitude", location.getLatitude());
        map.putDouble("longitude", location.getLongitude());
        map.putString("placeName", location.getPlaceName());
        map.putString("countryCode", location.getCountryCode());
        return map;
    }
    
    private WritableMap convertNoteMetricsToMap(NoteMetrics metrics) {
        WritableMap map = Arguments.createMap();
        map.putDouble("likeCount", metrics.getLikeCount());
        map.putDouble("renoteCount", metrics.getRenoteCount());
        map.putDouble("replyCount", metrics.getReplyCount());
        map.putDouble("quoteCount", metrics.getQuoteCount());
        map.putDouble("bookmarkCount", metrics.getBookmarkCount());
        map.putDouble("viewCount", metrics.getViewCount());
        map.putDouble("engagementRate", metrics.getEngagementRate());
        return map;
    }
    
    private WritableMap convertTimestampToMap(Timestamp timestamp) {
        WritableMap map = Arguments.createMap();
        map.putDouble("seconds", timestamp.getSeconds());
        map.putInt("nanos", timestamp.getNanos());
        return map;
    }
    
    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        if (channel != null && !channel.isShutdown()) {
            channel.shutdown();
            try {
                if (!channel.awaitTermination(5, TimeUnit.SECONDS)) {
                    channel.shutdownNow();
                }
            } catch (InterruptedException e) {
                channel.shutdownNow();
            }
        }
        if (executorService != null) {
            executorService.shutdown();
        }
    }
}