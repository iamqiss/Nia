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

describe('Migration Performance Tests', () => {
  let migrationAdapter: MigrationAdapter;
  let mockGrpcService: jest.Mocked<TimeGrpcService>;
  let mockFeatureFlags: jest.Mocked<GrpcFeatureFlagManager>;
  let mockAgent: any;

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

    // Mock agent
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

    // Set up mocks
    (TimeGrpcService.getInstance as jest.Mock).mockReturnValue(mockGrpcService);
    (GrpcFeatureFlagManager.getInstance as jest.Mock).mockReturnValue(mockFeatureFlags);

    migrationAdapter = MigrationAdapter.getInstance();
  });

  describe('Latency Performance', () => {
    it('should measure gRPC vs REST latency for createNote', async () => {
      // Arrange
      const request = {
        authorId: 'test-user-id',
        text: 'Performance test note',
        visibility: 1,
        contentWarning: 0,
        mediaIds: [],
        clientName: 'Test App',
      };

      // Mock gRPC response (faster)
      mockGrpcService.createNote.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 50)); // 50ms
        return {
          success: true,
          note: { id: 'note-123', text: 'Performance test note' },
          errorMessage: undefined,
        };
      });

      // Mock REST response (slower)
      mockAgent.post.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms
        return {
          data: { uri: 'at://test-user-id/app.bsky.feed.post/note-123' }
        };
      });

      // Test gRPC performance
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);
      const grpcStart = Date.now();
      await migrationAdapter.createNote(request, mockAgent, {});
      const grpcLatency = Date.now() - grpcStart;

      // Test REST performance
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(false);
      const restStart = Date.now();
      await migrationAdapter.createNote(request, mockAgent, {});
      const restLatency = Date.now() - restStart;

      // Assert
      expect(grpcLatency).toBeLessThan(restLatency);
      expect(grpcLatency).toBeLessThan(100); // Should be under 100ms
      expect(restLatency).toBeLessThan(150); // Should be under 150ms
    });

    it('should measure gRPC vs REST latency for getNote', async () => {
      // Arrange
      const request = {
        noteId: 'note-123',
        requestingUserId: 'test-user-id',
        includeThread: true,
      };

      // Mock gRPC response (faster)
      mockGrpcService.getNote.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 30)); // 30ms
        return {
          success: true,
          note: { id: 'note-123', text: 'Test note' },
          userInteraction: { userId: 'test-user-id', noteId: 'note-123' },
          threadNotes: [],
          errorMessage: undefined,
        };
      });

      // Mock REST response (slower)
      mockAgent.getPost.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 80)); // 80ms
        return {
          data: { uri: 'at://test-user-id/app.bsky.feed.post/note-123' }
        };
      });

      // Test gRPC performance
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);
      const grpcStart = Date.now();
      await migrationAdapter.getNote(request, mockAgent);
      const grpcLatency = Date.now() - grpcStart;

      // Test REST performance
      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(false);
      const restStart = Date.now();
      await migrationAdapter.getNote(request, mockAgent);
      const restLatency = Date.now() - restStart;

      // Assert
      expect(grpcLatency).toBeLessThan(restLatency);
      expect(grpcLatency).toBeLessThan(60); // Should be under 60ms
      expect(restLatency).toBeLessThan(120); // Should be under 120ms
    });
  });

  describe('Throughput Performance', () => {
    it('should handle concurrent requests efficiently', async () => {
      // Arrange
      const request = {
        authorId: 'test-user-id',
        text: 'Concurrent test note',
        visibility: 1,
        contentWarning: 0,
        mediaIds: [],
        clientName: 'Test App',
      };

      // Mock gRPC service to handle concurrent requests
      mockGrpcService.createNote.mockImplementation(async (req) => {
        await new Promise(resolve => setTimeout(resolve, 20)); // 20ms per request
        return {
          success: true,
          note: { id: `note-${Date.now()}`, text: req.text },
          errorMessage: undefined,
        };
      });

      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);

      // Test concurrent requests
      const startTime = Date.now();
      const promises = Array.from({ length: 10 }, (_, i) => 
        migrationAdapter.createNote({
          ...request,
          text: `Concurrent test note ${i}`,
        }, mockAgent, {})
      );
      
      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      // Assert
      expect(results).toHaveLength(10);
      expect(results.every(r => r.success)).toBe(true);
      expect(totalTime).toBeLessThan(100); // Should complete all 10 requests in under 100ms
    });

    it('should handle high-frequency requests without degradation', async () => {
      // Arrange
      const request = {
        noteId: 'note-123',
        userId: 'test-user-id',
        like: true,
      };

      // Mock gRPC service
      mockGrpcService.likeNote.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 10)); // 10ms per request
        return {
          success: true,
          newLikeCount: Math.floor(Math.random() * 100),
          errorMessage: undefined,
        };
      });

      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);

      // Test high-frequency requests
      const startTime = Date.now();
      const promises = Array.from({ length: 50 }, () => 
        migrationAdapter.likeNote(request, mockAgent)
      );
      
      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      // Assert
      expect(results).toHaveLength(50);
      expect(results.every(r => r.success)).toBe(true);
      expect(totalTime).toBeLessThan(200); // Should complete all 50 requests in under 200ms
    });
  });

  describe('Memory Performance', () => {
    it('should not leak memory during repeated operations', async () => {
      // Arrange
      const request = {
        authorId: 'test-user-id',
        text: 'Memory test note',
        visibility: 1,
        contentWarning: 0,
        mediaIds: [],
        clientName: 'Test App',
      };

      mockGrpcService.createNote.mockResolvedValue({
        success: true,
        note: { id: 'note-123', text: 'Memory test note' },
        errorMessage: undefined,
      });

      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);

      // Perform many operations
      const initialMemory = process.memoryUsage();
      
      for (let i = 0; i < 1000; i++) {
        await migrationAdapter.createNote({
          ...request,
          text: `Memory test note ${i}`,
        }, mockAgent, {});
      }

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

      // Assert
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
    });
  });

  describe('Error Recovery Performance', () => {
    it('should recover quickly from gRPC failures', async () => {
      // Arrange
      const request = {
        authorId: 'test-user-id',
        text: 'Error recovery test note',
        visibility: 1,
        contentWarning: 0,
        mediaIds: [],
        clientName: 'Test App',
      };

      // Mock gRPC failure
      mockGrpcService.createNote.mockRejectedValue(new Error('gRPC service unavailable'));
      
      // Mock legacy fallback
      mockAgent.post.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 50)); // 50ms fallback
        return {
          data: { uri: 'at://test-user-id/app.bsky.feed.post/note-123' }
        };
      });

      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);

      // Test error recovery
      const startTime = Date.now();
      const result = await migrationAdapter.createNote(request, mockAgent, {});
      const recoveryTime = Date.now() - startTime;

      // Assert
      expect(result.success).toBe(true);
      expect(recoveryTime).toBeLessThan(100); // Should recover in under 100ms
    });

    it('should handle intermittent gRPC failures gracefully', async () => {
      // Arrange
      const request = {
        noteId: 'note-123',
        requestingUserId: 'test-user-id',
        includeThread: true,
      };

      // Mock intermittent gRPC failures
      let callCount = 0;
      mockGrpcService.getNote.mockImplementation(async () => {
        callCount++;
        if (callCount % 3 === 0) {
          throw new Error('Intermittent gRPC failure');
        }
        await new Promise(resolve => setTimeout(resolve, 20));
        return {
          success: true,
          note: { id: 'note-123', text: 'Test note' },
          userInteraction: { userId: 'test-user-id', noteId: 'note-123' },
          threadNotes: [],
          errorMessage: undefined,
        };
      });

      // Mock legacy fallback
      mockAgent.getPost.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 60));
        return {
          data: { uri: 'at://test-user-id/app.bsky.feed.post/note-123' }
        };
      });

      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);

      // Test intermittent failures
      const results = [];
      for (let i = 0; i < 10; i++) {
        const result = await migrationAdapter.getNote(request, mockAgent);
        results.push(result);
      }

      // Assert
      expect(results).toHaveLength(10);
      expect(results.every(r => r.success)).toBe(true);
    });
  });

  describe('Resource Usage', () => {
    it('should use minimal CPU for idle operations', async () => {
      // Arrange
      const startCpu = process.cpuUsage();
      
      // Simulate idle time
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const endCpu = process.cpuUsage(startCpu);
      const cpuUsage = (endCpu.user + endCpu.system) / 1000000; // Convert to seconds

      // Assert
      expect(cpuUsage).toBeLessThan(0.01); // Less than 10ms of CPU usage
    });

    it('should handle large payloads efficiently', async () => {
      // Arrange
      const largeText = 'A'.repeat(10000); // 10KB text
      const request = {
        authorId: 'test-user-id',
        text: largeText,
        visibility: 1,
        contentWarning: 0,
        mediaIds: [],
        clientName: 'Test App',
      };

      mockGrpcService.createNote.mockResolvedValue({
        success: true,
        note: { id: 'note-123', text: largeText },
        errorMessage: undefined,
      });

      mockFeatureFlags.isGrpcEnabledForOperation.mockReturnValue(true);

      // Test large payload
      const startTime = Date.now();
      const result = await migrationAdapter.createNote(request, mockAgent, {});
      const processingTime = Date.now() - startTime;

      // Assert
      expect(result.success).toBe(true);
      expect(processingTime).toBeLessThan(200); // Should process large payload in under 200ms
    });
  });
});