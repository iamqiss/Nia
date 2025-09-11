package sonet.messaging;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * Messaging service
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler",
    comments = "Source: services/messaging.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class MessagingServiceGrpc {

  private MessagingServiceGrpc() {}

  public static final String SERVICE_NAME = "sonet.messaging.MessagingService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<sonet.messaging.Messaging.SendMessageRequest,
      sonet.messaging.Messaging.SendMessageResponse> getSendMessageMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "SendMessage",
      requestType = sonet.messaging.Messaging.SendMessageRequest.class,
      responseType = sonet.messaging.Messaging.SendMessageResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.messaging.Messaging.SendMessageRequest,
      sonet.messaging.Messaging.SendMessageResponse> getSendMessageMethod() {
    io.grpc.MethodDescriptor<sonet.messaging.Messaging.SendMessageRequest, sonet.messaging.Messaging.SendMessageResponse> getSendMessageMethod;
    if ((getSendMessageMethod = MessagingServiceGrpc.getSendMessageMethod) == null) {
      synchronized (MessagingServiceGrpc.class) {
        if ((getSendMessageMethod = MessagingServiceGrpc.getSendMessageMethod) == null) {
          MessagingServiceGrpc.getSendMessageMethod = getSendMessageMethod =
              io.grpc.MethodDescriptor.<sonet.messaging.Messaging.SendMessageRequest, sonet.messaging.Messaging.SendMessageResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "SendMessage"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.SendMessageRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.SendMessageResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MessagingServiceMethodDescriptorSupplier("SendMessage"))
              .build();
        }
      }
    }
    return getSendMessageMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.messaging.Messaging.GetMessagesRequest,
      sonet.messaging.Messaging.GetMessagesResponse> getGetMessagesMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetMessages",
      requestType = sonet.messaging.Messaging.GetMessagesRequest.class,
      responseType = sonet.messaging.Messaging.GetMessagesResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.messaging.Messaging.GetMessagesRequest,
      sonet.messaging.Messaging.GetMessagesResponse> getGetMessagesMethod() {
    io.grpc.MethodDescriptor<sonet.messaging.Messaging.GetMessagesRequest, sonet.messaging.Messaging.GetMessagesResponse> getGetMessagesMethod;
    if ((getGetMessagesMethod = MessagingServiceGrpc.getGetMessagesMethod) == null) {
      synchronized (MessagingServiceGrpc.class) {
        if ((getGetMessagesMethod = MessagingServiceGrpc.getGetMessagesMethod) == null) {
          MessagingServiceGrpc.getGetMessagesMethod = getGetMessagesMethod =
              io.grpc.MethodDescriptor.<sonet.messaging.Messaging.GetMessagesRequest, sonet.messaging.Messaging.GetMessagesResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetMessages"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.GetMessagesRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.GetMessagesResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MessagingServiceMethodDescriptorSupplier("GetMessages"))
              .build();
        }
      }
    }
    return getGetMessagesMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.messaging.Messaging.UpdateMessageStatusRequest,
      sonet.messaging.Messaging.UpdateMessageStatusResponse> getUpdateMessageStatusMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UpdateMessageStatus",
      requestType = sonet.messaging.Messaging.UpdateMessageStatusRequest.class,
      responseType = sonet.messaging.Messaging.UpdateMessageStatusResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.messaging.Messaging.UpdateMessageStatusRequest,
      sonet.messaging.Messaging.UpdateMessageStatusResponse> getUpdateMessageStatusMethod() {
    io.grpc.MethodDescriptor<sonet.messaging.Messaging.UpdateMessageStatusRequest, sonet.messaging.Messaging.UpdateMessageStatusResponse> getUpdateMessageStatusMethod;
    if ((getUpdateMessageStatusMethod = MessagingServiceGrpc.getUpdateMessageStatusMethod) == null) {
      synchronized (MessagingServiceGrpc.class) {
        if ((getUpdateMessageStatusMethod = MessagingServiceGrpc.getUpdateMessageStatusMethod) == null) {
          MessagingServiceGrpc.getUpdateMessageStatusMethod = getUpdateMessageStatusMethod =
              io.grpc.MethodDescriptor.<sonet.messaging.Messaging.UpdateMessageStatusRequest, sonet.messaging.Messaging.UpdateMessageStatusResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UpdateMessageStatus"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.UpdateMessageStatusRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.UpdateMessageStatusResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MessagingServiceMethodDescriptorSupplier("UpdateMessageStatus"))
              .build();
        }
      }
    }
    return getUpdateMessageStatusMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.messaging.Messaging.SearchMessagesRequest,
      sonet.messaging.Messaging.SearchMessagesResponse> getSearchMessagesMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "SearchMessages",
      requestType = sonet.messaging.Messaging.SearchMessagesRequest.class,
      responseType = sonet.messaging.Messaging.SearchMessagesResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.messaging.Messaging.SearchMessagesRequest,
      sonet.messaging.Messaging.SearchMessagesResponse> getSearchMessagesMethod() {
    io.grpc.MethodDescriptor<sonet.messaging.Messaging.SearchMessagesRequest, sonet.messaging.Messaging.SearchMessagesResponse> getSearchMessagesMethod;
    if ((getSearchMessagesMethod = MessagingServiceGrpc.getSearchMessagesMethod) == null) {
      synchronized (MessagingServiceGrpc.class) {
        if ((getSearchMessagesMethod = MessagingServiceGrpc.getSearchMessagesMethod) == null) {
          MessagingServiceGrpc.getSearchMessagesMethod = getSearchMessagesMethod =
              io.grpc.MethodDescriptor.<sonet.messaging.Messaging.SearchMessagesRequest, sonet.messaging.Messaging.SearchMessagesResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "SearchMessages"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.SearchMessagesRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.SearchMessagesResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MessagingServiceMethodDescriptorSupplier("SearchMessages"))
              .build();
        }
      }
    }
    return getSearchMessagesMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.messaging.Messaging.CreateChatRequest,
      sonet.messaging.Messaging.CreateChatResponse> getCreateChatMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateChat",
      requestType = sonet.messaging.Messaging.CreateChatRequest.class,
      responseType = sonet.messaging.Messaging.CreateChatResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.messaging.Messaging.CreateChatRequest,
      sonet.messaging.Messaging.CreateChatResponse> getCreateChatMethod() {
    io.grpc.MethodDescriptor<sonet.messaging.Messaging.CreateChatRequest, sonet.messaging.Messaging.CreateChatResponse> getCreateChatMethod;
    if ((getCreateChatMethod = MessagingServiceGrpc.getCreateChatMethod) == null) {
      synchronized (MessagingServiceGrpc.class) {
        if ((getCreateChatMethod = MessagingServiceGrpc.getCreateChatMethod) == null) {
          MessagingServiceGrpc.getCreateChatMethod = getCreateChatMethod =
              io.grpc.MethodDescriptor.<sonet.messaging.Messaging.CreateChatRequest, sonet.messaging.Messaging.CreateChatResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateChat"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.CreateChatRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.CreateChatResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MessagingServiceMethodDescriptorSupplier("CreateChat"))
              .build();
        }
      }
    }
    return getCreateChatMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.messaging.Messaging.GetChatsRequest,
      sonet.messaging.Messaging.GetChatsResponse> getGetChatsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetChats",
      requestType = sonet.messaging.Messaging.GetChatsRequest.class,
      responseType = sonet.messaging.Messaging.GetChatsResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.messaging.Messaging.GetChatsRequest,
      sonet.messaging.Messaging.GetChatsResponse> getGetChatsMethod() {
    io.grpc.MethodDescriptor<sonet.messaging.Messaging.GetChatsRequest, sonet.messaging.Messaging.GetChatsResponse> getGetChatsMethod;
    if ((getGetChatsMethod = MessagingServiceGrpc.getGetChatsMethod) == null) {
      synchronized (MessagingServiceGrpc.class) {
        if ((getGetChatsMethod = MessagingServiceGrpc.getGetChatsMethod) == null) {
          MessagingServiceGrpc.getGetChatsMethod = getGetChatsMethod =
              io.grpc.MethodDescriptor.<sonet.messaging.Messaging.GetChatsRequest, sonet.messaging.Messaging.GetChatsResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetChats"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.GetChatsRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.GetChatsResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MessagingServiceMethodDescriptorSupplier("GetChats"))
              .build();
        }
      }
    }
    return getGetChatsMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.messaging.Messaging.UploadAttachmentRequest,
      sonet.messaging.Messaging.UploadAttachmentResponse> getUploadAttachmentMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UploadAttachment",
      requestType = sonet.messaging.Messaging.UploadAttachmentRequest.class,
      responseType = sonet.messaging.Messaging.UploadAttachmentResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.messaging.Messaging.UploadAttachmentRequest,
      sonet.messaging.Messaging.UploadAttachmentResponse> getUploadAttachmentMethod() {
    io.grpc.MethodDescriptor<sonet.messaging.Messaging.UploadAttachmentRequest, sonet.messaging.Messaging.UploadAttachmentResponse> getUploadAttachmentMethod;
    if ((getUploadAttachmentMethod = MessagingServiceGrpc.getUploadAttachmentMethod) == null) {
      synchronized (MessagingServiceGrpc.class) {
        if ((getUploadAttachmentMethod = MessagingServiceGrpc.getUploadAttachmentMethod) == null) {
          MessagingServiceGrpc.getUploadAttachmentMethod = getUploadAttachmentMethod =
              io.grpc.MethodDescriptor.<sonet.messaging.Messaging.UploadAttachmentRequest, sonet.messaging.Messaging.UploadAttachmentResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UploadAttachment"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.UploadAttachmentRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.UploadAttachmentResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MessagingServiceMethodDescriptorSupplier("UploadAttachment"))
              .build();
        }
      }
    }
    return getUploadAttachmentMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.messaging.Messaging.SetTypingRequest,
      sonet.messaging.Messaging.SetTypingResponse> getSetTypingMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "SetTyping",
      requestType = sonet.messaging.Messaging.SetTypingRequest.class,
      responseType = sonet.messaging.Messaging.SetTypingResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.messaging.Messaging.SetTypingRequest,
      sonet.messaging.Messaging.SetTypingResponse> getSetTypingMethod() {
    io.grpc.MethodDescriptor<sonet.messaging.Messaging.SetTypingRequest, sonet.messaging.Messaging.SetTypingResponse> getSetTypingMethod;
    if ((getSetTypingMethod = MessagingServiceGrpc.getSetTypingMethod) == null) {
      synchronized (MessagingServiceGrpc.class) {
        if ((getSetTypingMethod = MessagingServiceGrpc.getSetTypingMethod) == null) {
          MessagingServiceGrpc.getSetTypingMethod = getSetTypingMethod =
              io.grpc.MethodDescriptor.<sonet.messaging.Messaging.SetTypingRequest, sonet.messaging.Messaging.SetTypingResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "SetTyping"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.SetTypingRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.SetTypingResponse.getDefaultInstance()))
              .setSchemaDescriptor(new MessagingServiceMethodDescriptorSupplier("SetTyping"))
              .build();
        }
      }
    }
    return getSetTypingMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.messaging.Messaging.WebSocketMessage,
      sonet.messaging.Messaging.WebSocketMessage> getStreamMessagesMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "StreamMessages",
      requestType = sonet.messaging.Messaging.WebSocketMessage.class,
      responseType = sonet.messaging.Messaging.WebSocketMessage.class,
      methodType = io.grpc.MethodDescriptor.MethodType.BIDI_STREAMING)
  public static io.grpc.MethodDescriptor<sonet.messaging.Messaging.WebSocketMessage,
      sonet.messaging.Messaging.WebSocketMessage> getStreamMessagesMethod() {
    io.grpc.MethodDescriptor<sonet.messaging.Messaging.WebSocketMessage, sonet.messaging.Messaging.WebSocketMessage> getStreamMessagesMethod;
    if ((getStreamMessagesMethod = MessagingServiceGrpc.getStreamMessagesMethod) == null) {
      synchronized (MessagingServiceGrpc.class) {
        if ((getStreamMessagesMethod = MessagingServiceGrpc.getStreamMessagesMethod) == null) {
          MessagingServiceGrpc.getStreamMessagesMethod = getStreamMessagesMethod =
              io.grpc.MethodDescriptor.<sonet.messaging.Messaging.WebSocketMessage, sonet.messaging.Messaging.WebSocketMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.BIDI_STREAMING)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "StreamMessages"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.WebSocketMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.messaging.Messaging.WebSocketMessage.getDefaultInstance()))
              .setSchemaDescriptor(new MessagingServiceMethodDescriptorSupplier("StreamMessages"))
              .build();
        }
      }
    }
    return getStreamMessagesMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static MessagingServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MessagingServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MessagingServiceStub>() {
        @java.lang.Override
        public MessagingServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MessagingServiceStub(channel, callOptions);
        }
      };
    return MessagingServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static MessagingServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MessagingServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MessagingServiceBlockingStub>() {
        @java.lang.Override
        public MessagingServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MessagingServiceBlockingStub(channel, callOptions);
        }
      };
    return MessagingServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static MessagingServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MessagingServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MessagingServiceFutureStub>() {
        @java.lang.Override
        public MessagingServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MessagingServiceFutureStub(channel, callOptions);
        }
      };
    return MessagingServiceFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * Messaging service
   * </pre>
   */
  public static abstract class MessagingServiceImplBase implements io.grpc.BindableService {

    /**
     * <pre>
     * Message operations
     * </pre>
     */
    public void sendMessage(sonet.messaging.Messaging.SendMessageRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.SendMessageResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getSendMessageMethod(), responseObserver);
    }

    /**
     */
    public void getMessages(sonet.messaging.Messaging.GetMessagesRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.GetMessagesResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetMessagesMethod(), responseObserver);
    }

    /**
     */
    public void updateMessageStatus(sonet.messaging.Messaging.UpdateMessageStatusRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.UpdateMessageStatusResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUpdateMessageStatusMethod(), responseObserver);
    }

    /**
     */
    public void searchMessages(sonet.messaging.Messaging.SearchMessagesRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.SearchMessagesResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getSearchMessagesMethod(), responseObserver);
    }

    /**
     * <pre>
     * Chat operations
     * </pre>
     */
    public void createChat(sonet.messaging.Messaging.CreateChatRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.CreateChatResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateChatMethod(), responseObserver);
    }

    /**
     */
    public void getChats(sonet.messaging.Messaging.GetChatsRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.GetChatsResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetChatsMethod(), responseObserver);
    }

    /**
     * <pre>
     * Attachment operations
     * </pre>
     */
    public void uploadAttachment(sonet.messaging.Messaging.UploadAttachmentRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.UploadAttachmentResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUploadAttachmentMethod(), responseObserver);
    }

    /**
     * <pre>
     * Real-time operations
     * </pre>
     */
    public void setTyping(sonet.messaging.Messaging.SetTypingRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.SetTypingResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getSetTypingMethod(), responseObserver);
    }

    /**
     * <pre>
     * Streaming endpoints
     * </pre>
     */
    public io.grpc.stub.StreamObserver<sonet.messaging.Messaging.WebSocketMessage> streamMessages(
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.WebSocketMessage> responseObserver) {
      return io.grpc.stub.ServerCalls.asyncUnimplementedStreamingCall(getStreamMessagesMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getSendMessageMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.messaging.Messaging.SendMessageRequest,
                sonet.messaging.Messaging.SendMessageResponse>(
                  this, METHODID_SEND_MESSAGE)))
          .addMethod(
            getGetMessagesMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.messaging.Messaging.GetMessagesRequest,
                sonet.messaging.Messaging.GetMessagesResponse>(
                  this, METHODID_GET_MESSAGES)))
          .addMethod(
            getUpdateMessageStatusMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.messaging.Messaging.UpdateMessageStatusRequest,
                sonet.messaging.Messaging.UpdateMessageStatusResponse>(
                  this, METHODID_UPDATE_MESSAGE_STATUS)))
          .addMethod(
            getSearchMessagesMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.messaging.Messaging.SearchMessagesRequest,
                sonet.messaging.Messaging.SearchMessagesResponse>(
                  this, METHODID_SEARCH_MESSAGES)))
          .addMethod(
            getCreateChatMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.messaging.Messaging.CreateChatRequest,
                sonet.messaging.Messaging.CreateChatResponse>(
                  this, METHODID_CREATE_CHAT)))
          .addMethod(
            getGetChatsMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.messaging.Messaging.GetChatsRequest,
                sonet.messaging.Messaging.GetChatsResponse>(
                  this, METHODID_GET_CHATS)))
          .addMethod(
            getUploadAttachmentMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.messaging.Messaging.UploadAttachmentRequest,
                sonet.messaging.Messaging.UploadAttachmentResponse>(
                  this, METHODID_UPLOAD_ATTACHMENT)))
          .addMethod(
            getSetTypingMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.messaging.Messaging.SetTypingRequest,
                sonet.messaging.Messaging.SetTypingResponse>(
                  this, METHODID_SET_TYPING)))
          .addMethod(
            getStreamMessagesMethod(),
            io.grpc.stub.ServerCalls.asyncBidiStreamingCall(
              new MethodHandlers<
                sonet.messaging.Messaging.WebSocketMessage,
                sonet.messaging.Messaging.WebSocketMessage>(
                  this, METHODID_STREAM_MESSAGES)))
          .build();
    }
  }

  /**
   * <pre>
   * Messaging service
   * </pre>
   */
  public static final class MessagingServiceStub extends io.grpc.stub.AbstractAsyncStub<MessagingServiceStub> {
    private MessagingServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MessagingServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MessagingServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * Message operations
     * </pre>
     */
    public void sendMessage(sonet.messaging.Messaging.SendMessageRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.SendMessageResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getSendMessageMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void getMessages(sonet.messaging.Messaging.GetMessagesRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.GetMessagesResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetMessagesMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void updateMessageStatus(sonet.messaging.Messaging.UpdateMessageStatusRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.UpdateMessageStatusResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpdateMessageStatusMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void searchMessages(sonet.messaging.Messaging.SearchMessagesRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.SearchMessagesResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getSearchMessagesMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Chat operations
     * </pre>
     */
    public void createChat(sonet.messaging.Messaging.CreateChatRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.CreateChatResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateChatMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void getChats(sonet.messaging.Messaging.GetChatsRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.GetChatsResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetChatsMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Attachment operations
     * </pre>
     */
    public void uploadAttachment(sonet.messaging.Messaging.UploadAttachmentRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.UploadAttachmentResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUploadAttachmentMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Real-time operations
     * </pre>
     */
    public void setTyping(sonet.messaging.Messaging.SetTypingRequest request,
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.SetTypingResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getSetTypingMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Streaming endpoints
     * </pre>
     */
    public io.grpc.stub.StreamObserver<sonet.messaging.Messaging.WebSocketMessage> streamMessages(
        io.grpc.stub.StreamObserver<sonet.messaging.Messaging.WebSocketMessage> responseObserver) {
      return io.grpc.stub.ClientCalls.asyncBidiStreamingCall(
          getChannel().newCall(getStreamMessagesMethod(), getCallOptions()), responseObserver);
    }
  }

  /**
   * <pre>
   * Messaging service
   * </pre>
   */
  public static final class MessagingServiceBlockingStub extends io.grpc.stub.AbstractBlockingStub<MessagingServiceBlockingStub> {
    private MessagingServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MessagingServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MessagingServiceBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * Message operations
     * </pre>
     */
    public sonet.messaging.Messaging.SendMessageResponse sendMessage(sonet.messaging.Messaging.SendMessageRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getSendMessageMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.messaging.Messaging.GetMessagesResponse getMessages(sonet.messaging.Messaging.GetMessagesRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetMessagesMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.messaging.Messaging.UpdateMessageStatusResponse updateMessageStatus(sonet.messaging.Messaging.UpdateMessageStatusRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpdateMessageStatusMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.messaging.Messaging.SearchMessagesResponse searchMessages(sonet.messaging.Messaging.SearchMessagesRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getSearchMessagesMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Chat operations
     * </pre>
     */
    public sonet.messaging.Messaging.CreateChatResponse createChat(sonet.messaging.Messaging.CreateChatRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateChatMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.messaging.Messaging.GetChatsResponse getChats(sonet.messaging.Messaging.GetChatsRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetChatsMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Attachment operations
     * </pre>
     */
    public sonet.messaging.Messaging.UploadAttachmentResponse uploadAttachment(sonet.messaging.Messaging.UploadAttachmentRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUploadAttachmentMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Real-time operations
     * </pre>
     */
    public sonet.messaging.Messaging.SetTypingResponse setTyping(sonet.messaging.Messaging.SetTypingRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getSetTypingMethod(), getCallOptions(), request);
    }
  }

  /**
   * <pre>
   * Messaging service
   * </pre>
   */
  public static final class MessagingServiceFutureStub extends io.grpc.stub.AbstractFutureStub<MessagingServiceFutureStub> {
    private MessagingServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MessagingServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MessagingServiceFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * Message operations
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.messaging.Messaging.SendMessageResponse> sendMessage(
        sonet.messaging.Messaging.SendMessageRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getSendMessageMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.messaging.Messaging.GetMessagesResponse> getMessages(
        sonet.messaging.Messaging.GetMessagesRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetMessagesMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.messaging.Messaging.UpdateMessageStatusResponse> updateMessageStatus(
        sonet.messaging.Messaging.UpdateMessageStatusRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpdateMessageStatusMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.messaging.Messaging.SearchMessagesResponse> searchMessages(
        sonet.messaging.Messaging.SearchMessagesRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getSearchMessagesMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Chat operations
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.messaging.Messaging.CreateChatResponse> createChat(
        sonet.messaging.Messaging.CreateChatRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateChatMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.messaging.Messaging.GetChatsResponse> getChats(
        sonet.messaging.Messaging.GetChatsRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetChatsMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Attachment operations
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.messaging.Messaging.UploadAttachmentResponse> uploadAttachment(
        sonet.messaging.Messaging.UploadAttachmentRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUploadAttachmentMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Real-time operations
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.messaging.Messaging.SetTypingResponse> setTyping(
        sonet.messaging.Messaging.SetTypingRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getSetTypingMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_SEND_MESSAGE = 0;
  private static final int METHODID_GET_MESSAGES = 1;
  private static final int METHODID_UPDATE_MESSAGE_STATUS = 2;
  private static final int METHODID_SEARCH_MESSAGES = 3;
  private static final int METHODID_CREATE_CHAT = 4;
  private static final int METHODID_GET_CHATS = 5;
  private static final int METHODID_UPLOAD_ATTACHMENT = 6;
  private static final int METHODID_SET_TYPING = 7;
  private static final int METHODID_STREAM_MESSAGES = 8;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final MessagingServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(MessagingServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_SEND_MESSAGE:
          serviceImpl.sendMessage((sonet.messaging.Messaging.SendMessageRequest) request,
              (io.grpc.stub.StreamObserver<sonet.messaging.Messaging.SendMessageResponse>) responseObserver);
          break;
        case METHODID_GET_MESSAGES:
          serviceImpl.getMessages((sonet.messaging.Messaging.GetMessagesRequest) request,
              (io.grpc.stub.StreamObserver<sonet.messaging.Messaging.GetMessagesResponse>) responseObserver);
          break;
        case METHODID_UPDATE_MESSAGE_STATUS:
          serviceImpl.updateMessageStatus((sonet.messaging.Messaging.UpdateMessageStatusRequest) request,
              (io.grpc.stub.StreamObserver<sonet.messaging.Messaging.UpdateMessageStatusResponse>) responseObserver);
          break;
        case METHODID_SEARCH_MESSAGES:
          serviceImpl.searchMessages((sonet.messaging.Messaging.SearchMessagesRequest) request,
              (io.grpc.stub.StreamObserver<sonet.messaging.Messaging.SearchMessagesResponse>) responseObserver);
          break;
        case METHODID_CREATE_CHAT:
          serviceImpl.createChat((sonet.messaging.Messaging.CreateChatRequest) request,
              (io.grpc.stub.StreamObserver<sonet.messaging.Messaging.CreateChatResponse>) responseObserver);
          break;
        case METHODID_GET_CHATS:
          serviceImpl.getChats((sonet.messaging.Messaging.GetChatsRequest) request,
              (io.grpc.stub.StreamObserver<sonet.messaging.Messaging.GetChatsResponse>) responseObserver);
          break;
        case METHODID_UPLOAD_ATTACHMENT:
          serviceImpl.uploadAttachment((sonet.messaging.Messaging.UploadAttachmentRequest) request,
              (io.grpc.stub.StreamObserver<sonet.messaging.Messaging.UploadAttachmentResponse>) responseObserver);
          break;
        case METHODID_SET_TYPING:
          serviceImpl.setTyping((sonet.messaging.Messaging.SetTypingRequest) request,
              (io.grpc.stub.StreamObserver<sonet.messaging.Messaging.SetTypingResponse>) responseObserver);
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
        case METHODID_STREAM_MESSAGES:
          return (io.grpc.stub.StreamObserver<Req>) serviceImpl.streamMessages(
              (io.grpc.stub.StreamObserver<sonet.messaging.Messaging.WebSocketMessage>) responseObserver);
        default:
          throw new AssertionError();
      }
    }
  }

  private static abstract class MessagingServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    MessagingServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return sonet.messaging.Messaging.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("MessagingService");
    }
  }

  private static final class MessagingServiceFileDescriptorSupplier
      extends MessagingServiceBaseDescriptorSupplier {
    MessagingServiceFileDescriptorSupplier() {}
  }

  private static final class MessagingServiceMethodDescriptorSupplier
      extends MessagingServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    MessagingServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (MessagingServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new MessagingServiceFileDescriptorSupplier())
              .addMethod(getSendMessageMethod())
              .addMethod(getGetMessagesMethod())
              .addMethod(getUpdateMessageStatusMethod())
              .addMethod(getSearchMessagesMethod())
              .addMethod(getCreateChatMethod())
              .addMethod(getGetChatsMethod())
              .addMethod(getUploadAttachmentMethod())
              .addMethod(getSetTypingMethod())
              .addMethod(getStreamMessagesMethod())
              .build();
        }
      }
    }
    return result;
  }
}
