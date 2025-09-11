#include "pull_processor.h"

#include <spdlog/spdlog.h>

namespace time::fanout_service {

bool PullProcessor::start() {
    if (running_.exchange(true)) return false;
    thread_ = std::thread([this]{ loop(); });
    return true;
}

void PullProcessor::stop() {
    if (!running_.exchange(false)) return;
    if (thread_.joinable()) thread_.join();
}

void PullProcessor::loop() {
    while (running_.load()) {
        Event e;
        if (source_ && source_(e)) {
            if (!queue_.push(std::move(e))) break;
            metrics_->increment_counter("events_ingested_total");
            continue;
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(1));
    }
}

} // namespace time::fanout_service

