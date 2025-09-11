//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import MigrationAdapter from '../MigrationAdapter';
import { GrpcFeatureFlagManager } from '../FeatureFlags';
import TimeGrpcService from '../TimeGrpcService';

// Mock dependencies
jest.mock('../TimeGrpcService');
jest.mock('../FeatureFlags');

describe('MigrationAdapter', () => {
  let migrationAdapter: MigrationAdapter;
  let mockGrpcService: jest.Mocked<TimeGrpcService>;
  let mockFeatureFlags: jest.Mocked<GrpcFeatureFlagManager>;
  let mockAgent: any;
  let mockQueryClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock gRPC service
    mockGrpcService = {
      createNote: jest.fn(),
      getNote: jest.fn(),
      likeNote: jest.fn(),
      renoteNote: jest.fn(),
      deleteNote: jest.fn(),
      loginUser: jest.fn(),
      registerUser: jest.fn(),
      getUserProfile: jest.fn(),
      healthCheck: jest.fn(),
      isReady: jest.fn().mockReturnValue(true),
      getConfig: jest.fn(),
    } as any;

    // Mock feature flags
    mockFeatureFlags = {
      isGrpcEnabledForOperation: jest.fn(),
      getPhase: jest.fn(),
      updateFlags: jest.fn(),
      subscribe: jest.fn(),
    } as any;

    // Mock agent and query client
    mockAgent = {
      session: { did: 'test-user-id' },
      post: jest.fn(),
      getPost: jest.fn(),
      like: jest.fn(),
      deleteLike: jest.fn(),
      repost: jest.fn(),
      deleteRepost: jest.fn(),
      deletePost: jest.fn(),
      login: jest.fn(),
      createAccount: jest.fn(),
      getProfile: jest.fn(),
    };

    mockQueryClient = {};

    // Set up mocks
    (TimeGrpcService.getInstance as jest.Mock).mockReturnValue(mockGrpcService);
    (GrpcFeatureFlagManager.getInstance as jest.Mock).mockReturnValue(mockFeatureFlags);

    migrationAdapter = MigrationAdapter.getInstance();
  });

  describe('createNote', () => {
    it('should use gRPC when enabled', async () => {
      // Arrange
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);
      const request = {
        authorId: 'test-user-id',
        text: 'Test note',
        visibility: 1,
        contentWarning: 0,
        mediaIds: [],
        clientName: 'Test App',
      };
      const expectedResponse = {
        success: true,
        note: { id: 'note-123', text: 'Test note' },
        errorMessage: undefined,
      };
      mockGrpcService.createNote.mockResolvedValue(expectedResponse);

      // Act
      const result = await migrationAdapter.createNote(request, mockAgent, mockQueryClient);

      // Assert
      expect(mockGrpcService.createNote).toHaveBeenCalledWith(request);
      expect(result).toEqual(expectedResponse);
    });

    it('should fallback to REST when gRPC fails', async () => {
      // Arrange
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);
      const request = {
        authorId: 'test-user-id',
        text: 'Test note',
        visibility: 1,
        contentWarning: 0,
        mediaIds: [],
        clientName: 'Test App',
      };
      mockGrpcService.createNote.mockRejectedValue(new Error('gRPC failed'));
      mockAgent.post.mockResolvedValue({
        data: { uri: 'at://test-user-id/app.bsky.feed.post/note-123' }
      });

      // Act
      const result = await migrationAdapter.createNote(request, mockAgent, mockQueryClient);

      // Assert
      expect(mockGrpcService.createNote).toHaveBeenCalledWith(request);
      expect(mockAgent.post).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should use REST when gRPC is disabled', async () => {
      // Arrange
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(false);
      const request = {
        authorId: 'test-user-id',
        text: 'Test note',
        visibility: 1,
        contentWarning: 0,
        mediaIds: [],
        clientName: 'Test App',
      };
      mockAgent.post.mockResolvedValue({
        data: { uri: 'at://test-user-id/app.bsky.feed.post/note-123' }
      });

      // Act
      const result = await migrationAdapter.createNote(request, mockAgent, mockQueryClient);

      // Assert
      expect(mockGrpcService.createNote).not.toHaveBeenCalled();
      expect(mockAgent.post).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('getNote', () => {
    it('should use gRPC when enabled', async () => {
      // Arrange
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);
      const request = {
        noteId: 'note-123',
        requestingUserId: 'test-user-id',
        includeThread: true,
      };
      const expectedResponse = {
        success: true,
        note: { id: 'note-123', text: 'Test note' },
        userInteraction: { userId: 'test-user-id', noteId: 'note-123' },
        threadNotes: [],
        errorMessage: undefined,
      };
      mockGrpcService.getNote.mockResolvedValue(expectedResponse);

      // Act
      const result = await migrationAdapter.getNote(request, mockAgent);

      // Assert
      expect(mockGrpcService.getNote).toHaveBeenCalledWith(request);
      expect(result).toEqual(expectedResponse);
    });

    it('should fallback to REST when gRPC fails', async () => {
      // Arrange
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);
      const request = {
        noteId: 'note-123',
        requestingUserId: 'test-user-id',
        includeThread: true,
      };
      mockGrpcService.getNote.mockRejectedValue(new Error('gRPC failed'));
      mockAgent.getPost.mockResolvedValue({
        data: { uri: 'at://test-user-id/app.bsky.feed.post/note-123' }
      });

      // Act
      const result = await migrationAdapter.getNote(request, mockAgent);

      // Assert
      expect(mockGrpcService.getNote).toHaveBeenCalledWith(request);
      expect(mockAgent.getPost).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('likeNote', () => {
    it('should use gRPC when enabled', async () => {
      // Arrange
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);
      const request = {
        noteId: 'note-123',
        userId: 'test-user-id',
        like: true,
      };
      const expectedResponse = {
        success: true,
        newLikeCount: 5,
        errorMessage: undefined,
      };
      mockGrpcService.likeNote.mockResolvedValue(expectedResponse);

      // Act
      const result = await migrationAdapter.likeNote(request, mockAgent);

      // Assert
      expect(mockGrpcService.likeNote).toHaveBeenCalledWith(request);
      expect(result).toEqual(expectedResponse);
    });

    it('should fallback to REST when gRPC fails', async () => {
      // Arrange
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);
      const request = {
        noteId: 'note-123',
        userId: 'test-user-id',
        like: true,
      };
      mockGrpcService.likeNote.mockRejectedValue(new Error('gRPC failed'));
      mockAgent.like.mockResolvedValue({ uri: 'like-123' });

      // Act
      const result = await migrationAdapter.likeNote(request, mockAgent);

      // Assert
      expect(mockGrpcService.likeNote).toHaveBeenCalledWith(request);
      expect(mockAgent.like).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('loginUser', () => {
    it('should use gRPC when enabled', async () => {
      // Arrange
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);
      const request = {
        credentials: {
          email: 'test@example.com',
          password: 'password123',
        },
        deviceName: 'Test Device',
      };
      const expectedResponse = {
        status: { code: 1, message: 'Success', details: {} },
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123',
        expiresIn: 3600,
        session: {
          sessionId: 'session-123',
          userId: 'test-user-id',
          deviceId: 'device-123',
          deviceName: 'Test Device',
          ipAddress: '127.0.0.1',
          userAgent: 'Test Agent',
          type: 2,
          createdAt: { seconds: Date.now() / 1000, nanos: 0 },
          lastActivity: { seconds: Date.now() / 1000, nanos: 0 },
          expiresAt: { seconds: Date.now() / 1000 + 3600, nanos: 0 },
          isActive: true,
          isSuspicious: false,
          locationInfo: 'Test Location',
        },
        requires2fa: false,
      };
      mockGrpcService.loginUser.mockResolvedValue(expectedResponse);

      // Act
      const result = await migrationAdapter.loginUser(request, mockAgent);

      // Assert
      expect(mockGrpcService.loginUser).toHaveBeenCalledWith(request);
      expect(result).toEqual(expectedResponse);
    });

    it('should fallback to REST when gRPC fails', async () => {
      // Arrange
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);
      const request = {
        credentials: {
          email: 'test@example.com',
          password: 'password123',
        },
        deviceName: 'Test Device',
      };
      mockGrpcService.loginUser.mockRejectedValue(new Error('gRPC failed'));
      mockAgent.login.mockResolvedValue({
        data: {
          accessJwt: 'access-token-123',
          refreshJwt: 'refresh-token-123',
          did: 'test-user-id',
          handle: 'testuser',
          email: 'test@example.com',
        }
      });

      // Act
      const result = await migrationAdapter.loginUser(request, mockAgent);

      // Assert
      expect(mockGrpcService.loginUser).toHaveBeenCalledWith(request);
      expect(mockAgent.login).toHaveBeenCalled();
      expect(result.status.code).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should handle gRPC service not initialized', async () => {
      // Arrange
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);
      mockGrpcService.isReady.mockReturnValue(false);
      const request = {
        authorId: 'test-user-id',
        text: 'Test note',
        visibility: 1,
        contentWarning: 0,
        mediaIds: [],
        clientName: 'Test App',
      };

      // Act & Assert
      await expect(migrationAdapter.createNote(request, mockAgent, mockQueryClient))
        .rejects.toThrow('gRPC service not initialized');
    });

    it('should handle network errors gracefully', async () => {
      // Arrange
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);
      const request = {
        authorId: 'test-user-id',
        text: 'Test note',
        visibility: 1,
        contentWarning: 0,
        mediaIds: [],
        clientName: 'Test App',
      };
      mockGrpcService.createNote.mockRejectedValue(new Error('Network error'));
      mockAgent.post.mockRejectedValue(new Error('REST also failed'));

      // Act
      const result = await migrationAdapter.createNote(request, mockAgent, mockQueryClient);

      // Assert
      expect(result.success).toBe(false);
      expect(result.errorMessage).toContain('REST also failed');
    });
  });

  describe('data conversion', () => {
    it('should convert REST response to gRPC format correctly', async () => {
      // Arrange
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(false);
      const request = {
        authorId: 'test-user-id',
        text: 'Test note',
        visibility: 1,
        contentWarning: 0,
        mediaIds: [],
        clientName: 'Test App',
      };
      mockAgent.post.mockResolvedValue({
        data: {
          uri: 'at://test-user-id/app.bsky.feed.post/note-123',
          cid: 'cid-123',
          record: {
            text: 'Test note',
            createdAt: '2023-01-01T00:00:00Z',
          },
          author: {
            did: 'test-user-id',
            handle: 'testuser',
          },
          likeCount: 5,
          repostCount: 2,
          replyCount: 1,
        }
      });

      // Act
      const result = await migrationAdapter.createNote(request, mockAgent, mockQueryClient);

      // Assert
      expect(result.success).toBe(true);
      expect(result.note.id).toBe('note-123');
      expect(result.note.text).toBe('Test note');
      expect(result.note.authorId).toBe('test-user-id');
    });
  });
});