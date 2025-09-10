cmake_minimum_required(VERSION 3.20)

project(analytics_service LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

option(ENABLE_COVERAGE "Enable coverage flags" OFF)

if(ENABLE_COVERAGE AND CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
	message(STATUS "Coverage enabled for analytics_service")
	add_compile_options(--coverage -O0 -g)
	add_link_options(--coverage)
endif()

find_package(Threads REQUIRED)

file(GLOB ANALYTICS_ALL_SOURCES
	${CMAKE_CURRENT_SOURCE_DIR}/*.cpp
	${CMAKE_CURRENT_SOURCE_DIR}/controllers/*.cpp
	${CMAKE_CURRENT_SOURCE_DIR}/collectors/*.cpp
	${CMAKE_CURRENT_SOURCE_DIR}/processors/*.cpp
	${CMAKE_CURRENT_SOURCE_DIR}/aggregators/*.cpp
	${CMAKE_CURRENT_SOURCE_DIR}/models/*.cpp
)

set(ANALYTICS_MAIN ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp)
list(REMOVE_ITEM ANALYTICS_ALL_SOURCES ${ANALYTICS_MAIN})

add_library(analytics_service_core STATIC ${ANALYTICS_ALL_SOURCES})
add_executable(analytics_service ${ANALYTICS_MAIN})
target_include_directories(analytics_service_core PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_include_directories(analytics_service PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})

# gRPC/Protobuf generation for analytics service
set(PROTO_DIR ${CMAKE_CURRENT_SOURCE_DIR}/proto)
set(ANALYTICS_PROTO ${PROTO_DIR}/analytics_service.proto)
set(GEN_DIR ${CMAKE_CURRENT_BINARY_DIR}/generated)
file(MAKE_DIRECTORY ${GEN_DIR})

find_program(PROTOC protoc)
find_program(GRPC_CPP_PLUGIN grpc_cpp_plugin)
if(PROTOC AND GRPC_CPP_PLUGIN)
	set(GEN_SRCS
		${GEN_DIR}/sonet/analytics/analytics_service.pb.cc
		${GEN_DIR}/sonet/analytics/analytics_service.grpc.pb.cc
	)
	set(GEN_HDRS
		${GEN_DIR}/sonet/analytics/analytics_service.pb.h
		${GEN_DIR}/sonet/analytics/analytics_service.grpc.pb.h
	)
	add_custom_command(
		OUTPUT ${GEN_SRCS} ${GEN_HDRS}
		COMMAND ${PROTOC}
		ARGS --grpc_out ${GEN_DIR}
			 --cpp_out ${GEN_DIR}
			 -I ${PROTO_DIR}
			 --plugin=protoc-gen-grpc=${GRPC_CPP_PLUGIN}
			 ${ANALYTICS_PROTO}
		DEPENDS ${ANALYTICS_PROTO}
		COMMENT "Generating gRPC sources for analytics_service.proto"
	)
	target_sources(analytics_service_core PRIVATE ${GEN_SRCS})
	target_include_directories(analytics_service_core PUBLIC ${GEN_DIR})
else()
	message(WARNING "protoc or grpc_cpp_plugin not found; expecting pre-generated sources in include path.")
endif()

find_package(absl QUIET)
if(absl_FOUND)
	target_link_libraries(analytics_service PRIVATE absl::synchronization absl::strings)
else()
	target_link_libraries(analytics_service PRIVATE absl_synchronization absl_strings)
endif()

target_link_libraries(analytics_service PRIVATE grpc gpr grpc++)
target_link_libraries(analytics_service PRIVATE analytics_service_core)
target_link_libraries(analytics_service_core PUBLIC Threads::Threads)
target_link_libraries(analytics_service PRIVATE Threads::Threads)

install(TARGETS analytics_service RUNTIME DESTINATION bin)

