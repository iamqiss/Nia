//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

/**
 * Feature flags for gRPC migration
 * Controls gradual rollout of gRPC services
 */
export interface GrpcFeatureFlags {
  // Core services
  enableNoteService: boolean;
  enableUserService: boolean;
  enableTimelineService: boolean;
  enableMediaService: boolean;
  enableNotificationService: boolean;
  
  // Specific operations
  enableCreateNote: boolean;
  enableGetNote: boolean;
  enableLikeNote: boolean;
  enableRenoteNote: boolean;
  enableDeleteNote: boolean;
  enableLoginUser: boolean;
  enableRegisterUser: boolean;
  enableGetTimeline: boolean;
  enableGetUserTimeline: boolean;
  enableUploadMedia: boolean;
  enableGetNotifications: boolean;
  
  // Advanced features
  enableStreaming: boolean;
  enableRealTimeUpdates: boolean;
  enableConnectionPooling: boolean;
  enableCompression: boolean;
  
  // Migration phases
  phase: 'disabled' | 'testing' | 'gradual' | 'full' | 'complete';
  
  // A/B testing
  abTestGroup?: 'control' | 'treatment';
  abTestPercentage?: number;
}

/**
 * Default feature flags configuration
 */
export const DEFAULT_GRPC_FLAGS: GrpcFeatureFlags = {
  // Core services - start with disabled
  enableNoteService: false,
  enableUserService: false,
  enableTimelineService: false,
  enableMediaService: false,
  enableNotificationService: false,
  
  // Specific operations - start with disabled
  enableCreateNote: false,
  enableGetNote: false,
  enableLikeNote: false,
  enableRenoteNote: false,
  enableDeleteNote: false,
  enableLoginUser: false,
  enableRegisterUser: false,
  enableGetTimeline: false,
  enableGetUserTimeline: false,
  enableUploadMedia: false,
  enableGetNotifications: false,
  
  // Advanced features - disabled initially
  enableStreaming: false,
  enableRealTimeUpdates: false,
  enableConnectionPooling: true,
  enableCompression: true,
  
  // Migration phases
  phase: 'disabled',
  
  // A/B testing
  abTestGroup: undefined,
  abTestPercentage: 0,
};

/**
 * Feature flag manager for gRPC migration
 */
export class GrpcFeatureFlagManager {
  private static instance: GrpcFeatureFlagManager;
  private flags: GrpcFeatureFlags;
  private listeners: Set<(flags: GrpcFeatureFlags) => void> = new Set();
  
  static getInstance(): GrpcFeatureFlagManager {
    if (!GrpcFeatureFlagManager.instance) {
      GrpcFeatureFlagManager.instance = new GrpcFeatureFlagManager();
    }
    return GrpcFeatureFlagManager.instance;
  }
  
  private constructor() {
    this.flags = { ...DEFAULT_GRPC_FLAGS };
    this.loadFlagsFromStorage();
  }
  
  /**
   * Get current feature flags
   */
  getFlags(): GrpcFeatureFlags {
    return { ...this.flags };
  }
  
  /**
   * Update feature flags
   */
  updateFlags(updates: Partial<GrpcFeatureFlags>): void {
    this.flags = { ...this.flags, ...updates };
    this.saveFlagsToStorage();
    this.notifyListeners();
  }
  
  /**
   * Check if a specific feature is enabled
   */
  isEnabled(feature: keyof GrpcFeatureFlags): boolean {
    return Boolean(this.flags[feature]);
  }
  
  /**
   * Check if gRPC is enabled for a specific operation
   */
  isGrpcEnabledForOperation(operation: string): boolean {
    const operationFlags: Record<string, keyof GrpcFeatureFlags> = {
      'createNote': 'enableCreateNote',
      'getNote': 'enableGetNote',
      'likeNote': 'enableLikeNote',
      'renoteNote': 'enableRenoteNote',
      'deleteNote': 'enableDeleteNote',
      'loginUser': 'enableLoginUser',
      'registerUser': 'enableRegisterUser',
      'getTimeline': 'enableGetTimeline',
      'getUserTimeline': 'enableGetUserTimeline',
      'uploadMedia': 'enableUploadMedia',
      'getNotifications': 'enableGetNotifications',
    };
    
    const flagKey = operationFlags[operation];
    if (!flagKey) {
      return false;
    }
    
    return this.isEnabled(flagKey);
  }
  
  /**
   * Check if user is in A/B test group
   */
  isInAbTestGroup(): boolean {
    if (!this.flags.abTestGroup || !this.flags.abTestPercentage) {
      return false;
    }
    
    // Simple hash-based A/B testing
    const userId = this.getUserId();
    if (!userId) {
      return false;
    }
    
    const hash = this.simpleHash(userId);
    return (hash % 100) < this.flags.abTestPercentage;
  }
  
  /**
   * Get migration phase
   */
  getPhase(): GrpcFeatureFlags['phase'] {
    return this.flags.phase;
  }
  
  /**
   * Set migration phase
   */
  setPhase(phase: GrpcFeatureFlags['phase']): void {
    this.updateFlags({ phase });
  }
  
  /**
   * Subscribe to flag changes
   */
  subscribe(listener: (flags: GrpcFeatureFlags) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  /**
   * Load flags from storage
   */
  private loadFlagsFromStorage(): void {
    try {
      const stored = localStorage.getItem('grpc_feature_flags');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.flags = { ...DEFAULT_GRPC_FLAGS, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load gRPC feature flags from storage:', error);
    }
  }
  
  /**
   * Save flags to storage
   */
  private saveFlagsToStorage(): void {
    try {
      localStorage.setItem('grpc_feature_flags', JSON.stringify(this.flags));
    } catch (error) {
      console.warn('Failed to save gRPC feature flags to storage:', error);
    }
  }
  
  /**
   * Notify listeners of flag changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.flags);
      } catch (error) {
        console.error('Error in feature flag listener:', error);
      }
    });
  }
  
  /**
   * Get user ID for A/B testing
   */
  private getUserId(): string | null {
    try {
      const session = localStorage.getItem('session');
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.did || parsed.userId;
      }
    } catch (error) {
      // Ignore
    }
    return null;
  }
  
  /**
   * Simple hash function for A/B testing
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

/**
 * Hook to use feature flags in React components
 */
export function useGrpcFeatureFlags() {
  const manager = GrpcFeatureFlagManager.getInstance();
  const [flags, setFlags] = React.useState(manager.getFlags());
  
  React.useEffect(() => {
    const unsubscribe = manager.subscribe(setFlags);
    return unsubscribe;
  }, []);
  
  return {
    flags,
    isEnabled: (feature: keyof GrpcFeatureFlags) => manager.isEnabled(feature),
    isGrpcEnabledForOperation: (operation: string) => manager.isGrpcEnabledForOperation(operation),
    isInAbTestGroup: () => manager.isInAbTestGroup(),
    getPhase: () => manager.getPhase(),
    setPhase: (phase: GrpcFeatureFlags['phase']) => manager.setPhase(phase),
  };
}

/**
 * Migration phase configurations
 */
export const MIGRATION_PHASES = {
  disabled: {
    name: 'Disabled',
    description: 'gRPC is completely disabled, use REST only',
    flags: {
      ...DEFAULT_GRPC_FLAGS,
      phase: 'disabled' as const,
    },
  },
  testing: {
    name: 'Testing',
    description: 'gRPC enabled for internal testing only',
    flags: {
      ...DEFAULT_GRPC_FLAGS,
      phase: 'testing' as const,
      enableNoteService: true,
      enableUserService: true,
      enableCreateNote: true,
      enableGetNote: true,
      enableLoginUser: true,
      enableRegisterUser: true,
    },
  },
  gradual: {
    name: 'Gradual Rollout',
    description: 'gRPC enabled for subset of users with A/B testing',
    flags: {
      ...DEFAULT_GRPC_FLAGS,
      phase: 'gradual' as const,
      enableNoteService: true,
      enableUserService: true,
      enableTimelineService: true,
      enableCreateNote: true,
      enableGetNote: true,
      enableLikeNote: true,
      enableLoginUser: true,
      enableRegisterUser: true,
      enableGetTimeline: true,
      abTestGroup: 'treatment' as const,
      abTestPercentage: 25,
    },
  },
  full: {
    name: 'Full Rollout',
    description: 'gRPC enabled for all users',
    flags: {
      ...DEFAULT_GRPC_FLAGS,
      phase: 'full' as const,
      enableNoteService: true,
      enableUserService: true,
      enableTimelineService: true,
      enableMediaService: true,
      enableNotificationService: true,
      enableCreateNote: true,
      enableGetNote: true,
      enableLikeNote: true,
      enableRenoteNote: true,
      enableDeleteNote: true,
      enableLoginUser: true,
      enableRegisterUser: true,
      enableGetTimeline: true,
      enableGetUserTimeline: true,
      enableUploadMedia: true,
      enableGetNotifications: true,
      enableStreaming: true,
      enableRealTimeUpdates: true,
    },
  },
  complete: {
    name: 'Migration Complete',
    description: 'REST APIs removed, gRPC only',
    flags: {
      ...DEFAULT_GRPC_FLAGS,
      phase: 'complete' as const,
      enableNoteService: true,
      enableUserService: true,
      enableTimelineService: true,
      enableMediaService: true,
      enableNotificationService: true,
      enableCreateNote: true,
      enableGetNote: true,
      enableLikeNote: true,
      enableRenoteNote: true,
      enableDeleteNote: true,
      enableLoginUser: true,
      enableRegisterUser: true,
      enableGetTimeline: true,
      enableGetUserTimeline: true,
      enableUploadMedia: true,
      enableGetNotifications: true,
      enableStreaming: true,
      enableRealTimeUpdates: true,
    },
  },
} as const;

export default GrpcFeatureFlagManager;