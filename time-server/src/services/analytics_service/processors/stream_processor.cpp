#include "processors/stream_processor.h"

#include <utility>

namespace time::analytics_service::processors {

void StreamProcessor::Start() {
	if (running_.exchange(true)) { return; }
	thread_ = std::thread([this]{ RunLoop(); });
}

void StreamProcessor::Stop() {
	if (!running_.exchange(false)) { return; }
	if (thread_.joinable()) { thread_.join(); }
}

void StreamProcessor::RunLoop() {
	while (running_.load()) {
		auto batch = collector_->DequeueBatch(poll_timeout_ms_);
		if (!batch.empty()) {
			try {
				sink_(std::move(batch));
			} catch (...) {
				// swallow to avoid crashing the processing loop
			}
		}
	}
}

} // namespace time::analytics_service::processors

