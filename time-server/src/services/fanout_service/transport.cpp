#include "transport.h"

#include <grpcpp/client_context.h>
#include <grpcpp/support/byte_buffer.h>
#include <grpcpp/support/slice.h>
#include <spdlog/spdlog.h>

namespace time::fanout_service {

GrpcTransport::GrpcTransport(nlohmann::json registry) {
	for (auto it = registry.begin(); it != registry.end(); ++it) {
		EndpointDescriptor d;
		d.address = it.value().value("address", "127.0.0.1:50051");
		d.method = it.value().value("method", "/time.fanout.FanoutService/Push");
		service_endpoints_.emplace(it.key(), std::move(d));
	}
}

std::unique_ptr<grpc::GenericStub>& GrpcTransport::EnsureStubLocked(const std::string& service_name) {
	auto it = stubs_.find(service_name);
	if (it != stubs_.end()) return it->second;
	const auto ep_it = service_endpoints_.find(service_name);
	if (ep_it == service_endpoints_.end()) {
		throw std::runtime_error("Missing endpoint for service: " + service_name);
	}
	const auto& address = ep_it->second.address;
	auto ch_it = channels_.find(address);
	if (ch_it == channels_.end()) {
		auto channel = grpc::CreateChannel(address, grpc::InsecureChannelCredentials());
		channels_.emplace(address, channel);
		ch_it = channels_.find(address);
	}
	auto stub = std::make_unique<grpc::GenericStub>(ch_it->second);
	auto& ref = stubs_.emplace(service_name, std::move(stub)).first->second;
	return ref;
}

std::future<bool> GrpcTransport::SendBatch(const std::string& service_name,
											   const std::vector<time::fanout::Event>& events) {
	return std::async(std::launch::async, [this, service_name, events]() -> bool {
		try {
			// Build EventBatch
			time::fanout::EventBatch batch;
			for (const auto& e : events) {
				*batch.add_events() = e;
			}
			grpc::ClientContext ctx;
			grpc::ByteBuffer send_buf;
			// Serialize using protobuf into ByteBuffer
			std::string serialized = batch.SerializeAsString();
			grpc::Slice slice(serialized);
			send_buf = grpc::ByteBuffer(&slice, 1);

			grpc::ByteBuffer recv_buf;
			std::string method;
			{
				std::lock_guard<std::mutex> lk(mutex_);
				const auto& ep = service_endpoints_.at(service_name);
				method = ep.method;
				auto& stub = EnsureStubLocked(service_name);
				auto status = stub->UnaryCall(&ctx, method, send_buf, &recv_buf);
				if (!status.ok()) {
					spdlog::warn("gRPC fanout to {} failed: {}", service_name, status.error_message());
					return false;
				}
			}
			return true;
		} catch (const std::exception& e) {
			spdlog::error("SendBatch exception for {}: {}", service_name, e.what());
			return false;
		}
	});
}

} // namespace time::fanout_service

