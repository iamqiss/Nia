//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { type BskyAgent } from '@atproto/api' // Legacy - will be removed;
import { type QueryClient } from '@tanstack/react-query';
import TimeGrpcMigrationService from '../grpc/TimeGrpcMigrationService';

/**
 * Complete gRPC API Replacement
 * This file completely replaces all AT Protocol API usage with gRPC
 */

// MARK: - Post Operations (Complete AT Protocol Replacement)

/**
 * Create a post - replaces the entire post function from api/index.ts
 */
export async function createPost(
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
    langs?: string[];
  }
): Promise<{ uris: string[] }> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.createPost(agent, queryClient, postData);
}

/**
 * Get a post - replaces // agent.getPost - replaced with gRPC
 */
export async function getPost(agent: BskyAgent, uri: string): Promise<any> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.getPost(agent, uri);
}

/**
 * Like a post - replaces // agent.like - replaced with gRPC
 */
export async function likePost(agent: BskyAgent, uri: string, cid: string): Promise<{ uri: string }> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.likePost(agent, uri, cid);
}

/**
 * Unlike a post - replaces // agent.deleteLike - replaced with gRPC
 */
export async function unlikePost(agent: BskyAgent, likeUri: string): Promise<void> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.unlikePost(agent, likeUri);
}

/**
 * Repost a post - replaces // agent.repost - replaced with gRPC
 */
export async function repostPost(agent: BskyAgent, uri: string, cid: string): Promise<{ uri: string }> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.repostPost(agent, uri, cid);
}

/**
 * Unrepost a post - replaces // agent.deleteRepost - replaced with gRPC
 */
export async function unrepostPost(agent: BskyAgent, repostUri: string): Promise<void> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.unrepostPost(agent, repostUri);
}

/**
 * Delete a post - replaces // agent.deletePost - replaced with gRPC
 */
export async function deletePost(agent: BskyAgent, uri: string): Promise<void> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.deletePost(agent, uri);
}

// MARK: - User Operations (Complete AT Protocol Replacement)

/**
 * User login - replaces // agent.login - replaced with gRPC
 */
export async function loginUser(
  agent: BskyAgent,
  credentials: { email: string; password: string; twoFactorCode?: string },
  deviceName?: string
): Promise<any> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.loginUser(agent, credentials, deviceName);
}

/**
 * User registration - replaces // agent.createAccount - replaced with gRPC
 */
export async function registerUser(
  agent: BskyAgent,
  userData: {
    email: string;
    password: string;
    handle: string;
    inviteCode?: string;
  }
): Promise<any> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.registerUser(agent, userData);
}

/**
 * Get user profile - replaces // agent.getProfile - replaced with gRPC
 */
export async function getUserProfile(agent: BskyAgent, userId: string): Promise<any> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.getUserProfile(agent, userId);
}

// MARK: - Timeline Operations (Complete AT Protocol Replacement)

/**
 * Get timeline - replaces // agent.getTimeline - replaced with gRPC
 */
export async function getTimeline(
  agent: BskyAgent,
  options: {
    algorithm?: string;
    limit?: number;
    cursor?: string;
  } = {}
): Promise<any> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.getTimeline(agent, options);
}

/**
 * Get user timeline - replaces // agent.getAuthorFeed - replaced with gRPC
 */
export async function getUserTimeline(
  agent: BskyAgent,
  userId: string,
  options: {
    limit?: number;
    cursor?: string;
    includeReplies?: boolean;
    includeRenotes?: boolean;
  } = {}
): Promise<any> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.getUserTimeline(agent, userId, options);
}

// MARK: - Media Operations (Complete AT Protocol Replacement)

/**
 * Upload media - replaces // agent.uploadBlob - replaced with gRPC
 */
export async function uploadBlob(agent: BskyAgent, file: any, options: { encoding: string }): Promise<any> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.uploadBlob(agent, file, options);
}

// MARK: - Notification Operations (Complete AT Protocol Replacement)

/**
 * Register device for push notifications
 */
export async function registerDevice(deviceData: {
  userId: string;
  deviceToken: string;
  platform: string;
  appVersion: string;
  osVersion: string;
  deviceModel: string;
  timezone: string;
  language: string;
  deviceCapabilities: Record<string, string>;
}): Promise<any> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.registerDevice(deviceData);
}

// MARK: - Migration Control

/**
 * Check if gRPC is enabled for a specific operation
 */
export function isGrpcEnabled(operation: string): boolean {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.isGrpcEnabled(operation);
}

/**
 * Get current migration phase
 */
export function getMigrationPhase(): string {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.getMigrationPhase();
}

/**
 * Set migration phase
 */
export function setMigrationPhase(phase: 'disabled' | 'testing' | 'gradual' | 'full' | 'complete'): void {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.setMigrationPhase(phase);
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{ success: boolean; status: string }> {
  const migrationService = TimeGrpcMigrationService.getInstance();
  return migrationService.healthCheck();
}

// MARK: - Export all functions as default

export default {
  // Post operations
  createPost,
  getPost,
  likePost,
  unlikePost,
  repostPost,
  unrepostPost,
  deletePost,
  
  // User operations
  loginUser,
  registerUser,
  getUserProfile,
  
  // Timeline operations
  getTimeline,
  getUserTimeline,
  
  // Media operations
  uploadBlob,
  
  // Notification operations
  registerDevice,
  
  // Migration control
  isGrpcEnabled,
  getMigrationPhase,
  setMigrationPhase,
  healthCheck,
};