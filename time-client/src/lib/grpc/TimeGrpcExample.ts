//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import TimeGrpcService, {
  GrpcConfig,
  CreateNoteRequest,
  GetNoteRequest,
  LoginUserRequest,
  RegisterUserRequest,
  NoteVisibility,
  ContentWarning,
  AuthCredentials,
} from './TimeGrpcService';

/**
 * Example usage of Time gRPC Service
 * Demonstrates how to integrate gRPC functionality into the app
 */
export class TimeGrpcExample {
  private grpcService: TimeGrpcService;
  
  constructor() {
    this.grpcService = TimeGrpcService.getInstance();
  }
  
  /**
   * Initialize the gRPC service
   */
  async initialize(): Promise<void> {
    const config: GrpcConfig = {
      host: 'api.timesocial.com', // Replace with actual server host
      port: 443, // Replace with actual server port
      useTLS: true,
      timeout: 30,
    };
    
    try {
      await this.grpcService.initialize(config);
      console.log('✅ gRPC service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize gRPC service:', error);
      throw error;
    }
  }
  
  /**
   * Example: Create a new note
   */
  async createNoteExample(): Promise<void> {
    try {
      const request: CreateNoteRequest = {
        authorId: 'user123',
        text: 'Hello from gRPC! 🚀',
        visibility: NoteVisibility.PUBLIC,
        contentWarning: ContentWarning.NONE,
        mediaIds: [],
        clientName: 'Time Social App',
      };
      
      const response = await this.grpcService.createNote(request);
      
      if (response.success) {
        console.log('✅ Note created successfully:', response.note);
      } else {
        console.error('❌ Failed to create note:', response.errorMessage);
      }
    } catch (error) {
      console.error('❌ Error creating note:', error);
    }
  }
  
  /**
   * Example: Get a note by ID
   */
  async getNoteExample(noteId: string): Promise<void> {
    try {
      const request: GetNoteRequest = {
        noteId,
        requestingUserId: 'user123',
        includeThread: true,
      };
      
      const response = await this.grpcService.getNote(request);
      
      if (response.success) {
        console.log('✅ Note retrieved successfully:', response.note);
        console.log('📝 Thread notes:', response.threadNotes);
        console.log('👤 User interaction:', response.userInteraction);
      } else {
        console.error('❌ Failed to get note:', response.errorMessage);
      }
    } catch (error) {
      console.error('❌ Error getting note:', error);
    }
  }
  
  /**
   * Example: User login
   */
  async loginExample(): Promise<void> {
    try {
      const request: LoginUserRequest = {
        credentials: {
          email: 'user@example.com',
          password: 'password123',
        },
        deviceName: 'iPhone 15 Pro',
      };
      
      const response = await this.grpcService.loginUser(request);
      
      if (response.status.code === 1) { // StatusCode.OK
        console.log('✅ Login successful:', response.accessToken);
        console.log('👤 User profile:', response.user);
        console.log('📱 Session:', response.session);
      } else {
        console.error('❌ Login failed:', response.status.message);
      }
    } catch (error) {
      console.error('❌ Error during login:', error);
    }
  }
  
  /**
   * Example: User registration
   */
  async registerExample(): Promise<void> {
    try {
      const request: RegisterUserRequest = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'securepassword123',
        displayName: 'New User',
        acceptTerms: true,
        acceptPrivacy: true,
      };
      
      const response = await this.grpcService.registerUser(request);
      
      if (response.status.code === 1) { // StatusCode.OK
        console.log('✅ Registration successful:', response.user);
        console.log('🔐 Verification token:', response.verificationToken);
      } else {
        console.error('❌ Registration failed:', response.status.message);
      }
    } catch (error) {
      console.error('❌ Error during registration:', error);
    }
  }
  
  /**
   * Example: Health check
   */
  async healthCheckExample(): Promise<void> {
    try {
      const response = await this.grpcService.healthCheck();
      
      if (response.success) {
        console.log('✅ Service is healthy:', response.status);
      } else {
        console.error('❌ Service is unhealthy:', response.status);
      }
    } catch (error) {
      console.error('❌ Error during health check:', error);
    }
  }
  
  /**
   * Example: Complete workflow
   */
  async runCompleteExample(): Promise<void> {
    try {
      console.log('🚀 Starting Time gRPC Example...');
      
      // Initialize service
      await this.initialize();
      
      // Health check
      await this.healthCheckExample();
      
      // User registration
      await this.registerExample();
      
      // User login
      await this.loginExample();
      
      // Create note
      await this.createNoteExample();
      
      // Get note (you would need a real note ID)
      // await this.getNoteExample('note-id-here');
      
      console.log('✅ Complete example finished successfully!');
      
    } catch (error) {
      console.error('❌ Complete example failed:', error);
    }
  }
}

// MARK: - Usage in React Component

/**
 * Example React component using gRPC service
 */
export const TimeGrpcComponent = () => {
  const grpcExample = new TimeGrpcExample();
  
  const handleInitialize = async () => {
    try {
      await grpcExample.initialize();
      console.log('gRPC service initialized in component');
    } catch (error) {
      console.error('Failed to initialize gRPC service:', error);
    }
  };
  
  const handleCreateNote = async () => {
    try {
      await grpcExample.createNoteExample();
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };
  
  const handleLogin = async () => {
    try {
      await grpcExample.loginExample();
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };
  
  return {
    initialize: handleInitialize,
    createNote: handleCreateNote,
    login: handleLogin,
    runCompleteExample: () => grpcExample.runCompleteExample(),
  };
};

// MARK: - Export

export default TimeGrpcExample;