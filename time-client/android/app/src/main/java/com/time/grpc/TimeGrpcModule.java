package com.time.grpc;

import android.util.Log;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.protobuf.Empty;
import com.google.protobuf.Timestamp;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * React Native bridge module for Time gRPC client
 * Provides JavaScript interface to native gRPC functionality
 */
public class TimeGrpcModule extends ReactContextBaseJavaModule {
    private static final String TAG = "TimeGrpcModule";
    private static final String MODULE_NAME = "TimeGrpc";
    
    private TimeGrpcClient grpcClient;
    private ExecutorService executorService;
    private boolean isStreaming = false;
    
    public TimeGrpcModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.executorService = Executors.newCachedThreadPool();
    }
    
    @Override
    public String getName() {
        return MODULE_NAME;
    }
    
    /**
     * Initialize gRPC client with server configuration
     */
    @ReactMethod
    public void initialize(String host, int port, boolean useTls, Promise promise) {
        try {
            Log.d(TAG, "Initializing gRPC client: " + host + ":" + port + " (TLS: " + useTls + ")");
            
            if (grpcClient != null) {
                grpcClient.shutdown();
            }
            
            grpcClient = new TimeGrpcClient(host, port, useTls);
            
            // Test connection
            TimeResponse response = grpcClient.getCurrentTime();
            
            WritableMap result = Arguments.createMap();
            result.putString("status", "connected");
            result.putString("serverTime", response.getFormattedTime());
            result.putDouble("unixTimestamp", response.getUnixTimestamp());
            result.putString("timezone", response.getTimezone());
            
            promise.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "Failed to initialize gRPC client", e);
            promise.reject("INIT_ERROR", "Failed to initialize gRPC client: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get current server time
     */
    @ReactMethod
    public void getCurrentTime(Promise promise) {
        if (grpcClient == null) {
            promise.reject("NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                TimeResponse response = grpcClient.getCurrentTime();
                
                WritableMap result = Arguments.createMap();
                result.putString("formattedTime", response.getFormattedTime());
                result.putDouble("unixTimestamp", response.getUnixTimestamp());
                result.putString("timezone", response.getTimezone());
                result.putBoolean("isUtc", response.getIsUtc());
                
                promise.resolve(result);
            } catch (Exception e) {
                Log.e(TAG, "Failed to get current time", e);
                promise.reject("GRPC_ERROR", "Failed to get current time: " + e.getMessage(), e);
            }
        });
    }
    
    /**
     * Get time with specific timezone
     */
    @ReactMethod
    public void getTimeWithTimezone(String timezone, Promise promise) {
        if (grpcClient == null) {
            promise.reject("NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                TimeResponse response = grpcClient.getTimeWithTimezone(timezone);
                
                WritableMap result = Arguments.createMap();
                result.putString("formattedTime", response.getFormattedTime());
                result.putDouble("unixTimestamp", response.getUnixTimestamp());
                result.putString("timezone", response.getTimezone());
                result.putBoolean("isUtc", response.getIsUtc());
                
                promise.resolve(result);
            } catch (Exception e) {
                Log.e(TAG, "Failed to get time with timezone", e);
                promise.reject("GRPC_ERROR", "Failed to get time with timezone: " + e.getMessage(), e);
            }
        });
    }
    
    /**
     * Get time statistics
     */
    @ReactMethod
    public void getTimeStats(Promise promise) {
        if (grpcClient == null) {
            promise.reject("NOT_INITIALIZED", "gRPC client not initialized");
            return;
        }
        
        executorService.execute(() -> {
            try {
                TimeStatsResponse response = grpcClient.getTimeStats();
                
                WritableMap result = Arguments.createMap();
                result.putString("serverVersion", response.getServerVersion());
                result.putDouble("uptimeSeconds", response.getUptimeSeconds());
                result.putDouble("totalRequests", response.getTotalRequests());
                result.putDouble("averageResponseTimeMs", response.getAverageResponseTimeMs());
                
                promise.resolve(result);
            } catch (Exception e) {
                Log.e(TAG, "Failed to get time stats", e);
                promise.reject("GRPC_ERROR", "Failed to get time stats: " + e.getMessage(), e);
            }
        });
    }
    
    /**
     * Start streaming time updates
     */
    @ReactMethod
    public void startTimeStream() {
        if (grpcClient == null) {
            Log.e(TAG, "gRPC client not initialized");
            return;
        }
        
        if (isStreaming) {
            Log.w(TAG, "Time stream already active");
            return;
        }
        
        isStreaming = true;
        Log.d(TAG, "Starting time stream");
        
        executorService.execute(() -> {
            grpcClient.streamTime(new TimeGrpcClient.TimeStreamCallback() {
                @Override
                public void onTimeUpdate(TimeUpdate update) {
                    WritableMap eventData = Arguments.createMap();
                    eventData.putString("formattedTime", update.getFormattedTime());
                    eventData.putDouble("unixTimestamp", update.getUnixTimestamp());
                    eventData.putString("timezone", update.getTimezone());
                    eventData.putInt("updateIntervalMs", update.getUpdateIntervalMs());
                    
                    sendEvent("TimeUpdate", eventData);
                }
                
                @Override
                public void onError(Throwable error) {
                    Log.e(TAG, "Time stream error", error);
                    isStreaming = false;
                    
                    WritableMap eventData = Arguments.createMap();
                    eventData.putString("error", error.getMessage());
                    
                    sendEvent("TimeStreamError", eventData);
                }
                
                @Override
                public void onCompleted() {
                    Log.d(TAG, "Time stream completed");
                    isStreaming = false;
                    sendEvent("TimeStreamCompleted", null);
                }
            });
        });
    }
    
    /**
     * Stop streaming time updates
     */
    @ReactMethod
    public void stopTimeStream() {
        if (!isStreaming) {
            Log.w(TAG, "Time stream not active");
            return;
        }
        
        Log.d(TAG, "Stopping time stream");
        isStreaming = false;
        
        // Note: gRPC streams don't have a direct way to cancel from client side
        // The server should handle this gracefully
        sendEvent("TimeStreamStopped", null);
    }
    
    /**
     * Check connection status
     */
    @ReactMethod
    public void getConnectionStatus(Promise promise) {
        if (grpcClient == null) {
            WritableMap result = Arguments.createMap();
            result.putString("status", "NOT_INITIALIZED");
            result.putBoolean("connected", false);
            promise.resolve(result);
            return;
        }
        
        WritableMap result = Arguments.createMap();
        result.putString("status", grpcClient.getConnectionState());
        result.putBoolean("connected", grpcClient.isConnected());
        result.putBoolean("streaming", isStreaming);
        
        promise.resolve(result);
    }
    
    /**
     * Shutdown gRPC client
     */
    @ReactMethod
    public void shutdown() {
        Log.d(TAG, "Shutting down gRPC module");
        
        isStreaming = false;
        
        if (grpcClient != null) {
            grpcClient.shutdown();
            grpcClient = null;
        }
        
        if (executorService != null) {
            executorService.shutdown();
            try {
                if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
                    executorService.shutdownNow();
                }
            } catch (InterruptedException e) {
                executorService.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }
    
    /**
     * Send event to JavaScript
     */
    private void sendEvent(String eventName, WritableMap params) {
        ReactApplicationContext reactContext = getReactApplicationContext();
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
        }
    }
    
    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        shutdown();
    }
}