#pragma once

#include <memory>
#include <string>
#include <vector>

#include "proto/fanout_service.pb.h"
#include "queues/fanout_queue.h"

namespace time::fanout_service::processors {

class PushProcessor {
public:
	using QueueType = queues::BoundedQueue<time::fanout::Event>;

	PushProcessor(std::shared_ptr<QueueType> queue, size_t max_retries)
		: queue_(std::move(queue)), max_retries_(max_retries) {}

	bool Ingest(const std::vector<time::fanout::Event>& events) {
		size_t rejected = 0;
		for (const auto& e : events) {
			bool ok = false;
			for (size_t attempt = 0; attempt < max_retries_ && !ok; ++attempt) {
				ok = queue_->TryPush(e);
				if (!ok) std::this_thread::sleep_for(std::chrono::microseconds(200));
			}
			if (!ok) ++rejected;
		}
		return rejected == 0;
	}

private:
	std::shared_ptr<QueueType> queue_;
	size_t max_retries_;
};

} // namespace time::fanout_service::processors

