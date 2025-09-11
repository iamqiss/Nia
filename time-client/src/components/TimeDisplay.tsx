import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTimeService } from '#/lib/grpc/useTimeService';
import { logger } from '#/logger';

/**
 * Example component demonstrating Time gRPC service usage
 * Shows real-time time updates and service controls
 */
export function TimeDisplay() {
  const {
    isInitialized,
    isStreaming,
    connectionStatus,
    currentTime,
    timeStats,
    error,
    initialize,
    getCurrentTime,
    getTimeWithTimezone,
    getTimeStats,
    startTimeStream,
    stopTimeStream,
    updateConnectionStatus,
    shutdown,
    clearError,
  } = useTimeService();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize on mount
  useEffect(() => {
    const initService = async () => {
      try {
        setIsLoading(true);
        await initialize({
          host: 'localhost', // Change to your server host
          port: 50051,
          useTls: false
        });
      } catch (err) {
        logger.error('Failed to initialize Time service', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initService();
  }, [initialize]);
  
  // Handle get current time
  const handleGetCurrentTime = async () => {
    try {
      setIsLoading(true);
      await getCurrentTime();
    } catch (err) {
      Alert.alert('Error', 'Failed to get current time');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle get time with timezone
  const handleGetTimeWithTimezone = async () => {
    try {
      setIsLoading(true);
      await getTimeWithTimezone('America/New_York');
    } catch (err) {
      Alert.alert('Error', 'Failed to get time with timezone');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle get time stats
  const handleGetTimeStats = async () => {
    try {
      setIsLoading(true);
      await getTimeStats();
    } catch (err) {
      Alert.alert('Error', 'Failed to get time stats');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle start stream
  const handleStartStream = () => {
    try {
      startTimeStream();
    } catch (err) {
      Alert.alert('Error', 'Failed to start time stream');
    }
  };
  
  // Handle stop stream
  const handleStopStream = () => {
    try {
      stopTimeStream();
    } catch (err) {
      Alert.alert('Error', 'Failed to stop time stream');
    }
  };
  
  // Handle update connection status
  const handleUpdateConnectionStatus = async () => {
    try {
      await updateConnectionStatus();
    } catch (err) {
      Alert.alert('Error', 'Failed to update connection status');
    }
  };
  
  // Handle shutdown
  const handleShutdown = () => {
    try {
      shutdown();
    } catch (err) {
      Alert.alert('Error', 'Failed to shutdown service');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time gRPC Service</Text>
      
      {/* Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[styles.statusValue, { color: isInitialized ? 'green' : 'red' }]}>
          {isInitialized ? 'Initialized' : 'Not Initialized'}
        </Text>
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Connection:</Text>
        <Text style={styles.statusValue}>{connectionStatus}</Text>
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Streaming:</Text>
        <Text style={[styles.statusValue, { color: isStreaming ? 'green' : 'red' }]}>
          {isStreaming ? 'Active' : 'Inactive'}
        </Text>
      </View>
      
      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity onPress={clearError} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Current Time Display */}
      {currentTime && (
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Current Time:</Text>
          <Text style={styles.timeValue}>{currentTime.formattedTime}</Text>
          <Text style={styles.timezoneValue}>{currentTime.timezone}</Text>
          <Text style={styles.timestampValue}>
            Unix: {currentTime.unixTimestamp}
          </Text>
        </View>
      )}
      
      {/* Time Stats Display */}
      {timeStats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsLabel}>Server Stats:</Text>
          <Text style={styles.statsValue}>Version: {timeStats.serverVersion}</Text>
          <Text style={styles.statsValue}>Uptime: {timeStats.uptimeSeconds}s</Text>
          <Text style={styles.statsValue}>Requests: {timeStats.totalRequests}</Text>
          <Text style={styles.statsValue}>
            Avg Response: {timeStats.averageResponseTimeMs.toFixed(2)}ms
          </Text>
        </View>
      )}
      
      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={handleGetCurrentTime}
          disabled={!isInitialized || isLoading}
          style={[styles.button, (!isInitialized || isLoading) && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Get Current Time</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleGetTimeWithTimezone}
          disabled={!isInitialized || isLoading}
          style={[styles.button, (!isInitialized || isLoading) && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Get Time (NYC)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleGetTimeStats}
          disabled={!isInitialized || isLoading}
          style={[styles.button, (!isInitialized || isLoading) && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Get Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleUpdateConnectionStatus}
          disabled={!isInitialized || isLoading}
          style={[styles.button, (!isInitialized || isLoading) && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Update Status</Text>
        </TouchableOpacity>
        
        <View style={styles.streamControls}>
          <TouchableOpacity
            onPress={handleStartStream}
            disabled={!isInitialized || isStreaming}
            style={[
              styles.button,
              styles.startButton,
              (!isInitialized || isStreaming) && styles.buttonDisabled
            ]}
          >
            <Text style={styles.buttonText}>Start Stream</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleStopStream}
            disabled={!isInitialized || !isStreaming}
            style={[
              styles.button,
              styles.stopButton,
              (!isInitialized || !isStreaming) && styles.buttonDisabled
            ]}
          >
            <Text style={styles.buttonText}>Stop Stream</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          onPress={handleShutdown}
          disabled={!isInitialized}
          style={[styles.button, styles.shutdownButton, !isInitialized && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Shutdown</Text>
        </TouchableOpacity>
      </View>
      
      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  statusValue: {
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#c62828',
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#c62828',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
  },
  timeContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 5,
  },
  timezoneValue: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  timestampValue: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  statsValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  controlsContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  streamControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  startButton: {
    flex: 0.48,
    backgroundColor: '#4caf50',
  },
  stopButton: {
    flex: 0.48,
    backgroundColor: '#f44336',
  },
  shutdownButton: {
    backgroundColor: '#ff9800',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});