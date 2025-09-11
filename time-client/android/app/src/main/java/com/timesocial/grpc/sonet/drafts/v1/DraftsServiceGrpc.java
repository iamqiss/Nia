package sonet.drafts.v1;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * Drafts Service
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler",
    comments = "Source: services/drafts_service.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class DraftsServiceGrpc {

  private DraftsServiceGrpc() {}

  public static final String SERVICE_NAME = "sonet.drafts.v1.DraftsService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftRequest,
      sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftResponse> getCreateDraftMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateDraft",
      requestType = sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftRequest.class,
      responseType = sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftRequest,
      sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftResponse> getCreateDraftMethod() {
    io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftRequest, sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftResponse> getCreateDraftMethod;
    if ((getCreateDraftMethod = DraftsServiceGrpc.getCreateDraftMethod) == null) {
      synchronized (DraftsServiceGrpc.class) {
        if ((getCreateDraftMethod = DraftsServiceGrpc.getCreateDraftMethod) == null) {
          DraftsServiceGrpc.getCreateDraftMethod = getCreateDraftMethod =
              io.grpc.MethodDescriptor.<sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftRequest, sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateDraft"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftResponse.getDefaultInstance()))
              .setSchemaDescriptor(new DraftsServiceMethodDescriptorSupplier("CreateDraft"))
              .build();
        }
      }
    }
    return getCreateDraftMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsRequest,
      sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsResponse> getGetUserDraftsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetUserDrafts",
      requestType = sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsRequest.class,
      responseType = sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsRequest,
      sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsResponse> getGetUserDraftsMethod() {
    io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsRequest, sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsResponse> getGetUserDraftsMethod;
    if ((getGetUserDraftsMethod = DraftsServiceGrpc.getGetUserDraftsMethod) == null) {
      synchronized (DraftsServiceGrpc.class) {
        if ((getGetUserDraftsMethod = DraftsServiceGrpc.getGetUserDraftsMethod) == null) {
          DraftsServiceGrpc.getGetUserDraftsMethod = getGetUserDraftsMethod =
              io.grpc.MethodDescriptor.<sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsRequest, sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetUserDrafts"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsResponse.getDefaultInstance()))
              .setSchemaDescriptor(new DraftsServiceMethodDescriptorSupplier("GetUserDrafts"))
              .build();
        }
      }
    }
    return getGetUserDraftsMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.GetDraftRequest,
      sonet.drafts.v1.DraftsServiceOuterClass.GetDraftResponse> getGetDraftMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetDraft",
      requestType = sonet.drafts.v1.DraftsServiceOuterClass.GetDraftRequest.class,
      responseType = sonet.drafts.v1.DraftsServiceOuterClass.GetDraftResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.GetDraftRequest,
      sonet.drafts.v1.DraftsServiceOuterClass.GetDraftResponse> getGetDraftMethod() {
    io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.GetDraftRequest, sonet.drafts.v1.DraftsServiceOuterClass.GetDraftResponse> getGetDraftMethod;
    if ((getGetDraftMethod = DraftsServiceGrpc.getGetDraftMethod) == null) {
      synchronized (DraftsServiceGrpc.class) {
        if ((getGetDraftMethod = DraftsServiceGrpc.getGetDraftMethod) == null) {
          DraftsServiceGrpc.getGetDraftMethod = getGetDraftMethod =
              io.grpc.MethodDescriptor.<sonet.drafts.v1.DraftsServiceOuterClass.GetDraftRequest, sonet.drafts.v1.DraftsServiceOuterClass.GetDraftResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetDraft"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.drafts.v1.DraftsServiceOuterClass.GetDraftRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.drafts.v1.DraftsServiceOuterClass.GetDraftResponse.getDefaultInstance()))
              .setSchemaDescriptor(new DraftsServiceMethodDescriptorSupplier("GetDraft"))
              .build();
        }
      }
    }
    return getGetDraftMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftRequest,
      sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftResponse> getUpdateDraftMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UpdateDraft",
      requestType = sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftRequest.class,
      responseType = sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftRequest,
      sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftResponse> getUpdateDraftMethod() {
    io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftRequest, sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftResponse> getUpdateDraftMethod;
    if ((getUpdateDraftMethod = DraftsServiceGrpc.getUpdateDraftMethod) == null) {
      synchronized (DraftsServiceGrpc.class) {
        if ((getUpdateDraftMethod = DraftsServiceGrpc.getUpdateDraftMethod) == null) {
          DraftsServiceGrpc.getUpdateDraftMethod = getUpdateDraftMethod =
              io.grpc.MethodDescriptor.<sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftRequest, sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UpdateDraft"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftResponse.getDefaultInstance()))
              .setSchemaDescriptor(new DraftsServiceMethodDescriptorSupplier("UpdateDraft"))
              .build();
        }
      }
    }
    return getUpdateDraftMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftRequest,
      sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftResponse> getDeleteDraftMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "DeleteDraft",
      requestType = sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftRequest.class,
      responseType = sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftRequest,
      sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftResponse> getDeleteDraftMethod() {
    io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftRequest, sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftResponse> getDeleteDraftMethod;
    if ((getDeleteDraftMethod = DraftsServiceGrpc.getDeleteDraftMethod) == null) {
      synchronized (DraftsServiceGrpc.class) {
        if ((getDeleteDraftMethod = DraftsServiceGrpc.getDeleteDraftMethod) == null) {
          DraftsServiceGrpc.getDeleteDraftMethod = getDeleteDraftMethod =
              io.grpc.MethodDescriptor.<sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftRequest, sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "DeleteDraft"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftResponse.getDefaultInstance()))
              .setSchemaDescriptor(new DraftsServiceMethodDescriptorSupplier("DeleteDraft"))
              .build();
        }
      }
    }
    return getDeleteDraftMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftRequest,
      sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftResponse> getAutoSaveDraftMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "AutoSaveDraft",
      requestType = sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftRequest.class,
      responseType = sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftRequest,
      sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftResponse> getAutoSaveDraftMethod() {
    io.grpc.MethodDescriptor<sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftRequest, sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftResponse> getAutoSaveDraftMethod;
    if ((getAutoSaveDraftMethod = DraftsServiceGrpc.getAutoSaveDraftMethod) == null) {
      synchronized (DraftsServiceGrpc.class) {
        if ((getAutoSaveDraftMethod = DraftsServiceGrpc.getAutoSaveDraftMethod) == null) {
          DraftsServiceGrpc.getAutoSaveDraftMethod = getAutoSaveDraftMethod =
              io.grpc.MethodDescriptor.<sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftRequest, sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "AutoSaveDraft"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftResponse.getDefaultInstance()))
              .setSchemaDescriptor(new DraftsServiceMethodDescriptorSupplier("AutoSaveDraft"))
              .build();
        }
      }
    }
    return getAutoSaveDraftMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static DraftsServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<DraftsServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<DraftsServiceStub>() {
        @java.lang.Override
        public DraftsServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new DraftsServiceStub(channel, callOptions);
        }
      };
    return DraftsServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static DraftsServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<DraftsServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<DraftsServiceBlockingStub>() {
        @java.lang.Override
        public DraftsServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new DraftsServiceBlockingStub(channel, callOptions);
        }
      };
    return DraftsServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static DraftsServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<DraftsServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<DraftsServiceFutureStub>() {
        @java.lang.Override
        public DraftsServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new DraftsServiceFutureStub(channel, callOptions);
        }
      };
    return DraftsServiceFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * Drafts Service
   * </pre>
   */
  public static abstract class DraftsServiceImplBase implements io.grpc.BindableService {

    /**
     * <pre>
     * Create a new draft
     * </pre>
     */
    public void createDraft(sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftRequest request,
        io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateDraftMethod(), responseObserver);
    }

    /**
     * <pre>
     * Get user drafts
     * </pre>
     */
    public void getUserDrafts(sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsRequest request,
        io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetUserDraftsMethod(), responseObserver);
    }

    /**
     * <pre>
     * Get a specific draft
     * </pre>
     */
    public void getDraft(sonet.drafts.v1.DraftsServiceOuterClass.GetDraftRequest request,
        io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.GetDraftResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetDraftMethod(), responseObserver);
    }

    /**
     * <pre>
     * Update a draft
     * </pre>
     */
    public void updateDraft(sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftRequest request,
        io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUpdateDraftMethod(), responseObserver);
    }

    /**
     * <pre>
     * Delete a draft
     * </pre>
     */
    public void deleteDraft(sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftRequest request,
        io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getDeleteDraftMethod(), responseObserver);
    }

    /**
     * <pre>
     * Auto-save a draft
     * </pre>
     */
    public void autoSaveDraft(sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftRequest request,
        io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getAutoSaveDraftMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getCreateDraftMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftRequest,
                sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftResponse>(
                  this, METHODID_CREATE_DRAFT)))
          .addMethod(
            getGetUserDraftsMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsRequest,
                sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsResponse>(
                  this, METHODID_GET_USER_DRAFTS)))
          .addMethod(
            getGetDraftMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.drafts.v1.DraftsServiceOuterClass.GetDraftRequest,
                sonet.drafts.v1.DraftsServiceOuterClass.GetDraftResponse>(
                  this, METHODID_GET_DRAFT)))
          .addMethod(
            getUpdateDraftMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftRequest,
                sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftResponse>(
                  this, METHODID_UPDATE_DRAFT)))
          .addMethod(
            getDeleteDraftMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftRequest,
                sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftResponse>(
                  this, METHODID_DELETE_DRAFT)))
          .addMethod(
            getAutoSaveDraftMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftRequest,
                sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftResponse>(
                  this, METHODID_AUTO_SAVE_DRAFT)))
          .build();
    }
  }

  /**
   * <pre>
   * Drafts Service
   * </pre>
   */
  public static final class DraftsServiceStub extends io.grpc.stub.AbstractAsyncStub<DraftsServiceStub> {
    private DraftsServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected DraftsServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new DraftsServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * Create a new draft
     * </pre>
     */
    public void createDraft(sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftRequest request,
        io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateDraftMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Get user drafts
     * </pre>
     */
    public void getUserDrafts(sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsRequest request,
        io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetUserDraftsMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Get a specific draft
     * </pre>
     */
    public void getDraft(sonet.drafts.v1.DraftsServiceOuterClass.GetDraftRequest request,
        io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.GetDraftResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetDraftMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Update a draft
     * </pre>
     */
    public void updateDraft(sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftRequest request,
        io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpdateDraftMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Delete a draft
     * </pre>
     */
    public void deleteDraft(sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftRequest request,
        io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getDeleteDraftMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Auto-save a draft
     * </pre>
     */
    public void autoSaveDraft(sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftRequest request,
        io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getAutoSaveDraftMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * <pre>
   * Drafts Service
   * </pre>
   */
  public static final class DraftsServiceBlockingStub extends io.grpc.stub.AbstractBlockingStub<DraftsServiceBlockingStub> {
    private DraftsServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected DraftsServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new DraftsServiceBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * Create a new draft
     * </pre>
     */
    public sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftResponse createDraft(sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateDraftMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Get user drafts
     * </pre>
     */
    public sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsResponse getUserDrafts(sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetUserDraftsMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Get a specific draft
     * </pre>
     */
    public sonet.drafts.v1.DraftsServiceOuterClass.GetDraftResponse getDraft(sonet.drafts.v1.DraftsServiceOuterClass.GetDraftRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetDraftMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Update a draft
     * </pre>
     */
    public sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftResponse updateDraft(sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpdateDraftMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Delete a draft
     * </pre>
     */
    public sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftResponse deleteDraft(sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getDeleteDraftMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Auto-save a draft
     * </pre>
     */
    public sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftResponse autoSaveDraft(sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getAutoSaveDraftMethod(), getCallOptions(), request);
    }
  }

  /**
   * <pre>
   * Drafts Service
   * </pre>
   */
  public static final class DraftsServiceFutureStub extends io.grpc.stub.AbstractFutureStub<DraftsServiceFutureStub> {
    private DraftsServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected DraftsServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new DraftsServiceFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * Create a new draft
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftResponse> createDraft(
        sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateDraftMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Get user drafts
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsResponse> getUserDrafts(
        sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetUserDraftsMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Get a specific draft
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.drafts.v1.DraftsServiceOuterClass.GetDraftResponse> getDraft(
        sonet.drafts.v1.DraftsServiceOuterClass.GetDraftRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetDraftMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Update a draft
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftResponse> updateDraft(
        sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpdateDraftMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Delete a draft
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftResponse> deleteDraft(
        sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getDeleteDraftMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Auto-save a draft
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftResponse> autoSaveDraft(
        sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getAutoSaveDraftMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_CREATE_DRAFT = 0;
  private static final int METHODID_GET_USER_DRAFTS = 1;
  private static final int METHODID_GET_DRAFT = 2;
  private static final int METHODID_UPDATE_DRAFT = 3;
  private static final int METHODID_DELETE_DRAFT = 4;
  private static final int METHODID_AUTO_SAVE_DRAFT = 5;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final DraftsServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(DraftsServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_CREATE_DRAFT:
          serviceImpl.createDraft((sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftRequest) request,
              (io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.CreateDraftResponse>) responseObserver);
          break;
        case METHODID_GET_USER_DRAFTS:
          serviceImpl.getUserDrafts((sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsRequest) request,
              (io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.GetUserDraftsResponse>) responseObserver);
          break;
        case METHODID_GET_DRAFT:
          serviceImpl.getDraft((sonet.drafts.v1.DraftsServiceOuterClass.GetDraftRequest) request,
              (io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.GetDraftResponse>) responseObserver);
          break;
        case METHODID_UPDATE_DRAFT:
          serviceImpl.updateDraft((sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftRequest) request,
              (io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.UpdateDraftResponse>) responseObserver);
          break;
        case METHODID_DELETE_DRAFT:
          serviceImpl.deleteDraft((sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftRequest) request,
              (io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.DeleteDraftResponse>) responseObserver);
          break;
        case METHODID_AUTO_SAVE_DRAFT:
          serviceImpl.autoSaveDraft((sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftRequest) request,
              (io.grpc.stub.StreamObserver<sonet.drafts.v1.DraftsServiceOuterClass.AutoSaveDraftResponse>) responseObserver);
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

  private static abstract class DraftsServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    DraftsServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return sonet.drafts.v1.DraftsServiceOuterClass.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("DraftsService");
    }
  }

  private static final class DraftsServiceFileDescriptorSupplier
      extends DraftsServiceBaseDescriptorSupplier {
    DraftsServiceFileDescriptorSupplier() {}
  }

  private static final class DraftsServiceMethodDescriptorSupplier
      extends DraftsServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    DraftsServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (DraftsServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new DraftsServiceFileDescriptorSupplier())
              .addMethod(getCreateDraftMethod())
              .addMethod(getGetUserDraftsMethod())
              .addMethod(getGetDraftMethod())
              .addMethod(getUpdateDraftMethod())
              .addMethod(getDeleteDraftMethod())
              .addMethod(getAutoSaveDraftMethod())
              .build();
        }
      }
    }
    return result;
  }
}
