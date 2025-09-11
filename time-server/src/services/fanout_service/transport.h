#pragma once

#include <grpcpp/grpcpp.h>
#include <grpcpp/generic/generic_stub.h>
#include <nlohmann/json.hpp>
#include <future>
#include <memory>
#include <mutex>
#include <string>
#include <unordered_map>
#include <vector>

#include "proto/fanout_service.grpc.pb.h"

namespace time::fanout_service {

struct EndpointDescriptor {
	std::string address;
	std::string method; // Fully qualified RPC method, e.g. "/time.analytics.AnalyticsService/Push"
};

class Transport {
public:
	virtual ~Transport() = default;
	virtual std::future<bool> SendBatch(const std::string& service_name,
										const std::vector<time::fanout::Event>& events) = 0;
};

class GrpcTransport final : public Transport {
public:
	explicit GrpcTransport(nlohmann::json registry);
	~GrpcTransport() override = default;
	std::future<bool> SendBatch(const std::string& service_name,
								const std::vector<time::fanout::Event>& events) override;

private:
	std::mutex mutex_;
	std::unordered_map<std::string, EndpointDescriptor> service_endpoints_;
	std::unordered_map<std::string, std::shared_ptr<grpc::Channel>> channels_;
	std::unordered_map<std::string, std::unique_ptr<grpc::GenericStub>> stubs_;

	std::unique_ptr<grpc::GenericStub>& EnsureStubLocked(const std::string& service_name);
};

} // namespace time::fanout_service

