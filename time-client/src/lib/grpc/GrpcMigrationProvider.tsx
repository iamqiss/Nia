//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  initializeCompleteMigration, 
  getMigrationStatus, 
  healthCheck,
  generateMigrationReport,
  DEFAULT_MIGRATION_CONFIG,
  type MigrationConfig,
  type MigrationStatus
} from './initializeCompleteMigration';

/**
 * gRPC Migration Context
 */
interface GrpcMigrationContextType {
  isInitialized: boolean;
  status: MigrationStatus | null;
  health: 'healthy' | 'degraded' | 'unhealthy';
  initialize: (config?: Partial<MigrationConfig>) => Promise<void>;
  refreshStatus: () => Promise<void>;
  generateReport: () => Promise<string>;
}

const GrpcMigrationContext = createContext<GrpcMigrationContextType | null>(null);

/**
 * gRPC Migration Provider Props
 */
interface GrpcMigrationProviderProps {
  children: ReactNode;
  config?: Partial<MigrationConfig>;
  autoInitialize?: boolean;
}

/**
 * gRPC Migration Provider Component
 * This provider initializes and manages the gRPC migration system
 */
export function GrpcMigrationProvider({ 
  children, 
  config = {}, 
  autoInitialize = true 
}: GrpcMigrationProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [health, setHealth] = useState<'healthy' | 'degraded' | 'unhealthy'>('unhealthy');

  /**
   * Initialize the gRPC migration
   */
  const initialize = async (overrideConfig?: Partial<MigrationConfig>) => {
    try {
      const finalConfig = { ...DEFAULT_MIGRATION_CONFIG, ...config, ...overrideConfig };
      await initializeCompleteMigration(finalConfig);
      setIsInitialized(true);
      await refreshStatus();
    } catch (error) {
      console.error('Failed to initialize gRPC migration:', error);
      throw error;
    }
  };

  /**
   * Refresh migration status
   */
  const refreshStatus = async () => {
    try {
      if (isInitialized) {
        const currentStatus = await getMigrationStatus();
        const currentHealth = await healthCheck();
        setStatus(currentStatus);
        setHealth(currentHealth);
      }
    } catch (error) {
      console.error('Failed to refresh migration status:', error);
    }
  };

  /**
   * Generate migration report
   */
  const generateReport = async (): Promise<string> => {
    try {
      return await generateMigrationReport();
    } catch (error) {
      console.error('Failed to generate migration report:', error);
      throw error;
    }
  };

  // Auto-initialize on mount
  useEffect(() => {
    if (autoInitialize && !isInitialized) {
      initialize().catch(console.error);
    }
  }, [autoInitialize, isInitialized]);

  // Periodic status refresh
  useEffect(() => {
    if (isInitialized) {
      const interval = setInterval(refreshStatus, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isInitialized]);

  const contextValue: GrpcMigrationContextType = {
    isInitialized,
    status,
    health,
    initialize,
    refreshStatus,
    generateReport,
  };

  return (
    <GrpcMigrationContext.Provider value={contextValue}>
      {children}
    </GrpcMigrationContext.Provider>
  );
}

/**
 * Hook to use gRPC migration context
 */
export function useGrpcMigration(): GrpcMigrationContextType {
  const context = useContext(GrpcMigrationContext);
  if (!context) {
    throw new Error('useGrpcMigration must be used within a GrpcMigrationProvider');
  }
  return context;
}

/**
 * Hook to check if gRPC is enabled for a specific operation
 */
export function useGrpcEnabled(operation: string): boolean {
  const { status } = useGrpcMigration();
  
  if (!status || !status.isInitialized) {
    return false;
  }

  // Check if we're in a phase that supports gRPC
  const grpcPhases = ['testing', 'gradual', 'full', 'complete'];
  if (!grpcPhases.includes(status.currentPhase)) {
    return false;
  }

  // Check rollout percentage
  const randomValue = Math.random() * 100;
  if (randomValue > status.rolloutPercentage) {
    return false;
  }

  // Check if operation is supported
  const supportedOperations = [
    'createPost',
    'getPost', 
    'likePost',
    'unlikePost',
    'repostPost',
    'unrepostPost',
    'deletePost',
    'loginUser',
    'registerUser',
    'getUserProfile',
    'getTimeline',
    'getUserTimeline',
    'uploadBlob',
    'registerDevice',
    'updateDevicePreferences',
    'unregisterDevice'
  ];

  return supportedOperations.includes(operation);
}

/**
 * Hook to get migration status with automatic refresh
 */
export function useMigrationStatus() {
  const { status, refreshStatus } = useGrpcMigration();
  
  useEffect(() => {
    if (status?.isInitialized) {
      const interval = setInterval(refreshStatus, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [status?.isInitialized, refreshStatus]);

  return status;
}

/**
 * Hook to get health status with automatic refresh
 */
export function useHealthStatus() {
  const { health, refreshStatus } = useGrpcMigration();
  
  useEffect(() => {
    const interval = setInterval(refreshStatus, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [refreshStatus]);

  return health;
}

export default GrpcMigrationProvider;