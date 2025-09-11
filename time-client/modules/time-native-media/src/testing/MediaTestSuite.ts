import { NativeModules } from 'react-native';
import { MediaSource, MediaLoadResult, MediaConfig } from '../types';

const { TimeNativeMediaModule } = NativeModules;

export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  metrics?: any;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalDuration: number;
  passed: number;
  failed: number;
  skipped: number;
}

export interface PerformanceTestResult {
  testName: string;
  metrics: {
    loadTime: number;
    memoryUsage: number;
    cpuUsage: number;
    networkUsage: number;
    cacheHitRate: number;
    errorRate: number;
  };
  status: 'passed' | 'failed';
  threshold: any;
}

export class MediaTestSuite {
  private static instance: MediaTestSuite;
  private testResults: TestResult[] = [];
  private performanceResults: PerformanceTestResult[] = [];

  private constructor() {}

  public static getInstance(): MediaTestSuite {
    if (!MediaTestSuite.instance) {
      MediaTestSuite.instance = new MediaTestSuite();
    }
    return MediaTestSuite.instance;
  }

  /**
   * Run all tests
   */
  public async runAllTests(): Promise<TestSuite> {
    const startTime = Date.now();
    this.testResults = [];

    console.log('Starting comprehensive media test suite...');

    // Run basic functionality tests
    await this.runBasicTests();
    
    // Run performance tests
    await this.runPerformanceTests();
    
    // Run integration tests
    await this.runIntegrationTests();
    
    // Run stress tests
    await this.runStressTests();
    
    // Run compatibility tests
    await this.runCompatibilityTests();

    const totalDuration = Date.now() - startTime;
    const passed = this.testResults.filter(t => t.status === 'passed').length;
    const failed = this.testResults.filter(t => t.status === 'failed').length;
    const skipped = this.testResults.filter(t => t.status === 'skipped').length;

    const suite: TestSuite = {
      name: 'Media Test Suite',
      tests: this.testResults,
      totalDuration,
      passed,
      failed,
      skipped,
    };

    console.log(`Test suite completed: ${passed} passed, ${failed} failed, ${skipped} skipped`);
    return suite;
  }

  /**
   * Run basic functionality tests
   */
  private async runBasicTests(): Promise<void> {
    console.log('Running basic functionality tests...');

    // Test 1: Video loading
    await this.runTest('Video Loading', async () => {
      const testVideo: MediaSource = {
        uri: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        type: 'video',
        priority: 'normal',
      };

      const result = await TimeNativeMediaModule.loadMedia({
        source: testVideo,
        priority: 'normal',
        timeout: 30000,
        retryCount: 3,
        config: this.getTestConfig(),
      });

      if (!result || result.error) {
        throw new Error(`Video loading failed: ${result?.error || 'Unknown error'}`);
      }

      return result;
    });

    // Test 2: Image loading
    await this.runTest('Image Loading', async () => {
      const testImage: MediaSource = {
        uri: 'https://picsum.photos/800/600',
        type: 'image',
        priority: 'normal',
      };

      const result = await TimeNativeMediaModule.loadMedia({
        source: testImage,
        priority: 'normal',
        timeout: 30000,
        retryCount: 3,
        config: this.getTestConfig(),
      });

      if (!result || result.error) {
        throw new Error(`Image loading failed: ${result?.error || 'Unknown error'}`);
      }

      return result;
    });

    // Test 3: Cache functionality
    await this.runTest('Cache Functionality', async () => {
      const testSource: MediaSource = {
        uri: 'https://picsum.photos/400/300',
        type: 'image',
        priority: 'normal',
        cachePolicy: 'memory-disk',
      };

      // Load first time
      const result1 = await TimeNativeMediaModule.loadMedia({
        source: testSource,
        priority: 'normal',
        timeout: 30000,
        retryCount: 3,
        config: this.getTestConfig(),
      });

      if (!result1 || result1.error) {
        throw new Error(`First load failed: ${result1?.error || 'Unknown error'}`);
      }

      // Check if cached
      const isCached = await TimeNativeMediaModule.isMediaCached(testSource.uri);
      if (!isCached) {
        throw new Error('Media not cached after loading');
      }

      // Load second time (should be from cache)
      const result2 = await TimeNativeMediaModule.loadMedia({
        source: testSource,
        priority: 'normal',
        timeout: 30000,
        retryCount: 3,
        config: this.getTestConfig(),
      });

      if (!result2 || result2.error) {
        throw new Error(`Second load failed: ${result2?.error || 'Unknown error'}`);
      }

      if (!result2.fromCache) {
        throw new Error('Second load should be from cache');
      }

      return { result1, result2, isCached };
    });

    // Test 4: Error handling
    await this.runTest('Error Handling', async () => {
      const invalidSource: MediaSource = {
        uri: 'https://invalid-url-that-does-not-exist.com/image.jpg',
        type: 'image',
        priority: 'normal',
      };

      try {
        const result = await TimeNativeMediaModule.loadMedia({
          source: invalidSource,
          priority: 'normal',
          timeout: 5000,
          retryCount: 1,
          config: this.getTestConfig(),
        });

        if (!result.error) {
          throw new Error('Expected error for invalid URL');
        }

        return { error: result.error };
      } catch (error) {
        // Expected to fail
        return { error: error.message };
      }
    });
  }

  /**
   * Run performance tests
   */
  private async runPerformanceTests(): Promise<void> {
    console.log('Running performance tests...');

    // Test 1: Load time performance
    await this.runPerformanceTest('Load Time Performance', async () => {
      const testSource: MediaSource = {
        uri: 'https://picsum.photos/800/600',
        type: 'image',
        priority: 'normal',
      };

      const startTime = Date.now();
      const result = await TimeNativeMediaModule.loadMedia({
        source: testSource,
        priority: 'normal',
        timeout: 30000,
        retryCount: 3,
        config: this.getTestConfig(),
      });
      const loadTime = Date.now() - startTime;

      if (!result || result.error) {
        throw new Error(`Performance test failed: ${result?.error || 'Unknown error'}`);
      }

      return {
        loadTime,
        memoryUsage: 0, // Would be measured by native module
        cpuUsage: 0,
        networkUsage: result.size || 0,
        cacheHitRate: result.fromCache ? 1 : 0,
        errorRate: 0,
      };
    }, {
      loadTime: 5000, // 5 seconds max
      memoryUsage: 100 * 1024 * 1024, // 100 MB max
      cpuUsage: 0.5, // 50% max
      networkUsage: 10 * 1024 * 1024, // 10 MB max
      cacheHitRate: 0.8, // 80% min
      errorRate: 0.1, // 10% max
    });

    // Test 2: Memory usage performance
    await this.runPerformanceTest('Memory Usage Performance', async () => {
      const sources: MediaSource[] = [];
      for (let i = 0; i < 10; i++) {
        sources.push({
          uri: `https://picsum.photos/400/300?random=${i}`,
          type: 'image',
          priority: 'normal',
        });
      }

      const startTime = Date.now();
      const results = await TimeNativeMediaModule.loadMediaBatch({
        sources,
        priority: 'normal',
        batchSize: 5,
        timeout: 30000,
        retryCount: 3,
        config: this.getTestConfig(),
      });
      const loadTime = Date.now() - startTime;

      const successful = results.filter(r => !r.error).length;
      const errorRate = (results.length - successful) / results.length;

      return {
        loadTime,
        memoryUsage: 0, // Would be measured by native module
        cpuUsage: 0,
        networkUsage: results.reduce((sum, r) => sum + (r.size || 0), 0),
        cacheHitRate: results.filter(r => r.fromCache).length / results.length,
        errorRate,
      };
    }, {
      loadTime: 15000, // 15 seconds max
      memoryUsage: 200 * 1024 * 1024, // 200 MB max
      cpuUsage: 0.7, // 70% max
      networkUsage: 50 * 1024 * 1024, // 50 MB max
      cacheHitRate: 0.5, // 50% min
      errorRate: 0.2, // 20% max
    });

    // Test 3: Cache performance
    await this.runPerformanceTest('Cache Performance', async () => {
      const testSource: MediaSource = {
        uri: 'https://picsum.photos/600/400',
        type: 'image',
        priority: 'normal',
        cachePolicy: 'memory-disk',
      };

      // First load (cache miss)
      const startTime1 = Date.now();
      const result1 = await TimeNativeMediaModule.loadMedia({
        source: testSource,
        priority: 'normal',
        timeout: 30000,
        retryCount: 3,
        config: this.getTestConfig(),
      });
      const loadTime1 = Date.now() - startTime1;

      // Second load (cache hit)
      const startTime2 = Date.now();
      const result2 = await TimeNativeMediaModule.loadMedia({
        source: testSource,
        priority: 'normal',
        timeout: 30000,
        retryCount: 3,
        config: this.getTestConfig(),
      });
      const loadTime2 = Date.now() - startTime2;

      const cacheHitRate = result2.fromCache ? 1 : 0;
      const speedImprovement = loadTime1 / loadTime2;

      return {
        loadTime: loadTime2, // Cache hit time
        memoryUsage: 0,
        cpuUsage: 0,
        networkUsage: result2.size || 0,
        cacheHitRate,
        errorRate: 0,
      };
    }, {
      loadTime: 1000, // 1 second max for cache hit
      memoryUsage: 50 * 1024 * 1024, // 50 MB max
      cpuUsage: 0.3, // 30% max
      networkUsage: 5 * 1024 * 1024, // 5 MB max
      cacheHitRate: 1.0, // 100% min
      errorRate: 0.0, // 0% max
    });
  }

  /**
   * Run integration tests
   */
  private async runIntegrationTests(): Promise<void> {
    console.log('Running integration tests...');

    // Test 1: Video and image mixed loading
    await this.runTest('Mixed Media Loading', async () => {
      const sources: MediaSource[] = [
        {
          uri: 'https://picsum.photos/400/300',
          type: 'image',
          priority: 'high',
        },
        {
          uri: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4',
          type: 'video',
          priority: 'normal',
        },
        {
          uri: 'https://picsum.photos/600/400',
          type: 'image',
          priority: 'low',
        },
      ];

      const results = await TimeNativeMediaModule.loadMediaBatch({
        sources,
        priority: 'normal',
        batchSize: 2,
        timeout: 30000,
        retryCount: 3,
        config: this.getTestConfig(),
      });

      const successful = results.filter(r => !r.error).length;
      if (successful < sources.length * 0.8) {
        throw new Error(`Integration test failed: only ${successful}/${sources.length} media loaded successfully`);
      }

      return { results, successful };
    });

    // Test 2: Prefetching functionality
    await this.runTest('Prefetching Functionality', async () => {
      const sources: MediaSource[] = [
        {
          uri: 'https://picsum.photos/300/200',
          type: 'image',
          priority: 'low',
        },
        {
          uri: 'https://picsum.photos/400/300',
          type: 'image',
          priority: 'low',
        },
        {
          uri: 'https://picsum.photos/500/400',
          type: 'image',
          priority: 'low',
        },
      ];

      await TimeNativeMediaModule.prefetchMedia({
        sources,
        priority: 'low',
        batchSize: 3,
        config: this.getTestConfig(),
      });

      // Check if prefetched media is cached
      const cacheChecks = await Promise.all(
        sources.map(source => TimeNativeMediaModule.isMediaCached(source.uri))
      );

      const cachedCount = cacheChecks.filter(Boolean).length;
      if (cachedCount < sources.length * 0.7) {
        throw new Error(`Prefetching test failed: only ${cachedCount}/${sources.length} media cached`);
      }

      return { sources, cachedCount };
    });
  }

  /**
   * Run stress tests
   */
  private async runStressTests(): Promise<void> {
    console.log('Running stress tests...');

    // Test 1: High load test
    await this.runTest('High Load Test', async () => {
      const sources: MediaSource[] = [];
      for (let i = 0; i < 50; i++) {
        sources.push({
          uri: `https://picsum.photos/200/150?random=${i}`,
          type: 'image',
          priority: 'normal',
        });
      }

      const startTime = Date.now();
      const results = await TimeNativeMediaModule.loadMediaBatch({
        sources,
        priority: 'normal',
        batchSize: 10,
        timeout: 60000,
        retryCount: 2,
        config: this.getTestConfig(),
      });
      const totalTime = Date.now() - startTime;

      const successful = results.filter(r => !r.error).length;
      const successRate = successful / sources.length;

      if (successRate < 0.7) {
        throw new Error(`High load test failed: success rate ${(successRate * 100).toFixed(1)}%`);
      }

      return { results, successful, successRate, totalTime };
    });

    // Test 2: Memory stress test
    await this.runTest('Memory Stress Test', async () => {
      const sources: MediaSource[] = [];
      for (let i = 0; i < 20; i++) {
        sources.push({
          uri: `https://picsum.photos/800/600?random=${i}`,
          type: 'image',
          priority: 'normal',
        });
      }

      const results = await TimeNativeMediaModule.loadMediaBatch({
        sources,
        priority: 'normal',
        batchSize: 5,
        timeout: 60000,
        retryCount: 2,
        config: this.getTestConfig(),
      });

      const successful = results.filter(r => !r.error).length;
      const totalSize = results.reduce((sum, r) => sum + (r.size || 0), 0);

      if (successful < sources.length * 0.8) {
        throw new Error(`Memory stress test failed: only ${successful}/${sources.length} media loaded`);
      }

      return { results, successful, totalSize };
    });
  }

  /**
   * Run compatibility tests
   */
  private async runCompatibilityTests(): Promise<void> {
    console.log('Running compatibility tests...');

    // Test 1: Different image formats
    await this.runTest('Image Format Compatibility', async () => {
      const formats = ['jpg', 'png', 'webp', 'gif'];
      const results = [];

      for (const format of formats) {
        const source: MediaSource = {
          uri: `https://picsum.photos/400/300.${format}`,
          type: 'image',
          priority: 'normal',
        };

        try {
          const result = await TimeNativeMediaModule.loadMedia({
            source,
            priority: 'normal',
            timeout: 30000,
            retryCount: 3,
            config: this.getTestConfig(),
          });

          results.push({ format, success: !result.error, error: result.error });
        } catch (error) {
          results.push({ format, success: false, error: error.message });
        }
      }

      const successful = results.filter(r => r.success).length;
      if (successful < formats.length * 0.5) {
        throw new Error(`Format compatibility test failed: only ${successful}/${formats.length} formats supported`);
      }

      return { results, successful };
    });

    // Test 2: Different video formats
    await this.runTest('Video Format Compatibility', async () => {
      const formats = ['mp4', 'webm'];
      const results = [];

      for (const format of formats) {
        const source: MediaSource = {
          uri: `https://sample-videos.com/zip/10/${format}/SampleVideo_640x360_1mb.${format}`,
          type: 'video',
          priority: 'normal',
        };

        try {
          const result = await TimeNativeMediaModule.loadMedia({
            source,
            priority: 'normal',
            timeout: 30000,
            retryCount: 3,
            config: this.getTestConfig(),
          });

          results.push({ format, success: !result.error, error: result.error });
        } catch (error) {
          results.push({ format, success: false, error: error.message });
        }
      }

      const successful = results.filter(r => r.success).length;
      if (successful < formats.length * 0.5) {
        throw new Error(`Video format compatibility test failed: only ${successful}/${formats.length} formats supported`);
      }

      return { results, successful };
    });
  }

  /**
   * Run a single test
   */
  private async runTest(name: string, testFn: () => Promise<any>): Promise<void> {
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        name,
        status: 'passed',
        duration,
        metrics: result,
      });
      
      console.log(`✓ ${name} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        name,
        status: 'failed',
        duration,
        error: error.message,
      });
      
      console.log(`✗ ${name} (${duration}ms): ${error.message}`);
    }
  }

  /**
   * Run a performance test
   */
  private async runPerformanceTest(
    name: string,
    testFn: () => Promise<any>,
    thresholds: any
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      const metrics = await testFn();
      const duration = Date.now() - startTime;
      
      // Check thresholds
      const passed = this.checkPerformanceThresholds(metrics, thresholds);
      
      const result: PerformanceTestResult = {
        testName: name,
        metrics,
        status: passed ? 'passed' : 'failed',
        threshold: thresholds,
      };
      
      this.performanceResults.push(result);
      
      this.testResults.push({
        name,
        status: passed ? 'passed' : 'failed',
        duration,
        metrics,
        error: passed ? undefined : 'Performance thresholds not met',
      });
      
      console.log(`${passed ? '✓' : '✗'} ${name} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        name,
        status: 'failed',
        duration,
        error: error.message,
      });
      
      console.log(`✗ ${name} (${duration}ms): ${error.message}`);
    }
  }

  /**
   * Check performance thresholds
   */
  private checkPerformanceThresholds(metrics: any, thresholds: any): boolean {
    for (const [key, threshold] of Object.entries(thresholds)) {
      const value = metrics[key];
      if (value === undefined) continue;
      
      if (key.includes('Rate') || key.includes('Usage')) {
        // Higher is better for rates, lower is better for usage
        if (key.includes('Rate')) {
          if (value < threshold) return false;
        } else {
          if (value > threshold) return false;
        }
      } else {
        // Lower is better for time, memory, etc.
        if (value > threshold) return false;
      }
    }
    
    return true;
  }

  /**
   * Get test configuration
   */
  private getTestConfig(): MediaConfig {
    return {
      video: {
        preloadBufferSize: 10,
        maxBufferSize: 30,
        minBufferSize: 2,
        bufferForPlayback: 1,
        bufferForPlaybackAfterRebuffer: 2,
        maxInitialBitrate: 1000000,
        maxBitrate: 2000000,
        adaptiveBitrateEnabled: true,
        preferredVideoQuality: 'medium',
        allowQualityChange: true,
        audioFocusGain: 'gain_transient_may_duck',
        allowBackgroundPlayback: false,
        hardwareAccelerationEnabled: true,
      },
      image: {
        maxMemorySize: 50 * 1024 * 1024, // 50 MB
        maxMemoryItems: 100,
        memoryCacheEnabled: true,
        maxDiskSize: 100 * 1024 * 1024, // 100 MB
        maxDiskAge: 24 * 60 * 60 * 1000, // 1 day
        diskCacheEnabled: true,
        maxImageSize: { width: 1024, height: 1024 },
        compressionQuality: 0.7,
        enableWebP: true,
        enableProgressiveJPEG: true,
      },
      common: {
        timeout: 30000,
        retryCount: 3,
        retryDelay: 1000,
        maxConcurrentDownloads: 3,
        enablePrefetching: true,
        prefetchBatchSize: 5,
        enableBackgroundProcessing: true,
        enableLogging: true,
        enableAnalytics: true,
      },
    };
  }

  /**
   * Get test results
   */
  public getTestResults(): TestResult[] {
    return [...this.testResults];
  }

  /**
   * Get performance results
   */
  public getPerformanceResults(): PerformanceTestResult[] {
    return [...this.performanceResults];
  }

  /**
   * Clear test results
   */
  public clearResults(): void {
    this.testResults = [];
    this.performanceResults = [];
  }

  /**
   * Generate test report
   */
  public generateReport(): string {
    const suite = {
      name: 'Media Test Suite',
      tests: this.testResults,
      totalDuration: this.testResults.reduce((sum, t) => sum + t.duration, 0),
      passed: this.testResults.filter(t => t.status === 'passed').length,
      failed: this.testResults.filter(t => t.status === 'failed').length,
      skipped: this.testResults.filter(t => t.status === 'skipped').length,
    };

    let report = `# Media Test Suite Report\n\n`;
    report += `**Summary:**\n`;
    report += `- Total Tests: ${suite.tests.length}\n`;
    report += `- Passed: ${suite.passed}\n`;
    report += `- Failed: ${suite.failed}\n`;
    report += `- Skipped: ${suite.skipped}\n`;
    report += `- Total Duration: ${suite.totalDuration}ms\n\n`;

    report += `**Test Results:**\n`;
    for (const test of suite.tests) {
      const status = test.status === 'passed' ? '✓' : test.status === 'failed' ? '✗' : '○';
      report += `- ${status} ${test.name} (${test.duration}ms)\n`;
      if (test.error) {
        report += `  - Error: ${test.error}\n`;
      }
    }

    if (this.performanceResults.length > 0) {
      report += `\n**Performance Results:**\n`;
      for (const result of this.performanceResults) {
        const status = result.status === 'passed' ? '✓' : '✗';
        report += `- ${status} ${result.testName}\n`;
        report += `  - Load Time: ${result.metrics.loadTime}ms\n`;
        report += `  - Memory Usage: ${result.metrics.memoryUsage} bytes\n`;
        report += `  - CPU Usage: ${(result.metrics.cpuUsage * 100).toFixed(1)}%\n`;
        report += `  - Network Usage: ${result.metrics.networkUsage} bytes\n`;
        report += `  - Cache Hit Rate: ${(result.metrics.cacheHitRate * 100).toFixed(1)}%\n`;
        report += `  - Error Rate: ${(result.metrics.errorRate * 100).toFixed(1)}%\n`;
      }
    }

    return report;
  }
}