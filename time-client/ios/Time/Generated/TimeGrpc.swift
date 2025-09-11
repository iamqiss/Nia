//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import Foundation

// MARK: - Time gRPC Module
// This file provides a unified interface to all gRPC services

public enum TimeGrpc {
    // Service endpoints
    public static let defaultHost = "localhost"
    public static let defaultPort = 50051
    
    // Service names
    public enum Service {
        public static let note = "sonet.note.NoteService"
        public static let user = "sonet.user.UserService"
        public static let timeline = "sonet.timeline.TimelineService"
        public static let media = "sonet.media.MediaService"
        public static let notification = "sonet.notification.NotificationService"
    }
}

// MARK: - Error Types
public enum TimeGrpcError: Error, LocalizedError {
    case connectionFailed(String)
    case serviceUnavailable(String)
    case invalidRequest(String)
    case authenticationFailed(String)
    case networkError(String)
    case unknown(String)
    
    public var errorDescription: String? {
        switch self {
        case .connectionFailed(let message):
            return "Connection failed: \(message)"
        case .serviceUnavailable(let message):
            return "Service unavailable: \(message)"
        case .invalidRequest(let message):
            return "Invalid request: \(message)"
        case .authenticationFailed(let message):
            return "Authentication failed: \(message)"
        case .networkError(let message):
            return "Network error: \(message)"
        case .unknown(let message):
            return "Unknown error: \(message)"
        }
    }
}

// MARK: - Configuration
public struct TimeGrpcConfig {
    public let host: String
    public let port: Int
    public let useTLS: Bool
    public let timeout: TimeInterval
    
    public init(
        host: String = TimeGrpc.defaultHost,
        port: Int = TimeGrpc.defaultPort,
        useTLS: Bool = false,
        timeout: TimeInterval = 30.0
    ) {
        self.host = host
        self.port = port
        self.useTLS = useTLS
        self.timeout = timeout
    }
}
