cmake_minimum_required(VERSION 3.16)
project(fanout_service CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

find_package(Protobuf REQUIRED)
find_package(gRPC REQUIRED)

set(ADMIN_PROTO ${CMAKE_CURRENT_SOURCE_DIR}/proto/fanout_service.proto)
set(EVENTS_PROTO ${CMAKE_SOURCE_DIR}/proto/services/events.proto)
protobuf_generate_cpp(ADMIN_CPP ADMIN_H ${ADMIN_PROTO})
grpc_generate_cpp(ADMIN_GRPC_CPP ADMIN_GRPC_H ${ADMIN_PROTO})
protobuf_generate_cpp(EVENTS_CPP EVENTS_H ${EVENTS_PROTO})
grpc_generate_cpp(EVENTS_GRPC_CPP EVENTS_GRPC_H ${EVENTS_PROTO})

add_library(fanout_service_lib
    service.cpp
    controllers/fanout_controller.cpp
    processors/pull_processor.cpp
    processors/push_processor.cpp
    queues/fanout_queue.cpp
    queues/priority_queue.cpp
    ${ADMIN_CPP}
    ${ADMIN_GRPC_CPP}
    ${EVENTS_CPP}
    ${EVENTS_GRPC_CPP}
)

target_include_directories(fanout_service_lib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${CMAKE_CURRENT_BINARY_DIR} ${CMAKE_SOURCE_DIR}/proto)
target_link_libraries(fanout_service_lib PUBLIC gRPC::grpc++ protobuf::libprotobuf)

add_executable(fanout_service main.cpp)
target_link_libraries(fanout_service PRIVATE fanout_service_lib)

