#pragma once

#include "../service.h"
#include "../queues/priority_queue.h"

#include <atomic>
#include <thread>

namespace time::fanout_service {

class FanoutController; // fwd

class PushProcessor {
public:
    PushProcessor(PriorityQueue& queue,
                  std::shared_ptr<Transport> transport,
                  FanoutConfig config,
                  std::shared_ptr<MetricsRegistry> metrics,
                  FanoutController& controller)
        : queue_(queue), transport_(std::move(transport)), config_(config), metrics_(std::move(metrics)), controller_(controller) {}

    bool start();
    void stop();

private:
    void worker_loop();
    bool flush_batch(const std::string& service, const std::string& method, std::vector<Event>& batch, const EndpointDescriptor& ep);

    PriorityQueue& queue_;
    std::shared_ptr<Transport> transport_;
    FanoutConfig config_{};
    std::shared_ptr<MetricsRegistry> metrics_;
    FanoutController& controller_;

    std::atomic<bool> running_{false};
    std::vector<std::thread> workers_;
};

} // namespace time::fanout_service

