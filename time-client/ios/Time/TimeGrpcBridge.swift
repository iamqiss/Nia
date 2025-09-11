//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import Foundation
import React

/// React Native bridge module for Time gRPC services
/// Provides JavaScript interface to native gRPC functionality
@objc(TimeGrpcBridge)
class TimeGrpcBridge: NSObject, RCTBridgeModule {
    
    // MARK: - RCTBridgeModule Protocol
    
    static func moduleName() -> String! {
        return "TimeGrpcBridge"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    // MARK: - Properties
    
    private var grpcClient: TimeGrpcClient?
    private let queue = DispatchQueue(label: "com.timesocial.grpc", qos: .userInitiated)
    
    // MARK: - Initialization
    
    @objc
    func initializeClient(
        _ host: String,
        port: NSNumber,
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        queue.async { [weak self] in
            do {
                let config = TimeGrpcConfig(host: host, port: port.intValue)
                self?.grpcClient = TimeGrpcClient(config: config)
                resolver(["success": true, "host": host, "port": port.intValue])
            } catch {
                rejecter("INIT_ERROR", "Failed to initialize gRPC client", error)
            }
        }
    }
    
    // MARK: - Note Service Methods
    
    @objc
    func createNote(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let authorId = requestData["authorId"] as? String,
              let text = requestData["text"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required fields: authorId, text", nil)
            return
        }
        
        let visibility = Note_NoteVisibility(rawValue: requestData["visibility"] as? Int ?? 0) ?? .noteVisibilityPublic
        let contentWarning = Note_ContentWarning(rawValue: requestData["contentWarning"] as? Int ?? 0) ?? .contentWarningNone
        let mediaIds = requestData["mediaIds"] as? [String] ?? []
        let replyToNoteId = requestData["replyToNoteId"] as? String
        let renotedNoteId = requestData["renotedNoteId"] as? String
        let isQuoteRenote = requestData["isQuoteRenote"] as? Bool ?? false
        let clientName = requestData["clientName"] as? String
        let idempotencyKey = requestData["idempotencyKey"] as? String
        
        // Handle location if provided
        var location: Note_GeoLocation?
        if let locationData = requestData["location"] as? [String: Any],
           let latitude = locationData["latitude"] as? Double,
           let longitude = locationData["longitude"] as? Double {
            var geoLocation = Note_GeoLocation()
            geoLocation.latitude = latitude
            geoLocation.longitude = longitude
            geoLocation.placeName = locationData["placeName"] as? String ?? ""
            geoLocation.countryCode = locationData["countryCode"] as? String ?? ""
            location = geoLocation
        }
        
        grpcClient.createNote(
            authorId: authorId,
            text: text,
            visibility: visibility,
            contentWarning: contentWarning,
            mediaIds: mediaIds,
            location: location,
            replyToNoteId: replyToNoteId,
            renotedNoteId: renotedNoteId,
            isQuoteRenote: isQuoteRenote,
            clientName: clientName,
            idempotencyKey: idempotencyKey
        ) { response, error in
            if let error = error {
                rejecter("CREATE_NOTE_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "note": self.noteToDictionary(response.note),
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("CREATE_NOTE_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func getNote(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let noteId = requestData["noteId"] as? String,
              let requestingUserId = requestData["requestingUserId"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required fields: noteId, requestingUserId", nil)
            return
        }
        
        let includeThread = requestData["includeThread"] as? Bool ?? false
        
        grpcClient.getNote(
            noteId: noteId,
            requestingUserId: requestingUserId,
            includeThread: includeThread
        ) { response, error in
            if let error = error {
                rejecter("GET_NOTE_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "note": self.noteToDictionary(response.note),
                    "userInteraction": self.userNoteInteractionToDictionary(response.userInteraction),
                    "threadNotes": response.threadNotes.map { self.noteToDictionary($0) },
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("GET_NOTE_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func deleteNote(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let noteId = requestData["noteId"] as? String,
              let userId = requestData["userId"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required fields: noteId, userId", nil)
            return
        }
        
        grpcClient.deleteNote(
            noteId: noteId,
            userId: userId
        ) { response, error in
            if let error = error {
                rejecter("DELETE_NOTE_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("DELETE_NOTE_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func likeNote(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let noteId = requestData["noteId"] as? String,
              let userId = requestData["userId"] as? String,
              let like = requestData["like"] as? Bool else {
            rejecter("INVALID_REQUEST", "Missing required fields: noteId, userId, like", nil)
            return
        }
        
        grpcClient.likeNote(
            noteId: noteId,
            userId: userId,
            like: like
        ) { response, error in
            if let error = error {
                rejecter("LIKE_NOTE_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "newLikeCount": response.newLikeCount,
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("LIKE_NOTE_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func renoteNote(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let noteId = requestData["noteId"] as? String,
              let userId = requestData["userId"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required fields: noteId, userId", nil)
            return
        }
        
        let isQuoteRenote = requestData["isQuoteRenote"] as? Bool ?? false
        let quoteText = requestData["quoteText"] as? String
        
        grpcClient.renoteNote(
            noteId: noteId,
            userId: userId,
            isQuoteRenote: isQuoteRenote,
            quoteText: quoteText
        ) { response, error in
            if let error = error {
                rejecter("RENOTE_NOTE_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "renoteNote": self.noteToDictionary(response.renoteNote),
                    "success": response.success,
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("RENOTE_NOTE_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    // MARK: - User Service Methods
    
    @objc
    func loginUser(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let email = requestData["email"] as? String,
              let password = requestData["password"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required fields: email, password", nil)
            return
        }
        
        let deviceName = requestData["deviceName"] as? String
        
        grpcClient.loginUser(
            email: email,
            password: password,
            deviceName: deviceName
        ) { response, error in
            if let error = error {
                rejecter("LOGIN_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "status": self.statusToDictionary(response.status),
                    "accessToken": response.accessToken,
                    "refreshToken": response.refreshToken,
                    "expiresIn": response.expiresIn,
                    "session": self.sessionToDictionary(response.session),
                    "requires2fa": response.requires2fa
                ]
                resolver(result)
            } else {
                rejecter("LOGIN_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func registerUser(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let username = requestData["username"] as? String,
              let email = requestData["email"] as? String,
              let password = requestData["password"] as? String,
              let displayName = requestData["displayName"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required fields: username, email, password, displayName", nil)
            return
        }
        
        let invitationCode = requestData["invitationCode"] as? String
        let acceptTerms = requestData["acceptTerms"] as? Bool ?? true
        let acceptPrivacy = requestData["acceptPrivacy"] as? Bool ?? true
        
        grpcClient.registerUser(
            username: username,
            email: email,
            password: password,
            displayName: displayName,
            invitationCode: invitationCode,
            acceptTerms: acceptTerms,
            acceptPrivacy: acceptPrivacy
        ) { response, error in
            if let error = error {
                rejecter("REGISTER_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "status": self.statusToDictionary(response.status),
                    "user": self.userProfileToDictionary(response.user),
                    "verificationToken": response.verificationToken
                ]
                resolver(result)
            } else {
                rejecter("REGISTER_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func verifyToken(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let token = requestData["token"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required field: token", nil)
            return
        }
        
        grpcClient.verifyToken(token: token) { response, error in
            if let error = error {
                rejecter("VERIFY_TOKEN_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "status": self.statusToDictionary(response.status),
                    "user": self.userProfileToDictionary(response.user),
                    "session": self.sessionToDictionary(response.session)
                ]
                resolver(result)
            } else {
                rejecter("VERIFY_TOKEN_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func getUserProfile(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let userId = requestData["userId"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required field: userId", nil)
            return
        }
        
        grpcClient.getUserProfile(userId: userId) { response, error in
            if let error = error {
                rejecter("GET_USER_PROFILE_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "status": self.statusToDictionary(response.status),
                    "user": self.userProfileToDictionary(response.user)
                ]
                resolver(result)
            } else {
                rejecter("GET_USER_PROFILE_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    // MARK: - Fanout Service Methods
    
    @objc
    func initiateFanout(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let noteId = requestData["noteId"] as? String,
              let userId = requestData["userId"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required fields: noteId, userId", nil)
            return
        }
        
        grpcClient.initiateFanout(
            noteId: noteId,
            userId: userId
        ) { response, error in
            if let error = error {
                rejecter("INITIATE_FANOUT_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "jobId": response.jobId,
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("INITIATE_FANOUT_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func getFanoutJobStatus(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let jobId = requestData["jobId"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required field: jobId", nil)
            return
        }
        
        grpcClient.getFanoutJobStatus(jobId: jobId) { response, error in
            if let error = error {
                rejecter("GET_FANOUT_STATUS_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "status": response.status.rawValue,
                    "progress": response.progress,
                    "totalFollowers": response.totalFollowers,
                    "processedFollowers": response.processedFollowers,
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("GET_FANOUT_STATUS_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    // MARK: - Messaging Service Methods
    
    @objc
    func sendMessage(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let senderId = requestData["senderId"] as? String,
              let recipientId = requestData["recipientId"] as? String,
              let content = requestData["content"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required fields: senderId, recipientId, content", nil)
            return
        }
        
        let messageType = Messaging_MessageType(rawValue: requestData["messageType"] as? Int ?? 0) ?? .messageTypeText
        let attachmentIds = requestData["attachmentIds"] as? [String] ?? []
        
        grpcClient.sendMessage(
            senderId: senderId,
            recipientId: recipientId,
            content: content,
            messageType: messageType,
            attachmentIds: attachmentIds
        ) { response, error in
            if let error = error {
                rejecter("SEND_MESSAGE_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "message": self.messageToDictionary(response.message),
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("SEND_MESSAGE_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func getMessages(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let userId = requestData["userId"] as? String,
              let chatId = requestData["chatId"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required fields: userId, chatId", nil)
            return
        }
        
        let limit = requestData["limit"] as? Int ?? 50
        let offset = requestData["offset"] as? Int ?? 0
        
        grpcClient.getMessages(
            userId: userId,
            chatId: chatId,
            limit: limit,
            offset: offset
        ) { response, error in
            if let error = error {
                rejecter("GET_MESSAGES_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "messages": response.messages.map { self.messageToDictionary($0) },
                    "hasMore": response.hasMore,
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("GET_MESSAGES_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    // MARK: - Search Service Methods
    
    @objc
    func searchUsers(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let query = requestData["query"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required field: query", nil)
            return
        }
        
        let limit = requestData["limit"] as? Int ?? 20
        let offset = requestData["offset"] as? Int ?? 0
        
        grpcClient.searchUsers(
            query: query,
            limit: limit,
            offset: offset
        ) { response, error in
            if let error = error {
                rejecter("SEARCH_USERS_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "users": response.users.map { self.userProfileToDictionary($0) },
                    "hasMore": response.hasMore,
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("SEARCH_USERS_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func searchNotes(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let query = requestData["query"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required field: query", nil)
            return
        }
        
        let limit = requestData["limit"] as? Int ?? 20
        let offset = requestData["offset"] as? Int ?? 0
        
        grpcClient.searchNotes(
            query: query,
            limit: limit,
            offset: offset
        ) { response, error in
            if let error = error {
                rejecter("SEARCH_NOTES_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "notes": response.notes.map { self.noteToDictionary($0) },
                    "hasMore": response.hasMore,
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("SEARCH_NOTES_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    // MARK: - Drafts Service Methods
    
    @objc
    func createDraft(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let userId = requestData["userId"] as? String,
              let content = requestData["content"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required fields: userId, content", nil)
            return
        }
        
        let title = requestData["title"] as? String
        let mediaIds = requestData["mediaIds"] as? [String] ?? []
        
        grpcClient.createDraft(
            userId: userId,
            title: title,
            content: content,
            mediaIds: mediaIds
        ) { response, error in
            if let error = error {
                rejecter("CREATE_DRAFT_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "draft": self.draftToDictionary(response.draft),
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("CREATE_DRAFT_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func getUserDrafts(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let userId = requestData["userId"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required field: userId", nil)
            return
        }
        
        let limit = requestData["limit"] as? Int ?? 20
        let offset = requestData["offset"] as? Int ?? 0
        
        grpcClient.getUserDrafts(
            userId: userId,
            limit: limit,
            offset: offset
        ) { response, error in
            if let error = error {
                rejecter("GET_USER_DRAFTS_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "drafts": response.drafts.map { self.draftToDictionary($0) },
                    "hasMore": response.hasMore,
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("GET_USER_DRAFTS_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    // MARK: - List Service Methods
    
    @objc
    func createList(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let userId = requestData["userId"] as? String,
              let name = requestData["name"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required fields: userId, name", nil)
            return
        }
        
        let description = requestData["description"] as? String
        let isPrivate = requestData["isPrivate"] as? Bool ?? false
        
        grpcClient.createList(
            userId: userId,
            name: name,
            description: description,
            isPrivate: isPrivate
        ) { response, error in
            if let error = error {
                rejecter("CREATE_LIST_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "list": self.listToDictionary(response.list),
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("CREATE_LIST_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func getUserLists(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let userId = requestData["userId"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required field: userId", nil)
            return
        }
        
        let limit = requestData["limit"] as? Int ?? 20
        let offset = requestData["offset"] as? Int ?? 0
        
        grpcClient.getUserLists(
            userId: userId,
            limit: limit,
            offset: offset
        ) { response, error in
            if let error = error {
                rejecter("GET_USER_LISTS_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "lists": response.lists.map { self.listToDictionary($0) },
                    "hasMore": response.hasMore,
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("GET_USER_LISTS_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    // MARK: - Starterpack Service Methods
    
    @objc
    func createStarterpack(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let userId = requestData["userId"] as? String,
              let name = requestData["name"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required fields: userId, name", nil)
            return
        }
        
        let description = requestData["description"] as? String
        let category = requestData["category"] as? String
        let isPublic = requestData["isPublic"] as? Bool ?? true
        
        grpcClient.createStarterpack(
            userId: userId,
            name: name,
            description: description,
            category: category,
            isPublic: isPublic
        ) { response, error in
            if let error = error {
                rejecter("CREATE_STARTERPACK_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "starterpack": self.starterpackToDictionary(response.starterpack),
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("CREATE_STARTERPACK_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    @objc
    func getUserStarterpacks(
        _ requestData: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        guard let userId = requestData["userId"] as? String else {
            rejecter("INVALID_REQUEST", "Missing required field: userId", nil)
            return
        }
        
        let limit = requestData["limit"] as? Int ?? 20
        let offset = requestData["offset"] as? Int ?? 0
        
        grpcClient.getUserStarterpacks(
            userId: userId,
            limit: limit,
            offset: offset
        ) { response, error in
            if let error = error {
                rejecter("GET_USER_STARTERPACKS_ERROR", error.localizedDescription, error)
            } else if let response = response {
                let result: [String: Any] = [
                    "success": response.success,
                    "starterpacks": response.starterpacks.map { self.starterpackToDictionary($0) },
                    "hasMore": response.hasMore,
                    "errorMessage": response.errorMessage
                ]
                resolver(result)
            } else {
                rejecter("GET_USER_STARTERPACKS_ERROR", "Unknown error occurred", nil)
            }
        }
    }
    
    // MARK: - Health Check
    
    @objc
    func healthCheck(
        _ resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        guard let grpcClient = grpcClient else {
            rejecter("CLIENT_NOT_INITIALIZED", "gRPC client not initialized", nil)
            return
        }
        
        grpcClient.healthCheck { success, message in
            if success {
                resolver(["success": true, "status": message ?? "OK"])
            } else {
                rejecter("HEALTH_CHECK_ERROR", message ?? "Health check failed", nil)
            }
        }
    }
    
    // MARK: - Helper Methods
    
    private func noteToDictionary(_ note: Note_Note) -> [String: Any] {
        return [
            "id": note.id,
            "authorId": note.authorID,
            "text": note.text,
            "visibility": note.visibility.rawValue,
            "contentWarning": note.contentWarning.rawValue,
            "mediaIds": note.mediaIds,
            "entities": entitiesToDictionary(note.entities),
            "location": locationToDictionary(note.location),
            "replyToNoteId": note.replyToNoteID,
            "replyToUserId": note.replyToUserID,
            "threadRootId": note.threadRootID,
            "renotedNoteId": note.renotedNoteID,
            "renotedUserId": note.renotedUserID,
            "isQuoteRenote": note.isQuoteRenote,
            "createdAt": timestampToDictionary(note.createdAt),
            "updatedAt": timestampToDictionary(note.updatedAt),
            "deletedAt": timestampToDictionary(note.deletedAt),
            "metrics": metricsToDictionary(note.metrics),
            "languageCode": note.languageCode,
            "flags": note.flags,
            "isVerifiedContent": note.isVerifiedContent,
            "clientName": note.clientName
        ]
    }
    
    private func userNoteInteractionToDictionary(_ interaction: Note_UserNoteInteraction) -> [String: Any] {
        return [
            "userId": interaction.userID,
            "noteId": interaction.noteID,
            "hasLiked": interaction.hasLiked,
            "hasRenoted": interaction.hasRenoted,
            "hasBookmarked": interaction.hasBookmarked,
            "hasReported": interaction.hasReported,
            "lastViewedAt": timestampToDictionary(interaction.lastViewedAt),
            "interactedAt": timestampToDictionary(interaction.interactedAt)
        ]
    }
    
    private func userProfileToDictionary(_ profile: User_UserProfile) -> [String: Any] {
        return [
            "userId": profile.userID,
            "username": profile.username,
            "email": profile.email,
            "displayName": profile.displayName,
            "bio": profile.bio,
            "avatarUrl": profile.avatarURL,
            "location": profile.location,
            "website": profile.website,
            "status": profile.status.rawValue,
            "isVerified": profile.isVerified,
            "isPrivate": profile.isPrivate,
            "createdAt": timestampToDictionary(profile.createdAt),
            "updatedAt": timestampToDictionary(profile.updatedAt),
            "lastLogin": timestampToDictionary(profile.lastLogin),
            "followerCount": profile.followerCount,
            "followingCount": profile.followingCount,
            "noteCount": profile.noteCount,
            "settings": profile.settings,
            "privacySettings": profile.privacySettings
        ]
    }
    
    private func sessionToDictionary(_ session: User_Session) -> [String: Any] {
        return [
            "sessionId": session.sessionID,
            "userId": session.userID,
            "deviceId": session.deviceID,
            "deviceName": session.deviceName,
            "ipAddress": session.ipAddress,
            "userAgent": session.userAgent,
            "type": session.type.rawValue,
            "createdAt": timestampToDictionary(session.createdAt),
            "lastActivity": timestampToDictionary(session.lastActivity),
            "expiresAt": timestampToDictionary(session.expiresAt),
            "isActive": session.isActive,
            "isSuspicious": session.isSuspicious,
            "locationInfo": session.locationInfo
        ]
    }
    
    private func statusToDictionary(_ status: Common_Status) -> [String: Any] {
        return [
            "code": status.code.rawValue,
            "message": status.message,
            "details": status.details
        ]
    }
    
    private func entitiesToDictionary(_ entities: Note_NoteEntities) -> [String: Any] {
        return [
            "mentions": entities.mentions.map { mention in
                [
                    "userId": mention.userID,
                    "username": mention.username,
                    "startOffset": mention.startOffset,
                    "endOffset": mention.endOffset
                ]
            },
            "hashtags": entities.hashtags.map { hashtag in
                [
                    "tag": hashtag.tag,
                    "startOffset": hashtag.startOffset,
                    "endOffset": hashtag.endOffset
                ]
            },
            "links": entities.links.map { link in
                [
                    "url": link.url,
                    "title": link.title,
                    "description": link.description,
                    "imageUrl": link.imageURL,
                    "startOffset": link.startOffset,
                    "endOffset": link.endOffset
                ]
            }
        ]
    }
    
    private func locationToDictionary(_ location: Note_GeoLocation) -> [String: Any] {
        return [
            "latitude": location.latitude,
            "longitude": location.longitude,
            "placeName": location.placeName,
            "countryCode": location.countryCode
        ]
    }
    
    private func metricsToDictionary(_ metrics: Note_NoteMetrics) -> [String: Any] {
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
    
    private func timestampToDictionary(_ timestamp: Common_Timestamp) -> [String: Any] {
        return [
            "seconds": timestamp.seconds,
            "nanos": timestamp.nanos
        ]
    }
    
    private func messageToDictionary(_ message: Messaging_Message) -> [String: Any] {
        return [
            "id": message.id,
            "senderId": message.senderID,
            "recipientId": message.recipientID,
            "content": message.content,
            "messageType": message.messageType.rawValue,
            "attachmentIds": message.attachmentIds,
            "createdAt": timestampToDictionary(message.createdAt),
            "updatedAt": timestampToDictionary(message.updatedAt),
            "isRead": message.isRead,
            "isEdited": message.isEdited
        ]
    }
    
    private func draftToDictionary(_ draft: Drafts_Draft) -> [String: Any] {
        return [
            "id": draft.id,
            "userId": draft.userID,
            "title": draft.title,
            "content": draft.content,
            "mediaIds": draft.mediaIds,
            "createdAt": timestampToDictionary(draft.createdAt),
            "updatedAt": timestampToDictionary(draft.updatedAt),
            "isAutoSaved": draft.isAutoSaved
        ]
    }
    
    private func listToDictionary(_ list: List_List) -> [String: Any] {
        return [
            "id": list.id,
            "userId": list.userID,
            "name": list.name,
            "description": list.description,
            "isPrivate": list.isPrivate,
            "memberCount": list.memberCount,
            "createdAt": timestampToDictionary(list.createdAt),
            "updatedAt": timestampToDictionary(list.updatedAt)
        ]
    }
    
    private func starterpackToDictionary(_ starterpack: Starterpack_Starterpack) -> [String: Any] {
        return [
            "id": starterpack.id,
            "userId": starterpack.userID,
            "name": starterpack.name,
            "description": starterpack.description,
            "category": starterpack.category,
            "isPublic": starterpack.isPublic,
            "itemCount": starterpack.itemCount,
            "createdAt": timestampToDictionary(starterpack.createdAt),
            "updatedAt": timestampToDictionary(starterpack.updatedAt)
        ]
    }
}