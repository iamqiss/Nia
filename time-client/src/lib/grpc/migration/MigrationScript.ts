//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { GrpcFeatureFlagManager, MIGRATION_PHASES } from './FeatureFlags';
import ApiMigrationService from './ApiMigrationService';

/**
 * Migration script for gradual gRPC rollout
 */
export class MigrationScript {
  private featureFlags: GrpcFeatureFlagManager;
  private apiMigrationService: ApiMigrationService;
  
  constructor() {
    this.featureFlags = GrpcFeatureFlagManager.getInstance();
    this.apiMigrationService = ApiMigrationService.getInstance();
  }
  
  /**
   * Initialize migration with gRPC configuration
   */
  async initialize(grpcConfig: { host: string; port: number; useTLS?: boolean }): Promise<void> {
    await this.apiMigrationService.initialize(grpcConfig);
  }
  
  /**
   * Start migration from disabled to testing phase
   */
  async startTestingPhase(): Promise<void> {
    console.log('🚀 Starting gRPC testing phase...');
    
    this.featureFlags.updateFlags(MIGRATION_PHASES.testing.flags);
    
    console.log('✅ Testing phase enabled');
    console.log('📊 Features enabled:', {
      noteService: this.featureFlags.isEnabled('enableNoteService'),
      userService: this.featureFlags.isEnabled('enableUserService'),
      createNote: this.featureFlags.isEnabled('enableCreateNote'),
      getNote: this.featureFlags.isEnabled('enableGetNote'),
      loginUser: this.featureFlags.isEnabled('enableLoginUser'),
      registerUser: this.featureFlags.isEnabled('enableRegisterUser'),
    });
  }
  
  /**
   * Start gradual rollout phase
   */
  async startGradualRollout(abTestPercentage: number = 25): Promise<void> {
    console.log(`🔄 Starting gradual rollout (${abTestPercentage}% of users)...`);
    
    const gradualFlags = {
      ...MIGRATION_PHASES.gradual.flags,
      abTestPercentage,
    };
    
    this.featureFlags.updateFlags(gradualFlags);
    
    console.log('✅ Gradual rollout enabled');
    console.log('📊 Features enabled:', {
      noteService: this.featureFlags.isEnabled('enableNoteService'),
      userService: this.featureFlags.isEnabled('enableUserService'),
      timelineService: this.featureFlags.isEnabled('enableTimelineService'),
      createNote: this.featureFlags.isEnabled('enableCreateNote'),
      getNote: this.featureFlags.isEnabled('enableGetNote'),
      likeNote: this.featureFlags.isEnabled('enableLikeNote'),
      loginUser: this.featureFlags.isEnabled('enableLoginUser'),
      registerUser: this.featureFlags.isEnabled('enableRegisterUser'),
      getTimeline: this.featureFlags.isEnabled('enableGetTimeline'),
      abTestPercentage: this.featureFlags.getFlags().abTestPercentage,
    });
  }
  
  /**
   * Start full rollout phase
   */
  async startFullRollout(): Promise<void> {
    console.log('🌟 Starting full gRPC rollout...');
    
    this.featureFlags.updateFlags(MIGRATION_PHASES.full.flags);
    
    console.log('✅ Full rollout enabled');
    console.log('📊 All features enabled');
  }
  
  /**
   * Complete migration (remove REST APIs)
   */
  async completeMigration(): Promise<void> {
    console.log('🎉 Completing gRPC migration...');
    
    this.featureFlags.updateFlags(MIGRATION_PHASES.complete.flags);
    
    console.log('✅ Migration complete - REST APIs disabled');
    console.log('📊 All features using gRPC');
  }
  
  /**
   * Rollback to previous phase
   */
  async rollback(): Promise<void> {
    const currentPhase = this.featureFlags.getPhase();
    
    console.log(`⏪ Rolling back from ${currentPhase} phase...`);
    
    switch (currentPhase) {
      case 'testing':
        this.featureFlags.updateFlags(MIGRATION_PHASES.disabled.flags);
        console.log('✅ Rolled back to disabled phase');
        break;
      case 'gradual':
        this.featureFlags.updateFlags(MIGRATION_PHASES.testing.flags);
        console.log('✅ Rolled back to testing phase');
        break;
      case 'full':
        this.featureFlags.updateFlags(MIGRATION_PHASES.gradual.flags);
        console.log('✅ Rolled back to gradual phase');
        break;
      case 'complete':
        this.featureFlags.updateFlags(MIGRATION_PHASES.full.flags);
        console.log('✅ Rolled back to full phase');
        break;
      default:
        console.log('ℹ️ Already at disabled phase');
    }
  }
  
  /**
   * Get migration status
   */
  getStatus(): {
    phase: string;
    features: Record<string, boolean>;
    abTestGroup?: string;
    abTestPercentage?: number;
  } {
    const flags = this.featureFlags.getFlags();
    
    return {
      phase: flags.phase,
      features: {
        noteService: flags.enableNoteService,
        userService: flags.enableUserService,
        timelineService: flags.enableTimelineService,
        mediaService: flags.enableMediaService,
        notificationService: flags.enableNotificationService,
        createNote: flags.enableCreateNote,
        getNote: flags.enableGetNote,
        likeNote: flags.enableLikeNote,
        renoteNote: flags.enableRenoteNote,
        deleteNote: flags.enableDeleteNote,
        loginUser: flags.enableLoginUser,
        registerUser: flags.enableRegisterUser,
        getTimeline: flags.enableGetTimeline,
        getUserTimeline: flags.enableGetUserTimeline,
        uploadMedia: flags.enableUploadMedia,
        getNotifications: flags.enableGetNotifications,
        streaming: flags.enableStreaming,
        realTimeUpdates: flags.enableRealTimeUpdates,
      },
      abTestGroup: flags.abTestGroup,
      abTestPercentage: flags.abTestPercentage,
    };
  }
  
  /**
   * Enable specific features for testing
   */
  enableFeatures(features: Partial<Record<string, boolean>>): void {
    const updates: Record<string, boolean> = {};
    
    Object.entries(features).forEach(([key, value]) => {
      if (key in this.featureFlags.getFlags()) {
        updates[key as keyof typeof this.featureFlags.getFlags()] = value;
      }
    });
    
    this.featureFlags.updateFlags(updates);
    
    console.log('✅ Features updated:', features);
  }
  
  /**
   * Run migration health check
   */
  async healthCheck(): Promise<{
    grpcService: boolean;
    featureFlags: boolean;
    migrationPhase: string;
    errors: string[];
  }> {
    const errors: string[] = [];
    
    // Check gRPC service
    let grpcService = false;
    try {
      const response = await this.apiMigrationService.getUserProfile(
        {} as any, // Mock agent
        'test-user-id'
      );
      grpcService = true;
    } catch (error) {
      errors.push(`gRPC service error: ${error}`);
    }
    
    // Check feature flags
    const featureFlags = this.featureFlags.getPhase() !== 'disabled';
    
    return {
      grpcService,
      featureFlags,
      migrationPhase: this.featureFlags.getPhase(),
      errors,
    };
  }
  
  /**
   * Generate migration report
   */
  generateReport(): {
    timestamp: string;
    status: any;
    recommendations: string[];
  } {
    const status = this.getStatus();
    const recommendations: string[] = [];
    
    // Analyze current state and provide recommendations
    if (status.phase === 'disabled') {
      recommendations.push('Start with testing phase to validate gRPC functionality');
    } else if (status.phase === 'testing') {
      if (status.features.noteService && status.features.userService) {
        recommendations.push('Ready to move to gradual rollout phase');
        recommendations.push('Consider A/B testing with 10-25% of users');
      } else {
        recommendations.push('Enable core services (noteService, userService) for testing');
      }
    } else if (status.phase === 'gradual') {
      if (status.abTestPercentage && status.abTestPercentage >= 50) {
        recommendations.push('Consider moving to full rollout phase');
      } else {
        recommendations.push('Monitor A/B test results before increasing percentage');
      }
    } else if (status.phase === 'full') {
      recommendations.push('Monitor performance and error rates');
      recommendations.push('Consider completing migration if stable');
    } else if (status.phase === 'complete') {
      recommendations.push('Migration complete - monitor for any issues');
    }
    
    return {
      timestamp: new Date().toISOString(),
      status,
      recommendations,
    };
  }
}

export default MigrationScript;