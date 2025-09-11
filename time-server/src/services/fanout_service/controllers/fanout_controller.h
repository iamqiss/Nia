#pragma once

#include <memory>
#include <mutex>
#include <string>

#include <grpcpp/grpcpp.h>

#include "proto/fanout_service.grpc.pb.h"
#include "../processors/push_processor.h"

namespace time::fanout_service::controllers {

class FanoutController final : public time::fanout::FanoutService::Service {
public:
	FanoutController(std::shared_ptr<processors::PushProcessor> push,
					std::function<std::string()> metrics_cb,
					std::function<std::string()> health_cb)
		: push_(std::move(push)), metrics_cb_(std::move(metrics_cb)), health_cb_(std::move(health_cb)) {}

	grpc::Status Push(grpc::ServerContext*, const time::fanout::FanoutRequest* req, time::fanout::FanoutResponse* resp) override;
	grpc::Status Health(grpc::ServerContext*, const time::fanout::HealthRequest*, time::fanout::HealthResponse* resp) override;
	grpc::Status Metrics(grpc::ServerContext*, const time::fanout::MetricsRequest*, time::fanout::MetricsResponse* resp) override;

private:
	std::shared_ptr<processors::PushProcessor> push_;
	std::function<std::string()> metrics_cb_;
	std::function<std::string()> health_cb_;
};

} // namespace time::fanout_service::controllers

