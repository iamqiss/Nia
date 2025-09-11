#include "service.h"
#include "controllers/fanout_controller.h"

#include <grpcpp/grpcpp.h>
#include <grpcpp/server.h>
#include <grpcpp/server_builder.h>

#include "proto/fanout_service.grpc.pb.h"

#include <csignal>
#include <spdlog/spdlog.h>

using namespace time::fanout_service;

static std::atomic<bool> g_stop{false};

class FanoutAdminServiceImpl final : public time::fanout::FanoutAdminService::Service {
public:
    explicit FanoutAdminServiceImpl(FanoutService& svc) : svc_(svc) {}
    ::grpc::Status Health(::grpc::ServerContext*, const time::fanout::HealthRequest*, time::fanout::HealthResponse* resp) override {
        resp->set_status("ok");
        return ::grpc::Status::OK;
    }
    ::grpc::Status Metrics(::grpc::ServerContext*, const time::fanout::MetricsRequest*, time::fanout::MetricsResponse* resp) override {
        resp->set_prometheus_text(svc_.prometheus_metrics());
        return ::grpc::Status::OK;
    }
private:
    FanoutService& svc_;
};

int main(int argc, char** argv) {
    (void)argc; (void)argv;
    FanoutConfig cfg{};
    auto metrics = std::make_shared<MetricsRegistry>();
    auto transport = std::make_shared<GrpcTransport>();
    FanoutService svc(cfg, transport, metrics);
    svc.start();
    svc.load_manifests_from_dir("/etc/time/manifests");

    FanoutAdminServiceImpl admin(svc);
    grpc::ServerBuilder builder;
    builder.AddListeningPort("0.0.0.0:56090", grpc::InsecureServerCredentials());
    builder.RegisterService(&admin);
    std::unique_ptr<grpc::Server> server(builder.BuildAndStart());
    spdlog::info("Fanout admin listening on :56090");

    std::signal(SIGINT, [](int){ g_stop = true; });
    std::signal(SIGTERM, [](int){ g_stop = true; });
    while (!g_stop.load()) { std::this_thread::sleep_for(std::chrono::milliseconds(200)); }

    server->Shutdown();
    svc.stop();
    return 0;
}

