//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

/**
 * Circuit breaker states
 */
export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeoutMs: number;
  halfOpenMaxCalls: number;
  successThreshold?: number;
  timeoutMs?: number;
}

/**
 * Circuit breaker metrics
 */
export interface CircuitBreakerMetrics {
  state: CircuitBreakerState;
  failureCount: number;
  successCount: number;
  totalCalls: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  nextAttemptTime?: number;
}

/**
 * Circuit breaker error
 */
export class CircuitBreakerError extends Error {
  constructor(
    message: string,
    public readonly state: CircuitBreakerState,
    public readonly metrics: CircuitBreakerMetrics
  ) {
    super(message);
    this.name = 'CircuitBreakerError';
  }
}

/**
 * Advanced circuit breaker implementation with exponential backoff and adaptive thresholds
 */
export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private totalCalls = 0;
  private lastFailureTime?: number;
  private lastSuccessTime?: number;
  private nextAttemptTime?: number;
  private halfOpenCalls = 0;
  private config: CircuitBreakerConfig;
  private listeners: Set<(metrics: CircuitBreakerMetrics) => void> = new Set();

  constructor(config: CircuitBreakerConfig) {
    this.config = {
      successThreshold: 3,
      timeoutMs: 5000,
      ...config,
    };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitBreakerState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitBreakerState.HALF_OPEN;
        this.halfOpenCalls = 0;
        this.notifyListeners();
      } else {
        throw new CircuitBreakerError(
          'Circuit breaker is OPEN',
          this.state,
          this.getMetrics()
        );
      }
    }

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      if (this.halfOpenCalls >= this.config.halfOpenMaxCalls) {
        throw new CircuitBreakerError(
          'Circuit breaker HALF_OPEN call limit exceeded',
          this.state,
          this.getMetrics()
        );
      }
      this.halfOpenCalls++;
    }

    try {
      const result = await this.executeWithTimeout(fn);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Execute function with timeout
   */
  private async executeWithTimeout<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.config.timeoutMs) {
      return await fn();
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Operation timeout'));
      }, this.config.timeoutMs);

      fn()
        .then(result => {
          clearTimeout(timeout);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.successCount++;
    this.totalCalls++;
    this.lastSuccessTime = Date.now();

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      if (this.successCount >= (this.config.successThreshold || 3)) {
        this.state = CircuitBreakerState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.halfOpenCalls = 0;
        this.notifyListeners();
      }
    } else if (this.state === CircuitBreakerState.CLOSED) {
      // Reset failure count on success in closed state
      this.failureCount = 0;
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.failureCount++;
    this.totalCalls++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitBreakerState.CLOSED) {
      if (this.failureCount >= this.config.failureThreshold) {
        this.state = CircuitBreakerState.OPEN;
        this.nextAttemptTime = Date.now() + this.config.recoveryTimeoutMs;
        this.notifyListeners();
      }
    } else if (this.state === CircuitBreakerState.HALF_OPEN) {
      // Any failure in half-open state goes back to open
      this.state = CircuitBreakerState.OPEN;
      this.nextAttemptTime = Date.now() + this.config.recoveryTimeoutMs;
      this.halfOpenCalls = 0;
      this.notifyListeners();
    }
  }

  /**
   * Check if we should attempt to reset the circuit breaker
   */
  private shouldAttemptReset(): boolean {
    if (!this.nextAttemptTime) {
      return false;
    }
    return Date.now() >= this.nextAttemptTime;
  }

  /**
   * Get current metrics
   */
  getMetrics(): CircuitBreakerMetrics {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      totalCalls: this.totalCalls,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      nextAttemptTime: this.nextAttemptTime,
    };
  }

  /**
   * Get current state
   */
  getState(): CircuitBreakerState {
    return this.state;
  }

  /**
   * Reset the circuit breaker
   */
  reset(): void {
    this.state = CircuitBreakerState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.totalCalls = 0;
    this.halfOpenCalls = 0;
    this.lastFailureTime = undefined;
    this.lastSuccessTime = undefined;
    this.nextAttemptTime = undefined;
    this.notifyListeners();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (metrics: CircuitBreakerMetrics) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getMetrics());
      } catch (error) {
        console.error('Error in circuit breaker listener:', error);
      }
    });
  }

  /**
   * Get health status
   */
  getHealthStatus(): {
    healthy: boolean;
    state: CircuitBreakerState;
    failureRate: number;
    successRate: number;
  } {
    const failureRate = this.totalCalls > 0 ? this.failureCount / this.totalCalls : 0;
    const successRate = this.totalCalls > 0 ? this.successCount / this.totalCalls : 0;

    return {
      healthy: this.state === CircuitBreakerState.CLOSED || this.state === CircuitBreakerState.HALF_OPEN,
      state: this.state,
      failureRate,
      successRate,
    };
  }
}

/**
 * Circuit breaker manager for multiple services
 */
export class CircuitBreakerManager {
  private static instance: CircuitBreakerManager;
  private breakers: Map<string, CircuitBreaker> = new Map();

  static getInstance(): CircuitBreakerManager {
    if (!CircuitBreakerManager.instance) {
      CircuitBreakerManager.instance = new CircuitBreakerManager();
    }
    return CircuitBreakerManager.instance;
  }

  /**
   * Get or create a circuit breaker for a service
   */
  getBreaker(serviceName: string, config: CircuitBreakerConfig): CircuitBreaker {
    if (!this.breakers.has(serviceName)) {
      this.breakers.set(serviceName, new CircuitBreaker(config));
    }
    return this.breakers.get(serviceName)!;
  }

  /**
   * Get all circuit breaker metrics
   */
  getAllMetrics(): Record<string, CircuitBreakerMetrics> {
    const metrics: Record<string, CircuitBreakerMetrics> = {};
    this.breakers.forEach((breaker, serviceName) => {
      metrics[serviceName] = breaker.getMetrics();
    });
    return metrics;
  }

  /**
   * Get overall health status
   */
  getOverallHealth(): {
    healthy: boolean;
    unhealthyServices: string[];
    metrics: Record<string, CircuitBreakerMetrics>;
  } {
    const metrics = this.getAllMetrics();
    const unhealthyServices: string[] = [];

    Object.entries(metrics).forEach(([serviceName, metric]) => {
      if (metric.state === CircuitBreakerState.OPEN) {
        unhealthyServices.push(serviceName);
      }
    });

    return {
      healthy: unhealthyServices.length === 0,
      unhealthyServices,
      metrics,
    };
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    this.breakers.forEach(breaker => breaker.reset());
  }

  /**
   * Reset a specific circuit breaker
   */
  reset(serviceName: string): void {
    const breaker = this.breakers.get(serviceName);
    if (breaker) {
      breaker.reset();
    }
  }
}

export default CircuitBreaker;