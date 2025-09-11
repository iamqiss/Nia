import { useState, useEffect, useCallback, useRef } from 'react';
import { timeService, TimeUpdateEvent, TimeStreamErrorEvent } from './TimeService';
import { logger } from '#/logger';

/**
 * React hook for Time service integration
 * Provides easy access to time-related functionality in React components
 */
export function useTimeService() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('NOT_INITIALIZED');
  const [currentTime, setCurrentTime] = useState<{
    formattedTime: string;
    unixTimestamp: number;
    timezone: string;
    isUtc: boolean;
  } | null>(null);
  const [timeStats, setTimeStats] = useState<{
    serverVersion: string;
    uptimeSeconds: number;
    totalRequests: number;
    averageResponseTimeMs: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for cleanup
  const timeUpdateListenerRef = useRef<(() => void) | null>(null);
  const streamErrorListenerRef = useRef<(() => void) | null>(null);
  const streamCompletedListenerRef = useRef<(() => void) | null>(null);
  const streamStoppedListenerRef = useRef<(() => void) | null>(null);
  
  /**
   * Initialize the time service
   */
  const initialize = useCallback(async (config?: {
    host?: string;
    port?: number;
    useTls?: boolean;
  }) => {
    try {
      setError(null);
      await timeService.initialize(config);
      setIsInitialized(true);
      setConnectionStatus('READY');
      
      // Update connection status
      const status = await timeService.getConnectionStatus();
      setConnectionStatus(status.status);
      
      logger.info('useTimeService: Initialized successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error('useTimeService: Failed to initialize', err);
    }
  }, []);
  
  /**
   * Get current time
   */
  const getCurrentTime = useCallback(async () => {
    try {
      setError(null);
      const result = await timeService.getCurrentTime();
      setCurrentTime(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error('useTimeService: Failed to get current time', err);
      throw err;
    }
  }, []);
  
  /**
   * Get time with timezone
   */
  const getTimeWithTimezone = useCallback(async (timezone: string) => {
    try {
      setError(null);
      const result = await timeService.getTimeWithTimezone(timezone);
      setCurrentTime(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error('useTimeService: Failed to get time with timezone', err);
      throw err;
    }
  }, []);
  
  /**
   * Get time statistics
   */
  const getTimeStats = useCallback(async () => {
    try {
      setError(null);
      const result = await timeService.getTimeStats();
      setTimeStats(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error('useTimeService: Failed to get time stats', err);
      throw err;
    }
  }, []);
  
  /**
   * Start time stream
   */
  const startTimeStream = useCallback(() => {
    try {
      setError(null);
      timeService.startTimeStream();
      setIsStreaming(true);
      logger.info('useTimeService: Started time stream');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error('useTimeService: Failed to start time stream', err);
    }
  }, []);
  
  /**
   * Stop time stream
   */
  const stopTimeStream = useCallback(() => {
    try {
      timeService.stopTimeStream();
      setIsStreaming(false);
      logger.info('useTimeService: Stopped time stream');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error('useTimeService: Failed to stop time stream', err);
    }
  }, []);
  
  /**
   * Update connection status
   */
  const updateConnectionStatus = useCallback(async () => {
    try {
      const status = await timeService.getConnectionStatus();
      setConnectionStatus(status.status);
      setIsStreaming(status.streaming);
    } catch (err) {
      logger.error('useTimeService: Failed to update connection status', err);
    }
  }, []);
  
  /**
   * Shutdown the service
   */
  const shutdown = useCallback(() => {
    try {
      timeService.shutdown();
      setIsInitialized(false);
      setIsStreaming(false);
      setConnectionStatus('NOT_INITIALIZED');
      setCurrentTime(null);
      setTimeStats(null);
      setError(null);
      logger.info('useTimeService: Shutdown complete');
    } catch (err) {
      logger.error('useTimeService: Failed to shutdown', err);
    }
  }, []);
  
  // Set up event listeners
  useEffect(() => {
    if (!isInitialized) return;
    
    // Time update listener
    timeUpdateListenerRef.current = timeService.onTimeUpdate((data: TimeUpdateEvent) => {
      setCurrentTime({
        formattedTime: data.formattedTime,
        unixTimestamp: data.unixTimestamp,
        timezone: data.timezone,
        isUtc: false // Stream updates don't include isUtc
      });
    });
    
    // Stream error listener
    streamErrorListenerRef.current = timeService.onStreamError((data: TimeStreamErrorEvent) => {
      setError(data.error);
      setIsStreaming(false);
    });
    
    // Stream completed listener
    streamCompletedListenerRef.current = timeService.onStreamCompleted(() => {
      setIsStreaming(false);
    });
    
    // Stream stopped listener
    streamStoppedListenerRef.current = timeService.onStreamStopped(() => {
      setIsStreaming(false);
    });
    
    // Cleanup function
    return () => {
      if (timeUpdateListenerRef.current) {
        timeUpdateListenerRef.current();
        timeUpdateListenerRef.current = null;
      }
      if (streamErrorListenerRef.current) {
        streamErrorListenerRef.current();
        streamErrorListenerRef.current = null;
      }
      if (streamCompletedListenerRef.current) {
        streamCompletedListenerRef.current();
        streamCompletedListenerRef.current = null;
      }
      if (streamStoppedListenerRef.current) {
        streamStoppedListenerRef.current();
        streamStoppedListenerRef.current = null;
      }
    };
  }, [isInitialized]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isInitialized) {
        shutdown();
      }
    };
  }, [isInitialized, shutdown]);
  
  return {
    // State
    isInitialized,
    isStreaming,
    connectionStatus,
    currentTime,
    timeStats,
    error,
    
    // Actions
    initialize,
    getCurrentTime,
    getTimeWithTimezone,
    getTimeStats,
    startTimeStream,
    stopTimeStream,
    updateConnectionStatus,
    shutdown,
    
    // Utility
    clearError: () => setError(null),
  };
}

/**
 * Hook for time updates only
 */
export function useTimeUpdates() {
  const [timeUpdate, setTimeUpdate] = useState<TimeUpdateEvent | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const timeUpdateListenerRef = useRef<(() => void) | null>(null);
  const streamErrorListenerRef = useRef<(() => void) | null>(null);
  const streamCompletedListenerRef = useRef<(() => void) | null>(null);
  const streamStoppedListenerRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    // Time update listener
    timeUpdateListenerRef.current = timeService.onTimeUpdate((data: TimeUpdateEvent) => {
      setTimeUpdate(data);
    });
    
    // Stream error listener
    streamErrorListenerRef.current = timeService.onStreamError((data: TimeStreamErrorEvent) => {
      setError(data.error);
      setIsStreaming(false);
    });
    
    // Stream completed listener
    streamCompletedListenerRef.current = timeService.onStreamCompleted(() => {
      setIsStreaming(false);
    });
    
    // Stream stopped listener
    streamStoppedListenerRef.current = timeService.onStreamStopped(() => {
      setIsStreaming(false);
    });
    
    // Cleanup function
    return () => {
      if (timeUpdateListenerRef.current) {
        timeUpdateListenerRef.current();
        timeUpdateListenerRef.current = null;
      }
      if (streamErrorListenerRef.current) {
        streamErrorListenerRef.current();
        streamErrorListenerRef.current = null;
      }
      if (streamCompletedListenerRef.current) {
        streamCompletedListenerRef.current();
        streamCompletedListenerRef.current = null;
      }
      if (streamStoppedListenerRef.current) {
        streamStoppedListenerRef.current();
        streamStoppedListenerRef.current = null;
      }
    };
  }, []);
  
  return {
    timeUpdate,
    isStreaming,
    error,
    clearError: () => setError(null),
  };
}