//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

/**
 * Feature flags for gRPC migration
 * Controls gradual rollout of gRPC services with advanced A/B testing and user segmentation
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
  enableCircuitBreaker: boolean;
  enableRequestBatching: boolean;
  enableIntelligentCaching: boolean;
  enablePerformanceMonitoring: boolean;
  
  // Migration phases
  phase: 'disabled' | 'testing' | 'gradual' | 'full' | 'complete';
  
  // Advanced A/B testing and user segmentation
  abTestGroup?: 'control' | 'treatment';
  abTestPercentage?: number;
  userSegments?: string[];
  geographicRegions?: string[];
  deviceTypes?: string[];
  appVersions?: string[];
  
  // Performance thresholds
  performanceThresholds?: {
    maxLatencyMs: number;
    maxErrorRate: number;
    minThroughput: number;
    maxMemoryUsageMB: number;
  };
  
  // Circuit breaker configuration
  circuitBreakerConfig?: {
    failureThreshold: number;
    recoveryTimeoutMs: number;
    halfOpenMaxCalls: number;
  };
  
  // Caching configuration
  cachingConfig?: {
    ttlSeconds: number;
    maxSize: number;
    enableCompression: boolean;
    enablePersistence: boolean;
  };
  
  // Monitoring configuration
  monitoringConfig?: {
    enableMetrics: boolean;
    enableTracing: boolean;
    enableLogging: boolean;
    samplingRate: number;
  };
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
  enableCircuitBreaker: true,
  enableRequestBatching: false,
  enableIntelligentCaching: false,
  enablePerformanceMonitoring: true,
  
  // Migration phases
  phase: 'disabled',
  
  // A/B testing
  abTestGroup: undefined,
  abTestPercentage: 0,
  userSegments: [],
  geographicRegions: [],
  deviceTypes: [],
  appVersions: [],
  
  // Performance thresholds
  performanceThresholds: {
    maxLatencyMs: 1000,
    maxErrorRate: 0.05,
    minThroughput: 100,
    maxMemoryUsageMB: 100,
  },
  
  // Circuit breaker configuration
  circuitBreakerConfig: {
    failureThreshold: 5,
    recoveryTimeoutMs: 30000,
    halfOpenMaxCalls: 3,
  },
  
  // Caching configuration
  cachingConfig: {
    ttlSeconds: 300,
    maxSize: 1000,
    enableCompression: true,
    enablePersistence: false,
  },
  
  // Monitoring configuration
  monitoringConfig: {
    enableMetrics: true,
    enableTracing: true,
    enableLogging: true,
    samplingRate: 0.1,
  },
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
   * Check if gRPC is enabled for a specific operation with advanced criteria
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
    
    // Check if the operation is enabled
    if (!this.isEnabled(flagKey)) {
      return false;
    }
    
    // Check if user is in A/B test group
    if (!this.isInAbTestGroup()) {
      return false;
    }
    
    // Check if user meets performance criteria
    if (!this.meetsPerformanceCriteria()) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Check if user is in A/B test group with advanced segmentation
   */
  isInAbTestGroup(): boolean {
    if (!this.flags.abTestGroup || !this.flags.abTestPercentage) {
      return false;
    }
    
    // Get user context for advanced segmentation
    const userContext = this.getUserContext();
    if (!userContext.userId) {
      return false;
    }
    
    // Check user segments
    if (this.flags.userSegments && this.flags.userSegments.length > 0) {
      if (!this.flags.userSegments.includes(userContext.segment)) {
        return false;
      }
    }
    
    // Check geographic regions
    if (this.flags.geographicRegions && this.flags.geographicRegions.length > 0) {
      if (!this.flags.geographicRegions.includes(userContext.region)) {
        return false;
      }
    }
    
    // Check device types
    if (this.flags.deviceTypes && this.flags.deviceTypes.length > 0) {
      if (!this.flags.deviceTypes.includes(userContext.deviceType)) {
        return false;
      }
    }
    
    // Check app versions
    if (this.flags.appVersions && this.flags.appVersions.length > 0) {
      if (!this.flags.appVersions.includes(userContext.appVersion)) {
        return false;
      }
    }
    
    // Advanced hash-based A/B testing with multiple factors
    const hash = this.advancedHash(userContext);
    return (hash % 100) < this.flags.abTestPercentage;
  }
  
  /**
   * Check if user meets performance criteria for gRPC
   */
  meetsPerformanceCriteria(): boolean {
    const userContext = this.getUserContext();
    const thresholds = this.flags.performanceThresholds;
    
    if (!thresholds) {
      return true;
    }
    
    // Check network conditions
    if (userContext.networkSpeed && userContext.networkSpeed < thresholds.minThroughput) {
      return false;
    }
    
    // Check device capabilities
    if (userContext.deviceMemory && userContext.deviceMemory < thresholds.maxMemoryUsageMB) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Get user context for advanced segmentation
   */
  private getUserContext(): {
    userId: string | null;
    segment: string;
    region: string;
    deviceType: string;
    appVersion: string;
    networkSpeed?: number;
    deviceMemory?: number;
  } {
    const userId = this.getUserId();
    
    return {
      userId,
      segment: this.getUserSegment(userId),
      region: this.getUserRegion(),
      deviceType: this.getDeviceType(),
      appVersion: this.getAppVersion(),
      networkSpeed: this.getNetworkSpeed(),
      deviceMemory: this.getDeviceMemory(),
    };
  }
  
  /**
   * Get user segment based on behavior and characteristics
   */
  private getUserSegment(userId: string | null): string {
    if (!userId) return 'anonymous';
    
    // This would integrate with your user analytics system
    // For now, using a simple hash-based segmentation
    const hash = this.simpleHash(userId);
    const segments = ['power_user', 'casual_user', 'new_user', 'premium_user'];
    return segments[hash % segments.length];
  }
  
  /**
   * Get user geographic region
   */
  private getUserRegion(): string {
    // This would integrate with geolocation services
    // For now, using a default
    return 'us-west';
  }
  
  /**
   * Get device type
   */
  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'server';
    
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mobile')) return 'mobile';
    if (userAgent.includes('tablet')) return 'tablet';
    return 'desktop';
  }
  
  /**
   * Get app version
   */
  private getAppVersion(): string {
    // This would come from your app's version system
    return '1.0.0';
  }
  
  /**
   * Get network speed (estimated)
   */
  private getNetworkSpeed(): number | undefined {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return undefined;
    }
    
    const connection = (navigator as any).connection;
    return connection?.effectiveType === '4g' ? 100 : 50;
  }
  
  /**
   * Get device memory (estimated)
   */
  private getDeviceMemory(): number | undefined {
    if (typeof navigator === 'undefined' || !('deviceMemory' in navigator)) {
      return undefined;
    }
    
    return (navigator as any).deviceMemory;
  }
  
  /**
   * Advanced hash function for A/B testing with multiple factors
   */
  private advancedHash(userContext: any): number {
    const factors = [
      userContext.userId || 'anonymous',
      userContext.segment,
      userContext.region,
      userContext.deviceType,
      userContext.appVersion,
    ].join('|');
    
    return this.simpleHash(factors);
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
    description: 'gRPC enabled for all users with advanced features',
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
      enableCircuitBreaker: true,
      enableRequestBatching: true,
      enableIntelligentCaching: true,
      enablePerformanceMonitoring: true,
    },
  },
  complete: {
    name: 'Migration Complete',
    description: 'REST APIs removed, gRPC only with all advanced features',
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
      enableCircuitBreaker: true,
      enableRequestBatching: true,
      enableIntelligentCaching: true,
      enablePerformanceMonitoring: true,
    },
  },
} as const;

export default GrpcFeatureFlagManager;