#include "service.h"

#include "queues/fanout_queue.h"
#include "queues/priority_queue.h"
#include "processors/pull_processor.h"
#include "processors/push_processor.h"
#include "controllers/fanout_controller.h"

#include <sstream>
#include <spdlog/spdlog.h>

namespace time::fanout_service {

// -------- MetricsRegistry --------

size_t MetricsRegistry::SeriesKeyHash::operator()(const std::pair<std::string, std::unordered_map<std::string, std::string>>& p) const noexcept {
    std::hash<std::string> h;
    size_t seed = h(p.first);
    for (const auto& kv : p.second) {
        seed ^= h(kv.first + "=" + kv.second) + 0x9e3779b97f4a7c15ULL + (seed<<6) + (seed>>2);
    }
    return seed;
}

void MetricsRegistry::increment_counter(const std::string& name, double v, const std::unordered_map<std::string, std::string>& labels) {
    std::lock_guard<std::mutex> lock(mu_);
    counters_[{name, labels}] += v;
}

void MetricsRegistry::observe_histogram(const std::string& name, double value, const std::unordered_map<std::string, std::string>& labels) {
    std::lock_guard<std::mutex> lock(mu_);
    histograms_[{name, labels}].push_back(value);
}

void MetricsRegistry::set_gauge(const std::string& name, double value, const std::unordered_map<std::string, std::string>& labels) {
    std::lock_guard<std::mutex> lock(mu_);
    gauges_[{name, labels}] = value;
}

static std::string format_labels(const std::unordered_map<std::string, std::string>& labels) {
    if (labels.empty()) return {};
    std::ostringstream oss;
    oss << "{";
    bool first = true;
    for (const auto& kv : labels) {
        if (!first) oss << ","; first = false;
        oss << kv.first << "=\"" << kv.second << "\"";
    }
    oss << "}";
    return oss.str();
}

std::string MetricsRegistry::render_prometheus() const {
    std::ostringstream oss;
    std::lock_guard<std::mutex> lock(mu_);
    for (const auto& it : counters_) {
        oss << it.first.first << format_labels(it.first.second) << " " << it.second << "\n";
    }
    for (const auto& it : gauges_) {
        oss << it.first.first << format_labels(it.first.second) << " " << it.second << "\n";
    }
    for (const auto& it : histograms_) {
        double sum = 0; for (double v : it.second) sum += v;
        oss << it.first.first << "_count" << format_labels(it.first.second) << " " << it.second.size() << "\n";
        oss << it.first.first << "_sum" << format_labels(it.first.second) << " " << sum << "\n";
    }
    return oss.str();
}

// -------- GrpcTransport --------

std::shared_ptr<grpc::Channel> GrpcTransport::get_or_create_channel(const std::string& address) {
    std::lock_guard<std::mutex> lock(channel_mu_);
    auto it = channel_cache_.find(address);
    if (it != channel_cache_.end()) return it->second;
    auto ch = grpc::CreateChannel(address, default_credentials_);
    channel_cache_[address] = ch;
    return ch;
}

std::future<bool> GrpcTransport::send_batch(const EndpointDescriptor& endpoint, const EventBatch& batch) {
    // Use generic stub to call a method expecting a list of events serialized as JSON lines.
    // This keeps cross-service dependency minimal.
    return std::async(std::launch::async, [this, endpoint, batch](){
        auto channel = get_or_create_channel(endpoint.address);
        grpc::ClientContext ctx;
        ctx.set_deadline(std::chrono::system_clock::now() + endpoint.request_timeout);

        // Prepare generic RPC: /{service}/{method}
        std::string method_full = "/" + endpoint.service_name + "/" + endpoint.method;
        auto stub = std::make_unique<grpc::GenericStub>(channel);

        grpc::ByteBuffer request_buffer;
        // Serialize batch as JSON lines for transport-agnostic ingestion
        nlohmann::json arr = nlohmann::json::array();
        for (const auto& e : batch.events) {
            arr.push_back({{"id", e.id}, {"type", e.type}, {"payload", e.payload}});
        }
        auto s = arr.dump();
        grpc::Slice slice(s.data(), s.size());
        request_buffer = grpc::ByteBuffer(&slice, 1);

        grpc::ByteBuffer response_buffer;
        auto status = stub->UnaryCall(&ctx, method_full, request_buffer, &response_buffer);
        return status.ok();
    });
}

// -------- FanoutService --------

FanoutService::FanoutService(FanoutConfig config,
                             std::shared_ptr<Transport> transport,
                             std::shared_ptr<MetricsRegistry> metrics)
    : config_(config), transport_(std::move(transport)), metrics_(std::move(metrics)) {}

FanoutService::~FanoutService() { stop(); }

bool FanoutService::start() {
    if (running_.exchange(true)) return false;
    queue_ = std::make_unique<FanoutQueue>(config_.max_queue_size, metrics_);
    priority_queue_ = std::make_unique<PriorityQueue>(config_.max_queue_size, metrics_);
    controller_ = std::make_unique<FanoutController>(metrics_);

    // Pull processor is wired with a no-op source by default. Integrators can replace via event bus hookup.
    auto source = [](Event&) { return false; };
    pull_processor_ = std::make_unique<PullProcessor>(*queue_, source, metrics_, config_);
    push_processor_ = std::make_unique<PushProcessor>(*priority_queue_, transport_, config_, metrics_, *controller_);

    pull_processor_->start();
    push_processor_->start();
    spdlog::info("FanoutService started");
    return true;
}

void FanoutService::stop() {
    if (!running_.exchange(false)) return;
    if (pull_processor_) pull_processor_->stop();
    if (push_processor_) push_processor_->stop();
    if (queue_) queue_->shutdown();
    if (priority_queue_) priority_queue_->shutdown();
    spdlog::info("FanoutService stopped");
}

void FanoutService::ingest(Event e) {
    // push to priority queue based on priority
    metrics_->set_gauge("fanout_ingest_queue_size", static_cast<double>(priority_queue_->size()));
    (void)priority_queue_->push(std::move(e));
}

bool FanoutService::load_manifests_from_dir(const std::string& path) {
    if (!controller_) controller_ = std::make_unique<FanoutController>(metrics_);
    return controller_->load_from_dir(path);
}

} // namespace time::fanout_service

