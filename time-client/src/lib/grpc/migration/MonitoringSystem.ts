//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

/**
 * Metric types
 */
export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  SUMMARY = 'summary',
}

/**
 * Metric definition
 */
export interface MetricDefinition {
  name: string;
  type: MetricType;
  description: string;
  labels?: string[];
  buckets?: number[];
  quantiles?: number[];
}

/**
 * Metric value
 */
export interface MetricValue {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp?: number;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  requestLatency: number;
  requestCount: number;
  errorCount: number;
  successRate: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
  cacheHitRate: number;
  circuitBreakerState: string;
}

/**
 * Alert configuration
 */
export interface AlertConfig {
  name: string;
  condition: (metrics: PerformanceMetrics) => boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  cooldownMs: number;
}

/**
 * Trace context
 */
export interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags?: Record<string, string>;
  logs?: Array<{ timestamp: number; level: string; message: string; fields?: Record<string, any> }>;
}

/**
 * Advanced monitoring and observability system
 */
export class MonitoringSystem {
  private static instance: MonitoringSystem;
  private metrics: Map<string, MetricValue[]> = new Map();
  private alerts: AlertConfig[] = [];
  private traces: TraceContext[] = [];
  private listeners: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private alertListeners: Set<(alert: { config: AlertConfig; metrics: PerformanceMetrics; timestamp: number }) => void> = new Set();
  private isEnabled = true;
  private samplingRate = 0.1; // 10% sampling rate
  private maxTraces = 1000;
  private maxMetrics = 10000;

  static getInstance(): MonitoringSystem {
    if (!MonitoringSystem.instance) {
      MonitoringSystem.instance = new MonitoringSystem();
    }
    return MonitoringSystem.instance;
  }

  private constructor() {
    this.setupDefaultAlerts();
    this.startMetricsCollection();
  }

  /**
   * Record a metric
   */
  recordMetric(metric: MetricValue): void {
    if (!this.isEnabled) return;

    const { name, value, labels = {}, timestamp = Date.now() } = metric;
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricValues = this.metrics.get(name)!;
    metricValues.push({ name, value, labels, timestamp });

    // Keep only recent metrics
    if (metricValues.length > this.maxMetrics) {
      metricValues.splice(0, metricValues.length - this.maxMetrics);
    }

    // Check for alerts
    this.checkAlerts();
  }

  /**
   * Record a counter metric
   */
  recordCounter(name: string, value: number = 1, labels?: Record<string, string>): void {
    this.recordMetric({ name, value, labels });
  }

  /**
   * Record a gauge metric
   */
  recordGauge(name: string, value: number, labels?: Record<string, string>): void {
    this.recordMetric({ name, value, labels });
  }

  /**
   * Record a histogram metric
   */
  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    this.recordMetric({ name, value, labels });
  }

  /**
   * Start a trace
   */
  startTrace(operation: string, parentSpanId?: string): TraceContext {
    const traceId = this.generateId();
    const spanId = this.generateId();
    
    const trace: TraceContext = {
      traceId,
      spanId,
      parentSpanId,
      operation,
      startTime: Date.now(),
      tags: {},
      logs: [],
    };

    if (Math.random() < this.samplingRate) {
      this.traces.push(trace);
      
      // Keep only recent traces
      if (this.traces.length > this.maxTraces) {
        this.traces.splice(0, this.traces.length - this.maxTraces);
      }
    }

    return trace;
  }

  /**
   * Finish a trace
   */
  finishTrace(trace: TraceContext): void {
    trace.endTime = Date.now();
    trace.duration = trace.endTime - trace.startTime;
    
    // Record trace duration as histogram
    this.recordHistogram('trace_duration_ms', trace.duration, {
      operation: trace.operation,
    });
  }

  /**
   * Add log to trace
   */
  addTraceLog(trace: TraceContext, level: string, message: string, fields?: Record<string, any>): void {
    trace.logs?.push({
      timestamp: Date.now(),
      level,
      message,
      fields,
    });
  }

  /**
   * Add tag to trace
   */
  addTraceTag(trace: TraceContext, key: string, value: string): void {
    trace.tags![key] = value;
  }

  /**
   * Record request metrics
   */
  recordRequest(operation: string, duration: number, success: boolean, error?: string): void {
    this.recordCounter('requests_total', 1, { operation, success: success.toString() });
    this.recordHistogram('request_duration_ms', duration, { operation });
    
    if (!success && error) {
      this.recordCounter('request_errors_total', 1, { operation, error });
    }
  }

  /**
   * Record cache metrics
   */
  recordCacheOperation(operation: string, hit: boolean): void {
    this.recordCounter('cache_operations_total', 1, { operation, hit: hit.toString() });
  }

  /**
   * Record circuit breaker metrics
   */
  recordCircuitBreakerState(operation: string, state: string): void {
    this.recordGauge('circuit_breaker_state', state === 'CLOSED' ? 1 : 0, { operation, state });
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Calculate request metrics
    const requestMetrics = this.getMetricsInRange('requests_total', oneMinuteAgo, now);
    const requestCount = requestMetrics.reduce((sum, m) => sum + m.value, 0);
    const errorCount = requestMetrics
      .filter(m => m.labels?.success === 'false')
      .reduce((sum, m) => sum + m.value, 0);
    const successRate = requestCount > 0 ? (requestCount - errorCount) / requestCount : 1;

    // Calculate latency
    const latencyMetrics = this.getMetricsInRange('request_duration_ms', oneMinuteAgo, now);
    const avgLatency = latencyMetrics.length > 0 
      ? latencyMetrics.reduce((sum, m) => sum + m.value, 0) / latencyMetrics.length 
      : 0;

    // Calculate throughput (requests per second)
    const throughput = requestCount / 60;

    // Calculate cache hit rate
    const cacheMetrics = this.getMetricsInRange('cache_operations_total', oneMinuteAgo, now);
    const cacheHits = cacheMetrics
      .filter(m => m.labels?.hit === 'true')
      .reduce((sum, m) => sum + m.value, 0);
    const cacheHitRate = cacheMetrics.length > 0 ? cacheHits / cacheMetrics.length : 0;

    // Get system metrics
    const memoryUsage = this.getSystemMemoryUsage();
    const cpuUsage = this.getSystemCpuUsage();

    // Get circuit breaker state
    const circuitBreakerMetrics = this.getMetricsInRange('circuit_breaker_state', oneMinuteAgo, now);
    const circuitBreakerState = circuitBreakerMetrics.length > 0 
      ? circuitBreakerMetrics[circuitBreakerMetrics.length - 1].labels?.state || 'UNKNOWN'
      : 'UNKNOWN';

    return {
      requestLatency: avgLatency,
      requestCount,
      errorCount,
      successRate,
      throughput,
      memoryUsage,
      cpuUsage,
      cacheHitRate,
      circuitBreakerState,
    };
  }

  /**
   * Get metrics in time range
   */
  private getMetricsInRange(name: string, startTime: number, endTime: number): MetricValue[] {
    const metrics = this.metrics.get(name) || [];
    return metrics.filter(m => m.timestamp! >= startTime && m.timestamp! <= endTime);
  }

  /**
   * Get system memory usage
   */
  private getSystemMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed / 1024 / 1024; // MB
    }
    return 0;
  }

  /**
   * Get system CPU usage
   */
  private getSystemCpuUsage(): number {
    if (typeof process !== 'undefined' && process.cpuUsage) {
      const usage = process.cpuUsage();
      return (usage.user + usage.system) / 1000000; // Convert to seconds
    }
    return 0;
  }

  /**
   * Setup default alerts
   */
  private setupDefaultAlerts(): void {
    this.alerts = [
      {
        name: 'high_error_rate',
        condition: (metrics) => metrics.successRate < 0.95,
        severity: 'high',
        message: 'High error rate detected',
        cooldownMs: 300000, // 5 minutes
      },
      {
        name: 'high_latency',
        condition: (metrics) => metrics.requestLatency > 1000,
        severity: 'medium',
        message: 'High latency detected',
        cooldownMs: 300000,
      },
      {
        name: 'low_throughput',
        condition: (metrics) => metrics.throughput < 10,
        severity: 'low',
        message: 'Low throughput detected',
        cooldownMs: 600000, // 10 minutes
      },
      {
        name: 'high_memory_usage',
        condition: (metrics) => metrics.memoryUsage > 500,
        severity: 'high',
        message: 'High memory usage detected',
        cooldownMs: 300000,
      },
      {
        name: 'circuit_breaker_open',
        condition: (metrics) => metrics.circuitBreakerState === 'OPEN',
        severity: 'critical',
        message: 'Circuit breaker is OPEN',
        cooldownMs: 60000, // 1 minute
      },
    ];
  }

  /**
   * Check for alerts
   */
  private checkAlerts(): void {
    const metrics = this.getPerformanceMetrics();
    
    this.alerts.forEach(alert => {
      if (alert.condition(metrics)) {
        this.triggerAlert(alert, metrics);
      }
    });
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(alert: AlertConfig, metrics: PerformanceMetrics): void {
    const alertKey = `${alert.name}_${Date.now()}`;
    const lastAlert = localStorage.getItem(`alert_${alert.name}`);
    const now = Date.now();
    
    if (lastAlert && now - parseInt(lastAlert) < alert.cooldownMs) {
      return; // Still in cooldown
    }

    localStorage.setItem(`alert_${alert.name}`, now.toString());
    
    this.alertListeners.forEach(listener => {
      try {
        listener({ config: alert, metrics, timestamp: now });
      } catch (error) {
        console.error('Error in alert listener:', error);
      }
    });
  }

  /**
   * Start metrics collection
   */
  private startMetricsCollection(): void {
    setInterval(() => {
      const metrics = this.getPerformanceMetrics();
      this.listeners.forEach(listener => {
        try {
          listener(metrics);
        } catch (error) {
          console.error('Error in metrics listener:', error);
        }
      });
    }, 10000); // Every 10 seconds
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(listener: (metrics: PerformanceMetrics) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Subscribe to alerts
   */
  subscribeToAlerts(listener: (alert: { config: AlertConfig; metrics: PerformanceMetrics; timestamp: number }) => void): () => void {
    this.alertListeners.add(listener);
    return () => this.alertListeners.delete(listener);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, MetricValue[]> {
    const result: Record<string, MetricValue[]> = {};
    this.metrics.forEach((values, name) => {
      result[name] = [...values];
    });
    return result;
  }

  /**
   * Get all traces
   */
  getAllTraces(): TraceContext[] {
    return [...this.traces];
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.metrics.clear();
    this.traces.length = 0;
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Set sampling rate
   */
  setSamplingRate(rate: number): void {
    this.samplingRate = Math.max(0, Math.min(1, rate));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get health status
   */
  getHealthStatus(): {
    healthy: boolean;
    metrics: PerformanceMetrics;
    alerts: Array<{ config: AlertConfig; active: boolean }>;
  } {
    const metrics = this.getPerformanceMetrics();
    const activeAlerts = this.alerts.map(alert => ({
      config: alert,
      active: alert.condition(metrics),
    }));

    const healthy = !activeAlerts.some(alert => 
      alert.active && (alert.config.severity === 'critical' || alert.config.severity === 'high')
    );

    return {
      healthy,
      metrics,
      alerts: activeAlerts,
    };
  }
}

/**
 * Performance monitoring decorator
 */
export function monitorPerformance(operation: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const monitoring = MonitoringSystem.getInstance();

    descriptor.value = async function (...args: any[]) {
      const trace = monitoring.startTrace(operation);
      
      try {
        const result = await method.apply(this, args);
        monitoring.finishTrace(trace);
        monitoring.recordRequest(operation, trace.duration!, true);
        return result;
      } catch (error) {
        monitoring.finishTrace(trace);
        monitoring.recordRequest(operation, trace.duration!, false, error instanceof Error ? error.message : 'Unknown error');
        throw error;
      }
    };
  };
}

export default MonitoringSystem;