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
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  useTimeGrpc,
  useNotes,
  useUsers,
  useMessaging,
  useSearch,
  useDrafts,
  useLists,
  useStarterpacks,
  useFanout
} from '../hooks/useTimeGrpc';

/**
 * Example component demonstrating how to use the Time gRPC service
 */
export const GrpcServiceExample: React.FC = () => {
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('50051');
  const [isConnected, setIsConnected] = useState(false);

  const { isInitialized, isInitializing, error, initialize, healthCheck } = useTimeGrpc({
    autoInitialize: false
  });

  const notes = useNotes();
  const users = useUsers();
  const messaging = useMessaging();
  const search = useSearch();
  const drafts = useDrafts();
  const lists = useLists();
  const starterpacks = useStarterpacks();
  const fanout = useFanout();

  useEffect(() => {
    setIsConnected(isInitialized);
  }, [isInitialized]);

  const handleConnect = async () => {
    try {
      await initialize(host, parseInt(port));
      const healthy = await healthCheck();
      if (healthy) {
        Alert.alert('Success', 'Connected to gRPC server successfully!');
      } else {
        Alert.alert('Warning', 'Connected but health check failed');
      }
    } catch (err) {
      Alert.alert('Error', `Failed to connect: ${err.message}`);
    }
  };

  const handleCreateNote = async () => {
    try {
      const result = await notes.createNote({
        authorId: 'user123',
        text: 'Hello from React Native!',
        visibility: 0, // Public
        contentWarning: 0 // None
      });
      
      if (result.success) {
        Alert.alert('Success', 'Note created successfully!');
      } else {
        Alert.alert('Error', result.errorMessage || 'Failed to create note');
      }
    } catch (err) {
      Alert.alert('Error', `Failed to create note: ${err.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await users.loginUser({
        email: 'test@example.com',
        password: 'password123',
        deviceName: 'React Native App'
      });
      
      if (result.success) {
        Alert.alert('Success', 'Login successful!');
      } else {
        Alert.alert('Error', result.errorMessage || 'Login failed');
      }
    } catch (err) {
      Alert.alert('Error', `Login failed: ${err.message}`);
    }
  };

  const handleSendMessage = async () => {
    try {
      const result = await messaging.sendMessage({
        senderId: 'user123',
        recipientId: 'user456',
        content: 'Hello from gRPC!',
        messageType: 0 // Text
      });
      
      if (result.success) {
        Alert.alert('Success', 'Message sent successfully!');
      } else {
        Alert.alert('Error', result.errorMessage || 'Failed to send message');
      }
    } catch (err) {
      Alert.alert('Error', `Failed to send message: ${err.message}`);
    }
  };

  const handleSearchUsers = async () => {
    try {
      const result = await search.searchUsers({
        query: 'john',
        limit: 10,
        offset: 0
      });
      
      if (result.success) {
        Alert.alert('Success', `Found ${result.data?.users?.length || 0} users`);
      } else {
        Alert.alert('Error', result.errorMessage || 'Search failed');
      }
    } catch (err) {
      Alert.alert('Error', `Search failed: ${err.message}`);
    }
  };

  const handleCreateDraft = async () => {
    try {
      const result = await drafts.createDraft({
        userId: 'user123',
        content: 'This is a draft note',
        title: 'My Draft'
      });
      
      if (result.success) {
        Alert.alert('Success', 'Draft created successfully!');
      } else {
        Alert.alert('Error', result.errorMessage || 'Failed to create draft');
      }
    } catch (err) {
      Alert.alert('Error', `Failed to create draft: ${err.message}`);
    }
  };

  const handleCreateList = async () => {
    try {
      const result = await lists.createList({
        userId: 'user123',
        name: 'My Favorites',
        description: 'A list of my favorite users',
        isPrivate: false
      });
      
      if (result.success) {
        Alert.alert('Success', 'List created successfully!');
      } else {
        Alert.alert('Error', result.errorMessage || 'Failed to create list');
      }
    } catch (err) {
      Alert.alert('Error', `Failed to create list: ${err.message}`);
    }
  };

  const handleCreateStarterpack = async () => {
    try {
      const result = await starterpacks.createStarterpack({
        userId: 'user123',
        name: 'Tech News',
        description: 'A starterpack for tech enthusiasts',
        category: 'Technology',
        isPublic: true
      });
      
      if (result.success) {
        Alert.alert('Success', 'Starterpack created successfully!');
      } else {
        Alert.alert('Error', result.errorMessage || 'Failed to create starterpack');
      }
    } catch (err) {
      Alert.alert('Error', `Failed to create starterpack: ${err.message}`);
    }
  };

  const handleInitiateFanout = async () => {
    try {
      const result = await fanout.initiateFanout({
        noteId: 'note123',
        userId: 'user123'
      });
      
      if (result.success) {
        Alert.alert('Success', 'Fanout initiated successfully!');
      } else {
        Alert.alert('Error', result.errorMessage || 'Failed to initiate fanout');
      }
    } catch (err) {
      Alert.alert('Error', `Failed to initiate fanout: ${err.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Time gRPC Service Example</Text>
      
      {/* Connection Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Status</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.statusText}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
        
        {error && (
          <Text style={styles.errorText}>Error: {error}</Text>
        )}
      </View>

      {/* Connection Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Settings</Text>
        <TextInput
          style={styles.input}
          placeholder="Host"
          value={host}
          onChangeText={setHost}
          editable={!isConnected}
        />
        <TextInput
          style={styles.input}
          placeholder="Port"
          value={port}
          onChangeText={setPort}
          keyboardType="numeric"
          editable={!isConnected}
        />
        <TouchableOpacity
          style={[styles.button, isInitializing && styles.buttonDisabled]}
          onPress={handleConnect}
          disabled={isInitializing}
        >
          {isInitializing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Connect</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Service Examples */}
      {isConnected && (
        <>
          {/* Note Service */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Note Service</Text>
            <TouchableOpacity style={styles.button} onPress={handleCreateNote}>
              <Text style={styles.buttonText}>Create Note</Text>
            </TouchableOpacity>
          </View>

          {/* User Service */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Service</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login User</Text>
            </TouchableOpacity>
          </View>

          {/* Messaging Service */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Messaging Service</Text>
            <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
              <Text style={styles.buttonText}>Send Message</Text>
            </TouchableOpacity>
          </View>

          {/* Search Service */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Service</Text>
            <TouchableOpacity style={styles.button} onPress={handleSearchUsers}>
              <Text style={styles.buttonText}>Search Users</Text>
            </TouchableOpacity>
          </View>

          {/* Drafts Service */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Drafts Service</Text>
            <TouchableOpacity style={styles.button} onPress={handleCreateDraft}>
              <Text style={styles.buttonText}>Create Draft</Text>
            </TouchableOpacity>
          </View>

          {/* Lists Service */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lists Service</Text>
            <TouchableOpacity style={styles.button} onPress={handleCreateList}>
              <Text style={styles.buttonText}>Create List</Text>
            </TouchableOpacity>
          </View>

          {/* Starterpacks Service */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Starterpacks Service</Text>
            <TouchableOpacity style={styles.button} onPress={handleCreateStarterpack}>
              <Text style={styles.buttonText}>Create Starterpack</Text>
            </TouchableOpacity>
          </View>

          {/* Fanout Service */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fanout Service</Text>
            <TouchableOpacity style={styles.button} onPress={handleInitiateFanout}>
              <Text style={styles.buttonText}>Initiate Fanout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GrpcServiceExample;