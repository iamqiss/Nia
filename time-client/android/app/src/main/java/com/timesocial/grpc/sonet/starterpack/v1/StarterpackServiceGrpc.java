package sonet.starterpack.v1;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * Starterpack Service
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler",
    comments = "Source: services/starterpack_service.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class StarterpackServiceGrpc {

  private StarterpackServiceGrpc() {}

  public static final String SERVICE_NAME = "sonet.starterpack.v1.StarterpackService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackResponse> getCreateStarterpackMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateStarterpack",
      requestType = sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackRequest.class,
      responseType = sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackResponse> getCreateStarterpackMethod() {
    io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackResponse> getCreateStarterpackMethod;
    if ((getCreateStarterpackMethod = StarterpackServiceGrpc.getCreateStarterpackMethod) == null) {
      synchronized (StarterpackServiceGrpc.class) {
        if ((getCreateStarterpackMethod = StarterpackServiceGrpc.getCreateStarterpackMethod) == null) {
          StarterpackServiceGrpc.getCreateStarterpackMethod = getCreateStarterpackMethod =
              io.grpc.MethodDescriptor.<sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateStarterpack"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackResponse.getDefaultInstance()))
              .setSchemaDescriptor(new StarterpackServiceMethodDescriptorSupplier("CreateStarterpack"))
              .build();
        }
      }
    }
    return getCreateStarterpackMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackResponse> getGetStarterpackMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetStarterpack",
      requestType = sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackRequest.class,
      responseType = sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackResponse> getGetStarterpackMethod() {
    io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackResponse> getGetStarterpackMethod;
    if ((getGetStarterpackMethod = StarterpackServiceGrpc.getGetStarterpackMethod) == null) {
      synchronized (StarterpackServiceGrpc.class) {
        if ((getGetStarterpackMethod = StarterpackServiceGrpc.getGetStarterpackMethod) == null) {
          StarterpackServiceGrpc.getGetStarterpackMethod = getGetStarterpackMethod =
              io.grpc.MethodDescriptor.<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetStarterpack"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackResponse.getDefaultInstance()))
              .setSchemaDescriptor(new StarterpackServiceMethodDescriptorSupplier("GetStarterpack"))
              .build();
        }
      }
    }
    return getGetStarterpackMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksResponse> getGetUserStarterpacksMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetUserStarterpacks",
      requestType = sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksRequest.class,
      responseType = sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksResponse> getGetUserStarterpacksMethod() {
    io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksResponse> getGetUserStarterpacksMethod;
    if ((getGetUserStarterpacksMethod = StarterpackServiceGrpc.getGetUserStarterpacksMethod) == null) {
      synchronized (StarterpackServiceGrpc.class) {
        if ((getGetUserStarterpacksMethod = StarterpackServiceGrpc.getGetUserStarterpacksMethod) == null) {
          StarterpackServiceGrpc.getGetUserStarterpacksMethod = getGetUserStarterpacksMethod =
              io.grpc.MethodDescriptor.<sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetUserStarterpacks"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksResponse.getDefaultInstance()))
              .setSchemaDescriptor(new StarterpackServiceMethodDescriptorSupplier("GetUserStarterpacks"))
              .build();
        }
      }
    }
    return getGetUserStarterpacksMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackResponse> getUpdateStarterpackMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UpdateStarterpack",
      requestType = sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackRequest.class,
      responseType = sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackResponse> getUpdateStarterpackMethod() {
    io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackResponse> getUpdateStarterpackMethod;
    if ((getUpdateStarterpackMethod = StarterpackServiceGrpc.getUpdateStarterpackMethod) == null) {
      synchronized (StarterpackServiceGrpc.class) {
        if ((getUpdateStarterpackMethod = StarterpackServiceGrpc.getUpdateStarterpackMethod) == null) {
          StarterpackServiceGrpc.getUpdateStarterpackMethod = getUpdateStarterpackMethod =
              io.grpc.MethodDescriptor.<sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UpdateStarterpack"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackResponse.getDefaultInstance()))
              .setSchemaDescriptor(new StarterpackServiceMethodDescriptorSupplier("UpdateStarterpack"))
              .build();
        }
      }
    }
    return getUpdateStarterpackMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackResponse> getDeleteStarterpackMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "DeleteStarterpack",
      requestType = sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackRequest.class,
      responseType = sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackResponse> getDeleteStarterpackMethod() {
    io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackResponse> getDeleteStarterpackMethod;
    if ((getDeleteStarterpackMethod = StarterpackServiceGrpc.getDeleteStarterpackMethod) == null) {
      synchronized (StarterpackServiceGrpc.class) {
        if ((getDeleteStarterpackMethod = StarterpackServiceGrpc.getDeleteStarterpackMethod) == null) {
          StarterpackServiceGrpc.getDeleteStarterpackMethod = getDeleteStarterpackMethod =
              io.grpc.MethodDescriptor.<sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "DeleteStarterpack"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackResponse.getDefaultInstance()))
              .setSchemaDescriptor(new StarterpackServiceMethodDescriptorSupplier("DeleteStarterpack"))
              .build();
        }
      }
    }
    return getDeleteStarterpackMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemResponse> getAddStarterpackItemMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "AddStarterpackItem",
      requestType = sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemRequest.class,
      responseType = sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemResponse> getAddStarterpackItemMethod() {
    io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemResponse> getAddStarterpackItemMethod;
    if ((getAddStarterpackItemMethod = StarterpackServiceGrpc.getAddStarterpackItemMethod) == null) {
      synchronized (StarterpackServiceGrpc.class) {
        if ((getAddStarterpackItemMethod = StarterpackServiceGrpc.getAddStarterpackItemMethod) == null) {
          StarterpackServiceGrpc.getAddStarterpackItemMethod = getAddStarterpackItemMethod =
              io.grpc.MethodDescriptor.<sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "AddStarterpackItem"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemResponse.getDefaultInstance()))
              .setSchemaDescriptor(new StarterpackServiceMethodDescriptorSupplier("AddStarterpackItem"))
              .build();
        }
      }
    }
    return getAddStarterpackItemMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemResponse> getRemoveStarterpackItemMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "RemoveStarterpackItem",
      requestType = sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemRequest.class,
      responseType = sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemResponse> getRemoveStarterpackItemMethod() {
    io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemResponse> getRemoveStarterpackItemMethod;
    if ((getRemoveStarterpackItemMethod = StarterpackServiceGrpc.getRemoveStarterpackItemMethod) == null) {
      synchronized (StarterpackServiceGrpc.class) {
        if ((getRemoveStarterpackItemMethod = StarterpackServiceGrpc.getRemoveStarterpackItemMethod) == null) {
          StarterpackServiceGrpc.getRemoveStarterpackItemMethod = getRemoveStarterpackItemMethod =
              io.grpc.MethodDescriptor.<sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "RemoveStarterpackItem"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemResponse.getDefaultInstance()))
              .setSchemaDescriptor(new StarterpackServiceMethodDescriptorSupplier("RemoveStarterpackItem"))
              .build();
        }
      }
    }
    return getRemoveStarterpackItemMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsResponse> getGetStarterpackItemsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetStarterpackItems",
      requestType = sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsRequest.class,
      responseType = sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsResponse> getGetStarterpackItemsMethod() {
    io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsResponse> getGetStarterpackItemsMethod;
    if ((getGetStarterpackItemsMethod = StarterpackServiceGrpc.getGetStarterpackItemsMethod) == null) {
      synchronized (StarterpackServiceGrpc.class) {
        if ((getGetStarterpackItemsMethod = StarterpackServiceGrpc.getGetStarterpackItemsMethod) == null) {
          StarterpackServiceGrpc.getGetStarterpackItemsMethod = getGetStarterpackItemsMethod =
              io.grpc.MethodDescriptor.<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetStarterpackItems"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsResponse.getDefaultInstance()))
              .setSchemaDescriptor(new StarterpackServiceMethodDescriptorSupplier("GetStarterpackItems"))
              .build();
        }
      }
    }
    return getGetStarterpackItemsMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksResponse> getGetSuggestedStarterpacksMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetSuggestedStarterpacks",
      requestType = sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksRequest.class,
      responseType = sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksRequest,
      sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksResponse> getGetSuggestedStarterpacksMethod() {
    io.grpc.MethodDescriptor<sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksResponse> getGetSuggestedStarterpacksMethod;
    if ((getGetSuggestedStarterpacksMethod = StarterpackServiceGrpc.getGetSuggestedStarterpacksMethod) == null) {
      synchronized (StarterpackServiceGrpc.class) {
        if ((getGetSuggestedStarterpacksMethod = StarterpackServiceGrpc.getGetSuggestedStarterpacksMethod) == null) {
          StarterpackServiceGrpc.getGetSuggestedStarterpacksMethod = getGetSuggestedStarterpacksMethod =
              io.grpc.MethodDescriptor.<sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksRequest, sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetSuggestedStarterpacks"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksResponse.getDefaultInstance()))
              .setSchemaDescriptor(new StarterpackServiceMethodDescriptorSupplier("GetSuggestedStarterpacks"))
              .build();
        }
      }
    }
    return getGetSuggestedStarterpacksMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static StarterpackServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<StarterpackServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<StarterpackServiceStub>() {
        @java.lang.Override
        public StarterpackServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new StarterpackServiceStub(channel, callOptions);
        }
      };
    return StarterpackServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static StarterpackServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<StarterpackServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<StarterpackServiceBlockingStub>() {
        @java.lang.Override
        public StarterpackServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new StarterpackServiceBlockingStub(channel, callOptions);
        }
      };
    return StarterpackServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static StarterpackServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<StarterpackServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<StarterpackServiceFutureStub>() {
        @java.lang.Override
        public StarterpackServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new StarterpackServiceFutureStub(channel, callOptions);
        }
      };
    return StarterpackServiceFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * Starterpack Service
   * </pre>
   */
  public static abstract class StarterpackServiceImplBase implements io.grpc.BindableService {

    /**
     * <pre>
     * Create a new starterpack
     * </pre>
     */
    public void createStarterpack(sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateStarterpackMethod(), responseObserver);
    }

    /**
     * <pre>
     * Get a starterpack by ID
     * </pre>
     */
    public void getStarterpack(sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetStarterpackMethod(), responseObserver);
    }

    /**
     * <pre>
     * Get starterpacks created by a user
     * </pre>
     */
    public void getUserStarterpacks(sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetUserStarterpacksMethod(), responseObserver);
    }

    /**
     * <pre>
     * Update a starterpack
     * </pre>
     */
    public void updateStarterpack(sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUpdateStarterpackMethod(), responseObserver);
    }

    /**
     * <pre>
     * Delete a starterpack
     * </pre>
     */
    public void deleteStarterpack(sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getDeleteStarterpackMethod(), responseObserver);
    }

    /**
     * <pre>
     * Add an item to a starterpack
     * </pre>
     */
    public void addStarterpackItem(sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getAddStarterpackItemMethod(), responseObserver);
    }

    /**
     * <pre>
     * Remove an item from a starterpack
     * </pre>
     */
    public void removeStarterpackItem(sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getRemoveStarterpackItemMethod(), responseObserver);
    }

    /**
     * <pre>
     * Get starterpack items
     * </pre>
     */
    public void getStarterpackItems(sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetStarterpackItemsMethod(), responseObserver);
    }

    /**
     * <pre>
     * Get suggested starterpacks for a user
     * </pre>
     */
    public void getSuggestedStarterpacks(sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetSuggestedStarterpacksMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getCreateStarterpackMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackRequest,
                sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackResponse>(
                  this, METHODID_CREATE_STARTERPACK)))
          .addMethod(
            getGetStarterpackMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackRequest,
                sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackResponse>(
                  this, METHODID_GET_STARTERPACK)))
          .addMethod(
            getGetUserStarterpacksMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksRequest,
                sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksResponse>(
                  this, METHODID_GET_USER_STARTERPACKS)))
          .addMethod(
            getUpdateStarterpackMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackRequest,
                sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackResponse>(
                  this, METHODID_UPDATE_STARTERPACK)))
          .addMethod(
            getDeleteStarterpackMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackRequest,
                sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackResponse>(
                  this, METHODID_DELETE_STARTERPACK)))
          .addMethod(
            getAddStarterpackItemMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemRequest,
                sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemResponse>(
                  this, METHODID_ADD_STARTERPACK_ITEM)))
          .addMethod(
            getRemoveStarterpackItemMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemRequest,
                sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemResponse>(
                  this, METHODID_REMOVE_STARTERPACK_ITEM)))
          .addMethod(
            getGetStarterpackItemsMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsRequest,
                sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsResponse>(
                  this, METHODID_GET_STARTERPACK_ITEMS)))
          .addMethod(
            getGetSuggestedStarterpacksMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksRequest,
                sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksResponse>(
                  this, METHODID_GET_SUGGESTED_STARTERPACKS)))
          .build();
    }
  }

  /**
   * <pre>
   * Starterpack Service
   * </pre>
   */
  public static final class StarterpackServiceStub extends io.grpc.stub.AbstractAsyncStub<StarterpackServiceStub> {
    private StarterpackServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected StarterpackServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new StarterpackServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * Create a new starterpack
     * </pre>
     */
    public void createStarterpack(sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateStarterpackMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Get a starterpack by ID
     * </pre>
     */
    public void getStarterpack(sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetStarterpackMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Get starterpacks created by a user
     * </pre>
     */
    public void getUserStarterpacks(sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetUserStarterpacksMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Update a starterpack
     * </pre>
     */
    public void updateStarterpack(sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpdateStarterpackMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Delete a starterpack
     * </pre>
     */
    public void deleteStarterpack(sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getDeleteStarterpackMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Add an item to a starterpack
     * </pre>
     */
    public void addStarterpackItem(sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getAddStarterpackItemMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Remove an item from a starterpack
     * </pre>
     */
    public void removeStarterpackItem(sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getRemoveStarterpackItemMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Get starterpack items
     * </pre>
     */
    public void getStarterpackItems(sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetStarterpackItemsMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Get suggested starterpacks for a user
     * </pre>
     */
    public void getSuggestedStarterpacks(sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksRequest request,
        io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetSuggestedStarterpacksMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * <pre>
   * Starterpack Service
   * </pre>
   */
  public static final class StarterpackServiceBlockingStub extends io.grpc.stub.AbstractBlockingStub<StarterpackServiceBlockingStub> {
    private StarterpackServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected StarterpackServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new StarterpackServiceBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * Create a new starterpack
     * </pre>
     */
    public sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackResponse createStarterpack(sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateStarterpackMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Get a starterpack by ID
     * </pre>
     */
    public sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackResponse getStarterpack(sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetStarterpackMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Get starterpacks created by a user
     * </pre>
     */
    public sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksResponse getUserStarterpacks(sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetUserStarterpacksMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Update a starterpack
     * </pre>
     */
    public sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackResponse updateStarterpack(sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpdateStarterpackMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Delete a starterpack
     * </pre>
     */
    public sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackResponse deleteStarterpack(sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getDeleteStarterpackMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Add an item to a starterpack
     * </pre>
     */
    public sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemResponse addStarterpackItem(sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getAddStarterpackItemMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Remove an item from a starterpack
     * </pre>
     */
    public sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemResponse removeStarterpackItem(sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getRemoveStarterpackItemMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Get starterpack items
     * </pre>
     */
    public sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsResponse getStarterpackItems(sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetStarterpackItemsMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Get suggested starterpacks for a user
     * </pre>
     */
    public sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksResponse getSuggestedStarterpacks(sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetSuggestedStarterpacksMethod(), getCallOptions(), request);
    }
  }

  /**
   * <pre>
   * Starterpack Service
   * </pre>
   */
  public static final class StarterpackServiceFutureStub extends io.grpc.stub.AbstractFutureStub<StarterpackServiceFutureStub> {
    private StarterpackServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected StarterpackServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new StarterpackServiceFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * Create a new starterpack
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackResponse> createStarterpack(
        sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateStarterpackMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Get a starterpack by ID
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackResponse> getStarterpack(
        sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetStarterpackMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Get starterpacks created by a user
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksResponse> getUserStarterpacks(
        sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetUserStarterpacksMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Update a starterpack
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackResponse> updateStarterpack(
        sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpdateStarterpackMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Delete a starterpack
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackResponse> deleteStarterpack(
        sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getDeleteStarterpackMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Add an item to a starterpack
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemResponse> addStarterpackItem(
        sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getAddStarterpackItemMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Remove an item from a starterpack
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemResponse> removeStarterpackItem(
        sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getRemoveStarterpackItemMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Get starterpack items
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsResponse> getStarterpackItems(
        sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetStarterpackItemsMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Get suggested starterpacks for a user
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksResponse> getSuggestedStarterpacks(
        sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetSuggestedStarterpacksMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_CREATE_STARTERPACK = 0;
  private static final int METHODID_GET_STARTERPACK = 1;
  private static final int METHODID_GET_USER_STARTERPACKS = 2;
  private static final int METHODID_UPDATE_STARTERPACK = 3;
  private static final int METHODID_DELETE_STARTERPACK = 4;
  private static final int METHODID_ADD_STARTERPACK_ITEM = 5;
  private static final int METHODID_REMOVE_STARTERPACK_ITEM = 6;
  private static final int METHODID_GET_STARTERPACK_ITEMS = 7;
  private static final int METHODID_GET_SUGGESTED_STARTERPACKS = 8;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final StarterpackServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(StarterpackServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_CREATE_STARTERPACK:
          serviceImpl.createStarterpack((sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackRequest) request,
              (io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.CreateStarterpackResponse>) responseObserver);
          break;
        case METHODID_GET_STARTERPACK:
          serviceImpl.getStarterpack((sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackRequest) request,
              (io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackResponse>) responseObserver);
          break;
        case METHODID_GET_USER_STARTERPACKS:
          serviceImpl.getUserStarterpacks((sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksRequest) request,
              (io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.GetUserStarterpacksResponse>) responseObserver);
          break;
        case METHODID_UPDATE_STARTERPACK:
          serviceImpl.updateStarterpack((sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackRequest) request,
              (io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.UpdateStarterpackResponse>) responseObserver);
          break;
        case METHODID_DELETE_STARTERPACK:
          serviceImpl.deleteStarterpack((sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackRequest) request,
              (io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.DeleteStarterpackResponse>) responseObserver);
          break;
        case METHODID_ADD_STARTERPACK_ITEM:
          serviceImpl.addStarterpackItem((sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemRequest) request,
              (io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.AddStarterpackItemResponse>) responseObserver);
          break;
        case METHODID_REMOVE_STARTERPACK_ITEM:
          serviceImpl.removeStarterpackItem((sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemRequest) request,
              (io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.RemoveStarterpackItemResponse>) responseObserver);
          break;
        case METHODID_GET_STARTERPACK_ITEMS:
          serviceImpl.getStarterpackItems((sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsRequest) request,
              (io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.GetStarterpackItemsResponse>) responseObserver);
          break;
        case METHODID_GET_SUGGESTED_STARTERPACKS:
          serviceImpl.getSuggestedStarterpacks((sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksRequest) request,
              (io.grpc.stub.StreamObserver<sonet.starterpack.v1.StarterpackServiceOuterClass.GetSuggestedStarterpacksResponse>) responseObserver);
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

  private static abstract class StarterpackServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    StarterpackServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return sonet.starterpack.v1.StarterpackServiceOuterClass.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("StarterpackService");
    }
  }

  private static final class StarterpackServiceFileDescriptorSupplier
      extends StarterpackServiceBaseDescriptorSupplier {
    StarterpackServiceFileDescriptorSupplier() {}
  }

  private static final class StarterpackServiceMethodDescriptorSupplier
      extends StarterpackServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    StarterpackServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (StarterpackServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new StarterpackServiceFileDescriptorSupplier())
              .addMethod(getCreateStarterpackMethod())
              .addMethod(getGetStarterpackMethod())
              .addMethod(getGetUserStarterpacksMethod())
              .addMethod(getUpdateStarterpackMethod())
              .addMethod(getDeleteStarterpackMethod())
              .addMethod(getAddStarterpackItemMethod())
              .addMethod(getRemoveStarterpackItemMethod())
              .addMethod(getGetStarterpackItemsMethod())
              .addMethod(getGetSuggestedStarterpacksMethod())
              .build();
        }
      }
    }
    return result;
  }
}
