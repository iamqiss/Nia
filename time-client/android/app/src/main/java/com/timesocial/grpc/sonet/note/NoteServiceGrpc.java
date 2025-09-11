package sonet.note;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * ============= NOTE SERVICE =============
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler",
    comments = "Source: services/note.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class NoteServiceGrpc {

  private NoteServiceGrpc() {}

  public static final String SERVICE_NAME = "sonet.note.NoteService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.CreateNoteRequest,
      sonet.note.NoteOuterClass.CreateNoteResponse> getCreateNoteMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateNote",
      requestType = sonet.note.NoteOuterClass.CreateNoteRequest.class,
      responseType = sonet.note.NoteOuterClass.CreateNoteResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.CreateNoteRequest,
      sonet.note.NoteOuterClass.CreateNoteResponse> getCreateNoteMethod() {
    io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.CreateNoteRequest, sonet.note.NoteOuterClass.CreateNoteResponse> getCreateNoteMethod;
    if ((getCreateNoteMethod = NoteServiceGrpc.getCreateNoteMethod) == null) {
      synchronized (NoteServiceGrpc.class) {
        if ((getCreateNoteMethod = NoteServiceGrpc.getCreateNoteMethod) == null) {
          NoteServiceGrpc.getCreateNoteMethod = getCreateNoteMethod =
              io.grpc.MethodDescriptor.<sonet.note.NoteOuterClass.CreateNoteRequest, sonet.note.NoteOuterClass.CreateNoteResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateNote"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.CreateNoteRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.CreateNoteResponse.getDefaultInstance()))
              .setSchemaDescriptor(new NoteServiceMethodDescriptorSupplier("CreateNote"))
              .build();
        }
      }
    }
    return getCreateNoteMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.GetNoteRequest,
      sonet.note.NoteOuterClass.GetNoteResponse> getGetNoteMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetNote",
      requestType = sonet.note.NoteOuterClass.GetNoteRequest.class,
      responseType = sonet.note.NoteOuterClass.GetNoteResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.GetNoteRequest,
      sonet.note.NoteOuterClass.GetNoteResponse> getGetNoteMethod() {
    io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.GetNoteRequest, sonet.note.NoteOuterClass.GetNoteResponse> getGetNoteMethod;
    if ((getGetNoteMethod = NoteServiceGrpc.getGetNoteMethod) == null) {
      synchronized (NoteServiceGrpc.class) {
        if ((getGetNoteMethod = NoteServiceGrpc.getGetNoteMethod) == null) {
          NoteServiceGrpc.getGetNoteMethod = getGetNoteMethod =
              io.grpc.MethodDescriptor.<sonet.note.NoteOuterClass.GetNoteRequest, sonet.note.NoteOuterClass.GetNoteResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetNote"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.GetNoteRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.GetNoteResponse.getDefaultInstance()))
              .setSchemaDescriptor(new NoteServiceMethodDescriptorSupplier("GetNote"))
              .build();
        }
      }
    }
    return getGetNoteMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.DeleteNoteRequest,
      sonet.note.NoteOuterClass.DeleteNoteResponse> getDeleteNoteMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "DeleteNote",
      requestType = sonet.note.NoteOuterClass.DeleteNoteRequest.class,
      responseType = sonet.note.NoteOuterClass.DeleteNoteResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.DeleteNoteRequest,
      sonet.note.NoteOuterClass.DeleteNoteResponse> getDeleteNoteMethod() {
    io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.DeleteNoteRequest, sonet.note.NoteOuterClass.DeleteNoteResponse> getDeleteNoteMethod;
    if ((getDeleteNoteMethod = NoteServiceGrpc.getDeleteNoteMethod) == null) {
      synchronized (NoteServiceGrpc.class) {
        if ((getDeleteNoteMethod = NoteServiceGrpc.getDeleteNoteMethod) == null) {
          NoteServiceGrpc.getDeleteNoteMethod = getDeleteNoteMethod =
              io.grpc.MethodDescriptor.<sonet.note.NoteOuterClass.DeleteNoteRequest, sonet.note.NoteOuterClass.DeleteNoteResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "DeleteNote"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.DeleteNoteRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.DeleteNoteResponse.getDefaultInstance()))
              .setSchemaDescriptor(new NoteServiceMethodDescriptorSupplier("DeleteNote"))
              .build();
        }
      }
    }
    return getDeleteNoteMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.LikeNoteRequest,
      sonet.note.NoteOuterClass.LikeNoteResponse> getLikeNoteMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "LikeNote",
      requestType = sonet.note.NoteOuterClass.LikeNoteRequest.class,
      responseType = sonet.note.NoteOuterClass.LikeNoteResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.LikeNoteRequest,
      sonet.note.NoteOuterClass.LikeNoteResponse> getLikeNoteMethod() {
    io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.LikeNoteRequest, sonet.note.NoteOuterClass.LikeNoteResponse> getLikeNoteMethod;
    if ((getLikeNoteMethod = NoteServiceGrpc.getLikeNoteMethod) == null) {
      synchronized (NoteServiceGrpc.class) {
        if ((getLikeNoteMethod = NoteServiceGrpc.getLikeNoteMethod) == null) {
          NoteServiceGrpc.getLikeNoteMethod = getLikeNoteMethod =
              io.grpc.MethodDescriptor.<sonet.note.NoteOuterClass.LikeNoteRequest, sonet.note.NoteOuterClass.LikeNoteResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "LikeNote"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.LikeNoteRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.LikeNoteResponse.getDefaultInstance()))
              .setSchemaDescriptor(new NoteServiceMethodDescriptorSupplier("LikeNote"))
              .build();
        }
      }
    }
    return getLikeNoteMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.RenoteNoteRequest,
      sonet.note.NoteOuterClass.RenoteNoteResponse> getRenoteNoteMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "RenoteNote",
      requestType = sonet.note.NoteOuterClass.RenoteNoteRequest.class,
      responseType = sonet.note.NoteOuterClass.RenoteNoteResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.RenoteNoteRequest,
      sonet.note.NoteOuterClass.RenoteNoteResponse> getRenoteNoteMethod() {
    io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.RenoteNoteRequest, sonet.note.NoteOuterClass.RenoteNoteResponse> getRenoteNoteMethod;
    if ((getRenoteNoteMethod = NoteServiceGrpc.getRenoteNoteMethod) == null) {
      synchronized (NoteServiceGrpc.class) {
        if ((getRenoteNoteMethod = NoteServiceGrpc.getRenoteNoteMethod) == null) {
          NoteServiceGrpc.getRenoteNoteMethod = getRenoteNoteMethod =
              io.grpc.MethodDescriptor.<sonet.note.NoteOuterClass.RenoteNoteRequest, sonet.note.NoteOuterClass.RenoteNoteResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "RenoteNote"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.RenoteNoteRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.RenoteNoteResponse.getDefaultInstance()))
              .setSchemaDescriptor(new NoteServiceMethodDescriptorSupplier("RenoteNote"))
              .build();
        }
      }
    }
    return getRenoteNoteMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.GetUserNotesRequest,
      sonet.note.NoteOuterClass.GetUserNotesResponse> getGetUserNotesMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetUserNotes",
      requestType = sonet.note.NoteOuterClass.GetUserNotesRequest.class,
      responseType = sonet.note.NoteOuterClass.GetUserNotesResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.GetUserNotesRequest,
      sonet.note.NoteOuterClass.GetUserNotesResponse> getGetUserNotesMethod() {
    io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.GetUserNotesRequest, sonet.note.NoteOuterClass.GetUserNotesResponse> getGetUserNotesMethod;
    if ((getGetUserNotesMethod = NoteServiceGrpc.getGetUserNotesMethod) == null) {
      synchronized (NoteServiceGrpc.class) {
        if ((getGetUserNotesMethod = NoteServiceGrpc.getGetUserNotesMethod) == null) {
          NoteServiceGrpc.getGetUserNotesMethod = getGetUserNotesMethod =
              io.grpc.MethodDescriptor.<sonet.note.NoteOuterClass.GetUserNotesRequest, sonet.note.NoteOuterClass.GetUserNotesResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetUserNotes"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.GetUserNotesRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.GetUserNotesResponse.getDefaultInstance()))
              .setSchemaDescriptor(new NoteServiceMethodDescriptorSupplier("GetUserNotes"))
              .build();
        }
      }
    }
    return getGetUserNotesMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.GetNoteThreadRequest,
      sonet.note.NoteOuterClass.GetNoteThreadResponse> getGetNoteThreadMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetNoteThread",
      requestType = sonet.note.NoteOuterClass.GetNoteThreadRequest.class,
      responseType = sonet.note.NoteOuterClass.GetNoteThreadResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.GetNoteThreadRequest,
      sonet.note.NoteOuterClass.GetNoteThreadResponse> getGetNoteThreadMethod() {
    io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.GetNoteThreadRequest, sonet.note.NoteOuterClass.GetNoteThreadResponse> getGetNoteThreadMethod;
    if ((getGetNoteThreadMethod = NoteServiceGrpc.getGetNoteThreadMethod) == null) {
      synchronized (NoteServiceGrpc.class) {
        if ((getGetNoteThreadMethod = NoteServiceGrpc.getGetNoteThreadMethod) == null) {
          NoteServiceGrpc.getGetNoteThreadMethod = getGetNoteThreadMethod =
              io.grpc.MethodDescriptor.<sonet.note.NoteOuterClass.GetNoteThreadRequest, sonet.note.NoteOuterClass.GetNoteThreadResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetNoteThread"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.GetNoteThreadRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.GetNoteThreadResponse.getDefaultInstance()))
              .setSchemaDescriptor(new NoteServiceMethodDescriptorSupplier("GetNoteThread"))
              .build();
        }
      }
    }
    return getGetNoteThreadMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.SearchNotesRequest,
      sonet.note.NoteOuterClass.SearchNotesResponse> getSearchNotesMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "SearchNotes",
      requestType = sonet.note.NoteOuterClass.SearchNotesRequest.class,
      responseType = sonet.note.NoteOuterClass.SearchNotesResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.SearchNotesRequest,
      sonet.note.NoteOuterClass.SearchNotesResponse> getSearchNotesMethod() {
    io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.SearchNotesRequest, sonet.note.NoteOuterClass.SearchNotesResponse> getSearchNotesMethod;
    if ((getSearchNotesMethod = NoteServiceGrpc.getSearchNotesMethod) == null) {
      synchronized (NoteServiceGrpc.class) {
        if ((getSearchNotesMethod = NoteServiceGrpc.getSearchNotesMethod) == null) {
          NoteServiceGrpc.getSearchNotesMethod = getSearchNotesMethod =
              io.grpc.MethodDescriptor.<sonet.note.NoteOuterClass.SearchNotesRequest, sonet.note.NoteOuterClass.SearchNotesResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "SearchNotes"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.SearchNotesRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.SearchNotesResponse.getDefaultInstance()))
              .setSchemaDescriptor(new NoteServiceMethodDescriptorSupplier("SearchNotes"))
              .build();
        }
      }
    }
    return getSearchNotesMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.HealthCheckRequest,
      sonet.note.NoteOuterClass.HealthCheckResponse> getHealthCheckMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "HealthCheck",
      requestType = sonet.note.NoteOuterClass.HealthCheckRequest.class,
      responseType = sonet.note.NoteOuterClass.HealthCheckResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.HealthCheckRequest,
      sonet.note.NoteOuterClass.HealthCheckResponse> getHealthCheckMethod() {
    io.grpc.MethodDescriptor<sonet.note.NoteOuterClass.HealthCheckRequest, sonet.note.NoteOuterClass.HealthCheckResponse> getHealthCheckMethod;
    if ((getHealthCheckMethod = NoteServiceGrpc.getHealthCheckMethod) == null) {
      synchronized (NoteServiceGrpc.class) {
        if ((getHealthCheckMethod = NoteServiceGrpc.getHealthCheckMethod) == null) {
          NoteServiceGrpc.getHealthCheckMethod = getHealthCheckMethod =
              io.grpc.MethodDescriptor.<sonet.note.NoteOuterClass.HealthCheckRequest, sonet.note.NoteOuterClass.HealthCheckResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "HealthCheck"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.HealthCheckRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.note.NoteOuterClass.HealthCheckResponse.getDefaultInstance()))
              .setSchemaDescriptor(new NoteServiceMethodDescriptorSupplier("HealthCheck"))
              .build();
        }
      }
    }
    return getHealthCheckMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static NoteServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<NoteServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<NoteServiceStub>() {
        @java.lang.Override
        public NoteServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new NoteServiceStub(channel, callOptions);
        }
      };
    return NoteServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static NoteServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<NoteServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<NoteServiceBlockingStub>() {
        @java.lang.Override
        public NoteServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new NoteServiceBlockingStub(channel, callOptions);
        }
      };
    return NoteServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static NoteServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<NoteServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<NoteServiceFutureStub>() {
        @java.lang.Override
        public NoteServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new NoteServiceFutureStub(channel, callOptions);
        }
      };
    return NoteServiceFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * ============= NOTE SERVICE =============
   * </pre>
   */
  public static abstract class NoteServiceImplBase implements io.grpc.BindableService {

    /**
     * <pre>
     * Core operations
     * </pre>
     */
    public void createNote(sonet.note.NoteOuterClass.CreateNoteRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.CreateNoteResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateNoteMethod(), responseObserver);
    }

    /**
     */
    public void getNote(sonet.note.NoteOuterClass.GetNoteRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.GetNoteResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetNoteMethod(), responseObserver);
    }

    /**
     */
    public void deleteNote(sonet.note.NoteOuterClass.DeleteNoteRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.DeleteNoteResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getDeleteNoteMethod(), responseObserver);
    }

    /**
     * <pre>
     * Interactions
     * </pre>
     */
    public void likeNote(sonet.note.NoteOuterClass.LikeNoteRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.LikeNoteResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getLikeNoteMethod(), responseObserver);
    }

    /**
     */
    public void renoteNote(sonet.note.NoteOuterClass.RenoteNoteRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.RenoteNoteResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getRenoteNoteMethod(), responseObserver);
    }

    /**
     * <pre>
     * Queries
     * </pre>
     */
    public void getUserNotes(sonet.note.NoteOuterClass.GetUserNotesRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.GetUserNotesResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetUserNotesMethod(), responseObserver);
    }

    /**
     */
    public void getNoteThread(sonet.note.NoteOuterClass.GetNoteThreadRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.GetNoteThreadResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetNoteThreadMethod(), responseObserver);
    }

    /**
     */
    public void searchNotes(sonet.note.NoteOuterClass.SearchNotesRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.SearchNotesResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getSearchNotesMethod(), responseObserver);
    }

    /**
     * <pre>
     * Health
     * </pre>
     */
    public void healthCheck(sonet.note.NoteOuterClass.HealthCheckRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.HealthCheckResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getHealthCheckMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getCreateNoteMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.note.NoteOuterClass.CreateNoteRequest,
                sonet.note.NoteOuterClass.CreateNoteResponse>(
                  this, METHODID_CREATE_NOTE)))
          .addMethod(
            getGetNoteMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.note.NoteOuterClass.GetNoteRequest,
                sonet.note.NoteOuterClass.GetNoteResponse>(
                  this, METHODID_GET_NOTE)))
          .addMethod(
            getDeleteNoteMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.note.NoteOuterClass.DeleteNoteRequest,
                sonet.note.NoteOuterClass.DeleteNoteResponse>(
                  this, METHODID_DELETE_NOTE)))
          .addMethod(
            getLikeNoteMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.note.NoteOuterClass.LikeNoteRequest,
                sonet.note.NoteOuterClass.LikeNoteResponse>(
                  this, METHODID_LIKE_NOTE)))
          .addMethod(
            getRenoteNoteMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.note.NoteOuterClass.RenoteNoteRequest,
                sonet.note.NoteOuterClass.RenoteNoteResponse>(
                  this, METHODID_RENOTE_NOTE)))
          .addMethod(
            getGetUserNotesMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.note.NoteOuterClass.GetUserNotesRequest,
                sonet.note.NoteOuterClass.GetUserNotesResponse>(
                  this, METHODID_GET_USER_NOTES)))
          .addMethod(
            getGetNoteThreadMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.note.NoteOuterClass.GetNoteThreadRequest,
                sonet.note.NoteOuterClass.GetNoteThreadResponse>(
                  this, METHODID_GET_NOTE_THREAD)))
          .addMethod(
            getSearchNotesMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.note.NoteOuterClass.SearchNotesRequest,
                sonet.note.NoteOuterClass.SearchNotesResponse>(
                  this, METHODID_SEARCH_NOTES)))
          .addMethod(
            getHealthCheckMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.note.NoteOuterClass.HealthCheckRequest,
                sonet.note.NoteOuterClass.HealthCheckResponse>(
                  this, METHODID_HEALTH_CHECK)))
          .build();
    }
  }

  /**
   * <pre>
   * ============= NOTE SERVICE =============
   * </pre>
   */
  public static final class NoteServiceStub extends io.grpc.stub.AbstractAsyncStub<NoteServiceStub> {
    private NoteServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected NoteServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new NoteServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * Core operations
     * </pre>
     */
    public void createNote(sonet.note.NoteOuterClass.CreateNoteRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.CreateNoteResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateNoteMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void getNote(sonet.note.NoteOuterClass.GetNoteRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.GetNoteResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetNoteMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void deleteNote(sonet.note.NoteOuterClass.DeleteNoteRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.DeleteNoteResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getDeleteNoteMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Interactions
     * </pre>
     */
    public void likeNote(sonet.note.NoteOuterClass.LikeNoteRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.LikeNoteResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getLikeNoteMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void renoteNote(sonet.note.NoteOuterClass.RenoteNoteRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.RenoteNoteResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getRenoteNoteMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Queries
     * </pre>
     */
    public void getUserNotes(sonet.note.NoteOuterClass.GetUserNotesRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.GetUserNotesResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetUserNotesMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void getNoteThread(sonet.note.NoteOuterClass.GetNoteThreadRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.GetNoteThreadResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetNoteThreadMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void searchNotes(sonet.note.NoteOuterClass.SearchNotesRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.SearchNotesResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getSearchNotesMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Health
     * </pre>
     */
    public void healthCheck(sonet.note.NoteOuterClass.HealthCheckRequest request,
        io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.HealthCheckResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getHealthCheckMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * <pre>
   * ============= NOTE SERVICE =============
   * </pre>
   */
  public static final class NoteServiceBlockingStub extends io.grpc.stub.AbstractBlockingStub<NoteServiceBlockingStub> {
    private NoteServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected NoteServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new NoteServiceBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * Core operations
     * </pre>
     */
    public sonet.note.NoteOuterClass.CreateNoteResponse createNote(sonet.note.NoteOuterClass.CreateNoteRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateNoteMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.note.NoteOuterClass.GetNoteResponse getNote(sonet.note.NoteOuterClass.GetNoteRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetNoteMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.note.NoteOuterClass.DeleteNoteResponse deleteNote(sonet.note.NoteOuterClass.DeleteNoteRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getDeleteNoteMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Interactions
     * </pre>
     */
    public sonet.note.NoteOuterClass.LikeNoteResponse likeNote(sonet.note.NoteOuterClass.LikeNoteRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getLikeNoteMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.note.NoteOuterClass.RenoteNoteResponse renoteNote(sonet.note.NoteOuterClass.RenoteNoteRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getRenoteNoteMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Queries
     * </pre>
     */
    public sonet.note.NoteOuterClass.GetUserNotesResponse getUserNotes(sonet.note.NoteOuterClass.GetUserNotesRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetUserNotesMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.note.NoteOuterClass.GetNoteThreadResponse getNoteThread(sonet.note.NoteOuterClass.GetNoteThreadRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetNoteThreadMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.note.NoteOuterClass.SearchNotesResponse searchNotes(sonet.note.NoteOuterClass.SearchNotesRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getSearchNotesMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Health
     * </pre>
     */
    public sonet.note.NoteOuterClass.HealthCheckResponse healthCheck(sonet.note.NoteOuterClass.HealthCheckRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getHealthCheckMethod(), getCallOptions(), request);
    }
  }

  /**
   * <pre>
   * ============= NOTE SERVICE =============
   * </pre>
   */
  public static final class NoteServiceFutureStub extends io.grpc.stub.AbstractFutureStub<NoteServiceFutureStub> {
    private NoteServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected NoteServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new NoteServiceFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * Core operations
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.note.NoteOuterClass.CreateNoteResponse> createNote(
        sonet.note.NoteOuterClass.CreateNoteRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateNoteMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.note.NoteOuterClass.GetNoteResponse> getNote(
        sonet.note.NoteOuterClass.GetNoteRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetNoteMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.note.NoteOuterClass.DeleteNoteResponse> deleteNote(
        sonet.note.NoteOuterClass.DeleteNoteRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getDeleteNoteMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Interactions
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.note.NoteOuterClass.LikeNoteResponse> likeNote(
        sonet.note.NoteOuterClass.LikeNoteRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getLikeNoteMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.note.NoteOuterClass.RenoteNoteResponse> renoteNote(
        sonet.note.NoteOuterClass.RenoteNoteRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getRenoteNoteMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Queries
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.note.NoteOuterClass.GetUserNotesResponse> getUserNotes(
        sonet.note.NoteOuterClass.GetUserNotesRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetUserNotesMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.note.NoteOuterClass.GetNoteThreadResponse> getNoteThread(
        sonet.note.NoteOuterClass.GetNoteThreadRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetNoteThreadMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.note.NoteOuterClass.SearchNotesResponse> searchNotes(
        sonet.note.NoteOuterClass.SearchNotesRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getSearchNotesMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Health
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.note.NoteOuterClass.HealthCheckResponse> healthCheck(
        sonet.note.NoteOuterClass.HealthCheckRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getHealthCheckMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_CREATE_NOTE = 0;
  private static final int METHODID_GET_NOTE = 1;
  private static final int METHODID_DELETE_NOTE = 2;
  private static final int METHODID_LIKE_NOTE = 3;
  private static final int METHODID_RENOTE_NOTE = 4;
  private static final int METHODID_GET_USER_NOTES = 5;
  private static final int METHODID_GET_NOTE_THREAD = 6;
  private static final int METHODID_SEARCH_NOTES = 7;
  private static final int METHODID_HEALTH_CHECK = 8;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final NoteServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(NoteServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_CREATE_NOTE:
          serviceImpl.createNote((sonet.note.NoteOuterClass.CreateNoteRequest) request,
              (io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.CreateNoteResponse>) responseObserver);
          break;
        case METHODID_GET_NOTE:
          serviceImpl.getNote((sonet.note.NoteOuterClass.GetNoteRequest) request,
              (io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.GetNoteResponse>) responseObserver);
          break;
        case METHODID_DELETE_NOTE:
          serviceImpl.deleteNote((sonet.note.NoteOuterClass.DeleteNoteRequest) request,
              (io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.DeleteNoteResponse>) responseObserver);
          break;
        case METHODID_LIKE_NOTE:
          serviceImpl.likeNote((sonet.note.NoteOuterClass.LikeNoteRequest) request,
              (io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.LikeNoteResponse>) responseObserver);
          break;
        case METHODID_RENOTE_NOTE:
          serviceImpl.renoteNote((sonet.note.NoteOuterClass.RenoteNoteRequest) request,
              (io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.RenoteNoteResponse>) responseObserver);
          break;
        case METHODID_GET_USER_NOTES:
          serviceImpl.getUserNotes((sonet.note.NoteOuterClass.GetUserNotesRequest) request,
              (io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.GetUserNotesResponse>) responseObserver);
          break;
        case METHODID_GET_NOTE_THREAD:
          serviceImpl.getNoteThread((sonet.note.NoteOuterClass.GetNoteThreadRequest) request,
              (io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.GetNoteThreadResponse>) responseObserver);
          break;
        case METHODID_SEARCH_NOTES:
          serviceImpl.searchNotes((sonet.note.NoteOuterClass.SearchNotesRequest) request,
              (io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.SearchNotesResponse>) responseObserver);
          break;
        case METHODID_HEALTH_CHECK:
          serviceImpl.healthCheck((sonet.note.NoteOuterClass.HealthCheckRequest) request,
              (io.grpc.stub.StreamObserver<sonet.note.NoteOuterClass.HealthCheckResponse>) responseObserver);
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

  private static abstract class NoteServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    NoteServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return sonet.note.NoteOuterClass.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("NoteService");
    }
  }

  private static final class NoteServiceFileDescriptorSupplier
      extends NoteServiceBaseDescriptorSupplier {
    NoteServiceFileDescriptorSupplier() {}
  }

  private static final class NoteServiceMethodDescriptorSupplier
      extends NoteServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    NoteServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (NoteServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new NoteServiceFileDescriptorSupplier())
              .addMethod(getCreateNoteMethod())
              .addMethod(getGetNoteMethod())
              .addMethod(getDeleteNoteMethod())
              .addMethod(getLikeNoteMethod())
              .addMethod(getRenoteNoteMethod())
              .addMethod(getGetUserNotesMethod())
              .addMethod(getGetNoteThreadMethod())
              .addMethod(getSearchNotesMethod())
              .addMethod(getHealthCheckMethod())
              .build();
        }
      }
    }
    return result;
  }
}
