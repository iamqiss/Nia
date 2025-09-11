#include "service.h"

#include "queues/fanout_queue.h"
#include "queues/priority_queue.h"
#include "processors/pull_processor.h"
#include "processors/push_processor.h"
#include "controllers/fanout_controller.h"

#include <sstream>
#include <spdlog/spdlog.h>

// Generated headers for typed ingestion
#include "fanout_ingestion.pb.h"
#include "fanout_ingestion.grpc.pb.h"
#include "services/note.pb.h"
#include <google/protobuf/util/json_util.h>

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
    // Typed gRPC transport using FanoutIngestionService contracts
    return std::async(std::launch::async, [this, endpoint, batch](){
        auto channel = get_or_create_channel(endpoint.address);
        grpc::ClientContext ctx;
        ctx.set_deadline(std::chrono::system_clock::now() + endpoint.request_timeout);

        using sonet::fanoutin::EventBatchRequest;
        using sonet::fanoutin::EventBatchResponse;
        using sonet::fanoutin::EventEnvelope;
        using sonet::fanoutin::EventKind;
        using sonet::fanoutin::FanoutIngestionService;
        using sonet::fanoutin::NoteEvent;

        std::unique_ptr<FanoutIngestionService::Stub> stub = FanoutIngestionService::NewStub(channel);

        EventBatchRequest req;
        req.mutable_events()->Reserve(static_cast<int>(batch.events.size()));
        for (const auto& e : batch.events) {
            EventEnvelope* env = req.add_events();
            env->set_id(e.id);
            if (e.type == "note.created") {
                env->set_kind(EventKind::EVENT_KIND_NOTE_CREATED);
                NoteEvent* ne = env->mutable_note_event();
                ne->set_kind(EventKind::EVENT_KIND_NOTE_CREATED);
                if (e.payload.contains("note")) {
                    std::string note_json = e.payload["note"].dump();
                    sonet::note::Note note_msg;
                    google::protobuf::util::JsonParseOptions opts;
                    opts.ignore_unknown_fields = true;
                    auto status = google::protobuf::util::JsonStringToMessage(note_json, &note_msg, opts);
                    if (status.ok()) {
                        *(ne->mutable_note()) = std::move(note_msg);
                    }
                }
            } else if (e.type == "note.updated") {
                env->set_kind(EventKind::EVENT_KIND_NOTE_UPDATED);
                NoteEvent* ne = env->mutable_note_event();
                ne->set_kind(EventKind::EVENT_KIND_NOTE_UPDATED);
            } else if (e.type == "note.deleted") {
                env->set_kind(EventKind::EVENT_KIND_NOTE_DELETED);
                NoteEvent* ne = env->mutable_note_event();
                ne->set_kind(EventKind::EVENT_KIND_NOTE_DELETED);
            } else {
                env->set_kind(EventKind::EVENT_KIND_UNKNOWN);
            }
        }

        EventBatchResponse resp;
        auto status = stub->IngestBatch(&ctx, req, &resp);
        return status.ok() && resp.accepted();
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

