//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import Foundation
import GRPC
import NIO
import NIOTransportServices
import SwiftProtobuf

@objc(TimeGrpcClient)
class TimeGrpcClient: NSObject {
    
    private var noteServiceClient: NoteServiceClient?
    private var userServiceClient: UserServiceClient?
    private var timelineServiceClient: TimelineServiceClient?
    private var mediaServiceClient: MediaServiceClient?
    private var notificationServiceClient: TimeNotificationServiceClient?
    
    private var group: EventLoopGroup?
    private var isInitialized = false
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc
    func initializeClient(_ host: String, port: Int, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.global(qos: .background).async {
            do {
                // Create event loop group
                self.group = NIOTSEventLoopGroup()
                
                // Create gRPC channels
                let channel = try GRPCChannelPool.with(
                    target: .hostAndPort(host, port),
                    transportSecurity: .tls(GRPCTLSConfiguration.makeClientDefault(for: self.group!)),
                    eventLoopGroup: self.group!
                )
                
                // Initialize service clients
                self.noteServiceClient = NoteServiceClient(channel: channel)
                self.userServiceClient = UserServiceClient(channel: channel)
                self.timelineServiceClient = TimelineServiceClient(channel: channel)
                self.mediaServiceClient = MediaServiceClient(channel: channel)
                self.notificationServiceClient = TimeNotificationServiceClient(channel: channel)
                
                self.isInitialized = true
                
                DispatchQueue.main.async {
                    resolver(["success": true])
                }
            } catch {
                DispatchQueue.main.async {
                    rejecter("INIT_ERROR", "Failed to initialize gRPC client: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    // MARK: - Note Service Methods
    
    @objc
    func createNote(_ request: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard isInitialized, let client = noteServiceClient else {
            rejecter("NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        DispatchQueue.global(qos: .background).async {
            do {
                var grpcRequest = CreateNoteRequest()
                grpcRequest.authorID = request["authorId"] as? String ?? ""
                grpcRequest.text = request["text"] as? String ?? ""
                grpcRequest.visibility = NoteVisibility(rawValue: request["visibility"] as? Int32 ?? 1) ?? .public
                grpcRequest.contentWarning = ContentWarning(rawValue: request["contentWarning"] as? Int32 ?? 0) ?? .none
                grpcRequest.clientName = request["clientName"] as? String ?? "Time Social App"
                
                if let mediaIds = request["mediaIds"] as? [String] {
                    grpcRequest.mediaIds = mediaIds
                }
                
                if let replyToNoteId = request["replyToNoteId"] as? String {
                    grpcRequest.replyToNoteID = replyToNoteId
                }
                
                if let renotedNoteId = request["renotedNoteId"] as? String {
                    grpcRequest.renotedNoteID = renotedNoteId
                }
                
                grpcRequest.isQuoteRenote = request["isQuoteRenote"] as? Bool ?? false
                
                let response = try client.createNote(grpcRequest).response.wait()
                
                let result: [String: Any] = [
                    "success": response.success,
                    "note": self.convertNoteToDict(response.note),
                    "errorMessage": response.errorMessage
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
            } catch {
                DispatchQueue.main.async {
                    rejecter("CREATE_NOTE_ERROR", "Failed to create note: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    @objc
    func getNote(_ request: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard isInitialized, let client = noteServiceClient else {
            rejecter("NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        DispatchQueue.global(qos: .background).async {
            do {
                var grpcRequest = GetNoteRequest()
                grpcRequest.noteID = request["noteId"] as? String ?? ""
                grpcRequest.requestingUserID = request["requestingUserId"] as? String ?? ""
                grpcRequest.includeThread = request["includeThread"] as? Bool ?? false
                
                let response = try client.getNote(grpcRequest).response.wait()
                
                let result: [String: Any] = [
                    "success": response.success,
                    "note": self.convertNoteToDict(response.note),
                    "userInteraction": self.convertUserNoteInteractionToDict(response.userInteraction),
                    "threadNotes": response.threadNotes.map { self.convertNoteToDict($0) },
                    "errorMessage": response.errorMessage
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
            } catch {
                DispatchQueue.main.async {
                    rejecter("GET_NOTE_ERROR", "Failed to get note: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    @objc
    func deleteNote(_ request: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard isInitialized, let client = noteServiceClient else {
            rejecter("NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        DispatchQueue.global(qos: .background).async {
            do {
                var grpcRequest = DeleteNoteRequest()
                grpcRequest.noteID = request["noteId"] as? String ?? ""
                grpcRequest.userID = request["userId"] as? String ?? ""
                
                let response = try client.deleteNote(grpcRequest).response.wait()
                
                let result: [String: Any] = [
                    "success": response.success,
                    "errorMessage": response.errorMessage
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
            } catch {
                DispatchQueue.main.async {
                    rejecter("DELETE_NOTE_ERROR", "Failed to delete note: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    @objc
    func likeNote(_ request: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard isInitialized, let client = noteServiceClient else {
            rejecter("NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        DispatchQueue.global(qos: .background).async {
            do {
                var grpcRequest = LikeNoteRequest()
                grpcRequest.noteID = request["noteId"] as? String ?? ""
                grpcRequest.userID = request["userId"] as? String ?? ""
                grpcRequest.like = request["like"] as? Bool ?? false
                
                let response = try client.likeNote(grpcRequest).response.wait()
                
                let result: [String: Any] = [
                    "success": response.success,
                    "newLikeCount": response.newLikeCount,
                    "errorMessage": response.errorMessage
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
            } catch {
                DispatchQueue.main.async {
                    rejecter("LIKE_NOTE_ERROR", "Failed to like note: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    @objc
    func renoteNote(_ request: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard isInitialized, let client = noteServiceClient else {
            rejecter("NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        DispatchQueue.global(qos: .background).async {
            do {
                var grpcRequest = RenoteNoteRequest()
                grpcRequest.noteID = request["noteId"] as? String ?? ""
                grpcRequest.userID = request["userId"] as? String ?? ""
                grpcRequest.isQuoteRenote = request["isQuoteRenote"] as? Bool ?? false
                
                if let quoteText = request["quoteText"] as? String {
                    grpcRequest.quoteText = quoteText
                }
                
                let response = try client.renoteNote(grpcRequest).response.wait()
                
                let result: [String: Any] = [
                    "success": response.success,
                    "renoteNote": self.convertNoteToDict(response.renoteNote),
                    "errorMessage": response.errorMessage
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
            } catch {
                DispatchQueue.main.async {
                    rejecter("RENOTE_NOTE_ERROR", "Failed to renote note: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    // MARK: - User Service Methods
    
    @objc
    func loginUser(_ request: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard isInitialized, let client = userServiceClient else {
            rejecter("NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        DispatchQueue.global(qos: .background).async {
            do {
                var grpcRequest = LoginUserRequest()
                
                if let credentials = request["credentials"] as? [String: Any] {
                    grpcRequest.credentials.email = credentials["email"] as? String ?? ""
                    grpcRequest.credentials.password = credentials["password"] as? String ?? ""
                    if let twoFactorCode = credentials["twoFactorCode"] as? String {
                        grpcRequest.credentials.twoFactorCode = twoFactorCode
                    }
                }
                
                grpcRequest.deviceName = request["deviceName"] as? String ?? "Time Social App"
                
                let response = try client.loginUser(grpcRequest).response.wait()
                
                let result: [String: Any] = [
                    "status": self.convertStatusToDict(response.status),
                    "accessToken": response.accessToken,
                    "refreshToken": response.refreshToken,
                    "expiresIn": response.expiresIn,
                    "session": self.convertSessionToDict(response.session),
                    "requires2fa": response.requires2Fa
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
            } catch {
                DispatchQueue.main.async {
                    rejecter("LOGIN_USER_ERROR", "Failed to login user: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    @objc
    func registerUser(_ request: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard isInitialized, let client = userServiceClient else {
            rejecter("NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        DispatchQueue.global(qos: .background).async {
            do {
                var grpcRequest = RegisterUserRequest()
                grpcRequest.username = request["username"] as? String ?? ""
                grpcRequest.email = request["email"] as? String ?? ""
                grpcRequest.password = request["password"] as? String ?? ""
                grpcRequest.displayName = request["displayName"] as? String ?? ""
                grpcRequest.invitationCode = request["invitationCode"] as? String ?? ""
                grpcRequest.acceptTerms = request["acceptTerms"] as? Bool ?? true
                grpcRequest.acceptPrivacy = request["acceptPrivacy"] as? Bool ?? true
                
                let response = try client.registerUser(grpcRequest).response.wait()
                
                let result: [String: Any] = [
                    "status": self.convertStatusToDict(response.status),
                    "user": self.convertUserProfileToDict(response.user),
                    "verificationToken": response.verificationToken
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
            } catch {
                DispatchQueue.main.async {
                    rejecter("REGISTER_USER_ERROR", "Failed to register user: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    @objc
    func getUserProfile(_ request: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard isInitialized, let client = userServiceClient else {
            rejecter("NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        DispatchQueue.global(qos: .background).async {
            do {
                var grpcRequest = GetUserProfileRequest()
                grpcRequest.userID = request["userId"] as? String ?? ""
                
                let response = try client.getUserProfile(grpcRequest).response.wait()
                
                let result: [String: Any] = [
                    "status": self.convertStatusToDict(response.status),
                    "user": self.convertUserProfileToDict(response.user)
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
            } catch {
                DispatchQueue.main.async {
                    rejecter("GET_USER_PROFILE_ERROR", "Failed to get user profile: \(error.localizedDescription)", error)
                }
            }
        }
    }
    
    // MARK: - Health Check
    
    @objc
    func healthCheck(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard isInitialized else {
            rejecter("NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        DispatchQueue.global(qos: .background).async {
            do {
                // Use note service health check as a general health indicator
                var request = GetNoteRequest()
                request.noteID = "health-check"
                request.requestingUserID = "system"
                request.includeThread = false
                
                let response = try self.noteServiceClient?.getNote(request).response.wait()
                
                let result: [String: Any] = [
                    "success": response?.success ?? false,
                    "status": response?.success == true ? "healthy" : "unhealthy"
                ]
                
                DispatchQueue.main.async {
                    resolver(result)
                }
            } catch {
                DispatchQueue.main.async {
                    let result: [String: Any] = [
                        "success": false,
                        "status": "unhealthy: \(error.localizedDescription)"
                    ]
                    resolver(result)
                }
            }
        }
    }
    
    // MARK: - Data Conversion Helpers
    
    private func convertNoteToDict(_ note: Note) -> [String: Any] {
        return [
            "id": note.id,
            "authorId": note.authorID,
            "text": note.text,
            "visibility": note.visibility.rawValue,
            "contentWarning": note.contentWarning.rawValue,
            "mediaIds": note.mediaIds,
            "entities": convertNoteEntitiesToDict(note.entities),
            "location": note.hasLocation ? convertGeoLocationToDict(note.location) : nil,
            "replyToNoteId": note.replyToNoteID,
            "replyToUserId": note.replyToUserID,
            "threadRootId": note.threadRootID,
            "renotedNoteId": note.renotedNoteID,
            "renotedUserId": note.renotedUserID,
            "isQuoteRenote": note.isQuoteRenote,
            "createdAt": convertTimestampToDict(note.createdAt),
            "updatedAt": convertTimestampToDict(note.updatedAt),
            "deletedAt": note.hasDeletedAt ? convertTimestampToDict(note.deletedAt) : nil,
            "metrics": convertNoteMetricsToDict(note.metrics),
            "languageCode": note.languageCode,
            "flags": note.flags,
            "isVerifiedContent": note.isVerifiedContent,
            "clientName": note.clientName
        ]
    }
    
    private func convertUserNoteInteractionToDict(_ interaction: UserNoteInteraction) -> [String: Any] {
        return [
            "userId": interaction.userID,
            "noteId": interaction.noteID,
            "hasLiked": interaction.hasLiked,
            "hasRenoted": interaction.hasRenoted,
            "hasBookmarked": interaction.hasBookmarked,
            "hasReported": interaction.hasReported,
            "lastViewedAt": convertTimestampToDict(interaction.lastViewedAt),
            "interactedAt": convertTimestampToDict(interaction.interactedAt)
        ]
    }
    
    private func convertStatusToDict(_ status: Status) -> [String: Any] {
        return [
            "code": status.code.rawValue,
            "message": status.message,
            "details": status.details
        ]
    }
    
    private func convertSessionToDict(_ session: Session) -> [String: Any] {
        return [
            "sessionId": session.sessionID,
            "userId": session.userID,
            "deviceId": session.deviceID,
            "deviceName": session.deviceName,
            "ipAddress": session.ipAddress,
            "userAgent": session.userAgent,
            "type": session.type.rawValue,
            "createdAt": convertTimestampToDict(session.createdAt),
            "lastActivity": convertTimestampToDict(session.lastActivity),
            "expiresAt": convertTimestampToDict(session.expiresAt),
            "isActive": session.isActive,
            "isSuspicious": session.isSuspicious,
            "locationInfo": session.locationInfo
        ]
    }
    
    private func convertUserProfileToDict(_ user: UserProfile) -> [String: Any] {
        return [
            "userId": user.userID,
            "username": user.username,
            "email": user.email,
            "displayName": user.displayName,
            "bio": user.bio,
            "avatarUrl": user.avatarURL,
            "location": user.location,
            "website": user.website,
            "status": user.status.rawValue,
            "isVerified": user.isVerified,
            "isPrivate": user.isPrivate,
            "createdAt": convertTimestampToDict(user.createdAt),
            "updatedAt": convertTimestampToDict(user.updatedAt),
            "lastLogin": convertTimestampToDict(user.lastLogin),
            "followerCount": user.followerCount,
            "followingCount": user.followingCount,
            "noteCount": user.noteCount,
            "settings": user.settings,
            "privacySettings": user.privacySettings
        ]
    }
    
    private func convertNoteEntitiesToDict(_ entities: NoteEntities) -> [String: Any] {
        return [
            "mentions": entities.mentions.map { convertNoteMentionToDict($0) },
            "hashtags": entities.hashtags.map { convertNoteHashtagToDict($0) },
            "links": entities.links.map { convertNoteLinkToDict($0) }
        ]
    }
    
    private func convertNoteMentionToDict(_ mention: NoteMention) -> [String: Any] {
        return [
            "userId": mention.userID,
            "username": mention.username,
            "startOffset": mention.startOffset,
            "endOffset": mention.endOffset
        ]
    }
    
    private func convertNoteHashtagToDict(_ hashtag: NoteHashtag) -> [String: Any] {
        return [
            "tag": hashtag.tag,
            "startOffset": hashtag.startOffset,
            "endOffset": hashtag.endOffset
        ]
    }
    
    private func convertNoteLinkToDict(_ link: NoteLink) -> [String: Any] {
        return [
            "url": link.url,
            "title": link.title,
            "description": link.description,
            "imageUrl": link.imageURL,
            "startOffset": link.startOffset,
            "endOffset": link.endOffset
        ]
    }
    
    private func convertGeoLocationToDict(_ location: GeoLocation) -> [String: Any] {
        return [
            "latitude": location.latitude,
            "longitude": location.longitude,
            "placeName": location.placeName,
            "countryCode": location.countryCode
        ]
    }
    
    private func convertNoteMetricsToDict(_ metrics: NoteMetrics) -> [String: Any] {
        return [
            "likeCount": metrics.likeCount,
            "renoteCount": metrics.renoteCount,
            "replyCount": metrics.replyCount,
            "quoteCount": metrics.quoteCount,
            "bookmarkCount": metrics.bookmarkCount,
            "viewCount": metrics.viewCount,
            "engagementRate": metrics.engagementRate
        ]
    }
    
    private func convertTimestampToDict(_ timestamp: Timestamp) -> [String: Any] {
        return [
            "seconds": timestamp.seconds,
            "nanos": timestamp.nanos
        ]
    }
    
    deinit {
        try? group?.syncShutdownGracefully()
    }
}