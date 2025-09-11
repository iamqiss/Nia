#pragma once

#include "../service.h"

#include <condition_variable>
#include <deque>
#include <mutex>

namespace time::fanout_service {

// Bounded FIFO queue with backpressure
class FanoutQueue {
public:
    explicit FanoutQueue(size_t capacity, std::shared_ptr<MetricsRegistry> metrics)
        : capacity_(capacity), metrics_(std::move(metrics)) {}

    bool push(Event e) {
        std::unique_lock<std::mutex> lock(mu_);
        cv_not_full_.wait(lock, [&]{ return shutdown_ || queue_.size() < capacity_; });
        if (shutdown_) return false;
        queue_.push_back(std::move(e));
        metrics_->increment_counter("fanout_queue_push_total");
        cv_not_empty_.notify_one();
        return true;
    }

    bool pop(Event& out) {
        std::unique_lock<std::mutex> lock(mu_);
        cv_not_empty_.wait(lock, [&]{ return shutdown_ || !queue_.empty(); });
        if (shutdown_ && queue_.empty()) return false;
        out = std::move(queue_.front());
        queue_.pop_front();
        metrics_->increment_counter("fanout_queue_pop_total");
        cv_not_full_.notify_one();
        return true;
    }

    void shutdown() {
        std::lock_guard<std::mutex> lock(mu_);
        shutdown_ = true;
        cv_not_empty_.notify_all();
        cv_not_full_.notify_all();
    }

    size_t size() const {
        std::lock_guard<std::mutex> lock(mu_);
        return queue_.size();
    }

private:
    size_t capacity_{};
    std::shared_ptr<MetricsRegistry> metrics_;

    mutable std::mutex mu_;
    std::condition_variable cv_not_empty_;
    std::condition_variable cv_not_full_;
    std::deque<Event> queue_;
    bool shutdown_{false};
};

} // namespace time::fanout_service

