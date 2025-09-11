Pod::Spec.new do |s|
  s.name         = "TimeNativeCameraModule"
  s.version      = "1.0.0"
  s.summary      = "Native camera module for Time client with gRPC media service integration"
  s.description  = <<-DESC
                   A comprehensive native camera module for iOS and Android that provides:
                   - Native camera capture with advanced controls
                   - Gallery selection with native performance
                   - gRPC media service integration
                   - Real-time preview and recording
                   - Image/video processing and compression
                   - Permission handling
                   DESC
  s.homepage     = "https://github.com/neoqiss/time-client"
  s.license      = "UNLICENSED"
  s.author       = { "Neo Qiss" => "dev@neoqiss.com" }
  s.platform     = :ios, "12.0"
  s.source       = { :path => "." }
  s.source_files = "*.{h,m}"
  s.public_header_files = "*.h"
  
  s.dependency "React-Core"
  s.dependency "React-RCTImage"
  s.dependency "React-RCTNetwork"
  
  s.frameworks = "AVFoundation", "Photos", "CoreLocation", "ImageIO", "MobileCoreServices"
  s.libraries = "c++"
  
  s.requires_arc = true
end