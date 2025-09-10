//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

#pragma once

#include <memory>
#include <string>

#include <grpcpp/grpcpp.h>

#include "controllers/analytics_controller.h"

namespace time::analytics_service {

struct Config {
	std::string bind_address = "0.0.0.0:6007";
	size_t queue_capacity = 100000;
	size_t batch_size = 1024;
	uint32_t poll_timeout_ms = 200;
};

class AnalyticsServer final {
public:
	explicit AnalyticsServer(const Config& config);
	~AnalyticsServer();

	bool Start();
	void Stop();

private:
	Config config_{};
	std::unique_ptr<grpc::Server> server_;
	std::shared_ptr<collectors::EventCollector> collector_;
	std::shared_ptr<aggregators::RealTimeAggregator> aggregator_;
	std::unique_ptr<controllers::AnalyticsController> controller_;
	std::unique_ptr<processors::StreamProcessor> processor_;
};

} // namespace time::analytics_service

