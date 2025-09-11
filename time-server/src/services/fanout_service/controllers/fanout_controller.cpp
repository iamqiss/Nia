#include "fanout_controller.h"

#include <spdlog/spdlog.h>

namespace time::fanout_service::controllers {

grpc::Status FanoutController::Push(grpc::ServerContext*, const time::fanout::FanoutRequest* req, time::fanout::FanoutResponse* resp) {
	std::vector<time::fanout::Event> events;
	events.reserve(req->batch().events_size());
	for (const auto& e : req->batch().events()) events.push_back(e);
	bool ok = push_->Ingest(events);
	resp->set_accepted(static_cast<uint32_t>(ok ? events.size() : 0));
	resp->set_rejected(static_cast<uint32_t>(ok ? 0 : events.size()));
	return grpc::Status::OK;
}

grpc::Status FanoutController::Health(grpc::ServerContext*, const time::fanout::HealthRequest*, time::fanout::HealthResponse* resp) {
	resp->set_status(health_cb_());
	return grpc::Status::OK;
}

grpc::Status FanoutController::Metrics(grpc::ServerContext*, const time::fanout::MetricsRequest*, time::fanout::MetricsResponse* resp) {
	resp->set_prometheus(metrics_cb_());
	return grpc::Status::OK;
}

} // namespace time::fanout_service::controllers

