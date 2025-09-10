require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "TimePushNotifications"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  Native push notifications for Time app with gRPC integration
                   DESC
  s.homepage     = "https://github.com/time-app/time-push-notifications"
  s.license      = "MIT"
  s.authors      = { "Neo Qiss" => "neo@time.app" }
  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/time-app/time-push-notifications.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.requires_arc = true

  s.dependency "React-Core"
  s.dependency "Firebase/Core"
  s.dependency "Firebase/Messaging"
  s.dependency "gRPC-Core"
  s.dependency "gRPC-ProtoRPC"
  s.dependency "Protobuf"

  s.pod_target_xcconfig = {
    'GCC_PREPROCESSOR_DEFINITIONS' => '$(inherited) GPB_USE_PROTOBUF_FRAMEWORK_IMPORTS=1',
    'CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES' => 'YES',
    'CLANG_WARN_STRICT_PROTOTYPES' => 'NO',
    'CLANG_WARN_DOCUMENTATION_COMMENTS' => 'NO',
    'GCC_TREAT_WARNINGS_AS_ERRORS' => 'NO',
    'CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF' => 'NO',
    'CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER' => 'NO'
  }

  s.user_target_xcconfig = {
    'GCC_PREPROCESSOR_DEFINITIONS' => '$(inherited) GPB_USE_PROTOBUF_FRAMEWORK_IMPORTS=1'
  }

  s.ios.frameworks = 'UserNotifications', 'FirebaseCore', 'FirebaseMessaging'
  s.ios.deployment_target = '11.0'
end