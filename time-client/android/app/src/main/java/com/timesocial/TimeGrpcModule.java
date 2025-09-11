//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

package com.timesocial;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;

import com.timesocial.grpc.TimeGrpcClient;
import com.timesocial.grpc.TimeGrpcModule;
import com.timesocial.grpc.*;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.List;
import java.util.ArrayList;

/**
 * React Native bridge module for Time gRPC services
 * Provides JavaScript interface to native gRPC functionality
 */
public class TimeGrpcModule extends ReactContextBaseJavaModule {
    
    private TimeGrpcClient grpcClient;
    private final ExecutorService executorService;
    
    public TimeGrpcModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.executorService = Executors.newCachedThreadPool();
    }
    
    @Override
    public String getName() {
        return "TimeGrpcModule";
    }
    
    // MARK: - Initialization
    
    @ReactMethod
    public void initializeClient(String host, int port, Promise promise) {
        try {
            TimeGrpcModule.Config config = new TimeGrpcModule.Config(host, port, false, 30);
            grpcClient = new TimeGrpcClient(config);
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            result.putString("host", host);
            result.putInt("port", port);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("INIT_ERROR", "Failed to initialize gRPC client", e);
        }
    }
    
    // MARK: - Note Service Methods
    
    @ReactMethod
    public void createNote(ReadableMap requestData, Promise promise) {
        if (grpcClient == null) {
            promise.reject("CLIENT_NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                Note.CreateNoteRequest.Builder requestBuilder = Note.CreateNoteRequest.newBuilder();
                
                if (requestData.hasKey("authorId")) {
                    requestBuilder.setAuthorID(requestData.getString("authorId"));
                }
                if (requestData.hasKey("text")) {
                    requestBuilder.setText(requestData.getString("text"));
                }
                if (requestData.hasKey("visibility")) {
                    requestBuilder.setVisibility(Note.NoteVisibility.forNumber(requestData.getInt("visibility")));
                }
                if (requestData.hasKey("contentWarning")) {
                    requestBuilder.setContentWarning(Note.ContentWarning.forNumber(requestData.getInt("contentWarning")));
                }
                if (requestData.hasKey("mediaIds")) {
                    ReadableArray mediaIdsArray = requestData.getArray("mediaIds");
                    for (int i = 0; i < mediaIdsArray.size(); i++) {
                        requestBuilder.addMediaIds(mediaIdsArray.getString(i));
                    }
                }
                if (requestData.hasKey("location")) {
                    ReadableMap locationData = requestData.getMap("location");
                    Note.GeoLocation.Builder locationBuilder = Note.GeoLocation.newBuilder();
                    if (locationData.hasKey("latitude")) {
                        locationBuilder.setLatitude(locationData.getDouble("latitude"));
                    }
                    if (locationData.hasKey("longitude")) {
                        locationBuilder.setLongitude(locationData.getDouble("longitude"));
                    }
                    if (locationData.hasKey("placeName")) {
                        locationBuilder.setPlaceName(locationData.getString("placeName"));
                    }
                    if (locationData.hasKey("countryCode")) {
                        locationBuilder.setCountryCode(locationData.getString("countryCode"));
                    }
                    requestBuilder.setLocation(locationBuilder.build());
                }
                if (requestData.hasKey("replyToNoteId")) {
                    requestBuilder.setReplyToNoteID(requestData.getString("replyToNoteId"));
                }
                if (requestData.hasKey("renotedNoteId")) {
                    requestBuilder.setRenotedNoteID(requestData.getString("renotedNoteId"));
                }
                if (requestData.hasKey("isQuoteRenote")) {
                    requestBuilder.setIsQuoteRenote(requestData.getBoolean("isQuoteRenote"));
                }
                if (requestData.hasKey("clientName")) {
                    requestBuilder.setClientName(requestData.getString("clientName"));
                }
                if (requestData.hasKey("idempotencyKey")) {
                    requestBuilder.setIdempotencyKey(requestData.getString("idempotencyKey"));
                }
                
                Note.CreateNoteResponse response = grpcClient.createNote(requestBuilder.build());
                
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", response.getSuccess());
                result.putMap("note", noteToWritableMap(response.getNote()));
                result.putString("errorMessage", response.getErrorMessage());
                
                promise.resolve(result);
                
            } catch (Exception e) {
                promise.reject("CREATE_NOTE_ERROR", e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void getNote(ReadableMap requestData, Promise promise) {
        if (grpcClient == null) {
            promise.reject("CLIENT_NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                Note.GetNoteRequest.Builder requestBuilder = Note.GetNoteRequest.newBuilder();
                
                if (requestData.hasKey("noteId")) {
                    requestBuilder.setNoteID(requestData.getString("noteId"));
                }
                if (requestData.hasKey("requestingUserId")) {
                    requestBuilder.setRequestingUserID(requestData.getString("requestingUserId"));
                }
                if (requestData.hasKey("includeThread")) {
                    requestBuilder.setIncludeThread(requestData.getBoolean("includeThread"));
                }
                
                Note.GetNoteResponse response = grpcClient.getNote(requestBuilder.build());
                
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", response.getSuccess());
                result.putMap("note", noteToWritableMap(response.getNote()));
                result.putMap("userInteraction", userNoteInteractionToWritableMap(response.getUserInteraction()));
                
                WritableMap threadNotes = Arguments.createMap();
                for (int i = 0; i < response.getThreadNotesCount(); i++) {
                    threadNotes.putMap(String.valueOf(i), noteToWritableMap(response.getThreadNotes(i)));
                }
                result.putMap("threadNotes", threadNotes);
                result.putString("errorMessage", response.getErrorMessage());
                
                promise.resolve(result);
                
            } catch (Exception e) {
                promise.reject("GET_NOTE_ERROR", e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void deleteNote(ReadableMap requestData, Promise promise) {
        if (grpcClient == null) {
            promise.reject("CLIENT_NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                Note.DeleteNoteRequest.Builder requestBuilder = Note.DeleteNoteRequest.newBuilder();
                
                if (requestData.hasKey("noteId")) {
                    requestBuilder.setNoteID(requestData.getString("noteId"));
                }
                if (requestData.hasKey("userId")) {
                    requestBuilder.setUserID(requestData.getString("userId"));
                }
                
                Note.DeleteNoteResponse response = grpcClient.deleteNote(requestBuilder.build());
                
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", response.getSuccess());
                result.putString("errorMessage", response.getErrorMessage());
                
                promise.resolve(result);
                
            } catch (Exception e) {
                promise.reject("DELETE_NOTE_ERROR", e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void likeNote(ReadableMap requestData, Promise promise) {
        if (grpcClient == null) {
            promise.reject("CLIENT_NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                Note.LikeNoteRequest.Builder requestBuilder = Note.LikeNoteRequest.newBuilder();
                
                if (requestData.hasKey("noteId")) {
                    requestBuilder.setNoteID(requestData.getString("noteId"));
                }
                if (requestData.hasKey("userId")) {
                    requestBuilder.setUserID(requestData.getString("userId"));
                }
                if (requestData.hasKey("like")) {
                    requestBuilder.setLike(requestData.getBoolean("like"));
                }
                
                Note.LikeNoteResponse response = grpcClient.likeNote(requestBuilder.build());
                
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", response.getSuccess());
                result.putInt("newLikeCount", (int) response.getNewLikeCount());
                result.putString("errorMessage", response.getErrorMessage());
                
                promise.resolve(result);
                
            } catch (Exception e) {
                promise.reject("LIKE_NOTE_ERROR", e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void renoteNote(ReadableMap requestData, Promise promise) {
        if (grpcClient == null) {
            promise.reject("CLIENT_NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                Note.RenoteNoteRequest.Builder requestBuilder = Note.RenoteNoteRequest.newBuilder();
                
                if (requestData.hasKey("noteId")) {
                    requestBuilder.setNoteID(requestData.getString("noteId"));
                }
                if (requestData.hasKey("userId")) {
                    requestBuilder.setUserID(requestData.getString("userId"));
                }
                if (requestData.hasKey("isQuoteRenote")) {
                    requestBuilder.setIsQuoteRenote(requestData.getBoolean("isQuoteRenote"));
                }
                if (requestData.hasKey("quoteText")) {
                    requestBuilder.setQuoteText(requestData.getString("quoteText"));
                }
                
                Note.RenoteNoteResponse response = grpcClient.renoteNote(requestBuilder.build());
                
                WritableMap result = Arguments.createMap();
                result.putMap("renoteNote", noteToWritableMap(response.getRenoteNote()));
                result.putBoolean("success", response.getSuccess());
                result.putString("errorMessage", response.getErrorMessage());
                
                promise.resolve(result);
                
            } catch (Exception e) {
                promise.reject("RENOTE_NOTE_ERROR", e.getMessage(), e);
            }
        });
    }
    
    // MARK: - User Service Methods
    
    @ReactMethod
    public void loginUser(ReadableMap requestData, Promise promise) {
        if (grpcClient == null) {
            promise.reject("CLIENT_NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                User.LoginUserRequest.Builder requestBuilder = User.LoginUserRequest.newBuilder();
                
                if (requestData.hasKey("credentials")) {
                    ReadableMap credentialsData = requestData.getMap("credentials");
                    User.AuthCredentials.Builder credentialsBuilder = User.AuthCredentials.newBuilder();
                    if (credentialsData.hasKey("email")) {
                        credentialsBuilder.setEmail(credentialsData.getString("email"));
                    }
                    if (credentialsData.hasKey("password")) {
                        credentialsBuilder.setPassword(credentialsData.getString("password"));
                    }
                    if (credentialsData.hasKey("twoFactorCode")) {
                        credentialsBuilder.setTwoFactorCode(credentialsData.getString("twoFactorCode"));
                    }
                    requestBuilder.setCredentials(credentialsBuilder.build());
                }
                if (requestData.hasKey("deviceName")) {
                    requestBuilder.setDeviceName(requestData.getString("deviceName"));
                }
                
                User.LoginUserResponse response = grpcClient.loginUser(requestBuilder.build());
                
                WritableMap result = Arguments.createMap();
                result.putMap("status", statusToWritableMap(response.getStatus()));
                result.putString("accessToken", response.getAccessToken());
                result.putString("refreshToken", response.getRefreshToken());
                result.putInt("expiresIn", response.getExpiresIn());
                result.putMap("session", sessionToWritableMap(response.getSession()));
                result.putBoolean("requires2fa", response.getRequires2Fa());
                
                promise.resolve(result);
                
            } catch (Exception e) {
                promise.reject("LOGIN_ERROR", e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void registerUser(ReadableMap requestData, Promise promise) {
        if (grpcClient == null) {
            promise.reject("CLIENT_NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                User.RegisterUserRequest.Builder requestBuilder = User.RegisterUserRequest.newBuilder();
                
                if (requestData.hasKey("username")) {
                    requestBuilder.setUsername(requestData.getString("username"));
                }
                if (requestData.hasKey("email")) {
                    requestBuilder.setEmail(requestData.getString("email"));
                }
                if (requestData.hasKey("password")) {
                    requestBuilder.setPassword(requestData.getString("password"));
                }
                if (requestData.hasKey("displayName")) {
                    requestBuilder.setDisplayName(requestData.getString("displayName"));
                }
                if (requestData.hasKey("invitationCode")) {
                    requestBuilder.setInvitationCode(requestData.getString("invitationCode"));
                }
                if (requestData.hasKey("acceptTerms")) {
                    requestBuilder.setAcceptTerms(requestData.getBoolean("acceptTerms"));
                }
                if (requestData.hasKey("acceptPrivacy")) {
                    requestBuilder.setAcceptPrivacy(requestData.getBoolean("acceptPrivacy"));
                }
                
                User.RegisterUserResponse response = grpcClient.registerUser(requestBuilder.build());
                
                WritableMap result = Arguments.createMap();
                result.putMap("status", statusToWritableMap(response.getStatus()));
                result.putMap("user", userProfileToWritableMap(response.getUser()));
                result.putString("verificationToken", response.getVerificationToken());
                
                promise.resolve(result);
                
            } catch (Exception e) {
                promise.reject("REGISTER_ERROR", e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void verifyToken(ReadableMap requestData, Promise promise) {
        if (grpcClient == null) {
            promise.reject("CLIENT_NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                User.VerifyTokenRequest.Builder requestBuilder = User.VerifyTokenRequest.newBuilder();
                
                if (requestData.hasKey("token")) {
                    requestBuilder.setToken(requestData.getString("token"));
                }
                
                User.VerifyTokenResponse response = grpcClient.verifyToken(requestBuilder.build());
                
                WritableMap result = Arguments.createMap();
                result.putMap("status", statusToWritableMap(response.getStatus()));
                result.putMap("user", userProfileToWritableMap(response.getUser()));
                result.putMap("session", sessionToWritableMap(response.getSession()));
                
                promise.resolve(result);
                
            } catch (Exception e) {
                promise.reject("VERIFY_TOKEN_ERROR", e.getMessage(), e);
            }
        });
    }
    
    @ReactMethod
    public void getUserProfile(ReadableMap requestData, Promise promise) {
        if (grpcClient == null) {
            promise.reject("CLIENT_NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                User.GetUserProfileRequest.Builder requestBuilder = User.GetUserProfileRequest.newBuilder();
                
                if (requestData.hasKey("userId")) {
                    requestBuilder.setUserID(requestData.getString("userId"));
                }
                
                User.GetUserProfileResponse response = grpcClient.getUserProfile(requestBuilder.build());
                
                WritableMap result = Arguments.createMap();
                result.putMap("status", statusToWritableMap(response.getStatus()));
                result.putMap("user", userProfileToWritableMap(response.getUser()));
                
                promise.resolve(result);
                
            } catch (Exception e) {
                promise.reject("GET_USER_PROFILE_ERROR", e.getMessage(), e);
            }
        });
    }
    
    // MARK: - Health Check
    
    @ReactMethod
    public void healthCheck(Promise promise) {
        if (grpcClient == null) {
            promise.reject("CLIENT_NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                boolean isHealthy = grpcClient.healthCheck();
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", isHealthy);
                result.putString("status", isHealthy ? "OK" : "UNHEALTHY");
                promise.resolve(result);
            } catch (Exception e) {
                promise.reject("HEALTH_CHECK_ERROR", e.getMessage(), e);
            }
        });
    }
    
    // MARK: - Helper Methods
    
    private WritableMap noteToWritableMap(Note.Note note) {
        WritableMap map = Arguments.createMap();
        map.putString("id", note.getId());
        map.putString("authorId", note.getAuthorID());
        map.putString("text", note.getText());
        map.putInt("visibility", note.getVisibility().getNumber());
        map.putInt("contentWarning", note.getContentWarning().getNumber());
        
        WritableMap mediaIds = Arguments.createMap();
        for (int i = 0; i < note.getMediaIdsCount(); i++) {
            mediaIds.putString(String.valueOf(i), note.getMediaIds(i));
        }
        map.putMap("mediaIds", mediaIds);
        
        map.putMap("entities", entitiesToWritableMap(note.getEntities()));
        map.putMap("location", locationToWritableMap(note.getLocation()));
        map.putString("replyToNoteId", note.getReplyToNoteID());
        map.putString("replyToUserId", note.getReplyToUserID());
        map.putString("threadRootId", note.getThreadRootID());
        map.putString("renotedNoteId", note.getRenotedNoteID());
        map.putString("renotedUserId", note.getRenotedUserID());
        map.putBoolean("isQuoteRenote", note.getIsQuoteRenote());
        map.putMap("createdAt", timestampToWritableMap(note.getCreatedAt()));
        map.putMap("updatedAt", timestampToWritableMap(note.getUpdatedAt()));
        map.putMap("deletedAt", timestampToWritableMap(note.getDeletedAt()));
        map.putMap("metrics", metricsToWritableMap(note.getMetrics()));
        map.putString("languageCode", note.getLanguageCode());
        map.putBoolean("isVerifiedContent", note.getIsVerifiedContent());
        map.putString("clientName", note.getClientName());
        
        return map;
    }
    
    private WritableMap userNoteInteractionToWritableMap(Note.UserNoteInteraction interaction) {
        WritableMap map = Arguments.createMap();
        map.putString("userId", interaction.getUserID());
        map.putString("noteId", interaction.getNoteID());
        map.putBoolean("hasLiked", interaction.getHasLiked());
        map.putBoolean("hasRenoted", interaction.getHasRenoted());
        map.putBoolean("hasBookmarked", interaction.getHasBookmarked());
        map.putBoolean("hasReported", interaction.getHasReported());
        map.putMap("lastViewedAt", timestampToWritableMap(interaction.getLastViewedAt()));
        map.putMap("interactedAt", timestampToWritableMap(interaction.getInteractedAt()));
        return map;
    }
    
    private WritableMap userProfileToWritableMap(User.UserProfile profile) {
        WritableMap map = Arguments.createMap();
        map.putString("userId", profile.getUserID());
        map.putString("username", profile.getUsername());
        map.putString("email", profile.getEmail());
        map.putString("displayName", profile.getDisplayName());
        map.putString("bio", profile.getBio());
        map.putString("avatarUrl", profile.getAvatarURL());
        map.putString("location", profile.getLocation());
        map.putString("website", profile.getWebsite());
        map.putInt("status", profile.getStatus().getNumber());
        map.putBoolean("isVerified", profile.getIsVerified());
        map.putBoolean("isPrivate", profile.getIsPrivate());
        map.putMap("createdAt", timestampToWritableMap(profile.getCreatedAt()));
        map.putMap("updatedAt", timestampToWritableMap(profile.getUpdatedAt()));
        map.putMap("lastLogin", timestampToWritableMap(profile.getLastLogin()));
        map.putInt("followerCount", (int) profile.getFollowerCount());
        map.putInt("followingCount", (int) profile.getFollowingCount());
        map.putInt("noteCount", (int) profile.getNoteCount());
        return map;
    }
    
    private WritableMap sessionToWritableMap(User.Session session) {
        WritableMap map = Arguments.createMap();
        map.putString("sessionId", session.getSessionID());
        map.putString("userId", session.getUserID());
        map.putString("deviceId", session.getDeviceID());
        map.putString("deviceName", session.getDeviceName());
        map.putString("ipAddress", session.getIpAddress());
        map.putString("userAgent", session.getUserAgent());
        map.putInt("type", session.getType().getNumber());
        map.putMap("createdAt", timestampToWritableMap(session.getCreatedAt()));
        map.putMap("lastActivity", timestampToWritableMap(session.getLastActivity()));
        map.putMap("expiresAt", timestampToWritableMap(session.getExpiresAt()));
        map.putBoolean("isActive", session.getIsActive());
        map.putBoolean("isSuspicious", session.getIsSuspicious());
        map.putString("locationInfo", session.getLocationInfo());
        return map;
    }
    
    private WritableMap statusToWritableMap(Common.Status status) {
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
    
    private WritableMap entitiesToWritableMap(Note.NoteEntities entities) {
        WritableMap map = Arguments.createMap();
        
        WritableMap mentions = Arguments.createMap();
        for (int i = 0; i < entities.getMentionsCount(); i++) {
            Note.NoteMention mention = entities.getMentions(i);
            WritableMap mentionMap = Arguments.createMap();
            mentionMap.putString("userId", mention.getUserID());
            mentionMap.putString("username", mention.getUsername());
            mentionMap.putInt("startOffset", mention.getStartOffset());
            mentionMap.putInt("endOffset", mention.getEndOffset());
            mentions.putMap(String.valueOf(i), mentionMap);
        }
        map.putMap("mentions", mentions);
        
        WritableMap hashtags = Arguments.createMap();
        for (int i = 0; i < entities.getHashtagsCount(); i++) {
            Note.NoteHashtag hashtag = entities.getHashtags(i);
            WritableMap hashtagMap = Arguments.createMap();
            hashtagMap.putString("tag", hashtag.getTag());
            hashtagMap.putInt("startOffset", hashtag.getStartOffset());
            hashtagMap.putInt("endOffset", hashtag.getEndOffset());
            hashtags.putMap(String.valueOf(i), hashtagMap);
        }
        map.putMap("hashtags", hashtags);
        
        WritableMap links = Arguments.createMap();
        for (int i = 0; i < entities.getLinksCount(); i++) {
            Note.NoteLink link = entities.getLinks(i);
            WritableMap linkMap = Arguments.createMap();
            linkMap.putString("url", link.getUrl());
            linkMap.putString("title", link.getTitle());
            linkMap.putString("description", link.getDescription());
            linkMap.putString("imageUrl", link.getImageURL());
            linkMap.putInt("startOffset", link.getStartOffset());
            linkMap.putInt("endOffset", link.getEndOffset());
            links.putMap(String.valueOf(i), linkMap);
        }
        map.putMap("links", links);
        
        return map;
    }
    
    private WritableMap locationToWritableMap(Note.GeoLocation location) {
        WritableMap map = Arguments.createMap();
        map.putDouble("latitude", location.getLatitude());
        map.putDouble("longitude", location.getLongitude());
        map.putString("placeName", location.getPlaceName());
        map.putString("countryCode", location.getCountryCode());
        return map;
    }
    
    private WritableMap metricsToWritableMap(Note.NoteMetrics metrics) {
        WritableMap map = Arguments.createMap();
        map.putInt("likeCount", (int) metrics.getLikeCount());
        map.putInt("renoteCount", (int) metrics.getRenoteCount());
        map.putInt("replyCount", (int) metrics.getReplyCount());
        map.putInt("quoteCount", (int) metrics.getQuoteCount());
        map.putInt("bookmarkCount", (int) metrics.getBookmarkCount());
        map.putInt("viewCount", (int) metrics.getViewCount());
        map.putDouble("engagementRate", metrics.getEngagementRate());
        return map;
    }
    
    private WritableMap timestampToWritableMap(Common.Timestamp timestamp) {
        WritableMap map = Arguments.createMap();
        map.putInt("seconds", (int) timestamp.getSeconds());
        map.putInt("nanos", timestamp.getNanos());
        return map;
    }
    
    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        if (grpcClient != null) {
            try {
                grpcClient.shutdown();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        executorService.shutdown();
    }
}