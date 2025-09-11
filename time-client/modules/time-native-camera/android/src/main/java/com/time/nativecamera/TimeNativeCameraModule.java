package com.time.nativecamera;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.util.Size;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.camera.core.Camera;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.ImageCapture;
import androidx.camera.core.ImageCaptureException;
import androidx.camera.core.Preview;
import androidx.camera.core.VideoCapture;
import androidx.camera.core.VideoCaptureException;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.common.util.concurrent.ListenableFuture;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TimeNativeCameraModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final String TAG = "TimeNativeCameraModule";
    private static final int CAMERA_PERMISSION_REQUEST = 1001;
    private static final int GALLERY_PERMISSION_REQUEST = 1002;
    private static final int CAMERA_CAPTURE_REQUEST = 1003;
    private static final int GALLERY_PICK_REQUEST = 1004;
    
    private final ReactApplicationContext reactContext;
    private final ExecutorService executorService;
    private ProcessCameraProvider cameraProvider;
    private Camera camera;
    private ImageCapture imageCapture;
    private VideoCapture videoCapture;
    private PreviewView previewView;
    private boolean isRecording = false;
    private File currentVideoFile;
    private Promise currentPromise;
    private ReadableMap currentOptions;
    private Map<String, Object> activeUploads = new HashMap<>();

    public TimeNativeCameraModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.executorService = Executors.newCachedThreadPool();
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "TimeNativeCameraModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("VERSION", "1.0.0");
        return constants;
    }

    // Camera Methods
    @ReactMethod
    public void openCamera(ReadableMap options, Promise promise) {
        if (!checkCameraPermission()) {
            requestCameraPermission();
            promise.reject("CAMERA_PERMISSION_DENIED", "Camera permission is required");
            return;
        }
        
        this.currentOptions = options;
        this.currentPromise = promise;
        
        // Initialize camera
        initializeCamera(options, promise);
    }

    @ReactMethod
    public void openCameraWithPreview(ReadableMap options, Promise promise) {
        if (!checkCameraPermission()) {
            requestCameraPermission();
            promise.reject("CAMERA_PERMISSION_DENIED", "Camera permission is required");
            return;
        }
        
        this.currentOptions = options;
        this.currentPromise = promise;
        
        // Initialize camera with preview
        initializeCameraWithPreview(options, promise);
    }

    @ReactMethod
    public void startVideoRecording(ReadableMap options, Promise promise) {
        if (isRecording) {
            promise.reject("ALREADY_RECORDING", "Video recording is already in progress");
            return;
        }
        
        if (videoCapture == null) {
            promise.reject("NO_VIDEO_CAPTURE", "Video capture not available");
            return;
        }
        
        try {
            startVideoRecordingInternal(options);
            promise.resolve(Arguments.createMap().putBoolean("success", true));
        } catch (Exception e) {
            promise.reject("RECORDING_START_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void stopVideoRecording(Promise promise) {
        if (!isRecording) {
            promise.reject("NOT_RECORDING", "No video recording in progress");
            return;
        }
        
        try {
            stopVideoRecordingInternal(promise);
        } catch (Exception e) {
            promise.reject("RECORDING_STOP_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void takePicture(ReadableMap options, Promise promise) {
        if (imageCapture == null) {
            promise.reject("NO_IMAGE_CAPTURE", "Image capture not available");
            return;
        }
        
        this.currentOptions = options;
        this.currentPromise = promise;
        
        capturePhoto(options, promise);
    }

    @ReactMethod
    public void switchCamera(Promise promise) {
        try {
            switchCameraInternal();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("SWITCH_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void setFlashMode(String mode, Promise promise) {
        try {
            setFlashModeInternal(mode);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("FLASH_MODE_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void setFocusMode(String mode, Promise promise) {
        try {
            setFocusModeInternal(mode);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("FOCUS_MODE_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void setExposureMode(String mode, Promise promise) {
        try {
            setExposureModeInternal(mode);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("EXPOSURE_MODE_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void setWhiteBalanceMode(String mode, Promise promise) {
        try {
            setWhiteBalanceModeInternal(mode);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("WHITE_BALANCE_MODE_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void setZoom(double level, Promise promise) {
        try {
            setZoomInternal((float) level);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ZOOM_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void focusAtPoint(double x, double y, Promise promise) {
        try {
            focusAtPointInternal((float) x, (float) y);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("FOCUS_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void exposeAtPoint(double x, double y, Promise promise) {
        try {
            exposeAtPointInternal((float) x, (float) y);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("EXPOSE_FAILED", e.getMessage());
        }
    }

    // Gallery Methods
    @ReactMethod
    public void openGallery(ReadableMap options, Promise promise) {
        if (!checkStoragePermission()) {
            requestStoragePermission();
            promise.reject("STORAGE_PERMISSION_DENIED", "Storage permission is required");
            return;
        }
        
        this.currentOptions = options;
        this.currentPromise = promise;
        
        openGalleryInternal(options, promise);
    }

    @ReactMethod
    public void getAlbums(Promise promise) {
        if (!checkStoragePermission()) {
            requestStoragePermission();
            promise.reject("STORAGE_PERMISSION_DENIED", "Storage permission is required");
            return;
        }
        
        try {
            WritableArray albums = getAlbumsInternal();
            promise.resolve(albums);
        } catch (Exception e) {
            promise.reject("ALBUMS_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getMediaFromAlbum(String albumId, ReadableMap options, Promise promise) {
        if (!checkStoragePermission()) {
            requestStoragePermission();
            promise.reject("STORAGE_PERMISSION_DENIED", "Storage permission is required");
            return;
        }
        
        try {
            WritableArray media = getMediaFromAlbumInternal(albumId, options);
            promise.resolve(Arguments.createMap()
                .putArray("assets", media)
                .putBoolean("canceled", false));
        } catch (Exception e) {
            promise.reject("MEDIA_ERROR", e.getMessage());
        }
    }

    // Media Processing Methods
    @ReactMethod
    public void compressImage(String uri, ReadableMap options, Promise promise) {
        executorService.execute(() -> {
            try {
                WritableMap result = compressImageInternal(uri, options);
                promise.resolve(result);
            } catch (Exception e) {
                promise.reject("COMPRESSION_FAILED", e.getMessage());
            }
        });
    }

    @ReactMethod
    public void compressVideo(String uri, ReadableMap options, Promise promise) {
        executorService.execute(() -> {
            try {
                WritableMap result = compressVideoInternal(uri, options);
                promise.resolve(result);
            } catch (Exception e) {
                promise.reject("COMPRESSION_FAILED", e.getMessage());
            }
        });
    }

    @ReactMethod
    public void generateThumbnail(String uri, ReadableMap options, Promise promise) {
        executorService.execute(() -> {
            try {
                String thumbnailUri = generateThumbnailInternal(uri, options);
                promise.resolve(thumbnailUri);
            } catch (Exception e) {
                promise.reject("THUMBNAIL_FAILED", e.getMessage());
            }
        });
    }

    @ReactMethod
    public void extractMetadata(String uri, Promise promise) {
        executorService.execute(() -> {
            try {
                WritableMap metadata = extractMetadataInternal(uri);
                promise.resolve(metadata);
            } catch (Exception e) {
                promise.reject("METADATA_FAILED", e.getMessage());
            }
        });
    }

    @ReactMethod
    public void cropImage(String uri, ReadableMap cropData, Promise promise) {
        executorService.execute(() -> {
            try {
                WritableMap result = cropImageInternal(uri, cropData);
                promise.resolve(result);
            } catch (Exception e) {
                promise.reject("CROP_FAILED", e.getMessage());
            }
        });
    }

    @ReactMethod
    public void rotateImage(String uri, double degrees, Promise promise) {
        executorService.execute(() -> {
            try {
                WritableMap result = rotateImageInternal(uri, (float) degrees);
                promise.resolve(result);
            } catch (Exception e) {
                promise.reject("ROTATE_FAILED", e.getMessage());
            }
        });
    }

    @ReactMethod
    public void applyFilter(String uri, String filter, double intensity, Promise promise) {
        executorService.execute(() -> {
            try {
                WritableMap result = applyFilterInternal(uri, filter, (float) intensity);
                promise.resolve(result);
            } catch (Exception e) {
                promise.reject("FILTER_FAILED", e.getMessage());
            }
        });
    }

    // Upload Methods
    @ReactMethod
    public void uploadMedia(String uri, ReadableMap options, Promise promise) {
        executorService.execute(() -> {
            try {
                WritableMap result = uploadMediaInternal(uri, options);
                promise.resolve(result);
            } catch (Exception e) {
                promise.reject("UPLOAD_FAILED", e.getMessage());
            }
        });
    }

    @ReactMethod
    public void uploadMediaWithProgress(String uri, ReadableMap options, Promise promise) {
        executorService.execute(() -> {
            try {
                uploadMediaWithProgressInternal(uri, options, promise);
            } catch (Exception e) {
                promise.reject("UPLOAD_FAILED", e.getMessage());
            }
        });
    }

    @ReactMethod
    public void cancelUpload(String mediaId, Promise promise) {
        try {
            boolean cancelled = cancelUploadInternal(mediaId);
            promise.resolve(cancelled);
        } catch (Exception e) {
            promise.reject("CANCEL_FAILED", e.getMessage());
        }
    }

    // Permission Methods
    @ReactMethod
    public void requestPermissions(Promise promise) {
        try {
            WritableMap permissions = requestAllPermissionsInternal();
            promise.resolve(permissions);
        } catch (Exception e) {
            promise.reject("PERMISSION_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void checkPermissions(Promise promise) {
        try {
            WritableMap permissions = checkAllPermissionsInternal();
            promise.resolve(permissions);
        } catch (Exception e) {
            promise.reject("PERMISSION_ERROR", e.getMessage());
        }
    }

    // Utility Methods
    @ReactMethod
    public void getCameraCapabilities(Promise promise) {
        try {
            WritableMap capabilities = getCameraCapabilitiesInternal();
            promise.resolve(capabilities);
        } catch (Exception e) {
            promise.reject("CAPABILITIES_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getDeviceInfo(Promise promise) {
        try {
            WritableMap deviceInfo = getDeviceInfoInternal();
            promise.resolve(deviceInfo);
        } catch (Exception e) {
            promise.reject("DEVICE_INFO_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void isCameraAvailable(Promise promise) {
        try {
            boolean available = isCameraAvailableInternal();
            promise.resolve(available);
        } catch (Exception e) {
            promise.reject("CAMERA_CHECK_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void isGalleryAvailable(Promise promise) {
        try {
            boolean available = isGalleryAvailableInternal();
            promise.resolve(available);
        } catch (Exception e) {
            promise.reject("GALLERY_CHECK_ERROR", e.getMessage());
        }
    }

    // Activity Event Listener
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == CAMERA_CAPTURE_REQUEST) {
            if (resultCode == Activity.RESULT_OK) {
                // Handle camera capture result
                handleCameraResult(data);
            } else {
                if (currentPromise != null) {
                    currentPromise.reject("CAMERA_CANCELLED", "Camera capture was cancelled");
                    currentPromise = null;
                }
            }
        } else if (requestCode == GALLERY_PICK_REQUEST) {
            if (resultCode == Activity.RESULT_OK) {
                // Handle gallery pick result
                handleGalleryResult(data);
            } else {
                if (currentPromise != null) {
                    currentPromise.reject("GALLERY_CANCELLED", "Gallery selection was cancelled");
                    currentPromise = null;
                }
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        // Handle new intent if needed
    }

    // Private Methods
    private boolean checkCameraPermission() {
        return ContextCompat.checkSelfPermission(reactContext, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
    }

    private boolean checkStoragePermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return ContextCompat.checkSelfPermission(reactContext, Manifest.permission.READ_MEDIA_IMAGES) == PackageManager.PERMISSION_GRANTED &&
                   ContextCompat.checkSelfPermission(reactContext, Manifest.permission.READ_MEDIA_VIDEO) == PackageManager.PERMISSION_GRANTED;
        } else {
            return ContextCompat.checkSelfPermission(reactContext, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
        }
    }

    private void requestCameraPermission() {
        ActivityCompat.requestPermissions(getCurrentActivity(), 
            new String[]{Manifest.permission.CAMERA}, CAMERA_PERMISSION_REQUEST);
    }

    private void requestStoragePermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ActivityCompat.requestPermissions(getCurrentActivity(), 
                new String[]{Manifest.permission.READ_MEDIA_IMAGES, Manifest.permission.READ_MEDIA_VIDEO}, 
                GALLERY_PERMISSION_REQUEST);
        } else {
            ActivityCompat.requestPermissions(getCurrentActivity(), 
                new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, GALLERY_PERMISSION_REQUEST);
        }
    }

    private void initializeCamera(ReadableMap options, Promise promise) {
        // Implementation for camera initialization
        ListenableFuture<ProcessCameraProvider> cameraProviderFuture = 
            ProcessCameraProvider.getInstance(reactContext);
        
        cameraProviderFuture.addListener(() -> {
            try {
                cameraProvider = cameraProviderFuture.get();
                bindCameraUseCases(options);
                promise.resolve(Arguments.createMap().putBoolean("success", true));
            } catch (ExecutionException | InterruptedException e) {
                promise.reject("CAMERA_INIT_FAILED", e.getMessage());
            }
        }, ContextCompat.getMainExecutor(reactContext));
    }

    private void initializeCameraWithPreview(ReadableMap options, Promise promise) {
        // Implementation for camera initialization with preview
        initializeCamera(options, promise);
    }

    private void bindCameraUseCases(ReadableMap options) {
        // Implementation for binding camera use cases
        CameraSelector cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA;
        
        Preview preview = new Preview.Builder().build();
        imageCapture = new ImageCapture.Builder().build();
        videoCapture = new VideoCapture.Builder().build();
        
        try {
            cameraProvider.unbindAll();
            camera = cameraProvider.bindToLifecycle(
                (FragmentActivity) getCurrentActivity(),
                cameraSelector,
                preview,
                imageCapture,
                videoCapture
            );
        } catch (Exception e) {
            Log.e(TAG, "Failed to bind camera use cases", e);
        }
    }

    private void startVideoRecordingInternal(ReadableMap options) {
        // Implementation for starting video recording
        isRecording = true;
        sendEvent("onVideoRecordingStarted", Arguments.createMap());
    }

    private void stopVideoRecordingInternal(Promise promise) {
        // Implementation for stopping video recording
        isRecording = false;
        sendEvent("onVideoRecordingStopped", Arguments.createMap());
        
        // Process the recorded video
        if (currentVideoFile != null) {
            WritableMap asset = processVideoFile(currentVideoFile);
            WritableArray assets = Arguments.createArray();
            assets.pushMap(asset);
            
            WritableMap result = Arguments.createMap();
            result.putArray("assets", assets);
            result.putBoolean("canceled", false);
            
            promise.resolve(result);
        } else {
            promise.reject("NO_VIDEO", "No video file recorded");
        }
    }

    private void capturePhoto(ReadableMap options, Promise promise) {
        // Implementation for capturing photo
        File photoFile = createImageFile();
        
        ImageCapture.OutputFileOptions outputOptions = new ImageCapture.OutputFileOptions.Builder(photoFile).build();
        
        imageCapture.takePicture(outputOptions, executorService, new ImageCapture.OnImageSavedCallback() {
            @Override
            public void onImageSaved(@NonNull ImageCapture.OutputFileResults output) {
                WritableMap asset = processImageFile(photoFile);
                promise.resolve(asset);
            }
            
            @Override
            public void onError(@NonNull ImageCaptureException exception) {
                promise.reject("PHOTO_CAPTURE_FAILED", exception.getMessage());
            }
        });
    }

    private void switchCameraInternal() {
        // Implementation for switching camera
        CameraSelector newSelector = (camera.getCameraInfo().getCameraSelector() == CameraSelector.DEFAULT_BACK_CAMERA) 
            ? CameraSelector.DEFAULT_FRONT_CAMERA 
            : CameraSelector.DEFAULT_BACK_CAMERA;
        
        try {
            cameraProvider.unbindAll();
            camera = cameraProvider.bindToLifecycle(
                (FragmentActivity) getCurrentActivity(),
                newSelector,
                new Preview.Builder().build(),
                new ImageCapture.Builder().build(),
                new VideoCapture.Builder().build()
            );
        } catch (Exception e) {
            Log.e(TAG, "Failed to switch camera", e);
        }
    }

    private void setFlashModeInternal(String mode) {
        // Implementation for setting flash mode
        // This would configure the camera's flash mode
    }

    private void setFocusModeInternal(String mode) {
        // Implementation for setting focus mode
        // This would configure the camera's focus mode
    }

    private void setExposureModeInternal(String mode) {
        // Implementation for setting exposure mode
        // This would configure the camera's exposure mode
    }

    private void setWhiteBalanceModeInternal(String mode) {
        // Implementation for setting white balance mode
        // This would configure the camera's white balance mode
    }

    private void setZoomInternal(float level) {
        // Implementation for setting zoom level
        // This would configure the camera's zoom level
    }

    private void focusAtPointInternal(float x, float y) {
        // Implementation for focusing at point
        // This would configure the camera's focus point
    }

    private void exposeAtPointInternal(float x, float y) {
        // Implementation for exposing at point
        // This would configure the camera's exposure point
    }

    private void openGalleryInternal(ReadableMap options, Promise promise) {
        // Implementation for opening gallery
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        intent.setType("image/*");
        
        if (options.hasKey("mediaTypes")) {
            ReadableArray mediaTypes = options.getArray("mediaTypes");
            if (mediaTypes != null && mediaTypes.size() > 0) {
                String type = mediaTypes.getString(0);
                if ("video".equals(type)) {
                    intent.setType("video/*");
                } else if ("image".equals(type)) {
                    intent.setType("image/*");
                }
            }
        }
        
        if (options.hasKey("selectionLimit") && options.getInt("selectionLimit") > 1) {
            intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        }
        
        getCurrentActivity().startActivityForResult(intent, GALLERY_PICK_REQUEST);
    }

    private WritableArray getAlbumsInternal() {
        // Implementation for getting albums
        WritableArray albums = Arguments.createArray();
        // This would query the media store for albums
        return albums;
    }

    private WritableArray getMediaFromAlbumInternal(String albumId, ReadableMap options) {
        // Implementation for getting media from album
        WritableArray media = Arguments.createArray();
        // This would query the media store for media in the specified album
        return media;
    }

    private WritableMap compressImageInternal(String uri, ReadableMap options) {
        // Implementation for image compression
        WritableMap result = Arguments.createMap();
        // This would compress the image based on the options
        return result;
    }

    private WritableMap compressVideoInternal(String uri, ReadableMap options) {
        // Implementation for video compression
        WritableMap result = Arguments.createMap();
        // This would compress the video based on the options
        return result;
    }

    private String generateThumbnailInternal(String uri, ReadableMap options) {
        // Implementation for thumbnail generation
        return uri; // Placeholder
    }

    private WritableMap extractMetadataInternal(String uri) {
        // Implementation for metadata extraction
        WritableMap metadata = Arguments.createMap();
        // This would extract metadata from the media file
        return metadata;
    }

    private WritableMap cropImageInternal(String uri, ReadableMap cropData) {
        // Implementation for image cropping
        WritableMap result = Arguments.createMap();
        // This would crop the image based on the crop data
        return result;
    }

    private WritableMap rotateImageInternal(String uri, float degrees) {
        // Implementation for image rotation
        WritableMap result = Arguments.createMap();
        // This would rotate the image by the specified degrees
        return result;
    }

    private WritableMap applyFilterInternal(String uri, String filter, float intensity) {
        // Implementation for filter application
        WritableMap result = Arguments.createMap();
        // This would apply the specified filter to the image
        return result;
    }

    private WritableMap uploadMediaInternal(String uri, ReadableMap options) {
        // Implementation for media upload
        WritableMap result = Arguments.createMap();
        // This would upload the media using gRPC
        return result;
    }

    private void uploadMediaWithProgressInternal(String uri, ReadableMap options, Promise promise) {
        // Implementation for media upload with progress
        // This would upload the media and report progress
    }

    private boolean cancelUploadInternal(String mediaId) {
        // Implementation for canceling upload
        return activeUploads.remove(mediaId) != null;
    }

    private WritableMap requestAllPermissionsInternal() {
        // Implementation for requesting all permissions
        WritableMap permissions = Arguments.createMap();
        permissions.putBoolean("camera", checkCameraPermission());
        permissions.putBoolean("microphone", true); // Placeholder
        permissions.putBoolean("photoLibrary", checkStoragePermission());
        return permissions;
    }

    private WritableMap checkAllPermissionsInternal() {
        // Implementation for checking all permissions
        return requestAllPermissionsInternal();
    }

    private WritableMap getCameraCapabilitiesInternal() {
        // Implementation for getting camera capabilities
        WritableMap capabilities = Arguments.createMap();
        capabilities.putBoolean("supportsHDR", true);
        capabilities.putBoolean("supportsPortraitMode", true);
        capabilities.putBoolean("supportsNightMode", true);
        capabilities.putBoolean("supportsStabilization", true);
        capabilities.putBoolean("supportsRawCapture", false);
        capabilities.putBoolean("supportsBurstMode", true);
        capabilities.putBoolean("supportsSlowMotion", true);
        capabilities.putBoolean("supportsTimeLapse", true);
        capabilities.putBoolean("supportsLivePhotos", false);
        capabilities.putDouble("maxZoom", 10.0);
        
        WritableArray videoQualities = Arguments.createArray();
        videoQualities.pushString("low");
        videoQualities.pushString("medium");
        videoQualities.pushString("high");
        videoQualities.pushString("max");
        capabilities.putArray("supportedVideoQualities", videoQualities);
        
        WritableArray imageFormats = Arguments.createArray();
        imageFormats.pushString("jpeg");
        imageFormats.pushString("png");
        imageFormats.pushString("webp");
        capabilities.putArray("supportedImageFormats", imageFormats);
        
        WritableArray videoFormats = Arguments.createArray();
        videoFormats.pushString("mp4");
        videoFormats.pushString("webm");
        capabilities.putArray("supportedVideoFormats", videoFormats);
        
        capabilities.putDouble("maxVideoDuration", 300.0); // 5 minutes
        
        WritableMap maxImageResolution = Arguments.createMap();
        maxImageResolution.putInt("width", 4096);
        maxImageResolution.putInt("height", 3072);
        capabilities.putMap("maxImageResolution", maxImageResolution);
        
        WritableMap maxVideoResolution = Arguments.createMap();
        maxVideoResolution.putInt("width", 3840);
        maxVideoResolution.putInt("height", 2160);
        capabilities.putMap("maxVideoResolution", maxVideoResolution);
        
        return capabilities;
    }

    private WritableMap getDeviceInfoInternal() {
        // Implementation for getting device info
        WritableMap deviceInfo = Arguments.createMap();
        deviceInfo.putString("platform", "android");
        deviceInfo.putString("version", Build.VERSION.RELEASE);
        deviceInfo.putString("model", Build.MODEL);
        deviceInfo.putString("manufacturer", Build.MANUFACTURER);
        return deviceInfo;
    }

    private boolean isCameraAvailableInternal() {
        // Implementation for checking camera availability
        return reactContext.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA);
    }

    private boolean isGalleryAvailableInternal() {
        // Implementation for checking gallery availability
        return true; // Gallery is always available on Android
    }

    private void handleCameraResult(Intent data) {
        // Implementation for handling camera result
        if (currentPromise != null) {
            // Process the captured image/video
            currentPromise.resolve(Arguments.createMap());
            currentPromise = null;
        }
    }

    private void handleGalleryResult(Intent data) {
        // Implementation for handling gallery result
        if (currentPromise != null) {
            // Process the selected media
            WritableArray assets = Arguments.createArray();
            // Add selected media to assets array
            WritableMap result = Arguments.createMap();
            result.putArray("assets", assets);
            result.putBoolean("canceled", false);
            currentPromise.resolve(result);
            currentPromise = null;
        }
    }

    private File createImageFile() {
        // Implementation for creating image file
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
        File storageDir = reactContext.getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        try {
            return File.createTempFile(imageFileName, ".jpg", storageDir);
        } catch (IOException e) {
            Log.e(TAG, "Failed to create image file", e);
            return null;
        }
    }

    private WritableMap processImageFile(File imageFile) {
        // Implementation for processing image file
        WritableMap asset = Arguments.createMap();
        asset.putString("uri", Uri.fromFile(imageFile).toString());
        asset.putString("type", "image");
        asset.putString("mimeType", "image/jpeg");
        asset.putInt("size", (int) imageFile.length());
        asset.putDouble("timestamp", imageFile.lastModified());
        return asset;
    }

    private WritableMap processVideoFile(File videoFile) {
        // Implementation for processing video file
        WritableMap asset = Arguments.createMap();
        asset.putString("uri", Uri.fromFile(videoFile).toString());
        asset.putString("type", "video");
        asset.putString("mimeType", "video/mp4");
        asset.putInt("size", (int) videoFile.length());
        asset.putDouble("timestamp", videoFile.lastModified());
        return asset;
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }
}