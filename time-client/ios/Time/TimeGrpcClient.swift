import Foundation
import GRPC
import NIO
import NIOConcurrencyHelpers
import Logging

/**
 * High-performance gRPC client for Time service
 * Provides real-time time synchronization and streaming capabilities
 */
@objc(TimeGrpcClient)
public class TimeGrpcClient: NSObject {
    
    // MARK: - Properties
    
    private let group: EventLoopGroup
    private let channel: GRPCChannel
    private let client: Time_TimeServiceNIOClient
    private let logger = Logger(label: "TimeGrpcClient")
    
    // Connection configuration
    private static let connectionTimeoutSeconds: Int64 = 10
    private static let keepaliveTimeSeconds: Int64 = 30
    private static let keepaliveTimeoutSeconds: Int64 = 5
    private static let maxInboundMessageSize = 4 * 1024 * 1024 // 4MB
    
    // MARK: - Initialization
    
    @objc
    public init(host: String, port: Int, useTLS: Bool = false) throws {
        // Create event loop group
        self.group = MultiThreadedEventLoopGroup(numberOfThreads: 1)
        
        // Configure channel
        let channelBuilder = GRPCChannelBuilder.with(
            target: .host(host, port: port),
            transportSecurity: useTLS ? .tls(GRPCTLSConfiguration.makeClientDefault(for: group)) : .plaintext,
            eventLoopGroup: group
        )
        
        // Set connection parameters
        channelBuilder.connectionBackoff = .oneSecondFixed
        channelBuilder.connectionTimeout = .seconds(TimeGrpcClient.connectionTimeoutSeconds)
        channelBuilder.keepalive = ClientConnectionKeepalive(
            interval: .seconds(TimeGrpcClient.keepaliveTimeSeconds),
            timeout: .seconds(TimeGrpcClient.keepaliveTimeoutSeconds),
            permitWithoutCalls: true
        )
        channelBuilder.maxReceiveMessageLength = TimeGrpcClient.maxInboundMessageSize
        
        // Build channel and client
        self.channel = try channelBuilder.build()
        self.client = Time_TimeServiceNIOClient(channel: channel)
        
        super.init()
        
        logger.info("TimeGrpcClient initialized: \(host):\(port) (TLS: \(useTLS))")
    }
    
    deinit {
        try? group.syncShutdownGracefully()
    }
    
    // MARK: - Public Methods
    
    /**
     * Get current server time synchronously
     */
    @objc
    public func getCurrentTime() throws -> TimeResponse {
        logger.debug("Requesting current time from server")
        
        let request = Google_Protobuf_Empty()
        let response = try client.getCurrentTime(request).response.wait()
        
        logger.debug("Received time: \(response.formattedTime)")
        return TimeResponse(from: response)
    }
    
    /**
     * Get current server time with specific timezone
     */
    @objc
    public func getTimeWithTimezone(_ timezone: String) throws -> TimeResponse {
        logger.debug("Requesting time with timezone: \(timezone)")
        
        var request = Time_TimezoneRequest()
        request.timezone = timezone
        
        let response = try client.getTimeWithTimezone(request).response.wait()
        
        logger.debug("Received time for timezone \(timezone): \(response.formattedTime)")
        return TimeResponse(from: response)
    }
    
    /**
     * Get time statistics
     */
    @objc
    public func getTimeStats() throws -> TimeStatsResponse {
        logger.debug("Requesting time statistics")
        
        let request = Google_Protobuf_Empty()
        let response = try client.getTimeStats(request).response.wait()
        
        logger.debug("Received time stats: uptime=\(response.uptimeSeconds)s")
        return TimeStatsResponse(from: response)
    }
    
    /**
     * Stream real-time time updates asynchronously
     */
    @objc
    public func streamTime(callback: @escaping TimeStreamCallback) {
        logger.debug("Starting time stream")
        
        let request = Google_Protobuf_Empty()
        
        client.streamTime(request).response.whenComplete { result in
            switch result {
            case .success(let response):
                response.forEach { update in
                    self.logger.debug("Received time update: \(update.formattedTime)")
                    callback.onTimeUpdate(TimeUpdate(from: update))
                }
                callback.onCompleted()
                
            case .failure(let error):
                self.logger.error("Time stream error: \(error)")
                callback.onError(error)
            }
        }
    }
    
    /**
     * Stream time updates with timeout
     */
    @objc
    public func streamTimeWithTimeout(callback: @escaping TimeStreamCallback, timeoutSeconds: Int) {
        logger.debug("Starting time stream with timeout: \(timeoutSeconds)s")
        
        let request = Google_Protobuf_Empty()
        let timeout = TimeAmount.seconds(Int64(timeoutSeconds))
        
        let stream = client.streamTime(request).response
        
        // Set up timeout
        let timeoutTask = group.next().scheduleTask(in: timeout) {
            stream.cancel(promise: nil)
            callback.onError(TimeGrpcError.timeout)
        }
        
        stream.whenComplete { result in
            timeoutTask.cancel()
            
            switch result {
            case .success(let response):
                response.forEach { update in
                    self.logger.debug("Received time update: \(update.formattedTime)")
                    callback.onTimeUpdate(TimeUpdate(from: update))
                }
                callback.onCompleted()
                
            case .failure(let error):
                self.logger.error("Time stream error: \(error)")
                callback.onError(error)
            }
        }
    }
    
    /**
     * Check if the client is connected
     */
    @objc
    public var isConnected: Bool {
        return !channel.isClosed
    }
    
    /**
     * Get connection state
     */
    @objc
    public var connectionState: String {
        if channel.isClosed {
            return "CLOSED"
        } else {
            return "READY"
        }
    }
    
    /**
     * Gracefully shutdown the client
     */
    @objc
    public func shutdown() {
        logger.debug("Shutting down gRPC client")
        try? channel.close().wait()
    }
    
    // MARK: - Utility Methods
    
    /**
     * Convert Timestamp to milliseconds
     */
    @objc
    public static func timestampToMillis(_ timestamp: Google_Protobuf_Timestamp) -> Int64 {
        return timestamp.seconds * 1000 + Int64(timestamp.nanos) / 1_000_000
    }
    
    /**
     * Get current time in milliseconds
     */
    @objc
    public static func getCurrentTimeMillis() -> Int64 {
        return Int64(Date().timeIntervalSince1970 * 1000)
    }
}

// MARK: - Callback Protocol

@objc
public protocol TimeStreamCallback: AnyObject {
    func onTimeUpdate(_ update: TimeUpdate)
    func onError(_ error: Error)
    func onCompleted()
}

// MARK: - Response Models

@objc
public class TimeResponse: NSObject {
    @objc public let formattedTime: String
    @objc public let unixTimestamp: Int64
    @objc public let timezone: String
    @objc public let isUtc: Bool
    
    init(from grpcResponse: Time_TimeResponse) {
        self.formattedTime = grpcResponse.formattedTime
        self.unixTimestamp = grpcResponse.unixTimestamp
        self.timezone = grpcResponse.timezone
        self.isUtc = grpcResponse.isUtc
    }
}

@objc
public class TimeUpdate: NSObject {
    @objc public let formattedTime: String
    @objc public let unixTimestamp: Int64
    @objc public let timezone: String
    @objc public let updateIntervalMs: Int32
    
    init(from grpcUpdate: Time_TimeUpdate) {
        self.formattedTime = grpcUpdate.formattedTime
        self.unixTimestamp = grpcUpdate.unixTimestamp
        self.timezone = grpcUpdate.timezone
        self.updateIntervalMs = grpcUpdate.updateIntervalMs
    }
}

@objc
public class TimeStatsResponse: NSObject {
    @objc public let serverVersion: String
    @objc public let uptimeSeconds: Int64
    @objc public let totalRequests: Int64
    @objc public let averageResponseTimeMs: Double
    
    init(from grpcResponse: Time_TimeStatsResponse) {
        self.serverVersion = grpcResponse.serverVersion
        self.uptimeSeconds = grpcResponse.uptimeSeconds
        self.totalRequests = grpcResponse.totalRequests
        self.averageResponseTimeMs = grpcResponse.averageResponseTimeMs
    }
}

// MARK: - Errors

public enum TimeGrpcError: Error {
    case timeout
    case notInitialized
    case connectionFailed(String)
    
    var localizedDescription: String {
        switch self {
        case .timeout:
            return "Request timed out"
        case .notInitialized:
            return "gRPC client not initialized"
        case .connectionFailed(let message):
            return "Connection failed: \(message)"
        }
    }
}