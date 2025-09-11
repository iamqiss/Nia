package sonet.list.v1;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * List Service
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler",
    comments = "Source: services/list_service.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class ListServiceGrpc {

  private ListServiceGrpc() {}

  public static final String SERVICE_NAME = "sonet.list.v1.ListService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.CreateListRequest,
      sonet.list.v1.ListServiceOuterClass.CreateListResponse> getCreateListMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateList",
      requestType = sonet.list.v1.ListServiceOuterClass.CreateListRequest.class,
      responseType = sonet.list.v1.ListServiceOuterClass.CreateListResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.CreateListRequest,
      sonet.list.v1.ListServiceOuterClass.CreateListResponse> getCreateListMethod() {
    io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.CreateListRequest, sonet.list.v1.ListServiceOuterClass.CreateListResponse> getCreateListMethod;
    if ((getCreateListMethod = ListServiceGrpc.getCreateListMethod) == null) {
      synchronized (ListServiceGrpc.class) {
        if ((getCreateListMethod = ListServiceGrpc.getCreateListMethod) == null) {
          ListServiceGrpc.getCreateListMethod = getCreateListMethod =
              io.grpc.MethodDescriptor.<sonet.list.v1.ListServiceOuterClass.CreateListRequest, sonet.list.v1.ListServiceOuterClass.CreateListResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateList"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.CreateListRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.CreateListResponse.getDefaultInstance()))
              .setSchemaDescriptor(new ListServiceMethodDescriptorSupplier("CreateList"))
              .build();
        }
      }
    }
    return getCreateListMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.GetListRequest,
      sonet.list.v1.ListServiceOuterClass.GetListResponse> getGetListMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetList",
      requestType = sonet.list.v1.ListServiceOuterClass.GetListRequest.class,
      responseType = sonet.list.v1.ListServiceOuterClass.GetListResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.GetListRequest,
      sonet.list.v1.ListServiceOuterClass.GetListResponse> getGetListMethod() {
    io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.GetListRequest, sonet.list.v1.ListServiceOuterClass.GetListResponse> getGetListMethod;
    if ((getGetListMethod = ListServiceGrpc.getGetListMethod) == null) {
      synchronized (ListServiceGrpc.class) {
        if ((getGetListMethod = ListServiceGrpc.getGetListMethod) == null) {
          ListServiceGrpc.getGetListMethod = getGetListMethod =
              io.grpc.MethodDescriptor.<sonet.list.v1.ListServiceOuterClass.GetListRequest, sonet.list.v1.ListServiceOuterClass.GetListResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetList"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.GetListRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.GetListResponse.getDefaultInstance()))
              .setSchemaDescriptor(new ListServiceMethodDescriptorSupplier("GetList"))
              .build();
        }
      }
    }
    return getGetListMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.GetUserListsRequest,
      sonet.list.v1.ListServiceOuterClass.GetUserListsResponse> getGetUserListsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetUserLists",
      requestType = sonet.list.v1.ListServiceOuterClass.GetUserListsRequest.class,
      responseType = sonet.list.v1.ListServiceOuterClass.GetUserListsResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.GetUserListsRequest,
      sonet.list.v1.ListServiceOuterClass.GetUserListsResponse> getGetUserListsMethod() {
    io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.GetUserListsRequest, sonet.list.v1.ListServiceOuterClass.GetUserListsResponse> getGetUserListsMethod;
    if ((getGetUserListsMethod = ListServiceGrpc.getGetUserListsMethod) == null) {
      synchronized (ListServiceGrpc.class) {
        if ((getGetUserListsMethod = ListServiceGrpc.getGetUserListsMethod) == null) {
          ListServiceGrpc.getGetUserListsMethod = getGetUserListsMethod =
              io.grpc.MethodDescriptor.<sonet.list.v1.ListServiceOuterClass.GetUserListsRequest, sonet.list.v1.ListServiceOuterClass.GetUserListsResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetUserLists"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.GetUserListsRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.GetUserListsResponse.getDefaultInstance()))
              .setSchemaDescriptor(new ListServiceMethodDescriptorSupplier("GetUserLists"))
              .build();
        }
      }
    }
    return getGetUserListsMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.UpdateListRequest,
      sonet.list.v1.ListServiceOuterClass.UpdateListResponse> getUpdateListMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UpdateList",
      requestType = sonet.list.v1.ListServiceOuterClass.UpdateListRequest.class,
      responseType = sonet.list.v1.ListServiceOuterClass.UpdateListResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.UpdateListRequest,
      sonet.list.v1.ListServiceOuterClass.UpdateListResponse> getUpdateListMethod() {
    io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.UpdateListRequest, sonet.list.v1.ListServiceOuterClass.UpdateListResponse> getUpdateListMethod;
    if ((getUpdateListMethod = ListServiceGrpc.getUpdateListMethod) == null) {
      synchronized (ListServiceGrpc.class) {
        if ((getUpdateListMethod = ListServiceGrpc.getUpdateListMethod) == null) {
          ListServiceGrpc.getUpdateListMethod = getUpdateListMethod =
              io.grpc.MethodDescriptor.<sonet.list.v1.ListServiceOuterClass.UpdateListRequest, sonet.list.v1.ListServiceOuterClass.UpdateListResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UpdateList"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.UpdateListRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.UpdateListResponse.getDefaultInstance()))
              .setSchemaDescriptor(new ListServiceMethodDescriptorSupplier("UpdateList"))
              .build();
        }
      }
    }
    return getUpdateListMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.DeleteListRequest,
      sonet.list.v1.ListServiceOuterClass.DeleteListResponse> getDeleteListMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "DeleteList",
      requestType = sonet.list.v1.ListServiceOuterClass.DeleteListRequest.class,
      responseType = sonet.list.v1.ListServiceOuterClass.DeleteListResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.DeleteListRequest,
      sonet.list.v1.ListServiceOuterClass.DeleteListResponse> getDeleteListMethod() {
    io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.DeleteListRequest, sonet.list.v1.ListServiceOuterClass.DeleteListResponse> getDeleteListMethod;
    if ((getDeleteListMethod = ListServiceGrpc.getDeleteListMethod) == null) {
      synchronized (ListServiceGrpc.class) {
        if ((getDeleteListMethod = ListServiceGrpc.getDeleteListMethod) == null) {
          ListServiceGrpc.getDeleteListMethod = getDeleteListMethod =
              io.grpc.MethodDescriptor.<sonet.list.v1.ListServiceOuterClass.DeleteListRequest, sonet.list.v1.ListServiceOuterClass.DeleteListResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "DeleteList"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.DeleteListRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.DeleteListResponse.getDefaultInstance()))
              .setSchemaDescriptor(new ListServiceMethodDescriptorSupplier("DeleteList"))
              .build();
        }
      }
    }
    return getDeleteListMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.AddListMemberRequest,
      sonet.list.v1.ListServiceOuterClass.AddListMemberResponse> getAddListMemberMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "AddListMember",
      requestType = sonet.list.v1.ListServiceOuterClass.AddListMemberRequest.class,
      responseType = sonet.list.v1.ListServiceOuterClass.AddListMemberResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.AddListMemberRequest,
      sonet.list.v1.ListServiceOuterClass.AddListMemberResponse> getAddListMemberMethod() {
    io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.AddListMemberRequest, sonet.list.v1.ListServiceOuterClass.AddListMemberResponse> getAddListMemberMethod;
    if ((getAddListMemberMethod = ListServiceGrpc.getAddListMemberMethod) == null) {
      synchronized (ListServiceGrpc.class) {
        if ((getAddListMemberMethod = ListServiceGrpc.getAddListMemberMethod) == null) {
          ListServiceGrpc.getAddListMemberMethod = getAddListMemberMethod =
              io.grpc.MethodDescriptor.<sonet.list.v1.ListServiceOuterClass.AddListMemberRequest, sonet.list.v1.ListServiceOuterClass.AddListMemberResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "AddListMember"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.AddListMemberRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.AddListMemberResponse.getDefaultInstance()))
              .setSchemaDescriptor(new ListServiceMethodDescriptorSupplier("AddListMember"))
              .build();
        }
      }
    }
    return getAddListMemberMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.RemoveListMemberRequest,
      sonet.list.v1.ListServiceOuterClass.RemoveListMemberResponse> getRemoveListMemberMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "RemoveListMember",
      requestType = sonet.list.v1.ListServiceOuterClass.RemoveListMemberRequest.class,
      responseType = sonet.list.v1.ListServiceOuterClass.RemoveListMemberResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.RemoveListMemberRequest,
      sonet.list.v1.ListServiceOuterClass.RemoveListMemberResponse> getRemoveListMemberMethod() {
    io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.RemoveListMemberRequest, sonet.list.v1.ListServiceOuterClass.RemoveListMemberResponse> getRemoveListMemberMethod;
    if ((getRemoveListMemberMethod = ListServiceGrpc.getRemoveListMemberMethod) == null) {
      synchronized (ListServiceGrpc.class) {
        if ((getRemoveListMemberMethod = ListServiceGrpc.getRemoveListMemberMethod) == null) {
          ListServiceGrpc.getRemoveListMemberMethod = getRemoveListMemberMethod =
              io.grpc.MethodDescriptor.<sonet.list.v1.ListServiceOuterClass.RemoveListMemberRequest, sonet.list.v1.ListServiceOuterClass.RemoveListMemberResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "RemoveListMember"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.RemoveListMemberRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.RemoveListMemberResponse.getDefaultInstance()))
              .setSchemaDescriptor(new ListServiceMethodDescriptorSupplier("RemoveListMember"))
              .build();
        }
      }
    }
    return getRemoveListMemberMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.GetListMembersRequest,
      sonet.list.v1.ListServiceOuterClass.GetListMembersResponse> getGetListMembersMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetListMembers",
      requestType = sonet.list.v1.ListServiceOuterClass.GetListMembersRequest.class,
      responseType = sonet.list.v1.ListServiceOuterClass.GetListMembersResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.GetListMembersRequest,
      sonet.list.v1.ListServiceOuterClass.GetListMembersResponse> getGetListMembersMethod() {
    io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.GetListMembersRequest, sonet.list.v1.ListServiceOuterClass.GetListMembersResponse> getGetListMembersMethod;
    if ((getGetListMembersMethod = ListServiceGrpc.getGetListMembersMethod) == null) {
      synchronized (ListServiceGrpc.class) {
        if ((getGetListMembersMethod = ListServiceGrpc.getGetListMembersMethod) == null) {
          ListServiceGrpc.getGetListMembersMethod = getGetListMembersMethod =
              io.grpc.MethodDescriptor.<sonet.list.v1.ListServiceOuterClass.GetListMembersRequest, sonet.list.v1.ListServiceOuterClass.GetListMembersResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetListMembers"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.GetListMembersRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.GetListMembersResponse.getDefaultInstance()))
              .setSchemaDescriptor(new ListServiceMethodDescriptorSupplier("GetListMembers"))
              .build();
        }
      }
    }
    return getGetListMembersMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.IsUserInListRequest,
      sonet.list.v1.ListServiceOuterClass.IsUserInListResponse> getIsUserInListMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "IsUserInList",
      requestType = sonet.list.v1.ListServiceOuterClass.IsUserInListRequest.class,
      responseType = sonet.list.v1.ListServiceOuterClass.IsUserInListResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.IsUserInListRequest,
      sonet.list.v1.ListServiceOuterClass.IsUserInListResponse> getIsUserInListMethod() {
    io.grpc.MethodDescriptor<sonet.list.v1.ListServiceOuterClass.IsUserInListRequest, sonet.list.v1.ListServiceOuterClass.IsUserInListResponse> getIsUserInListMethod;
    if ((getIsUserInListMethod = ListServiceGrpc.getIsUserInListMethod) == null) {
      synchronized (ListServiceGrpc.class) {
        if ((getIsUserInListMethod = ListServiceGrpc.getIsUserInListMethod) == null) {
          ListServiceGrpc.getIsUserInListMethod = getIsUserInListMethod =
              io.grpc.MethodDescriptor.<sonet.list.v1.ListServiceOuterClass.IsUserInListRequest, sonet.list.v1.ListServiceOuterClass.IsUserInListResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "IsUserInList"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.IsUserInListRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.list.v1.ListServiceOuterClass.IsUserInListResponse.getDefaultInstance()))
              .setSchemaDescriptor(new ListServiceMethodDescriptorSupplier("IsUserInList"))
              .build();
        }
      }
    }
    return getIsUserInListMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static ListServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<ListServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<ListServiceStub>() {
        @java.lang.Override
        public ListServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new ListServiceStub(channel, callOptions);
        }
      };
    return ListServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static ListServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<ListServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<ListServiceBlockingStub>() {
        @java.lang.Override
        public ListServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new ListServiceBlockingStub(channel, callOptions);
        }
      };
    return ListServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static ListServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<ListServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<ListServiceFutureStub>() {
        @java.lang.Override
        public ListServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new ListServiceFutureStub(channel, callOptions);
        }
      };
    return ListServiceFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * List Service
   * </pre>
   */
  public static abstract class ListServiceImplBase implements io.grpc.BindableService {

    /**
     * <pre>
     * Create a new list
     * </pre>
     */
    public void createList(sonet.list.v1.ListServiceOuterClass.CreateListRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.CreateListResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateListMethod(), responseObserver);
    }

    /**
     * <pre>
     * Get a list by ID
     * </pre>
     */
    public void getList(sonet.list.v1.ListServiceOuterClass.GetListRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.GetListResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetListMethod(), responseObserver);
    }

    /**
     * <pre>
     * Get lists owned by a user
     * </pre>
     */
    public void getUserLists(sonet.list.v1.ListServiceOuterClass.GetUserListsRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.GetUserListsResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetUserListsMethod(), responseObserver);
    }

    /**
     * <pre>
     * Update a list
     * </pre>
     */
    public void updateList(sonet.list.v1.ListServiceOuterClass.UpdateListRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.UpdateListResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUpdateListMethod(), responseObserver);
    }

    /**
     * <pre>
     * Delete a list
     * </pre>
     */
    public void deleteList(sonet.list.v1.ListServiceOuterClass.DeleteListRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.DeleteListResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getDeleteListMethod(), responseObserver);
    }

    /**
     * <pre>
     * Add a member to a list
     * </pre>
     */
    public void addListMember(sonet.list.v1.ListServiceOuterClass.AddListMemberRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.AddListMemberResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getAddListMemberMethod(), responseObserver);
    }

    /**
     * <pre>
     * Remove a member from a list
     * </pre>
     */
    public void removeListMember(sonet.list.v1.ListServiceOuterClass.RemoveListMemberRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.RemoveListMemberResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getRemoveListMemberMethod(), responseObserver);
    }

    /**
     * <pre>
     * Get list members
     * </pre>
     */
    public void getListMembers(sonet.list.v1.ListServiceOuterClass.GetListMembersRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.GetListMembersResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetListMembersMethod(), responseObserver);
    }

    /**
     * <pre>
     * Check if user is in list
     * </pre>
     */
    public void isUserInList(sonet.list.v1.ListServiceOuterClass.IsUserInListRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.IsUserInListResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getIsUserInListMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getCreateListMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.list.v1.ListServiceOuterClass.CreateListRequest,
                sonet.list.v1.ListServiceOuterClass.CreateListResponse>(
                  this, METHODID_CREATE_LIST)))
          .addMethod(
            getGetListMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.list.v1.ListServiceOuterClass.GetListRequest,
                sonet.list.v1.ListServiceOuterClass.GetListResponse>(
                  this, METHODID_GET_LIST)))
          .addMethod(
            getGetUserListsMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.list.v1.ListServiceOuterClass.GetUserListsRequest,
                sonet.list.v1.ListServiceOuterClass.GetUserListsResponse>(
                  this, METHODID_GET_USER_LISTS)))
          .addMethod(
            getUpdateListMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.list.v1.ListServiceOuterClass.UpdateListRequest,
                sonet.list.v1.ListServiceOuterClass.UpdateListResponse>(
                  this, METHODID_UPDATE_LIST)))
          .addMethod(
            getDeleteListMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.list.v1.ListServiceOuterClass.DeleteListRequest,
                sonet.list.v1.ListServiceOuterClass.DeleteListResponse>(
                  this, METHODID_DELETE_LIST)))
          .addMethod(
            getAddListMemberMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.list.v1.ListServiceOuterClass.AddListMemberRequest,
                sonet.list.v1.ListServiceOuterClass.AddListMemberResponse>(
                  this, METHODID_ADD_LIST_MEMBER)))
          .addMethod(
            getRemoveListMemberMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.list.v1.ListServiceOuterClass.RemoveListMemberRequest,
                sonet.list.v1.ListServiceOuterClass.RemoveListMemberResponse>(
                  this, METHODID_REMOVE_LIST_MEMBER)))
          .addMethod(
            getGetListMembersMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.list.v1.ListServiceOuterClass.GetListMembersRequest,
                sonet.list.v1.ListServiceOuterClass.GetListMembersResponse>(
                  this, METHODID_GET_LIST_MEMBERS)))
          .addMethod(
            getIsUserInListMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.list.v1.ListServiceOuterClass.IsUserInListRequest,
                sonet.list.v1.ListServiceOuterClass.IsUserInListResponse>(
                  this, METHODID_IS_USER_IN_LIST)))
          .build();
    }
  }

  /**
   * <pre>
   * List Service
   * </pre>
   */
  public static final class ListServiceStub extends io.grpc.stub.AbstractAsyncStub<ListServiceStub> {
    private ListServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected ListServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new ListServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * Create a new list
     * </pre>
     */
    public void createList(sonet.list.v1.ListServiceOuterClass.CreateListRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.CreateListResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateListMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Get a list by ID
     * </pre>
     */
    public void getList(sonet.list.v1.ListServiceOuterClass.GetListRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.GetListResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetListMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Get lists owned by a user
     * </pre>
     */
    public void getUserLists(sonet.list.v1.ListServiceOuterClass.GetUserListsRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.GetUserListsResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetUserListsMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Update a list
     * </pre>
     */
    public void updateList(sonet.list.v1.ListServiceOuterClass.UpdateListRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.UpdateListResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpdateListMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Delete a list
     * </pre>
     */
    public void deleteList(sonet.list.v1.ListServiceOuterClass.DeleteListRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.DeleteListResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getDeleteListMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Add a member to a list
     * </pre>
     */
    public void addListMember(sonet.list.v1.ListServiceOuterClass.AddListMemberRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.AddListMemberResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getAddListMemberMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Remove a member from a list
     * </pre>
     */
    public void removeListMember(sonet.list.v1.ListServiceOuterClass.RemoveListMemberRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.RemoveListMemberResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getRemoveListMemberMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Get list members
     * </pre>
     */
    public void getListMembers(sonet.list.v1.ListServiceOuterClass.GetListMembersRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.GetListMembersResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetListMembersMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Check if user is in list
     * </pre>
     */
    public void isUserInList(sonet.list.v1.ListServiceOuterClass.IsUserInListRequest request,
        io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.IsUserInListResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getIsUserInListMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * <pre>
   * List Service
   * </pre>
   */
  public static final class ListServiceBlockingStub extends io.grpc.stub.AbstractBlockingStub<ListServiceBlockingStub> {
    private ListServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected ListServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new ListServiceBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * Create a new list
     * </pre>
     */
    public sonet.list.v1.ListServiceOuterClass.CreateListResponse createList(sonet.list.v1.ListServiceOuterClass.CreateListRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateListMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Get a list by ID
     * </pre>
     */
    public sonet.list.v1.ListServiceOuterClass.GetListResponse getList(sonet.list.v1.ListServiceOuterClass.GetListRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetListMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Get lists owned by a user
     * </pre>
     */
    public sonet.list.v1.ListServiceOuterClass.GetUserListsResponse getUserLists(sonet.list.v1.ListServiceOuterClass.GetUserListsRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetUserListsMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Update a list
     * </pre>
     */
    public sonet.list.v1.ListServiceOuterClass.UpdateListResponse updateList(sonet.list.v1.ListServiceOuterClass.UpdateListRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpdateListMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Delete a list
     * </pre>
     */
    public sonet.list.v1.ListServiceOuterClass.DeleteListResponse deleteList(sonet.list.v1.ListServiceOuterClass.DeleteListRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getDeleteListMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Add a member to a list
     * </pre>
     */
    public sonet.list.v1.ListServiceOuterClass.AddListMemberResponse addListMember(sonet.list.v1.ListServiceOuterClass.AddListMemberRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getAddListMemberMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Remove a member from a list
     * </pre>
     */
    public sonet.list.v1.ListServiceOuterClass.RemoveListMemberResponse removeListMember(sonet.list.v1.ListServiceOuterClass.RemoveListMemberRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getRemoveListMemberMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Get list members
     * </pre>
     */
    public sonet.list.v1.ListServiceOuterClass.GetListMembersResponse getListMembers(sonet.list.v1.ListServiceOuterClass.GetListMembersRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetListMembersMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Check if user is in list
     * </pre>
     */
    public sonet.list.v1.ListServiceOuterClass.IsUserInListResponse isUserInList(sonet.list.v1.ListServiceOuterClass.IsUserInListRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getIsUserInListMethod(), getCallOptions(), request);
    }
  }

  /**
   * <pre>
   * List Service
   * </pre>
   */
  public static final class ListServiceFutureStub extends io.grpc.stub.AbstractFutureStub<ListServiceFutureStub> {
    private ListServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected ListServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new ListServiceFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * Create a new list
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.list.v1.ListServiceOuterClass.CreateListResponse> createList(
        sonet.list.v1.ListServiceOuterClass.CreateListRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateListMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Get a list by ID
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.list.v1.ListServiceOuterClass.GetListResponse> getList(
        sonet.list.v1.ListServiceOuterClass.GetListRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetListMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Get lists owned by a user
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.list.v1.ListServiceOuterClass.GetUserListsResponse> getUserLists(
        sonet.list.v1.ListServiceOuterClass.GetUserListsRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetUserListsMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Update a list
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.list.v1.ListServiceOuterClass.UpdateListResponse> updateList(
        sonet.list.v1.ListServiceOuterClass.UpdateListRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpdateListMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Delete a list
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.list.v1.ListServiceOuterClass.DeleteListResponse> deleteList(
        sonet.list.v1.ListServiceOuterClass.DeleteListRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getDeleteListMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Add a member to a list
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.list.v1.ListServiceOuterClass.AddListMemberResponse> addListMember(
        sonet.list.v1.ListServiceOuterClass.AddListMemberRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getAddListMemberMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Remove a member from a list
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.list.v1.ListServiceOuterClass.RemoveListMemberResponse> removeListMember(
        sonet.list.v1.ListServiceOuterClass.RemoveListMemberRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getRemoveListMemberMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Get list members
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.list.v1.ListServiceOuterClass.GetListMembersResponse> getListMembers(
        sonet.list.v1.ListServiceOuterClass.GetListMembersRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetListMembersMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Check if user is in list
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.list.v1.ListServiceOuterClass.IsUserInListResponse> isUserInList(
        sonet.list.v1.ListServiceOuterClass.IsUserInListRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getIsUserInListMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_CREATE_LIST = 0;
  private static final int METHODID_GET_LIST = 1;
  private static final int METHODID_GET_USER_LISTS = 2;
  private static final int METHODID_UPDATE_LIST = 3;
  private static final int METHODID_DELETE_LIST = 4;
  private static final int METHODID_ADD_LIST_MEMBER = 5;
  private static final int METHODID_REMOVE_LIST_MEMBER = 6;
  private static final int METHODID_GET_LIST_MEMBERS = 7;
  private static final int METHODID_IS_USER_IN_LIST = 8;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final ListServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(ListServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_CREATE_LIST:
          serviceImpl.createList((sonet.list.v1.ListServiceOuterClass.CreateListRequest) request,
              (io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.CreateListResponse>) responseObserver);
          break;
        case METHODID_GET_LIST:
          serviceImpl.getList((sonet.list.v1.ListServiceOuterClass.GetListRequest) request,
              (io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.GetListResponse>) responseObserver);
          break;
        case METHODID_GET_USER_LISTS:
          serviceImpl.getUserLists((sonet.list.v1.ListServiceOuterClass.GetUserListsRequest) request,
              (io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.GetUserListsResponse>) responseObserver);
          break;
        case METHODID_UPDATE_LIST:
          serviceImpl.updateList((sonet.list.v1.ListServiceOuterClass.UpdateListRequest) request,
              (io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.UpdateListResponse>) responseObserver);
          break;
        case METHODID_DELETE_LIST:
          serviceImpl.deleteList((sonet.list.v1.ListServiceOuterClass.DeleteListRequest) request,
              (io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.DeleteListResponse>) responseObserver);
          break;
        case METHODID_ADD_LIST_MEMBER:
          serviceImpl.addListMember((sonet.list.v1.ListServiceOuterClass.AddListMemberRequest) request,
              (io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.AddListMemberResponse>) responseObserver);
          break;
        case METHODID_REMOVE_LIST_MEMBER:
          serviceImpl.removeListMember((sonet.list.v1.ListServiceOuterClass.RemoveListMemberRequest) request,
              (io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.RemoveListMemberResponse>) responseObserver);
          break;
        case METHODID_GET_LIST_MEMBERS:
          serviceImpl.getListMembers((sonet.list.v1.ListServiceOuterClass.GetListMembersRequest) request,
              (io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.GetListMembersResponse>) responseObserver);
          break;
        case METHODID_IS_USER_IN_LIST:
          serviceImpl.isUserInList((sonet.list.v1.ListServiceOuterClass.IsUserInListRequest) request,
              (io.grpc.stub.StreamObserver<sonet.list.v1.ListServiceOuterClass.IsUserInListResponse>) responseObserver);
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

  private static abstract class ListServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    ListServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return sonet.list.v1.ListServiceOuterClass.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("ListService");
    }
  }

  private static final class ListServiceFileDescriptorSupplier
      extends ListServiceBaseDescriptorSupplier {
    ListServiceFileDescriptorSupplier() {}
  }

  private static final class ListServiceMethodDescriptorSupplier
      extends ListServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    ListServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (ListServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new ListServiceFileDescriptorSupplier())
              .addMethod(getCreateListMethod())
              .addMethod(getGetListMethod())
              .addMethod(getGetUserListsMethod())
              .addMethod(getUpdateListMethod())
              .addMethod(getDeleteListMethod())
              .addMethod(getAddListMemberMethod())
              .addMethod(getRemoveListMemberMethod())
              .addMethod(getGetListMembersMethod())
              .addMethod(getIsUserInListMethod())
              .build();
        }
      }
    }
    return result;
  }
}
