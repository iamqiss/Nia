package sonet.fanout;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * ============= FANOUT SERVICE =============
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler",
    comments = "Source: services/fanout.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class FanoutServiceGrpc {

  private FanoutServiceGrpc() {}

  public static final String SERVICE_NAME = "sonet.fanout.FanoutService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<sonet.fanout.Fanout.InitiateFanoutRequest,
      sonet.fanout.Fanout.InitiateFanoutResponse> getInitiateFanoutMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "InitiateFanout",
      requestType = sonet.fanout.Fanout.InitiateFanoutRequest.class,
      responseType = sonet.fanout.Fanout.InitiateFanoutResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.fanout.Fanout.InitiateFanoutRequest,
      sonet.fanout.Fanout.InitiateFanoutResponse> getInitiateFanoutMethod() {
    io.grpc.MethodDescriptor<sonet.fanout.Fanout.InitiateFanoutRequest, sonet.fanout.Fanout.InitiateFanoutResponse> getInitiateFanoutMethod;
    if ((getInitiateFanoutMethod = FanoutServiceGrpc.getInitiateFanoutMethod) == null) {
      synchronized (FanoutServiceGrpc.class) {
        if ((getInitiateFanoutMethod = FanoutServiceGrpc.getInitiateFanoutMethod) == null) {
          FanoutServiceGrpc.getInitiateFanoutMethod = getInitiateFanoutMethod =
              io.grpc.MethodDescriptor.<sonet.fanout.Fanout.InitiateFanoutRequest, sonet.fanout.Fanout.InitiateFanoutResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "InitiateFanout"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.InitiateFanoutRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.InitiateFanoutResponse.getDefaultInstance()))
              .setSchemaDescriptor(new FanoutServiceMethodDescriptorSupplier("InitiateFanout"))
              .build();
        }
      }
    }
    return getInitiateFanoutMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.fanout.Fanout.GetFanoutJobStatusRequest,
      sonet.fanout.Fanout.GetFanoutJobStatusResponse> getGetFanoutJobStatusMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetFanoutJobStatus",
      requestType = sonet.fanout.Fanout.GetFanoutJobStatusRequest.class,
      responseType = sonet.fanout.Fanout.GetFanoutJobStatusResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.fanout.Fanout.GetFanoutJobStatusRequest,
      sonet.fanout.Fanout.GetFanoutJobStatusResponse> getGetFanoutJobStatusMethod() {
    io.grpc.MethodDescriptor<sonet.fanout.Fanout.GetFanoutJobStatusRequest, sonet.fanout.Fanout.GetFanoutJobStatusResponse> getGetFanoutJobStatusMethod;
    if ((getGetFanoutJobStatusMethod = FanoutServiceGrpc.getGetFanoutJobStatusMethod) == null) {
      synchronized (FanoutServiceGrpc.class) {
        if ((getGetFanoutJobStatusMethod = FanoutServiceGrpc.getGetFanoutJobStatusMethod) == null) {
          FanoutServiceGrpc.getGetFanoutJobStatusMethod = getGetFanoutJobStatusMethod =
              io.grpc.MethodDescriptor.<sonet.fanout.Fanout.GetFanoutJobStatusRequest, sonet.fanout.Fanout.GetFanoutJobStatusResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetFanoutJobStatus"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.GetFanoutJobStatusRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.GetFanoutJobStatusResponse.getDefaultInstance()))
              .setSchemaDescriptor(new FanoutServiceMethodDescriptorSupplier("GetFanoutJobStatus"))
              .build();
        }
      }
    }
    return getGetFanoutJobStatusMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.fanout.Fanout.CancelFanoutJobRequest,
      sonet.fanout.Fanout.CancelFanoutJobResponse> getCancelFanoutJobMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CancelFanoutJob",
      requestType = sonet.fanout.Fanout.CancelFanoutJobRequest.class,
      responseType = sonet.fanout.Fanout.CancelFanoutJobResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.fanout.Fanout.CancelFanoutJobRequest,
      sonet.fanout.Fanout.CancelFanoutJobResponse> getCancelFanoutJobMethod() {
    io.grpc.MethodDescriptor<sonet.fanout.Fanout.CancelFanoutJobRequest, sonet.fanout.Fanout.CancelFanoutJobResponse> getCancelFanoutJobMethod;
    if ((getCancelFanoutJobMethod = FanoutServiceGrpc.getCancelFanoutJobMethod) == null) {
      synchronized (FanoutServiceGrpc.class) {
        if ((getCancelFanoutJobMethod = FanoutServiceGrpc.getCancelFanoutJobMethod) == null) {
          FanoutServiceGrpc.getCancelFanoutJobMethod = getCancelFanoutJobMethod =
              io.grpc.MethodDescriptor.<sonet.fanout.Fanout.CancelFanoutJobRequest, sonet.fanout.Fanout.CancelFanoutJobResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CancelFanoutJob"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.CancelFanoutJobRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.CancelFanoutJobResponse.getDefaultInstance()))
              .setSchemaDescriptor(new FanoutServiceMethodDescriptorSupplier("CancelFanoutJob"))
              .build();
        }
      }
    }
    return getCancelFanoutJobMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.fanout.Fanout.GetUserTierRequest,
      sonet.fanout.Fanout.GetUserTierResponse> getGetUserTierMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetUserTier",
      requestType = sonet.fanout.Fanout.GetUserTierRequest.class,
      responseType = sonet.fanout.Fanout.GetUserTierResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.fanout.Fanout.GetUserTierRequest,
      sonet.fanout.Fanout.GetUserTierResponse> getGetUserTierMethod() {
    io.grpc.MethodDescriptor<sonet.fanout.Fanout.GetUserTierRequest, sonet.fanout.Fanout.GetUserTierResponse> getGetUserTierMethod;
    if ((getGetUserTierMethod = FanoutServiceGrpc.getGetUserTierMethod) == null) {
      synchronized (FanoutServiceGrpc.class) {
        if ((getGetUserTierMethod = FanoutServiceGrpc.getGetUserTierMethod) == null) {
          FanoutServiceGrpc.getGetUserTierMethod = getGetUserTierMethod =
              io.grpc.MethodDescriptor.<sonet.fanout.Fanout.GetUserTierRequest, sonet.fanout.Fanout.GetUserTierResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetUserTier"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.GetUserTierRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.GetUserTierResponse.getDefaultInstance()))
              .setSchemaDescriptor(new FanoutServiceMethodDescriptorSupplier("GetUserTier"))
              .build();
        }
      }
    }
    return getGetUserTierMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.fanout.Fanout.ProcessFollowerBatchRequest,
      sonet.fanout.Fanout.ProcessFollowerBatchResponse> getProcessFollowerBatchMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "ProcessFollowerBatch",
      requestType = sonet.fanout.Fanout.ProcessFollowerBatchRequest.class,
      responseType = sonet.fanout.Fanout.ProcessFollowerBatchResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.fanout.Fanout.ProcessFollowerBatchRequest,
      sonet.fanout.Fanout.ProcessFollowerBatchResponse> getProcessFollowerBatchMethod() {
    io.grpc.MethodDescriptor<sonet.fanout.Fanout.ProcessFollowerBatchRequest, sonet.fanout.Fanout.ProcessFollowerBatchResponse> getProcessFollowerBatchMethod;
    if ((getProcessFollowerBatchMethod = FanoutServiceGrpc.getProcessFollowerBatchMethod) == null) {
      synchronized (FanoutServiceGrpc.class) {
        if ((getProcessFollowerBatchMethod = FanoutServiceGrpc.getProcessFollowerBatchMethod) == null) {
          FanoutServiceGrpc.getProcessFollowerBatchMethod = getProcessFollowerBatchMethod =
              io.grpc.MethodDescriptor.<sonet.fanout.Fanout.ProcessFollowerBatchRequest, sonet.fanout.Fanout.ProcessFollowerBatchResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "ProcessFollowerBatch"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.ProcessFollowerBatchRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.ProcessFollowerBatchResponse.getDefaultInstance()))
              .setSchemaDescriptor(new FanoutServiceMethodDescriptorSupplier("ProcessFollowerBatch"))
              .build();
        }
      }
    }
    return getProcessFollowerBatchMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.fanout.Fanout.GetFanoutMetricsRequest,
      sonet.fanout.Fanout.GetFanoutMetricsResponse> getGetFanoutMetricsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetFanoutMetrics",
      requestType = sonet.fanout.Fanout.GetFanoutMetricsRequest.class,
      responseType = sonet.fanout.Fanout.GetFanoutMetricsResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.fanout.Fanout.GetFanoutMetricsRequest,
      sonet.fanout.Fanout.GetFanoutMetricsResponse> getGetFanoutMetricsMethod() {
    io.grpc.MethodDescriptor<sonet.fanout.Fanout.GetFanoutMetricsRequest, sonet.fanout.Fanout.GetFanoutMetricsResponse> getGetFanoutMetricsMethod;
    if ((getGetFanoutMetricsMethod = FanoutServiceGrpc.getGetFanoutMetricsMethod) == null) {
      synchronized (FanoutServiceGrpc.class) {
        if ((getGetFanoutMetricsMethod = FanoutServiceGrpc.getGetFanoutMetricsMethod) == null) {
          FanoutServiceGrpc.getGetFanoutMetricsMethod = getGetFanoutMetricsMethod =
              io.grpc.MethodDescriptor.<sonet.fanout.Fanout.GetFanoutMetricsRequest, sonet.fanout.Fanout.GetFanoutMetricsResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetFanoutMetrics"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.GetFanoutMetricsRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.GetFanoutMetricsResponse.getDefaultInstance()))
              .setSchemaDescriptor(new FanoutServiceMethodDescriptorSupplier("GetFanoutMetrics"))
              .build();
        }
      }
    }
    return getGetFanoutMetricsMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.fanout.Fanout.HealthCheckRequest,
      sonet.fanout.Fanout.HealthCheckResponse> getHealthCheckMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "HealthCheck",
      requestType = sonet.fanout.Fanout.HealthCheckRequest.class,
      responseType = sonet.fanout.Fanout.HealthCheckResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.fanout.Fanout.HealthCheckRequest,
      sonet.fanout.Fanout.HealthCheckResponse> getHealthCheckMethod() {
    io.grpc.MethodDescriptor<sonet.fanout.Fanout.HealthCheckRequest, sonet.fanout.Fanout.HealthCheckResponse> getHealthCheckMethod;
    if ((getHealthCheckMethod = FanoutServiceGrpc.getHealthCheckMethod) == null) {
      synchronized (FanoutServiceGrpc.class) {
        if ((getHealthCheckMethod = FanoutServiceGrpc.getHealthCheckMethod) == null) {
          FanoutServiceGrpc.getHealthCheckMethod = getHealthCheckMethod =
              io.grpc.MethodDescriptor.<sonet.fanout.Fanout.HealthCheckRequest, sonet.fanout.Fanout.HealthCheckResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "HealthCheck"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.HealthCheckRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.fanout.Fanout.HealthCheckResponse.getDefaultInstance()))
              .setSchemaDescriptor(new FanoutServiceMethodDescriptorSupplier("HealthCheck"))
              .build();
        }
      }
    }
    return getHealthCheckMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static FanoutServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<FanoutServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<FanoutServiceStub>() {
        @java.lang.Override
        public FanoutServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new FanoutServiceStub(channel, callOptions);
        }
      };
    return FanoutServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static FanoutServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<FanoutServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<FanoutServiceBlockingStub>() {
        @java.lang.Override
        public FanoutServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new FanoutServiceBlockingStub(channel, callOptions);
        }
      };
    return FanoutServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static FanoutServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<FanoutServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<FanoutServiceFutureStub>() {
        @java.lang.Override
        public FanoutServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new FanoutServiceFutureStub(channel, callOptions);
        }
      };
    return FanoutServiceFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * ============= FANOUT SERVICE =============
   * </pre>
   */
  public static abstract class FanoutServiceImplBase implements io.grpc.BindableService {

    /**
     * <pre>
     * Job management
     * </pre>
     */
    public void initiateFanout(sonet.fanout.Fanout.InitiateFanoutRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.InitiateFanoutResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getInitiateFanoutMethod(), responseObserver);
    }

    /**
     */
    public void getFanoutJobStatus(sonet.fanout.Fanout.GetFanoutJobStatusRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.GetFanoutJobStatusResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetFanoutJobStatusMethod(), responseObserver);
    }

    /**
     */
    public void cancelFanoutJob(sonet.fanout.Fanout.CancelFanoutJobRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.CancelFanoutJobResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCancelFanoutJobMethod(), responseObserver);
    }

    /**
     * <pre>
     * User tier management
     * </pre>
     */
    public void getUserTier(sonet.fanout.Fanout.GetUserTierRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.GetUserTierResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetUserTierMethod(), responseObserver);
    }

    /**
     * <pre>
     * Batch processing (internal)
     * </pre>
     */
    public void processFollowerBatch(sonet.fanout.Fanout.ProcessFollowerBatchRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.ProcessFollowerBatchResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getProcessFollowerBatchMethod(), responseObserver);
    }

    /**
     * <pre>
     * Analytics
     * </pre>
     */
    public void getFanoutMetrics(sonet.fanout.Fanout.GetFanoutMetricsRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.GetFanoutMetricsResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetFanoutMetricsMethod(), responseObserver);
    }

    /**
     * <pre>
     * Health
     * </pre>
     */
    public void healthCheck(sonet.fanout.Fanout.HealthCheckRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.HealthCheckResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getHealthCheckMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getInitiateFanoutMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.fanout.Fanout.InitiateFanoutRequest,
                sonet.fanout.Fanout.InitiateFanoutResponse>(
                  this, METHODID_INITIATE_FANOUT)))
          .addMethod(
            getGetFanoutJobStatusMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.fanout.Fanout.GetFanoutJobStatusRequest,
                sonet.fanout.Fanout.GetFanoutJobStatusResponse>(
                  this, METHODID_GET_FANOUT_JOB_STATUS)))
          .addMethod(
            getCancelFanoutJobMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.fanout.Fanout.CancelFanoutJobRequest,
                sonet.fanout.Fanout.CancelFanoutJobResponse>(
                  this, METHODID_CANCEL_FANOUT_JOB)))
          .addMethod(
            getGetUserTierMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.fanout.Fanout.GetUserTierRequest,
                sonet.fanout.Fanout.GetUserTierResponse>(
                  this, METHODID_GET_USER_TIER)))
          .addMethod(
            getProcessFollowerBatchMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.fanout.Fanout.ProcessFollowerBatchRequest,
                sonet.fanout.Fanout.ProcessFollowerBatchResponse>(
                  this, METHODID_PROCESS_FOLLOWER_BATCH)))
          .addMethod(
            getGetFanoutMetricsMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.fanout.Fanout.GetFanoutMetricsRequest,
                sonet.fanout.Fanout.GetFanoutMetricsResponse>(
                  this, METHODID_GET_FANOUT_METRICS)))
          .addMethod(
            getHealthCheckMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.fanout.Fanout.HealthCheckRequest,
                sonet.fanout.Fanout.HealthCheckResponse>(
                  this, METHODID_HEALTH_CHECK)))
          .build();
    }
  }

  /**
   * <pre>
   * ============= FANOUT SERVICE =============
   * </pre>
   */
  public static final class FanoutServiceStub extends io.grpc.stub.AbstractAsyncStub<FanoutServiceStub> {
    private FanoutServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected FanoutServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new FanoutServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * Job management
     * </pre>
     */
    public void initiateFanout(sonet.fanout.Fanout.InitiateFanoutRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.InitiateFanoutResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getInitiateFanoutMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void getFanoutJobStatus(sonet.fanout.Fanout.GetFanoutJobStatusRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.GetFanoutJobStatusResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetFanoutJobStatusMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void cancelFanoutJob(sonet.fanout.Fanout.CancelFanoutJobRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.CancelFanoutJobResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCancelFanoutJobMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * User tier management
     * </pre>
     */
    public void getUserTier(sonet.fanout.Fanout.GetUserTierRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.GetUserTierResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetUserTierMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Batch processing (internal)
     * </pre>
     */
    public void processFollowerBatch(sonet.fanout.Fanout.ProcessFollowerBatchRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.ProcessFollowerBatchResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getProcessFollowerBatchMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Analytics
     * </pre>
     */
    public void getFanoutMetrics(sonet.fanout.Fanout.GetFanoutMetricsRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.GetFanoutMetricsResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetFanoutMetricsMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Health
     * </pre>
     */
    public void healthCheck(sonet.fanout.Fanout.HealthCheckRequest request,
        io.grpc.stub.StreamObserver<sonet.fanout.Fanout.HealthCheckResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getHealthCheckMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * <pre>
   * ============= FANOUT SERVICE =============
   * </pre>
   */
  public static final class FanoutServiceBlockingStub extends io.grpc.stub.AbstractBlockingStub<FanoutServiceBlockingStub> {
    private FanoutServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected FanoutServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new FanoutServiceBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * Job management
     * </pre>
     */
    public sonet.fanout.Fanout.InitiateFanoutResponse initiateFanout(sonet.fanout.Fanout.InitiateFanoutRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getInitiateFanoutMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.fanout.Fanout.GetFanoutJobStatusResponse getFanoutJobStatus(sonet.fanout.Fanout.GetFanoutJobStatusRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetFanoutJobStatusMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.fanout.Fanout.CancelFanoutJobResponse cancelFanoutJob(sonet.fanout.Fanout.CancelFanoutJobRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCancelFanoutJobMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * User tier management
     * </pre>
     */
    public sonet.fanout.Fanout.GetUserTierResponse getUserTier(sonet.fanout.Fanout.GetUserTierRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetUserTierMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Batch processing (internal)
     * </pre>
     */
    public sonet.fanout.Fanout.ProcessFollowerBatchResponse processFollowerBatch(sonet.fanout.Fanout.ProcessFollowerBatchRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getProcessFollowerBatchMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Analytics
     * </pre>
     */
    public sonet.fanout.Fanout.GetFanoutMetricsResponse getFanoutMetrics(sonet.fanout.Fanout.GetFanoutMetricsRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetFanoutMetricsMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Health
     * </pre>
     */
    public sonet.fanout.Fanout.HealthCheckResponse healthCheck(sonet.fanout.Fanout.HealthCheckRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getHealthCheckMethod(), getCallOptions(), request);
    }
  }

  /**
   * <pre>
   * ============= FANOUT SERVICE =============
   * </pre>
   */
  public static final class FanoutServiceFutureStub extends io.grpc.stub.AbstractFutureStub<FanoutServiceFutureStub> {
    private FanoutServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected FanoutServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new FanoutServiceFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * Job management
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.fanout.Fanout.InitiateFanoutResponse> initiateFanout(
        sonet.fanout.Fanout.InitiateFanoutRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getInitiateFanoutMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.fanout.Fanout.GetFanoutJobStatusResponse> getFanoutJobStatus(
        sonet.fanout.Fanout.GetFanoutJobStatusRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetFanoutJobStatusMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.fanout.Fanout.CancelFanoutJobResponse> cancelFanoutJob(
        sonet.fanout.Fanout.CancelFanoutJobRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCancelFanoutJobMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * User tier management
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.fanout.Fanout.GetUserTierResponse> getUserTier(
        sonet.fanout.Fanout.GetUserTierRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetUserTierMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Batch processing (internal)
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.fanout.Fanout.ProcessFollowerBatchResponse> processFollowerBatch(
        sonet.fanout.Fanout.ProcessFollowerBatchRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getProcessFollowerBatchMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Analytics
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.fanout.Fanout.GetFanoutMetricsResponse> getFanoutMetrics(
        sonet.fanout.Fanout.GetFanoutMetricsRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetFanoutMetricsMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Health
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.fanout.Fanout.HealthCheckResponse> healthCheck(
        sonet.fanout.Fanout.HealthCheckRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getHealthCheckMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_INITIATE_FANOUT = 0;
  private static final int METHODID_GET_FANOUT_JOB_STATUS = 1;
  private static final int METHODID_CANCEL_FANOUT_JOB = 2;
  private static final int METHODID_GET_USER_TIER = 3;
  private static final int METHODID_PROCESS_FOLLOWER_BATCH = 4;
  private static final int METHODID_GET_FANOUT_METRICS = 5;
  private static final int METHODID_HEALTH_CHECK = 6;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final FanoutServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(FanoutServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_INITIATE_FANOUT:
          serviceImpl.initiateFanout((sonet.fanout.Fanout.InitiateFanoutRequest) request,
              (io.grpc.stub.StreamObserver<sonet.fanout.Fanout.InitiateFanoutResponse>) responseObserver);
          break;
        case METHODID_GET_FANOUT_JOB_STATUS:
          serviceImpl.getFanoutJobStatus((sonet.fanout.Fanout.GetFanoutJobStatusRequest) request,
              (io.grpc.stub.StreamObserver<sonet.fanout.Fanout.GetFanoutJobStatusResponse>) responseObserver);
          break;
        case METHODID_CANCEL_FANOUT_JOB:
          serviceImpl.cancelFanoutJob((sonet.fanout.Fanout.CancelFanoutJobRequest) request,
              (io.grpc.stub.StreamObserver<sonet.fanout.Fanout.CancelFanoutJobResponse>) responseObserver);
          break;
        case METHODID_GET_USER_TIER:
          serviceImpl.getUserTier((sonet.fanout.Fanout.GetUserTierRequest) request,
              (io.grpc.stub.StreamObserver<sonet.fanout.Fanout.GetUserTierResponse>) responseObserver);
          break;
        case METHODID_PROCESS_FOLLOWER_BATCH:
          serviceImpl.processFollowerBatch((sonet.fanout.Fanout.ProcessFollowerBatchRequest) request,
              (io.grpc.stub.StreamObserver<sonet.fanout.Fanout.ProcessFollowerBatchResponse>) responseObserver);
          break;
        case METHODID_GET_FANOUT_METRICS:
          serviceImpl.getFanoutMetrics((sonet.fanout.Fanout.GetFanoutMetricsRequest) request,
              (io.grpc.stub.StreamObserver<sonet.fanout.Fanout.GetFanoutMetricsResponse>) responseObserver);
          break;
        case METHODID_HEALTH_CHECK:
          serviceImpl.healthCheck((sonet.fanout.Fanout.HealthCheckRequest) request,
              (io.grpc.stub.StreamObserver<sonet.fanout.Fanout.HealthCheckResponse>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  private static abstract class FanoutServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    FanoutServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return sonet.fanout.Fanout.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("FanoutService");
    }
  }

  private static final class FanoutServiceFileDescriptorSupplier
      extends FanoutServiceBaseDescriptorSupplier {
    FanoutServiceFileDescriptorSupplier() {}
  }

  private static final class FanoutServiceMethodDescriptorSupplier
      extends FanoutServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    FanoutServiceMethodDescriptorSupplier(String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (FanoutServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new FanoutServiceFileDescriptorSupplier())
              .addMethod(getInitiateFanoutMethod())
              .addMethod(getGetFanoutJobStatusMethod())
              .addMethod(getCancelFanoutJobMethod())
              .addMethod(getGetUserTierMethod())
              .addMethod(getProcessFollowerBatchMethod())
              .addMethod(getGetFanoutMetricsMethod())
              .addMethod(getHealthCheckMethod())
              .build();
        }
      }
    }
    return result;
  }
}
