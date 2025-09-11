/*
 * Fanout Service - Twitter-scale event fanout for sibling services
 */

#pragma once

#include <grpcpp/grpcpp.h>

#include <atomic>
#include <chrono>
#include <cstdint>
#include <functional>
#include <future>
#include <map>
#include <memory>
#include <mutex>
#include <optional>
#include <queue>
#include <random>
#include <shared_mutex>
#include <string>
#include <thread>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>

#include <nlohmann/json.hpp>

namespace time::fanout_service {

using json = nlohmann::json;
using SteadyClock = std::chrono::steady_clock;

// -------- Event Model --------

enum class EventPriority : uint8_t { Low = 0, Normal = 1, High = 2, Critical = 3 };

struct Event {
    std::string id;                 // globally unique id
    std::string type;               // e.g., note.created, follow.created
    json         payload;           // structured payload
    EventPriority priority{EventPriority::Normal};
    SteadyClock::time_point enqueued_at{SteadyClock::now()};
};

// Batch of events destined to a specific service/endpoint
struct EventBatch {
    std::string target_service;     // logical name (e.g., timeline_service)
    std::string method;             // rpc/method to call
    std::vector<Event> events;      // events in the batch
};

// Downstream endpoint descriptor loaded dynamically from JSON manifest/registry
struct EndpointDescriptor {
    std::string service_name;       // logical
    std::string address;            // host:port
    std::string method;             // rpc name
    size_t      max_batch_size{256};
    std::chrono::milliseconds request_timeout{std::chrono::milliseconds(200)};
    std::chrono::milliseconds max_retry_backoff{std::chrono::seconds(5)};
};

// Routing decision returned by controller
struct RouteDecision {
    // map target service -> vector of event indices in input vector
    std::unordered_map<std::string, std::vector<size_t>> service_to_event_indices;
};

// ---------- Transport Abstraction ----------

class Transport {
public:
    virtual ~Transport() = default;

    // Send a batch to a downstream endpoint. Returns future<bool> for success.
    virtual std::future<bool> send_batch(const EndpointDescriptor& endpoint,
                                         const EventBatch& batch) = 0;
};

// gRPC Transport using async API; uses generic stub since services differ.
class GrpcTransport : public Transport {
public:
    explicit GrpcTransport(std::shared_ptr<grpc::ChannelCredentials> creds = grpc::InsecureChannelCredentials())
        : default_credentials_(std::move(creds)) {}

    std::future<bool> send_batch(const EndpointDescriptor& endpoint,
                                 const EventBatch& batch) override;

private:
    std::shared_ptr<grpc::ChannelCredentials> default_credentials_{};
    std::mutex channel_mu_;
    std::unordered_map<std::string, std::shared_ptr<grpc::Channel>> channel_cache_;

    std::shared_ptr<grpc::Channel> get_or_create_channel(const std::string& address);
};

// -------- Metrics (minimal Prometheus-style text producer) --------

class MetricsRegistry {
public:
    void increment_counter(const std::string& name, double v = 1.0,
                           const std::unordered_map<std::string, std::string>& labels = {});
    void observe_histogram(const std::string& name, double value,
                           const std::unordered_map<std::string, std::string>& labels = {});
    void set_gauge(const std::string& name, double value,
                   const std::unordered_map<std::string, std::string>& labels = {});
    std::string render_prometheus() const;

private:
    struct SeriesKeyHash {
        size_t operator()(const std::pair<std::string, std::unordered_map<std::string, std::string>>& p) const noexcept;
    };
    mutable std::mutex mu_;
    std::unordered_map<std::pair<std::string, std::unordered_map<std::string, std::string>>, double, SeriesKeyHash> counters_;
    std::unordered_map<std::pair<std::string, std::unordered_map<std::string, std::string>>, double, SeriesKeyHash> gauges_;
    std::unordered_map<std::pair<std::string, std::unordered_map<std::string, std::string>>, std::vector<double>, SeriesKeyHash> histograms_;
};

// -------- Utility: Exponential backoff with jitter --------

class BackoffPolicy {
public:
    BackoffPolicy(std::chrono::milliseconds initial,
                  std::chrono::milliseconds max_backoff)
        : initial_(initial), max_(max_backoff), rng_(std::random_device{}()) {}

    std::chrono::milliseconds next_delay(size_t attempt) {
        using namespace std::chrono;
        uint64_t base = static_cast<uint64_t>(initial_.count()) * (1ULL << std::min<size_t>(attempt, 16));
        uint64_t capped = std::min<uint64_t>(base, static_cast<uint64_t>(max_.count()));
        std::uniform_int_distribution<uint64_t> dist(0, capped);
        return milliseconds(dist(rng_));
    }

private:
    std::chrono::milliseconds initial_;
    std::chrono::milliseconds max_;
    std::mt19937_64 rng_;
};

// -------- Service Configuration --------

struct FanoutConfig {
    size_t worker_threads{0};                 // 0 -> hardware_concurrency
    size_t max_queue_size{200000};
    size_t max_inflight_requests{4096};
    size_t max_batch_size{256};
    std::chrono::milliseconds batch_flush_interval{std::chrono::milliseconds(10)};
    std::chrono::milliseconds request_timeout{std::chrono::milliseconds(200)};
    std::chrono::milliseconds initial_backoff{std::chrono::milliseconds(5)};
    std::chrono::milliseconds max_backoff{std::chrono::seconds(2)};
};

// Forward declarations
class FanoutQueue;
class PriorityQueue;
class PushProcessor;
class PullProcessor;
class FanoutController;

// -------- Top-level Service Orchestrator --------

class FanoutService {
public:
    FanoutService(FanoutConfig config,
                  std::shared_ptr<Transport> transport,
                  std::shared_ptr<MetricsRegistry> metrics);

    ~FanoutService();

    bool start();
    void stop();
    bool is_running() const { return running_.load(std::memory_order_acquire); }

    // Ingest event from local event bus
    void ingest(Event e);

    // For HTTP metrics endpoint
    std::string prometheus_metrics() const { return metrics_->render_prometheus(); }

    // Controller interaction
    bool load_manifests_from_dir(const std::string& path);

private:
    FanoutConfig config_{};
    std::shared_ptr<Transport> transport_{};
    std::shared_ptr<MetricsRegistry> metrics_{};

    std::unique_ptr<FanoutQueue> queue_;
    std::unique_ptr<PriorityQueue> priority_queue_;
    std::unique_ptr<PushProcessor> push_processor_;
    std::unique_ptr<PullProcessor> pull_processor_;
    std::unique_ptr<FanoutController> controller_;

    std::atomic<bool> running_{false};
};

} // namespace time::fanout_service

