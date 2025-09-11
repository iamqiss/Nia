//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import MigrationScript from './MigrationScript';
import { GrpcFeatureFlagManager } from './FeatureFlags';
import ApiMigrationService from './ApiMigrationService';

/**
 * Initialize gRPC migration
 * This should be called early in the app lifecycle
 */
export async function initializeGrpcMigration(): Promise<void> {
  console.log('🚀 Initializing gRPC migration...');
  
  try {
    // Get gRPC configuration from environment or config
    const grpcConfig = getGrpcConfig();
    
    // Initialize migration script
    const migrationScript = new MigrationScript();
    await migrationScript.initialize(grpcConfig);
    
    // Initialize API migration service
    const apiMigrationService = ;
    await apiMigrationService.initialize(grpcConfig);
    
    // Check if we should start migration
    const featureFlags = GrpcFeatureFlagManager.getInstance();
    const currentPhase = featureFlags.getPhase();
    
    console.log(`📊 Current migration phase: ${currentPhase}`);
    
    // Auto-start migration based on configuration
    if (shouldAutoStartMigration()) {
      await startMigrationBasedOnConfig(migrationScript);
    }
    
    // Set up monitoring
    setupMigrationMonitoring();
    
    console.log('✅ gRPC migration initialized successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize gRPC migration:', error);
    // Don't throw - let the app continue with REST only
  }
}

/**
 * Get gRPC configuration
 */
function getGrpcConfig(): { host: string; port: number; useTLS?: boolean; timeout?: number } {
  // In production, these would come from environment variables or config
  return {
    host: process.env.GRPC_HOST || 'api.timesocial.com',
    port: parseInt(process.env.GRPC_PORT || '443'),
    useTLS: process.env.GRPC_USE_TLS !== 'false',
    timeout: parseInt(process.env.GRPC_TIMEOUT || '30'),
  };
}

/**
 * Check if migration should auto-start
 */
function shouldAutoStartMigration(): boolean {
  // Check environment variables or feature flags
  return process.env.GRPC_AUTO_START === 'true' || 
         process.env.NODE_ENV === 'development';
}

/**
 * Start migration based on configuration
 */
async function startMigrationBasedOnConfig(migrationScript: MigrationScript): Promise<void> {
  const phase = process.env.GRPC_MIGRATION_PHASE || 'testing';
  
  switch (phase) {
    case 'testing':
      await migrationScript.startTestingPhase();
      break;
    case 'gradual':
      const percentage = parseInt(process.env.GRPC_AB_TEST_PERCENTAGE || '25');
      await migrationScript.startGradualRollout(percentage);
      break;
    case 'full':
      await migrationScript.startFullRollout();
      break;
    case 'complete':
      await migrationScript.completeMigration();
      break;
    default:
      console.log('ℹ️ Migration phase not specified, staying in disabled mode');
  }
}

/**
 * Set up migration monitoring
 */
function setupMigrationMonitoring(): void {
  const featureFlags = GrpcFeatureFlagManager.getInstance();
  
  // Monitor feature flag changes
  featureFlags.subscribe((flags) => {
    console.log('🔄 Feature flags updated:', {
      phase: flags.phase,
      noteService: flags.enableNoteService,
      userService: flags.enableUserService,
      timelineService: flags.enableTimelineService,
    });
  });
  
  // Set up periodic health checks
  if (process.env.NODE_ENV === 'production') {
    setInterval(async () => {
      try {
        const migrationScript = new MigrationScript();
        const health = await migrationScript.healthCheck();
        
        if (health.errors.length > 0) {
          console.warn('⚠️ Migration health check warnings:', health.errors);
        }
      } catch (error) {
        console.error('❌ Migration health check failed:', error);
      }
    }, 60000); // Check every minute
  }
}

/**
 * Get migration status for debugging
 */
export function getMigrationStatus() {
  const migrationScript = new MigrationScript();
  return migrationScript.getStatus();
}

/**
 * Generate migration report
 */
export function generateMigrationReport() {
  const migrationScript = new MigrationScript();
  return migrationScript.generateReport();
}

/**
 * Manual migration control functions
 */
export const MigrationControls = {
  async startTesting() {
    const migrationScript = new MigrationScript();
    await migrationScript.startTestingPhase();
  },
  
  async startGradual(percentage: number = 25) {
    const migrationScript = new MigrationScript();
    await migrationScript.startGradualRollout(percentage);
  },
  
  async startFull() {
    const migrationScript = new MigrationScript();
    await migrationScript.startFullRollout();
  },
  
  async complete() {
    const migrationScript = new MigrationScript();
    await migrationScript.completeMigration();
  },
  
  async rollback() {
    const migrationScript = new MigrationScript();
    await migrationScript.rollback();
  },
  
  async healthCheck() {
    const migrationScript = new MigrationScript();
    return await migrationScript.healthCheck();
  },
  
  getStatus() {
    const migrationScript = new MigrationScript();
    return migrationScript.getStatus();
  },
  
  generateReport() {
    const migrationScript = new MigrationScript();
    return migrationScript.generateReport();
  },
};

// Make migration controls available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).MigrationControls = MigrationControls;
}

export default initializeGrpcMigration;