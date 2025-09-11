//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import Foundation
import gRPC
import SwiftProtobuf

/// Main gRPC client for Time Social App
/// Provides access to all gRPC services with connection management
@objc(TimeGrpcClient)
public class TimeGrpcClient: NSObject {
    
    // MARK: - Properties
    
    private var channel: GRPCChannel?
    private var noteService: NoteServiceClient?
    private var userService: UserServiceClient?
    private var timelineService: TimelineServiceClient?
    private var mediaService: MediaServiceClient?
    private var notificationService: NotificationServiceClient?
    
    private let config: TimeGrpcConfig
    private let group: EventLoopGroup
    
    // MARK: - Initialization
    
    @objc
    public init(config: TimeGrpcConfig) {
        self.config = config
        self.group = PlatformSupport.makeEventLoopGroup(loopCount: 1)
        super.init()
        setupClients()
    }
    
    @objc
    public convenience init(host: String, port: Int) {
        let config = TimeGrpcConfig(host: host, port: port)
        self.init(config: config)
    }
    
    deinit {
        try? group.syncShutdownGracefully()
    }
    
    // MARK: - Setup
    
    private func setupClients() {
        do {
            // Create gRPC channel
            let channelBuilder = ClientConnection.insecure(group: group)
                .connect(host: config.host, port: config.port)
            
            self.channel = channelBuilder
            
            // Initialize service clients
            self.noteService = NoteServiceClient(channel: channelBuilder)
            self.userService = UserServiceClient(channel: channelBuilder)
            self.timelineService = TimelineServiceClient(channel: channelBuilder)
            self.mediaService = MediaServiceClient(channel: channelBuilder)
            self.notificationService = NotificationServiceClient(channel: channelBuilder)
            
        } catch {
            print("Failed to setup gRPC clients: \(error)")
        }
    }
    
    // MARK: - Service Access
    
    @objc
    public var noteServiceClient: NoteServiceClient? {
        return noteService
    }
    
    @objc
    public var userServiceClient: UserServiceClient? {
        return userService
    }
    
    @objc
    public var timelineServiceClient: TimelineServiceClient? {
        return timelineService
    }
    
    @objc
    public var mediaServiceClient: MediaServiceClient? {
        return mediaService
    }
    
    @objc
    public var notificationServiceClient: NotificationServiceClient? {
        return notificationService
    }
    
    // MARK: - Connection Management
    
    @objc
    public func reconnect() {
        try? channel?.close().wait()
        setupClients()
    }
    
    @objc
    public func close() {
        try? channel?.close().wait()
    }
    
    // MARK: - Health Check
    
    @objc
    public func healthCheck(completion: @escaping (Bool, String?) -> Void) {
        guard let noteService = noteService else {
            completion(false, "Note service not available")
            return
        }
        
        let request = Note_HealthCheckRequest()
        
        let call = noteService.healthCheck(request)
        call.response.whenComplete { result in
            switch result {
            case .success(let response):
                completion(true, response.status)
            case .failure(let error):
                completion(false, error.localizedDescription)
            }
        }
    }
}

// MARK: - Service Wrappers

extension TimeGrpcClient {
    
    // MARK: - Note Service Methods
    
    @objc
    public func createNote(
        authorId: String,
        text: String,
        visibility: Note_NoteVisibility,
        contentWarning: Note_ContentWarning = .contentWarningNone,
        mediaIds: [String] = [],
        location: Note_GeoLocation? = nil,
        replyToNoteId: String? = nil,
        renotedNoteId: String? = nil,
        isQuoteRenote: Bool = false,
        clientName: String? = nil,
        idempotencyKey: String? = nil,
        completion: @escaping (Note_CreateNoteResponse?, Error?) -> Void
    ) {
        guard let noteService = noteService else {
            completion(nil, TimeGrpcError.serviceUnavailable("Note service not available"))
            return
        }
        
        var request = Note_CreateNoteRequest()
        request.authorID = authorId
        request.text = text
        request.visibility = visibility
        request.contentWarning = contentWarning
        request.mediaIds = mediaIds
        if let location = location {
            request.location = location
        }
        if let replyToNoteId = replyToNoteId {
            request.replyToNoteID = replyToNoteId
        }
        if let renotedNoteId = renotedNoteId {
            request.renotedNoteID = renotedNoteId
        }
        request.isQuoteRenote = isQuoteRenote
        if let clientName = clientName {
            request.clientName = clientName
        }
        if let idempotencyKey = idempotencyKey {
            request.idempotencyKey = idempotencyKey
        }
        
        let call = noteService.createNote(request)
        call.response.whenComplete { result in
            switch result {
            case .success(let response):
                completion(response, nil)
            case .failure(let error):
                completion(nil, error)
            }
        }
    }
    
    @objc
    public func getNote(
        noteId: String,
        requestingUserId: String,
        includeThread: Bool = false,
        completion: @escaping (Note_GetNoteResponse?, Error?) -> Void
    ) {
        guard let noteService = noteService else {
            completion(nil, TimeGrpcError.serviceUnavailable("Note service not available"))
            return
        }
        
        var request = Note_GetNoteRequest()
        request.noteID = noteId
        request.requestingUserID = requestingUserId
        request.includeThread = includeThread
        
        let call = noteService.getNote(request)
        call.response.whenComplete { result in
            switch result {
            case .success(let response):
                completion(response, nil)
            case .failure(let error):
                completion(nil, error)
            }
        }
    }
    
    @objc
    public func deleteNote(
        noteId: String,
        userId: String,
        completion: @escaping (Note_DeleteNoteResponse?, Error?) -> Void
    ) {
        guard let noteService = noteService else {
            completion(nil, TimeGrpcError.serviceUnavailable("Note service not available"))
            return
        }
        
        var request = Note_DeleteNoteRequest()
        request.noteID = noteId
        request.userID = userId
        
        let call = noteService.deleteNote(request)
        call.response.whenComplete { result in
            switch result {
            case .success(let response):
                completion(response, nil)
            case .failure(let error):
                completion(nil, error)
            }
        }
    }
    
    @objc
    public func likeNote(
        noteId: String,
        userId: String,
        like: Bool,
        completion: @escaping (Note_LikeNoteResponse?, Error?) -> Void
    ) {
        guard let noteService = noteService else {
            completion(nil, TimeGrpcError.serviceUnavailable("Note service not available"))
            return
        }
        
        var request = Note_LikeNoteRequest()
        request.noteID = noteId
        request.userID = userId
        request.like = like
        
        let call = noteService.likeNote(request)
        call.response.whenComplete { result in
            switch result {
            case .success(let response):
                completion(response, nil)
            case .failure(let error):
                completion(nil, error)
            }
        }
    }
    
    @objc
    public func renoteNote(
        noteId: String,
        userId: String,
        isQuoteRenote: Bool = false,
        quoteText: String? = nil,
        completion: @escaping (Note_RenoteNoteResponse?, Error?) -> Void
    ) {
        guard let noteService = noteService else {
            completion(nil, TimeGrpcError.serviceUnavailable("Note service not available"))
            return
        }
        
        var request = Note_RenoteNoteRequest()
        request.noteID = noteId
        request.userID = userId
        request.isQuoteRenote = isQuoteRenote
        if let quoteText = quoteText {
            request.quoteText = quoteText
        }
        
        let call = noteService.renoteNote(request)
        call.response.whenComplete { result in
            switch result {
            case .success(let response):
                completion(response, nil)
            case .failure(let error):
                completion(nil, error)
            }
        }
    }
    
    // MARK: - User Service Methods
    
    @objc
    public func loginUser(
        email: String,
        password: String,
        deviceName: String? = nil,
        completion: @escaping (User_LoginUserResponse?, Error?) -> Void
    ) {
        guard let userService = userService else {
            completion(nil, TimeGrpcError.serviceUnavailable("User service not available"))
            return
        }
        
        var credentials = User_AuthCredentials()
        credentials.email = email
        credentials.password = password
        
        var request = User_LoginUserRequest()
        request.credentials = credentials
        if let deviceName = deviceName {
            request.deviceName = deviceName
        }
        
        let call = userService.loginUser(request)
        call.response.whenComplete { result in
            switch result {
            case .success(let response):
                completion(response, nil)
            case .failure(let error):
                completion(nil, error)
            }
        }
    }
    
    @objc
    public func registerUser(
        username: String,
        email: String,
        password: String,
        displayName: String,
        invitationCode: String? = nil,
        acceptTerms: Bool = true,
        acceptPrivacy: Bool = true,
        completion: @escaping (User_RegisterUserResponse?, Error?) -> Void
    ) {
        guard let userService = userService else {
            completion(nil, TimeGrpcError.serviceUnavailable("User service not available"))
            return
        }
        
        var request = User_RegisterUserRequest()
        request.username = username
        request.email = email
        request.password = password
        request.displayName = displayName
        if let invitationCode = invitationCode {
            request.invitationCode = invitationCode
        }
        request.acceptTerms = acceptTerms
        request.acceptPrivacy = acceptPrivacy
        
        let call = userService.registerUser(request)
        call.response.whenComplete { result in
            switch result {
            case .success(let response):
                completion(response, nil)
            case .failure(let error):
                completion(nil, error)
            }
        }
    }
    
    @objc
    public func verifyToken(
        token: String,
        completion: @escaping (User_VerifyTokenResponse?, Error?) -> Void
    ) {
        guard let userService = userService else {
            completion(nil, TimeGrpcError.serviceUnavailable("User service not available"))
            return
        }
        
        var request = User_VerifyTokenRequest()
        request.token = token
        
        let call = userService.verifyToken(request)
        call.response.whenComplete { result in
            switch result {
            case .success(let response):
                completion(response, nil)
            case .failure(let error):
                completion(nil, error)
            }
        }
    }
    
    @objc
    public func getUserProfile(
        userId: String,
        completion: @escaping (User_GetUserProfileResponse?, Error?) -> Void
    ) {
        guard let userService = userService else {
            completion(nil, TimeGrpcError.serviceUnavailable("User service not available"))
            return
        }
        
        var request = User_GetUserProfileRequest()
        request.userID = userId
        
        let call = userService.getUserProfile(request)
        call.response.whenComplete { result in
            switch result {
            case .success(let response):
                completion(response, nil)
            case .failure(let error):
                completion(nil, error)
            }
        }
    }
}

// MARK: - Error Types

@objc
public enum TimeGrpcError: Int, Error, LocalizedError {
    case connectionFailed = 1
    case serviceUnavailable = 2
    case invalidRequest = 3
    case authenticationFailed = 4
    case networkError = 5
    case unknown = 6
    
    public var errorDescription: String? {
        switch self {
        case .connectionFailed:
            return "Connection failed"
        case .serviceUnavailable:
            return "Service unavailable"
        case .invalidRequest:
            return "Invalid request"
        case .authenticationFailed:
            return "Authentication failed"
        case .networkError:
            return "Network error"
        case .unknown:
            return "Unknown error"
        }
    }
    
    public init(_ message: String) {
        self = .unknown
    }
}