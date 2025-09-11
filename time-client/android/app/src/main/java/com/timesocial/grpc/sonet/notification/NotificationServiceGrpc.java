package sonet.notification;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler",
    comments = "Source: services/notification.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class NotificationServiceGrpc {

  private NotificationServiceGrpc() {}

  public static final String SERVICE_NAME = "sonet.notification.NotificationService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<sonet.notification.NotificationOuterClass.ListNotificationsRequest,
      sonet.notification.NotificationOuterClass.ListNotificationsResponse> getListNotificationsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "ListNotifications",
      requestType = sonet.notification.NotificationOuterClass.ListNotificationsRequest.class,
      responseType = sonet.notification.NotificationOuterClass.ListNotificationsResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.notification.NotificationOuterClass.ListNotificationsRequest,
      sonet.notification.NotificationOuterClass.ListNotificationsResponse> getListNotificationsMethod() {
    io.grpc.MethodDescriptor<sonet.notification.NotificationOuterClass.ListNotificationsRequest, sonet.notification.NotificationOuterClass.ListNotificationsResponse> getListNotificationsMethod;
    if ((getListNotificationsMethod = NotificationServiceGrpc.getListNotificationsMethod) == null) {
      synchronized (NotificationServiceGrpc.class) {
        if ((getListNotificationsMethod = NotificationServiceGrpc.getListNotificationsMethod) == null) {
          NotificationServiceGrpc.getListNotificationsMethod = getListNotificationsMethod =
              io.grpc.MethodDescriptor.<sonet.notification.NotificationOuterClass.ListNotificationsRequest, sonet.notification.NotificationOuterClass.ListNotificationsResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "ListNotifications"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.notification.NotificationOuterClass.ListNotificationsRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.notification.NotificationOuterClass.ListNotificationsResponse.getDefaultInstance()))
              .setSchemaDescriptor(new NotificationServiceMethodDescriptorSupplier("ListNotifications"))
              .build();
        }
      }
    }
    return getListNotificationsMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.notification.NotificationOuterClass.MarkNotificationReadRequest,
      sonet.notification.NotificationOuterClass.MarkNotificationReadResponse> getMarkNotificationReadMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "MarkNotificationRead",
      requestType = sonet.notification.NotificationOuterClass.MarkNotificationReadRequest.class,
      responseType = sonet.notification.NotificationOuterClass.MarkNotificationReadResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.notification.NotificationOuterClass.MarkNotificationReadRequest,
      sonet.notification.NotificationOuterClass.MarkNotificationReadResponse> getMarkNotificationReadMethod() {
    io.grpc.MethodDescriptor<sonet.notification.NotificationOuterClass.MarkNotificationReadRequest, sonet.notification.NotificationOuterClass.MarkNotificationReadResponse> getMarkNotificationReadMethod;
    if ((getMarkNotificationReadMethod = NotificationServiceGrpc.getMarkNotificationReadMethod) == null) {
      synchronized (NotificationServiceGrpc.class) {
        if ((getMarkNotificationReadMethod = NotificationServiceGrpc.getMarkNotificationReadMethod) == null) {
          NotificationServiceGrpc.getMarkNotificationReadMethod = getMarkNotificationReadMethod =
              io.grpc.MethodDescriptor.<sonet.notification.NotificationOuterClass.MarkNotificationReadRequest, sonet.notification.NotificationOuterClass.MarkNotificationReadResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "MarkNotificationRead"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.notification.NotificationOuterClass.MarkNotificationReadRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.notification.NotificationOuterClass.MarkNotificationReadResponse.getDefaultInstance()))
              .setSchemaDescriptor(new NotificationServiceMethodDescriptorSupplier("MarkNotificationRead"))
              .build();
        }
      }
    }
    return getMarkNotificationReadMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static NotificationServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<NotificationServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<NotificationServiceStub>() {
        @java.lang.Override
        public NotificationServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new NotificationServiceStub(channel, callOptions);
        }
      };
    return NotificationServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static NotificationServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<NotificationServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<NotificationServiceBlockingStub>() {
        @java.lang.Override
        public NotificationServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new NotificationServiceBlockingStub(channel, callOptions);
        }
      };
    return NotificationServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static NotificationServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<NotificationServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<NotificationServiceFutureStub>() {
        @java.lang.Override
        public NotificationServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new NotificationServiceFutureStub(channel, callOptions);
        }
      };
    return NotificationServiceFutureStub.newStub(factory, channel);
  }

  /**
   */
  public static abstract class NotificationServiceImplBase implements io.grpc.BindableService {

    /**
     */
    public void listNotifications(sonet.notification.NotificationOuterClass.ListNotificationsRequest request,
        io.grpc.stub.StreamObserver<sonet.notification.NotificationOuterClass.ListNotificationsResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getListNotificationsMethod(), responseObserver);
    }

    /**
     */
    public void markNotificationRead(sonet.notification.NotificationOuterClass.MarkNotificationReadRequest request,
        io.grpc.stub.StreamObserver<sonet.notification.NotificationOuterClass.MarkNotificationReadResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getMarkNotificationReadMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getListNotificationsMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.notification.NotificationOuterClass.ListNotificationsRequest,
                sonet.notification.NotificationOuterClass.ListNotificationsResponse>(
                  this, METHODID_LIST_NOTIFICATIONS)))
          .addMethod(
            getMarkNotificationReadMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.notification.NotificationOuterClass.MarkNotificationReadRequest,
                sonet.notification.NotificationOuterClass.MarkNotificationReadResponse>(
                  this, METHODID_MARK_NOTIFICATION_READ)))
          .build();
    }
  }

  /**
   */
  public static final class NotificationServiceStub extends io.grpc.stub.AbstractAsyncStub<NotificationServiceStub> {
    private NotificationServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected NotificationServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new NotificationServiceStub(channel, callOptions);
    }

    /**
     */
    public void listNotifications(sonet.notification.NotificationOuterClass.ListNotificationsRequest request,
        io.grpc.stub.StreamObserver<sonet.notification.NotificationOuterClass.ListNotificationsResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getListNotificationsMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void markNotificationRead(sonet.notification.NotificationOuterClass.MarkNotificationReadRequest request,
        io.grpc.stub.StreamObserver<sonet.notification.NotificationOuterClass.MarkNotificationReadResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getMarkNotificationReadMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   */
  public static final class NotificationServiceBlockingStub extends io.grpc.stub.AbstractBlockingStub<NotificationServiceBlockingStub> {
    private NotificationServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected NotificationServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new NotificationServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public sonet.notification.NotificationOuterClass.ListNotificationsResponse listNotifications(sonet.notification.NotificationOuterClass.ListNotificationsRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getListNotificationsMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.notification.NotificationOuterClass.MarkNotificationReadResponse markNotificationRead(sonet.notification.NotificationOuterClass.MarkNotificationReadRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getMarkNotificationReadMethod(), getCallOptions(), request);
    }
  }

  /**
   */
  public static final class NotificationServiceFutureStub extends io.grpc.stub.AbstractFutureStub<NotificationServiceFutureStub> {
    private NotificationServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected NotificationServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new NotificationServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.notification.NotificationOuterClass.ListNotificationsResponse> listNotifications(
        sonet.notification.NotificationOuterClass.ListNotificationsRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getListNotificationsMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.notification.NotificationOuterClass.MarkNotificationReadResponse> markNotificationRead(
        sonet.notification.NotificationOuterClass.MarkNotificationReadRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getMarkNotificationReadMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_LIST_NOTIFICATIONS = 0;
  private static final int METHODID_MARK_NOTIFICATION_READ = 1;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final NotificationServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(NotificationServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_LIST_NOTIFICATIONS:
          serviceImpl.listNotifications((sonet.notification.NotificationOuterClass.ListNotificationsRequest) request,
              (io.grpc.stub.StreamObserver<sonet.notification.NotificationOuterClass.ListNotificationsResponse>) responseObserver);
          break;
        case METHODID_MARK_NOTIFICATION_READ:
          serviceImpl.markNotificationRead((sonet.notification.NotificationOuterClass.MarkNotificationReadRequest) request,
              (io.grpc.stub.StreamObserver<sonet.notification.NotificationOuterClass.MarkNotificationReadResponse>) responseObserver);
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

  private static abstract class NotificationServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    NotificationServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return sonet.notification.NotificationOuterClass.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("NotificationService");
    }
  }

  private static final class NotificationServiceFileDescriptorSupplier
      extends NotificationServiceBaseDescriptorSupplier {
    NotificationServiceFileDescriptorSupplier() {}
  }

  private static final class NotificationServiceMethodDescriptorSupplier
      extends NotificationServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    NotificationServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (NotificationServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new NotificationServiceFileDescriptorSupplier())
              .addMethod(getListNotificationsMethod())
              .addMethod(getMarkNotificationReadMethod())
              .build();
        }
      }
    }
    return result;
  }
}
