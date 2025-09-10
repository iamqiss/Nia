//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

#pragma once

#include <atomic>
#include <functional>
#include <memory>
#include <thread>
#include <vector>

#include "collectors/event_collector.h"
#include "models/event.h"

namespace sonet::analytics_service::processors {

// StreamProcessor consumes events from EventCollector and forwards to a sink callback
class StreamProcessor {
public:
	using Sink = std::function<void(std::vector<model::Event>&&)>;

	StreamProcessor(std::shared_ptr<collectors::EventCollector> collector,
				   Sink sink,
				   uint32_t poll_timeout_ms = 200)
		: collector_(std::move(collector)), sink_(std::move(sink)), poll_timeout_ms_(poll_timeout_ms) {}

	void Start();
	void Stop();
	bool IsRunning() const { return running_.load(); }

private:
	void RunLoop();

	std::shared_ptr<collectors::EventCollector> collector_;
	Sink sink_;
	uint32_t poll_timeout_ms_{};
	std::atomic<bool> running_{false};
	std::thread thread_;
};

} // namespace sonet::analytics_service::processors

