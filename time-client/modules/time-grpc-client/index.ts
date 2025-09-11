//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { NativeModules, Platform } from 'react-native';

const { TimeGrpcClient } = NativeModules;

export interface GrpcClientConfig {
  host: string;
  port: number;
  useTLS?: boolean;
  timeout?: number;
}

export interface GrpcResponse {
  success: boolean;
  errorMessage?: string;
}

export interface NoteResponse extends GrpcResponse {
  note: any;
  userInteraction?: any;
  threadNotes?: any[];
}

export interface UserResponse extends GrpcResponse {
  status: any;
  user?: any;
  session?: any;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  requires2fa?: boolean;
  verificationToken?: string;
}

export interface LikeResponse extends GrpcResponse {
  newLikeCount: number;
}

export interface RenoteResponse extends GrpcResponse {
  renoteNote: any;
}

export class TimeGrpcClientModule {
  /**
   * Initialize the gRPC client
   */
  static async initializeClient(host: string, port: number): Promise<GrpcResponse> {
    if (Platform.OS === 'ios') {
      return TimeGrpcClient.initializeClient(host, port);
    } else {
      return TimeGrpcClient.initializeClient(host, port);
    }
  }

  /**
   * Create a note
   */
  static async createNote(request: {
    authorId: string;
    text: string;
    visibility: number;
    contentWarning?: number;
    mediaIds?: string[];
    replyToNoteId?: string;
    renotedNoteId?: string;
    isQuoteRenote?: boolean;
    clientName?: string;
  }): Promise<NoteResponse> {
    return TimeGrpcClient.createNote(request);
  }

  /**
   * Get a note
   */
  static async getNote(request: {
    noteId: string;
    requestingUserId: string;
    includeThread?: boolean;
  }): Promise<NoteResponse> {
    return TimeGrpcClient.getNote(request);
  }

  /**
   * Delete a note
   */
  static async deleteNote(request: {
    noteId: string;
    userId: string;
  }): Promise<GrpcResponse> {
    return TimeGrpcClient.deleteNote(request);
  }

  /**
   * Like a note
   */
  static async likeNote(request: {
    noteId: string;
    userId: string;
    like: boolean;
  }): Promise<LikeResponse> {
    return TimeGrpcClient.likeNote(request);
  }

  /**
   * Renote a note
   */
  static async renoteNote(request: {
    noteId: string;
    userId: string;
    isQuoteRenote?: boolean;
    quoteText?: string;
  }): Promise<RenoteResponse> {
    return TimeGrpcClient.renoteNote(request);
  }

  /**
   * Login user
   */
  static async loginUser(request: {
    credentials: {
      email: string;
      password: string;
      twoFactorCode?: string;
    };
    deviceName?: string;
  }): Promise<UserResponse> {
    return TimeGrpcClient.loginUser(request);
  }

  /**
   * Register user
   */
  static async registerUser(request: {
    username: string;
    email: string;
    password: string;
    displayName: string;
    invitationCode?: string;
    acceptTerms?: boolean;
    acceptPrivacy?: boolean;
  }): Promise<UserResponse> {
    return TimeGrpcClient.registerUser(request);
  }

  /**
   * Get user profile
   */
  static async getUserProfile(request: {
    userId: string;
  }): Promise<UserResponse> {
    return TimeGrpcClient.getUserProfile(request);
  }

  /**
   * Health check
   */
  static async healthCheck(): Promise<GrpcResponse> {
    return TimeGrpcClient.healthCheck();
  }
}

export default TimeGrpcClientModule;