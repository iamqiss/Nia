import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTimeService } from '#/lib/grpc/useTimeService';
import { TimeDisplay } from '#/components/TimeDisplay';

/**
 * Main Time screen demonstrating gRPC integration
 * Shows how to integrate the Time service with the existing app structure
 */
export function TimeScreen() {
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
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Initialize service on mount
  useEffect(() => {
    const initService = async () => {
      try {
        setIsLoading(true);
        await initialize({
          host: 'localhost', // Change to your server host
          port: 50051,
          useTls: false
        });
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Failed to initialize Time service:', err);
        Alert.alert('Error', 'Failed to initialize Time service. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initService();
  }, [initialize]);
  
  // Handle refresh
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await updateConnectionStatus();
      if (isInitialized) {
        await getCurrentTime();
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error('Failed to refresh:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle get current time
  const handleGetCurrentTime = async () => {
    try {
      setIsLoading(true);
      await getCurrentTime();
      setLastUpdate(new Date());
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
      setLastUpdate(new Date());
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
      setLastUpdate(new Date());
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
      setLastUpdate(new Date());
    } catch (err) {
      Alert.alert('Error', 'Failed to start time stream');
    }
  };
  
  // Handle stop stream
  const handleStopStream = () => {
    try {
      stopTimeStream();
      setLastUpdate(new Date());
    } catch (err) {
      Alert.alert('Error', 'Failed to stop time stream');
    }
  };
  
  // Handle shutdown
  const handleShutdown = () => {
    try {
      shutdown();
      setLastUpdate(null);
    } catch (err) {
      Alert.alert('Error', 'Failed to shutdown service');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Time gRPC Service</Text>
        <Text style={styles.subtitle}>Real-time time synchronization</Text>
      </View>
      
      {/* Status Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Service Status</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Initialized:</Text>
          <Text style={[styles.statusValue, { color: isInitialized ? '#4CAF50' : '#F44336' }]}>
            {isInitialized ? 'Yes' : 'No'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Connection:</Text>
          <Text style={styles.statusValue}>{connectionStatus}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Streaming:</Text>
          <Text style={[styles.statusValue, { color: isStreaming ? '#4CAF50' : '#F44336' }]}>
            {isStreaming ? 'Active' : 'Inactive'}
          </Text>
        </View>
        {lastUpdate && (
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Last Update:</Text>
            <Text style={styles.statusValue}>{lastUpdate.toLocaleTimeString()}</Text>
          </View>
        )}
      </View>
      
      {/* Error Display */}
      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Current Time Display */}
      {currentTime && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Time</Text>
          <Text style={styles.timeValue}>{currentTime.formattedTime}</Text>
          <Text style={styles.timezoneValue}>{currentTime.timezone}</Text>
          <Text style={styles.timestampValue}>
            Unix: {currentTime.unixTimestamp}
          </Text>
        </View>
      )}
      
      {/* Time Stats Display */}
      {timeStats && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Server Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Version</Text>
              <Text style={styles.statValue}>{timeStats.serverVersion}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Uptime</Text>
              <Text style={styles.statValue}>{Math.floor(timeStats.uptimeSeconds / 3600)}h</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Requests</Text>
              <Text style={styles.statValue}>{timeStats.totalRequests}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Avg Response</Text>
              <Text style={styles.statValue}>{timeStats.averageResponseTimeMs.toFixed(1)}ms</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* Controls */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Controls</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={handleRefresh}
            disabled={isLoading}
            style={[styles.button, styles.primaryButton, isLoading && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleGetCurrentTime}
            disabled={!isInitialized || isLoading}
            style={[styles.button, styles.secondaryButton, (!isInitialized || isLoading) && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Get Time</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={handleGetTimeWithTimezone}
            disabled={!isInitialized || isLoading}
            style={[styles.button, styles.secondaryButton, (!isInitialized || isLoading) && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>NYC Time</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleGetTimeStats}
            disabled={!isInitialized || isLoading}
            style={[styles.button, styles.secondaryButton, (!isInitialized || isLoading) && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Stats</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={handleStartStream}
            disabled={!isInitialized || isStreaming}
            style={[styles.button, styles.successButton, (!isInitialized || isStreaming) && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Start Stream</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleStopStream}
            disabled={!isInitialized || !isStreaming}
            style={[styles.button, styles.dangerButton, (!isInitialized || !isStreaming) && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Stop Stream</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          onPress={handleShutdown}
          disabled={!isInitialized}
          style={[styles.button, styles.warningButton, !isInitialized && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Shutdown Service</Text>
        </TouchableOpacity>
      </View>
      
      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  card: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: '#ffebee',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#c62828',
    marginBottom: 15,
  },
  clearButton: {
    backgroundColor: '#c62828',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  timeValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 10,
  },
  timezoneValue: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  timestampValue: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    marginBottom: 15,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: '#607D8B',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  warningButton: {
    backgroundColor: '#FF9800',
  },
  loadingOverlay: {
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