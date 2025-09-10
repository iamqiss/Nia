#include "models/metric.h"

#include <algorithm>

namespace sonet::analytics_service::model {

static bool IsKnownOperation(Operation op) {
	switch (op) {
		case Operation::Count:
		case Operation::Sum:
		case Operation::Avg:
		case Operation::P50:
		case Operation::P90:
		case Operation::P99:
		case Operation::Unique:
			return true;
	}
	return false;
}

bool MetricQuery::IsValid(std::string& reason) const {
	if (metric.empty()) { reason = "missing metric"; return false; }
	if (!IsKnownOperation(operation)) { reason = "unknown operation"; return false; }
	if (start_ms <= 0 || end_ms <= 0 || end_ms <= start_ms) { reason = "invalid time range"; return false; }
	if (!group_by.empty()) {
		for (const auto& g : group_by) { if (g.empty()) { reason = "empty group_by key"; return false; } }
	}
	return true;
}

} // namespace sonet::analytics_service::model

