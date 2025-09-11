package sonet.media;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler",
    comments = "Source: services/media.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class MediaServiceGrpc {

  private MediaServiceGrpc() {}

  public static final String SERVICE_NAME = "sonet.media.MediaService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.UploadRequest,
      sonet.media.MediaOuterClass.UploadResponse> getUploadMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "Upload",
      requestType = sonet.media.MediaOuterClass.UploadRequest.class,
      responseType = sonet.media.MediaOuterClass.UploadResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.CLIENT_STREAMING)
  public static io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.UploadRequest,
      sonet.media.MediaOuterClass.UploadResponse> getUploadMethod() {
    io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.UploadRequest, sonet.media.MediaOuterClass.UploadResponse> getUploadMethod;
    if ((getUploadMethod = MediaServiceGrpc.getUploadMethod) == null) {
      synchronized (MediaServiceGrpc.class) {
        if ((getUploadMethod = MediaServiceGrpc.getUploadMethod) == null) {
          MediaServiceGrpc.getUploadMethod = getUploadMethod =
              io.grpc.MethodDescriptor.<sonet.media.MediaOuterClass.UploadRequest, sonet.media.MediaOuterClass.UploadResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.CLIENT_STREAMING)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "Upload"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.media.MediaOuterClass.UploadRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.media.MediaOuterClass.UploadResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MediaServiceMethodDescriptorSupplier("Upload"))
              .build();
        }
      }
    }
    return getUploadMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.GetMediaRequest,
      sonet.media.MediaOuterClass.GetMediaResponse> getGetMediaMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetMedia",
      requestType = sonet.media.MediaOuterClass.GetMediaRequest.class,
      responseType = sonet.media.MediaOuterClass.GetMediaResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.GetMediaRequest,
      sonet.media.MediaOuterClass.GetMediaResponse> getGetMediaMethod() {
    io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.GetMediaRequest, sonet.media.MediaOuterClass.GetMediaResponse> getGetMediaMethod;
    if ((getGetMediaMethod = MediaServiceGrpc.getGetMediaMethod) == null) {
      synchronized (MediaServiceGrpc.class) {
        if ((getGetMediaMethod = MediaServiceGrpc.getGetMediaMethod) == null) {
          MediaServiceGrpc.getGetMediaMethod = getGetMediaMethod =
              io.grpc.MethodDescriptor.<sonet.media.MediaOuterClass.GetMediaRequest, sonet.media.MediaOuterClass.GetMediaResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetMedia"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.media.MediaOuterClass.GetMediaRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.media.MediaOuterClass.GetMediaResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MediaServiceMethodDescriptorSupplier("GetMedia"))
              .build();
        }
      }
    }
    return getGetMediaMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.DeleteMediaRequest,
      sonet.media.MediaOuterClass.DeleteMediaResponse> getDeleteMediaMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "DeleteMedia",
      requestType = sonet.media.MediaOuterClass.DeleteMediaRequest.class,
      responseType = sonet.media.MediaOuterClass.DeleteMediaResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.DeleteMediaRequest,
      sonet.media.MediaOuterClass.DeleteMediaResponse> getDeleteMediaMethod() {
    io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.DeleteMediaRequest, sonet.media.MediaOuterClass.DeleteMediaResponse> getDeleteMediaMethod;
    if ((getDeleteMediaMethod = MediaServiceGrpc.getDeleteMediaMethod) == null) {
      synchronized (MediaServiceGrpc.class) {
        if ((getDeleteMediaMethod = MediaServiceGrpc.getDeleteMediaMethod) == null) {
          MediaServiceGrpc.getDeleteMediaMethod = getDeleteMediaMethod =
              io.grpc.MethodDescriptor.<sonet.media.MediaOuterClass.DeleteMediaRequest, sonet.media.MediaOuterClass.DeleteMediaResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "DeleteMedia"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.media.MediaOuterClass.DeleteMediaRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.media.MediaOuterClass.DeleteMediaResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MediaServiceMethodDescriptorSupplier("DeleteMedia"))
              .build();
        }
      }
    }
    return getDeleteMediaMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.ListUserMediaRequest,
      sonet.media.MediaOuterClass.ListUserMediaResponse> getListUserMediaMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "ListUserMedia",
      requestType = sonet.media.MediaOuterClass.ListUserMediaRequest.class,
      responseType = sonet.media.MediaOuterClass.ListUserMediaResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.ListUserMediaRequest,
      sonet.media.MediaOuterClass.ListUserMediaResponse> getListUserMediaMethod() {
    io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.ListUserMediaRequest, sonet.media.MediaOuterClass.ListUserMediaResponse> getListUserMediaMethod;
    if ((getListUserMediaMethod = MediaServiceGrpc.getListUserMediaMethod) == null) {
      synchronized (MediaServiceGrpc.class) {
        if ((getListUserMediaMethod = MediaServiceGrpc.getListUserMediaMethod) == null) {
          MediaServiceGrpc.getListUserMediaMethod = getListUserMediaMethod =
              io.grpc.MethodDescriptor.<sonet.media.MediaOuterClass.ListUserMediaRequest, sonet.media.MediaOuterClass.ListUserMediaResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "ListUserMedia"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.media.MediaOuterClass.ListUserMediaRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.media.MediaOuterClass.ListUserMediaResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MediaServiceMethodDescriptorSupplier("ListUserMedia"))
              .build();
        }
      }
    }
    return getListUserMediaMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.HealthCheckRequest,
      sonet.media.MediaOuterClass.HealthCheckResponse> getHealthCheckMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "HealthCheck",
      requestType = sonet.media.MediaOuterClass.HealthCheckRequest.class,
      responseType = sonet.media.MediaOuterClass.HealthCheckResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.HealthCheckRequest,
      sonet.media.MediaOuterClass.HealthCheckResponse> getHealthCheckMethod() {
    io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.HealthCheckRequest, sonet.media.MediaOuterClass.HealthCheckResponse> getHealthCheckMethod;
    if ((getHealthCheckMethod = MediaServiceGrpc.getHealthCheckMethod) == null) {
      synchronized (MediaServiceGrpc.class) {
        if ((getHealthCheckMethod = MediaServiceGrpc.getHealthCheckMethod) == null) {
          MediaServiceGrpc.getHealthCheckMethod = getHealthCheckMethod =
              io.grpc.MethodDescriptor.<sonet.media.MediaOuterClass.HealthCheckRequest, sonet.media.MediaOuterClass.HealthCheckResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "HealthCheck"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.media.MediaOuterClass.HealthCheckRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.media.MediaOuterClass.HealthCheckResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MediaServiceMethodDescriptorSupplier("HealthCheck"))
              .build();
        }
      }
    }
    return getHealthCheckMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.ToggleMediaLikeRequest,
      sonet.media.MediaOuterClass.ToggleMediaLikeResponse> getToggleMediaLikeMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "ToggleMediaLike",
      requestType = sonet.media.MediaOuterClass.ToggleMediaLikeRequest.class,
      responseType = sonet.media.MediaOuterClass.ToggleMediaLikeResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.ToggleMediaLikeRequest,
      sonet.media.MediaOuterClass.ToggleMediaLikeResponse> getToggleMediaLikeMethod() {
    io.grpc.MethodDescriptor<sonet.media.MediaOuterClass.ToggleMediaLikeRequest, sonet.media.MediaOuterClass.ToggleMediaLikeResponse> getToggleMediaLikeMethod;
    if ((getToggleMediaLikeMethod = MediaServiceGrpc.getToggleMediaLikeMethod) == null) {
      synchronized (MediaServiceGrpc.class) {
        if ((getToggleMediaLikeMethod = MediaServiceGrpc.getToggleMediaLikeMethod) == null) {
          MediaServiceGrpc.getToggleMediaLikeMethod = getToggleMediaLikeMethod =
              io.grpc.MethodDescriptor.<sonet.media.MediaOuterClass.ToggleMediaLikeRequest, sonet.media.MediaOuterClass.ToggleMediaLikeResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "ToggleMediaLike"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.media.MediaOuterClass.ToggleMediaLikeRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.media.MediaOuterClass.ToggleMediaLikeResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MediaServiceMethodDescriptorSupplier("ToggleMediaLike"))
              .build();
        }
      }
    }
    return getToggleMediaLikeMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static MediaServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MediaServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MediaServiceStub>() {
        @java.lang.Override
        public MediaServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MediaServiceStub(channel, callOptions);
        }
      };
    return MediaServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static MediaServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MediaServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MediaServiceBlockingStub>() {
        @java.lang.Override
        public MediaServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MediaServiceBlockingStub(channel, callOptions);
        }
      };
    return MediaServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static MediaServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MediaServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MediaServiceFutureStub>() {
        @java.lang.Override
        public MediaServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MediaServiceFutureStub(channel, callOptions);
        }
      };
    return MediaServiceFutureStub.newStub(factory, channel);
  }

  /**
   */
  public static abstract class MediaServiceImplBase implements io.grpc.BindableService {

    /**
     * <pre>
     * Client streaming upload
     * </pre>
     */
    public io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.UploadRequest> upload(
        io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.UploadResponse> responseObserver) {
      return io.grpc.stub.ServerCalls.asyncUnimplementedStreamingCall(getUploadMethod(), responseObserver);
    }

    /**
     */
    public void getMedia(sonet.media.MediaOuterClass.GetMediaRequest request,
        io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.GetMediaResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetMediaMethod(), responseObserver);
    }

    /**
     */
    public void deleteMedia(sonet.media.MediaOuterClass.DeleteMediaRequest request,
        io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.DeleteMediaResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getDeleteMediaMethod(), responseObserver);
    }

    /**
     */
    public void listUserMedia(sonet.media.MediaOuterClass.ListUserMediaRequest request,
        io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.ListUserMediaResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getListUserMediaMethod(), responseObserver);
    }

    /**
     */
    public void healthCheck(sonet.media.MediaOuterClass.HealthCheckRequest request,
        io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.HealthCheckResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getHealthCheckMethod(), responseObserver);
    }

    /**
     */
    public void toggleMediaLike(sonet.media.MediaOuterClass.ToggleMediaLikeRequest request,
        io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.ToggleMediaLikeResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getToggleMediaLikeMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getUploadMethod(),
            io.grpc.stub.ServerCalls.asyncClientStreamingCall(
              new MethodHandlers<
                sonet.media.MediaOuterClass.UploadRequest,
                sonet.media.MediaOuterClass.UploadResponse>(
                  this, METHODID_UPLOAD)))
          .addMethod(
            getGetMediaMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.media.MediaOuterClass.GetMediaRequest,
                sonet.media.MediaOuterClass.GetMediaResponse>(
                  this, METHODID_GET_MEDIA)))
          .addMethod(
            getDeleteMediaMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.media.MediaOuterClass.DeleteMediaRequest,
                sonet.media.MediaOuterClass.DeleteMediaResponse>(
                  this, METHODID_DELETE_MEDIA)))
          .addMethod(
            getListUserMediaMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.media.MediaOuterClass.ListUserMediaRequest,
                sonet.media.MediaOuterClass.ListUserMediaResponse>(
                  this, METHODID_LIST_USER_MEDIA)))
          .addMethod(
            getHealthCheckMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.media.MediaOuterClass.HealthCheckRequest,
                sonet.media.MediaOuterClass.HealthCheckResponse>(
                  this, METHODID_HEALTH_CHECK)))
          .addMethod(
            getToggleMediaLikeMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.media.MediaOuterClass.ToggleMediaLikeRequest,
                sonet.media.MediaOuterClass.ToggleMediaLikeResponse>(
                  this, METHODID_TOGGLE_MEDIA_LIKE)))
          .build();
    }
  }

  /**
   */
  public static final class MediaServiceStub extends io.grpc.stub.AbstractAsyncStub<MediaServiceStub> {
    private MediaServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MediaServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MediaServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * Client streaming upload
     * </pre>
     */
    public io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.UploadRequest> upload(
        io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.UploadResponse> responseObserver) {
      return io.grpc.stub.ClientCalls.asyncClientStreamingCall(
          getChannel().newCall(getUploadMethod(), getCallOptions()), responseObserver);
    }

    /**
     */
    public void getMedia(sonet.media.MediaOuterClass.GetMediaRequest request,
        io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.GetMediaResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetMediaMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void deleteMedia(sonet.media.MediaOuterClass.DeleteMediaRequest request,
        io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.DeleteMediaResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getDeleteMediaMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void listUserMedia(sonet.media.MediaOuterClass.ListUserMediaRequest request,
        io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.ListUserMediaResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getListUserMediaMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void healthCheck(sonet.media.MediaOuterClass.HealthCheckRequest request,
        io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.HealthCheckResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getHealthCheckMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void toggleMediaLike(sonet.media.MediaOuterClass.ToggleMediaLikeRequest request,
        io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.ToggleMediaLikeResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getToggleMediaLikeMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   */
  public static final class MediaServiceBlockingStub extends io.grpc.stub.AbstractBlockingStub<MediaServiceBlockingStub> {
    private MediaServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MediaServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MediaServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public sonet.media.MediaOuterClass.GetMediaResponse getMedia(sonet.media.MediaOuterClass.GetMediaRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetMediaMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.media.MediaOuterClass.DeleteMediaResponse deleteMedia(sonet.media.MediaOuterClass.DeleteMediaRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getDeleteMediaMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.media.MediaOuterClass.ListUserMediaResponse listUserMedia(sonet.media.MediaOuterClass.ListUserMediaRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getListUserMediaMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.media.MediaOuterClass.HealthCheckResponse healthCheck(sonet.media.MediaOuterClass.HealthCheckRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getHealthCheckMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.media.MediaOuterClass.ToggleMediaLikeResponse toggleMediaLike(sonet.media.MediaOuterClass.ToggleMediaLikeRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getToggleMediaLikeMethod(), getCallOptions(), request);
    }
  }

  /**
   */
  public static final class MediaServiceFutureStub extends io.grpc.stub.AbstractFutureStub<MediaServiceFutureStub> {
    private MediaServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MediaServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MediaServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.media.MediaOuterClass.GetMediaResponse> getMedia(
        sonet.media.MediaOuterClass.GetMediaRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetMediaMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.media.MediaOuterClass.DeleteMediaResponse> deleteMedia(
        sonet.media.MediaOuterClass.DeleteMediaRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getDeleteMediaMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.media.MediaOuterClass.ListUserMediaResponse> listUserMedia(
        sonet.media.MediaOuterClass.ListUserMediaRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getListUserMediaMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.media.MediaOuterClass.HealthCheckResponse> healthCheck(
        sonet.media.MediaOuterClass.HealthCheckRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getHealthCheckMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.media.MediaOuterClass.ToggleMediaLikeResponse> toggleMediaLike(
        sonet.media.MediaOuterClass.ToggleMediaLikeRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getToggleMediaLikeMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_GET_MEDIA = 0;
  private static final int METHODID_DELETE_MEDIA = 1;
  private static final int METHODID_LIST_USER_MEDIA = 2;
  private static final int METHODID_HEALTH_CHECK = 3;
  private static final int METHODID_TOGGLE_MEDIA_LIKE = 4;
  private static final int METHODID_UPLOAD = 5;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final MediaServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(MediaServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_GET_MEDIA:
          serviceImpl.getMedia((sonet.media.MediaOuterClass.GetMediaRequest) request,
              (io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.GetMediaResponse>) responseObserver);
          break;
        case METHODID_DELETE_MEDIA:
          serviceImpl.deleteMedia((sonet.media.MediaOuterClass.DeleteMediaRequest) request,
              (io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.DeleteMediaResponse>) responseObserver);
          break;
        case METHODID_LIST_USER_MEDIA:
          serviceImpl.listUserMedia((sonet.media.MediaOuterClass.ListUserMediaRequest) request,
              (io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.ListUserMediaResponse>) responseObserver);
          break;
        case METHODID_HEALTH_CHECK:
          serviceImpl.healthCheck((sonet.media.MediaOuterClass.HealthCheckRequest) request,
              (io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.HealthCheckResponse>) responseObserver);
          break;
        case METHODID_TOGGLE_MEDIA_LIKE:
          serviceImpl.toggleMediaLike((sonet.media.MediaOuterClass.ToggleMediaLikeRequest) request,
              (io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.ToggleMediaLikeResponse>) responseObserver);
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
        case METHODID_UPLOAD:
          return (io.grpc.stub.StreamObserver<Req>) serviceImpl.upload(
              (io.grpc.stub.StreamObserver<sonet.media.MediaOuterClass.UploadResponse>) responseObserver);
        default:
          throw new AssertionError();
      }
    }
  }

  private static abstract class MediaServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    MediaServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return sonet.media.MediaOuterClass.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("MediaService");
    }
  }

  private static final class MediaServiceFileDescriptorSupplier
      extends MediaServiceBaseDescriptorSupplier {
    MediaServiceFileDescriptorSupplier() {}
  }

  private static final class MediaServiceMethodDescriptorSupplier
      extends MediaServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    MediaServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (MediaServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new MediaServiceFileDescriptorSupplier())
              .addMethod(getUploadMethod())
              .addMethod(getGetMediaMethod())
              .addMethod(getDeleteMediaMethod())
              .addMethod(getListUserMediaMethod())
              .addMethod(getHealthCheckMethod())
              .addMethod(getToggleMediaLikeMethod())
              .build();
        }
      }
    }
    return result;
  }
}
