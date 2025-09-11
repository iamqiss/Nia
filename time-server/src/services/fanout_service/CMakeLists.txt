cmake_minimum_required(VERSION 3.16)
project(fanout_service CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

find_package(Protobuf REQUIRED)
find_package(gRPC REQUIRED)

set(PROTO_SRC ${CMAKE_CURRENT_SOURCE_DIR}/proto/fanout_service.proto)
protobuf_generate_cpp(PROTO_CPP PROTO_H ${PROTO_SRC})
grpc_generate_cpp(GRPC_CPP GRPC_H ${PROTO_SRC})

add_library(fanout_service_lib
    service.cpp
    controllers/fanout_controller.cpp
    processors/pull_processor.cpp
    processors/push_processor.cpp
    queues/fanout_queue.cpp
    queues/priority_queue.cpp
    ${PROTO_CPP}
    ${GRPC_CPP}
)

target_include_directories(fanout_service_lib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${CMAKE_CURRENT_BINARY_DIR})
target_link_libraries(fanout_service_lib PUBLIC gRPC::grpc++ protobuf::libprotobuf)

add_executable(fanout_service main.cpp)
target_link_libraries(fanout_service PRIVATE fanout_service_lib)

