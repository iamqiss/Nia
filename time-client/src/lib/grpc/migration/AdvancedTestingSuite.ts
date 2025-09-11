//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { MigrationAdapter } from './MigrationAdapter';
import { GrpcFeatureFlagManager } from './FeatureFlags';
import { MonitoringSystem } from './MonitoringSystem';
import { CircuitBreakerManager } from './CircuitBreaker';

/**
 * Test configuration
 */
export interface TestConfig {
  duration: number; // milliseconds
  concurrency: number;
  rampUpTime: number; // milliseconds
  rampDownTime: number; // milliseconds
  targetThroughput?: number; // requests per second
  maxLatency?: number; // milliseconds
  maxErrorRate?: number; // percentage
}

/**
 * Load test result
 */
export interface LoadTestResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  maxLatency: number;
  minLatency: number;
  throughput: number; // requests per second
  errorRate: number; // percentage
  duration: number;
  startTime: number;
  endTime: number;
  errors: Array<{ error: string; count: number }>;
  latencyDistribution: Array<{ range: string; count: number }>;
}

/**
 * Chaos test configuration
 */
export interface ChaosTestConfig {
  duration: number;
  failureRate: number; // percentage of requests to fail
  latencyInjection: number; // additional latency in milliseconds
  memoryPressure: boolean;
  networkPartition: boolean;
  serviceUnavailable: boolean;
}

/**
 * Chaos test result
 */
export interface ChaosTestResult {
  totalRequests: number;
  injectedFailures: number;
  actualFailures: number;
  recoveryTime: number; // milliseconds
  resilienceScore: number; // 0-100
  circuitBreakerTrips: number;
  fallbackActivations: number;
  errors: Array<{ error: string; count: number }>;
}

/**
 * Performance benchmark result
 */
export interface BenchmarkResult {
  operation: string;
  grpcLatency: number;
  restLatency: number;
  grpcThroughput: number;
  restThroughput: number;
  grpcMemoryUsage: number;
  restMemoryUsage: number;
  grpcErrorRate: number;
  restErrorRate: number;
  improvement: {
    latency: number; // percentage improvement
    throughput: number; // percentage improvement
    memory: number; // percentage improvement
    reliability: number; // percentage improvement
  };
}

/**
 * Advanced testing suite for gRPC migration
 */
export class AdvancedTestingSuite {
  private migrationAdapter: MigrationAdapter;
  private featureFlags: GrpcFeatureFlagManager;
  private monitoring: MonitoringSystem;
  private circuitBreakerManager: CircuitBreakerManager;
  private isRunning = false;

  constructor() {
    this.migrationAdapter = MigrationAdapter.getInstance();
    this.featureFlags = GrpcFeatureFlagManager.getInstance();
    this.monitoring = MonitoringSystem.getInstance();
    this.circuitBreakerManager = CircuitBreakerManager.getInstance();
  }

  /**
   * Run load test
   */
  async runLoadTest(
    operation: string,
    requestFactory: () => any,
    config: TestConfig
  ): Promise<LoadTestResult> {
    console.log(`🚀 Starting load test for ${operation}...`);
    
    const startTime = Date.now();
    const results: Array<{ success: boolean; latency: number; error?: string }> = [];
    const errors: Map<string, number> = new Map();
    
    this.isRunning = true;
    
    try {
      // Ramp up phase
      await this.rampUp(config.rampUpTime, config.concurrency);
      
      // Main test phase
      const testPromises: Promise<void>[] = [];
      const testDuration = config.duration - config.rampUpTime - config.rampDownTime;
      
      for (let i = 0; i < config.concurrency && this.isRunning; i++) {
        testPromises.push(this.runLoadTestWorker(operation, requestFactory, testDuration, results, errors));
      }
      
      await Promise.all(testPromises);
      
      // Ramp down phase
      await this.rampDown(config.rampDownTime, config.concurrency);
      
    } finally {
      this.isRunning = false;
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    return this.calculateLoadTestResult(results, errors, startTime, endTime, duration);
  }

  /**
   * Run chaos test
   */
  async runChaosTest(
    operation: string,
    requestFactory: () => any,
    config: ChaosTestConfig
  ): Promise<ChaosTestResult> {
    console.log(`🌪️ Starting chaos test for ${operation}...`);
    
    const startTime = Date.now();
    const results: Array<{ success: boolean; latency: number; error?: string; injected?: boolean }> = [];
    const errors: Map<string, number> = new Map();
    let circuitBreakerTrips = 0;
    let fallbackActivations = 0;
    
    // Set up chaos conditions
    this.setupChaosConditions(config);
    
    try {
      const promises: Promise<void>[] = [];
      const concurrency = 10; // Fixed concurrency for chaos test
      
      for (let i = 0; i < concurrency; i++) {
        promises.push(this.runChaosTestWorker(operation, requestFactory, config, results, errors));
      }
      
      await Promise.all(promises);
      
    } finally {
      this.cleanupChaosConditions();
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Calculate resilience score
    const resilienceScore = this.calculateResilienceScore(results, config);
    
    return {
      totalRequests: results.length,
      injectedFailures: results.filter(r => r.injected).length,
      actualFailures: results.filter(r => !r.success).length,
      recoveryTime: this.calculateRecoveryTime(results),
      resilienceScore,
      circuitBreakerTrips,
      fallbackActivations,
      errors: Array.from(errors.entries()).map(([error, count]) => ({ error, count })),
    };
  }

  /**
   * Run performance benchmark
   */
  async runBenchmark(operations: string[]): Promise<BenchmarkResult[]> {
    console.log(`📊 Starting performance benchmark...`);
    
    const results: BenchmarkResult[] = [];
    
    for (const operation of operations) {
      console.log(`Benchmarking ${operation}...`);
      
      // Test gRPC performance
      const grpcResult = await this.benchmarkOperation(operation, true);
      
      // Test REST performance
      const restResult = await this.benchmarkOperation(operation, false);
      
      // Calculate improvements
      const improvement = {
        latency: ((restResult.latency - grpcResult.latency) / restResult.latency) * 100,
        throughput: ((grpcResult.throughput - restResult.throughput) / restResult.throughput) * 100,
        memory: ((restResult.memoryUsage - grpcResult.memoryUsage) / restResult.memoryUsage) * 100,
        reliability: ((restResult.errorRate - grpcResult.errorRate) / restResult.errorRate) * 100,
      };
      
      results.push({
        operation,
        grpcLatency: grpcResult.latency,
        restLatency: restResult.latency,
        grpcThroughput: grpcResult.throughput,
        restThroughput: restResult.throughput,
        grpcMemoryUsage: grpcResult.memoryUsage,
        restMemoryUsage: restResult.memoryUsage,
        grpcErrorRate: grpcResult.errorRate,
        restErrorRate: restResult.errorRate,
        improvement,
      });
    }
    
    return results;
  }

  /**
   * Run stress test
   */
  async runStressTest(
    operation: string,
    requestFactory: () => any,
    maxConcurrency: number = 100
  ): Promise<{
    maxConcurrency: number;
    breakingPoint: number;
    results: LoadTestResult[];
  }> {
    console.log(`💪 Starting stress test for ${operation}...`);
    
    const results: LoadTestResult[] = [];
    let breakingPoint = maxConcurrency;
    
    for (let concurrency = 1; concurrency <= maxConcurrency; concurrency += 5) {
      const config: TestConfig = {
        duration: 30000, // 30 seconds per test
        concurrency,
        rampUpTime: 5000,
        rampDownTime: 5000,
        maxErrorRate: 10, // 10% error rate threshold
      };
      
      const result = await this.runLoadTest(operation, requestFactory, config);
      results.push(result);
      
      // Check if we've hit the breaking point
      if (result.errorRate > 10 || result.averageLatency > 5000) {
        breakingPoint = concurrency;
        break;
      }
    }
    
    return {
      maxConcurrency,
      breakingPoint,
      results,
    };
  }

  /**
   * Run reliability test
   */
  async runReliabilityTest(
    operation: string,
    requestFactory: () => any,
    duration: number = 300000 // 5 minutes
  ): Promise<{
    totalRequests: number;
    successRate: number;
    averageLatency: number;
    maxLatency: number;
    errorPatterns: Array<{ error: string; count: number; percentage: number }>;
    stabilityScore: number;
  }> {
    console.log(`🛡️ Starting reliability test for ${operation}...`);
    
    const startTime = Date.now();
    const results: Array<{ success: boolean; latency: number; error?: string }> = [];
    const errors: Map<string, number> = new Map();
    
    const config: TestConfig = {
      duration,
      concurrency: 10,
      rampUpTime: 10000,
      rampDownTime: 10000,
    };
    
    await this.runLoadTest(operation, requestFactory, config);
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    // Calculate stability score based on consistency
    const latencies = results.map(r => r.latency);
    const avgLatency = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
    const latencyVariance = latencies.reduce((sum, l) => sum + Math.pow(l - avgLatency, 2), 0) / latencies.length;
    const stabilityScore = Math.max(0, 100 - (latencyVariance / avgLatency) * 100);
    
    const totalRequests = results.length;
    const successfulRequests = results.filter(r => r.success).length;
    const successRate = (successfulRequests / totalRequests) * 100;
    
    // Count errors
    results.forEach(r => {
      if (r.error) {
        errors.set(r.error, (errors.get(r.error) || 0) + 1);
      }
    });
    
    const errorPatterns = Array.from(errors.entries()).map(([error, count]) => ({
      error,
      count,
      percentage: (count / totalRequests) * 100,
    }));
    
    return {
      totalRequests,
      successRate,
      averageLatency: avgLatency,
      maxLatency: Math.max(...latencies),
      errorPatterns,
      stabilityScore,
    };
  }

  /**
   * Load test worker
   */
  private async runLoadTestWorker(
    operation: string,
    requestFactory: () => any,
    duration: number,
    results: Array<{ success: boolean; latency: number; error?: string }>,
    errors: Map<string, number>
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < duration && this.isRunning) {
      const request = requestFactory();
      const requestStart = Date.now();
      
      try {
        // Execute the operation based on type
        await this.executeOperation(operation, request);
        
        const latency = Date.now() - requestStart;
        results.push({ success: true, latency });
        
      } catch (error) {
        const latency = Date.now() - requestStart;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        results.push({ success: false, latency, error: errorMessage });
        errors.set(errorMessage, (errors.get(errorMessage) || 0) + 1);
      }
      
      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  /**
   * Chaos test worker
   */
  private async runChaosTestWorker(
    operation: string,
    requestFactory: () => any,
    config: ChaosTestConfig,
    results: Array<{ success: boolean; latency: number; error?: string; injected?: boolean }>,
    errors: Map<string, number>
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < config.duration && this.isRunning) {
      const request = requestFactory();
      const requestStart = Date.now();
      const shouldInjectFailure = Math.random() < (config.failureRate / 100);
      
      try {
        if (shouldInjectFailure) {
          // Inject artificial failure
          throw new Error('Injected chaos failure');
        }
        
        // Add artificial latency
        if (config.latencyInjection > 0) {
          await new Promise(resolve => setTimeout(resolve, config.latencyInjection));
        }
        
        await this.executeOperation(operation, request);
        
        const latency = Date.now() - requestStart;
        results.push({ success: true, latency, injected: shouldInjectFailure });
        
      } catch (error) {
        const latency = Date.now() - requestStart;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        results.push({ 
          success: false, 
          latency, 
          error: errorMessage, 
          injected: shouldInjectFailure 
        });
        errors.set(errorMessage, (errors.get(errorMessage) || 0) + 1);
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Execute operation based on type
   */
  private async executeOperation(operation: string, request: any): Promise<any> {
    // This would be implemented based on the actual operation types
    // For now, just simulate the operation
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    return { success: true };
  }

  /**
   * Setup chaos conditions
   */
  private setupChaosConditions(config: ChaosTestConfig): void {
    // This would implement actual chaos conditions
    // For now, just log the configuration
    console.log('Setting up chaos conditions:', config);
  }

  /**
   * Cleanup chaos conditions
   */
  private cleanupChaosConditions(): void {
    console.log('Cleaning up chaos conditions');
  }

  /**
   * Calculate load test result
   */
  private calculateLoadTestResult(
    results: Array<{ success: boolean; latency: number; error?: string }>,
    errors: Map<string, number>,
    startTime: number,
    endTime: number,
    duration: number
  ): LoadTestResult {
    const totalRequests = results.length;
    const successfulRequests = results.filter(r => r.success).length;
    const failedRequests = totalRequests - successfulRequests;
    const errorRate = (failedRequests / totalRequests) * 100;
    
    const latencies = results.map(r => r.latency).sort((a, b) => a - b);
    const averageLatency = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
    const p50Latency = latencies[Math.floor(latencies.length * 0.5)];
    const p95Latency = latencies[Math.floor(latencies.length * 0.95)];
    const p99Latency = latencies[Math.floor(latencies.length * 0.99)];
    const maxLatency = Math.max(...latencies);
    const minLatency = Math.min(...latencies);
    
    const throughput = totalRequests / (duration / 1000);
    
    // Calculate latency distribution
    const latencyDistribution = this.calculateLatencyDistribution(latencies);
    
    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageLatency,
      p50Latency,
      p95Latency,
      p99Latency,
      maxLatency,
      minLatency,
      throughput,
      errorRate,
      duration,
      startTime,
      endTime,
      errors: Array.from(errors.entries()).map(([error, count]) => ({ error, count })),
      latencyDistribution,
    };
  }

  /**
   * Calculate latency distribution
   */
  private calculateLatencyDistribution(latencies: number[]): Array<{ range: string; count: number }> {
    const ranges = [
      { min: 0, max: 100, label: '0-100ms' },
      { min: 100, max: 500, label: '100-500ms' },
      { min: 500, max: 1000, label: '500ms-1s' },
      { min: 1000, max: 5000, label: '1-5s' },
      { min: 5000, max: Infinity, label: '5s+' },
    ];
    
    return ranges.map(range => ({
      range: range.label,
      count: latencies.filter(l => l >= range.min && l < range.max).length,
    }));
  }

  /**
   * Calculate resilience score
   */
  private calculateResilienceScore(
    results: Array<{ success: boolean; injected?: boolean }>,
    config: ChaosTestConfig
  ): number {
    const totalRequests = results.length;
    const injectedFailures = results.filter(r => r.injected).length;
    const actualFailures = results.filter(r => !r.success).length;
    
    // Resilience score based on how well the system handles injected failures
    const expectedFailures = Math.floor(totalRequests * (config.failureRate / 100));
    const resilienceRatio = expectedFailures > 0 ? actualFailures / expectedFailures : 1;
    
    return Math.max(0, Math.min(100, 100 - (resilienceRatio - 1) * 50));
  }

  /**
   * Calculate recovery time
   */
  private calculateRecoveryTime(results: Array<{ success: boolean; injected?: boolean }>): number {
    // Find the longest sequence of failures followed by success
    let maxRecoveryTime = 0;
    let currentFailureCount = 0;
    
    for (const result of results) {
      if (!result.success) {
        currentFailureCount++;
      } else {
        if (currentFailureCount > 0) {
          maxRecoveryTime = Math.max(maxRecoveryTime, currentFailureCount);
          currentFailureCount = 0;
        }
      }
    }
    
    return maxRecoveryTime * 100; // Convert to milliseconds (assuming 100ms per request)
  }

  /**
   * Benchmark a single operation
   */
  private async benchmarkOperation(
    operation: string,
    useGrpc: boolean
  ): Promise<{
    latency: number;
    throughput: number;
    memoryUsage: number;
    errorRate: number;
  }> {
    // This would implement actual benchmarking
    // For now, return mock data
    return {
      latency: useGrpc ? 50 : 100,
      throughput: useGrpc ? 200 : 100,
      memoryUsage: useGrpc ? 10 : 20,
      errorRate: useGrpc ? 0.01 : 0.02,
    };
  }

  /**
   * Ramp up concurrency
   */
  private async rampUp(duration: number, targetConcurrency: number): Promise<void> {
    const steps = 10;
    const stepDuration = duration / steps;
    const concurrencyStep = targetConcurrency / steps;
    
    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }

  /**
   * Ramp down concurrency
   */
  private async rampDown(duration: number, currentConcurrency: number): Promise<void> {
    const steps = 10;
    const stepDuration = duration / steps;
    
    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }
}

export default AdvancedTestingSuite;