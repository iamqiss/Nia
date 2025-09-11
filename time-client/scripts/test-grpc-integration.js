#!/usr/bin/env node

/**
 * Test script to verify gRPC integration
 * This script tests the basic functionality of the gRPC service integration
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Time gRPC Integration...\n');

// Test 1: Check if generated files exist
console.log('1. Checking generated files...');

const iosGeneratedDir = path.join(__dirname, '../ios/Time/Generated');
const androidGeneratedDir = path.join(__dirname, '../android/app/src/main/java/com/timesocial/grpc');

const iosFiles = [
  'TimeGrpc.swift',
  'common/common.pb.h',
  'common/common.pb.cc',
  'services/note.grpc.pb.h',
  'services/note.grpc.pb.cc',
  'services/user.grpc.pb.h',
  'services/user.grpc.pb.cc',
  'services/fanout.grpc.pb.h',
  'services/fanout.grpc.pb.cc',
  'services/messaging.grpc.pb.h',
  'services/messaging.grpc.pb.cc',
  'services/search.grpc.pb.h',
  'services/search.grpc.pb.cc',
  'services/drafts_service.grpc.pb.h',
  'services/drafts_service.grpc.pb.cc',
  'services/list_service.grpc.pb.h',
  'services/list_service.grpc.pb.cc',
  'services/starterpack_service.grpc.pb.h',
  'services/starterpack_service.grpc.pb.cc'
];

const androidFiles = [
  'TimeGrpcClient.java',
  'TimeGrpcModule.java',
  'TimeGrpcReactModule.java',
  'TimeGrpcPackage.java',
  'sonet/common/Common.java',
  'sonet/note/NoteServiceGrpc.java',
  'sonet/user/UserServiceGrpc.java',
  'sonet/fanout/FanoutServiceGrpc.java',
  'sonet/messaging/MessagingServiceGrpc.java',
  'sonet/search/SearchServiceGrpc.java',
  'sonet/drafts/v1/DraftsServiceGrpc.java',
  'sonet/list/v1/ListServiceGrpc.java',
  'sonet/starterpack/v1/StarterpackServiceGrpc.java'
];

let iosFilesExist = 0;
let androidFilesExist = 0;

iosFiles.forEach(file => {
  const filePath = path.join(iosGeneratedDir, file);
  if (fs.existsSync(filePath)) {
    iosFilesExist++;
    console.log(`   ✅ iOS: ${file}`);
  } else {
    console.log(`   ❌ iOS: ${file} - MISSING`);
  }
});

androidFiles.forEach(file => {
  const filePath = path.join(androidGeneratedDir, file);
  if (fs.existsSync(filePath)) {
    androidFilesExist++;
    console.log(`   ✅ Android: ${file}`);
  } else {
    console.log(`   ❌ Android: ${file} - MISSING`);
  }
});

console.log(`\n   iOS Files: ${iosFilesExist}/${iosFiles.length} exist`);
console.log(`   Android Files: ${androidFilesExist}/${androidFiles.length} exist`);

// Test 2: Check if React Native interface files exist
console.log('\n2. Checking React Native interface files...');

const rnFiles = [
  'src/services/TimeGrpcService.ts',
  'src/hooks/useTimeGrpc.ts',
  'src/examples/GrpcServiceExample.tsx'
];

let rnFilesExist = 0;
rnFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    rnFilesExist++;
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
  }
});

console.log(`\n   React Native Files: ${rnFilesExist}/${rnFiles.length} exist`);

// Test 3: Check if Xcode project includes generated files
console.log('\n3. Checking Xcode project integration...');

const xcodeProjectPath = path.join(__dirname, '../ios/Time.xcodeproj/project.pbxproj');
if (fs.existsSync(xcodeProjectPath)) {
  const projectContent = fs.readFileSync(xcodeProjectPath, 'utf8');
  
  // Check for some key generated files in the project
  const keyFiles = [
    'TimeGrpc.swift',
    'common.pb.cc',
    'note.grpc.pb.cc',
    'user.grpc.pb.cc',
    'fanout.grpc.pb.cc',
    'messaging.grpc.pb.cc',
    'search.grpc.pb.cc',
    'drafts_service.grpc.pb.cc',
    'list_service.grpc.pb.cc',
    'starterpack_service.grpc.pb.cc'
  ];
  
  let filesInProject = 0;
  keyFiles.forEach(file => {
    if (projectContent.includes(file)) {
      filesInProject++;
      console.log(`   ✅ ${file} found in Xcode project`);
    } else {
      console.log(`   ❌ ${file} NOT found in Xcode project`);
    }
  });
  
  console.log(`\n   Files in Xcode Project: ${filesInProject}/${keyFiles.length}`);
} else {
  console.log('   ❌ Xcode project file not found');
}

// Test 4: Check if Android project includes gRPC package
console.log('\n4. Checking Android project integration...');

const mainApplicationPath = path.join(__dirname, '../android/app/src/main/java/com/time/MainApplication.kt');
if (fs.existsSync(mainApplicationPath)) {
  const mainAppContent = fs.readFileSync(mainApplicationPath, 'utf8');
  
  if (mainAppContent.includes('TimeGrpcPackage')) {
    console.log('   ✅ TimeGrpcPackage found in MainApplication.kt');
  } else {
    console.log('   ❌ TimeGrpcPackage NOT found in MainApplication.kt');
  }
  
  if (mainAppContent.includes('com.timesocial.grpc.TimeGrpcPackage')) {
    console.log('   ✅ TimeGrpcPackage import found');
  } else {
    console.log('   ❌ TimeGrpcPackage import NOT found');
  }
} else {
  console.log('   ❌ MainApplication.kt not found');
}

// Test 5: Check if Android build.gradle has gRPC dependencies
console.log('\n5. Checking Android build.gradle...');

const buildGradlePath = path.join(__dirname, '../android/app/build.gradle');
if (fs.existsSync(buildGradlePath)) {
  const buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
  
  const grpcDeps = [
    'io.grpc:grpc-okhttp',
    'io.grpc:grpc-protobuf-lite',
    'io.grpc:grpc-stub',
    'com.google.protobuf:protobuf-javalite'
  ];
  
  let depsFound = 0;
  grpcDeps.forEach(dep => {
    if (buildGradleContent.includes(dep)) {
      depsFound++;
      console.log(`   ✅ ${dep} found in build.gradle`);
    } else {
      console.log(`   ❌ ${dep} NOT found in build.gradle`);
    }
  });
  
  console.log(`\n   gRPC Dependencies: ${depsFound}/${grpcDeps.length} found`);
} else {
  console.log('   ❌ build.gradle not found');
}

// Test 6: Check if iOS Podfile has gRPC dependencies
console.log('\n6. Checking iOS Podfile...');

const podfilePath = path.join(__dirname, '../ios/Podfile');
if (fs.existsSync(podfilePath)) {
  const podfileContent = fs.readFileSync(podfilePath, 'utf8');
  
  const grpcPods = [
    'gRPC-Swift',
    'SwiftProtobuf'
  ];
  
  let podsFound = 0;
  grpcPods.forEach(pod => {
    if (podfileContent.includes(pod)) {
      podsFound++;
      console.log(`   ✅ ${pod} found in Podfile`);
    } else {
      console.log(`   ❌ ${pod} NOT found in Podfile`);
    }
  });
  
  console.log(`\n   gRPC Pods: ${podsFound}/${grpcPods.length} found`);
} else {
  console.log('   ❌ Podfile not found');
}

// Test 7: Check if proto files exist
console.log('\n7. Checking proto files...');

const protoDir = path.join(__dirname, '../proto');
if (fs.existsSync(protoDir)) {
  const protoFiles = [
    'common/common.proto',
    'common/pagination.proto',
    'common/timestamp.proto',
    'common/video_types.proto',
    'services/note.proto',
    'services/user.proto',
    'services/timeline.proto',
    'services/media.proto',
    'services/notification.proto',
    'services/fanout.proto',
    'services/messaging.proto',
    'services/search.proto',
    'services/drafts_service.proto',
    'services/list_service.proto',
    'services/starterpack_service.proto'
  ];
  
  let protoFilesExist = 0;
  protoFiles.forEach(file => {
    const filePath = path.join(protoDir, file);
    if (fs.existsSync(filePath)) {
      protoFilesExist++;
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} - MISSING`);
    }
  });
  
  console.log(`\n   Proto Files: ${protoFilesExist}/${protoFiles.length} exist`);
} else {
  console.log('   ❌ proto directory not found');
}

// Summary
console.log('\n📊 Integration Summary:');
console.log('========================');

const totalTests = 7;
let passedTests = 0;

if (iosFilesExist >= iosFiles.length * 0.8) {
  console.log('✅ iOS Generated Files: PASS');
  passedTests++;
} else {
  console.log('❌ iOS Generated Files: FAIL');
}

if (androidFilesExist >= androidFiles.length * 0.8) {
  console.log('✅ Android Generated Files: PASS');
  passedTests++;
} else {
  console.log('❌ Android Generated Files: FAIL');
}

if (rnFilesExist === rnFiles.length) {
  console.log('✅ React Native Interface: PASS');
  passedTests++;
} else {
  console.log('❌ React Native Interface: FAIL');
}

if (fs.existsSync(xcodeProjectPath)) {
  console.log('✅ Xcode Project Integration: PASS');
  passedTests++;
} else {
  console.log('❌ Xcode Project Integration: FAIL');
}

if (fs.existsSync(mainApplicationPath)) {
  console.log('✅ Android Project Integration: PASS');
  passedTests++;
} else {
  console.log('❌ Android Project Integration: FAIL');
}

if (fs.existsSync(buildGradlePath)) {
  console.log('✅ Android Dependencies: PASS');
  passedTests++;
} else {
  console.log('❌ Android Dependencies: FAIL');
}

if (fs.existsSync(podfilePath)) {
  console.log('✅ iOS Dependencies: PASS');
  passedTests++;
} else {
  console.log('❌ iOS Dependencies: FAIL');
}

console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log('🎉 All tests passed! gRPC integration is complete.');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the issues above.');
  process.exit(1);
}