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
#include <vector>

namespace sonet::analytics_service::model {

enum class Operation {
	Count,
	Sum,
	Avg,
	P50,
	P90,
	P99,
	Unique
};

struct MetricQuery {
	std::string metric;
	Operation operation{Operation::Count};
	int64_t start_ms{};
	int64_t end_ms{};
	uint32_t step_seconds{}; // 0 for single point
	std::unordered_map<std::string, std::string> filters;
	std::vector<std::string> group_by;

	bool IsValid(std::string& reason) const;
};

} // namespace sonet::analytics_service::model

