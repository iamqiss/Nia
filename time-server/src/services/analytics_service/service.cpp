#include "service.h"

#include <memory>

#include <grpcpp/server.h>
#include <grpcpp/server_builder.h>

#include "collectors/event_collector.h"
#include "aggregators/real_time_aggregator.h"
#include "processors/stream_processor.h"

namespace time::analytics_service {

AnalyticsServer::AnalyticsServer(const Config& config)
	: config_(config) {}

AnalyticsServer::~AnalyticsServer() { Stop(); }

bool AnalyticsServer::Start() {
	collector_ = std::make_shared<collectors::EventCollector>(config_.queue_capacity, config_.batch_size);
	aggregator_ = std::make_shared<aggregators::RealTimeAggregator>();
	controller_ = std::make_unique<controllers::AnalyticsController>(collector_, aggregator_);
	processors::StreamProcessor::Sink sink = [agg = aggregator_](std::vector<model::Event>&& batch){
		agg->Ingest(std::move(batch));
	};
	processor_ = std::make_unique<processors::StreamProcessor>(collector_, std::move(sink), config_.poll_timeout_ms);
	processor_->Start();

	grpc::ServerBuilder builder;
	builder.AddListeningPort(config_.bind_address, grpc::InsecureServerCredentials());
	builder.RegisterService(controller_.get());
	server_ = builder.BuildAndStart();
	return static_cast<bool>(server_);
}

void AnalyticsServer::Stop() {
	if (server_) {
		server_->Shutdown();
		server_.reset();
	}
	if (processor_) {
		processor_->Stop();
		processor_.reset();
	}
}

} // namespace time::analytics_service

