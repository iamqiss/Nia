#include <csignal>
#include <cstdlib>
#include <iostream>
#include <string>
#include <thread>

#include "service.h"

static volatile std::sig_atomic_t g_stop = 0;

static void HandleSig(int) { g_stop = 1; }

static std::string GetEnvOr(const char* key, const std::string& def) {
	const char* v = std::getenv(key);
	return v ? std::string(v) : def;
}

int main() {
	time::analytics_service::Config cfg;
	cfg.bind_address = GetEnvOr("ANALYTICS_BIND", "0.0.0.0:6007");
	{
		const char* cap = std::getenv("ANALYTICS_QUEUE_CAPACITY");
		if (cap) cfg.queue_capacity = static_cast<size_t>(std::strtoull(cap, nullptr, 10));
	}
	{
		const char* bs = std::getenv("ANALYTICS_BATCH_SIZE");
		if (bs) cfg.batch_size = static_cast<size_t>(std::strtoull(bs, nullptr, 10));
	}
	{
		const char* pt = std::getenv("ANALYTICS_POLL_TIMEOUT_MS");
		if (pt) cfg.poll_timeout_ms = static_cast<uint32_t>(std::strtoul(pt, nullptr, 10));
	}

	std::signal(SIGINT, HandleSig);
	std::signal(SIGTERM, HandleSig);

	time::analytics_service::AnalyticsServer server(cfg);
	if (!server.Start()) {
		std::cerr << "Failed to start analytics_service" << std::endl;
		return 1;
	}
	std::cout << "analytics_service listening on " << cfg.bind_address << std::endl;
	while (!g_stop) { std::this_thread::sleep_for(std::chrono::milliseconds(200)); }
	server.Stop();
	return 0;
}

