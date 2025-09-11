package com.timenativevideoplayer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class VideoAnalytics {
    private static final String TAG = "VideoAnalytics";
    
    // Performance metrics
    private long totalPlayTime = 0;
    private long totalBufferTime = 0;
    private int rebufferCount = 0;
    private double averageBitrate = 0;
    private int qualityChanges = 0;
    private int errorCount = 0;
    private double cacheHitRate = 0;
    private int networkRequests = 0;
    private long dataTransferred = 0;
    
    // User behavior metrics
    private long totalSessionTime = 0;
    private int sessionCount = 0;
    private double completionRate = 0;
    private int seekCount = 0;
    private int pauseCount = 0;
    private int fullscreenCount = 0;
    private String preferredQuality = "auto";
    
    // Event tracking
    private List<AnalyticsEvent> events = new ArrayList<>();
    private long sessionStartTime;
    private String sessionId;
    
    // Custom properties
    private Map<String, Object> customProperties = new HashMap<>();
    
    public VideoAnalytics() {
        this.sessionId = generateSessionId();
        this.sessionStartTime = System.currentTimeMillis();
    }
    
    private String generateSessionId() {
        return "session_" + System.currentTimeMillis() + "_" + hashCode();
    }
    
    // Event tracking methods
    public void trackEvent(String eventType, Map<String, Object> data) {
        AnalyticsEvent event = new AnalyticsEvent(eventType, System.currentTimeMillis(), data);
        events.add(event);
        
        // Keep only last 1000 events to prevent memory issues
        if (events.size() > 1000) {
            events = events.subList(events.size() - 1000, events.size());
        }
    }
    
    public void trackVideoLoadStart(String source) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        trackEvent("videoLoadStart", data);
    }
    
    public void trackVideoLoad(String source, long duration, int width, int height) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        data.put("duration", duration);
        data.put("width", width);
        data.put("height", height);
        data.put("loadTime", System.currentTimeMillis() - sessionStartTime);
        trackEvent("videoLoad", data);
    }
    
    public void trackVideoPlay(String source, long currentTime) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        data.put("currentTime", currentTime);
        trackEvent("videoPlay", data);
    }
    
    public void trackVideoPause(String source, long currentTime, long playDuration) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        data.put("currentTime", currentTime);
        data.put("playDuration", playDuration);
        trackEvent("videoPause", data);
    }
    
    public void trackVideoSeek(String source, long fromTime, long toTime) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        data.put("fromTime", fromTime);
        data.put("toTime", toTime);
        data.put("seekDistance", Math.abs(toTime - fromTime));
        seekCount++;
        trackEvent("videoSeek", data);
    }
    
    public void trackVideoEnd(String source, long totalPlayTime, double completionRate) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        data.put("totalPlayTime", totalPlayTime);
        data.put("completionRate", completionRate);
        trackEvent("videoEnd", data);
    }
    
    public void trackVideoError(String source, String error, String errorCode) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        data.put("error", error);
        data.put("errorCode", errorCode);
        errorCount++;
        trackEvent("videoError", data);
    }
    
    public void trackQualityChange(String source, String fromQuality, String toQuality) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        data.put("fromQuality", fromQuality);
        data.put("toQuality", toQuality);
        qualityChanges++;
        preferredQuality = toQuality;
        trackEvent("qualityChange", data);
    }
    
    public void trackBitrateChange(String source, long fromBitrate, long toBitrate) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        data.put("fromBitrate", fromBitrate);
        data.put("toBitrate", toBitrate);
        trackEvent("bitrateChange", data);
    }
    
    public void trackBufferStart(String source, long currentTime) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        data.put("currentTime", currentTime);
        trackEvent("bufferStart", data);
    }
    
    public void trackBufferEnd(String source, long bufferDuration) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        data.put("bufferDuration", bufferDuration);
        totalBufferTime += bufferDuration;
        trackEvent("bufferEnd", data);
    }
    
    public void trackFullscreenEnter(String source) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        fullscreenCount++;
        trackEvent("fullscreenEnter", data);
    }
    
    public void trackFullscreenExit(String source, long fullscreenDuration) {
        Map<String, Object> data = new HashMap<>();
        data.put("source", source);
        data.put("fullscreenDuration", fullscreenDuration);
        trackEvent("fullscreenExit", data);
    }
    
    // Performance metrics
    public void updatePlayTime(long playTime) {
        this.totalPlayTime += playTime;
    }
    
    public void updateBufferTime(long bufferTime) {
        this.totalBufferTime += bufferTime;
    }
    
    public void incrementRebufferCount() {
        this.rebufferCount++;
    }
    
    public void updateAverageBitrate(double bitrate) {
        this.averageBitrate = (this.averageBitrate + bitrate) / 2;
    }
    
    public void incrementNetworkRequests() {
        this.networkRequests++;
    }
    
    public void updateDataTransferred(long bytes) {
        this.dataTransferred += bytes;
    }
    
    public void updateCacheHitRate(double hitRate) {
        this.cacheHitRate = hitRate;
    }
    
    // Session management
    public void startNewSession() {
        this.sessionId = generateSessionId();
        this.sessionStartTime = System.currentTimeMillis();
        this.events.clear();
    }
    
    public void endSession() {
        this.totalSessionTime += System.currentTimeMillis() - sessionStartTime;
        this.sessionCount++;
    }
    
    // Getters
    public long getTotalPlayTime() {
        return totalPlayTime;
    }
    
    public long getTotalBufferTime() {
        return totalBufferTime;
    }
    
    public int getRebufferCount() {
        return rebufferCount;
    }
    
    public double getAverageBitrate() {
        return averageBitrate;
    }
    
    public int getQualityChanges() {
        return qualityChanges;
    }
    
    public int getErrorCount() {
        return errorCount;
    }
    
    public double getCacheHitRate() {
        return cacheHitRate;
    }
    
    public int getNetworkRequests() {
        return networkRequests;
    }
    
    public long getDataTransferred() {
        return dataTransferred;
    }
    
    public long getTotalSessionTime() {
        return totalSessionTime;
    }
    
    public int getSessionCount() {
        return sessionCount;
    }
    
    public double getCompletionRate() {
        return completionRate;
    }
    
    public int getSeekCount() {
        return seekCount;
    }
    
    public int getPauseCount() {
        return pauseCount;
    }
    
    public int getFullscreenCount() {
        return fullscreenCount;
    }
    
    public String getPreferredQuality() {
        return preferredQuality;
    }
    
    public String getSessionId() {
        return sessionId;
    }
    
    public long getSessionDuration() {
        return System.currentTimeMillis() - sessionStartTime;
    }
    
    public List<AnalyticsEvent> getEvents() {
        return new ArrayList<>(events);
    }
    
    public List<AnalyticsEvent> getEventsByType(String eventType) {
        List<AnalyticsEvent> filteredEvents = new ArrayList<>();
        for (AnalyticsEvent event : events) {
            if (eventType.equals(event.getEventType())) {
                filteredEvents.add(event);
            }
        }
        return filteredEvents;
    }
    
    public List<AnalyticsEvent> getEventsByTimeRange(long startTime, long endTime) {
        List<AnalyticsEvent> filteredEvents = new ArrayList<>();
        for (AnalyticsEvent event : events) {
            if (event.getTimestamp() >= startTime && event.getTimestamp() <= endTime) {
                filteredEvents.add(event);
            }
        }
        return filteredEvents;
    }
    
    public void setCustomProperty(String key, Object value) {
        customProperties.put(key, value);
    }
    
    public Object getCustomProperty(String key) {
        return customProperties.get(key);
    }
    
    public Map<String, Object> getCustomProperties() {
        return new HashMap<>(customProperties);
    }
    
    public void clearEvents() {
        events.clear();
    }
    
    // Analytics summary
    public Map<String, Object> getAnalyticsSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalPlayTime", totalPlayTime);
        summary.put("totalBufferTime", totalBufferTime);
        summary.put("rebufferCount", rebufferCount);
        summary.put("averageBitrate", averageBitrate);
        summary.put("qualityChanges", qualityChanges);
        summary.put("errorCount", errorCount);
        summary.put("cacheHitRate", cacheHitRate);
        summary.put("networkRequests", networkRequests);
        summary.put("dataTransferred", dataTransferred);
        summary.put("totalSessionTime", totalSessionTime);
        summary.put("sessionCount", sessionCount);
        summary.put("completionRate", completionRate);
        summary.put("seekCount", seekCount);
        summary.put("pauseCount", pauseCount);
        summary.put("fullscreenCount", fullscreenCount);
        summary.put("preferredQuality", preferredQuality);
        summary.put("sessionId", sessionId);
        summary.put("sessionDuration", getSessionDuration());
        summary.put("eventCount", events.size());
        return summary;
    }
    
    // Event class
    public static class AnalyticsEvent {
        private String eventType;
        private long timestamp;
        private Map<String, Object> data;
        
        public AnalyticsEvent(String eventType, long timestamp, Map<String, Object> data) {
            this.eventType = eventType;
            this.timestamp = timestamp;
            this.data = new HashMap<>(data);
        }
        
        public String getEventType() {
            return eventType;
        }
        
        public long getTimestamp() {
            return timestamp;
        }
        
        public Map<String, Object> getData() {
            return new HashMap<>(data);
        }
    }
}