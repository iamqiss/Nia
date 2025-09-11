#pragma once

#include "../service.h"

#include <filesystem>

namespace time::fanout_service {

// Loads manifests and computes routing decisions
class FanoutController {
public:
    explicit FanoutController(std::shared_ptr<MetricsRegistry> metrics)
        : metrics_(std::move(metrics)) {}

    // Load JSON manifests from a directory. Each file describes endpoints for a logical service.
    // Example schema: {"service_name":"sonet.fanoutin.FanoutIngestionService","address":"127.0.0.1:50051","method":"IngestBatch","max_batch_size":256}
    bool load_from_dir(const std::string& dir_path);

    // For a single event, compute target endpoints. Returns map service_name -> EndpointDescriptor
    std::optional<std::unordered_map<std::string, EndpointDescriptor>> route(const Event& e) const;

private:
    std::shared_ptr<MetricsRegistry> metrics_;
    // event_type -> [service_names]
    std::unordered_map<std::string, std::vector<std::string>> routing_table_;
    // service_name -> endpoint
    std::unordered_map<std::string, EndpointDescriptor> endpoints_;
    mutable std::shared_mutex mu_;
};

} // namespace time::fanout_service

