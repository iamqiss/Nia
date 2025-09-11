import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { TimeNativeMediaModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(TimeNativeMediaModule);

export interface PerformanceMetrics {
  // Memory metrics
  memoryUsage: number;
  memoryPeak: number;
  memoryAvailable: number;
  memoryPressure: 'normal' | 'warning' | 'critical';
  
  // CPU metrics
  cpuUsage: number;
  cpuTemperature: number;
  cpuFrequency: number;
  
  // Network metrics
  networkType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  networkSpeed: number; // in Mbps
  networkLatency: number; // in ms
  dataUsage: number; // in bytes
  
  // Storage metrics
  storageTotal: number;
  storageAvailable: number;
  storageUsed: number;
  storagePressure: 'normal' | 'warning' | 'critical';
  
  // Battery metrics
  batteryLevel: number;
  batteryState: 'charging' | 'discharging' | 'full' | 'unknown';
  batteryTemperature: number;
  
  // Device metrics
  deviceTemperature: number;
  deviceOrientation: 'portrait' | 'landscape' | 'unknown';
  deviceMotion: boolean;
  
  // App metrics
  appMemoryUsage: number;
  appCpuUsage: number;
  appNetworkUsage: number;
  appStorageUsage: number;
  
  // Performance scores
  performanceScore: number; // 0-100
  responsivenessScore: number; // 0-100
  efficiencyScore: number; // 0-100
}

export interface PerformanceOptimization {
  // Memory optimizations
  enableMemoryOptimization: boolean;
  memoryThreshold: number;
  memoryCleanupInterval: number;
  enableMemoryCompression: boolean;
  
  // CPU optimizations
  enableCPUOptimization: boolean;
  cpuThreshold: number;
  enableBackgroundProcessing: boolean;
  maxConcurrentTasks: number;
  
  // Network optimizations
  enableNetworkOptimization: boolean;
  networkThreshold: number;
  enableAdaptiveBitrate: boolean;
  enableDataCompression: boolean;
  
  // Storage optimizations
  enableStorageOptimization: boolean;
  storageThreshold: number;
  enableStorageCompression: boolean;
  enableStorageCleanup: boolean;
  
  // Battery optimizations
  enableBatteryOptimization: boolean;
  batteryThreshold: number;
  enablePowerSavingMode: boolean;
  enableBackgroundRestriction: boolean;
  
  // App optimizations
  enableAppOptimization: boolean;
  enableLazyLoading: boolean;
  enableCodeSplitting: boolean;
  enableResourceOptimization: boolean;
}

export interface PerformanceAlert {
  type: 'memory' | 'cpu' | 'network' | 'storage' | 'battery' | 'performance';
  level: 'warning' | 'critical';
  message: string;
  timestamp: number;
  metrics: Partial<PerformanceMetrics>;
  recommendations: string[];
}

export class PerformanceUtils {
  private static instance: PerformanceUtils;
  private metrics: PerformanceMetrics | null = null;
  private optimization: PerformanceOptimization;
  private alerts: PerformanceAlert[] = [];
  private listeners: Map<string, (alert: PerformanceAlert) => void> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  private constructor() {
    this.optimization = this.getDefaultOptimization();
    this.setupEventListeners();
  }

  public static getInstance(): PerformanceUtils {
    if (!PerformanceUtils.instance) {
      PerformanceUtils.instance = new PerformanceUtils();
    }
    return PerformanceUtils.instance;
  }

  private getDefaultOptimization(): PerformanceOptimization {
    return {
      enableMemoryOptimization: true,
      memoryThreshold: 0.8, // 80%
      memoryCleanupInterval: 30000, // 30 seconds
      enableMemoryCompression: true,
      
      enableCPUOptimization: true,
      cpuThreshold: 0.7, // 70%
      enableBackgroundProcessing: true,
      maxConcurrentTasks: 4,
      
      enableNetworkOptimization: true,
      networkThreshold: 1000, // 1 second
      enableAdaptiveBitrate: true,
      enableDataCompression: true,
      
      enableStorageOptimization: true,
      storageThreshold: 0.9, // 90%
      enableStorageCompression: true,
      enableStorageCleanup: true,
      
      enableBatteryOptimization: true,
      batteryThreshold: 0.2, // 20%
      enablePowerSavingMode: true,
      enableBackgroundRestriction: true,
      
      enableAppOptimization: true,
      enableLazyLoading: true,
      enableCodeSplitting: true,
      enableResourceOptimization: true,
    };
  }

  private setupEventListeners() {
    eventEmitter.addListener('onPerformanceAlert', (alert: PerformanceAlert) => {
      this.handlePerformanceAlert(alert);
    });

    eventEmitter.addListener('onPerformanceMetricsUpdate', (metrics: PerformanceMetrics) => {
      this.metrics = metrics;
      this.checkPerformanceThresholds();
    });
  }

  /**
   * Start performance monitoring
   */
  public startMonitoring(interval: number = 5000): void {
    if (this.isMonitoring) {
      this.log('Performance monitoring is already running');
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, interval);

    this.log('Performance monitoring started');
  }

  /**
   * Stop performance monitoring
   */
  public stopMonitoring(): void {
    if (!this.isMonitoring) {
      this.log('Performance monitoring is not running');
      return;
    }

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.log('Performance monitoring stopped');
  }

  /**
   * Collect current performance metrics
   */
  public async collectMetrics(): Promise<PerformanceMetrics> {
    try {
      const metrics = await TimeNativeMediaModule.getPerformanceMetrics();
      this.metrics = metrics;
      this.checkPerformanceThresholds();
      return metrics;
    } catch (error) {
      this.log(`Failed to collect metrics: ${error}`);
      throw error;
    }
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  /**
   * Configure performance optimization
   */
  public configureOptimization(optimization: Partial<PerformanceOptimization>): void {
    this.optimization = { ...this.optimization, ...optimization };
    TimeNativeMediaModule.configurePerformanceOptimization(this.optimization);
    this.log('Performance optimization configured');
  }

  /**
   * Get current optimization configuration
   */
  public getOptimization(): PerformanceOptimization {
    return { ...this.optimization };
  }

  /**
   * Check performance thresholds and generate alerts
   */
  private checkPerformanceThresholds(): void {
    if (!this.metrics) return;

    const alerts: PerformanceAlert[] = [];

    // Memory threshold check
    if (this.optimization.enableMemoryOptimization) {
      const memoryUsage = this.metrics.memoryUsage / this.metrics.memoryAvailable;
      if (memoryUsage > this.optimization.memoryThreshold) {
        alerts.push({
          type: 'memory',
          level: memoryUsage > 0.95 ? 'critical' : 'warning',
          message: `High memory usage: ${(memoryUsage * 100).toFixed(1)}%`,
          timestamp: Date.now(),
          metrics: { memoryUsage: this.metrics.memoryUsage, memoryAvailable: this.metrics.memoryAvailable },
          recommendations: [
            'Clear unused caches',
            'Reduce image quality',
            'Close unused components',
            'Restart the app if critical',
          ],
        });
      }
    }

    // CPU threshold check
    if (this.optimization.enableCPUOptimization) {
      if (this.metrics.cpuUsage > this.optimization.cpuThreshold) {
        alerts.push({
          type: 'cpu',
          level: this.metrics.cpuUsage > 0.9 ? 'critical' : 'warning',
          message: `High CPU usage: ${(this.metrics.cpuUsage * 100).toFixed(1)}%`,
          timestamp: Date.now(),
          metrics: { cpuUsage: this.metrics.cpuUsage },
          recommendations: [
            'Reduce video quality',
            'Disable animations',
            'Close background tasks',
            'Enable power saving mode',
          ],
        });
      }
    }

    // Network threshold check
    if (this.optimization.enableNetworkOptimization) {
      if (this.metrics.networkLatency > this.optimization.networkThreshold) {
        alerts.push({
          type: 'network',
          level: this.metrics.networkLatency > 5000 ? 'critical' : 'warning',
          message: `High network latency: ${this.metrics.networkLatency}ms`,
          timestamp: Date.now(),
          metrics: { networkLatency: this.metrics.networkLatency, networkSpeed: this.metrics.networkSpeed },
          recommendations: [
            'Switch to lower quality',
            'Enable data compression',
            'Use cached content',
            'Check network connection',
          ],
        });
      }
    }

    // Storage threshold check
    if (this.optimization.enableStorageOptimization) {
      const storageUsage = this.metrics.storageUsed / this.metrics.storageTotal;
      if (storageUsage > this.optimization.storageThreshold) {
        alerts.push({
          type: 'storage',
          level: storageUsage > 0.95 ? 'critical' : 'warning',
          message: `High storage usage: ${(storageUsage * 100).toFixed(1)}%`,
          timestamp: Date.now(),
          metrics: { storageUsed: this.metrics.storageUsed, storageTotal: this.metrics.storageTotal },
          recommendations: [
            'Clear cache',
            'Delete unused files',
            'Compress stored data',
            'Free up device storage',
          ],
        });
      }
    }

    // Battery threshold check
    if (this.optimization.enableBatteryOptimization) {
      if (this.metrics.batteryLevel < this.optimization.batteryThreshold) {
        alerts.push({
          type: 'battery',
          level: this.metrics.batteryLevel < 0.1 ? 'critical' : 'warning',
          message: `Low battery: ${(this.metrics.batteryLevel * 100).toFixed(1)}%`,
          timestamp: Date.now(),
          metrics: { batteryLevel: this.metrics.batteryLevel, batteryState: this.metrics.batteryState },
          recommendations: [
            'Enable power saving mode',
            'Reduce video quality',
            'Disable background processing',
            'Close unused apps',
          ],
        });
      }
    }

    // Performance score check
    if (this.metrics.performanceScore < 50) {
      alerts.push({
        type: 'performance',
        level: this.metrics.performanceScore < 25 ? 'critical' : 'warning',
        message: `Low performance score: ${this.metrics.performanceScore}`,
        timestamp: Date.now(),
        metrics: { performanceScore: this.metrics.performanceScore },
        recommendations: [
          'Optimize memory usage',
          'Reduce CPU load',
          'Improve network efficiency',
          'Enable all optimizations',
        ],
      });
    }

    // Process alerts
    for (const alert of alerts) {
      this.handlePerformanceAlert(alert);
    }
  }

  /**
   * Handle performance alert
   */
  private handlePerformanceAlert(alert: PerformanceAlert): void {
    this.alerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    // Notify listeners
    for (const listener of this.listeners.values()) {
      listener(alert);
    }

    this.log(`Performance alert: ${alert.type} - ${alert.level} - ${alert.message}`);
  }

  /**
   * Add performance alert listener
   */
  public addAlertListener(id: string, listener: (alert: PerformanceAlert) => void): void {
    this.listeners.set(id, listener);
  }

  /**
   * Remove performance alert listener
   */
  public removeAlertListener(id: string): void {
    this.listeners.delete(id);
  }

  /**
   * Get performance alerts
   */
  public getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  /**
   * Get alerts by type
   */
  public getAlertsByType(type: string): PerformanceAlert[] {
    return this.alerts.filter(alert => alert.type === type);
  }

  /**
   * Get alerts by level
   */
  public getAlertsByLevel(level: string): PerformanceAlert[] {
    return this.alerts.filter(alert => alert.level === level);
  }

  /**
   * Clear alerts
   */
  public clearAlerts(): void {
    this.alerts = [];
  }

  /**
   * Optimize performance based on current metrics
   */
  public async optimizePerformance(): Promise<void> {
    if (!this.metrics) {
      await this.collectMetrics();
    }

    const optimizations: string[] = [];

    // Memory optimization
    if (this.optimization.enableMemoryOptimization) {
      const memoryUsage = this.metrics!.memoryUsage / this.metrics!.memoryAvailable;
      if (memoryUsage > 0.7) {
        await this.optimizeMemory();
        optimizations.push('memory');
      }
    }

    // CPU optimization
    if (this.optimization.enableCPUOptimization) {
      if (this.metrics!.cpuUsage > 0.6) {
        await this.optimizeCPU();
        optimizations.push('cpu');
      }
    }

    // Network optimization
    if (this.optimization.enableNetworkOptimization) {
      if (this.metrics!.networkLatency > 1000) {
        await this.optimizeNetwork();
        optimizations.push('network');
      }
    }

    // Storage optimization
    if (this.optimization.enableStorageOptimization) {
      const storageUsage = this.metrics!.storageUsed / this.metrics!.storageTotal;
      if (storageUsage > 0.8) {
        await this.optimizeStorage();
        optimizations.push('storage');
      }
    }

    // Battery optimization
    if (this.optimization.enableBatteryOptimization) {
      if (this.metrics!.batteryLevel < 0.3) {
        await this.optimizeBattery();
        optimizations.push('battery');
      }
    }

    if (optimizations.length > 0) {
      this.log(`Applied optimizations: ${optimizations.join(', ')}`);
    }
  }

  /**
   * Optimize memory usage
   */
  private async optimizeMemory(): Promise<void> {
    try {
      await TimeNativeMediaModule.optimizeMemory();
      this.log('Memory optimization applied');
    } catch (error) {
      this.log(`Failed to optimize memory: ${error}`);
    }
  }

  /**
   * Optimize CPU usage
   */
  private async optimizeCPU(): Promise<void> {
    try {
      await TimeNativeMediaModule.optimizeCPU();
      this.log('CPU optimization applied');
    } catch (error) {
      this.log(`Failed to optimize CPU: ${error}`);
    }
  }

  /**
   * Optimize network usage
   */
  private async optimizeNetwork(): Promise<void> {
    try {
      await TimeNativeMediaModule.optimizeNetwork();
      this.log('Network optimization applied');
    } catch (error) {
      this.log(`Failed to optimize network: ${error}`);
    }
  }

  /**
   * Optimize storage usage
   */
  private async optimizeStorage(): Promise<void> {
    try {
      await TimeNativeMediaModule.optimizeStorage();
      this.log('Storage optimization applied');
    } catch (error) {
      this.log(`Failed to optimize storage: ${error}`);
    }
  }

  /**
   * Optimize battery usage
   */
  private async optimizeBattery(): Promise<void> {
    try {
      await TimeNativeMediaModule.optimizeBattery();
      this.log('Battery optimization applied');
    } catch (error) {
      this.log(`Failed to optimize battery: ${error}`);
    }
  }

  /**
   * Get performance recommendations
   */
  public getPerformanceRecommendations(): string[] {
    if (!this.metrics) return [];

    const recommendations: string[] = [];

    // Memory recommendations
    const memoryUsage = this.metrics.memoryUsage / this.metrics.memoryAvailable;
    if (memoryUsage > 0.8) {
      recommendations.push('Consider reducing image quality or clearing caches');
    }

    // CPU recommendations
    if (this.metrics.cpuUsage > 0.7) {
      recommendations.push('Reduce video quality or disable animations');
    }

    // Network recommendations
    if (this.metrics.networkLatency > 1000) {
      recommendations.push('Switch to lower quality or use cached content');
    }

    // Storage recommendations
    const storageUsage = this.metrics.storageUsed / this.metrics.storageTotal;
    if (storageUsage > 0.9) {
      recommendations.push('Clear cache or delete unused files');
    }

    // Battery recommendations
    if (this.metrics.batteryLevel < 0.2) {
      recommendations.push('Enable power saving mode or reduce quality');
    }

    // Performance score recommendations
    if (this.metrics.performanceScore < 60) {
      recommendations.push('Enable all performance optimizations');
    }

    return recommendations;
  }

  /**
   * Get performance score
   */
  public getPerformanceScore(): number {
    if (!this.metrics) return 0;
    return this.metrics.performanceScore;
  }

  /**
   * Check if performance is optimal
   */
  public isPerformanceOptimal(): boolean {
    if (!this.metrics) return false;
    return this.metrics.performanceScore >= 80;
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary(): {
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    recommendations: string[];
    alerts: number;
  } {
    if (!this.metrics) {
      return {
        score: 0,
        status: 'critical',
        recommendations: ['Enable performance monitoring'],
        alerts: 0,
      };
    }

    const score = this.metrics.performanceScore;
    let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    
    if (score >= 90) status = 'excellent';
    else if (score >= 80) status = 'good';
    else if (score >= 60) status = 'fair';
    else if (score >= 40) status = 'poor';
    else status = 'critical';

    return {
      score,
      status,
      recommendations: this.getPerformanceRecommendations(),
      alerts: this.alerts.length,
    };
  }

  /**
   * Log message
   */
  private log(message: string): void {
    console.log(`[PerformanceUtils] ${message}`);
  }
}