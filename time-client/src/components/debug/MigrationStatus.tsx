//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useMigrationStatus, useGrpcEnabled } from '#/lib/grpc/migration/useMigrationInitialization';
import { MigrationControls } from '#/lib/grpc/migration/initializeMigration';

/**
 * Migration Status Component
 * Shows current migration status and allows basic controls
 */
export function MigrationStatus() {
  const migrationStatus = useMigrationStatus();
  const [isExpanded, setIsExpanded] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  useEffect(() => {
    loadHealthStatus();
  }, []);

  const loadHealthStatus = async () => {
    try {
      const health = await MigrationControls.healthCheck();
      setHealthStatus(health);
    } catch (error) {
      console.error('Failed to load health status:', error);
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'disabled': return '#e74c3c';
      case 'testing': return '#f39c12';
      case 'gradual': return '#27ae60';
      case 'full': return '#3498db';
      case 'complete': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const getHealthColor = (healthy: boolean) => {
    return healthy ? '#27ae60' : '#e74c3c';
  };

  const handlePhaseChange = async (phase: string) => {
    try {
      switch (phase) {
        case 'testing':
          await MigrationControls.startTesting();
          break;
        case 'gradual':
          await MigrationControls.startGradual(25);
          break;
        case 'full':
          await MigrationControls.startFull();
          break;
        case 'complete':
          await MigrationControls.complete();
          break;
        case 'rollback':
          await MigrationControls.rollback();
          break;
      }
      await loadHealthStatus();
    } catch (error) {
      Alert.alert('Error', `Failed to change phase: ${error}`);
    }
  };

  if (!isExpanded) {
    return (
      <TouchableOpacity
        style={[styles.collapsed, { backgroundColor: getPhaseColor(migrationStatus.phase) }]}
        onPress={() => setIsExpanded(true)}
      >
        <Text style={styles.collapsedText}>
          Migration: {migrationStatus.phase.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Migration Status</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsExpanded(false)}
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Current Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.label}>Phase:</Text>
            <Text style={[styles.value, { color: getPhaseColor(migrationStatus.phase) }]}>
              {migrationStatus.phase.toUpperCase()}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.label}>A/B Test Group:</Text>
            <Text style={styles.value}>
              {migrationStatus.abTestGroup || 'None'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.label}>A/B Test %:</Text>
            <Text style={styles.value}>
              {migrationStatus.abTestPercentage || 0}%
            </Text>
          </View>
        </View>

        {/* Health Status */}
        {healthStatus && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Status</Text>
            <View style={styles.statusRow}>
              <Text style={styles.label}>gRPC Service:</Text>
              <Text style={[styles.value, { color: getHealthColor(healthStatus.grpcService) }]}>
                {healthStatus.grpcService ? 'Healthy' : 'Unhealthy'}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.label}>Feature Flags:</Text>
              <Text style={[styles.value, { color: getHealthColor(healthStatus.featureFlags) }]}>
                {healthStatus.featureFlags ? 'Healthy' : 'Unhealthy'}
              </Text>
            </View>
            {healthStatus.errors.length > 0 && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Errors:</Text>
                {healthStatus.errors.map((error: string, index: number) => (
                  <Text key={index} style={styles.errorText}>• {error}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Feature Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feature Status</Text>
          {Object.entries(migrationStatus.features).map(([feature, enabled]) => (
            <View key={feature} style={styles.featureRow}>
              <Text style={styles.featureLabel}>{feature}</Text>
              <View style={[styles.statusIndicator, { backgroundColor: enabled ? '#27ae60' : '#e74c3c' }]} />
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.testingButton]}
              onPress={() => handlePhaseChange('testing')}
            >
              <Text style={styles.buttonText}>Testing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.gradualButton]}
              onPress={() => handlePhaseChange('gradual')}
            >
              <Text style={styles.buttonText}>Gradual</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.fullButton]}
              onPress={() => handlePhaseChange('full')}
            >
              <Text style={styles.buttonText}>Full</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rollbackButton]}
              onPress={() => handlePhaseChange('rollback')}
            >
              <Text style={styles.buttonText}>Rollback</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.refreshButton]}
            onPress={loadHealthStatus}
          >
            <Text style={styles.buttonText}>Refresh Health</Text>
          </TouchableOpacity>
        </View>

        {/* Debug Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Debug Info</Text>
          <TouchableOpacity
            style={[styles.button, styles.debugButton]}
            onPress={() => {
              const report = MigrationControls.generateReport();
              Alert.alert('Migration Report', JSON.stringify(report, null, 2));
            }}
          >
            <Text style={styles.buttonText}>Generate Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * Compact migration status indicator
 */
export function MigrationStatusIndicator() {
  const migrationStatus = useMigrationStatus();
  const createNoteEnabled = useGrpcEnabled('createNote');
  const getNoteEnabled = useGrpcEnabled('getNote');
  const likeNoteEnabled = useGrpcEnabled('likeNote');

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'disabled': return '#e74c3c';
      case 'testing': return '#f39c12';
      case 'gradual': return '#27ae60';
      case 'full': return '#3498db';
      case 'complete': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  return (
    <View style={[styles.indicator, { backgroundColor: getPhaseColor(migrationStatus.phase) }]}>
      <Text style={styles.indicatorText}>
        {migrationStatus.phase.toUpperCase()}
      </Text>
      <View style={styles.featureIndicators}>
        {createNoteEnabled && <View style={[styles.featureDot, { backgroundColor: '#27ae60' }]} />}
        {getNoteEnabled && <View style={[styles.featureDot, { backgroundColor: '#27ae60' }]} />}
        {likeNoteEnabled && <View style={[styles.featureDot, { backgroundColor: '#27ae60' }]} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '70%',
    zIndex: 1000,
  },
  collapsed: {
    position: 'absolute',
    top: 50,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 1000,
  },
  collapsedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  content: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffe6e6',
    borderRadius: 5,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  featureLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  testingButton: {
    backgroundColor: '#f39c12',
  },
  gradualButton: {
    backgroundColor: '#27ae60',
  },
  fullButton: {
    backgroundColor: '#3498db',
  },
  rollbackButton: {
    backgroundColor: '#e74c3c',
  },
  refreshButton: {
    backgroundColor: '#95a5a6',
    marginTop: 10,
  },
  debugButton: {
    backgroundColor: '#9b59b6',
  },
  indicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  indicatorText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 4,
  },
  featureIndicators: {
    flexDirection: 'row',
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 2,
  },
});

export default MigrationStatus;