#include "fanout_controller.h"

#include <fstream>
#include <spdlog/spdlog.h>

namespace fs = std::filesystem;

namespace time::fanout_service {

bool FanoutController::load_from_dir(const std::string& dir_path) {
    std::unique_lock lock(mu_);
    routing_table_.clear();
    endpoints_.clear();

    try {
        for (const auto& ent : fs::directory_iterator(dir_path)) {
            if (!ent.is_regular_file()) continue;
            std::ifstream ifs(ent.path());
            if (!ifs) continue;
            json j; ifs >> j;
            EndpointDescriptor ep{};
            ep.service_name = j.value("service_name", "");
            ep.address = j.value("address", "");
            ep.method = j.value("method", "IngestEvents");
            ep.max_batch_size = j.value("max_batch_size", 256);
            ep.request_timeout = std::chrono::milliseconds(j.value("request_timeout_ms", 200));
            ep.max_retry_backoff = std::chrono::milliseconds(j.value("max_retry_backoff_ms", 5000));
            if (ep.service_name.empty() || ep.address.empty()) continue;
            endpoints_[ep.service_name] = ep;

            // routing rules: array of event types this service needs
            if (j.contains("event_types") && j["event_types"].is_array()) {
                for (const auto& t : j["event_types"]) {
                    routing_table_[t.get<std::string>()].push_back(ep.service_name);
                }
            }
        }
        spdlog::info("Loaded {} endpoints for fanout", endpoints_.size());
        return !endpoints_.empty();
    } catch (const std::exception& e) {
        spdlog::error("Failed loading manifests: {}", e.what());
        return false;
    }
}

std::optional<std::unordered_map<std::string, EndpointDescriptor>> FanoutController::route(const Event& e) const {
    std::shared_lock lock(mu_);
    std::unordered_map<std::string, EndpointDescriptor> out;
    auto it = routing_table_.find(e.type);
    if (it == routing_table_.end()) return std::nullopt;
    for (const auto& svc : it->second) {
        auto eit = endpoints_.find(svc);
        if (eit != endpoints_.end()) out.emplace(svc, eit->second);
    }
    if (out.empty()) return std::nullopt;
    return out;
}

} // namespace time::fanout_service

