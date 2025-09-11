//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

/**
 * gRPC API Index - Complete AT Protocol Replacement
 * This file completely replaces all AT Protocol functionality with gRPC
 */

import { BskyAgent } from '@atproto/api' // Legacy - will be removed // Legacy - will be removed;
import { QueryClient } from '@tanstack/react-query';
import { 
  getMigrationService, 
  getApiMigrationService,
  getMigrationStatus,
  healthCheck,
  generateMigrationReport
} from '../grpc/initializeCompleteMigration';

// Re-export all gRPC API functions
export * from './grpc-api';

// Legacy compatibility - these will be removed in future versions
export { BskyAgent, QueryClient };

/**
 * Main API class that provides a unified interface for all operations
 * This replaces the old AT Protocol based API
 */
export class TimeApi {
  private migrationService: ReturnType<typeof getMigrationService>;
  private apiMigrationService: ReturnType<typeof getApiMigrationService>;
  private agent: BskyAgent;
  private queryClient: QueryClient;

  constructor(agent: BskyAgent, queryClient: QueryClient) {
    this.agent = agent;
    this.queryClient = queryClient;
    this.migrationService = getMigrationService();
    this.apiMigrationService = getApiMigrationService();
  }

  // Post operations
  async createPost(postData: {
    text: string;
    replyTo?: string;
    quote?: string;
    media?: any[];
    labels?: any[];
    threadgate?: any[];
    postgate?: any;
  }) {
    return this.apiMigrationService.createPost(this.agent, this.queryClient, postData);
  }

  async getPost(uri: string) {
    return this.apiMigrationService.getPost(this.agent, this.queryClient, uri);
  }

  async likePost(uri: string) {
    return this.apiMigrationService.likePost(this.agent, this.queryClient, uri);
  }

  async unlikePost(uri: string) {
    return this.apiMigrationService.unlikePost(this.agent, this.queryClient, uri);
  }

  async repostPost(uri: string) {
    return this.apiMigrationService.repostPost(this.agent, this.queryClient, uri);
  }

  async unrepostPost(uri: string) {
    return this.apiMigrationService.unrepostPost(this.agent, this.queryClient, uri);
  }

  async deletePost(uri: string) {
    return this.apiMigrationService.deletePost(this.agent, this.queryClient, uri);
  }

  // User operations
  async loginUser(identifier: string, password: string) {
    return this.apiMigrationService.loginUser(this.agent, this.queryClient, identifier, password);
  }

  async registerUser(userData: {
    email: string;
    password: string;
    handle: string;
    inviteCode?: string;
  }) {
    return this.apiMigrationService.registerUser(this.agent, this.queryClient, userData);
  }

  async getUserProfile(did: string) {
    return this.apiMigrationService.getUserProfile(this.agent, this.queryClient, did);
  }

  // Timeline operations
  async getTimeline(algorithm?: string, limit?: number, cursor?: string) {
    return this.apiMigrationService.getTimeline(this.agent, this.queryClient, algorithm, limit, cursor);
  }

  async getUserTimeline(did: string, limit?: number, cursor?: string) {
    return this.apiMigrationService.getUserTimeline(this.agent, this.queryClient, did, limit, cursor);
  }

  // Media operations
  async uploadBlob(data: Uint8Array, type: string) {
    return this.apiMigrationService.uploadBlob(this.agent, this.queryClient, data, type);
  }

  // Notification operations
  async registerDevice(deviceToken: string, platform: 'ios' | 'android') {
    return this.apiMigrationService.registerDevice(this.agent, this.queryClient, deviceToken, platform);
  }

  async updateDevicePreferences(preferences: any) {
    return this.apiMigrationService.updateDevicePreferences(this.agent, this.queryClient, preferences);
  }

  async unregisterDevice(deviceToken: string) {
    return this.apiMigrationService.unregisterDevice(this.agent, this.queryClient, deviceToken);
  }

  // Migration status and health
  async getMigrationStatus() {
    return getMigrationStatus();
  }

  async healthCheck() {
    return healthCheck();
  }

  async generateMigrationReport() {
    return generateMigrationReport();
  }
}

/**
 * Create a new TimeApi instance
 */
export function createTimeApi(agent: BskyAgent, queryClient: QueryClient): TimeApi {
  return new TimeApi(agent, queryClient);
}

/**
 * Legacy compatibility functions
 * These maintain the same interface as the old AT Protocol API
 */

// Post operations
export async function post(
  agent: BskyAgent,
  queryClient: QueryClient,
  postData: {
    text: string;
    replyTo?: string;
    quote?: string;
    media?: any[];
    labels?: any[];
    threadgate?: any[];
    postgate?: any;
  }
) {
  const api = createTimeApi(agent, queryClient);
  return api.createPost(postData);
}

export async function getPost(
  agent: BskyAgent,
  queryClient: QueryClient,
  uri: string
) {
  const api = createTimeApi(agent, queryClient);
  return api.getPost(uri);
}

export async function likePost(
  agent: BskyAgent,
  queryClient: QueryClient,
  uri: string
) {
  const api = createTimeApi(agent, queryClient);
  return api.likePost(uri);
}

export async function unlikePost(
  agent: BskyAgent,
  queryClient: QueryClient,
  uri: string
) {
  const api = createTimeApi(agent, queryClient);
  return api.unlikePost(uri);
}

export async function repostPost(
  agent: BskyAgent,
  queryClient: QueryClient,
  uri: string
) {
  const api = createTimeApi(agent, queryClient);
  return api.repostPost(uri);
}

export async function unrepostPost(
  agent: BskyAgent,
  queryClient: QueryClient,
  uri: string
) {
  const api = createTimeApi(agent, queryClient);
  return api.unrepostPost(uri);
}

export async function deletePost(
  agent: BskyAgent,
  queryClient: QueryClient,
  uri: string
) {
  const api = createTimeApi(agent, queryClient);
  return api.deletePost(uri);
}

// User operations
export async function loginUser(
  agent: BskyAgent,
  queryClient: QueryClient,
  identifier: string,
  password: string
) {
  const api = createTimeApi(agent, queryClient);
  return api.loginUser(identifier, password);
}

export async function registerUser(
  agent: BskyAgent,
  queryClient: QueryClient,
  userData: {
    email: string;
    password: string;
    handle: string;
    inviteCode?: string;
  }
) {
  const api = createTimeApi(agent, queryClient);
  return api.registerUser(userData);
}

export async function getUserProfile(
  agent: BskyAgent,
  queryClient: QueryClient,
  did: string
) {
  const api = createTimeApi(agent, queryClient);
  return api.getUserProfile(did);
}

// Timeline operations
export async function getTimeline(
  agent: BskyAgent,
  queryClient: QueryClient,
  algorithm?: string,
  limit?: number,
  cursor?: string
) {
  const api = createTimeApi(agent, queryClient);
  return api.getTimeline(algorithm, limit, cursor);
}

export async function getUserTimeline(
  agent: BskyAgent,
  queryClient: QueryClient,
  did: string,
  limit?: number,
  cursor?: string
) {
  const api = createTimeApi(agent, queryClient);
  return api.getUserTimeline(did, limit, cursor);
}

// Media operations
export async function uploadBlob(
  agent: BskyAgent,
  queryClient: QueryClient,
  data: Uint8Array,
  type: string
) {
  const api = createTimeApi(agent, queryClient);
  return api.uploadBlob(data, type);
}

// Notification operations
export async function registerDevice(
  agent: BskyAgent,
  queryClient: QueryClient,
  deviceToken: string,
  platform: 'ios' | 'android'
) {
  const api = createTimeApi(agent, queryClient);
  return api.registerDevice(deviceToken, platform);
}

export async function updateDevicePreferences(
  agent: BskyAgent,
  queryClient: QueryClient,
  preferences: any
) {
  const api = createTimeApi(agent, queryClient);
  return api.updateDevicePreferences(preferences);
}

export async function unregisterDevice(
  agent: BskyAgent,
  queryClient: QueryClient,
  deviceToken: string
) {
  const api = createTimeApi(agent, queryClient);
  return api.unregisterDevice(deviceToken);
}

// Migration status and health
export async function getMigrationStatus() {
  return getMigrationStatus();
}

export async function healthCheck() {
  return healthCheck();
}

export async function generateMigrationReport() {
  return generateMigrationReport();
}

// Default export
export default TimeApi;