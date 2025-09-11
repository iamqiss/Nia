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
import java.util.concurrent.TimeUnit;

/**
 * Main Time gRPC module providing access to all services
 */
public class TimeGrpcModule {
    
    // Service endpoints
    public static final String DEFAULT_HOST = "localhost";
    public static final int DEFAULT_PORT = 50051;
    
    // Service names
    public static class Service {
        public static final String NOTE = "sonet.note.NoteService";
        public static final String USER = "sonet.user.UserService";
        public static final String TIMELINE = "sonet.timeline.TimelineService";
        public static final String MEDIA = "sonet.media.MediaService";
        public static final String NOTIFICATION = "sonet.notification.NotificationService";
    }
    
    // Error types
    public static class TimeGrpcException extends Exception {
        public TimeGrpcException(String message) {
            super(message);
        }
        
        public TimeGrpcException(String message, Throwable cause) {
            super(message, cause);
        }
    }
    
    // Configuration
    public static class Config {
        public final String host;
        public final int port;
        public final boolean useTLS;
        public final long timeoutSeconds;
        
        public Config(String host, int port, boolean useTLS, long timeoutSeconds) {
            this.host = host;
            this.port = port;
            this.useTLS = useTLS;
            this.timeoutSeconds = timeoutSeconds;
        }
        
        public static Config defaultConfig() {
            return new Config(DEFAULT_HOST, DEFAULT_PORT, false, 30);
        }
    }
    
    // Client factory
    public static class ClientFactory {
        public static TimeGrpcClient createClient(Config config) {
            return new TimeGrpcClient(config);
        }
        
        public static TimeGrpcClient createDefaultClient() {
            return createClient(Config.defaultConfig());
        }
    }
}
