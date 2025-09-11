package sonet.user;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * User Service definition
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler",
    comments = "Source: services/user.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class UserServiceGrpc {

  private UserServiceGrpc() {}

  public static final String SERVICE_NAME = "sonet.user.UserService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<sonet.user.User.RegisterUserRequest,
      sonet.user.User.RegisterUserResponse> getRegisterUserMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "RegisterUser",
      requestType = sonet.user.User.RegisterUserRequest.class,
      responseType = sonet.user.User.RegisterUserResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.RegisterUserRequest,
      sonet.user.User.RegisterUserResponse> getRegisterUserMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.RegisterUserRequest, sonet.user.User.RegisterUserResponse> getRegisterUserMethod;
    if ((getRegisterUserMethod = UserServiceGrpc.getRegisterUserMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getRegisterUserMethod = UserServiceGrpc.getRegisterUserMethod) == null) {
          UserServiceGrpc.getRegisterUserMethod = getRegisterUserMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.RegisterUserRequest, sonet.user.User.RegisterUserResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "RegisterUser"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.RegisterUserRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.RegisterUserResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("RegisterUser"))
              .build();
        }
      }
    }
    return getRegisterUserMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.LoginUserRequest,
      sonet.user.User.LoginUserResponse> getLoginUserMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "LoginUser",
      requestType = sonet.user.User.LoginUserRequest.class,
      responseType = sonet.user.User.LoginUserResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.LoginUserRequest,
      sonet.user.User.LoginUserResponse> getLoginUserMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.LoginUserRequest, sonet.user.User.LoginUserResponse> getLoginUserMethod;
    if ((getLoginUserMethod = UserServiceGrpc.getLoginUserMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getLoginUserMethod = UserServiceGrpc.getLoginUserMethod) == null) {
          UserServiceGrpc.getLoginUserMethod = getLoginUserMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.LoginUserRequest, sonet.user.User.LoginUserResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "LoginUser"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.LoginUserRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.LoginUserResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("LoginUser"))
              .build();
        }
      }
    }
    return getLoginUserMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.LogoutRequest,
      sonet.user.User.LogoutResponse> getLogoutUserMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "LogoutUser",
      requestType = sonet.user.User.LogoutRequest.class,
      responseType = sonet.user.User.LogoutResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.LogoutRequest,
      sonet.user.User.LogoutResponse> getLogoutUserMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.LogoutRequest, sonet.user.User.LogoutResponse> getLogoutUserMethod;
    if ((getLogoutUserMethod = UserServiceGrpc.getLogoutUserMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getLogoutUserMethod = UserServiceGrpc.getLogoutUserMethod) == null) {
          UserServiceGrpc.getLogoutUserMethod = getLogoutUserMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.LogoutRequest, sonet.user.User.LogoutResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "LogoutUser"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.LogoutRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.LogoutResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("LogoutUser"))
              .build();
        }
      }
    }
    return getLogoutUserMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.VerifyTokenRequest,
      sonet.user.User.VerifyTokenResponse> getVerifyTokenMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "VerifyToken",
      requestType = sonet.user.User.VerifyTokenRequest.class,
      responseType = sonet.user.User.VerifyTokenResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.VerifyTokenRequest,
      sonet.user.User.VerifyTokenResponse> getVerifyTokenMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.VerifyTokenRequest, sonet.user.User.VerifyTokenResponse> getVerifyTokenMethod;
    if ((getVerifyTokenMethod = UserServiceGrpc.getVerifyTokenMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getVerifyTokenMethod = UserServiceGrpc.getVerifyTokenMethod) == null) {
          UserServiceGrpc.getVerifyTokenMethod = getVerifyTokenMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.VerifyTokenRequest, sonet.user.User.VerifyTokenResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "VerifyToken"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.VerifyTokenRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.VerifyTokenResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("VerifyToken"))
              .build();
        }
      }
    }
    return getVerifyTokenMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.RefreshTokenRequest,
      sonet.user.User.RefreshTokenResponse> getRefreshTokenMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "RefreshToken",
      requestType = sonet.user.User.RefreshTokenRequest.class,
      responseType = sonet.user.User.RefreshTokenResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.RefreshTokenRequest,
      sonet.user.User.RefreshTokenResponse> getRefreshTokenMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.RefreshTokenRequest, sonet.user.User.RefreshTokenResponse> getRefreshTokenMethod;
    if ((getRefreshTokenMethod = UserServiceGrpc.getRefreshTokenMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getRefreshTokenMethod = UserServiceGrpc.getRefreshTokenMethod) == null) {
          UserServiceGrpc.getRefreshTokenMethod = getRefreshTokenMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.RefreshTokenRequest, sonet.user.User.RefreshTokenResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "RefreshToken"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.RefreshTokenRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.RefreshTokenResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("RefreshToken"))
              .build();
        }
      }
    }
    return getRefreshTokenMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.ChangePasswordRequest,
      sonet.user.User.ChangePasswordResponse> getChangePasswordMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "ChangePassword",
      requestType = sonet.user.User.ChangePasswordRequest.class,
      responseType = sonet.user.User.ChangePasswordResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.ChangePasswordRequest,
      sonet.user.User.ChangePasswordResponse> getChangePasswordMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.ChangePasswordRequest, sonet.user.User.ChangePasswordResponse> getChangePasswordMethod;
    if ((getChangePasswordMethod = UserServiceGrpc.getChangePasswordMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getChangePasswordMethod = UserServiceGrpc.getChangePasswordMethod) == null) {
          UserServiceGrpc.getChangePasswordMethod = getChangePasswordMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.ChangePasswordRequest, sonet.user.User.ChangePasswordResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "ChangePassword"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.ChangePasswordRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.ChangePasswordResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("ChangePassword"))
              .build();
        }
      }
    }
    return getChangePasswordMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.ResetPasswordRequest,
      sonet.user.User.ResetPasswordResponse> getResetPasswordMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "ResetPassword",
      requestType = sonet.user.User.ResetPasswordRequest.class,
      responseType = sonet.user.User.ResetPasswordResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.ResetPasswordRequest,
      sonet.user.User.ResetPasswordResponse> getResetPasswordMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.ResetPasswordRequest, sonet.user.User.ResetPasswordResponse> getResetPasswordMethod;
    if ((getResetPasswordMethod = UserServiceGrpc.getResetPasswordMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getResetPasswordMethod = UserServiceGrpc.getResetPasswordMethod) == null) {
          UserServiceGrpc.getResetPasswordMethod = getResetPasswordMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.ResetPasswordRequest, sonet.user.User.ResetPasswordResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "ResetPassword"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.ResetPasswordRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.ResetPasswordResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("ResetPassword"))
              .build();
        }
      }
    }
    return getResetPasswordMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.ConfirmPasswordResetRequest,
      sonet.user.User.ConfirmPasswordResetResponse> getConfirmPasswordResetMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "ConfirmPasswordReset",
      requestType = sonet.user.User.ConfirmPasswordResetRequest.class,
      responseType = sonet.user.User.ConfirmPasswordResetResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.ConfirmPasswordResetRequest,
      sonet.user.User.ConfirmPasswordResetResponse> getConfirmPasswordResetMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.ConfirmPasswordResetRequest, sonet.user.User.ConfirmPasswordResetResponse> getConfirmPasswordResetMethod;
    if ((getConfirmPasswordResetMethod = UserServiceGrpc.getConfirmPasswordResetMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getConfirmPasswordResetMethod = UserServiceGrpc.getConfirmPasswordResetMethod) == null) {
          UserServiceGrpc.getConfirmPasswordResetMethod = getConfirmPasswordResetMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.ConfirmPasswordResetRequest, sonet.user.User.ConfirmPasswordResetResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "ConfirmPasswordReset"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.ConfirmPasswordResetRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.ConfirmPasswordResetResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("ConfirmPasswordReset"))
              .build();
        }
      }
    }
    return getConfirmPasswordResetMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.VerifyEmailRequest,
      sonet.user.User.VerifyEmailResponse> getVerifyEmailMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "VerifyEmail",
      requestType = sonet.user.User.VerifyEmailRequest.class,
      responseType = sonet.user.User.VerifyEmailResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.VerifyEmailRequest,
      sonet.user.User.VerifyEmailResponse> getVerifyEmailMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.VerifyEmailRequest, sonet.user.User.VerifyEmailResponse> getVerifyEmailMethod;
    if ((getVerifyEmailMethod = UserServiceGrpc.getVerifyEmailMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getVerifyEmailMethod = UserServiceGrpc.getVerifyEmailMethod) == null) {
          UserServiceGrpc.getVerifyEmailMethod = getVerifyEmailMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.VerifyEmailRequest, sonet.user.User.VerifyEmailResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "VerifyEmail"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.VerifyEmailRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.VerifyEmailResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("VerifyEmail"))
              .build();
        }
      }
    }
    return getVerifyEmailMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.ResendVerificationRequest,
      sonet.user.User.ResendVerificationResponse> getResendVerificationMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "ResendVerification",
      requestType = sonet.user.User.ResendVerificationRequest.class,
      responseType = sonet.user.User.ResendVerificationResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.ResendVerificationRequest,
      sonet.user.User.ResendVerificationResponse> getResendVerificationMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.ResendVerificationRequest, sonet.user.User.ResendVerificationResponse> getResendVerificationMethod;
    if ((getResendVerificationMethod = UserServiceGrpc.getResendVerificationMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getResendVerificationMethod = UserServiceGrpc.getResendVerificationMethod) == null) {
          UserServiceGrpc.getResendVerificationMethod = getResendVerificationMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.ResendVerificationRequest, sonet.user.User.ResendVerificationResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "ResendVerification"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.ResendVerificationRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.ResendVerificationResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("ResendVerification"))
              .build();
        }
      }
    }
    return getResendVerificationMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.SetupTwoFactorRequest,
      sonet.user.User.SetupTwoFactorResponse> getSetupTwoFactorMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "SetupTwoFactor",
      requestType = sonet.user.User.SetupTwoFactorRequest.class,
      responseType = sonet.user.User.SetupTwoFactorResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.SetupTwoFactorRequest,
      sonet.user.User.SetupTwoFactorResponse> getSetupTwoFactorMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.SetupTwoFactorRequest, sonet.user.User.SetupTwoFactorResponse> getSetupTwoFactorMethod;
    if ((getSetupTwoFactorMethod = UserServiceGrpc.getSetupTwoFactorMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getSetupTwoFactorMethod = UserServiceGrpc.getSetupTwoFactorMethod) == null) {
          UserServiceGrpc.getSetupTwoFactorMethod = getSetupTwoFactorMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.SetupTwoFactorRequest, sonet.user.User.SetupTwoFactorResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "SetupTwoFactor"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.SetupTwoFactorRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.SetupTwoFactorResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("SetupTwoFactor"))
              .build();
        }
      }
    }
    return getSetupTwoFactorMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.VerifyTwoFactorRequest,
      sonet.user.User.VerifyTwoFactorResponse> getVerifyTwoFactorMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "VerifyTwoFactor",
      requestType = sonet.user.User.VerifyTwoFactorRequest.class,
      responseType = sonet.user.User.VerifyTwoFactorResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.VerifyTwoFactorRequest,
      sonet.user.User.VerifyTwoFactorResponse> getVerifyTwoFactorMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.VerifyTwoFactorRequest, sonet.user.User.VerifyTwoFactorResponse> getVerifyTwoFactorMethod;
    if ((getVerifyTwoFactorMethod = UserServiceGrpc.getVerifyTwoFactorMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getVerifyTwoFactorMethod = UserServiceGrpc.getVerifyTwoFactorMethod) == null) {
          UserServiceGrpc.getVerifyTwoFactorMethod = getVerifyTwoFactorMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.VerifyTwoFactorRequest, sonet.user.User.VerifyTwoFactorResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "VerifyTwoFactor"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.VerifyTwoFactorRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.VerifyTwoFactorResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("VerifyTwoFactor"))
              .build();
        }
      }
    }
    return getVerifyTwoFactorMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.DisableTwoFactorRequest,
      sonet.user.User.DisableTwoFactorResponse> getDisableTwoFactorMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "DisableTwoFactor",
      requestType = sonet.user.User.DisableTwoFactorRequest.class,
      responseType = sonet.user.User.DisableTwoFactorResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.DisableTwoFactorRequest,
      sonet.user.User.DisableTwoFactorResponse> getDisableTwoFactorMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.DisableTwoFactorRequest, sonet.user.User.DisableTwoFactorResponse> getDisableTwoFactorMethod;
    if ((getDisableTwoFactorMethod = UserServiceGrpc.getDisableTwoFactorMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getDisableTwoFactorMethod = UserServiceGrpc.getDisableTwoFactorMethod) == null) {
          UserServiceGrpc.getDisableTwoFactorMethod = getDisableTwoFactorMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.DisableTwoFactorRequest, sonet.user.User.DisableTwoFactorResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "DisableTwoFactor"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.DisableTwoFactorRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.DisableTwoFactorResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("DisableTwoFactor"))
              .build();
        }
      }
    }
    return getDisableTwoFactorMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.GetActiveSessionsRequest,
      sonet.user.User.GetActiveSessionsResponse> getGetActiveSessionsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetActiveSessions",
      requestType = sonet.user.User.GetActiveSessionsRequest.class,
      responseType = sonet.user.User.GetActiveSessionsResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.GetActiveSessionsRequest,
      sonet.user.User.GetActiveSessionsResponse> getGetActiveSessionsMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.GetActiveSessionsRequest, sonet.user.User.GetActiveSessionsResponse> getGetActiveSessionsMethod;
    if ((getGetActiveSessionsMethod = UserServiceGrpc.getGetActiveSessionsMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getGetActiveSessionsMethod = UserServiceGrpc.getGetActiveSessionsMethod) == null) {
          UserServiceGrpc.getGetActiveSessionsMethod = getGetActiveSessionsMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.GetActiveSessionsRequest, sonet.user.User.GetActiveSessionsResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetActiveSessions"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.GetActiveSessionsRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.GetActiveSessionsResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("GetActiveSessions"))
              .build();
        }
      }
    }
    return getGetActiveSessionsMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.TerminateSessionRequest,
      sonet.user.User.TerminateSessionResponse> getTerminateSessionMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "TerminateSession",
      requestType = sonet.user.User.TerminateSessionRequest.class,
      responseType = sonet.user.User.TerminateSessionResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.TerminateSessionRequest,
      sonet.user.User.TerminateSessionResponse> getTerminateSessionMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.TerminateSessionRequest, sonet.user.User.TerminateSessionResponse> getTerminateSessionMethod;
    if ((getTerminateSessionMethod = UserServiceGrpc.getTerminateSessionMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getTerminateSessionMethod = UserServiceGrpc.getTerminateSessionMethod) == null) {
          UserServiceGrpc.getTerminateSessionMethod = getTerminateSessionMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.TerminateSessionRequest, sonet.user.User.TerminateSessionResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "TerminateSession"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.TerminateSessionRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.TerminateSessionResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("TerminateSession"))
              .build();
        }
      }
    }
    return getTerminateSessionMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.GetUserProfileRequest,
      sonet.user.User.GetUserProfileResponse> getGetUserProfileMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetUserProfile",
      requestType = sonet.user.User.GetUserProfileRequest.class,
      responseType = sonet.user.User.GetUserProfileResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.GetUserProfileRequest,
      sonet.user.User.GetUserProfileResponse> getGetUserProfileMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.GetUserProfileRequest, sonet.user.User.GetUserProfileResponse> getGetUserProfileMethod;
    if ((getGetUserProfileMethod = UserServiceGrpc.getGetUserProfileMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getGetUserProfileMethod = UserServiceGrpc.getGetUserProfileMethod) == null) {
          UserServiceGrpc.getGetUserProfileMethod = getGetUserProfileMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.GetUserProfileRequest, sonet.user.User.GetUserProfileResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetUserProfile"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.GetUserProfileRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.GetUserProfileResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("GetUserProfile"))
              .build();
        }
      }
    }
    return getGetUserProfileMethod;
  }

  private static volatile io.grpc.MethodDescriptor<sonet.user.User.UpdateUserProfileRequest,
      sonet.user.User.UpdateUserProfileResponse> getUpdateUserProfileMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UpdateUserProfile",
      requestType = sonet.user.User.UpdateUserProfileRequest.class,
      responseType = sonet.user.User.UpdateUserProfileResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<sonet.user.User.UpdateUserProfileRequest,
      sonet.user.User.UpdateUserProfileResponse> getUpdateUserProfileMethod() {
    io.grpc.MethodDescriptor<sonet.user.User.UpdateUserProfileRequest, sonet.user.User.UpdateUserProfileResponse> getUpdateUserProfileMethod;
    if ((getUpdateUserProfileMethod = UserServiceGrpc.getUpdateUserProfileMethod) == null) {
      synchronized (UserServiceGrpc.class) {
        if ((getUpdateUserProfileMethod = UserServiceGrpc.getUpdateUserProfileMethod) == null) {
          UserServiceGrpc.getUpdateUserProfileMethod = getUpdateUserProfileMethod =
              io.grpc.MethodDescriptor.<sonet.user.User.UpdateUserProfileRequest, sonet.user.User.UpdateUserProfileResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UpdateUserProfile"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.UpdateUserProfileRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  sonet.user.User.UpdateUserProfileResponse.getDefaultInstance()))
              .setSchemaDescriptor(new UserServiceMethodDescriptorSupplier("UpdateUserProfile"))
              .build();
        }
      }
    }
    return getUpdateUserProfileMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static UserServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<UserServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<UserServiceStub>() {
        @java.lang.Override
        public UserServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new UserServiceStub(channel, callOptions);
        }
      };
    return UserServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static UserServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<UserServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<UserServiceBlockingStub>() {
        @java.lang.Override
        public UserServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new UserServiceBlockingStub(channel, callOptions);
        }
      };
    return UserServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static UserServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<UserServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<UserServiceFutureStub>() {
        @java.lang.Override
        public UserServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new UserServiceFutureStub(channel, callOptions);
        }
      };
    return UserServiceFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * User Service definition
   * </pre>
   */
  public static abstract class UserServiceImplBase implements io.grpc.BindableService {

    /**
     * <pre>
     * Authentication operations
     * </pre>
     */
    public void registerUser(sonet.user.User.RegisterUserRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.RegisterUserResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getRegisterUserMethod(), responseObserver);
    }

    /**
     */
    public void loginUser(sonet.user.User.LoginUserRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.LoginUserResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getLoginUserMethod(), responseObserver);
    }

    /**
     */
    public void logoutUser(sonet.user.User.LogoutRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.LogoutResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getLogoutUserMethod(), responseObserver);
    }

    /**
     */
    public void verifyToken(sonet.user.User.VerifyTokenRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.VerifyTokenResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getVerifyTokenMethod(), responseObserver);
    }

    /**
     */
    public void refreshToken(sonet.user.User.RefreshTokenRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.RefreshTokenResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getRefreshTokenMethod(), responseObserver);
    }

    /**
     * <pre>
     * Password management
     * </pre>
     */
    public void changePassword(sonet.user.User.ChangePasswordRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.ChangePasswordResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getChangePasswordMethod(), responseObserver);
    }

    /**
     */
    public void resetPassword(sonet.user.User.ResetPasswordRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.ResetPasswordResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getResetPasswordMethod(), responseObserver);
    }

    /**
     */
    public void confirmPasswordReset(sonet.user.User.ConfirmPasswordResetRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.ConfirmPasswordResetResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getConfirmPasswordResetMethod(), responseObserver);
    }

    /**
     * <pre>
     * Email verification
     * </pre>
     */
    public void verifyEmail(sonet.user.User.VerifyEmailRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.VerifyEmailResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getVerifyEmailMethod(), responseObserver);
    }

    /**
     */
    public void resendVerification(sonet.user.User.ResendVerificationRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.ResendVerificationResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getResendVerificationMethod(), responseObserver);
    }

    /**
     * <pre>
     * Two-factor authentication
     * </pre>
     */
    public void setupTwoFactor(sonet.user.User.SetupTwoFactorRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.SetupTwoFactorResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getSetupTwoFactorMethod(), responseObserver);
    }

    /**
     */
    public void verifyTwoFactor(sonet.user.User.VerifyTwoFactorRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.VerifyTwoFactorResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getVerifyTwoFactorMethod(), responseObserver);
    }

    /**
     */
    public void disableTwoFactor(sonet.user.User.DisableTwoFactorRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.DisableTwoFactorResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getDisableTwoFactorMethod(), responseObserver);
    }

    /**
     * <pre>
     * Session management
     * </pre>
     */
    public void getActiveSessions(sonet.user.User.GetActiveSessionsRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.GetActiveSessionsResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetActiveSessionsMethod(), responseObserver);
    }

    /**
     */
    public void terminateSession(sonet.user.User.TerminateSessionRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.TerminateSessionResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getTerminateSessionMethod(), responseObserver);
    }

    /**
     * <pre>
     * Profile management
     * </pre>
     */
    public void getUserProfile(sonet.user.User.GetUserProfileRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.GetUserProfileResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetUserProfileMethod(), responseObserver);
    }

    /**
     */
    public void updateUserProfile(sonet.user.User.UpdateUserProfileRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.UpdateUserProfileResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUpdateUserProfileMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getRegisterUserMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.RegisterUserRequest,
                sonet.user.User.RegisterUserResponse>(
                  this, METHODID_REGISTER_USER)))
          .addMethod(
            getLoginUserMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.LoginUserRequest,
                sonet.user.User.LoginUserResponse>(
                  this, METHODID_LOGIN_USER)))
          .addMethod(
            getLogoutUserMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.LogoutRequest,
                sonet.user.User.LogoutResponse>(
                  this, METHODID_LOGOUT_USER)))
          .addMethod(
            getVerifyTokenMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.VerifyTokenRequest,
                sonet.user.User.VerifyTokenResponse>(
                  this, METHODID_VERIFY_TOKEN)))
          .addMethod(
            getRefreshTokenMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.RefreshTokenRequest,
                sonet.user.User.RefreshTokenResponse>(
                  this, METHODID_REFRESH_TOKEN)))
          .addMethod(
            getChangePasswordMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.ChangePasswordRequest,
                sonet.user.User.ChangePasswordResponse>(
                  this, METHODID_CHANGE_PASSWORD)))
          .addMethod(
            getResetPasswordMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.ResetPasswordRequest,
                sonet.user.User.ResetPasswordResponse>(
                  this, METHODID_RESET_PASSWORD)))
          .addMethod(
            getConfirmPasswordResetMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.ConfirmPasswordResetRequest,
                sonet.user.User.ConfirmPasswordResetResponse>(
                  this, METHODID_CONFIRM_PASSWORD_RESET)))
          .addMethod(
            getVerifyEmailMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.VerifyEmailRequest,
                sonet.user.User.VerifyEmailResponse>(
                  this, METHODID_VERIFY_EMAIL)))
          .addMethod(
            getResendVerificationMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.ResendVerificationRequest,
                sonet.user.User.ResendVerificationResponse>(
                  this, METHODID_RESEND_VERIFICATION)))
          .addMethod(
            getSetupTwoFactorMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.SetupTwoFactorRequest,
                sonet.user.User.SetupTwoFactorResponse>(
                  this, METHODID_SETUP_TWO_FACTOR)))
          .addMethod(
            getVerifyTwoFactorMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.VerifyTwoFactorRequest,
                sonet.user.User.VerifyTwoFactorResponse>(
                  this, METHODID_VERIFY_TWO_FACTOR)))
          .addMethod(
            getDisableTwoFactorMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.DisableTwoFactorRequest,
                sonet.user.User.DisableTwoFactorResponse>(
                  this, METHODID_DISABLE_TWO_FACTOR)))
          .addMethod(
            getGetActiveSessionsMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.GetActiveSessionsRequest,
                sonet.user.User.GetActiveSessionsResponse>(
                  this, METHODID_GET_ACTIVE_SESSIONS)))
          .addMethod(
            getTerminateSessionMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.TerminateSessionRequest,
                sonet.user.User.TerminateSessionResponse>(
                  this, METHODID_TERMINATE_SESSION)))
          .addMethod(
            getGetUserProfileMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.GetUserProfileRequest,
                sonet.user.User.GetUserProfileResponse>(
                  this, METHODID_GET_USER_PROFILE)))
          .addMethod(
            getUpdateUserProfileMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                sonet.user.User.UpdateUserProfileRequest,
                sonet.user.User.UpdateUserProfileResponse>(
                  this, METHODID_UPDATE_USER_PROFILE)))
          .build();
    }
  }

  /**
   * <pre>
   * User Service definition
   * </pre>
   */
  public static final class UserServiceStub extends io.grpc.stub.AbstractAsyncStub<UserServiceStub> {
    private UserServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected UserServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new UserServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * Authentication operations
     * </pre>
     */
    public void registerUser(sonet.user.User.RegisterUserRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.RegisterUserResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getRegisterUserMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void loginUser(sonet.user.User.LoginUserRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.LoginUserResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getLoginUserMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void logoutUser(sonet.user.User.LogoutRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.LogoutResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getLogoutUserMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void verifyToken(sonet.user.User.VerifyTokenRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.VerifyTokenResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getVerifyTokenMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void refreshToken(sonet.user.User.RefreshTokenRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.RefreshTokenResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getRefreshTokenMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Password management
     * </pre>
     */
    public void changePassword(sonet.user.User.ChangePasswordRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.ChangePasswordResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getChangePasswordMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void resetPassword(sonet.user.User.ResetPasswordRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.ResetPasswordResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getResetPasswordMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void confirmPasswordReset(sonet.user.User.ConfirmPasswordResetRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.ConfirmPasswordResetResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getConfirmPasswordResetMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Email verification
     * </pre>
     */
    public void verifyEmail(sonet.user.User.VerifyEmailRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.VerifyEmailResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getVerifyEmailMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void resendVerification(sonet.user.User.ResendVerificationRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.ResendVerificationResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getResendVerificationMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Two-factor authentication
     * </pre>
     */
    public void setupTwoFactor(sonet.user.User.SetupTwoFactorRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.SetupTwoFactorResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getSetupTwoFactorMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void verifyTwoFactor(sonet.user.User.VerifyTwoFactorRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.VerifyTwoFactorResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getVerifyTwoFactorMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void disableTwoFactor(sonet.user.User.DisableTwoFactorRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.DisableTwoFactorResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getDisableTwoFactorMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Session management
     * </pre>
     */
    public void getActiveSessions(sonet.user.User.GetActiveSessionsRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.GetActiveSessionsResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetActiveSessionsMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void terminateSession(sonet.user.User.TerminateSessionRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.TerminateSessionResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getTerminateSessionMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Profile management
     * </pre>
     */
    public void getUserProfile(sonet.user.User.GetUserProfileRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.GetUserProfileResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetUserProfileMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void updateUserProfile(sonet.user.User.UpdateUserProfileRequest request,
        io.grpc.stub.StreamObserver<sonet.user.User.UpdateUserProfileResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpdateUserProfileMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * <pre>
   * User Service definition
   * </pre>
   */
  public static final class UserServiceBlockingStub extends io.grpc.stub.AbstractBlockingStub<UserServiceBlockingStub> {
    private UserServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected UserServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new UserServiceBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * Authentication operations
     * </pre>
     */
    public sonet.user.User.RegisterUserResponse registerUser(sonet.user.User.RegisterUserRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getRegisterUserMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.user.User.LoginUserResponse loginUser(sonet.user.User.LoginUserRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getLoginUserMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.user.User.LogoutResponse logoutUser(sonet.user.User.LogoutRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getLogoutUserMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.user.User.VerifyTokenResponse verifyToken(sonet.user.User.VerifyTokenRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getVerifyTokenMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.user.User.RefreshTokenResponse refreshToken(sonet.user.User.RefreshTokenRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getRefreshTokenMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Password management
     * </pre>
     */
    public sonet.user.User.ChangePasswordResponse changePassword(sonet.user.User.ChangePasswordRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getChangePasswordMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.user.User.ResetPasswordResponse resetPassword(sonet.user.User.ResetPasswordRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getResetPasswordMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.user.User.ConfirmPasswordResetResponse confirmPasswordReset(sonet.user.User.ConfirmPasswordResetRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getConfirmPasswordResetMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Email verification
     * </pre>
     */
    public sonet.user.User.VerifyEmailResponse verifyEmail(sonet.user.User.VerifyEmailRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getVerifyEmailMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.user.User.ResendVerificationResponse resendVerification(sonet.user.User.ResendVerificationRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getResendVerificationMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Two-factor authentication
     * </pre>
     */
    public sonet.user.User.SetupTwoFactorResponse setupTwoFactor(sonet.user.User.SetupTwoFactorRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getSetupTwoFactorMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.user.User.VerifyTwoFactorResponse verifyTwoFactor(sonet.user.User.VerifyTwoFactorRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getVerifyTwoFactorMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.user.User.DisableTwoFactorResponse disableTwoFactor(sonet.user.User.DisableTwoFactorRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getDisableTwoFactorMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Session management
     * </pre>
     */
    public sonet.user.User.GetActiveSessionsResponse getActiveSessions(sonet.user.User.GetActiveSessionsRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetActiveSessionsMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.user.User.TerminateSessionResponse terminateSession(sonet.user.User.TerminateSessionRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getTerminateSessionMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Profile management
     * </pre>
     */
    public sonet.user.User.GetUserProfileResponse getUserProfile(sonet.user.User.GetUserProfileRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetUserProfileMethod(), getCallOptions(), request);
    }

    /**
     */
    public sonet.user.User.UpdateUserProfileResponse updateUserProfile(sonet.user.User.UpdateUserProfileRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpdateUserProfileMethod(), getCallOptions(), request);
    }
  }

  /**
   * <pre>
   * User Service definition
   * </pre>
   */
  public static final class UserServiceFutureStub extends io.grpc.stub.AbstractFutureStub<UserServiceFutureStub> {
    private UserServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected UserServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new UserServiceFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * Authentication operations
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.RegisterUserResponse> registerUser(
        sonet.user.User.RegisterUserRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getRegisterUserMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.LoginUserResponse> loginUser(
        sonet.user.User.LoginUserRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getLoginUserMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.LogoutResponse> logoutUser(
        sonet.user.User.LogoutRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getLogoutUserMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.VerifyTokenResponse> verifyToken(
        sonet.user.User.VerifyTokenRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getVerifyTokenMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.RefreshTokenResponse> refreshToken(
        sonet.user.User.RefreshTokenRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getRefreshTokenMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Password management
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.ChangePasswordResponse> changePassword(
        sonet.user.User.ChangePasswordRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getChangePasswordMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.ResetPasswordResponse> resetPassword(
        sonet.user.User.ResetPasswordRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getResetPasswordMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.ConfirmPasswordResetResponse> confirmPasswordReset(
        sonet.user.User.ConfirmPasswordResetRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getConfirmPasswordResetMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Email verification
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.VerifyEmailResponse> verifyEmail(
        sonet.user.User.VerifyEmailRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getVerifyEmailMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.ResendVerificationResponse> resendVerification(
        sonet.user.User.ResendVerificationRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getResendVerificationMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Two-factor authentication
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.SetupTwoFactorResponse> setupTwoFactor(
        sonet.user.User.SetupTwoFactorRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getSetupTwoFactorMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.VerifyTwoFactorResponse> verifyTwoFactor(
        sonet.user.User.VerifyTwoFactorRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getVerifyTwoFactorMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.DisableTwoFactorResponse> disableTwoFactor(
        sonet.user.User.DisableTwoFactorRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getDisableTwoFactorMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Session management
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.GetActiveSessionsResponse> getActiveSessions(
        sonet.user.User.GetActiveSessionsRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetActiveSessionsMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.TerminateSessionResponse> terminateSession(
        sonet.user.User.TerminateSessionRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getTerminateSessionMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Profile management
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.GetUserProfileResponse> getUserProfile(
        sonet.user.User.GetUserProfileRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetUserProfileMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<sonet.user.User.UpdateUserProfileResponse> updateUserProfile(
        sonet.user.User.UpdateUserProfileRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpdateUserProfileMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_REGISTER_USER = 0;
  private static final int METHODID_LOGIN_USER = 1;
  private static final int METHODID_LOGOUT_USER = 2;
  private static final int METHODID_VERIFY_TOKEN = 3;
  private static final int METHODID_REFRESH_TOKEN = 4;
  private static final int METHODID_CHANGE_PASSWORD = 5;
  private static final int METHODID_RESET_PASSWORD = 6;
  private static final int METHODID_CONFIRM_PASSWORD_RESET = 7;
  private static final int METHODID_VERIFY_EMAIL = 8;
  private static final int METHODID_RESEND_VERIFICATION = 9;
  private static final int METHODID_SETUP_TWO_FACTOR = 10;
  private static final int METHODID_VERIFY_TWO_FACTOR = 11;
  private static final int METHODID_DISABLE_TWO_FACTOR = 12;
  private static final int METHODID_GET_ACTIVE_SESSIONS = 13;
  private static final int METHODID_TERMINATE_SESSION = 14;
  private static final int METHODID_GET_USER_PROFILE = 15;
  private static final int METHODID_UPDATE_USER_PROFILE = 16;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final UserServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(UserServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_REGISTER_USER:
          serviceImpl.registerUser((sonet.user.User.RegisterUserRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.RegisterUserResponse>) responseObserver);
          break;
        case METHODID_LOGIN_USER:
          serviceImpl.loginUser((sonet.user.User.LoginUserRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.LoginUserResponse>) responseObserver);
          break;
        case METHODID_LOGOUT_USER:
          serviceImpl.logoutUser((sonet.user.User.LogoutRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.LogoutResponse>) responseObserver);
          break;
        case METHODID_VERIFY_TOKEN:
          serviceImpl.verifyToken((sonet.user.User.VerifyTokenRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.VerifyTokenResponse>) responseObserver);
          break;
        case METHODID_REFRESH_TOKEN:
          serviceImpl.refreshToken((sonet.user.User.RefreshTokenRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.RefreshTokenResponse>) responseObserver);
          break;
        case METHODID_CHANGE_PASSWORD:
          serviceImpl.changePassword((sonet.user.User.ChangePasswordRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.ChangePasswordResponse>) responseObserver);
          break;
        case METHODID_RESET_PASSWORD:
          serviceImpl.resetPassword((sonet.user.User.ResetPasswordRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.ResetPasswordResponse>) responseObserver);
          break;
        case METHODID_CONFIRM_PASSWORD_RESET:
          serviceImpl.confirmPasswordReset((sonet.user.User.ConfirmPasswordResetRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.ConfirmPasswordResetResponse>) responseObserver);
          break;
        case METHODID_VERIFY_EMAIL:
          serviceImpl.verifyEmail((sonet.user.User.VerifyEmailRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.VerifyEmailResponse>) responseObserver);
          break;
        case METHODID_RESEND_VERIFICATION:
          serviceImpl.resendVerification((sonet.user.User.ResendVerificationRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.ResendVerificationResponse>) responseObserver);
          break;
        case METHODID_SETUP_TWO_FACTOR:
          serviceImpl.setupTwoFactor((sonet.user.User.SetupTwoFactorRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.SetupTwoFactorResponse>) responseObserver);
          break;
        case METHODID_VERIFY_TWO_FACTOR:
          serviceImpl.verifyTwoFactor((sonet.user.User.VerifyTwoFactorRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.VerifyTwoFactorResponse>) responseObserver);
          break;
        case METHODID_DISABLE_TWO_FACTOR:
          serviceImpl.disableTwoFactor((sonet.user.User.DisableTwoFactorRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.DisableTwoFactorResponse>) responseObserver);
          break;
        case METHODID_GET_ACTIVE_SESSIONS:
          serviceImpl.getActiveSessions((sonet.user.User.GetActiveSessionsRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.GetActiveSessionsResponse>) responseObserver);
          break;
        case METHODID_TERMINATE_SESSION:
          serviceImpl.terminateSession((sonet.user.User.TerminateSessionRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.TerminateSessionResponse>) responseObserver);
          break;
        case METHODID_GET_USER_PROFILE:
          serviceImpl.getUserProfile((sonet.user.User.GetUserProfileRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.GetUserProfileResponse>) responseObserver);
          break;
        case METHODID_UPDATE_USER_PROFILE:
          serviceImpl.updateUserProfile((sonet.user.User.UpdateUserProfileRequest) request,
              (io.grpc.stub.StreamObserver<sonet.user.User.UpdateUserProfileResponse>) responseObserver);
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

  private static abstract class UserServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    UserServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return sonet.user.User.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("UserService");
    }
  }

  private static final class UserServiceFileDescriptorSupplier
      extends UserServiceBaseDescriptorSupplier {
    UserServiceFileDescriptorSupplier() {}
  }

  private static final class UserServiceMethodDescriptorSupplier
      extends UserServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    UserServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (UserServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new UserServiceFileDescriptorSupplier())
              .addMethod(getRegisterUserMethod())
              .addMethod(getLoginUserMethod())
              .addMethod(getLogoutUserMethod())
              .addMethod(getVerifyTokenMethod())
              .addMethod(getRefreshTokenMethod())
              .addMethod(getChangePasswordMethod())
              .addMethod(getResetPasswordMethod())
              .addMethod(getConfirmPasswordResetMethod())
              .addMethod(getVerifyEmailMethod())
              .addMethod(getResendVerificationMethod())
              .addMethod(getSetupTwoFactorMethod())
              .addMethod(getVerifyTwoFactorMethod())
              .addMethod(getDisableTwoFactorMethod())
              .addMethod(getGetActiveSessionsMethod())
              .addMethod(getTerminateSessionMethod())
              .addMethod(getGetUserProfileMethod())
              .addMethod(getUpdateUserProfileMethod())
              .build();
        }
      }
    }
    return result;
  }
}
