#include "collectors/event_collector.h"

#include <chrono>

namespace sonet::analytics_service::collectors {

bool EventCollector::Enqueue(model::Event&& event) {
	std::unique_lock<std::mutex> lock(mutex_);
	if (queue_.size() >= capacity_) {
		// Drop oldest to make room (backpressure via shedding)
		queue_.pop();
	}
	queue_.push(std::move(event));
	lock.unlock();
	cv_.notify_one();
	return true;
}

std::vector<model::Event> EventCollector::DequeueBatch(uint32_t timeout_ms) {
	std::unique_lock<std::mutex> lock(mutex_);
	if (queue_.empty()) {
		cv_.wait_for(lock, std::chrono::milliseconds(timeout_ms));
	}
	std::vector<model::Event> batch;
	batch.reserve(batch_size_);
	while (!queue_.empty() && batch.size() < batch_size_) {
		batch.emplace_back(std::move(queue_.front()));
		queue_.pop();
	}
	return batch;
}

size_t EventCollector::Size() const {
	std::scoped_lock<std::mutex> lock(mutex_);
	return queue_.size();
}

} // namespace sonet::analytics_service::collectors

