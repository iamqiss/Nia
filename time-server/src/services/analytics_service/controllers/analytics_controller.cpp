#include "controllers/analytics_controller.h"

#include <string>
#include <unordered_map>

#include "models/event.h"
#include "models/metric.h"

namespace sonet::analytics_service::controllers {

AnalyticsController::AnalyticsController(std::shared_ptr<collectors::EventCollector> collector,
											 std::shared_ptr<aggregators::RealTimeAggregator> aggregator)
	: collector_(std::move(collector)), aggregator_(std::move(aggregator)) {}

::grpc::Status AnalyticsController::Ingest(::grpc::ServerContext* /*context*/,
										      ::grpc::ServerReader< ::sonet::analytics::Event>* reader,
										      ::sonet::analytics::IngestResponse* response) {
	::sonet::analytics::Event incoming;
	uint32_t accepted = 0;
	while (reader->Read(&incoming)) {
		model::Event e{};
		e.id = incoming.id();
		e.type = incoming.type();
		e.source_service = incoming.source_service();
		e.user_id = incoming.user_id();
		e.trace_id = incoming.trace_id();
		e.span_id = incoming.span_id();
		e.timestamp_ms = incoming.timestamp_ms();
		e.value = incoming.value();
		for (const auto& [k, v] : incoming.attributes()) { e.attributes.emplace(k, v); }
		std::string reason;
		if (e.IsValid(reason)) {
			collector_->Enqueue(std::move(e));
			accepted++;
		}
	}
	response->set_accepted(true);
	response->set_queued(accepted);
	return ::grpc::Status::OK;
}

::grpc::Status AnalyticsController::Query(::grpc::ServerContext* /*context*/,
										   const ::sonet::analytics::QueryRequest* request,
										   ::sonet::analytics::QueryResponse* response) {
	model::MetricQuery q{};
	q.metric = request->metric();
	const std::string op = request->operation();
	if (op == "count") q.operation = model::Operation::Count;
	else if (op == "sum") q.operation = model::Operation::Sum;
	else if (op == "avg") q.operation = model::Operation::Avg;
	else if (op == "p50") q.operation = model::Operation::P50;
	else if (op == "p90") q.operation = model::Operation::P90;
	else if (op == "p99") q.operation = model::Operation::P99;
	else if (op == "unique") q.operation = model::Operation::Unique;
	q.start_ms = request->range().start_ms();
	q.end_ms = request->range().end_ms();
	q.step_seconds = request->step_seconds();
	for (const auto& [k, v] : request->filters()) { q.filters.emplace(k, v); }
	for (const auto& g : request->group_by()) { q.group_by.push_back(g); }
	std::string reason;
	if (!q.IsValid(reason)) {
		return ::grpc::Status(::grpc::StatusCode::INVALID_ARGUMENT, reason);
	}
	const auto series = aggregator_->Query(q);
	for (const auto& s : series) {
		auto* out_series = response->add_series();
		out_series->set_key(s.key);
		for (const auto& p : s.points) {
			auto* out_point = out_series->add_points();
			out_point->set_ts_ms(p.ts_ms);
			out_point->set_value(p.value);
		}
	}
	// total can be computed by summing last points
	double total = 0.0;
	for (const auto& s : series) {
		if (!s.points.empty()) total += s.points.back().value;
	}
	response->set_total(total);
	return ::grpc::Status::OK;
}

::grpc::Status AnalyticsController::Health(::grpc::ServerContext* /*context*/,
											  const ::sonet::analytics::HealthCheckRequest* /*request*/,
											  ::sonet::analytics::HealthCheckResponse* response) {
	response->set_status("ok");
	return ::grpc::Status::OK;
}

} // namespace sonet::analytics_service::controllers

