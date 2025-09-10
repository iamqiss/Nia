//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

#pragma once

#include <condition_variable>
#include <cstddef>
#include <cstdint>
#include <mutex>
#include <optional>
#include <queue>
#include <string>
#include <vector>

#include "models/event.h"

namespace time::analytics_service::collectors {

// Thread-safe event buffer with bounded capacity and batch dequeue
class EventCollector {
public:
	explicit EventCollector(size_t capacity, size_t batch_size)
		: capacity_(capacity), batch_size_(batch_size) {}

	bool Enqueue(model::Event&& event);
	std::vector<model::Event> DequeueBatch(uint32_t timeout_ms);
	size_t Size() const;

private:
	mutable std::mutex mutex_;
	std::condition_variable cv_;
	std::queue<model::Event> queue_;
	size_t capacity_{};
	size_t batch_size_{};
};

} // namespace time::analytics_service::collectors

