#include <csignal>
#include <cstdlib>
#include <iostream>
#include <thread>

#include "service.h"

static volatile std::sig_atomic_t g_stop = 0;
static void HandleSig(int) { g_stop = 1; }

static std::string GetEnvOr(const char* key, const std::string& def) {
	const char* v = std::getenv(key);
	return v ? std::string(v) : def;
}

int main() {
	std::signal(SIGINT, HandleSig);
	std::signal(SIGTERM, HandleSig);

	time::fanout_service::Config cfg;
	cfg.bind_address = GetEnvOr("FANOUT_BIND", "0.0.0.0:6015");
	if (const char* cap = std::getenv("FANOUT_QUEUE_CAPACITY")) cfg.queue_capacity = static_cast<size_t>(std::strtoull(cap, nullptr, 10));
	if (const char* bs = std::getenv("FANOUT_BATCH_SIZE")) cfg.batch_size = static_cast<uint32_t>(std::strtoul(bs, nullptr, 10));
	if (const char* pt = std::getenv("FANOUT_POLL_TIMEOUT_MS")) cfg.poll_timeout_ms = static_cast<uint32_t>(std::strtoul(pt, nullptr, 10));
	if (const char* pr = std::getenv("FANOUT_PUSH_RETRIES")) cfg.push_retries = static_cast<size_t>(std::strtoull(pr, nullptr, 10));
	cfg.registry_path_or_json = GetEnvOr("FANOUT_REGISTRY", "");

	time::fanout_service::FanoutServer server(cfg);
	if (!server.Start()) {
		std::cerr << "Failed to start fanout_service" << std::endl;
		return 1;
	}
	std::cout << "fanout_service listening on " << cfg.bind_address << std::endl;
	while (!g_stop) { std::this_thread::sleep_for(std::chrono::milliseconds(200)); }
	server.Stop();
	return 0;
}

