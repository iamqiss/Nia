#pragma once

#include <atomic>
#include <memory>
#include <nlohmann/json.hpp>
#include <string>

#include <grpcpp/grpcpp.h>

#include "controllers/fanout_controller.h"
#include "processors/pull_processor.h"
#include "processors/push_processor.h"
#include "transport.h"

namespace time::fanout_service {

struct Config {
	std::string bind_address = "0.0.0.0:6015";
	size_t queue_capacity = 500000;
	uint32_t batch_size = 2048;
	uint32_t poll_timeout_ms = 50;
	size_t push_retries = 3;
	// Path to registry JSON or raw JSON string
	std::string registry_path_or_json;
};

class FanoutServer final {
public:
	explicit FanoutServer(const Config& cfg);
	~FanoutServer();

	bool Start();
	void Stop();

private:
	Config cfg_{};
	std::unique_ptr<grpc::Server> server_;
	std::shared_ptr<processors::PushProcessor> push_;
	std::shared_ptr<processors::PullProcessor> pull_;
	std::shared_ptr<Transport> transport_;
	std::shared_ptr<queues::BoundedQueue<time::fanout::Event>> queue_;
	std::unique_ptr<controllers::FanoutController> controller_;

	std::string BuildMetrics() const;
	std::string BuildHealth() const;
	static nlohmann::json LoadRegistry(const std::string& path_or_json);
	static std::function<std::vector<std::string>(const time::fanout::Event&)> BuildRouter();
};

} // namespace time::fanout_service

