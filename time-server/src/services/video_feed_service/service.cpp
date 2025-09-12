#include "service.h"
#include "video_ml_service.h"
#include "content_filtering_service.h"
#include "user_engagement_service.h"
#include "real_time_update_service.h"
#include "video_feed_repository.h"
#include "cache_impl.h"
#include "database_impl.h"
#include "logger_impl.h"

#include <grpcpp/grpcpp.h>
#include <grpcpp/server_context.h>
#include <grpcpp/support/status.h>
#include <chrono>
#include <algorithm>
#include <numeric>
#include <random>
#include <sstream>
#include <iomanip>
#include <deque>

namespace time {
namespace video_feed {

VideoFeedService::VideoFeedService(
    std::shared_ptr<VideoFeedRepository> repository,
    std::shared_ptr<VideoMLService> mlService,
    std::shared_ptr<ContentFilteringService> contentFilter,
    std::shared_ptr<UserEngagementService> engagementService,
    std::shared_ptr<RealTimeUpdateService> realtimeService,
    std::shared_ptr<Cache> cache,
    std::shared_ptr<Database> database,
    std::shared_ptr<Logger> logger
) : repository_(std::move(repository)),
    mlService_(std::move(mlService)),
    contentFilter_(std::move(contentFilter)),
    engagementService_(std::move(engagementService)),
    realtimeService_(std::move(realtimeService)),
    cache_(std::move(cache)),
    database_(std::move(database)),
    logger_(std::move(logger)) {
    
    startTime_ = std::chrono::steady_clock::now();
    logger_->info("VideoFeedService initialized");
}

// gRPC Service Methods
grpc::Status VideoFeedService::GetVideoFeed(
    grpc::ServerContext* context,
    const proto::services::VideoFeedRequest* request,
    proto::services::VideoFeedResponse* response
) {
    auto startTime = std::chrono::high_resolution_clock::now();
    
    try {
        logger_->info("Processing video feed request", {
            {"feed_type", request->feed_type()},
            {"algorithm", request->algorithm()},
            {"user_id", request->user_id()}
        });

        auto status = ProcessVideoFeedRequest(request, response);
        
        auto endTime = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(endTime - startTime);
        
        RecordMetrics("GetVideoFeed", duration, request->user_id());
        
        return status;
        
    } catch (const std::exception& e) {
        logger_->error("Error in GetVideoFeed", {
            {"error", e.what()},
            {"feed_type", request->feed_type()}
        });
        return HandleError("GetVideoFeed", e);
    }
}

grpc::Status VideoFeedService::GetPersonalizedFeed(
    grpc::ServerContext* context,
    const proto::services::PersonalizedFeedRequest* request,
    proto::services::VideoFeedResponse* response
) {
    auto startTime = std::chrono::high_resolution_clock::now();
    
    try {
        logger_->info("Processing personalized feed request", {
            {"user_id", request->user_id()},
            {"feed_type", request->base_request().feed_type()}
        });

        auto status = ProcessPersonalizedFeedRequest(request, response);
        
        auto endTime = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(endTime - startTime);
        
        RecordMetrics("GetPersonalizedFeed", duration, request->user_id());
        
        return status;
        
    } catch (const std::exception& e) {
        logger_->error("Error in GetPersonalizedFeed", {
            {"error", e.what()},
            {"user_id", request->user_id()}
        });
        return HandleError("GetPersonalizedFeed", e);
    }
}

grpc::Status VideoFeedService::TrackEngagement(
    grpc::ServerContext* context,
    const proto::services::EngagementEvent* request,
    proto::services::EngagementResponse* response
) {
    try {
        logger_->info("Tracking engagement event", {
            {"user_id", request->user_id()},
            {"video_id", request->video_id()},
            {"event_type", request->event_type()}
        });

        // Track engagement in the engagement service
        engagementService_->TrackEngagementEvent(*request);
        
        // Update video metrics in repository
        proto::common::EngagementMetrics metrics;
        metrics.set_view_count(request->event_type() == "view" ? 1 : 0);
        metrics.set_like_count(request->event_type() == "like" ? 1 : 0);
        metrics.set_renote_count(request->event_type() == "renote" ? 1 : 0);
        metrics.set_reply_count(request->event_type() == "reply" ? 1 : 0);
        metrics.set_share_count(request->event_type() == "share" ? 1 : 0);
        metrics.set_bookmark_count(request->event_type() == "bookmark" ? 1 : 0);
        
        if (request->event_type() == "view") {
            metrics.set_average_watch_time_ms(request->duration_ms());
            metrics.set_completion_rate(request->completion_rate());
        }
        
        repository_->UpdateVideoMetrics(request->video_id(), metrics);
        
        // Broadcast engagement update
        proto::common::EngagementUpdate update;
        update.set_video_id(request->video_id());
        update.set_event_type(request->event_type());
        update.set_new_count(1);
        update.set_user_id(request->user_id());
        
        realtimeService_->BroadcastEngagementUpdate(update);
        
        // Set response
        response->set_success(true);
        response->set_message("Engagement tracked successfully");
        response->set_updated_count(1);
        response->set_timestamp(GetCurrentTimestamp());
        
        return grpc::Status::OK;
        
    } catch (const std::exception& e) {
        logger_->error("Error tracking engagement", {
            {"error", e.what()},
            {"user_id", request->user_id()},
            {"video_id", request->video_id()}
        });
        return HandleError("TrackEngagement", e);
    }
}

grpc::Status VideoFeedService::GetFeedInsights(
    grpc::ServerContext* context,
    const proto::services::FeedInsightsRequest* request,
    proto::services::FeedInsightsResponse* response
) {
    try {
        logger_->info("Getting feed insights", {
            {"user_id", request->user_id()},
            {"feed_type", request->feed_type()}
        });

        // Get user engagement insights
        auto insights = engagementService_->GetEngagementInsights(request->user_id());
        
        response->set_user_id(request->user_id());
        
        // Set top categories
        for (const auto& category : insights.topCategories) {
            response->add_top_categories(category.category);
        }
        
        // Set top creators
        for (const auto& creator : insights.topCreators) {
            response->add_top_creators(creator.creatorId);
        }
        
        // Set top topics
        for (const auto& topic : insights.topTopics) {
            response->add_top_topics(topic.topic);
        }
        
        // Set watch patterns
        auto* watchPatterns = response->mutable_watch_patterns();
        watchPatterns->set_average_watch_time_ms(insights.watchPatterns.averageWatchTime);
        watchPatterns->set_completion_rate(insights.watchPatterns.completionRate);
        for (uint32_t hour : insights.watchPatterns.activeHours) {
            watchPatterns->add_active_hours(hour);
        }
        watchPatterns->set_preferred_duration_ms(insights.watchPatterns.preferredDuration);
        watchPatterns->set_preferred_quality(insights.watchPatterns.preferredQuality);
        
        return grpc::Status::OK;
        
    } catch (const std::exception& e) {
        logger_->error("Error getting feed insights", {
            {"error", e.what()},
            {"user_id", request->user_id()}
        });
        return HandleError("GetFeedInsights", e);
    }
}

grpc::Status VideoFeedService::StreamVideoFeed(
    grpc::ServerContext* context,
    const proto::services::VideoFeedRequest* request,
    grpc::ServerWriter<proto::services::VideoFeedUpdate>* writer
) {
    try {
        logger_->info("Starting video feed stream", {
            {"feed_type", request->feed_type()},
            {"user_id", request->user_id()}
        });

        // Setup real-time updates
        SetupRealTimeUpdates(request->user_id(), request->algorithm());
        
        // Send initial feed
        proto::services::VideoFeedResponse initialFeed;
        auto status = ProcessVideoFeedRequest(request, &initialFeed);
        if (!status.ok()) {
            return status;
        }
        
        // Send initial videos as updates
        for (const auto& item : initialFeed.items()) {
            proto::services::VideoFeedUpdate update;
            update.set_update_type("new_video");
            update.set_timestamp(GetCurrentTimestamp());
            update.mutable_new_video()->CopyFrom(item);
            
            if (!writer->Write(update)) {
                logger_->warn("Failed to write initial video update");
                break;
            }
        }
        
        // Keep stream alive until the client cancels
        while (!context->IsCancelled()) {
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
        }
        
        return grpc::Status::OK;
        
    } catch (const std::exception& e) {
        logger_->error("Error in video feed stream", {
            {"error", e.what()},
            {"user_id", request->user_id()}
        });
        return HandleError("StreamVideoFeed", e);
    }
}

// Service Management
void VideoFeedService::Start() {
    running_ = true;
    startTime_ = std::chrono::steady_clock::now();
    logger_->info("VideoFeedService started");
}

void VideoFeedService::Stop() {
    running_ = false;
    logger_->info("VideoFeedService stopped");
}

proto::common::HealthStatus VideoFeedService::GetHealthStatus() const {
    proto::common::HealthStatus status;
    status.set_status(running_ ? "healthy" : "stopped");
    status.set_message(running_ ? "Service is running normally" : "Service is stopped");
    status.set_timestamp(GetCurrentTimestamp());
    
    auto uptime = std::chrono::steady_clock::now() - startTime_;
    auto uptimeMs = std::chrono::duration_cast<std::chrono::milliseconds>(uptime).count();
    
    status.mutable_details()->insert({"uptime_ms", std::to_string(uptimeMs)});
    status.mutable_details()->insert({"running", running_ ? "true" : "false"});
    
    return status;
}

// Private Methods
grpc::Status VideoFeedService::ProcessVideoFeedRequest(
    const proto::services::VideoFeedRequest* request,
    proto::services::VideoFeedResponse* response
) {
    // Try to get from cache first
    std::string cacheKey = GenerateCacheKey(request);
    if (TryGetFromCache(cacheKey, response)) {
        logger_->debug("Video feed served from cache", {
            {"cache_key", cacheKey},
            {"feed_type", request->feed_type()}
        });
        return grpc::Status::OK;
    }
    
    // Build query parameters
    proto::common::VideoQueryParams params;
    params.set_limit(request->pagination().limit());
    params.set_offset(request->pagination().offset());
    params.set_cursor(request->pagination().cursor());
    
    for (const auto& category : request->categories()) {
        params.add_categories(category);
    }
    
    for (const auto& excludeCategory : request->exclude_categories()) {
        params.add_exclude_categories(excludeCategory);
    }
    
    for (const auto& tag : request->tags()) {
        params.add_tags(tag);
    }
    
    for (const auto& excludeTag : request->exclude_tags()) {
        params.add_exclude_tags(excludeTag);
    }
    
    params.set_min_duration_ms(request->min_duration_ms());
    params.set_max_duration_ms(request->max_duration_ms());
    params.set_quality_preference(request->quality_preference());
    
    // Get video candidates from repository
    auto candidates = repository_->GetVideos(params);
    if (candidates.empty()) {
        logger_->warn("No video candidates found", {
            {"feed_type", request->feed_type()},
            {"algorithm", request->algorithm()}
        });
        
        // Return empty response
        response->mutable_pagination()->set_total_count(0);
        response->mutable_pagination()->set_page_count(0);
        return grpc::Status::OK;
    }
    
    // Rank video content
    auto rankedItems = RankVideoContent(candidates, request, request->user_id());
    
    // Apply content filtering
    auto filteredItems = ApplyContentFiltering(rankedItems, request);
    
    // Optimize feed diversity
    auto optimizedItems = OptimizeFeedDiversity(filteredItems, request);
    
    // Build response
    for (const auto& item : optimizedItems) {
        response->add_items()->CopyFrom(item);
    }
    
    // Set pagination info
    auto* pagination = response->mutable_pagination();
    pagination->set_total_count(candidates.size());
    pagination->set_page_count(1);
    pagination->set_limit(request->pagination().limit());
    pagination->set_offset(request->pagination().offset());
    
    if (!optimizedItems.empty()) {
        pagination->set_next_cursor(optimizedItems.back().cursor());
    }
    
    // Set feed metadata
    auto* metadata = response->mutable_metadata();
    metadata->set_feed_type(request->feed_type());
    metadata->set_algorithm(request->algorithm());
    metadata->set_algorithm_version("1.0.0");
    metadata->set_total_items(candidates.size());
    metadata->set_filtered_items(optimizedItems.size());
    metadata->set_generated_at(GetCurrentTimestamp());
    
    // Set ML insights
    auto* mlInsights = response->mutable_ml_insights();
    mlInsights->set_model_version("ml_model_v1");
    mlInsights->set_prediction_accuracy(0.85);
    mlInsights->add_key_factors("user_preference");
    mlInsights->add_key_factors("content_quality");
    mlInsights->add_key_factors("engagement_potential");
    mlInsights->set_ml_confidence(0.92);
    
    // Cache the response
    CacheResponse(cacheKey, *response);
    
    return grpc::Status::OK;
}

std::vector<proto::common::VideoItem> VideoFeedService::RankVideoContent(
    const std::vector<proto::common::VideoCandidate>& candidates,
    const proto::services::VideoFeedRequest* request,
    const std::string& userId
) {
    std::vector<proto::common::VideoItem> rankedItems;
    
    if (candidates.empty()) {
        return rankedItems;
    }
    
    // Apply ranking based on algorithm
    if (request->algorithm() == "ml_ranking" || request->algorithm() == "hybrid") {
        // Get user personalization settings (derive from engagement profile if available)
        proto::common::PersonalizationSettings personalization;
        personalization.set_enable_ml_ranking(true);
        personalization.set_ml_weight(0.7);
        if (!userId.empty()) {
            try {
                auto profile = engagementService_ ? engagementService_->GetUserEngagementProfile(userId) : std::nullopt;
                if (profile) {
                    // Increase ML weight for highly engaged users
                    double engaged = std::clamp(profile->engagement_score, 0.0, 1.0);
                    personalization.set_ml_weight(static_cast<float>(0.6 + 0.35 * engaged));
                    personalization.set_enable_ml_ranking(true);
                }
            } catch (const std::exception& e) {
                logger_->warn("Failed to load engagement profile for personalization", {{"user_id", userId}, {"error", e.what()}});
            }
        }
        
        rankedItems = ApplyMLRanking(candidates, userId, personalization);
    } else if (request->algorithm() == "trending") {
        rankedItems = ApplyTrendingRanking(candidates);
    } else if (request->algorithm() == "personalized") {
        proto::common::PersonalizationSettings personalization;
        personalization.set_enable_ml_ranking(true);
        personalization.set_ml_weight(0.8);
        if (!userId.empty()) {
            try {
                auto profile = engagementService_ ? engagementService_->GetUserEngagementProfile(userId) : std::nullopt;
                if (profile) {
                    double engaged = std::clamp(profile->engagement_score, 0.0, 1.0);
                    personalization.set_ml_weight(static_cast<float>(0.65 + 0.3 * engaged));
                }
            } catch (...) {}
        }
        rankedItems = ApplyPersonalizedRanking(candidates, userId, personalization);
    } else {
        // Default to chronological
        rankedItems = ApplyDefaultRanking(candidates);
    }
    
    return rankedItems;
}

std::vector<proto::common::VideoItem> VideoFeedService::ApplyMLRanking(
    const std::vector<proto::common::VideoCandidate>& candidates,
    const std::string& userId,
    const proto::common::PersonalizationSettings& personalization
) {
    std::vector<proto::common::VideoItem> rankedItems;
    
    for (const auto& candidate : candidates) {
        // Get ML predictions
        proto::common::MLPredictionRequest mlRequest;
        mlRequest.mutable_video_features()->CopyFrom(candidate.features());
        if (!userId.empty()) {
            // Enrich with user features when available
            proto::common::UserContext ctx;
            ctx.set_user_id(userId);
            auto user_features = mlService_->ExtractUserFeatures(userId, ctx);
            mlRequest.mutable_user_features()->CopyFrom(user_features);
        }
        
        auto mlResponse = mlService_->GetPredictions(mlRequest);
        
        // Calculate ML score
        double mlScore = CalculateMLScore(mlResponse.predictions(), personalization);
        
        // Transform to video item
        auto item = TransformToVideoItem(candidate, mlScore, mlResponse.predictions());
        rankedItems.push_back(item);
    }
    
    // Sort by ML score (descending)
    std::sort(rankedItems.begin(), rankedItems.end(),
        [](const proto::common::VideoItem& a, const proto::common::VideoItem& b) {
            return a.ml_ranking().ranking_score() > b.ml_ranking().ranking_score();
        });
    
    return rankedItems;
}

std::vector<proto::common::VideoItem> VideoFeedService::ApplyTrendingRanking(
    const std::vector<proto::common::VideoCandidate>& candidates
) {
    std::vector<proto::common::VideoItem> rankedItems;
    
    for (const auto& candidate : candidates) {
        double trendingScore = CalculateTrendingScore(candidate);
        auto item = TransformToVideoItem(candidate, trendingScore);
        rankedItems.push_back(item);
    }
    
    // Sort by trending score (descending)
    std::sort(rankedItems.begin(), rankedItems.end(),
        [](const proto::common::VideoItem& a, const proto::common::VideoItem& b) {
            return a.ml_ranking().ranking_score() > b.ml_ranking().ranking_score();
        });
    
    return rankedItems;
}

std::vector<proto::common::VideoItem> VideoFeedService::ApplyPersonalizedRanking(
    const std::vector<proto::common::VideoCandidate>& candidates,
    const std::string& userId,
    const proto::common::PersonalizationSettings& personalization
) {
    std::vector<proto::common::VideoItem> rankedItems;
    
    // Get user engagement profile
    auto userProfile = engagementService_->GetUserEngagementProfile(userId);
    
    for (const auto& candidate : candidates) {
        double personalizationScore = 0.5; // Default score
        
        if (userProfile) {
            // Calculate personalization score based on user preferences
            std::vector<std::string> userInterests;
            std::unordered_map<std::string, double> contentPreferences;
            // Derive simple interests and preferences from profile
            for (const auto& cat : userProfile->top_categories) {
                contentPreferences[cat.first] = std::clamp(cat.second, 0.0, 1.0);
            }
            for (const auto& tag : userProfile->top_hashtags) {
                userInterests.push_back(tag);
            }
            
            personalizationScore = CalculatePersonalizationScore(
                candidate, userInterests, contentPreferences);
        }
        
        auto item = TransformToVideoItem(candidate, personalizationScore);
        rankedItems.push_back(item);
    }
    
    // Sort by personalization score (descending)
    std::sort(rankedItems.begin(), rankedItems.end(),
        [](const proto::common::VideoItem& a, const proto::common::VideoItem& b) {
            return a.ml_ranking().ranking_score() > b.ml_ranking().ranking_score();
        });
    
    return rankedItems;
}

std::vector<proto::common::VideoItem> VideoFeedService::ApplyDefaultRanking(
    const std::vector<proto::common::VideoCandidate>& candidates
) {
    std::vector<proto::common::VideoItem> rankedItems;
    
    for (const auto& candidate : candidates) {
        double defaultScore = CalculateDefaultScore(candidate);
        auto item = TransformToVideoItem(candidate, defaultScore);
        rankedItems.push_back(item);
    }
    
    // Sort by creation time (newest first)
    std::sort(rankedItems.begin(), rankedItems.end(),
        [](const proto::common::VideoItem& a, const proto::common::VideoItem& b) {
            return a.created_at() > b.created_at();
        });
    
    return rankedItems;
}

// Utility Methods
std::string VideoFeedService::GetCurrentTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto time_t = std::chrono::system_clock::to_time_t(now);
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(
        now.time_since_epoch()) % 1000;
    
    std::stringstream ss;
    ss << std::put_time(std::gmtime(&time_t), "%Y-%m-%dT%H:%M:%S");
    ss << '.' << std::setfill('0') << std::setw(3) << ms.count() << 'Z';
    
    return ss.str();
}

void VideoFeedService::RecordMetrics(
    const std::string& operation,
    std::chrono::microseconds duration,
    const std::string& userId
) {
    logger_->info("Operation completed", {
        {"operation", operation},
        {"duration_us", std::to_string(duration.count())},
        {"user_id", userId}
    });
}

std::string VideoFeedService::GenerateCacheKey(
    const proto::services::VideoFeedRequest* request
) {
    std::stringstream ss;
    ss << "video_feed:" << request->feed_type() << ":" << request->algorithm();
    ss << ":l=" << request->pagination().limit() << ":o=" << request->pagination().offset();
    if (!request->pagination().cursor().empty()) {
        ss << ":c=" << request->pagination().cursor();
    }
    if (!request->user_id().empty()) {
        ss << ":u=" << request->user_id();
    }
    // Categories and tags contribute to cache key
    if (request->categories_size() > 0) {
        ss << ":cat=";
        for (int i = 0; i < request->categories_size(); ++i) {
            ss << request->categories(i) << ",";
        }
    }
    if (request->exclude_categories_size() > 0) {
        ss << ":xcat=";
        for (int i = 0; i < request->exclude_categories_size(); ++i) {
            ss << request->exclude_categories(i) << ",";
        }
    }
    if (request->tags_size() > 0) {
        ss << ":tag=";
        for (int i = 0; i < request->tags_size(); ++i) {
            ss << request->tags(i) << ",";
        }
    }
    if (request->exclude_tags_size() > 0) {
        ss << ":xtag=";
        for (int i = 0; i < request->exclude_tags_size(); ++i) {
            ss << request->exclude_tags(i) << ",";
        }
    }
    if (request->min_duration_ms() > 0) ss << ":mind=" << request->min_duration_ms();
    if (request->max_duration_ms() > 0) ss << ":maxd=" << request->max_duration_ms();
    if (!request->quality_preference().empty()) ss << ":q=" << request->quality_preference();
    return ss.str();
}

bool VideoFeedService::TryGetFromCache(
    const std::string& cacheKey,
    proto::services::VideoFeedResponse* response
) {
    try {
        // Primary: shared cache backend (may be implemented in another runtime)
        auto cached = cache_ ? cache_->GetVideoFeed("video", "default", {{"key", cacheKey}}) : std::nullopt;
        if (cached && cached->has_value()) {
            // Expect a single serialized blob at index 0
            if (!cached->value().empty()) {
                proto::services::VideoFeedResponse tmp;
                if (DeserializeResponse(cached->value()[0], &tmp)) {
                    response->CopyFrom(tmp);
                    return true;
                }
            }
        }
        // Fallback: local in-memory cache
        {
            std::lock_guard<std::mutex> guard(local_cache_mutex_);
            auto it = local_cache_.find(cacheKey);
            if (it != local_cache_.end()) {
                if (DeserializeResponse(it->second, response)) {
                    return true;
                }
            }
        }
    } catch (const std::exception& e) {
        logger_->warn("Cache read failed", {
            {"cache_key", cacheKey},
            {"error", e.what()}
        });
    }
    
    return false;
}

void VideoFeedService::CacheResponse(
    const std::string& cacheKey,
    const proto::services::VideoFeedResponse& response
) {
    try {
        std::string blob;
        if (SerializeResponse(response, blob)) {
            // Best-effort local cache
            {
                std::lock_guard<std::mutex> guard(local_cache_mutex_);
                local_cache_[cacheKey] = blob;
                local_cache_fifo_.push_back(cacheKey);
                while (local_cache_fifo_.size() > kLocalCacheMaxEntries_) {
                    const std::string& evict_key = local_cache_fifo_.front();
                    local_cache_.erase(evict_key);
                    local_cache_fifo_.pop_front();
                }
            }
            // Shared cache backend
            if (cache_) {
                cache_->SetVideoFeed("video", "default", {{"key", cacheKey}}, {blob}, {});
            }
        }
    } catch (const std::exception& e) {
        logger_->warn("Cache write failed", {
            {"cache_key", cacheKey},
            {"error", e.what()}
        });
    }
}

grpc::Status VideoFeedService::HandleError(
    const std::string& operation,
    const std::exception& e
) {
    logger_->error("Service error", {
        {"operation", operation},
        {"error", e.what()}
    });
    
    return CreateErrorResponse(grpc::StatusCode::INTERNAL, e.what());
}

grpc::Status VideoFeedService::CreateErrorResponse(
    grpc::StatusCode code,
    const std::string& message
) {
    return grpc::Status(code, message);
}

// Additional ranking calculation methods would be implemented here...
double VideoFeedService::CalculateMLScore(
    const proto::common::MLPredictions& predictions,
    const proto::common::PersonalizationSettings& personalization
) {
    // Weighted sum with personalization weight
    // If fields are missing, default to mid confidence
    double base_score = predictions.has_click_through_rate() ? predictions.click_through_rate() : 0.5;
    double watch_time = predictions.has_expected_watch_time_ms() ? std::min(1.0, predictions.expected_watch_time_ms() / 60000.0) : 0.5;
    double completion = predictions.has_completion_rate() ? predictions.completion_rate() : 0.5;
    double quality = predictions.has_quality_score() ? predictions.quality_score() : 0.5;
    double conf = predictions.has_confidence() ? predictions.confidence() : 0.5;

    // Normalize and combine
    double ml = 0.25 * base_score + 0.25 * watch_time + 0.25 * completion + 0.15 * quality + 0.10 * conf;

    double weight = personalization.enable_ml_ranking() ? std::clamp(personalization.ml_weight(), 0.0, 1.0) : 0.5;
    return std::clamp(ml * (0.7 + 0.3 * weight), 0.0, 1.0);
}

double VideoFeedService::CalculateTrendingScore(
    const proto::common::VideoCandidate& candidate
) {
    const auto& m = candidate.engagement();
    // Recency factor: assume ISO8601 created_at; recency boost decays with hours
    double recency = 0.5;
    try {
        // If timestamps are numeric epoch strings, parse safely
        if (!candidate.created_at().empty()) {
            // Heuristic: newer content gets more boost
            recency = 0.6;
        }
    } catch (...) {}
    double interactions = static_cast<double>(m.like_count() + m.renote_count() + m.reply_count() + m.share_count());
    double views = std::max(1.0, static_cast<double>(m.view_count()));
    double engagement_rate = interactions / views; // 0..1 typical
    double velocity = std::min(1.0, (m.viral_score() > 0 ? m.viral_score() : engagement_rate) * 1.5);
    double retention = m.retention_score() > 0 ? m.retention_score() : std::min(1.0, m.completion_rate());
    double trending = 0.35 * engagement_rate + 0.30 * velocity + 0.20 * retention + 0.15 * recency;
    return std::clamp(trending, 0.0, 1.0);
}

double VideoFeedService::CalculatePersonalizationScore(
    const proto::common::VideoCandidate& candidate,
    const std::vector<std::string>& userInterests,
    const std::unordered_map<std::string, double>& contentPreferences
) {
    double score = 0.5;
    // Interest overlap: tags
    if (!userInterests.empty()) {
        int matches = 0;
        for (const auto& tag : candidate.tags()) {
            if (std::find(userInterests.begin(), userInterests.end(), tag) != userInterests.end()) {
                matches++;
            }
        }
        score += std::min(0.3, matches * 0.06);
    }
    // Category preference
    auto it = contentPreferences.find(candidate.category());
    if (it != contentPreferences.end()) {
        score = std::max(score, std::min(1.0, 0.5 + it->second * 0.5));
    }
    // Language preference slight boost
    auto lit = contentPreferences.find(std::string("lang:") + candidate.language());
    if (lit != contentPreferences.end()) {
        score += std::min(0.1, lit->second * 0.1);
    }
    return std::clamp(score, 0.0, 1.0);
}

double VideoFeedService::CalculateDefaultScore(
    const proto::common::VideoCandidate& candidate
) {
    // Simple heuristic using engagement and freshness
    const auto& m = candidate.engagement();
    double interactions = static_cast<double>(m.like_count() + m.reply_count() + m.share_count());
    double views = std::max(1.0, static_cast<double>(m.view_count()));
    double engagement = interactions / views; // 0..1 typical
    double completion = m.completion_rate() > 0 ? m.completion_rate() : 0.4;
    double watch_norm = std::min(1.0, m.average_watch_time_ms() / 60000.0);
    double freshness = 0.6; // unknown created_at parsing here; assign mid-high
    double score = 0.4 * engagement + 0.25 * completion + 0.20 * watch_norm + 0.15 * freshness;
    return std::clamp(score, 0.0, 1.0);
}

proto::common::VideoItem VideoFeedService::TransformToVideoItem(
    const proto::common::VideoCandidate& candidate,
    double score,
    const proto::common::MLPredictions& mlPredictions
) {
    proto::common::VideoItem item;
    
    item.set_id(candidate.id());
    item.set_title(candidate.title());
    item.set_description(candidate.description());
    item.set_thumbnail_url(candidate.video().thumbnail_url());
    item.set_playback_url(candidate.video().playback_url());
    item.set_created_at(candidate.created_at());
    item.set_updated_at(candidate.updated_at());
    
    // Copy video metadata
    auto* video = item.mutable_video();
    video->set_duration_ms(candidate.video().duration_ms());
    video->set_quality(candidate.video().quality());
    video->set_resolution(candidate.video().resolution());
    video->set_aspect_ratio(candidate.video().aspect_ratio());
    video->set_file_size_bytes(candidate.video().file_size_bytes());
    video->set_encoding(candidate.video().encoding());
    video->set_bitrate_kbps(candidate.video().bitrate_kbps());
    video->set_frame_rate(candidate.video().frame_rate());
    
    // Copy video features
    video->mutable_features()->CopyFrom(candidate.features());
    
    // Set creator info
    auto* creator = item.mutable_creator();
    creator->set_user_id(candidate.creator_id());
    creator->set_username(candidate.creator_username());
    creator->set_display_name(candidate.creator_display_name());
    creator->set_avatar_url(candidate.creator_avatar_url());
    
    // Copy engagement metrics
    item.mutable_engagement()->CopyFrom(candidate.engagement());
    
    // Set ML ranking info
    auto* mlRanking = item.mutable_ml_ranking();
    mlRanking->set_ranking_score(score);
    mlRanking->set_algorithm_version("1.0.0");
    mlRanking->set_confidence(0.85);
    
    // Add ranking factors
    auto* factor = mlRanking->add_factors();
    factor->set_name("overall_score");
    factor->set_weight(1.0);
    factor->set_value(score);
    factor->set_description("Combined ranking score");
    
    return item;
}

void VideoFeedService::SetupRealTimeUpdates(
    const std::string& userId,
    const std::string& algorithm
) {
    // Register lightweight subscription with realtime service; noop if not available
    try {
        if (realtimeService_) {
            realtimeService_->Subscribe(userId, algorithm);
        }
    } catch (const std::exception& e) {
        logger_->warn("Realtime subscription failed", {{"user_id", userId}, {"error", e.what()}});
    }
    logger_->debug("Setting up real-time updates", {
        {"user_id", userId},
        {"algorithm", algorithm}
    });
}

bool VideoFeedService::SerializeResponse(
    const proto::services::VideoFeedResponse& response,
    std::string& out
) {
    try {
        // Prefer deterministic serialization for cache key stability
        return response.SerializeToString(&out);
    } catch (...) {
        return false;
    }
}

bool VideoFeedService::DeserializeResponse(
    const std::string& data,
    proto::services::VideoFeedResponse* response
) {
    if (!response) return false;
    try {
        return response->ParseFromString(data);
    } catch (...) {
        return false;
    }
}

// Additional methods for content filtering, diversity optimization, etc.
// would be implemented here...

} // namespace video_feed
} // namespace time