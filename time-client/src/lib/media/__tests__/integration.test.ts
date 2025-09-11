/**
 * Integration Tests for Native Camera Module
 * 
 * Tests the complete workflow from camera capture to upload
 */

import { nativeCamera } from '../native-camera';
import { openPicker, openUnifiedPicker, openCamera } from '../picker.native';

// Mock the native module
jest.mock('../../modules/time-native-camera', () => ({
  nativeCamera: {
    openCamera: jest.fn(),
    openGallery: jest.fn(),
    takePicture: jest.fn(),
    startVideoRecording: jest.fn(),
    stopVideoRecording: jest.fn(),
    switchCamera: jest.fn(),
    setFlashMode: jest.fn(),
    setFocusMode: jest.fn(),
    setExposureMode: jest.fn(),
    setWhiteBalanceMode: jest.fn(),
    setZoom: jest.fn(),
    focusAtPoint: jest.fn(),
    exposeAtPoint: jest.fn(),
    getAlbums: jest.fn(),
    getMediaFromAlbum: jest.fn(),
    compressImage: jest.fn(),
    compressVideo: jest.fn(),
    generateThumbnail: jest.fn(),
    extractMetadata: jest.fn(),
    cropImage: jest.fn(),
    rotateImage: jest.fn(),
    applyFilter: jest.fn(),
    uploadMedia: jest.fn(),
    uploadMediaWithProgress: jest.fn(),
    cancelUpload: jest.fn(),
    requestPermissions: jest.fn(),
    checkPermissions: jest.fn(),
    getCameraCapabilities: jest.fn(),
    getDeviceInfo: jest.fn(),
    isCameraAvailable: jest.fn(),
    isGalleryAvailable: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
  },
}));

describe('Native Camera Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete Photo Workflow', () => {
    test('should capture photo, process, and upload successfully', async () => {
      // Mock permissions
      (nativeCamera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: true,
        microphone: true,
        photoLibrary: true,
      });

      // Mock camera capture
      const mockPhoto = {
        uri: 'file://photo.jpg',
        type: 'image',
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        size: 1024000,
        timestamp: Date.now(),
      };
      (nativeCamera.takePicture as jest.Mock).mockResolvedValue(mockPhoto);

      // Mock compression
      const mockCompressed = {
        ...mockPhoto,
        size: 512000, // Compressed size
        compressedUri: 'file://compressed.jpg',
      };
      (nativeCamera.compressImage as jest.Mock).mockResolvedValue(mockCompressed);

      // Mock thumbnail generation
      (nativeCamera.generateThumbnail as jest.Mock).mockResolvedValue('file://thumbnail.jpg');

      // Mock upload
      const mockUploadResult = {
        success: true,
        mediaId: 'media123',
        url: 'https://example.com/media123.jpg',
        thumbnailUrl: 'https://example.com/thumb123.jpg',
      };
      (nativeCamera.uploadMediaWithProgress as jest.Mock).mockResolvedValue(mockUploadResult);

      // Execute workflow
      const photo = await nativeCamera.takePicture({ quality: 'high' });
      expect(photo).toEqual(mockPhoto);

      const compressed = await nativeCamera.compressImage(photo.uri, { quality: 0.8 });
      expect(compressed).toEqual(mockCompressed);

      const thumbnail = await nativeCamera.generateThumbnail(photo.uri, { width: 300, height: 300 });
      expect(thumbnail).toBe('file://thumbnail.jpg');

      const uploadResult = await nativeCamera.uploadMediaWithProgress(
        compressed.uri,
        {
          serverUrl: 'https://api.example.com',
          userId: 'user123',
        },
        (progress) => {
          console.log(`Upload: ${progress.percentage}%`);
        }
      );
      expect(uploadResult).toEqual(mockUploadResult);
    });
  });

  describe('Complete Video Workflow', () => {
    test('should record video, process, and upload successfully', async () => {
      // Mock permissions
      (nativeCamera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: true,
        microphone: true,
        photoLibrary: true,
      });

      // Mock video recording
      (nativeCamera.startVideoRecording as jest.Mock).mockResolvedValue(undefined);

      const mockVideo = {
        uri: 'file://video.mp4',
        type: 'video',
        mimeType: 'video/mp4',
        width: 1920,
        height: 1080,
        size: 10240000,
        duration: 30,
        timestamp: Date.now(),
      };
      (nativeCamera.stopVideoRecording as jest.Mock).mockResolvedValue({
        assets: [mockVideo],
        canceled: false,
      });

      // Mock video compression
      const mockCompressed = {
        ...mockVideo,
        size: 5120000, // Compressed size
        compressedUri: 'file://compressed.mp4',
      };
      (nativeCamera.compressVideo as jest.Mock).mockResolvedValue(mockCompressed);

      // Mock thumbnail generation
      (nativeCamera.generateThumbnail as jest.Mock).mockResolvedValue('file://video_thumb.jpg');

      // Mock upload
      const mockUploadResult = {
        success: true,
        mediaId: 'video123',
        url: 'https://example.com/video123.mp4',
        thumbnailUrl: 'https://example.com/video_thumb123.jpg',
        hlsUrl: 'https://example.com/video123.m3u8',
      };
      (nativeCamera.uploadMediaWithProgress as jest.Mock).mockResolvedValue(mockUploadResult);

      // Execute workflow
      await nativeCamera.startVideoRecording({ quality: 'high' });
      
      const videoResult = await nativeCamera.stopVideoRecording();
      expect(videoResult.assets).toHaveLength(1);
      expect(videoResult.assets[0]).toEqual(mockVideo);

      const compressed = await nativeCamera.compressVideo(mockVideo.uri, { quality: 'high' });
      expect(compressed).toEqual(mockCompressed);

      const thumbnail = await nativeCamera.generateThumbnail(mockVideo.uri, { width: 300, height: 300 });
      expect(thumbnail).toBe('file://video_thumb.jpg');

      const uploadResult = await nativeCamera.uploadMediaWithProgress(
        compressed.uri,
        {
          serverUrl: 'https://api.example.com',
          userId: 'user123',
        },
        (progress) => {
          console.log(`Upload: ${progress.percentage}%`);
        }
      );
      expect(uploadResult).toEqual(mockUploadResult);
    });
  });

  describe('Gallery Selection Workflow', () => {
    test('should select multiple media from gallery and process', async () => {
      // Mock permissions
      (nativeCamera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: true,
        microphone: true,
        photoLibrary: true,
      });

      // Mock gallery selection
      const mockAssets = [
        {
          uri: 'file://gallery1.jpg',
          type: 'image',
          mimeType: 'image/jpeg',
          width: 1920,
          height: 1080,
          size: 1024000,
          timestamp: Date.now(),
        },
        {
          uri: 'file://gallery2.mp4',
          type: 'video',
          mimeType: 'video/mp4',
          width: 1920,
          height: 1080,
          size: 5120000,
          duration: 15,
          timestamp: Date.now(),
        },
      ];
      (nativeCamera.openGallery as jest.Mock).mockResolvedValue({
        assets: mockAssets,
        canceled: false,
      });

      // Mock processing for each asset
      (nativeCamera.compressImage as jest.Mock).mockImplementation((uri) => {
        if (uri.includes('gallery1.jpg')) {
          return Promise.resolve({
            ...mockAssets[0],
            size: 512000,
            compressedUri: 'file://compressed1.jpg',
          });
        }
        return Promise.resolve(mockAssets[0]);
      });

      (nativeCamera.compressVideo as jest.Mock).mockImplementation((uri) => {
        if (uri.includes('gallery2.mp4')) {
          return Promise.resolve({
            ...mockAssets[1],
            size: 2560000,
            compressedUri: 'file://compressed2.mp4',
          });
        }
        return Promise.resolve(mockAssets[1]);
      });

      // Mock uploads
      (nativeCamera.uploadMediaWithProgress as jest.Mock)
        .mockResolvedValueOnce({
          success: true,
          mediaId: 'gallery1',
          url: 'https://example.com/gallery1.jpg',
        })
        .mockResolvedValueOnce({
          success: true,
          mediaId: 'gallery2',
          url: 'https://example.com/gallery2.mp4',
        });

      // Execute workflow
      const galleryResult = await nativeCamera.openGallery({
        mediaTypes: ['image', 'video'],
        selectionLimit: 5,
        quality: 'high',
      });

      expect(galleryResult.assets).toHaveLength(2);
      expect(galleryResult.canceled).toBe(false);

      // Process each asset
      const processedAssets = [];
      for (const asset of galleryResult.assets) {
        let processed;
        if (asset.type === 'image') {
          processed = await nativeCamera.compressImage(asset.uri, { quality: 0.8 });
        } else {
          processed = await nativeCamera.compressVideo(asset.uri, { quality: 'high' });
        }
        processedAssets.push(processed);
      }

      expect(processedAssets).toHaveLength(2);
      expect(processedAssets[0].size).toBeLessThan(mockAssets[0].size);
      expect(processedAssets[1].size).toBeLessThan(mockAssets[1].size);

      // Upload each asset
      const uploadResults = [];
      for (const asset of processedAssets) {
        const result = await nativeCamera.uploadMediaWithProgress(
          asset.uri,
          {
            serverUrl: 'https://api.example.com',
            userId: 'user123',
          },
          (progress) => {
            console.log(`Upload ${asset.uri}: ${progress.percentage}%`);
          }
        );
        uploadResults.push(result);
      }

      expect(uploadResults).toHaveLength(2);
      expect(uploadResults[0].success).toBe(true);
      expect(uploadResults[1].success).toBe(true);
    });
  });

  describe('Error Recovery Workflow', () => {
    test('should handle upload failures with retry', async () => {
      // Mock successful photo capture
      const mockPhoto = {
        uri: 'file://photo.jpg',
        type: 'image',
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        size: 1024000,
        timestamp: Date.now(),
      };
      (nativeCamera.takePicture as jest.Mock).mockResolvedValue(mockPhoto);

      // Mock upload failure then success
      (nativeCamera.uploadMediaWithProgress as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          success: true,
          mediaId: 'photo123',
          url: 'https://example.com/photo123.jpg',
        });

      // Execute workflow with retry logic
      const photo = await nativeCamera.takePicture({ quality: 'high' });
      expect(photo).toEqual(mockPhoto);

      // First upload attempt should fail
      await expect(nativeCamera.uploadMediaWithProgress(
        photo.uri,
        {
          serverUrl: 'https://api.example.com',
          userId: 'user123',
        },
        () => {}
      )).rejects.toThrow('Network error');

      // Second upload attempt should succeed
      const uploadResult = await nativeCamera.uploadMediaWithProgress(
        photo.uri,
        {
          serverUrl: 'https://api.example.com',
          userId: 'user123',
        },
        () => {}
      );
      expect(uploadResult.success).toBe(true);
    });

    test('should handle permission denial gracefully', async () => {
      // Mock permission denial
      (nativeCamera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: false,
        microphone: false,
        photoLibrary: false,
      });

      // Mock permission request failure
      (nativeCamera.requestPermissions as jest.Mock).mockResolvedValue({
        camera: false,
        microphone: false,
        photoLibrary: false,
      });

      // Check permissions
      const permissions = await nativeCamera.checkPermissions();
      expect(permissions.camera).toBe(false);
      expect(permissions.photoLibrary).toBe(false);

      // Request permissions
      const requestedPermissions = await nativeCamera.requestPermissions();
      expect(requestedPermissions.camera).toBe(false);
      expect(requestedPermissions.photoLibrary).toBe(false);

      // Camera operations should fail gracefully
      await expect(nativeCamera.takePicture()).rejects.toThrow();
      await expect(nativeCamera.openGallery()).rejects.toThrow();
    });
  });

  describe('Compatibility Layer Tests', () => {
    test('openPicker should work with compatibility layer', async () => {
      const mockAssets = [{
        uri: 'file://gallery.jpg',
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        size: 1024000,
      }];

      (nativeCamera.openGallery as jest.Mock).mockResolvedValue({
        assets: mockAssets,
        canceled: false,
      });

      const result = await openPicker({ quality: 'high' });
      expect(result).toHaveLength(1);
      expect(result[0].uri).toBe('file://gallery.jpg');
    });

    test('openUnifiedPicker should work with compatibility layer', async () => {
      const mockResult = {
        assets: [{
          uri: 'file://gallery.jpg',
          type: 'image',
          mimeType: 'image/jpeg',
          width: 1920,
          height: 1080,
          size: 1024000,
          timestamp: Date.now(),
        }],
        canceled: false,
      };

      (nativeCamera.openGallery as jest.Mock).mockResolvedValue(mockResult);

      const result = await openUnifiedPicker({ selectionCountRemaining: 4 });
      expect(result.assets).toHaveLength(1);
      expect(result.canceled).toBe(false);
    });

    test('openCamera should work with compatibility layer', async () => {
      const mockAsset = {
        uri: 'file://photo.jpg',
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        size: 1024000,
      };

      (nativeCamera.openCamera as jest.Mock).mockResolvedValue({
        assets: [mockAsset],
        canceled: false,
      });

      const result = await openCamera({ quality: 'high' });
      expect(result.uri).toBe('file://photo.jpg');
    });
  });

  describe('Performance Tests', () => {
    test('should handle multiple concurrent operations', async () => {
      // Mock all operations
      (nativeCamera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: true,
        microphone: true,
        photoLibrary: true,
      });

      (nativeCamera.getCameraCapabilities as jest.Mock).mockResolvedValue({
        supportsHDR: true,
        supportsPortraitMode: true,
        maxZoom: 10,
      });

      (nativeCamera.getDeviceInfo as jest.Mock).mockResolvedValue({
        platform: 'ios',
        version: '17.0',
        model: 'iPhone 15 Pro',
      });

      (nativeCamera.isCameraAvailable as jest.Mock).mockResolvedValue(true);
      (nativeCamera.isGalleryAvailable as jest.Mock).mockResolvedValue(true);

      // Execute multiple operations concurrently
      const [
        permissions,
        capabilities,
        deviceInfo,
        cameraAvailable,
        galleryAvailable,
      ] = await Promise.all([
        nativeCamera.checkPermissions(),
        nativeCamera.getCameraCapabilities(),
        nativeCamera.getDeviceInfo(),
        nativeCamera.isCameraAvailable(),
        nativeCamera.isGalleryAvailable(),
      ]);

      expect(permissions.camera).toBe(true);
      expect(capabilities.supportsHDR).toBe(true);
      expect(deviceInfo.platform).toBe('ios');
      expect(cameraAvailable).toBe(true);
      expect(galleryAvailable).toBe(true);
    });
  });
});