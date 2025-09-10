#include "timeline_controller.h"

namespace time {
namespace timeline {
namespace controllers {

TimelineController::TimelineController(std::shared_ptr<time::timeline::TimelineServiceImpl> service)
    : service_(std::move(service)) {}

HomeTimelineResult TimelineController::get_home_timeline(
    const std::string& user_id,
    int32_t offset,
    int32_t limit,
    bool include_ranking_signals
) {
    HomeTimelineResult result;

    ::time::timeline::GetTimelineRequest req;
    req.user_id_ = user_id;
    req.algorithm_ = ::time::timeline::TIMELINE_ALGORITHM_HYBRID;
    req.pagination_.offset = offset;
    req.pagination_.limit = limit;
    req.include_ranking_signals_ = include_ranking_signals;

    ::time::timeline::GetTimelineResponse resp;
    grpc::ServerContext ctx;
    auto status = service_->GetTimeline(&ctx, &req, &resp);

    if (status.ok()) {
        result.items = std::move(resp.items_);
        result.metadata = resp.metadata_;
        result.pagination = resp.pagination_;
        result.success = true;
    } else {
        result.success = false;
        result.error_message = status.error_message();
    }

    return result;
}

HomeTimelineResult TimelineController::get_for_you_timeline(
    const std::string& user_id,
    int32_t offset,
    int32_t limit,
    bool include_ranking_signals
) {
    HomeTimelineResult result;

    ::time::timeline::GetForYouTimelineRequest req;
    req.user_id_ = user_id;
    req.pagination_.offset = offset;
    req.pagination_.limit = limit;
    req.include_ranking_signals_ = include_ranking_signals;

    ::time::timeline::GetForYouTimelineResponse resp;
    grpc::ServerContext ctx;
    auto status = service_->GetForYouTimeline(&ctx, &req, &resp);

    if (status.ok()) {
        result.items = std::move(resp.items_);
        result.metadata = resp.metadata_;
        result.pagination = resp.pagination_;
        result.success = true;
    } else {
        result.success = false;
        result.error_message = status.error_message();
    }

    return result;
}

HomeTimelineResult TimelineController::get_following_timeline(
    const std::string& user_id,
    int32_t offset,
    int32_t limit,
    bool include_ranking_signals
) {
    HomeTimelineResult result;

    ::time::timeline::GetFollowingTimelineRequest req;
    req.user_id_ = user_id;
    req.pagination_.offset = offset;
    req.pagination_.limit = limit;
    req.include_ranking_signals_ = include_ranking_signals;

    ::time::timeline::GetFollowingTimelineResponse resp;
    grpc::ServerContext ctx;
    auto status = service_->GetFollowingTimeline(&ctx, &req, &resp);

    if (status.ok()) {
        result.items = std::move(resp.items_);
        result.metadata = resp.metadata_;
        result.pagination = resp.pagination_;
        result.success = true;
    } else {
        result.success = false;
        result.error_message = status.error_message();
    }

    return result;
}

UserTimelineResult TimelineController::get_user_timeline(
    const std::string& target_user_id,
    const std::string& requesting_user_id,
    int32_t offset,
    int32_t limit,
    bool include_replies,
    bool include_renotes
) {
    UserTimelineResult result;

    ::time::timeline::GetUserTimelineRequest req;
    req.target_user_id_ = target_user_id;
    req.requesting_user_id_ = requesting_user_id;
    req.pagination_.offset = offset;
    req.pagination_.limit = limit;
    req.include_replies_ = include_replies;
    req.include_renotes_ = include_renotes;

    ::time::timeline::GetUserTimelineResponse resp;
    grpc::ServerContext ctx;
    auto status = service_->GetUserTimeline(&ctx, &req, &resp);
    if (status.ok()) {
        result.items = std::move(resp.items_);
        result.pagination = resp.pagination_;
        result.success = true;
    } else {
        result.success = false;
        result.error_message = status.error_message();
    }

    return result;
}

bool TimelineController::refresh_timeline(const std::string& user_id, int32_t max_items) {
    ::time::timeline::RefreshTimelineRequest req;
    req.user_id_ = user_id;
    req.max_items_ = max_items;
    ::time::common::Timestamp ts; ts.set_seconds(0); ts.set_nanos(0);
    req.since_ = ts;

    ::time::timeline::RefreshTimelineResponse resp;
    grpc::ServerContext ctx;
    auto status = service_->RefreshTimeline(&ctx, &req, &resp);
    return status.ok();
}

bool TimelineController::update_preferences(const std::string& user_id, const ::time::timeline::TimelinePreferences& prefs) {
    ::time::timeline::UpdateTimelinePreferencesRequest req;
    req.user_id_ = user_id;
    req.preferences_ = prefs;

    ::time::timeline::UpdateTimelinePreferencesResponse resp;
    grpc::ServerContext ctx;
    auto status = service_->UpdateTimelinePreferences(&ctx, &req, &resp);
    return status.ok();
}

std::optional<::time::timeline::TimelinePreferences> TimelineController::get_preferences(const std::string& user_id) {
    ::time::timeline::GetTimelinePreferencesRequest req;
    req.user_id_ = user_id;

    ::time::timeline::GetTimelinePreferencesResponse resp;
    grpc::ServerContext ctx;
    auto status = service_->GetTimelinePreferences(&ctx, &req, &resp);
    if (!status.ok()) return std::nullopt;
    return resp.preferences_;
}

bool TimelineController::record_engagement(const std::string& user_id, const std::string& note_id, const std::string& action, double duration_seconds) {
    ::time::timeline::RecordEngagementRequest req;
    req.user_id_ = user_id;
    req.note_id_ = note_id;
    req.action_ = action;
    req.duration_seconds_ = duration_seconds;

    ::time::timeline::RecordEngagementResponse resp;
    grpc::ServerContext ctx;
    auto status = service_->RecordEngagement(&ctx, &req, &resp);
    return status.ok();
}

} // namespace controllers
} // namespace timeline
} // namespace time