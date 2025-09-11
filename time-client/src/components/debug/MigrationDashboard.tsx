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
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { useMigrationStatus, useGrpcEnabled } from '#/lib/grpc/migration/useMigrationInitialization';
import { MigrationControls } from '#/lib/grpc/migration/initializeMigration';
import { GrpcFeatureFlagManager } from '#/lib/grpc/migration/FeatureFlags';

/**
 * Migration Dashboard Component
 * Provides debugging and control interface for gRPC migration
 */
export function MigrationDashboard() {
  const migrationStatus = useMigrationStatus();
  const [isExpanded, setIsExpanded] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const featureFlags = GrpcFeatureFlagManager.getInstance();

  useEffect(() => {
    // Load health status
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

  const handlePhaseChange = async (phase: string) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeature = (feature: string, enabled: boolean) => {
    featureFlags.updateFlags({ [feature]: enabled });
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'disabled': return '#ff6b6b';
      case 'testing': return '#ffd93d';
      case 'gradual': return '#6bcf7f';
      case 'full': return '#4d96ff';
      case 'complete': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const getHealthColor = (healthy: boolean) => {
    return healthy ? '#27ae60' : '#e74c3c';
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
        <Text style={styles.title}>gRPC Migration Dashboard</Text>
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

        {/* Phase Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phase Controls</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.testingButton]}
              onPress={() => handlePhaseChange('testing')}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Testing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.gradualButton]}
              onPress={() => handlePhaseChange('gradual')}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Gradual</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.fullButton]}
              onPress={() => handlePhaseChange('full')}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Full</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.completeButton]}
              onPress={() => handlePhaseChange('complete')}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.rollbackButton]}
            onPress={() => handlePhaseChange('rollback')}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Rollback</Text>
          </TouchableOpacity>
        </View>

        {/* Feature Toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feature Toggles</Text>
          {Object.entries(migrationStatus.features).map(([feature, enabled]) => (
            <View key={feature} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{feature}</Text>
              <Switch
                value={enabled as boolean}
                onValueChange={(value) => toggleFeature(feature, value)}
              />
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity
            style={[styles.button, styles.refreshButton]}
            onPress={loadHealthStatus}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Refresh Health</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.reportButton]}
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
    maxHeight: '80%',
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
    backgroundColor: '#ffd93d',
  },
  gradualButton: {
    backgroundColor: '#6bcf7f',
  },
  fullButton: {
    backgroundColor: '#4d96ff',
  },
  completeButton: {
    backgroundColor: '#9b59b6',
  },
  rollbackButton: {
    backgroundColor: '#e74c3c',
    marginTop: 10,
  },
  refreshButton: {
    backgroundColor: '#3498db',
    marginBottom: 10,
  },
  reportButton: {
    backgroundColor: '#95a5a6',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});

export default MigrationDashboard;