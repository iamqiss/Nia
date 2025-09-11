#pragma once

#include <condition_variable>
#include <cstddef>
#include <deque>
#include <mutex>
#include <optional>
#include <vector>

namespace time::fanout_service::queues {

template <typename T>
class BoundedQueue {
public:
	explicit BoundedQueue(size_t capacity)
		: capacity_(capacity) {}

	bool TryPush(T item) {
		std::unique_lock<std::mutex> lk(mutex_);
		if (queue_.size() >= capacity_) return false;
		queue_.push_back(std::move(item));
		cv_.notify_one();
		return true;
	}

	std::vector<T> PopBatch(uint32_t max_items, uint32_t timeout_ms) {
		std::unique_lock<std::mutex> lk(mutex_);
		if (!cv_.wait_for(lk, std::chrono::milliseconds(timeout_ms), [&]{ return !queue_.empty() || shutdown_; })) {
			return {};
		}
		if (shutdown_) return {};
		const size_t n = std::min(static_cast<size_t>(max_items), queue_.size());
		std::vector<T> out;
		out.reserve(n);
		for (size_t i = 0; i < n; ++i) {
			out.push_back(std::move(queue_.front()));
			queue_.pop_front();
		}
		return out;
	}

	void Shutdown() {
		std::lock_guard<std::mutex> lk(mutex_);
		shutdown_ = true;
		cv_.notify_all();
	}

	size_t Size() const {
		std::lock_guard<std::mutex> lk(mutex_);
		return queue_.size();
	}

private:
	mutable std::mutex mutex_;
	std::condition_variable cv_;
	std::deque<T> queue_;
	bool shutdown_ = false;
	size_t capacity_;
};

} // namespace time::fanout_service::queues

