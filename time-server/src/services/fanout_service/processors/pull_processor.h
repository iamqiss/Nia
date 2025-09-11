#pragma once

#include <atomic>
#include <functional>
#include <memory>
#include <random>
#include <string>
#include <thread>
#include <vector>

#include <spdlog/spdlog.h>

#include "proto/fanout_service.pb.h"
#include "queues/fanout_queue.h"
#include "../transport.h"

namespace time::fanout_service::processors {

class PullProcessor {
public:
	using QueueType = queues::BoundedQueue<time::fanout::Event>;

	PullProcessor(std::shared_ptr<QueueType> queue,
				std::shared_ptr<Transport> transport,
				std::function<std::vector<std::string>(const time::fanout::Event&)> router,
				uint32_t batch_size,
				uint32_t poll_timeout_ms)
		: queue_(std::move(queue)), transport_(std::move(transport)), router_(std::move(router)),
		  batch_size_(batch_size), poll_timeout_ms_(poll_timeout_ms) {}

	void Start() {
		if (running_.exchange(true)) return;
		worker_ = std::thread([this]{ Run(); });
	}

	void Stop() {
		if (!running_.exchange(false)) return;
		queue_->Shutdown();
		if (worker_.joinable()) worker_.join();
	}

private:
	void Run() {
		std::mt19937_64 rng(std::random_device{}());
		std::uniform_int_distribution<int> jitter(0, 50);
		while (running_.load()) {
			auto batch = queue_->PopBatch(batch_size_, poll_timeout_ms_);
			if (batch.empty()) continue;
			// Group by downstream service
			std::unordered_map<std::string, std::vector<time::fanout::Event>> by_service;
			for (auto& e : batch) {
				for (const auto& svc : router_(e)) {
					by_service[svc].push_back(e);
				}
			}
			// Send with retries
			for (auto& kv : by_service) {
				const std::string& svc = kv.first;
				auto& evs = kv.second;
				int attempt = 0;
				const int max_attempts = 6;
				while (attempt < max_attempts) {
					bool ok = transport_->SendBatch(svc, evs).get();
					if (ok) break;
					int backoff_ms = (1 << attempt) * 20 + jitter(rng);
					std::this_thread::sleep_for(std::chrono::milliseconds(backoff_ms));
					++attempt;
				}
				if (attempt >= max_attempts) {
					spdlog::error("Fanout failed to service {} after {} attempts", svc, max_attempts);
				}
			}
		}
	}

	std::shared_ptr<QueueType> queue_;
	std::shared_ptr<Transport> transport_;
	std::function<std::vector<std::string>(const time::fanout::Event&)> router_;
	uint32_t batch_size_;
	uint32_t poll_timeout_ms_;
	std::atomic<bool> running_{false};
	std::thread worker_;
};

} // namespace time::fanout_service::processors

