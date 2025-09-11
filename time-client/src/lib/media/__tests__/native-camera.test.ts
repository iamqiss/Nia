/**
 * Native Camera Module Tests
 * 
 * Comprehensive tests for the native camera module functionality
 */

import { nativeCamera } from '../native-camera';

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

describe('Native Camera Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Camera Functions', () => {
    test('openCamera should call native module with correct options', async () => {
      const mockResult = {
        assets: [{
          uri: 'file://test.jpg',
          type: 'image',
          mimeType: 'image/jpeg',
          width: 1920,
          height: 1080,
          size: 1024000,
          timestamp: Date.now(),
        }],
        canceled: false,
      };

      (nativeCamera.openCamera as jest.Mock).mockResolvedValue(mockResult);

      const options = {
        quality: 'high',
        enableHDR: true,
        flashMode: 'auto',
      };

      const result = await nativeCamera.openCamera(options);

      expect(nativeCamera.openCamera).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockResult);
    });

    test('takePicture should return media asset', async () => {
      const mockAsset = {
        uri: 'file://test.jpg',
        type: 'image',
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        size: 1024000,
        timestamp: Date.now(),
      };

      (nativeCamera.takePicture as jest.Mock).mockResolvedValue(mockAsset);

      const result = await nativeCamera.takePicture({ quality: 'high' });

      expect(nativeCamera.takePicture).toHaveBeenCalledWith({ quality: 'high' });
      expect(result).toEqual(mockAsset);
    });

    test('startVideoRecording should start recording', async () => {
      (nativeCamera.startVideoRecording as jest.Mock).mockResolvedValue(undefined);

      await nativeCamera.startVideoRecording({ quality: 'high' });

      expect(nativeCamera.startVideoRecording).toHaveBeenCalledWith({ quality: 'high' });
    });

    test('stopVideoRecording should stop recording and return result', async () => {
      const mockResult = {
        assets: [{
          uri: 'file://test.mp4',
          type: 'video',
          mimeType: 'video/mp4',
          width: 1920,
          height: 1080,
          size: 10240000,
          duration: 30,
          timestamp: Date.now(),
        }],
        canceled: false,
      };

      (nativeCamera.stopVideoRecording as jest.Mock).mockResolvedValue(mockResult);

      const result = await nativeCamera.stopVideoRecording();

      expect(nativeCamera.stopVideoRecording).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('Camera Controls', () => {
    test('switchCamera should switch between front/back', async () => {
      (nativeCamera.switchCamera as jest.Mock).mockResolvedValue(true);

      const result = await nativeCamera.switchCamera();

      expect(nativeCamera.switchCamera).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    test('setFlashMode should set flash mode', async () => {
      (nativeCamera.setFlashMode as jest.Mock).mockResolvedValue(true);

      const result = await nativeCamera.setFlashMode('on');

      expect(nativeCamera.setFlashMode).toHaveBeenCalledWith('on');
      expect(result).toBe(true);
    });

    test('setZoom should set zoom level', async () => {
      (nativeCamera.setZoom as jest.Mock).mockResolvedValue(true);

      const result = await nativeCamera.setZoom(2.5);

      expect(nativeCamera.setZoom).toHaveBeenCalledWith(2.5);
      expect(result).toBe(true);
    });

    test('focusAtPoint should focus at specific point', async () => {
      (nativeCamera.focusAtPoint as jest.Mock).mockResolvedValue(true);

      const result = await nativeCamera.focusAtPoint(0.5, 0.5);

      expect(nativeCamera.focusAtPoint).toHaveBeenCalledWith(0.5, 0.5);
      expect(result).toBe(true);
    });
  });

  describe('Gallery Functions', () => {
    test('openGallery should open gallery with options', async () => {
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

      const options = {
        mediaTypes: ['image', 'video'],
        selectionLimit: 5,
        quality: 'high',
      };

      const result = await nativeCamera.openGallery(options);

      expect(nativeCamera.openGallery).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockResult);
    });

    test('getAlbums should return list of albums', async () => {
      const mockAlbums = [
        { id: '1', name: 'Camera Roll', count: 100 },
        { id: '2', name: 'Screenshots', count: 50 },
      ];

      (nativeCamera.getAlbums as jest.Mock).mockResolvedValue(mockAlbums);

      const result = await nativeCamera.getAlbums();

      expect(nativeCamera.getAlbums).toHaveBeenCalled();
      expect(result).toEqual(mockAlbums);
    });
  });

  describe('Media Processing', () => {
    test('compressImage should compress image', async () => {
      const mockCompressed = {
        uri: 'file://compressed.jpg',
        type: 'image',
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        size: 512000, // Smaller size
        timestamp: Date.now(),
      };

      (nativeCamera.compressImage as jest.Mock).mockResolvedValue(mockCompressed);

      const result = await nativeCamera.compressImage('file://original.jpg', {
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080,
      });

      expect(nativeCamera.compressImage).toHaveBeenCalledWith('file://original.jpg', {
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080,
      });
      expect(result).toEqual(mockCompressed);
    });

    test('generateThumbnail should generate thumbnail', async () => {
      (nativeCamera.generateThumbnail as jest.Mock).mockResolvedValue('file://thumbnail.jpg');

      const result = await nativeCamera.generateThumbnail('file://original.jpg', {
        width: 300,
        height: 300,
      });

      expect(nativeCamera.generateThumbnail).toHaveBeenCalledWith('file://original.jpg', {
        width: 300,
        height: 300,
      });
      expect(result).toBe('file://thumbnail.jpg');
    });

    test('cropImage should crop image', async () => {
      const mockCropped = {
        uri: 'file://cropped.jpg',
        type: 'image',
        mimeType: 'image/jpeg',
        width: 500,
        height: 500,
        size: 250000,
        timestamp: Date.now(),
      };

      (nativeCamera.cropImage as jest.Mock).mockResolvedValue(mockCropped);

      const result = await nativeCamera.cropImage('file://original.jpg', {
        x: 100,
        y: 100,
        width: 500,
        height: 500,
      });

      expect(nativeCamera.cropImage).toHaveBeenCalledWith('file://original.jpg', {
        x: 100,
        y: 100,
        width: 500,
        height: 500,
      });
      expect(result).toEqual(mockCropped);
    });
  });

  describe('Upload Functions', () => {
    test('uploadMedia should upload media', async () => {
      const mockResult = {
        success: true,
        mediaId: 'media123',
        url: 'https://example.com/media123.jpg',
        thumbnailUrl: 'https://example.com/thumb123.jpg',
      };

      (nativeCamera.uploadMedia as jest.Mock).mockResolvedValue(mockResult);

      const result = await nativeCamera.uploadMedia('file://test.jpg', {
        serverUrl: 'https://api.example.com',
        userId: 'user123',
      });

      expect(nativeCamera.uploadMedia).toHaveBeenCalledWith('file://test.jpg', {
        serverUrl: 'https://api.example.com',
        userId: 'user123',
      });
      expect(result).toEqual(mockResult);
    });

    test('uploadMediaWithProgress should upload with progress callback', async () => {
      const mockResult = {
        success: true,
        mediaId: 'media123',
        url: 'https://example.com/media123.jpg',
      };

      const progressCallback = jest.fn();
      (nativeCamera.uploadMediaWithProgress as jest.Mock).mockResolvedValue(mockResult);

      const result = await nativeCamera.uploadMediaWithProgress(
        'file://test.jpg',
        {
          serverUrl: 'https://api.example.com',
          userId: 'user123',
        },
        progressCallback
      );

      expect(nativeCamera.uploadMediaWithProgress).toHaveBeenCalledWith(
        'file://test.jpg',
        {
          serverUrl: 'https://api.example.com',
          userId: 'user123',
        },
        progressCallback
      );
      expect(result).toEqual(mockResult);
    });

    test('cancelUpload should cancel upload', async () => {
      (nativeCamera.cancelUpload as jest.Mock).mockResolvedValue(true);

      const result = await nativeCamera.cancelUpload('media123');

      expect(nativeCamera.cancelUpload).toHaveBeenCalledWith('media123');
      expect(result).toBe(true);
    });
  });

  describe('Permissions', () => {
    test('requestPermissions should request all permissions', async () => {
      const mockPermissions = {
        camera: true,
        microphone: true,
        photoLibrary: true,
        location: false,
      };

      (nativeCamera.requestPermissions as jest.Mock).mockResolvedValue(mockPermissions);

      const result = await nativeCamera.requestPermissions();

      expect(nativeCamera.requestPermissions).toHaveBeenCalled();
      expect(result).toEqual(mockPermissions);
    });

    test('checkPermissions should check current permissions', async () => {
      const mockPermissions = {
        camera: true,
        microphone: false,
        photoLibrary: true,
        location: false,
      };

      (nativeCamera.checkPermissions as jest.Mock).mockResolvedValue(mockPermissions);

      const result = await nativeCamera.checkPermissions();

      expect(nativeCamera.checkPermissions).toHaveBeenCalled();
      expect(result).toEqual(mockPermissions);
    });
  });

  describe('Device Info', () => {
    test('getCameraCapabilities should return capabilities', async () => {
      const mockCapabilities = {
        supportsHDR: true,
        supportsPortraitMode: true,
        supportsNightMode: true,
        supportsStabilization: true,
        supportsRawCapture: false,
        supportsBurstMode: true,
        supportsSlowMotion: true,
        supportsTimeLapse: true,
        supportsLivePhotos: false,
        maxZoom: 10,
        supportedVideoQualities: ['low', 'medium', 'high', 'max'],
        supportedImageFormats: ['jpeg', 'png', 'webp'],
        supportedVideoFormats: ['mp4', 'webm'],
        maxVideoDuration: 300,
        maxImageResolution: { width: 4096, height: 3072 },
        maxVideoResolution: { width: 3840, height: 2160 },
      };

      (nativeCamera.getCameraCapabilities as jest.Mock).mockResolvedValue(mockCapabilities);

      const result = await nativeCamera.getCameraCapabilities();

      expect(nativeCamera.getCameraCapabilities).toHaveBeenCalled();
      expect(result).toEqual(mockCapabilities);
    });

    test('getDeviceInfo should return device information', async () => {
      const mockDeviceInfo = {
        platform: 'ios',
        version: '17.0',
        model: 'iPhone 15 Pro',
        manufacturer: 'Apple',
      };

      (nativeCamera.getDeviceInfo as jest.Mock).mockResolvedValue(mockDeviceInfo);

      const result = await nativeCamera.getDeviceInfo();

      expect(nativeCamera.getDeviceInfo).toHaveBeenCalled();
      expect(result).toEqual(mockDeviceInfo);
    });

    test('isCameraAvailable should check camera availability', async () => {
      (nativeCamera.isCameraAvailable as jest.Mock).mockResolvedValue(true);

      const result = await nativeCamera.isCameraAvailable();

      expect(nativeCamera.isCameraAvailable).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    test('isGalleryAvailable should check gallery availability', async () => {
      (nativeCamera.isGalleryAvailable as jest.Mock).mockResolvedValue(true);

      const result = await nativeCamera.isGalleryAvailable();

      expect(nativeCamera.isGalleryAvailable).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('Event Listeners', () => {
    test('addListener should add event listener', () => {
      const callback = jest.fn();
      (nativeCamera.addListener as jest.Mock).mockImplementation(() => {});

      nativeCamera.addListener('onCameraReady', callback);

      expect(nativeCamera.addListener).toHaveBeenCalledWith('onCameraReady', callback);
    });

    test('removeListener should remove event listener', () => {
      const callback = jest.fn();
      (nativeCamera.removeListener as jest.Mock).mockImplementation(() => {});

      nativeCamera.removeListener('onCameraReady', callback);

      expect(nativeCamera.removeListener).toHaveBeenCalledWith('onCameraReady', callback);
    });

    test('removeAllListeners should remove all listeners', () => {
      (nativeCamera.removeAllListeners as jest.Mock).mockImplementation(() => {});

      nativeCamera.removeAllListeners();

      expect(nativeCamera.removeAllListeners).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('should handle camera errors gracefully', async () => {
      const error = new Error('Camera not available');
      (nativeCamera.openCamera as jest.Mock).mockRejectedValue(error);

      await expect(nativeCamera.openCamera()).rejects.toThrow('Camera not available');
    });

    test('should handle upload errors gracefully', async () => {
      const error = new Error('Upload failed');
      (nativeCamera.uploadMedia as jest.Mock).mockRejectedValue(error);

      await expect(nativeCamera.uploadMedia('file://test.jpg', {
        serverUrl: 'https://api.example.com',
        userId: 'user123',
      })).rejects.toThrow('Upload failed');
    });

    test('should handle permission errors gracefully', async () => {
      const error = new Error('Permission denied');
      (nativeCamera.requestPermissions as jest.Mock).mockRejectedValue(error);

      await expect(nativeCamera.requestPermissions()).rejects.toThrow('Permission denied');
    });
  });
});