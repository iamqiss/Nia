//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { Platform } from 'react-native';
import { TimeGrpcClient } from './TimeGrpcClient';
import { TimeGrpcMigrationService } from './TimeGrpcMigrationService';
import { GrpcFeatureFlagManager } from './migration/FeatureFlags';
import { MigrationAdapter } from './migration/MigrationAdapter';
import { ApiMigrationService } from './migration/ApiMigrationService';

/**
 * Complete gRPC Migration Initialization
 * This script initializes the complete gRPC migration system
 */

export interface MigrationConfig {
  // gRPC server configuration
  host: string;
  port: number;
  useTLS: boolean;
  
  // Migration settings
  autoStart: boolean;
  phase: 'disabled' | 'testing' | 'gradual' | 'full' | 'complete';
  rolloutPercentage: number;
  
  // Performance settings
  connectionTimeout: number;
  requestTimeout: number;
  maxRetries: number;
  
  // Monitoring
  enableMetrics: boolean;
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface MigrationStatus {
  isInitialized: boolean;
  currentPhase: string;
  rolloutPercentage: number;
  totalRequests: number;
  grpcRequests: number;
  restRequests: number;
  errorCount: number;
  averageLatency: number;
  lastError?: string;
  lastErrorTime?: Date;
  uptime: number;
  healthStatus: 'healthy' | 'degraded' | 'unhealthy';
}

class CompleteMigrationManager {
  private grpcClient: TimeGrpcClient | null = null;
  private migrationService: TimeGrpcMigrationService | null = null;
  private featureFlags: GrpcFeatureFlagManager | null = null;
  private migrationAdapter: MigrationAdapter | null = null;
  private apiMigrationService: ApiMigrationService | null = null;
  
  private config: MigrationConfig | null = null;
  private isInitialized = false;
  private startTime: Date | null = null;
  private metrics = {
    totalRequests: 0,
    grpcRequests: 0,
    restRequests: 0,
    errorCount: 0,
    totalLatency: 0,
    lastError: null as string | null,
    lastErrorTime: null as Date | null,
  };

  /**
   * Initialize the complete gRPC migration
   */
  async initialize(config: MigrationConfig): Promise<void> {
    try {
      console.log('🚀 Initializing Complete gRPC Migration...');
      
      this.config = config;
      this.startTime = new Date();
      
      // Initialize feature flags
      this.featureFlags = new GrpcFeatureFlagManager();
      await this.featureFlags.initialize();
      
      // Set migration phase
      await this.featureFlags.setMigrationPhase(config.phase);
      await this.featureFlags.setRolloutPercentage(config.rolloutPercentage);
      
      // Initialize gRPC client
      this.grpcClient = new TimeGrpcClient({
        host: config.host,
        port: config.port,
        useTLS: config.useTLS,
        timeout: config.requestTimeout,
        retries: config.maxRetries,
      });
      
      // Initialize migration service
      this.migrationService = new TimeGrpcMigrationService(this.grpcClient);
      await this.migrationService.initialize();
      
      // Initialize migration adapter
      this.migrationAdapter = new MigrationAdapter(this.grpcClient, this.featureFlags);
      
      // Initialize API migration service
      this.apiMigrationService = new ApiMigrationService(this.migrationAdapter);
      
      // Perform health check
      const healthStatus = await this.performHealthCheck();
      if (healthStatus !== 'healthy') {
        throw new Error(`Health check failed: ${healthStatus}`);
      }
      
      this.isInitialized = true;
      
      console.log('✅ Complete gRPC Migration initialized successfully');
      console.log(`📊 Phase: ${config.phase}`);
      console.log(`📈 Rollout: ${config.rolloutPercentage}%`);
      console.log(`🌐 Server: ${config.host}:${config.port}`);
      console.log(`🔒 TLS: ${config.useTLS ? 'Enabled' : 'Disabled'}`);
      
      // Start auto-migration if enabled
      if (config.autoStart) {
        await this.startAutoMigration();
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize gRPC migration:', error);
      this.metrics.lastError = error instanceof Error ? error.message : 'Unknown error';
      this.metrics.lastErrorTime = new Date();
      this.metrics.errorCount++;
      throw error;
    }
  }

  /**
   * Start automatic migration process
   */
  private async startAutoMigration(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Migration not initialized');
    }

    console.log('🔄 Starting automatic migration process...');
    
    // Start with gradual rollout
    await this.featureFlags!.setMigrationPhase('gradual');
    await this.featureFlags!.setRolloutPercentage(10); // Start with 10%
    
    // Monitor performance and gradually increase
    const monitorInterval = setInterval(async () => {
      try {
        const status = await this.getMigrationStatus();
        
        if (status.healthStatus === 'healthy' && status.errorCount === 0) {
          // Increase rollout percentage
          const currentPercentage = status.rolloutPercentage;
          if (currentPercentage < 100) {
            const newPercentage = Math.min(currentPercentage + 10, 100);
            await this.featureFlags!.setRolloutPercentage(newPercentage);
            console.log(`📈 Increased rollout to ${newPercentage}%`);
          } else {
            // Move to full rollout
            await this.featureFlags!.setMigrationPhase('full');
            console.log('🎉 Moved to full rollout phase');
            clearInterval(monitorInterval);
          }
        } else if (status.healthStatus === 'unhealthy') {
          // Rollback on health issues
          await this.featureFlags!.setRolloutPercentage(0);
          await this.featureFlags!.setMigrationPhase('disabled');
          console.log('⚠️ Rolled back due to health issues');
          clearInterval(monitorInterval);
        }
      } catch (error) {
        console.error('❌ Error in auto-migration monitoring:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Get current migration status
   */
  async getMigrationStatus(): Promise<MigrationStatus> {
    if (!this.isInitialized) {
      throw new Error('Migration not initialized');
    }

    const phase = await this.featureFlags!.getCurrentPhase();
    const rolloutPercentage = await this.featureFlags!.getRolloutPercentage();
    const healthStatus = await this.performHealthCheck();
    
    const uptime = this.startTime ? Date.now() - this.startTime.getTime() : 0;
    const averageLatency = this.metrics.totalRequests > 0 
      ? this.metrics.totalLatency / this.metrics.totalRequests 
      : 0;

    return {
      isInitialized: this.isInitialized,
      currentPhase: phase,
      rolloutPercentage,
      totalRequests: this.metrics.totalRequests,
      grpcRequests: this.metrics.grpcRequests,
      restRequests: this.metrics.restRequests,
      errorCount: this.metrics.errorCount,
      averageLatency,
      lastError: this.metrics.lastError || undefined,
      lastErrorTime: this.metrics.lastErrorTime || undefined,
      uptime,
      healthStatus,
    };
  }

  /**
   * Perform health check
   */
  async performHealthCheck(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
    if (!this.isInitialized) {
      return 'unhealthy';
    }

    try {
      const startTime = Date.now();
      await this.grpcClient!.healthCheck();
      const latency = Date.now() - startTime;
      
      if (latency < 1000) {
        return 'healthy';
      } else if (latency < 3000) {
        return 'degraded';
      } else {
        return 'unhealthy';
      }
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return 'unhealthy';
    }
  }

  /**
   * Get migration service for API calls
   */
  getMigrationService(): TimeGrpcMigrationService {
    if (!this.migrationService) {
      throw new Error('Migration service not initialized');
    }
    return this.migrationService;
  }

  /**
   * Get API migration service for high-level operations
   */
  getApiMigrationService(): ApiMigrationService {
    if (!this.apiMigrationService) {
      throw new Error('API migration service not initialized');
    }
    return this.apiMigrationService;
  }

  /**
   * Record request metrics
   */
  recordRequest(isGrpc: boolean, latency: number, success: boolean): void {
    this.metrics.totalRequests++;
    if (isGrpc) {
      this.metrics.grpcRequests++;
    } else {
      this.metrics.restRequests++;
    }
    
    this.metrics.totalLatency += latency;
    
    if (!success) {
      this.metrics.errorCount++;
    }
  }

  /**
   * Generate migration report
   */
  async generateMigrationReport(): Promise<string> {
    const status = await this.getMigrationStatus();
    const healthStatus = await this.performHealthCheck();
    
    return `
# gRPC Migration Report
Generated: ${new Date().toISOString()}

## Status
- **Initialized**: ${status.isInitialized}
- **Phase**: ${status.currentPhase}
- **Rollout**: ${status.rolloutPercentage}%
- **Health**: ${healthStatus}

## Metrics
- **Total Requests**: ${status.totalRequests}
- **gRPC Requests**: ${status.grpcRequests} (${status.totalRequests > 0 ? Math.round((status.grpcRequests / status.totalRequests) * 100) : 0}%)
- **REST Requests**: ${status.restRequests} (${status.totalRequests > 0 ? Math.round((status.restRequests / status.totalRequests) * 100) : 0}%)
- **Error Count**: ${status.errorCount}
- **Average Latency**: ${Math.round(status.averageLatency)}ms
- **Uptime**: ${Math.round(status.uptime / 1000)}s

## Errors
${status.lastError ? `- **Last Error**: ${status.lastError} (${status.lastErrorTime})` : '- No errors recorded'}

## Recommendations
${status.healthStatus === 'healthy' ? '✅ System is healthy, consider increasing rollout' : '⚠️ System has issues, consider reducing rollout or investigating'}
${status.errorCount > 0 ? '⚠️ Errors detected, investigate before increasing rollout' : '✅ No errors detected'}
${status.averageLatency > 1000 ? '⚠️ High latency detected, consider optimization' : '✅ Latency is acceptable'}
`;
  }

  /**
   * Shutdown migration system
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down gRPC migration...');
    
    if (this.grpcClient) {
      await this.grpcClient.disconnect();
    }
    
    this.isInitialized = false;
    console.log('✅ gRPC migration shutdown complete');
  }
}

// Global migration manager instance
let migrationManager: CompleteMigrationManager | null = null;

/**
 * Initialize complete gRPC migration
 */
export async function initializeCompleteMigration(config: MigrationConfig): Promise<void> {
  if (migrationManager) {
    console.log('⚠️ Migration already initialized');
    return;
  }

  migrationManager = new CompleteMigrationManager();
  await migrationManager.initialize(config);
}

/**
 * Get migration status
 */
export async function getMigrationStatus(): Promise<MigrationStatus> {
  if (!migrationManager) {
    throw new Error('Migration not initialized');
  }
  return migrationManager.getMigrationStatus();
}

/**
 * Get migration service
 */
export function getMigrationService(): TimeGrpcMigrationService {
  if (!migrationManager) {
    throw new Error('Migration not initialized');
  }
  return migrationManager.getMigrationService();
}

/**
 * Get API migration service
 */
export function getApiMigrationService(): ApiMigrationService {
  if (!migrationManager) {
    throw new Error('Migration not initialized');
  }
  return migrationManager.getApiMigrationService();
}

/**
 * Perform health check
 */
export async function healthCheck(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
  if (!migrationManager) {
    return 'unhealthy';
  }
  return migrationManager.performHealthCheck();
}

/**
 * Generate migration report
 */
export async function generateMigrationReport(): Promise<string> {
  if (!migrationManager) {
    throw new Error('Migration not initialized');
  }
  return migrationManager.generateMigrationReport();
}

/**
 * Shutdown migration
 */
export async function shutdownMigration(): Promise<void> {
  if (migrationManager) {
    await migrationManager.shutdown();
    migrationManager = null;
  }
}

// Default configuration
export const DEFAULT_MIGRATION_CONFIG: MigrationConfig = {
  host: 'api.timesocial.com',
  port: 443,
  useTLS: true,
  autoStart: true,
  phase: 'testing',
  rolloutPercentage: 10,
  connectionTimeout: 10000,
  requestTimeout: 30000,
  maxRetries: 3,
  enableMetrics: true,
  enableLogging: true,
  logLevel: 'info',
};

// Export the migration manager class for advanced usage
export { CompleteMigrationManager };