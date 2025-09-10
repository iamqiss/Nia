package com.time.pushnotifications;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.FirebaseApp;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;

/**
 * TimePushNotifications - Native Android Push Notification Module
 * 
 * This module provides a comprehensive push notification system that:
 * - Integrates directly with Firebase Cloud Messaging (FCM)
 * - Communicates with time-server via gRPC for notification management
 * - Handles device registration, token management, and notification processing
 * - Supports rich notifications, background processing, and user interactions
 * - Provides advanced features like notification channels, actions, and grouping
 * 
 * Architecture:
 * - FCM for Android push notifications
 * - gRPC client for server communication
 * - Background service for notification handling
 * - Rich notification support with media, actions, and custom UI
 * - Notification channels for Android 8.0+ compatibility
 */
public class TimePushNotificationsModule extends ReactContextBaseJavaModule {
    
    private static final String TAG = "TimePushNotifications";
    private static final String MODULE_NAME = "TimePushNotifications";
    
    // Notification channel IDs
    private static final String CHANNEL_LIKE = "like_notifications";
    private static final String CHANNEL_FOLLOW = "follow_notifications";
    private static final String CHANNEL_MENTION = "mention_notifications";
    private static final String CHANNEL_REPLY = "reply_notifications";
    private static final String CHANNEL_REPOST = "repost_notifications";
    private static final String CHANNEL_CHAT = "chat_notifications";
    private static final String CHANNEL_GENERAL = "general_notifications";
    
    // Action identifiers
    private static final String ACTION_LIKE = "LIKE_ACTION";
    private static final String ACTION_REPLY = "REPLY_ACTION";
    private static final String ACTION_FOLLOW_BACK = "FOLLOW_BACK_ACTION";
    private static final String ACTION_VIEW = "VIEW_ACTION";
    private static final String ACTION_DISMISS = "DISMISS_ACTION";
    
    private final ReactApplicationContext reactContext;
    private final NotificationManager notificationManager;
    private final ExecutorService executorService;
    
    private String currentUserId;
    private String deviceToken;
    private boolean isInitialized = false;
    private boolean debugLoggingEnabled = false;
    
    // gRPC service
    private ManagedChannel grpcChannel;
    private TimeNotificationServiceGrpc.TimeNotificationServiceStub grpcService;
    
    // Statistics tracking
    private Map<String, Map<String, Object>> notificationStats = new HashMap<>();
    
    public TimePushNotificationsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.notificationManager = (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);
        this.executorService = Executors.newCachedThreadPool();
        
        initializeFirebase();
        setupNotificationChannels();
    }
    
    @Override
    @NonNull
    public String getName() {
        return MODULE_NAME;
    }
    
    // MARK: - Initialization and Configuration
    
    @ReactMethod
    public void initialize(ReadableMap config, Promise promise) {
        try {
            ReadableMap serverConfig = config.getMap("server");
            ReadableMap fcmConfig = config.getMap("fcm");
            
            // Initialize gRPC connection
            String serverHost = serverConfig.hasKey("host") ? serverConfig.getString("host") : "localhost";
            int serverPort = serverConfig.hasKey("port") ? serverConfig.getInt("port") : 50051;
            boolean useSSL = serverConfig.hasKey("useSSL") && serverConfig.getBoolean("useSSL");
            
            grpcChannel = ManagedChannelBuilder.forAddress(serverHost, serverPort)
                    .usePlaintext() // Use SSL if needed
                    .build();
            
            grpcService = TimeNotificationServiceGrpc.newStub(grpcChannel);
            
            isInitialized = true;
            setupNotificationChannels();
            
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            promise.resolve(result);
            
        } catch (Exception e) {
            promise.reject("INIT_ERROR", "Failed to initialize push notifications", e);
        }
    }
    
    @ReactMethod
    public void registerDevice(String userId, ReadableMap deviceInfo, Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "Push notifications not initialized");
            return;
        }
        
        currentUserId = userId;
        
        // Get FCM token
        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(new OnCompleteListener<String>() {
                    @Override
                    public void onComplete(@NonNull Task<String> task) {
                        if (!task.isSuccessful()) {
                            promise.reject("TOKEN_ERROR", "Failed to get FCM token", task.getException());
                            return;
                        }
                        
                        deviceToken = task.getResult();
                        registerDeviceWithServer(userId, deviceInfo, deviceToken, promise);
                    }
                });
    }
    
    @ReactMethod
    public void requestPermissions(ReadableMap options, Promise promise) {
        // Android permissions are handled automatically by FCM
        // We just need to check if notifications are enabled
        boolean notificationsEnabled = NotificationManagerCompat.from(reactContext).areNotificationsEnabled();
        
        WritableMap result = Arguments.createMap();
        result.putBoolean("granted", notificationsEnabled);
        promise.resolve(result);
    }
    
    @ReactMethod
    public void sendLocalNotification(ReadableMap notificationData, Promise promise) {
        try {
            String title = notificationData.hasKey("title") ? notificationData.getString("title") : "";
            String body = notificationData.hasKey("body") ? notificationData.getString("body") : "";
            String notificationId = notificationData.hasKey("id") ? notificationData.getString("id") : String.valueOf(System.currentTimeMillis());
            String category = notificationData.hasKey("category") ? notificationData.getString("category") : CHANNEL_GENERAL;
            
            // Create notification
            NotificationCompat.Builder builder = new NotificationCompat.Builder(reactContext, category)
                    .setSmallIcon(R.drawable.ic_notification)
                    .setContentTitle(title)
                    .setContentText(body)
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setAutoCancel(true);
            
            // Add sound
            Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            builder.setSound(soundUri);
            
            // Add vibration
            builder.setVibrate(new long[]{0, 250, 250, 250});
            
            // Add large icon if provided
            if (notificationData.hasKey("largeIcon")) {
                String iconUrl = notificationData.getString("largeIcon");
                Bitmap largeIcon = loadBitmapFromUrl(iconUrl);
                if (largeIcon != null) {
                    builder.setLargeIcon(largeIcon);
                }
            }
            
            // Add big picture if provided
            if (notificationData.hasKey("bigPicture")) {
                String pictureUrl = notificationData.getString("bigPicture");
                Bitmap bigPicture = loadBitmapFromUrl(pictureUrl);
                if (bigPicture != null) {
                    NotificationCompat.BigPictureStyle bigPictureStyle = new NotificationCompat.BigPictureStyle()
                            .bigPicture(bigPicture);
                    builder.setStyle(bigPictureStyle);
                }
            }
            
            // Add actions based on category
            addNotificationActions(builder, category);
            
            // Create pending intent
            Intent intent = new Intent(reactContext, getMainActivityClass());
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            PendingIntent pendingIntent = PendingIntent.getActivity(reactContext, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
            builder.setContentIntent(pendingIntent);
            
            // Show notification
            notificationManager.notify(notificationId.hashCode(), builder.build());
            
            // Track notification
            trackNotificationEvent(notificationId, "sent", null);
            
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            promise.resolve(result);
            
        } catch (Exception e) {
            promise.reject("NOTIFICATION_ERROR", "Failed to send notification", e);
        }
    }
    
    @ReactMethod
    public void updateBadgeCount(int count, Promise promise) {
        // Android doesn't have a direct badge count API, but we can use notification count
        // This is a simplified implementation
        try {
            // Store badge count in shared preferences or local database
            // For now, we'll just emit an event
            sendEvent("badgeCountChanged", Arguments.createMap().putInt("count", count));
            
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("BADGE_ERROR", "Failed to update badge count", e);
        }
    }
    
    @ReactMethod
    public void clearBadge(Promise promise) {
        updateBadgeCount(0, promise);
    }
    
    @ReactMethod
    public void getBadgeCount(Promise promise) {
        // Android doesn't have a direct badge count API
        // Return 0 for now, but this could be implemented with local storage
        WritableMap result = Arguments.createMap();
        result.putInt("count", 0);
        promise.resolve(result);
    }
    
    @ReactMethod
    public void acknowledgeNotification(String notificationId, String action, Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "Push notifications not initialized");
            return;
        }
        
        // Send acknowledgment to server via gRPC
        TimeNotificationAcknowledgmentRequest request = TimeNotificationAcknowledgmentRequest.newBuilder()
                .setNotificationId(notificationId)
                .setUserId(currentUserId)
                .setAction(action)
                .setTimestamp(System.currentTimeMillis() / 1000.0)
                .build();
        
        grpcService.acknowledgeNotification(request, new StreamObserver<TimeNotificationAcknowledgmentResponse>() {
            @Override
            public void onNext(TimeNotificationAcknowledgmentResponse response) {
                WritableMap result = Arguments.createMap();
                result.putBoolean("success", response.getSuccess());
                promise.resolve(result);
            }
            
            @Override
            public void onError(Throwable t) {
                promise.reject("ACK_ERROR", "Failed to acknowledge notification", t);
            }
            
            @Override
            public void onCompleted() {
                // gRPC call completed
            }
        });
    }
    
    @ReactMethod
    public void sendTestNotification(String title, String body, Promise promise) {
        WritableMap testData = Arguments.createMap();
        testData.putString("title", title);
        testData.putString("body", body);
        testData.putString("id", String.valueOf(System.currentTimeMillis()));
        testData.putString("category", "TEST_CATEGORY");
        
        sendLocalNotification(testData, promise);
    }
    
    @ReactMethod
    public void getDebugInfo(Promise promise) {
        WritableMap debugInfo = Arguments.createMap();
        debugInfo.putBoolean("isInitialized", isInitialized);
        debugInfo.putString("deviceToken", deviceToken != null ? deviceToken : "");
        debugInfo.putString("currentUserId", currentUserId != null ? currentUserId : "");
        debugInfo.putMap("notificationStats", Arguments.fromMap(notificationStats));
        debugInfo.putBoolean("debugLoggingEnabled", debugLoggingEnabled);
        
        promise.resolve(debugInfo);
    }
    
    // MARK: - Private Methods
    
    private void initializeFirebase() {
        if (FirebaseApp.getApps(reactContext).isEmpty()) {
            FirebaseApp.initializeApp(reactContext);
        }
    }
    
    private void setupNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Like notifications channel
            NotificationChannel likeChannel = new NotificationChannel(
                    CHANNEL_LIKE,
                    "Like Notifications",
                    NotificationManager.IMPORTANCE_HIGH
            );
            likeChannel.setDescription("Notifications for likes on your posts");
            likeChannel.enableLights(true);
            likeChannel.enableVibration(true);
            notificationManager.createNotificationChannel(likeChannel);
            
            // Follow notifications channel
            NotificationChannel followChannel = new NotificationChannel(
                    CHANNEL_FOLLOW,
                    "Follow Notifications",
                    NotificationManager.IMPORTANCE_HIGH
            );
            followChannel.setDescription("Notifications for new followers");
            followChannel.enableLights(true);
            followChannel.enableVibration(true);
            notificationManager.createNotificationChannel(followChannel);
            
            // Mention notifications channel
            NotificationChannel mentionChannel = new NotificationChannel(
                    CHANNEL_MENTION,
                    "Mention Notifications",
                    NotificationManager.IMPORTANCE_HIGH
            );
            mentionChannel.setDescription("Notifications when you're mentioned");
            mentionChannel.enableLights(true);
            mentionChannel.enableVibration(true);
            notificationManager.createNotificationChannel(mentionChannel);
            
            // Reply notifications channel
            NotificationChannel replyChannel = new NotificationChannel(
                    CHANNEL_REPLY,
                    "Reply Notifications",
                    NotificationManager.IMPORTANCE_HIGH
            );
            replyChannel.setDescription("Notifications for replies to your posts");
            replyChannel.enableLights(true);
            replyChannel.enableVibration(true);
            notificationManager.createNotificationChannel(replyChannel);
            
            // Repost notifications channel
            NotificationChannel repostChannel = new NotificationChannel(
                    CHANNEL_REPOST,
                    "Repost Notifications",
                    NotificationManager.IMPORTANCE_HIGH
            );
            repostChannel.setDescription("Notifications for reposts of your posts");
            repostChannel.enableLights(true);
            repostChannel.enableVibration(true);
            notificationManager.createNotificationChannel(repostChannel);
            
            // Chat notifications channel
            NotificationChannel chatChannel = new NotificationChannel(
                    CHANNEL_CHAT,
                    "Chat Notifications",
                    NotificationManager.IMPORTANCE_HIGH
            );
            chatChannel.setDescription("Notifications for chat messages");
            chatChannel.enableLights(true);
            chatChannel.enableVibration(true);
            notificationManager.createNotificationChannel(chatChannel);
            
            // General notifications channel
            NotificationChannel generalChannel = new NotificationChannel(
                    CHANNEL_GENERAL,
                    "General Notifications",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            generalChannel.setDescription("General notifications");
            generalChannel.enableLights(true);
            generalChannel.enableVibration(true);
            notificationManager.createNotificationChannel(generalChannel);
        }
    }
    
    private void registerDeviceWithServer(String userId, ReadableMap deviceInfo, String token, Promise promise) {
        TimeDeviceRegistrationRequest request = TimeDeviceRegistrationRequest.newBuilder()
                .setUserId(userId)
                .setDeviceToken(token)
                .setPlatform("android")
                .setAppVersion(deviceInfo.hasKey("appVersion") ? deviceInfo.getString("appVersion") : "1.0.0")
                .setOsVersion(deviceInfo.hasKey("osVersion") ? deviceInfo.getString("osVersion") : Build.VERSION.RELEASE)
                .setDeviceModel(deviceInfo.hasKey("deviceModel") ? deviceInfo.getString("deviceModel") : Build.MODEL)
                .setTimezone(deviceInfo.hasKey("timezone") ? deviceInfo.getString("timezone") : "UTC")
                .setLanguage(deviceInfo.hasKey("language") ? deviceInfo.getString("language") : "en")
                .build();
        
        grpcService.registerDevice(request, new StreamObserver<TimeDeviceRegistrationResponse>() {
            @Override
            public void onNext(TimeDeviceRegistrationResponse response) {
                if (response.getSuccess()) {
                    sendEvent("tokenUpdated", Arguments.createMap().putString("token", token));
                    WritableMap result = Arguments.createMap();
                    result.putBoolean("success", true);
                    promise.resolve(result);
                } else {
                    promise.reject("REGISTRATION_ERROR", "Device registration failed");
                }
            }
            
            @Override
            public void onError(Throwable t) {
                promise.reject("REGISTRATION_ERROR", "Failed to register device", t);
            }
            
            @Override
            public void onCompleted() {
                // gRPC call completed
            }
        });
    }
    
    private void addNotificationActions(NotificationCompat.Builder builder, String category) {
        switch (category) {
            case CHANNEL_LIKE:
                // Add like action
                Intent likeIntent = new Intent(reactContext, NotificationActionReceiver.class);
                likeIntent.setAction(ACTION_LIKE);
                PendingIntent likePendingIntent = PendingIntent.getBroadcast(reactContext, 0, likeIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                builder.addAction(R.drawable.ic_like, "Like", likePendingIntent);
                break;
                
            case CHANNEL_FOLLOW:
                // Add follow back action
                Intent followIntent = new Intent(reactContext, NotificationActionReceiver.class);
                followIntent.setAction(ACTION_FOLLOW_BACK);
                PendingIntent followPendingIntent = PendingIntent.getBroadcast(reactContext, 0, followIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                builder.addAction(R.drawable.ic_follow, "Follow Back", followPendingIntent);
                break;
                
            case CHANNEL_MENTION:
            case CHANNEL_REPLY:
                // Add view and reply actions
                Intent viewIntent = new Intent(reactContext, NotificationActionReceiver.class);
                viewIntent.setAction(ACTION_VIEW);
                PendingIntent viewPendingIntent = PendingIntent.getBroadcast(reactContext, 0, viewIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                builder.addAction(R.drawable.ic_view, "View", viewPendingIntent);
                
                Intent replyIntent = new Intent(reactContext, NotificationActionReceiver.class);
                replyIntent.setAction(ACTION_REPLY);
                PendingIntent replyPendingIntent = PendingIntent.getBroadcast(reactContext, 0, replyIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                builder.addAction(R.drawable.ic_reply, "Reply", replyPendingIntent);
                break;
                
            case CHANNEL_CHAT:
                // Add reply action for chat
                Intent chatReplyIntent = new Intent(reactContext, NotificationActionReceiver.class);
                chatReplyIntent.setAction(ACTION_REPLY);
                PendingIntent chatReplyPendingIntent = PendingIntent.getBroadcast(reactContext, 0, chatReplyIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                builder.addAction(R.drawable.ic_reply, "Reply", chatReplyPendingIntent);
                break;
        }
        
        // Add dismiss action to all notifications
        Intent dismissIntent = new Intent(reactContext, NotificationActionReceiver.class);
        dismissIntent.setAction(ACTION_DISMISS);
        PendingIntent dismissPendingIntent = PendingIntent.getBroadcast(reactContext, 0, dismissIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        builder.addAction(R.drawable.ic_dismiss, "Dismiss", dismissPendingIntent);
    }
    
    private Bitmap loadBitmapFromUrl(String url) {
        try {
            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();
            return BitmapFactory.decodeStream(input);
        } catch (IOException e) {
            Log.e(TAG, "Failed to load bitmap from URL: " + url, e);
            return null;
        }
    }
    
    private Class<?> getMainActivityClass() {
        // This should return the main activity class
        // Implementation depends on your app structure
        try {
            return Class.forName("com.time.client.MainActivity");
        } catch (ClassNotFoundException e) {
            Log.e(TAG, "Main activity class not found", e);
            return null;
        }
    }
    
    private void trackNotificationEvent(String notificationId, String eventType, Map<String, Object> metadata) {
        Map<String, Object> stats = notificationStats.get(eventType);
        if (stats == null) {
            stats = new HashMap<>();
            notificationStats.put(eventType, stats);
        }
        
        Integer count = (Integer) stats.get("count");
        if (count == null) count = 0;
        stats.put("count", count + 1);
        stats.put("lastEvent", System.currentTimeMillis() / 1000.0);
        
        if (metadata != null) {
            stats.putAll(metadata);
        }
    }
    
    private void sendEvent(String eventName, WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
    
    // MARK: - Public Methods for External Use
    
    public void handleNotificationReceived(RemoteMessage remoteMessage) {
        Map<String, String> data = remoteMessage.getData();
        WritableMap notificationData = Arguments.createMap();
        
        for (Map.Entry<String, String> entry : data.entrySet()) {
            notificationData.putString(entry.getKey(), entry.getValue());
        }
        
        sendEvent("notificationReceived", notificationData);
        trackNotificationEvent(remoteMessage.getMessageId(), "received", null);
    }
    
    public void handleNotificationOpened(Intent intent) {
        Bundle extras = intent.getExtras();
        if (extras != null) {
            WritableMap notificationData = Arguments.createMap();
            for (String key : extras.keySet()) {
                Object value = extras.get(key);
                if (value instanceof String) {
                    notificationData.putString(key, (String) value);
                } else if (value instanceof Integer) {
                    notificationData.putInt(key, (Integer) value);
                } else if (value instanceof Boolean) {
                    notificationData.putBoolean(key, (Boolean) value);
                }
            }
            
            sendEvent("notificationOpened", notificationData);
            trackNotificationEvent(extras.getString("notificationId", ""), "opened", null);
        }
    }
    
    public void cleanup() {
        if (grpcChannel != null && !grpcChannel.isShutdown()) {
            grpcChannel.shutdown();
        }
        executorService.shutdown();
    }
}