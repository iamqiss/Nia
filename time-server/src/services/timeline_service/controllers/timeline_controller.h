#pragma once

#include "../service.h"
#include <memory>
#include <vector>
#include <optional>

namespace time {
namespace timeline {
namespace controllers {

struct HomeTimelineResult {
    std::vector<::time::timeline::TimelineItem> items;
    ::time::timeline::TimelineMetadata metadata;
    ::time::common::Pagination pagination;
    bool success = false;
    std::string error_message;
};

struct UserTimelineResult {
    std::vector<::time::timeline::TimelineItem> items;
    ::time::common::Pagination pagination;
    bool success = false;
    std::string error_message;
};

class TimelineController {
public:
    explicit TimelineController(std::shared_ptr<time::timeline::TimelineServiceImpl> service);

    HomeTimelineResult get_home_timeline(
        const std::string& user_id,
        int32_t offset,
        int32_t limit,
        bool include_ranking_signals = false
    );

    HomeTimelineResult get_for_you_timeline(
        const std::string& user_id,
        int32_t offset,
        int32_t limit,
        bool include_ranking_signals = false
    );

    HomeTimelineResult get_following_timeline(
        const std::string& user_id,
        int32_t offset,
        int32_t limit,
        bool include_ranking_signals = false
    );

    UserTimelineResult get_user_timeline(
        const std::string& target_user_id,
        const std::string& requesting_user_id,
        int32_t offset,
        int32_t limit,
        bool include_replies = false,
        bool include_renotes = true
    );

    bool refresh_timeline(const std::string& user_id, int32_t max_items);

    bool update_preferences(const std::string& user_id, const ::time::timeline::TimelinePreferences& prefs);

    std::optional<::time::timeline::TimelinePreferences> get_preferences(const std::string& user_id);

    bool record_engagement(const std::string& user_id, const std::string& note_id, const std::string& action, double duration_seconds = 0.0);

private:
    std::shared_ptr<time::timeline::TimelineServiceImpl> service_;
};

} // namespace controllers
} // namespace timeline
} // namespace time