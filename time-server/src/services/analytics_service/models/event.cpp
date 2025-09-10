#include "models/event.h"

#include <cmath>
#include <chrono>
#include <regex>

namespace time::analytics_service::model {

bool Event::IsUuidLike(std::string_view text) {
	static const std::regex kUuidRegex(
		R"(^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$)"
	);
	return std::regex_match(text.begin(), text.end(), kUuidRegex);
}

bool Event::IsTimestampReasonable(int64_t epoch_ms) {
	using namespace std::chrono;
	const int64_t year_2000_ms = duration_cast<milliseconds>(sys_days{January/1/2000}.time_since_epoch()).count();
	const int64_t now_ms = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();
	// Allow events up to 10 minutes in the future to account for skew
	return epoch_ms > year_2000_ms && epoch_ms < (now_ms + 10 * 60 * 1000);
}

bool Event::IsValid(std::string& reason) const {
	if (id.empty() || !IsUuidLike(id)) { reason = "invalid id"; return false; }
	if (type.empty()) { reason = "missing type"; return false; }
	if (source_service.empty()) { reason = "missing source_service"; return false; }
	if (!trace_id.empty() && trace_id.size() < 8) { reason = "trace_id too short"; return false; }
	if (!span_id.empty() && span_id.size() < 4) { reason = "span_id too short"; return false; }
	if (!IsTimestampReasonable(timestamp_ms)) { reason = "timestamp out of range"; return false; }
	if (std::isnan(value)) {
		// Treat NaN as unset, ok
	} else if (!std::isfinite(value)) {
		reason = "value not finite"; return false;
	}
	return true;
}

} // namespace time::analytics_service::model

