#pragma once

#include "../service.h"

#include <condition_variable>
#include <mutex>
#include <queue>

namespace time::fanout_service {

struct PQItem {
    Event event;
    uint64_t seq{}; // tie-breaker
};

struct PQCompare {
    bool operator()(const PQItem& a, const PQItem& b) const {
        // Higher priority first; if equal, lower seq first
        if (a.event.priority != b.event.priority) {
            return static_cast<int>(a.event.priority) < static_cast<int>(b.event.priority);
        }
        return a.seq > b.seq;
    }
};

class PriorityQueue {
public:
    explicit PriorityQueue(size_t capacity, std::shared_ptr<MetricsRegistry> metrics)
        : capacity_(capacity), metrics_(std::move(metrics)) {}

    bool push(Event e) {
        std::unique_lock<std::mutex> lock(mu_);
        cv_not_full_.wait(lock, [&]{ return shutdown_ || size_ < capacity_; });
        if (shutdown_) return false;
        pq_.push(PQItem{std::move(e), seq_++});
        ++size_;
        metrics_->increment_counter("priority_queue_push_total");
        cv_not_empty_.notify_one();
        return true;
    }

    bool pop(Event& out) {
        std::unique_lock<std::mutex> lock(mu_);
        cv_not_empty_.wait(lock, [&]{ return shutdown_ || size_ > 0; });
        if (shutdown_ && size_ == 0) return false;
        out = std::move(pq_.top().event);
        pq_.pop();
        --size_;
        metrics_->increment_counter("priority_queue_pop_total");
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
        return size_;
    }

private:
    size_t capacity_{};
    std::shared_ptr<MetricsRegistry> metrics_;

    mutable std::mutex mu_;
    std::condition_variable cv_not_empty_;
    std::condition_variable cv_not_full_;
    std::priority_queue<PQItem, std::vector<PQItem>, PQCompare> pq_;
    size_t size_{0};
    uint64_t seq_{0};
    bool shutdown_{false};
};

} // namespace time::fanout_service

