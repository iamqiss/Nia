package com.timenativevideoplayer;

import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.PlaybackException;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.ProgressiveMediaSource;
import com.google.android.exoplayer2.source.hls.HlsMediaSource;
import com.google.android.exoplayer2.source.dash.DashMediaSource;
import com.google.android.exoplayer2.upstream.DefaultDataSource;
import com.google.android.exoplayer2.util.Util;

import java.util.Map;

public class TimeNativeVideoPlayerViewManager extends SimpleViewManager<VideoPlayerView> {
    private static final String REACT_CLASS = "TimeNativeVideoPlayerView";
    private static final String PROP_SOURCE = "source";
    private static final String PROP_CONFIG = "config";
    private static final String PROP_RESIZE_MODE = "resizeMode";
    private static final String PROP_PAUSED = "paused";
    private static final String PROP_MUTED = "muted";
    private static final String PROP_VOLUME = "volume";
    private static final String PROP_PLAYBACK_RATE = "playbackRate";
    private static final String PROP_REPEAT = "repeat";

    // Event names
    private static final String EVENT_LOAD_START = "onLoadStart";
    private static final String EVENT_LOAD = "onLoad";
    private static final String EVENT_PROGRESS = "onProgress";
    private static final String EVENT_PLAYBACK_STATE_CHANGE = "onPlaybackStateChange";
    private static final String EVENT_PLAYBACK_RATE_CHANGE = "onPlaybackRateChange";
    private static final String EVENT_VOLUME_CHANGE = "onVolumeChange";
    private static final String EVENT_MUTE_CHANGE = "onMuteChange";
    private static final String EVENT_ERROR = "onError";
    private static final String EVENT_END = "onEnd";
    private static final String EVENT_FULLSCREEN_CHANGE = "onFullscreenChange";
    private static final String EVENT_QUALITY_CHANGE = "onQualityChange";
    private static final String EVENT_BITRATE_CHANGE = "onBitrateChange";
    private static final String EVENT_BUFFER_UPDATE = "onBufferUpdate";

    @Override
    @NonNull
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    @NonNull
    public VideoPlayerView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new VideoPlayerView(reactContext, this);
    }

    @ReactProp(name = PROP_SOURCE)
    public void setSource(VideoPlayerView view, @Nullable ReadableMap source) {
        view.setSource(source);
    }

    @ReactProp(name = PROP_CONFIG)
    public void setConfig(VideoPlayerView view, @Nullable ReadableMap config) {
        view.setConfig(config);
    }

    @ReactProp(name = PROP_RESIZE_MODE)
    public void setResizeMode(VideoPlayerView view, @Nullable String resizeMode) {
        view.setResizeMode(resizeMode);
    }

    @ReactProp(name = PROP_PAUSED, defaultBoolean = false)
    public void setPaused(VideoPlayerView view, boolean paused) {
        view.setPaused(paused);
    }

    @ReactProp(name = PROP_MUTED, defaultBoolean = false)
    public void setMuted(VideoPlayerView view, boolean muted) {
        view.setMuted(muted);
    }

    @ReactProp(name = PROP_VOLUME, defaultFloat = 1.0f)
    public void setVolume(VideoPlayerView view, float volume) {
        view.setVolume(volume);
    }

    @ReactProp(name = PROP_PLAYBACK_RATE, defaultFloat = 1.0f)
    public void setPlaybackRate(VideoPlayerView view, float playbackRate) {
        view.setPlaybackRate(playbackRate);
    }

    @ReactProp(name = PROP_REPEAT, defaultBoolean = false)
    public void setRepeat(VideoPlayerView view, boolean repeat) {
        view.setRepeat(repeat);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(EVENT_LOAD_START, MapBuilder.of("registrationName", EVENT_LOAD_START))
                .put(EVENT_LOAD, MapBuilder.of("registrationName", EVENT_LOAD))
                .put(EVENT_PROGRESS, MapBuilder.of("registrationName", EVENT_PROGRESS))
                .put(EVENT_PLAYBACK_STATE_CHANGE, MapBuilder.of("registrationName", EVENT_PLAYBACK_STATE_CHANGE))
                .put(EVENT_PLAYBACK_RATE_CHANGE, MapBuilder.of("registrationName", EVENT_PLAYBACK_RATE_CHANGE))
                .put(EVENT_VOLUME_CHANGE, MapBuilder.of("registrationName", EVENT_VOLUME_CHANGE))
                .put(EVENT_MUTE_CHANGE, MapBuilder.of("registrationName", EVENT_MUTE_CHANGE))
                .put(EVENT_ERROR, MapBuilder.of("registrationName", EVENT_ERROR))
                .put(EVENT_END, MapBuilder.of("registrationName", EVENT_END))
                .put(EVENT_FULLSCREEN_CHANGE, MapBuilder.of("registrationName", EVENT_FULLSCREEN_CHANGE))
                .put(EVENT_QUALITY_CHANGE, MapBuilder.of("registrationName", EVENT_QUALITY_CHANGE))
                .put(EVENT_BITRATE_CHANGE, MapBuilder.of("registrationName", EVENT_BITRATE_CHANGE))
                .put(EVENT_BUFFER_UPDATE, MapBuilder.of("registrationName", EVENT_BUFFER_UPDATE))
                .build();
    }

    public void sendEvent(VideoPlayerView view, String eventName, WritableMap params) {
        ReactContext reactContext = (ReactContext) view.getContext();
        reactContext.getJSModule(RCTEventEmitter.class)
                .receiveEvent(view.getId(), eventName, params);
    }
}