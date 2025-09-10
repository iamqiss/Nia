Pod::Spec.new do |s|
  s.name           = 'ExpoTimeSwissArmy'
  s.version        = '1.0.0'
  s.summary        = 'A collection of native tools for Time'
  s.description    = 'A collection of native tools for Time'
  s.author         = ''
  s.homepage       = 'https://github.com/iamqiss/Nia'
  s.platforms      = { :ios => '13.4', :tvos => '13.4' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
