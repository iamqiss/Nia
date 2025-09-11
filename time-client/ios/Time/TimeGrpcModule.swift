import Foundation
import React
import GRPC

/**
 * React Native bridge module for Time gRPC client
 * Provides JavaScript interface to native gRPC functionality
 */
@objc(TimeGrpcModule)
class TimeGrpcModule: RCTEventEmitter {
    
    private var grpcClient: TimeGrpcClient?
    private var isStreaming = false
    private let queue = DispatchQueue(label: "com.time.grpc", qos: .userInitiated)
    
    // MARK: - RCTEventEmitter Overrides
    
    override func supportedEvents() -> [String]! {
        return ["TimeUpdate", "TimeStreamError", "TimeStreamCompleted", "TimeStreamStopped"]
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    // MARK: - React Native Methods
    
    /**
     * Initialize gRPC client with server configuration
     */
    @objc
    func initialize(_ host: String, port: NSNumber, useTls: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        queue.async { [weak self] in
            do {
                print("TimeGrpcModule: Initializing gRPC client: \(host):\(port) (TLS: \(useTls))")
                
                // Clean up existing client
                self?.grpcClient?.shutdown()
                
                // Create new client
                let client = try TimeGrpcClient(host: host, port: port.intValue, useTLS: useTls)
                self?.grpcClient = client
                
                // Test connection
                let response = try client.getCurrentTime()
                
                let result: [String: Any] = [
                    "status": "connected",
                    "serverTime": response.formattedTime,
                    "unixTimestamp": response.unixTimestamp,
                    "timezone": response.timezone
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
                
            } catch {
                print("TimeGrpcModule: Failed to initialize gRPC client: \(error)")
                DispatchQueue.main.async {
                    rejecter("INIT_ERROR", "Failed to initialize gRPC client: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    /**
     * Get current server time
     */
    @objc
    func getCurrentTime(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let client = grpcClient else {
            rejecter("NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        queue.async { [weak self] in
            do {
                let response = try client.getCurrentTime()
                
                let result: [String: Any] = [
                    "formattedTime": response.formattedTime,
                    "unixTimestamp": response.unixTimestamp,
                    "timezone": response.timezone,
                    "isUtc": response.isUtc
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
                
            } catch {
                print("TimeGrpcModule: Failed to get current time: \(error)")
                DispatchQueue.main.async {
                    rejecter("GRPC_ERROR", "Failed to get current time: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    /**
     * Get time with specific timezone
     */
    @objc
    func getTimeWithTimezone(_ timezone: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let client = grpcClient else {
            rejecter("NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        queue.async { [weak self] in
            do {
                let response = try client.getTimeWithTimezone(timezone)
                
                let result: [String: Any] = [
                    "formattedTime": response.formattedTime,
                    "unixTimestamp": response.unixTimestamp,
                    "timezone": response.timezone,
                    "isUtc": response.isUtc
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
                
            } catch {
                print("TimeGrpcModule: Failed to get time with timezone: \(error)")
                DispatchQueue.main.async {
                    rejecter("GRPC_ERROR", "Failed to get time with timezone: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    /**
     * Get time statistics
     */
    @objc
    func getTimeStats(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let client = grpcClient else {
            rejecter("NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        queue.async { [weak self] in
            do {
                let response = try client.getTimeStats()
                
                let result: [String: Any] = [
                    "serverVersion": response.serverVersion,
                    "uptimeSeconds": response.uptimeSeconds,
                    "totalRequests": response.totalRequests,
                    "averageResponseTimeMs": response.averageResponseTimeMs
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
                
            } catch {
                print("TimeGrpcModule: Failed to get time stats: \(error)")
                DispatchQueue.main.async {
                    rejecter("GRPC_ERROR", "Failed to get time stats: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    /**
     * Start streaming time updates
     */
    @objc
    func startTimeStream() {
        guard let client = grpcClient else {
            print("TimeGrpcModule: gRPC client not initialized")
            return
        }
        
        if isStreaming {
            print("TimeGrpcModule: Time stream already active")
            return
        }
        
        isStreaming = true
        print("TimeGrpcModule: Starting time stream")
        
        queue.async { [weak self] in
            client.streamTime(callback: TimeStreamCallbackImpl(module: self))
        }
    }
    
    /**
     * Stop streaming time updates
     */
    @objc
    func stopTimeStream() {
        if !isStreaming {
            print("TimeGrpcModule: Time stream not active")
            return
        }
        
        print("TimeGrpcModule: Stopping time stream")
        isStreaming = false
        
        // Note: gRPC streams don't have a direct way to cancel from client side
        // The server should handle this gracefully
        sendEvent(withName: "TimeStreamStopped", body: nil)
    }
    
    /**
     * Check connection status
     */
    @objc
    func getConnectionStatus(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let client = grpcClient else {
            let result: [String: Any] = [
                "status": "NOT_INITIALIZED",
                "connected": false
            ]
            resolver(result)
            return
        }
        
        let result: [String: Any] = [
            "status": client.connectionState,
            "connected": client.isConnected,
            "streaming": isStreaming
        ]
        
        resolver(result)
    }
    
    /**
     * Shutdown gRPC client
     */
    @objc
    func shutdown() {
        print("TimeGrpcModule: Shutting down gRPC module")
        
        isStreaming = false
        
        queue.async { [weak self] in
            self?.grpcClient?.shutdown()
            self?.grpcClient = nil
        }
    }
    
    // MARK: - Private Methods
    
    private func sendEvent(withName name: String, body: Any?) {
        sendEvent(withName: name, body: body)
    }
}

// MARK: - TimeStreamCallback Implementation

private class TimeStreamCallbackImpl: TimeStreamCallback {
    private weak var module: TimeGrpcModule?
    
    init(module: TimeGrpcModule?) {
        self.module = module
    }
    
    func onTimeUpdate(_ update: TimeUpdate) {
        let eventData: [String: Any] = [
            "formattedTime": update.formattedTime,
            "unixTimestamp": update.unixTimestamp,
            "timezone": update.timezone,
            "updateIntervalMs": update.updateIntervalMs
        ]
        
        DispatchQueue.main.async { [weak self] in
            self?.module?.sendEvent(withName: "TimeUpdate", body: eventData)
        }
    }
    
    func onError(_ error: Error) {
        print("TimeGrpcModule: Time stream error: \(error)")
        
        let eventData: [String: Any] = [
            "error": error.localizedDescription
        ]
        
        DispatchQueue.main.async { [weak self] in
            self?.module?.isStreaming = false
            self?.module?.sendEvent(withName: "TimeStreamError", body: eventData)
        }
    }
    
    func onCompleted() {
        print("TimeGrpcModule: Time stream completed")
        
        DispatchQueue.main.async { [weak self] in
            self?.module?.isStreaming = false
            self?.module?.sendEvent(withName: "TimeStreamCompleted", body: nil)
        }
    }
}