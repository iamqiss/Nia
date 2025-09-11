package com.timenativevideoplayer;

import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.DefaultLoadControl;
import com.google.android.exoplayer2.DefaultRenderersFactory;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.LoadControl;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.PlaybackException;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.RenderersFactory;
import com.google.android.exoplayer2.audio.AudioAttributes;
import com.google.android.exoplayer2.source.DefaultMediaSourceFactory;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.ProgressiveMediaSource;
import com.google.android.exoplayer2.source.hls.HlsMediaSource;
import com.google.android.exoplayer2.source.dash.DashMediaSource;
import com.google.android.exoplayer2.upstream.DefaultDataSource;
import com.google.android.exoplayer2.upstream.DefaultHttpDataSource;
import com.google.android.exoplayer2.upstream.cache.Cache;
import com.google.android.exoplayer2.upstream.cache.LeastRecentlyUsedCacheEvictor;
import com.google.android.exoplayer2.upstream.cache.SimpleCache;
import com.google.android.exoplayer2.util.Util;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class TimeNativeVideoPlayerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private static final String TAG = "TimeNativeVideoPlayer";
    private static final String MODULE_NAME = "TimeNativeVideoPlayerModule";
    
    private final ReactApplicationContext reactContext;
    private final Map<String, ExoPlayer> players = new ConcurrentHashMap<>();
    private final Map<String, VideoPlayerView> playerViews = new ConcurrentHashMap<>();
    private final Map<String, VideoAnalytics> analytics = new ConcurrentHashMap<>();
    
    private Cache videoCache;
    private DefaultDataSource.Factory dataSourceFactory;
    private DefaultMediaSourceFactory mediaSourceFactory;
    private LoadControl loadControl;
    private RenderersFactory renderersFactory;
    
    private boolean hardwareAccelerationEnabled = true;
    private boolean analyticsEnabled = true;
    private int maxConcurrentPlayers = 5;
    private float globalVolume = 1.0f;
    private boolean globalMuted = false;

    public TimeNativeVideoPlayerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addLifecycleEventListener(this);
        initializeExoPlayer();
    }

    @Override
    @NonNull
    public String getName() {
        return MODULE_NAME;
    }

    private void initializeExoPlayer() {
        // Initialize cache
        File cacheDir = new File(reactContext.getCacheDir(), "exoplayer");
        if (!cacheDir.exists()) {
            cacheDir.mkdirs();
        }
        
        CacheEvictor cacheEvictor = new LeastRecentlyUsedCacheEvictor(500 * 1024 * 1024); // 500 MB
        videoCache = new SimpleCache(cacheDir, cacheEvictor);
        
        // Initialize data source factory with cache
        DefaultHttpDataSource.Factory httpDataSourceFactory = new DefaultHttpDataSource.Factory()
                .setUserAgent(Util.getUserAgent(reactContext, "TimeNativeVideoPlayer"))
                .setConnectTimeoutMs(DefaultHttpDataSource.DEFAULT_CONNECT_TIMEOUT_MILLIS)
                .setReadTimeoutMs(DefaultHttpDataSource.DEFAULT_READ_TIMEOUT_MILLIS)
                .setAllowCrossProtocolRedirects(true);
        
        dataSourceFactory = new DefaultDataSource.Factory(reactContext, httpDataSourceFactory)
                .setCache(videoCache);
        
        // Initialize media source factory
        mediaSourceFactory = new DefaultMediaSourceFactory(dataSourceFactory);
        
        // Initialize load control with optimized settings
        loadControl = new DefaultLoadControl.Builder()
                .setBufferDurationsMs(
                        5000,    // Min buffer
                        30000,   // Max buffer
                        2500,    // Buffer for playback
                        5000     // Buffer for playback after rebuffer
                )
                .setTargetBufferBytes(C.LENGTH_UNSET)
                .setPrioritizeTimeOverSizeThresholds(true)
                .build();
        
        // Initialize renderers factory with hardware acceleration
        renderersFactory = new DefaultRenderersFactory(reactContext)
                .setExtensionRendererMode(DefaultRenderersFactory.EXTENSION_RENDERER_MODE_PREFER)
                .setEnableDecoderFallback(true);
    }

    @ReactMethod
    public void setGlobalConfig(ReadableMap config) {
        if (config.hasKey("hardwareAccelerationEnabled")) {
            hardwareAccelerationEnabled = config.getBoolean("hardwareAccelerationEnabled");
        }
        if (config.hasKey("enableAnalytics")) {
            analyticsEnabled = config.getBoolean("enableAnalytics");
        }
        if (config.hasKey("maxConcurrentPlayers")) {
            maxConcurrentPlayers = config.getInt("maxConcurrentPlayers");
        }
    }

    @ReactMethod
    public void setHardwareAcceleration(boolean enabled) {
        hardwareAccelerationEnabled = enabled;
        // Recreate renderers factory with new setting
        renderersFactory = new DefaultRenderersFactory(reactContext)
                .setExtensionRendererMode(enabled ? 
                    DefaultRenderersFactory.EXTENSION_RENDERER_MODE_PREFER : 
                    DefaultRenderersFactory.EXTENSION_RENDERER_MODE_OFF)
                .setEnableDecoderFallback(true);
    }

    @ReactMethod
    public void setMaxConcurrentPlayers(int max) {
        maxConcurrentPlayers = max;
    }

    @ReactMethod
    public void setAudioFocusPolicy(ReadableMap policy) {
        // Implementation for audio focus policy
    }

    @ReactMethod
    public void setNetworkConditions(ReadableMap conditions) {
        // Implementation for network conditions
    }

    @ReactMethod
    public void setAnalyticsEnabled(boolean enabled) {
        analyticsEnabled = enabled;
    }

    @ReactMethod
    public void setBackgroundPlayback(boolean enabled) {
        // Implementation for background playback
    }

    @ReactMethod
    public void setDRMConfig(ReadableMap config) {
        // Implementation for DRM
    }

    @ReactMethod
    public void setQualityLimits(ReadableMap limits) {
        // Implementation for quality limits
    }

    // Cache management methods
    @ReactMethod
    public void configureCache(ReadableMap config) {
        // Implementation for cache configuration
    }

    @ReactMethod
    public void preloadVideo(ReadableMap source, String priority, Promise promise) {
        try {
            // Implementation for video preloading
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("PRELOAD_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void preloadVideos(ReadableArray sources, String priority, Promise promise) {
        try {
            // Implementation for multiple video preloading
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("PRELOAD_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void isVideoCached(ReadableMap source, Promise promise) {
        try {
            // Implementation for cache check
            promise.resolve(false);
        } catch (Exception e) {
            promise.reject("CACHE_CHECK_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getCachedVideoInfo(ReadableMap source, Promise promise) {
        try {
            // Implementation for cached video info
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("CACHE_INFO_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void removeVideoFromCache(ReadableMap source, Promise promise) {
        try {
            // Implementation for cache removal
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("CACHE_REMOVE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void clearCache(Promise promise) {
        try {
            if (videoCache != null) {
                videoCache.release();
                initializeExoPlayer();
            }
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("CACHE_CLEAR_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void clearCacheByAge(int maxAge, Promise promise) {
        try {
            // Implementation for cache clearing by age
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("CACHE_CLEAR_AGE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void clearCacheBySize(int maxSize, Promise promise) {
        try {
            // Implementation for cache clearing by size
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("CACHE_CLEAR_SIZE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getCacheStats(Promise promise) {
        try {
            WritableMap stats = Arguments.createMap();
            stats.putInt("memoryCacheSize", 0);
            stats.putInt("diskCacheSize", 0);
            stats.putDouble("hitRate", 0.0);
            stats.putDouble("missRate", 0.0);
            stats.putInt("evictionCount", 0);
            promise.resolve(stats);
        } catch (Exception e) {
            promise.reject("CACHE_STATS_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getCacheSize(Promise promise) {
        try {
            promise.resolve(0);
        } catch (Exception e) {
            promise.reject("CACHE_SIZE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getCacheDirectory(Promise promise) {
        try {
            File cacheDir = new File(reactContext.getCacheDir(), "exoplayer");
            promise.resolve(cacheDir.getAbsolutePath());
        } catch (Exception e) {
            promise.reject("CACHE_DIR_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void setCacheDirectory(String path, Promise promise) {
        try {
            // Implementation for setting cache directory
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("CACHE_DIR_SET_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void setCompressionEnabled(boolean enabled) {
        // Implementation for compression
    }

    @ReactMethod
    public void setMaxCacheSize(int size) {
        // Implementation for max cache size
    }

    @ReactMethod
    public void setMaxCacheAge(int age) {
        // Implementation for max cache age
    }

    @ReactMethod
    public void setDiskCacheEnabled(boolean enabled) {
        // Implementation for disk cache
    }

    @ReactMethod
    public void setMemoryCacheEnabled(boolean enabled) {
        // Implementation for memory cache
    }

    @ReactMethod
    public void getCacheHitRate(Promise promise) {
        try {
            promise.resolve(0.0);
        } catch (Exception e) {
            promise.reject("CACHE_HIT_RATE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void optimizeCache(Promise promise) {
        try {
            // Implementation for cache optimization
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("CACHE_OPTIMIZE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getCacheRecommendations(Promise promise) {
        try {
            WritableMap recommendations = Arguments.createMap();
            recommendations.putInt("recommendedMaxSize", 100 * 1024 * 1024);
            recommendations.putInt("recommendedMaxAge", 7 * 24 * 60 * 60 * 1000);
            recommendations.putBoolean("shouldEnableCompression", true);
            recommendations.putBoolean("shouldEnableDiskCache", true);
            recommendations.putBoolean("shouldEnableMemoryCache", true);
            promise.resolve(recommendations);
        } catch (Exception e) {
            promise.reject("CACHE_RECOMMENDATIONS_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void exportCacheData(Promise promise) {
        try {
            WritableMap data = Arguments.createMap();
            data.putArray("videos", Arguments.createArray());
            data.putInt("totalSize", 0);
            data.putDouble("exportDate", System.currentTimeMillis());
            promise.resolve(data);
        } catch (Exception e) {
            promise.reject("CACHE_EXPORT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void importCacheData(ReadableMap data, Promise promise) {
        try {
            // Implementation for cache data import
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("CACHE_IMPORT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void setEvictionPolicy(String policy) {
        // Implementation for eviction policy
    }

    @ReactMethod
    public void getCacheHealth(Promise promise) {
        try {
            WritableMap health = Arguments.createMap();
            health.putString("status", "healthy");
            health.putArray("issues", Arguments.createArray());
            health.putArray("recommendations", Arguments.createArray());
            promise.resolve(health);
        } catch (Exception e) {
            promise.reject("CACHE_HEALTH_ERROR", e.getMessage());
        }
    }

    // Analytics methods
    @ReactMethod
    public void getPerformanceMetrics(Promise promise) {
        try {
            WritableMap metrics = Arguments.createMap();
            metrics.putDouble("averageLoadTime", 0.0);
            metrics.putDouble("averageBufferTime", 0.0);
            metrics.putInt("totalDataTransferred", 0);
            metrics.putDouble("cacheEfficiency", 0.0);
            metrics.putDouble("errorRate", 0.0);
            promise.resolve(metrics);
        } catch (Exception e) {
            promise.reject("PERFORMANCE_METRICS_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getUserBehaviorMetrics(Promise promise) {
        try {
            WritableMap metrics = Arguments.createMap();
            metrics.putDouble("totalPlayTime", 0.0);
            metrics.putDouble("averageSessionLength", 0.0);
            metrics.putDouble("completionRate", 0.0);
            metrics.putDouble("seekFrequency", 0.0);
            metrics.putDouble("pauseFrequency", 0.0);
            metrics.putDouble("fullscreenUsage", 0.0);
            metrics.putString("qualityPreference", "auto");
            promise.resolve(metrics);
        } catch (Exception e) {
            promise.reject("BEHAVIOR_METRICS_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void setCustomProperties(ReadableMap properties) {
        // Implementation for custom properties
    }

    @ReactMethod
    public void getAnalyticsSummary(Promise promise) {
        try {
            WritableMap summary = Arguments.createMap();
            summary.putInt("totalSessions", 0);
            summary.putDouble("totalPlayTime", 0.0);
            summary.putDouble("averageSessionLength", 0.0);
            summary.putArray("mostPlayedVideos", Arguments.createArray());
            summary.putDouble("errorRate", 0.0);
            summary.putDouble("averageLoadTime", 0.0);
            summary.putDouble("cacheEfficiency", 0.0);
            promise.resolve(summary);
        } catch (Exception e) {
            promise.reject("ANALYTICS_SUMMARY_ERROR", e.getMessage());
        }
    }

    // System capabilities
    @ReactMethod
    public void getSystemCapabilities(Promise promise) {
        try {
            WritableMap capabilities = Arguments.createMap();
            WritableMap maxResolution = Arguments.createMap();
            maxResolution.putInt("width", 1920);
            maxResolution.putInt("height", 1080);
            capabilities.putMap("maxResolution", maxResolution);
            
            WritableArray supportedFormats = Arguments.createArray();
            supportedFormats.pushString("mp4");
            supportedFormats.pushString("webm");
            supportedFormats.pushString("3gp");
            capabilities.putArray("supportedFormats", supportedFormats);
            
            capabilities.putBoolean("hardwareAccelerationSupported", true);
            capabilities.putInt("maxBitrate", 8000000);
            promise.resolve(capabilities);
        } catch (Exception e) {
            promise.reject("SYSTEM_CAPABILITIES_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getDeviceOptimizations(Promise promise) {
        try {
            WritableMap optimizations = Arguments.createMap();
            optimizations.putInt("recommendedBufferSize", 30);
            optimizations.putInt("recommendedBitrate", 2000000);
            optimizations.putString("recommendedQuality", "auto");
            optimizations.putBoolean("hardwareAccelerationRecommended", true);
            promise.resolve(optimizations);
        } catch (Exception e) {
            promise.reject("DEVICE_OPTIMIZATIONS_ERROR", e.getMessage());
        }
    }

    // Global player control
    @ReactMethod
    public void pauseAllPlayers() {
        for (ExoPlayer player : players.values()) {
            if (player != null) {
                player.pause();
            }
        }
    }

    @ReactMethod
    public void resumeAllPlayers() {
        for (ExoPlayer player : players.values()) {
            if (player != null && player.getPlaybackState() == Player.STATE_READY) {
                player.play();
            }
        }
    }

    @ReactMethod
    public void setGlobalVolume(float volume) {
        globalVolume = volume;
        for (ExoPlayer player : players.values()) {
            if (player != null) {
                player.setVolume(volume);
            }
        }
    }

    @ReactMethod
    public void setGlobalMute(boolean muted) {
        globalMuted = muted;
        for (ExoPlayer player : players.values()) {
            if (player != null) {
                player.setVolume(muted ? 0.0f : globalVolume);
            }
        }
    }

    // Helper methods
    public ExoPlayer createPlayer(String playerId) {
        if (players.size() >= maxConcurrentPlayers) {
            // Remove oldest player
            String oldestPlayerId = players.keySet().iterator().next();
            releasePlayer(oldestPlayerId);
        }
        
        ExoPlayer player = new ExoPlayer.Builder(reactContext, renderersFactory)
                .setLoadControl(loadControl)
                .setMediaSourceFactory(mediaSourceFactory)
                .build();
        
        // Configure audio attributes
        AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setUsage(C.USAGE_MEDIA)
                .setContentType(C.AUDIO_CONTENT_TYPE_MOVIE)
                .build();
        player.setAudioAttributes(audioAttributes, true);
        
        players.put(playerId, player);
        return player;
    }

    public void releasePlayer(String playerId) {
        ExoPlayer player = players.remove(playerId);
        if (player != null) {
            player.release();
        }
        
        VideoPlayerView view = playerViews.remove(playerId);
        if (view != null) {
            view.cleanup();
        }
        
        analytics.remove(playerId);
    }

    public ExoPlayer getPlayer(String playerId) {
        return players.get(playerId);
    }

    public VideoPlayerView getPlayerView(String playerId) {
        return playerViews.get(playerId);
    }

    public void setPlayerView(String playerId, VideoPlayerView view) {
        playerViews.put(playerId, view);
    }

    public VideoAnalytics getAnalytics(String playerId) {
        return analytics.computeIfAbsent(playerId, k -> new VideoAnalytics());
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public void onHostResume() {
        // Resume all players when app resumes
        resumeAllPlayers();
    }

    @Override
    public void onHostPause() {
        // Pause all players when app pauses
        pauseAllPlayers();
    }

    @Override
    public void onHostDestroy() {
        // Release all players when app is destroyed
        for (String playerId : new HashMap<>(players.keySet())) {
            releasePlayer(playerId);
        }
        
        if (videoCache != null) {
            videoCache.release();
        }
    }
}