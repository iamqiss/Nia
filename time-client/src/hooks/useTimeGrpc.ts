//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { useState, useEffect, useCallback } from 'react';
import { timeGrpcService, TimeGrpcService } from '../services/TimeGrpcService';

export interface UseTimeGrpcOptions {
  host?: string;
  port?: number;
  autoInitialize?: boolean;
}

export interface UseTimeGrpcReturn {
  // Service instance
  service: TimeGrpcService;
  
  // State
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  
  // Actions
  initialize: (host: string, port: number) => Promise<void>;
  healthCheck: () => Promise<boolean>;
  
  // Utility
  clearError: () => void;
}

/**
 * React hook for using Time gRPC service
 * Provides state management and error handling for gRPC operations
 */
export function useTimeGrpc(options: UseTimeGrpcOptions = {}): UseTimeGrpcReturn {
  const {
    host = 'localhost',
    port = 50051,
    autoInitialize = true
  } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async (host: string, port: number) => {
    setIsInitializing(true);
    setError(null);
    
    try {
      const result = await timeGrpcService.initializeClient(host, port);
      if (result.success) {
        setIsInitialized(true);
      } else {
        setError(result.errorMessage || 'Failed to initialize gRPC client');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const healthCheck = useCallback(async (): Promise<boolean> => {
    if (!isInitialized) {
      setError('gRPC client not initialized');
      return false;
    }

    try {
      const result = await timeGrpcService.healthCheck();
      if (!result.success) {
        setError(result.errorMessage || 'Health check failed');
        return false;
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Health check failed');
      return false;
    }
  }, [isInitialized]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-initialize if enabled
  useEffect(() => {
    if (autoInitialize && !isInitialized && !isInitializing) {
      initialize(host, port);
    }
  }, [autoInitialize, isInitialized, isInitializing, initialize, host, port]);

  return {
    service: timeGrpcService,
    isInitialized,
    isInitializing,
    error,
    initialize,
    healthCheck,
    clearError
  };
}

/**
 * Hook for note operations
 */
export function useNotes() {
  const { service, isInitialized, error } = useTimeGrpc();

  const createNote = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.createNote(request);
  }, [service, isInitialized]);

  const getNote = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.getNote(request);
  }, [service, isInitialized]);

  const deleteNote = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.deleteNote(request);
  }, [service, isInitialized]);

  const likeNote = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.likeNote(request);
  }, [service, isInitialized]);

  const renoteNote = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.renoteNote(request);
  }, [service, isInitialized]);

  return {
    createNote,
    getNote,
    deleteNote,
    likeNote,
    renoteNote,
    isInitialized,
    error
  };
}

/**
 * Hook for user operations
 */
export function useUsers() {
  const { service, isInitialized, error } = useTimeGrpc();

  const loginUser = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.loginUser(request);
  }, [service, isInitialized]);

  const registerUser = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.registerUser(request);
  }, [service, isInitialized]);

  const verifyToken = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.verifyToken(request);
  }, [service, isInitialized]);

  const getUserProfile = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.getUserProfile(request);
  }, [service, isInitialized]);

  return {
    loginUser,
    registerUser,
    verifyToken,
    getUserProfile,
    isInitialized,
    error
  };
}

/**
 * Hook for messaging operations
 */
export function useMessaging() {
  const { service, isInitialized, error } = useTimeGrpc();

  const sendMessage = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.sendMessage(request);
  }, [service, isInitialized]);

  const getMessages = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.getMessages(request);
  }, [service, isInitialized]);

  return {
    sendMessage,
    getMessages,
    isInitialized,
    error
  };
}

/**
 * Hook for search operations
 */
export function useSearch() {
  const { service, isInitialized, error } = useTimeGrpc();

  const searchUsers = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.searchUsers(request);
  }, [service, isInitialized]);

  const searchNotes = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.searchNotes(request);
  }, [service, isInitialized]);

  return {
    searchUsers,
    searchNotes,
    isInitialized,
    error
  };
}

/**
 * Hook for drafts operations
 */
export function useDrafts() {
  const { service, isInitialized, error } = useTimeGrpc();

  const createDraft = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.createDraft(request);
  }, [service, isInitialized]);

  const getUserDrafts = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.getUserDrafts(request);
  }, [service, isInitialized]);

  return {
    createDraft,
    getUserDrafts,
    isInitialized,
    error
  };
}

/**
 * Hook for lists operations
 */
export function useLists() {
  const { service, isInitialized, error } = useTimeGrpc();

  const createList = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.createList(request);
  }, [service, isInitialized]);

  const getUserLists = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.getUserLists(request);
  }, [service, isInitialized]);

  return {
    createList,
    getUserLists,
    isInitialized,
    error
  };
}

/**
 * Hook for starterpacks operations
 */
export function useStarterpacks() {
  const { service, isInitialized, error } = useTimeGrpc();

  const createStarterpack = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.createStarterpack(request);
  }, [service, isInitialized]);

  const getUserStarterpacks = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.getUserStarterpacks(request);
  }, [service, isInitialized]);

  return {
    createStarterpack,
    getUserStarterpacks,
    isInitialized,
    error
  };
}

/**
 * Hook for fanout operations
 */
export function useFanout() {
  const { service, isInitialized, error } = useTimeGrpc();

  const initiateFanout = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.initiateFanout(request);
  }, [service, isInitialized]);

  const getFanoutJobStatus = useCallback(async (request: any) => {
    if (!isInitialized) {
      throw new Error('gRPC client not initialized');
    }
    return await service.getFanoutJobStatus(request);
  }, [service, isInitialized]);

  return {
    initiateFanout,
    getFanoutJobStatus,
    isInitialized,
    error
  };
}