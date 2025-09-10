//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

#pragma once

#include <memory>
#include <mutex>

#include <grpcpp/grpcpp.h>

#include "aggregators/real_time_aggregator.h"
#include "collectors/event_collector.h"
#include "processors/stream_processor.h"

#include "time/analytics/analytics_service.grpc.pb.h"

namespace time::analytics_service::controllers {

class AnalyticsController final : public ::time::analytics::AnalyticsService::Service {
public:
	AnalyticsController(std::shared_ptr<collectors::EventCollector> collector,
					   std::shared_ptr<aggregators::RealTimeAggregator> aggregator);
	~AnalyticsController() override = default;

	::grpc::Status Ingest(::grpc::ServerContext* context,
						  ::grpc::ServerReader< ::time::analytics::Event>* reader,
						  ::time::analytics::IngestResponse* response) override;

	::grpc::Status Query(::grpc::ServerContext* context,
						 const ::time::analytics::QueryRequest* request,
						 ::time::analytics::QueryResponse* response) override;

	::grpc::Status Health(::grpc::ServerContext* context,
						  const ::time::analytics::HealthCheckRequest* request,
						  ::time::analytics::HealthCheckResponse* response) override;

private:
	std::shared_ptr<collectors::EventCollector> collector_;
	std::shared_ptr<aggregators::RealTimeAggregator> aggregator_;
};

} // namespace time::analytics_service::controllers

