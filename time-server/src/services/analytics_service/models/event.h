//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

#pragma once

#include <cstdint>
#include <optional>
#include <string>
#include <string_view>
#include <unordered_map>

namespace time::analytics_service::model {

struct Event {
	std::string id;
	std::string type;
	std::string source_service;
	std::string user_id; // optional, empty if not set
	std::string trace_id;
	std::string span_id;
	int64_t timestamp_ms{};
	std::unordered_map<std::string, std::string> attributes;
	double value{}; // optional numeric value; NaN indicates unset

	// Simple validation to guard against obviously invalid input
	bool IsValid(std::string& reason) const;

	// Convenience helpers
	static bool IsUuidLike(std::string_view text);
	static bool IsTimestampReasonable(int64_t epoch_ms);
};

} // namespace time::analytics_service::model

