#pragma once

#include <condition_variable>
#include <cstddef>
#include <deque>
#include <mutex>
#include <optional>
#include <utility>

namespace time::fanout_service::queues {

template <typename T>
class PriorityQueue {
public:
	explicit PriorityQueue(size_t capacity)
		: capacity_(capacity) {}

	bool TryPush(const T& item, int priority) {
		std::unique_lock<std::mutex> lk(mutex_);
		if (SizeLocked() >= capacity_) return false;
		GetBucket(priority).push_back(item);
		cv_.notify_one();
		return true;
	}

	std::optional<T> PopBlocking(uint32_t timeout_ms) {
		std::unique_lock<std::mutex> lk(mutex_);
		if (!cv_.wait_for(lk, std::chrono::milliseconds(timeout_ms), [&]{ return SizeLocked() > 0 || shutdown_; })) {
			return std::nullopt;
		}
		if (shutdown_) return std::nullopt;
		// Higher priority first (lower numeric value = higher priority)
		for (auto& bucket : buckets_) {
			if (!bucket.second.empty()) {
				T item = std::move(bucket.second.front());
				bucket.second.pop_front();
				return item;
			}
		}
		return std::nullopt;
	}

	void Shutdown() {
		std::lock_guard<std::mutex> lk(mutex_);
		shutdown_ = true;
		cv_.notify_all();
	}

private:
	std::deque<T>& GetBucket(int priority) {
		return buckets_[priority];
	}

	size_t SizeLocked() const {
		size_t total = 0;
		for (const auto& b : buckets_) total += b.second.size();
		return total;
	}

	mutable std::mutex mutex_;
	std::condition_variable cv_;
	bool shutdown_ = false;
	size_t capacity_;
	std::map<int, std::deque<T>> buckets_;
};

} // namespace time::fanout_service::queues

