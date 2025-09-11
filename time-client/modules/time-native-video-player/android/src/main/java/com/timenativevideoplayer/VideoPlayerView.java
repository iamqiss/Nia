package com.timenativevideoplayer;

import android.content.Context;
import android.net.Uri;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.PlaybackException;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.ProgressiveMediaSource;
import com.google.android.exoplayer2.source.hls.HlsMediaSource;
import com.google.android.exoplayer2.source.dash.DashMediaSource;
import com.google.android.exoplayer2.ui.PlayerView;
import com.google.android.exoplayer2.upstream.DefaultDataSource;
import com.google.android.exoplayer2.util.Util;

import java.util.HashMap;
import java.util.Map;

public class VideoPlayerView extends FrameLayout implements Player.Listener {
    private static final String TAG = "VideoPlayerView";
    
    private final Context context;
    private final TimeNativeVideoPlayerViewManager viewManager;
    private final TimeNativeVideoPlayerModule module;
    
    private PlayerView playerView;
    private ExoPlayer player;
    private String playerId;
    private VideoAnalytics analytics;
    
    // Properties
    private ReadableMap source;
    private ReadableMap config;
    private String resizeMode = "contain";
    private boolean paused = false;
    private boolean muted = false;
    private float volume = 1.0f;
    private float playbackRate = 1.0f;
    private boolean repeat = false;
    
    // State
    private boolean isPrepared = false;
    private boolean isLoading = false;
    private boolean hasError = false;
    private String errorMessage;
    private long loadStartTime;
    private long playStartTime;
    private long totalPlayTime = 0;
    private long totalBufferTime = 0;
    private int rebufferCount = 0;
    private int qualityChanges = 0;
    private int errorCount = 0;

    public VideoPlayerView(@NonNull Context context, @NonNull TimeNativeVideoPlayerViewManager viewManager) {
        super(context);
        this.context = context;
        this.viewManager = viewManager;
        this.module = ((ReactContext) context).getNativeModule(TimeNativeVideoPlayerModule.class);
        this.playerId = generatePlayerId();
        
        initializeView();
        createPlayer();
    }

    private void initializeView() {
        playerView = new PlayerView(context);
        playerView.setUseController(false); // We'll handle controls ourselves
        playerView.setResizeMode(PlayerView.RESIZE_MODE_FIT);
        
        LayoutParams layoutParams = new LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        );
        addView(playerView, layoutParams);
    }

    private void createPlayer() {
        player = module.createPlayer(playerId);
        if (player != null) {
            player.addListener(this);
            playerView.setPlayer(player);
            analytics = module.getAnalytics(playerId);
            module.setPlayerView(playerId, this);
        }
    }

    private String generatePlayerId() {
        return "player_" + System.currentTimeMillis() + "_" + hashCode();
    }

    // Property setters
    public void setSource(@Nullable ReadableMap source) {
        this.source = source;
        if (source != null) {
            loadVideo();
        }
    }

    public void setConfig(@Nullable ReadableMap config) {
        this.config = config;
        applyConfig();
    }

    public void setResizeMode(@Nullable String resizeMode) {
        this.resizeMode = resizeMode != null ? resizeMode : "contain";
        if (playerView != null) {
            switch (this.resizeMode) {
                case "contain":
                    playerView.setResizeMode(PlayerView.RESIZE_MODE_FIT);
                    break;
                case "cover":
                    playerView.setResizeMode(PlayerView.RESIZE_MODE_ZOOM);
                    break;
                case "stretch":
                    playerView.setResizeMode(PlayerView.RESIZE_MODE_FILL);
                    break;
                default:
                    playerView.setResizeMode(PlayerView.RESIZE_MODE_FIT);
                    break;
            }
        }
    }

    public void setPaused(boolean paused) {
        this.paused = paused;
        if (player != null && isPrepared) {
            if (paused) {
                pause();
            } else {
                play();
            }
        }
    }

    public void setMuted(boolean muted) {
        this.muted = muted;
        if (player != null) {
            player.setVolume(muted ? 0.0f : volume);
        }
    }

    public void setVolume(float volume) {
        this.volume = volume;
        if (player != null) {
            player.setVolume(muted ? 0.0f : volume);
        }
    }

    public void setPlaybackRate(float playbackRate) {
        this.playbackRate = playbackRate;
        if (player != null && player.getPlaybackState() == Player.STATE_READY) {
            player.setPlaybackSpeed(playbackRate);
        }
    }

    public void setRepeat(boolean repeat) {
        this.repeat = repeat;
        if (player != null) {
            player.setRepeatMode(repeat ? Player.REPEAT_MODE_ONE : Player.REPEAT_MODE_OFF);
        }
    }

    private void loadVideo() {
        if (source == null || !source.hasKey("uri")) {
            return;
        }

        String uriString = source.getString("uri");
        if (uriString == null) {
            onError("Invalid URI");
            return;
        }

        loadStartTime = System.currentTimeMillis();
        isLoading = true;
        hasError = false;

        // Emit load start event
        emitEvent("onLoadStart", Arguments.createMap());

        try {
            Uri uri = Uri.parse(uriString);
            MediaItem mediaItem = MediaItem.fromUri(uri);
            
            // Add headers if provided
            if (source.hasKey("headers")) {
                ReadableMap headers = source.getMap("headers");
                if (headers != null) {
                    Map<String, String> headerMap = new HashMap<>();
                    // Convert ReadableMap to Map<String, String>
                    // This would need proper implementation
                }
            }

            if (player != null) {
                player.setMediaItem(mediaItem);
                player.prepare();
            }
        } catch (Exception e) {
            onError("Failed to load video: " + e.getMessage());
        }
    }

    private void applyConfig() {
        if (config == null || player == null) {
            return;
        }

        // Apply buffer settings
        if (config.hasKey("preloadBufferSize")) {
            // ExoPlayer buffer settings are configured in the module
        }

        // Apply volume and mute
        if (config.hasKey("volume")) {
            setVolume((float) config.getDouble("volume"));
        }

        if (config.hasKey("muted")) {
            setMuted(config.getBoolean("muted"));
        }

        // Apply hardware acceleration
        if (config.hasKey("hardwareAccelerationEnabled")) {
            // Hardware acceleration is configured in the module
        }
    }

    // Player control methods
    public void play() {
        if (player != null && isPrepared) {
            player.play();
            player.setPlaybackSpeed(playbackRate);
            playStartTime = System.currentTimeMillis();
            emitEvent("onPlaybackStateChange", createStateMap("playing"));
        }
    }

    public void pause() {
        if (player != null) {
            player.pause();
            
            // Update analytics
            if (playStartTime > 0) {
                long playDuration = System.currentTimeMillis() - playStartTime;
                totalPlayTime += playDuration;
                playStartTime = 0;
            }
            
            emitEvent("onPlaybackStateChange", createStateMap("paused"));
        }
    }

    public void stop() {
        if (player != null) {
            player.stop();
            
            // Update analytics
            if (playStartTime > 0) {
                long playDuration = System.currentTimeMillis() - playStartTime;
                totalPlayTime += playDuration;
                playStartTime = 0;
            }
            
            emitEvent("onPlaybackStateChange", createStateMap("stopped"));
        }
    }

    public void seek(long timeMs) {
        if (player != null && isPrepared) {
            player.seekTo(timeMs);
        }
    }

    public void setQuality(String quality) {
        // ExoPlayer doesn't have direct quality control, but we can adjust track selection
        // This would need proper implementation with TrackSelector
        qualityChanges++;
        WritableMap params = Arguments.createMap();
        params.putString("quality", quality);
        emitEvent("onQualityChange", params);
    }

    public void enterFullscreen() {
        // This would typically be handled by the activity
        WritableMap params = Arguments.createMap();
        params.putBoolean("isFullscreen", true);
        emitEvent("onFullscreenChange", params);
    }

    public void exitFullscreen() {
        WritableMap params = Arguments.createMap();
        params.putBoolean("isFullscreen", false);
        emitEvent("onFullscreenChange", params);
    }

    // Player.Listener implementation
    @Override
    public void onPlaybackStateChanged(int playbackState) {
        String state;
        switch (playbackState) {
            case Player.STATE_IDLE:
                state = "idle";
                break;
            case Player.STATE_BUFFERING:
                state = "buffering";
                if (playStartTime > 0) {
                    rebufferCount++;
                }
                break;
            case Player.STATE_READY:
                state = "ready";
                if (!isPrepared) {
                    isPrepared = true;
                    isLoading = false;
                    onLoad();
                }
                break;
            case Player.STATE_ENDED:
                state = "ended";
                emitEvent("onEnd", Arguments.createMap());
                break;
            default:
                state = "unknown";
                break;
        }
        
        emitEvent("onPlaybackStateChange", createStateMap(state));
    }

    @Override
    public void onPlayerError(@NonNull PlaybackException error) {
        onError(error.getMessage());
    }

    @Override
    public void onIsPlayingChanged(boolean isPlaying) {
        if (isPlaying && playStartTime == 0) {
            playStartTime = System.currentTimeMillis();
        } else if (!isPlaying && playStartTime > 0) {
            long playDuration = System.currentTimeMillis() - playStartTime;
            totalPlayTime += playDuration;
            playStartTime = 0;
        }
    }

    @Override
    public void onPlaybackParametersChanged(@NonNull com.google.android.exoplayer2.PlaybackParameters playbackParameters) {
        WritableMap params = Arguments.createMap();
        params.putDouble("rate", playbackParameters.speed);
        emitEvent("onPlaybackRateChange", params);
    }

    private void onLoad() {
        if (player == null) return;
        
        long loadTime = System.currentTimeMillis() - loadStartTime;
        
        WritableMap params = Arguments.createMap();
        params.putDouble("duration", player.getDuration() / 1000.0); // Convert to seconds
        
        // Get video dimensions
        if (player.getVideoFormat() != null) {
            WritableMap naturalSize = Arguments.createMap();
            naturalSize.putInt("width", player.getVideoFormat().width);
            naturalSize.putInt("height", player.getVideoFormat().height);
            params.putMap("naturalSize", naturalSize);
        }
        
        emitEvent("onLoad", params);
    }

    private void onError(String error) {
        hasError = true;
        errorMessage = error;
        isLoading = false;
        errorCount++;
        
        WritableMap params = Arguments.createMap();
        params.putString("error", error);
        emitEvent("onError", params);
    }

    private WritableMap createStateMap(String state) {
        WritableMap params = Arguments.createMap();
        params.putString("status", state);
        return params;
    }

    private void emitEvent(String eventName, WritableMap params) {
        if (viewManager != null) {
            viewManager.sendEvent(this, eventName, params);
        }
    }

    public void cleanup() {
        if (player != null) {
            player.removeListener(this);
            player.release();
            player = null;
        }
        
        if (module != null) {
            module.releasePlayer(playerId);
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        cleanup();
    }

    // Getters for analytics
    public long getTotalPlayTime() {
        return totalPlayTime;
    }

    public long getTotalBufferTime() {
        return totalBufferTime;
    }

    public int getRebufferCount() {
        return rebufferCount;
    }

    public int getQualityChanges() {
        return qualityChanges;
    }

    public int getErrorCount() {
        return errorCount;
    }

    public boolean isPrepared() {
        return isPrepared;
    }

    public boolean isLoading() {
        return isLoading;
    }

    public boolean hasError() {
        return hasError;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}