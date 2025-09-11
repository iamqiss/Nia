package sonet.timeline;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * ============= TIMELINE SERVICE =============
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler",
    comments = "Source: services/timeline.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class TimelineServiceGrpc {

  private TimelineServiceGrpc() {}

  public static final String SERVICE_NAME = "sonet.timeline.TimelineService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<sonet.timeline.Timeline.GetTimelineRequest,
      sonet.timeline.Timeline.GetTimelineResponse> getGetTimelineMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetTimeline",
      requestType = sonet.timeline.Timeline.GetTimelineRequest.class,
      responseType = sonet.timeline.Timeline.GetTimelineResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.timeline.Timeline.GetTimelineRequest,
      sonet.timeline.Timeline.GetTimelineResponse> getGetTimelineMethod() {
    io.grpc.MethodDescriptor<sonet.timeline.Timeline.GetTimelineRequest, sonet.timeline.Timeline.GetTimelineResponse> getGetTimelineMethod;
    if ((getGetTimelineMethod = TimelineServiceGrpc.getGetTimelineMethod) == null) {
      synchronized (TimelineServiceGrpc.class) {
        if ((getGetTimelineMethod = TimelineServiceGrpc.getGetTimelineMethod) == null) {
          TimelineServiceGrpc.getGetTimelineMethod = getGetTimelineMethod =
              io.grpc.MethodDescriptor.<sonet.timeline.Timeline.GetTimelineRequest, sonet.timeline.Timeline.GetTimelineResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetTimeline"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.GetTimelineRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.GetTimelineResponse.getDefaultInstance()))
              .setSchemaDescriptor(new TimelineServiceMethodDescriptorSupplier("GetTimeline"))
              .build();
        }
      }
    }
    return getGetTimelineMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.timeline.Timeline.GetUserTimelineRequest,
      sonet.timeline.Timeline.GetUserTimelineResponse> getGetUserTimelineMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetUserTimeline",
      requestType = sonet.timeline.Timeline.GetUserTimelineRequest.class,
      responseType = sonet.timeline.Timeline.GetUserTimelineResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.timeline.Timeline.GetUserTimelineRequest,
      sonet.timeline.Timeline.GetUserTimelineResponse> getGetUserTimelineMethod() {
    io.grpc.MethodDescriptor<sonet.timeline.Timeline.GetUserTimelineRequest, sonet.timeline.Timeline.GetUserTimelineResponse> getGetUserTimelineMethod;
    if ((getGetUserTimelineMethod = TimelineServiceGrpc.getGetUserTimelineMethod) == null) {
      synchronized (TimelineServiceGrpc.class) {
        if ((getGetUserTimelineMethod = TimelineServiceGrpc.getGetUserTimelineMethod) == null) {
          TimelineServiceGrpc.getGetUserTimelineMethod = getGetUserTimelineMethod =
              io.grpc.MethodDescriptor.<sonet.timeline.Timeline.GetUserTimelineRequest, sonet.timeline.Timeline.GetUserTimelineResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetUserTimeline"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.GetUserTimelineRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.GetUserTimelineResponse.getDefaultInstance()))
              .setSchemaDescriptor(new TimelineServiceMethodDescriptorSupplier("GetUserTimeline"))
              .build();
        }
      }
    }
    return getGetUserTimelineMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.timeline.Timeline.RefreshTimelineRequest,
      sonet.timeline.Timeline.RefreshTimelineResponse> getRefreshTimelineMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "RefreshTimeline",
      requestType = sonet.timeline.Timeline.RefreshTimelineRequest.class,
      responseType = sonet.timeline.Timeline.RefreshTimelineResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.timeline.Timeline.RefreshTimelineRequest,
      sonet.timeline.Timeline.RefreshTimelineResponse> getRefreshTimelineMethod() {
    io.grpc.MethodDescriptor<sonet.timeline.Timeline.RefreshTimelineRequest, sonet.timeline.Timeline.RefreshTimelineResponse> getRefreshTimelineMethod;
    if ((getRefreshTimelineMethod = TimelineServiceGrpc.getRefreshTimelineMethod) == null) {
      synchronized (TimelineServiceGrpc.class) {
        if ((getRefreshTimelineMethod = TimelineServiceGrpc.getRefreshTimelineMethod) == null) {
          TimelineServiceGrpc.getRefreshTimelineMethod = getRefreshTimelineMethod =
              io.grpc.MethodDescriptor.<sonet.timeline.Timeline.RefreshTimelineRequest, sonet.timeline.Timeline.RefreshTimelineResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "RefreshTimeline"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.RefreshTimelineRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.RefreshTimelineResponse.getDefaultInstance()))
              .setSchemaDescriptor(new TimelineServiceMethodDescriptorSupplier("RefreshTimeline"))
              .build();
        }
      }
    }
    return getRefreshTimelineMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.timeline.Timeline.MarkTimelineReadRequest,
      sonet.timeline.Timeline.MarkTimelineReadResponse> getMarkTimelineReadMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "MarkTimelineRead",
      requestType = sonet.timeline.Timeline.MarkTimelineReadRequest.class,
      responseType = sonet.timeline.Timeline.MarkTimelineReadResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.timeline.Timeline.MarkTimelineReadRequest,
      sonet.timeline.Timeline.MarkTimelineReadResponse> getMarkTimelineReadMethod() {
    io.grpc.MethodDescriptor<sonet.timeline.Timeline.MarkTimelineReadRequest, sonet.timeline.Timeline.MarkTimelineReadResponse> getMarkTimelineReadMethod;
    if ((getMarkTimelineReadMethod = TimelineServiceGrpc.getMarkTimelineReadMethod) == null) {
      synchronized (TimelineServiceGrpc.class) {
        if ((getMarkTimelineReadMethod = TimelineServiceGrpc.getMarkTimelineReadMethod) == null) {
          TimelineServiceGrpc.getMarkTimelineReadMethod = getMarkTimelineReadMethod =
              io.grpc.MethodDescriptor.<sonet.timeline.Timeline.MarkTimelineReadRequest, sonet.timeline.Timeline.MarkTimelineReadResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "MarkTimelineRead"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.MarkTimelineReadRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.MarkTimelineReadResponse.getDefaultInstance()))
              .setSchemaDescriptor(new TimelineServiceMethodDescriptorSupplier("MarkTimelineRead"))
              .build();
        }
      }
    }
    return getMarkTimelineReadMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.timeline.Timeline.UpdateTimelinePreferencesRequest,
      sonet.timeline.Timeline.UpdateTimelinePreferencesResponse> getUpdateTimelinePreferencesMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UpdateTimelinePreferences",
      requestType = sonet.timeline.Timeline.UpdateTimelinePreferencesRequest.class,
      responseType = sonet.timeline.Timeline.UpdateTimelinePreferencesResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.timeline.Timeline.UpdateTimelinePreferencesRequest,
      sonet.timeline.Timeline.UpdateTimelinePreferencesResponse> getUpdateTimelinePreferencesMethod() {
    io.grpc.MethodDescriptor<sonet.timeline.Timeline.UpdateTimelinePreferencesRequest, sonet.timeline.Timeline.UpdateTimelinePreferencesResponse> getUpdateTimelinePreferencesMethod;
    if ((getUpdateTimelinePreferencesMethod = TimelineServiceGrpc.getUpdateTimelinePreferencesMethod) == null) {
      synchronized (TimelineServiceGrpc.class) {
        if ((getUpdateTimelinePreferencesMethod = TimelineServiceGrpc.getUpdateTimelinePreferencesMethod) == null) {
          TimelineServiceGrpc.getUpdateTimelinePreferencesMethod = getUpdateTimelinePreferencesMethod =
              io.grpc.MethodDescriptor.<sonet.timeline.Timeline.UpdateTimelinePreferencesRequest, sonet.timeline.Timeline.UpdateTimelinePreferencesResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UpdateTimelinePreferences"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.UpdateTimelinePreferencesRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.UpdateTimelinePreferencesResponse.getDefaultInstance()))
              .setSchemaDescriptor(new TimelineServiceMethodDescriptorSupplier("UpdateTimelinePreferences"))
              .build();
        }
      }
    }
    return getUpdateTimelinePreferencesMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.timeline.Timeline.GetTimelinePreferencesRequest,
      sonet.timeline.Timeline.GetTimelinePreferencesResponse> getGetTimelinePreferencesMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetTimelinePreferences",
      requestType = sonet.timeline.Timeline.GetTimelinePreferencesRequest.class,
      responseType = sonet.timeline.Timeline.GetTimelinePreferencesResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.timeline.Timeline.GetTimelinePreferencesRequest,
      sonet.timeline.Timeline.GetTimelinePreferencesResponse> getGetTimelinePreferencesMethod() {
    io.grpc.MethodDescriptor<sonet.timeline.Timeline.GetTimelinePreferencesRequest, sonet.timeline.Timeline.GetTimelinePreferencesResponse> getGetTimelinePreferencesMethod;
    if ((getGetTimelinePreferencesMethod = TimelineServiceGrpc.getGetTimelinePreferencesMethod) == null) {
      synchronized (TimelineServiceGrpc.class) {
        if ((getGetTimelinePreferencesMethod = TimelineServiceGrpc.getGetTimelinePreferencesMethod) == null) {
          TimelineServiceGrpc.getGetTimelinePreferencesMethod = getGetTimelinePreferencesMethod =
              io.grpc.MethodDescriptor.<sonet.timeline.Timeline.GetTimelinePreferencesRequest, sonet.timeline.Timeline.GetTimelinePreferencesResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetTimelinePreferences"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.GetTimelinePreferencesRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.GetTimelinePreferencesResponse.getDefaultInstance()))
              .setSchemaDescriptor(new TimelineServiceMethodDescriptorSupplier("GetTimelinePreferences"))
              .build();
        }
      }
    }
    return getGetTimelinePreferencesMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.timeline.Timeline.SubscribeTimelineUpdatesRequest,
      sonet.timeline.Timeline.TimelineUpdate> getSubscribeTimelineUpdatesMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "SubscribeTimelineUpdates",
      requestType = sonet.timeline.Timeline.SubscribeTimelineUpdatesRequest.class,
      responseType = sonet.timeline.Timeline.TimelineUpdate.class,
      methodType = io.grpc.MethodDescriptor.MethodType.SERVER_STREAMING)
  public static io.grpc.MethodDescriptor<sonet.timeline.Timeline.SubscribeTimelineUpdatesRequest,
      sonet.timeline.Timeline.TimelineUpdate> getSubscribeTimelineUpdatesMethod() {
    io.grpc.MethodDescriptor<sonet.timeline.Timeline.SubscribeTimelineUpdatesRequest, sonet.timeline.Timeline.TimelineUpdate> getSubscribeTimelineUpdatesMethod;
    if ((getSubscribeTimelineUpdatesMethod = TimelineServiceGrpc.getSubscribeTimelineUpdatesMethod) == null) {
      synchronized (TimelineServiceGrpc.class) {
        if ((getSubscribeTimelineUpdatesMethod = TimelineServiceGrpc.getSubscribeTimelineUpdatesMethod) == null) {
          TimelineServiceGrpc.getSubscribeTimelineUpdatesMethod = getSubscribeTimelineUpdatesMethod =
              io.grpc.MethodDescriptor.<sonet.timeline.Timeline.SubscribeTimelineUpdatesRequest, sonet.timeline.Timeline.TimelineUpdate>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.SERVER_STREAMING)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "SubscribeTimelineUpdates"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.SubscribeTimelineUpdatesRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.TimelineUpdate.getDefaultInstance()))
              .setSchemaDescriptor(new TimelineServiceMethodDescriptorSupplier("SubscribeTimelineUpdates"))
              .build();
        }
      }
    }
    return getSubscribeTimelineUpdatesMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.timeline.Timeline.HealthCheckRequest,
      sonet.timeline.Timeline.HealthCheckResponse> getHealthCheckMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "HealthCheck",
      requestType = sonet.timeline.Timeline.HealthCheckRequest.class,
      responseType = sonet.timeline.Timeline.HealthCheckResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.timeline.Timeline.HealthCheckRequest,
      sonet.timeline.Timeline.HealthCheckResponse> getHealthCheckMethod() {
    io.grpc.MethodDescriptor<sonet.timeline.Timeline.HealthCheckRequest, sonet.timeline.Timeline.HealthCheckResponse> getHealthCheckMethod;
    if ((getHealthCheckMethod = TimelineServiceGrpc.getHealthCheckMethod) == null) {
      synchronized (TimelineServiceGrpc.class) {
        if ((getHealthCheckMethod = TimelineServiceGrpc.getHealthCheckMethod) == null) {
          TimelineServiceGrpc.getHealthCheckMethod = getHealthCheckMethod =
              io.grpc.MethodDescriptor.<sonet.timeline.Timeline.HealthCheckRequest, sonet.timeline.Timeline.HealthCheckResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "HealthCheck"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.HealthCheckRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.timeline.Timeline.HealthCheckResponse.getDefaultInstance()))
              .setSchemaDescriptor(new TimelineServiceMethodDescriptorSupplier("HealthCheck"))
              .build();
        }
      }
    }
    return getHealthCheckMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static TimelineServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<TimelineServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<TimelineServiceStub>() {
        @java.lang.Override
        public TimelineServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new TimelineServiceStub(channel, callOptions);
        }
      };
    return TimelineServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static TimelineServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<TimelineServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<TimelineServiceBlockingStub>() {
        @java.lang.Override
        public TimelineServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new TimelineServiceBlockingStub(channel, callOptions);
        }
      };
    return TimelineServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static TimelineServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<TimelineServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<TimelineServiceFutureStub>() {
        @java.lang.Override
        public TimelineServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new TimelineServiceFutureStub(channel, callOptions);
        }
      };
    return TimelineServiceFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * ============= TIMELINE SERVICE =============
   * </pre>
   */
  public static abstract class TimelineServiceImplBase implements io.grpc.BindableService {

    /**
     * <pre>
     * Core timeline operations
     * </pre>
     */
    public void getTimeline(sonet.timeline.Timeline.GetTimelineRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.GetTimelineResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetTimelineMethod(), responseObserver);
    }

    /**
     */
    public void getUserTimeline(sonet.timeline.Timeline.GetUserTimelineRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.GetUserTimelineResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetUserTimelineMethod(), responseObserver);
    }

    /**
     */
    public void refreshTimeline(sonet.timeline.Timeline.RefreshTimelineRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.RefreshTimelineResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getRefreshTimelineMethod(), responseObserver);
    }

    /**
     * <pre>
     * Timeline state management
     * </pre>
     */
    public void markTimelineRead(sonet.timeline.Timeline.MarkTimelineReadRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.MarkTimelineReadResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getMarkTimelineReadMethod(), responseObserver);
    }

    /**
     * <pre>
     * Preferences
     * </pre>
     */
    public void updateTimelinePreferences(sonet.timeline.Timeline.UpdateTimelinePreferencesRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.UpdateTimelinePreferencesResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUpdateTimelinePreferencesMethod(), responseObserver);
    }

    /**
     */
    public void getTimelinePreferences(sonet.timeline.Timeline.GetTimelinePreferencesRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.GetTimelinePreferencesResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetTimelinePreferencesMethod(), responseObserver);
    }

    /**
     * <pre>
     * Real-time updates (server streaming)
     * </pre>
     */
    public void subscribeTimelineUpdates(sonet.timeline.Timeline.SubscribeTimelineUpdatesRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.TimelineUpdate> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getSubscribeTimelineUpdatesMethod(), responseObserver);
    }

    /**
     * <pre>
     * Health
     * </pre>
     */
    public void healthCheck(sonet.timeline.Timeline.HealthCheckRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.HealthCheckResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getHealthCheckMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getGetTimelineMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.timeline.Timeline.GetTimelineRequest,
                sonet.timeline.Timeline.GetTimelineResponse>(
                  this, METHODID_GET_TIMELINE)))
          .addMethod(
            getGetUserTimelineMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.timeline.Timeline.GetUserTimelineRequest,
                sonet.timeline.Timeline.GetUserTimelineResponse>(
                  this, METHODID_GET_USER_TIMELINE)))
          .addMethod(
            getRefreshTimelineMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.timeline.Timeline.RefreshTimelineRequest,
                sonet.timeline.Timeline.RefreshTimelineResponse>(
                  this, METHODID_REFRESH_TIMELINE)))
          .addMethod(
            getMarkTimelineReadMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.timeline.Timeline.MarkTimelineReadRequest,
                sonet.timeline.Timeline.MarkTimelineReadResponse>(
                  this, METHODID_MARK_TIMELINE_READ)))
          .addMethod(
            getUpdateTimelinePreferencesMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.timeline.Timeline.UpdateTimelinePreferencesRequest,
                sonet.timeline.Timeline.UpdateTimelinePreferencesResponse>(
                  this, METHODID_UPDATE_TIMELINE_PREFERENCES)))
          .addMethod(
            getGetTimelinePreferencesMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.timeline.Timeline.GetTimelinePreferencesRequest,
                sonet.timeline.Timeline.GetTimelinePreferencesResponse>(
                  this, METHODID_GET_TIMELINE_PREFERENCES)))
          .addMethod(
            getSubscribeTimelineUpdatesMethod(),
            io.grpc.stub.ServerCalls.asyncServerStreamingCall(
              new MethodHandlers<
                sonet.timeline.Timeline.SubscribeTimelineUpdatesRequest,
                sonet.timeline.Timeline.TimelineUpdate>(
                  this, METHODID_SUBSCRIBE_TIMELINE_UPDATES)))
          .addMethod(
            getHealthCheckMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.timeline.Timeline.HealthCheckRequest,
                sonet.timeline.Timeline.HealthCheckResponse>(
                  this, METHODID_HEALTH_CHECK)))
          .build();
    }
  }

  /**
   * <pre>
   * ============= TIMELINE SERVICE =============
   * </pre>
   */
  public static final class TimelineServiceStub extends io.grpc.stub.AbstractAsyncStub<TimelineServiceStub> {
    private TimelineServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected TimelineServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new TimelineServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * Core timeline operations
     * </pre>
     */
    public void getTimeline(sonet.timeline.Timeline.GetTimelineRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.GetTimelineResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetTimelineMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void getUserTimeline(sonet.timeline.Timeline.GetUserTimelineRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.GetUserTimelineResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetUserTimelineMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void refreshTimeline(sonet.timeline.Timeline.RefreshTimelineRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.RefreshTimelineResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getRefreshTimelineMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Timeline state management
     * </pre>
     */
    public void markTimelineRead(sonet.timeline.Timeline.MarkTimelineReadRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.MarkTimelineReadResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getMarkTimelineReadMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Preferences
     * </pre>
     */
    public void updateTimelinePreferences(sonet.timeline.Timeline.UpdateTimelinePreferencesRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.UpdateTimelinePreferencesResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpdateTimelinePreferencesMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void getTimelinePreferences(sonet.timeline.Timeline.GetTimelinePreferencesRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.GetTimelinePreferencesResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetTimelinePreferencesMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Real-time updates (server streaming)
     * </pre>
     */
    public void subscribeTimelineUpdates(sonet.timeline.Timeline.SubscribeTimelineUpdatesRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.TimelineUpdate> responseObserver) {
      io.grpc.stub.ClientCalls.asyncServerStreamingCall(
          getChannel().newCall(getSubscribeTimelineUpdatesMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Health
     * </pre>
     */
    public void healthCheck(sonet.timeline.Timeline.HealthCheckRequest request,
        io.grpc.stub.StreamObserver<sonet.timeline.Timeline.HealthCheckResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getHealthCheckMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * <pre>
   * ============= TIMELINE SERVICE =============
   * </pre>
   */
  public static final class TimelineServiceBlockingStub extends io.grpc.stub.AbstractBlockingStub<TimelineServiceBlockingStub> {
    private TimelineServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected TimelineServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new TimelineServiceBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * Core timeline operations
     * </pre>
     */
    public sonet.timeline.Timeline.GetTimelineResponse getTimeline(sonet.timeline.Timeline.GetTimelineRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetTimelineMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.timeline.Timeline.GetUserTimelineResponse getUserTimeline(sonet.timeline.Timeline.GetUserTimelineRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetUserTimelineMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.timeline.Timeline.RefreshTimelineResponse refreshTimeline(sonet.timeline.Timeline.RefreshTimelineRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getRefreshTimelineMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Timeline state management
     * </pre>
     */
    public sonet.timeline.Timeline.MarkTimelineReadResponse markTimelineRead(sonet.timeline.Timeline.MarkTimelineReadRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getMarkTimelineReadMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Preferences
     * </pre>
     */
    public sonet.timeline.Timeline.UpdateTimelinePreferencesResponse updateTimelinePreferences(sonet.timeline.Timeline.UpdateTimelinePreferencesRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpdateTimelinePreferencesMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.timeline.Timeline.GetTimelinePreferencesResponse getTimelinePreferences(sonet.timeline.Timeline.GetTimelinePreferencesRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetTimelinePreferencesMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Real-time updates (server streaming)
     * </pre>
     */
    public java.util.Iterator<sonet.timeline.Timeline.TimelineUpdate> subscribeTimelineUpdates(
        sonet.timeline.Timeline.SubscribeTimelineUpdatesRequest request) {
      return io.grpc.stub.ClientCalls.blockingServerStreamingCall(
          getChannel(), getSubscribeTimelineUpdatesMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Health
     * </pre>
     */
    public sonet.timeline.Timeline.HealthCheckResponse healthCheck(sonet.timeline.Timeline.HealthCheckRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getHealthCheckMethod(), getCallOptions(), request);
    }
  }

  /**
   * <pre>
   * ============= TIMELINE SERVICE =============
   * </pre>
   */
  public static final class TimelineServiceFutureStub extends io.grpc.stub.AbstractFutureStub<TimelineServiceFutureStub> {
    private TimelineServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected TimelineServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new TimelineServiceFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * Core timeline operations
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.timeline.Timeline.GetTimelineResponse> getTimeline(
        sonet.timeline.Timeline.GetTimelineRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetTimelineMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.timeline.Timeline.GetUserTimelineResponse> getUserTimeline(
        sonet.timeline.Timeline.GetUserTimelineRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetUserTimelineMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.timeline.Timeline.RefreshTimelineResponse> refreshTimeline(
        sonet.timeline.Timeline.RefreshTimelineRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getRefreshTimelineMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Timeline state management
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.timeline.Timeline.MarkTimelineReadResponse> markTimelineRead(
        sonet.timeline.Timeline.MarkTimelineReadRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getMarkTimelineReadMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Preferences
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.timeline.Timeline.UpdateTimelinePreferencesResponse> updateTimelinePreferences(
        sonet.timeline.Timeline.UpdateTimelinePreferencesRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpdateTimelinePreferencesMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.timeline.Timeline.GetTimelinePreferencesResponse> getTimelinePreferences(
        sonet.timeline.Timeline.GetTimelinePreferencesRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetTimelinePreferencesMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Health
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.timeline.Timeline.HealthCheckResponse> healthCheck(
        sonet.timeline.Timeline.HealthCheckRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getHealthCheckMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_GET_TIMELINE = 0;
  private static final int METHODID_GET_USER_TIMELINE = 1;
  private static final int METHODID_REFRESH_TIMELINE = 2;
  private static final int METHODID_MARK_TIMELINE_READ = 3;
  private static final int METHODID_UPDATE_TIMELINE_PREFERENCES = 4;
  private static final int METHODID_GET_TIMELINE_PREFERENCES = 5;
  private static final int METHODID_SUBSCRIBE_TIMELINE_UPDATES = 6;
  private static final int METHODID_HEALTH_CHECK = 7;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final TimelineServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(TimelineServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_GET_TIMELINE:
          serviceImpl.getTimeline((sonet.timeline.Timeline.GetTimelineRequest) request,
              (io.grpc.stub.StreamObserver<sonet.timeline.Timeline.GetTimelineResponse>) responseObserver);
          break;
        case METHODID_GET_USER_TIMELINE:
          serviceImpl.getUserTimeline((sonet.timeline.Timeline.GetUserTimelineRequest) request,
              (io.grpc.stub.StreamObserver<sonet.timeline.Timeline.GetUserTimelineResponse>) responseObserver);
          break;
        case METHODID_REFRESH_TIMELINE:
          serviceImpl.refreshTimeline((sonet.timeline.Timeline.RefreshTimelineRequest) request,
              (io.grpc.stub.StreamObserver<sonet.timeline.Timeline.RefreshTimelineResponse>) responseObserver);
          break;
        case METHODID_MARK_TIMELINE_READ:
          serviceImpl.markTimelineRead((sonet.timeline.Timeline.MarkTimelineReadRequest) request,
              (io.grpc.stub.StreamObserver<sonet.timeline.Timeline.MarkTimelineReadResponse>) responseObserver);
          break;
        case METHODID_UPDATE_TIMELINE_PREFERENCES:
          serviceImpl.updateTimelinePreferences((sonet.timeline.Timeline.UpdateTimelinePreferencesRequest) request,
              (io.grpc.stub.StreamObserver<sonet.timeline.Timeline.UpdateTimelinePreferencesResponse>) responseObserver);
          break;
        case METHODID_GET_TIMELINE_PREFERENCES:
          serviceImpl.getTimelinePreferences((sonet.timeline.Timeline.GetTimelinePreferencesRequest) request,
              (io.grpc.stub.StreamObserver<sonet.timeline.Timeline.GetTimelinePreferencesResponse>) responseObserver);
          break;
        case METHODID_SUBSCRIBE_TIMELINE_UPDATES:
          serviceImpl.subscribeTimelineUpdates((sonet.timeline.Timeline.SubscribeTimelineUpdatesRequest) request,
              (io.grpc.stub.StreamObserver<sonet.timeline.Timeline.TimelineUpdate>) responseObserver);
          break;
        case METHODID_HEALTH_CHECK:
          serviceImpl.healthCheck((sonet.timeline.Timeline.HealthCheckRequest) request,
              (io.grpc.stub.StreamObserver<sonet.timeline.Timeline.HealthCheckResponse>) responseObserver);
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

  private static abstract class TimelineServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    TimelineServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return sonet.timeline.Timeline.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("TimelineService");
    }
  }

  private static final class TimelineServiceFileDescriptorSupplier
      extends TimelineServiceBaseDescriptorSupplier {
    TimelineServiceFileDescriptorSupplier() {}
  }

  private static final class TimelineServiceMethodDescriptorSupplier
      extends TimelineServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    TimelineServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (TimelineServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new TimelineServiceFileDescriptorSupplier())
              .addMethod(getGetTimelineMethod())
              .addMethod(getGetUserTimelineMethod())
              .addMethod(getRefreshTimelineMethod())
              .addMethod(getMarkTimelineReadMethod())
              .addMethod(getUpdateTimelinePreferencesMethod())
              .addMethod(getGetTimelinePreferencesMethod())
              .addMethod(getSubscribeTimelineUpdatesMethod())
              .addMethod(getHealthCheckMethod())
              .build();
        }
      }
    }
    return result;
  }
}
