package com.time.grpc;

import android.util.Log;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import com.google.protobuf.Empty;
import com.google.protobuf.Timestamp;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicReference;

/**
 * High-performance gRPC client for Time service
 * Provides real-time time synchronization and streaming capabilities
 */
public class TimeGrpcClient {
    private static final String TAG = "TimeGrpcClient";
    
    private final ManagedChannel channel;
    private final TimeServiceGrpc.TimeServiceBlockingStub blockingStub;
    private final TimeServiceGrpc.TimeServiceStub asyncStub;
    
    // Connection configuration
    private static final int CONNECTION_TIMEOUT_SECONDS = 10;
    private static final int KEEPALIVE_TIME_SECONDS = 30;
    private static final int KEEPALIVE_TIMEOUT_SECONDS = 5;
    private static final int MAX_INBOUND_MESSAGE_SIZE = 4 * 1024 * 1024; // 4MB
    
    public TimeGrpcClient(String host, int port) {
        this.channel = createChannel(host, port);
        this.blockingStub = TimeServiceGrpc.newBlockingStub(channel);
        this.asyncStub = TimeServiceGrpc.newStub(channel);
    }
    
    public TimeGrpcClient(String host, int port, boolean useTls) {
        this.channel = createChannel(host, port, useTls);
        this.blockingStub = TimeServiceGrpc.newBlockingStub(channel);
        this.asyncStub = TimeServiceGrpc.newStub(channel);
    }
    
    private ManagedChannel createChannel(String host, int port) {
        return createChannel(host, port, false);
    }
    
    private ManagedChannel createChannel(String host, int port, boolean useTls) {
        ManagedChannelBuilder<?> builder = ManagedChannelBuilder
            .forAddress(host, port)
            .keepAliveTime(KEEPALIVE_TIME_SECONDS, TimeUnit.SECONDS)
            .keepAliveTimeout(KEEPALIVE_TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .keepAliveWithoutCalls(true)
            .maxInboundMessageSize(MAX_INBOUND_MESSAGE_SIZE)
            .maxInboundMetadataSize(8192);
            
        if (!useTls) {
            builder.usePlaintext();
        }
        
        return builder.build();
    }
    
    /**
     * Get current server time synchronously
     */
    public TimeResponse getCurrentTime() throws Exception {
        try {
            Log.d(TAG, "Requesting current time from server");
            TimeResponse response = blockingStub.getCurrentTime(Empty.getDefaultInstance());
            Log.d(TAG, "Received time: " + response.getFormattedTime());
            return response;
        } catch (Exception e) {
            Log.e(TAG, "Failed to get current time", e);
            throw e;
        }
    }
    
    /**
     * Get current server time with specific timezone
     */
    public TimeResponse getTimeWithTimezone(String timezone) throws Exception {
        try {
            Log.d(TAG, "Requesting time with timezone: " + timezone);
            TimezoneRequest request = TimezoneRequest.newBuilder()
                .setTimezone(timezone)
                .build();
            TimeResponse response = blockingStub.getTimeWithTimezone(request);
            Log.d(TAG, "Received time for timezone " + timezone + ": " + response.getFormattedTime());
            return response;
        } catch (Exception e) {
            Log.e(TAG, "Failed to get time with timezone", e);
            throw e;
        }
    }
    
    /**
     * Get time statistics
     */
    public TimeStatsResponse getTimeStats() throws Exception {
        try {
            Log.d(TAG, "Requesting time statistics");
            TimeStatsResponse response = blockingStub.getTimeStats(Empty.getDefaultInstance());
            Log.d(TAG, "Received time stats: uptime=" + response.getUptimeSeconds() + "s");
            return response;
        } catch (Exception e) {
            Log.e(TAG, "Failed to get time statistics", e);
            throw e;
        }
    }
    
    /**
     * Stream real-time time updates asynchronously
     */
    public void streamTime(TimeStreamCallback callback) {
        Log.d(TAG, "Starting time stream");
        
        StreamObserver<TimeUpdate> responseObserver = new StreamObserver<TimeUpdate>() {
            @Override
            public void onNext(TimeUpdate update) {
                Log.d(TAG, "Received time update: " + update.getFormattedTime());
                if (callback != null) {
                    callback.onTimeUpdate(update);
                }
            }
            
            @Override
            public void onError(Throwable t) {
                Log.e(TAG, "Time stream error", t);
                if (callback != null) {
                    callback.onError(t);
                }
            }
            
            @Override
            public void onCompleted() {
                Log.d(TAG, "Time stream completed");
                if (callback != null) {
                    callback.onCompleted();
                }
            }
        };
        
        asyncStub.streamTime(Empty.getDefaultInstance(), responseObserver);
    }
    
    /**
     * Stream time updates with timeout
     */
    public void streamTimeWithTimeout(TimeStreamCallback callback, int timeoutSeconds) {
        final CountDownLatch latch = new CountDownLatch(1);
        final AtomicReference<StreamObserver<TimeUpdate>> streamRef = new AtomicReference<>();
        
        StreamObserver<TimeUpdate> responseObserver = new StreamObserver<TimeUpdate>() {
            @Override
            public void onNext(TimeUpdate update) {
                Log.d(TAG, "Received time update: " + update.getFormattedTime());
                if (callback != null) {
                    callback.onTimeUpdate(update);
                }
            }
            
            @Override
            public void onError(Throwable t) {
                Log.e(TAG, "Time stream error", t);
                if (callback != null) {
                    callback.onError(t);
                }
                latch.countDown();
            }
            
            @Override
            public void onCompleted() {
                Log.d(TAG, "Time stream completed");
                if (callback != null) {
                    callback.onCompleted();
                }
                latch.countDown();
            }
        };
        
        streamRef.set(asyncStub.streamTime(Empty.getDefaultInstance(), responseObserver));
        
        // Start timeout thread
        new Thread(() -> {
            try {
                Thread.sleep(timeoutSeconds * 1000);
                if (latch.getCount() > 0) {
                    Log.w(TAG, "Time stream timeout, cancelling");
                    streamRef.get().onCompleted();
                    latch.countDown();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }
    
    /**
     * Check if the client is connected
     */
    public boolean isConnected() {
        return !channel.isShutdown() && !channel.isTerminated();
    }
    
    /**
     * Get connection state
     */
    public String getConnectionState() {
        if (channel.isShutdown()) {
            return "SHUTDOWN";
        } else if (channel.isTerminated()) {
            return "TERMINATED";
        } else {
            return "READY";
        }
    }
    
    /**
     * Gracefully shutdown the client
     */
    public void shutdown() {
        Log.d(TAG, "Shutting down gRPC client");
        try {
            channel.shutdown().awaitTermination(CONNECTION_TIMEOUT_SECONDS, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Log.e(TAG, "Interrupted while shutting down", e);
            Thread.currentThread().interrupt();
        }
    }
    
    /**
     * Force shutdown the client
     */
    public void shutdownNow() {
        Log.d(TAG, "Force shutting down gRPC client");
        channel.shutdownNow();
    }
    
    /**
     * Callback interface for time stream updates
     */
    public interface TimeStreamCallback {
        void onTimeUpdate(TimeUpdate update);
        void onError(Throwable error);
        void onCompleted();
    }
    
    /**
     * Utility method to convert Timestamp to milliseconds
     */
    public static long timestampToMillis(Timestamp timestamp) {
        return timestamp.getSeconds() * 1000 + timestamp.getNanos() / 1_000_000;
    }
    
    /**
     * Utility method to get current time in milliseconds
     */
    public static long getCurrentTimeMillis() {
        return System.currentTimeMillis();
    }
}