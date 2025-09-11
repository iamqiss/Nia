#include "service.h"

#include <fstream>
#include <sstream>

#include <grpcpp/server.h>
#include <grpcpp/server_builder.h>
#include <spdlog/spdlog.h>

namespace time::fanout_service {

FanoutServer::FanoutServer(const Config& cfg) : cfg_(cfg) {}

FanoutServer::~FanoutServer() { Stop(); }

bool FanoutServer::Start() {
	try {
		auto registry = LoadRegistry(cfg_.registry_path_or_json);
		transport_ = std::make_shared<GrpcTransport>(registry);
		queue_ = std::make_shared<queues::BoundedQueue<time::fanout::Event>>(cfg_.queue_capacity);
		push_ = std::make_shared<processors::PushProcessor>(queue_, cfg_.push_retries);
		auto router = BuildRouter();
		pull_ = std::make_shared<processors::PullProcessor>(queue_, transport_, router, cfg_.batch_size, cfg_.poll_timeout_ms);
		pull_->Start();

		controller_ = std::make_unique<controllers::FanoutController>(push_,
				[this]{ return BuildMetrics(); },
				[this]{ return BuildHealth(); });

		grpc::ServerBuilder builder;
		builder.AddListeningPort(cfg_.bind_address, grpc::InsecureServerCredentials());
		builder.RegisterService(controller_.get());
		server_ = builder.BuildAndStart();
		return static_cast<bool>(server_);
	} catch (const std::exception& e) {
		spdlog::error("Failed to start FanoutServer: {}", e.what());
		return false;
	}
}

void FanoutServer::Stop() {
	if (server_) {
		server_->Shutdown();
		server_.reset();
	}
	if (pull_) {
		pull_->Stop();
		pull_.reset();
	}
}

std::string FanoutServer::BuildMetrics() const {
	std::ostringstream os;
	os << "# HELP fanout_queue_depth Current queue size\n";
	os << "# TYPE fanout_queue_depth gauge\n";
	os << "fanout_queue_depth " << queue_->Size() << "\n";
	return os.str();
}

std::string FanoutServer::BuildHealth() const {
	return "HEALTHY";
}

nlohmann::json FanoutServer::LoadRegistry(const std::string& path_or_json) {
	if (path_or_json.empty()) {
		// Default: discover common sibling services with standard ports
		return nlohmann::json{
			{"analytics_service", {{"address", "127.0.0.1:6007"}, {"method", "/time.analytics.AnalyticsService/Push"}}},
			{"timeline_service", {{"address", "127.0.0.1:6010"}, {"method", "/time.timeline.TimelineService/Ingest"}}},
			{"notification_service", {{"address", "127.0.0.1:6012"}, {"method", "/time.notification.NotificationService/Deliver"}}}
		};
	}
	// Try read file
	std::ifstream in(path_or_json);
	if (in.good()) {
		nlohmann::json j;
		in >> j;
		return j;
	}
	// Fallback: parse string as JSON
	return nlohmann::json::parse(path_or_json);
}

std::function<std::vector<std::string>(const time::fanout::Event&)> FanoutServer::BuildRouter() {
	return [](const time::fanout::Event& e) -> std::vector<std::string> {
		std::vector<std::string> targets;
		const auto& t = e.type();
		if (t.rfind("note.", 0) == 0) {
			targets.push_back("timeline_service");
			targets.push_back("search_service");
			targets.push_back("analytics_service");
		} else if (t.rfind("user.", 0) == 0) {
			targets.push_back("search_service");
			targets.push_back("notification_service");
		} else if (t.rfind("message.", 0) == 0) {
			targets.push_back("messaging_service");
		}
		for (const auto& attr : e.attributes()) {
			if (attr.key() == "target_service") targets.push_back(attr.value());
		}
		return targets;
	};
}

} // namespace time::fanout_service

