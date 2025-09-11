//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

// Migrated to gRPC;
import { type QueryClient } from '@tanstack/react-query';
import TimeGrpcMigrationService from './TimeGrpcMigrationService';
import { GrpcFeatureFlagManager } from './migration/FeatureFlags';

/**
 * Complete Migration Script
 * Orchestrates the full migration from AT Protocol to gRPC
 */
export class CompleteMigrationScript {
  private static instance: CompleteMigrationScript;
  private migrationService: TimeGrpcMigrationService;
  private featureFlags: GrpcFeatureFlagManager;
  private isInitialized = false;

  static getInstance(): CompleteMigrationScript {
    if (!CompleteMigrationScript.instance) {
      CompleteMigrationScript.instance = new CompleteMigrationScript();
    }
    return CompleteMigrationScript.instance;
  }

  private constructor() {
    this.migrationService = TimeGrpcMigrationService.getInstance();
    this.featureFlags = GrpcFeatureFlagManager.getInstance();
  }

  /**
   * Initialize the complete migration
   */
  async initialize(config: {
    host: string;
    port: number;
    useTLS?: boolean;
    timeout?: number;
  }): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.config);
      this.isInitialized = true;
      console.log('✅ Complete migration script initialized');
    } catch (error) {
      throw new Error(`Failed to initialize complete migration: ${error}`);
    }
  }

  /**
   * Phase 1: Start Testing Phase
   * Enable gRPC for core operations only
   */
  async startTestingPhase(): Promise<void> {
    console.log('🚀 Starting Testing Phase...');
    
    this.featureFlags.updateFlags({
      phase: 'testing',
      enableNoteService: true,
      enableUserService: true,
      enableCreateNote: true,
      enableGetNote: true,
      enableLikeNote: true,
      enableLoginUser: true,
      enableRegisterUser: true,
    });

    console.log('✅ Testing phase enabled - Core operations now use gRPC');
  }

  /**
   * Phase 2: Start Gradual Rollout
   * Enable gRPC for subset of users with A/B testing
   */
  async startGradualRollout(percentage: number = 25): Promise<void> {
    console.log(`🚀 Starting Gradual Rollout (${percentage}% of users)...`);
    
    this.featureFlags.updateFlags({
      phase: 'gradual',
      enableNoteService: true,
      enableUserService: true,
      enableTimelineService: true,
      enableCreateNote: true,
      enableGetNote: true,
      enableLikeNote: true,
      enableRenoteNote: true,
      enableLoginUser: true,
      enableRegisterUser: true,
      enableGetTimeline: true,
      abTestGroup: 'treatment',
      abTestPercentage: percentage,
    });

    console.log(`✅ Gradual rollout enabled - ${percentage}% of users now use gRPC`);
  }

  /**
   * Phase 3: Start Full Rollout
   * Enable gRPC for all users
   */
  async startFullRollout(): Promise<void> {
    console.log('🚀 Starting Full Rollout...');
    
    this.featureFlags.updateFlags({
      phase: 'full',
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
    });

    console.log('✅ Full rollout enabled - All users now use gRPC');
  }

  /**
   * Phase 4: Complete Migration
   * Complete the migration to pure gRPC
   */
  async completeMigration(): Promise<void> {
    console.log('🚀 Completing Migration...');
    
    this.featureFlags.updateFlags({
      phase: 'complete',
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
    });

    console.log('✅ Migration completed - gRPC only mode enabled');
  }

  /**
   * Rollback to previous phase
   */
  async rollback(): Promise<void> {
    const currentPhase = this.featureFlags.getPhase();
    
    switch (currentPhase) {
      case 'complete':
        await this.startFullRollout();
        console.log('🔄 Rolled back to Full Rollout phase');
        break;
      case 'full':
        await this.startGradualRollout(25);
        console.log('🔄 Rolled back to Gradual Rollout phase');
        break;
      case 'gradual':
        await this.startTestingPhase();
        console.log('🔄 Rolled back to Testing phase');
        break;
      case 'testing':
        this.featureFlags.setPhase('disabled');
        console.log('🔄 Rolled back to Disabled phase');
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
    isGrpcEnabled: boolean;
    enabledOperations: string[];
    healthStatus: string;
  } {
    const phase = this.featureFlags.getPhase();
    const enabledOperations: string[] = [];
    
    // Check which operations are enabled
    const operations = [
      'createNote', 'getNote', 'likeNote', 'renoteNote', 'deleteNote',
      'loginUser', 'registerUser', 'getUserProfile',
      'getTimeline', 'getUserTimeline', 'uploadMedia', 'getNotifications'
    ];
    
    operations.forEach(op => {
      if (this.featureFlags.isGrpcEnabledForOperation(op)) {
        enabledOperations.push(op);
      }
    });

    return {
      phase,
      isGrpcEnabled: phase !== 'disabled',
      enabledOperations,
      healthStatus: 'unknown', // Will be updated by health check
    };
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{
    success: boolean;
    status: string;
    details: any;
  }> {
    try {
      const health = await this.);
      return {
        success: health.success,
        status: health.status,
        details: {
          phase: this.featureFlags.getPhase(),
          isInitialized: this.isInitialized,
        },
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          phase: this.featureFlags.getPhase(),
          isInitialized: this.isInitialized,
        },
      };
    }
  }

  /**
   * Generate migration report
   */
  generateReport(): {
    timestamp: string;
    phase: string;
    enabledOperations: string[];
    featureFlags: any;
    recommendations: string[];
  } {
    const phase = this.featureFlags.getPhase();
    const flags = this.featureFlags.getFlags();
    const enabledOperations: string[] = [];
    
    const operations = [
      'createNote', 'getNote', 'likeNote', 'renoteNote', 'deleteNote',
      'loginUser', 'registerUser', 'getUserProfile',
      'getTimeline', 'getUserTimeline', 'uploadMedia', 'getNotifications'
    ];
    
    operations.forEach(op => {
      if (this.featureFlags.isGrpcEnabledForOperation(op)) {
        enabledOperations.push(op);
      }
    });

    const recommendations: string[] = [];
    
    if (phase === 'disabled') {
      recommendations.push('Start with testing phase to validate gRPC functionality');
    } else if (phase === 'testing') {
      recommendations.push('Monitor performance and error rates before moving to gradual rollout');
    } else if (phase === 'gradual') {
      recommendations.push('Increase rollout percentage gradually based on performance metrics');
    } else if (phase === 'full') {
      recommendations.push('Monitor all users and prepare for complete migration');
    } else if (phase === 'complete') {
      recommendations.push('Migration complete - monitor for any issues and optimize performance');
    }

    return {
      timestamp: new Date().toISOString(),
      phase,
      enabledOperations,
      featureFlags: flags,
      recommendations,
    };
  }

  /**
   * Replace all AT Protocol usage with gRPC
   * This is the main migration function
   */
  async migrateAllAtProtocolUsage(): Promise<void> {
    console.log('🔄 Starting complete AT Protocol to gRPC migration...');
    
    try {
      // Phase 1: Enable testing
      await this.startTestingPhase();
      console.log('✅ Phase 1: Testing phase enabled');
      
      // Wait for validation
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Phase 2: Gradual rollout
      await this.startGradualRollout(25);
      console.log('✅ Phase 2: Gradual rollout enabled (25%)');
      
      // Wait for validation
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Phase 3: Full rollout
      await this.startFullRollout();
      console.log('✅ Phase 3: Full rollout enabled');
      
      // Wait for validation
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      // Phase 4: Complete migration
      await this.completeMigration();
      console.log('✅ Phase 4: Migration completed');
      
      console.log('🎉 Complete AT Protocol to gRPC migration finished!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  /**
   * Emergency rollback
   */
  async emergencyRollback(): Promise<void> {
    console.log('🚨 Emergency rollback initiated...');
    
    this.featureFlags.updateFlags({
      phase: 'disabled',
      enableNoteService: false,
      enableUserService: false,
      enableTimelineService: false,
      enableMediaService: false,
      enableNotificationService: false,
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
      enableStreaming: false,
      enableRealTimeUpdates: false,
    });

    console.log('✅ Emergency rollback completed - All operations now use REST');
  }

  /**
   * Monitor migration progress
   */
  async monitorMigration(): Promise<void> {
    console.log('📊 Starting migration monitoring...');
    
    const monitor = setInterval(async () => {
      try {
        const status = this.getStatus();
        const health = await this.healthCheck();
        
        console.log('📈 Migration Status:', {
          phase: status.phase,
          enabledOperations: status.enabledOperations.length,
          health: health.status,
          timestamp: new Date().toISOString(),
        });
        
        // Check for issues
        if (!health.success) {
          console.warn('⚠️ Health check failed:', health.details);
        }
        
        // Auto-advance phases based on health
        if (status.phase === 'testing' && health.success) {
          console.log('🔄 Auto-advancing to gradual rollout...');
          await this.startGradualRollout(25);
        } else if (status.phase === 'gradual' && health.success) {
          console.log('🔄 Auto-advancing to full rollout...');
          await this.startFullRollout();
        } else if (status.phase === 'full' && health.success) {
          console.log('🔄 Auto-advancing to complete migration...');
          await this.completeMigration();
        }
        
      } catch (error) {
        console.error('❌ Monitoring error:', error);
      }
    }, 30000); // Check every 30 seconds
    
    // Stop monitoring after 1 hour
    setTimeout(() => {
      clearInterval(monitor);
      console.log('📊 Migration monitoring stopped');
    }, 3600000);
  }
}

// MARK: - Default Export

export default CompleteMigrationScript;