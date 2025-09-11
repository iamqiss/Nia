cmake_minimum_required(VERSION 3.16)
project(fanout_service CXX)

find_package(Protobuf REQUIRED)
find_package(gRPC REQUIRED)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(PROTO_SRC ${CMAKE_CURRENT_SOURCE_DIR}/proto/fanout_service.proto)
set(GENERATED_DIR ${CMAKE_CURRENT_BINARY_DIR}/generated)
file(MAKE_DIRECTORY ${GENERATED_DIR})

set(PROTO_SRCS ${GENERATED_DIR}/fanout_service.pb.cc)
set(PROTO_HDRS ${GENERATED_DIR}/fanout_service.pb.h)
set(GRPC_SRCS ${GENERATED_DIR}/fanout_service.grpc.pb.cc)
set(GRPC_HDRS ${GENERATED_DIR}/fanout_service.grpc.pb.h)

add_custom_command(
  OUTPUT ${PROTO_SRCS} ${PROTO_HDRS} ${GRPC_SRCS} ${GRPC_HDRS}
  COMMAND ${Protobuf_PROTOC_EXECUTABLE}
    --proto_path=${CMAKE_CURRENT_SOURCE_DIR}/proto
    --cpp_out=${GENERATED_DIR}
    --grpc_out=${GENERATED_DIR}
    --plugin=protoc-gen-grpc=$<TARGET_FILE:gRPC::grpc_cpp_plugin>
    ${PROTO_SRC}
  DEPENDS ${PROTO_SRC}
  COMMENT "Generating gRPC sources for fanout_service.proto"
)

add_library(fanout_proto ${PROTO_SRCS} ${GRPC_SRCS})
target_include_directories(fanout_proto PUBLIC ${GENERATED_DIR})
target_link_libraries(fanout_proto PUBLIC gRPC::grpc++ protobuf::libprotobuf)

add_executable(fanout_service
  main.cpp
  service.cpp
  controllers/fanout_controller.cpp
  transport.cpp
)

target_include_directories(fanout_service PUBLIC ${GENERATED_DIR})
target_link_libraries(fanout_service PRIVATE fanout_proto gRPC::grpc++ protobuf::libprotobuf spdlog::spdlog)

