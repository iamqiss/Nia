//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

#pragma once

#include <atomic>
#include <cstdint>
#include <memory>
#include <mutex>
#include <string>
#include <string_view>
#include <unordered_map>
#include <unordered_set>
#include <vector>

#include "models/event.h"
#include "models/metric.h"

namespace time::analytics_service::aggregators {

struct Point { int64_t ts_ms{}; double value{}; };

struct Series { std::string key; std::vector<Point> points; };

class RealTimeAggregator {
public:
	// Ingests a batch of events, updating internal structures
	void Ingest(std::vector<model::Event>&& events);

	// Queries series data for a metric using simple in-memory time-bucketed store
	std::vector<Series> Query(const model::MetricQuery& query) const;

private:
	using Attributes = std::unordered_map<std::string, std::string>;
	struct BucketKey {
		std::string metric;
		int64_t bucket_start_ms{};
		std::string group_key; // concatenated group key for group_by
		bool operator==(const BucketKey& o) const {
			return metric == o.metric && bucket_start_ms == o.bucket_start_ms && group_key == o.group_key;
		}
	};
	struct BucketKeyHash { size_t operator()(const BucketKey& k) const noexcept; };

	struct BucketValue {
		uint64_t count{};
		double sum{};
		std::vector<double> samples; // for percentiles
		std::unordered_set<std::string> uniques; // for unique counts (e.g., user_id)
	};

	static int64_t ToBucketMs(int64_t ts_ms, uint32_t step_seconds);
	static std::string BuildGroupKey(const Attributes& attrs, const std::vector<std::string>& group_by);
	static bool MatchesFilters(const Attributes& attrs, const Attributes& filters);

	mutable std::mutex mutex_;
	std::unordered_map<BucketKey, BucketValue, BucketKeyHash> buckets_;
};

} // namespace time::analytics_service::aggregators

