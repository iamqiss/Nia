#pragma once

#include "../service.h"
#include "../queues/fanout_queue.h"

#include <atomic>
#include <thread>

namespace time::fanout_service {

// Pulls from a local event bus; here we model as a function callback registration
class PullProcessor {
public:
    using EventSource = std::function<bool(Event&)>; // non-blocking pull; returns false if none

    PullProcessor(FanoutQueue& queue,
                  EventSource source,
                  std::shared_ptr<MetricsRegistry> metrics,
                  FanoutConfig cfg)
        : queue_(queue), source_(std::move(source)), metrics_(std::move(metrics)), config_(cfg) {}

    bool start();
    void stop();

private:
    void loop();

    FanoutQueue& queue_;
    EventSource source_;
    std::shared_ptr<MetricsRegistry> metrics_;
    FanoutConfig config_{};

    std::atomic<bool> running_{false};
    std::thread thread_;
};

} // namespace time::fanout_service

