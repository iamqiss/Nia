//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { useEffect, useState } from 'react';
import { initializeGrpcMigration, getMigrationStatus } from './initializeMigration';
import { GrpcFeatureFlagManager } from './FeatureFlags';

/**
 * Hook to initialize and manage gRPC migration
 */
export function useMigrationInitialization() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const initializeMigration = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize gRPC migration
        await initializeGrpcMigration();

        if (mounted) {
          setIsInitialized(true);
          setMigrationStatus(getMigrationStatus());
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          console.warn('gRPC migration initialization failed, continuing with REST only:', err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeMigration();

    return () => {
      mounted = false;
    };
  }, []);

  // Monitor migration status changes
  useEffect(() => {
    if (!isInitialized) return;

    const featureFlags = GrpcFeatureFlagManager.getInstance();
    
    const unsubscribe = featureFlags.subscribe((flags) => {
      setMigrationStatus(getMigrationStatus());
    });

    return unsubscribe;
  }, [isInitialized]);

  return {
    isInitialized,
    isLoading,
    error,
    migrationStatus,
  };
}

/**
 * Hook to get current migration status
 */
export function useMigrationStatus() {
  const [status, setStatus] = useState(getMigrationStatus());

  useEffect(() => {
    const featureFlags = GrpcFeatureFlagManager.getInstance();
    
    const unsubscribe = featureFlags.subscribe(() => {
      setStatus(getMigrationStatus());
    });

    return unsubscribe;
  }, []);

  return status;
}

/**
 * Hook to check if gRPC is enabled for a specific operation
 */
export function useGrpcEnabled(operation: string) {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const featureFlags = GrpcFeatureFlagManager.getInstance();
    
    const checkEnabled = () => {
      setIsEnabled(featureFlags.isGrpcEnabledForOperation(operation));
    };

    checkEnabled();

    const unsubscribe = featureFlags.subscribe(() => {
      checkEnabled();
    });

    return unsubscribe;
  }, [operation]);

  return isEnabled;
}

export default useMigrationInitialization;