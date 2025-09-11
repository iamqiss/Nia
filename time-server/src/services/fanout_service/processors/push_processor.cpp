#include "push_processor.h"
#include "../controllers/fanout_controller.h"

#include <spdlog/spdlog.h>

namespace time::fanout_service {

bool PushProcessor::start() {
    if (running_.exchange(true)) return false;
    size_t n = config_.worker_threads ? config_.worker_threads : std::max<size_t>(1, std::thread::hardware_concurrency());
    workers_.reserve(n);
    for (size_t i = 0; i < n; ++i) {
        workers_.emplace_back([this]{ worker_loop(); });
    }
    return true;
}

void PushProcessor::stop() {
    if (!running_.exchange(false)) return;
    queue_.shutdown();
    for (auto& t : workers_) if (t.joinable()) t.join();
    workers_.clear();
}

void PushProcessor::worker_loop() {
    std::vector<Event> pending;
    pending.reserve(config_.max_batch_size);

    while (running_.load()) {
        Event e;
        if (!queue_.pop(e)) break; // shutdown

        // Route
        auto maybe_targets = controller_.route(e);
        if (!maybe_targets.has_value()) {
            metrics_->increment_counter("fanout_drop_total", 1, {{"reason","unroutable"}});
            continue;
        }

        for (const auto& target : *maybe_targets) {
            const auto& ep = target.second; // EndpointDescriptor
            std::vector<Event> batch;
            batch.push_back(e);

            // Best-effort batch coalescing within small window
            Event next;
            auto deadline = SteadyClock::now() + config_.batch_flush_interval;
            while (batch.size() < ep.max_batch_size) {
                if (!queue_.pop(next)) break; // shutdown or empty
                if (SteadyClock::now() > deadline) { // don't wait too long
                    queue_.push(std::move(next));
                    break;
                }
                batch.push_back(std::move(next));
            }

            flush_batch(target.first, ep.method, batch, ep);
        }
    }
}

bool PushProcessor::flush_batch(const std::string& service,
                                const std::string& method,
                                std::vector<Event>& batch,
                                const EndpointDescriptor& ep) {
    EventBatch eb{service, method, batch};
    BackoffPolicy backoff(config_.initial_backoff, config_.max_backoff);
    size_t attempt = 0;
    auto start = SteadyClock::now();
    for (;;) {
        auto fut = transport_->send_batch(ep, eb);
        bool ok = fut.get();
        if (ok) {
            metrics_->increment_counter("fanout_send_success_total", 1, {{"service",service}});
            metrics_->observe_histogram("fanout_send_latency_ms",
                std::chrono::duration<double, std::milli>(SteadyClock::now()-start).count(),
                {{"service",service}});
            return true;
        }
        if (attempt >= 7) {
            metrics_->increment_counter("fanout_send_failed_total", 1, {{"service",service}});
            spdlog::warn("Fanout batch failed after {} attempts to {}", attempt+1, service);
            return false;
        }
        auto delay = backoff.next_delay(attempt++);
        std::this_thread::sleep_for(delay);
    }
}

} // namespace time::fanout_service

