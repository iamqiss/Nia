#include "aggregators/real_time_aggregator.h"

#include <algorithm>
#include <cmath>
#include <sstream>
#include <utility>

namespace sonet::analytics_service::aggregators {

size_t RealTimeAggregator::BucketKeyHash::operator()(const BucketKey& k) const noexcept {
	std::hash<std::string> hs;
	std::hash<int64_t> hi;
	return hs(k.metric) ^ (hi(k.bucket_start_ms) << 1) ^ (hs(k.group_key) << 2);
}

int64_t RealTimeAggregator::ToBucketMs(int64_t ts_ms, uint32_t step_seconds) {
	if (step_seconds == 0) return ts_ms;
	const int64_t step_ms = static_cast<int64_t>(step_seconds) * 1000;
	return (ts_ms / step_ms) * step_ms;
}

std::string RealTimeAggregator::BuildGroupKey(const Attributes& attrs, const std::vector<std::string>& group_by) {
	if (group_by.empty()) return "";
	std::ostringstream oss;
	bool first = true;
	for (const auto& key : group_by) {
		auto it = attrs.find(key);
		if (it != attrs.end()) {
			if (!first) oss << '|';
			oss << key << '=' << it->second;
			first = false;
		}
	}
	return oss.str();
}

bool RealTimeAggregator::MatchesFilters(const Attributes& attrs, const Attributes& filters) {
	for (const auto& [k, v] : filters) {
		auto it = attrs.find(k);
		if (it == attrs.end() || it->second != v) return false;
	}
	return true;
}

void RealTimeAggregator::Ingest(std::vector<model::Event>&& events) {
	std::scoped_lock<std::mutex> lock(mutex_);
	for (auto& e : events) {
		// Derive metric name from type (mapping could be expanded)
		const std::string metric = e.type; // direct mapping
		const int64_t bucket_ms = ToBucketMs(e.timestamp_ms, 1); // 1-second buckets
		const std::string group_key = BuildGroupKey(e.attributes, {"source_service"});
		BucketKey key{metric, bucket_ms, group_key};
		BucketValue& bv = buckets_[key];
		bv.count += 1;
		if (std::isfinite(e.value)) {
			bv.sum += e.value;
			bv.samples.push_back(e.value);
		}
		if (!e.user_id.empty()) {
			bv.uniques.insert(e.user_id);
		}
	}
}

static double Percentile(std::vector<double> values, double p) {
	if (values.empty()) return 0.0;
	std::sort(values.begin(), values.end());
	const double rank = p * (values.size() - 1);
	const size_t lo = static_cast<size_t>(std::floor(rank));
	const size_t hi = static_cast<size_t>(std::ceil(rank));
	if (lo == hi) return values[lo];
	const double frac = rank - lo;
	return values[lo] * (1.0 - frac) + values[hi] * frac;
}

std::vector<Series> RealTimeAggregator::Query(const model::MetricQuery& query) const {
	std::vector<Series> out;
	std::scoped_lock<std::mutex> lock(mutex_);
	// Build map key prefix and group_by key derivation for output
	std::unordered_map<std::string, Series> series_by_key;
	const int64_t step_ms = (query.step_seconds == 0 ? 1000 : static_cast<int64_t>(query.step_seconds) * 1000);
	for (const auto& [key, val] : buckets_) {
		if (key.metric != query.metric) continue;
		if (key.bucket_start_ms < query.start_ms || key.bucket_start_ms >= query.end_ms) continue;
		// Reconstruct attrs for filter check from group key if necessary
		// For now, we only stored source_service in group key; allow filter match on that and others captured in buckets later.
		if (!query.filters.empty()) {
			// very lightweight filter support: if filter contains source_service, check in key
			auto it = query.filters.find("source_service");
			if (it != query.filters.end()) {
				if (key.group_key.find(std::string("source_service=") + it->second) == std::string::npos) continue;
			}
		}

		Series& series = series_by_key[key.group_key];
		series.key = key.group_key;
		double value = 0.0;
		switch (query.operation) {
			case model::Operation::Count: value = static_cast<double>(val.count); break;
			case model::Operation::Sum: value = val.sum; break;
			case model::Operation::Avg: value = (val.count ? val.sum / static_cast<double>(val.count) : 0.0); break;
			case model::Operation::P50: value = Percentile(val.samples, 0.50); break;
			case model::Operation::P90: value = Percentile(val.samples, 0.90); break;
			case model::Operation::P99: value = Percentile(val.samples, 0.99); break;
			case model::Operation::Unique: value = static_cast<double>(val.uniques.size()); break;
		}
		series.points.push_back(Point{key.bucket_start_ms - (key.bucket_start_ms % step_ms), value});
	}
	// Sort series points by timestamp
	for (auto& [k, s] : series_by_key) {
		std::sort(s.points.begin(), s.points.end(), [](const Point& a, const Point& b){ return a.ts_ms < b.ts_ms; });
		out.push_back(std::move(s));
	}
	return out;
}

} // namespace sonet::analytics_service::aggregators

