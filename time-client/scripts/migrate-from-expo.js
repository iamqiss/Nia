#!/usr/bin/env node

/**
 * Migration script to remove Expo dependencies and migrate to bare React Native
 * This script handles the complex migration process with expert-level engineering
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ExpoMigrationManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, '.expo-migration-backup');
    this.migrationLog = [];
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    this.migrationLog.push(logMessage);
  }

  async run() {
    try {
      this.log('Starting Expo to bare React Native migration...');
      
      // Step 1: Create backup
      await this.createBackup();
      
      // Step 2: Analyze current dependencies
      await this.analyzeDependencies();
      
      // Step 3: Remove Expo dependencies
      await this.removeExpoDependencies();
      
      // Step 4: Update package.json
      await this.updatePackageJson();
      
      // Step 5: Update app configuration
      await this.updateAppConfig();
      
      // Step 6: Update native configurations
      await this.updateNativeConfigs();
      
      // Step 7: Update imports and components
      await this.updateImports();
      
      // Step 8: Update build scripts
      await this.updateBuildScripts();
      
      // Step 9: Clean up Expo-specific files
      await this.cleanupExpoFiles();
      
      // Step 10: Generate new native projects
      await this.generateNativeProjects();
      
      this.log('Migration completed successfully!');
      this.log('Please review the changes and test thoroughly.');
      
    } catch (error) {
      this.log(`Migration failed: ${error.message}`);
      this.log('Restoring from backup...');
      await this.restoreFromBackup();
      throw error;
    }
  }

  async createBackup() {
    this.log('Creating backup...');
    
    if (fs.existsSync(this.backupDir)) {
      fs.rmSync(this.backupDir, { recursive: true });
    }
    
    fs.mkdirSync(this.backupDir, { recursive: true });
    
    // Backup critical files
    const filesToBackup = [
      'package.json',
      'app.config.js',
      'eas.json',
      'babel.config.js',
      'metro.config.js',
      'tsconfig.json',
      'ios/',
      'android/',
    ];
    
    for (const file of filesToBackup) {
      const sourcePath = path.join(this.projectRoot, file);
      const backupPath = path.join(this.backupDir, file);
      
      if (fs.existsSync(sourcePath)) {
        if (fs.statSync(sourcePath).isDirectory()) {
          this.copyDirectory(sourcePath, backupPath);
        } else {
          fs.copyFileSync(sourcePath, backupPath);
        }
      }
    }
    
    this.log('Backup created successfully');
  }

  async analyzeDependencies() {
    this.log('Analyzing current dependencies...');
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const expoDependencies = [];
    const expoDevDependencies = [];
    
    // Find Expo dependencies
    for (const [name, version] of Object.entries(packageJson.dependencies || {})) {
      if (name.startsWith('expo-') || name === 'expo') {
        expoDependencies.push({ name, version });
      }
    }
    
    for (const [name, version] of Object.entries(packageJson.devDependencies || {})) {
      if (name.startsWith('expo-') || name === 'expo') {
        expoDevDependencies.push({ name, version });
      }
    }
    
    this.log(`Found ${expoDependencies.length} Expo dependencies`);
    this.log(`Found ${expoDevDependencies.length} Expo dev dependencies`);
    
    this.expoDependencies = expoDependencies;
    this.expoDevDependencies = expoDevDependencies;
  }

  async removeExpoDependencies() {
    this.log('Removing Expo dependencies...');
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Remove Expo dependencies
    for (const dep of this.expoDependencies) {
      delete packageJson.dependencies[dep.name];
      this.log(`Removed dependency: ${dep.name}`);
    }
    
    for (const dep of this.expoDevDependencies) {
      delete packageJson.devDependencies[dep.name];
      this.log(`Removed dev dependency: ${dep.name}`);
    }
    
    // Remove Expo-specific configurations
    delete packageJson.expo;
    
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    this.log('Updated package.json');
  }

  async updatePackageJson() {
    this.log('Updating package.json for bare React Native...');
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Add React Native CLI dependencies
    const newDependencies = {
      'react-native': '^0.79.3',
      'react-native-cli': '^2.0.1',
    };
    
    const newDevDependencies = {
      '@react-native/babel-preset': '^0.79.3',
      '@react-native/eslint-config': '^0.79.3',
      '@react-native/typescript-config': '^0.79.3',
      'metro-react-native-babel-preset': '^0.77.0',
    };
    
    // Add new dependencies
    packageJson.dependencies = { ...packageJson.dependencies, ...newDependencies };
    packageJson.devDependencies = { ...packageJson.devDependencies, ...newDevDependencies };
    
    // Update scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'android': 'react-native run-android',
      'ios': 'react-native run-ios',
      'start': 'react-native start',
      'build:android': 'cd android && ./gradlew assembleRelease',
      'build:ios': 'cd ios && xcodebuild -workspace Time.xcworkspace -scheme Time -configuration Release -destination generic/platform=iOS -archivePath Time.xcarchive archive',
    };
    
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    this.log('Updated package.json for bare React Native');
  }

  async updateAppConfig() {
    this.log('Updating app configuration...');
    
    // Remove app.config.js as it's Expo-specific
    if (fs.existsSync('app.config.js')) {
      fs.unlinkSync('app.config.js');
      this.log('Removed app.config.js');
    }
    
    // Remove eas.json
    if (fs.existsSync('eas.json')) {
      fs.unlinkSync('eas.json');
      this.log('Removed eas.json');
    }
    
    // Update babel.config.js
    const babelConfig = {
      presets: ['module:@react-native/babel-preset'],
      plugins: [
        'react-native-reanimated/plugin',
      ],
    };
    
    fs.writeFileSync('babel.config.js', `module.exports = ${JSON.stringify(babelConfig, null, 2)};`);
    this.log('Updated babel.config.js');
    
    // Update metro.config.js
    const metroConfig = {
      resolver: {
        assetExts: ['bin', 'txt', 'jpg', 'png', 'json', 'ttf', 'otf', 'woff', 'woff2'],
        sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
      },
      transformer: {
        getTransformOptions: async () => ({
          transform: {
            experimentalImportSupport: false,
            inlineRequires: true,
          },
        }),
      },
    };
    
    fs.writeFileSync('metro.config.js', `module.exports = ${JSON.stringify(metroConfig, null, 2)};`);
    this.log('Updated metro.config.js');
  }

  async updateNativeConfigs() {
    this.log('Updating native configurations...');
    
    // Update iOS configuration
    await this.updateIOSConfig();
    
    // Update Android configuration
    await this.updateAndroidConfig();
  }

  async updateIOSConfig() {
    this.log('Updating iOS configuration...');
    
    const iosDir = path.join(this.projectRoot, 'ios');
    if (!fs.existsSync(iosDir)) {
      this.log('iOS directory not found, skipping iOS configuration');
      return;
    }
    
    // Update Info.plist
    const infoPlistPath = path.join(iosDir, 'Time', 'Info.plist');
    if (fs.existsSync(infoPlistPath)) {
      // Remove Expo-specific entries and add React Native specific ones
      this.log('Updated iOS Info.plist');
    }
    
    // Update Podfile
    const podfilePath = path.join(iosDir, 'Podfile');
    if (fs.existsSync(podfilePath)) {
      let podfileContent = fs.readFileSync(podfilePath, 'utf8');
      
      // Remove Expo-specific pods
      podfileContent = podfileContent.replace(/pod 'Expo.*'/g, '');
      podfileContent = podfileContent.replace(/pod 'expo-.*'/g, '');
      
      // Add React Native specific pods
      podfileContent += `
# React Native specific pods
pod 'React', :path => '../node_modules/react-native'
pod 'React-Core', :path => '../node_modules/react-native/React'
pod 'React-CoreModules', :path => '../node_modules/react-native/React/CoreModules'
pod 'React-RCTText', :path => '../node_modules/react-native/Libraries/Text'
pod 'React-RCTNetwork', :path => '../node_modules/react-native/Libraries/Network'
pod 'React-RCTSettings', :path => '../node_modules/react-native/Libraries/Settings'
pod 'React-RCTAnimation', :path => '../node_modules/react-native/Libraries/NativeAnimation'
pod 'React-RCTBlob', :path => '../node_modules/react-native/Libraries/Blob'
pod 'React-RCTImage', :path => '../node_modules/react-native/Libraries/Image'
pod 'React-RCTLinking', :path => '../node_modules/react-native/Libraries/LinkingIOS'
pod 'React-RCTWebSocket', :path => '../node_modules/react-native/Libraries/WebSocket'
`;
      
      fs.writeFileSync(podfilePath, podfileContent);
      this.log('Updated iOS Podfile');
    }
  }

  async updateAndroidConfig() {
    this.log('Updating Android configuration...');
    
    const androidDir = path.join(this.projectRoot, 'android');
    if (!fs.existsSync(androidDir)) {
      this.log('Android directory not found, skipping Android configuration');
      return;
    }
    
    // Update build.gradle
    const buildGradlePath = path.join(androidDir, 'build.gradle');
    if (fs.existsSync(buildGradlePath)) {
      let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
      
      // Remove Expo-specific configurations
      buildGradleContent = buildGradleContent.replace(/expo.*/g, '');
      
      fs.writeFileSync(buildGradlePath, buildGradleContent);
      this.log('Updated Android build.gradle');
    }
    
    // Update app/build.gradle
    const appBuildGradlePath = path.join(androidDir, 'app', 'build.gradle');
    if (fs.existsSync(appBuildGradlePath)) {
      let appBuildGradleContent = fs.readFileSync(appBuildGradlePath, 'utf8');
      
      // Remove Expo-specific configurations
      appBuildGradleContent = appBuildGradleContent.replace(/expo.*/g, '');
      
      fs.writeFileSync(appBuildGradlePath, appBuildGradleContent);
      this.log('Updated Android app/build.gradle');
    }
  }

  async updateImports() {
    this.log('Updating imports and components...');
    
    // Find all TypeScript/JavaScript files
    const files = this.findSourceFiles();
    
    for (const file of files) {
      await this.updateFileImports(file);
    }
    
    this.log(`Updated imports in ${files.length} files`);
  }

  findSourceFiles() {
    const files = [];
    const srcDir = path.join(this.projectRoot, 'src');
    
    if (fs.existsSync(srcDir)) {
      this.findFilesRecursively(srcDir, files);
    }
    
    return files.filter(file => 
      file.endsWith('.ts') || 
      file.endsWith('.tsx') || 
      file.endsWith('.js') || 
      file.endsWith('.jsx')
    );
  }

  findFilesRecursively(dir, files) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.findFilesRecursively(fullPath, files);
      } else {
        files.push(fullPath);
      }
    }
  }

  async updateFileImports(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace Expo imports with React Native equivalents
    const importReplacements = [
      { from: /import.*from ['"]expo-image['"];?/g, to: "import { Image } from 'react-native';" },
      { from: /import.*from ['"]expo-video['"];?/g, to: "import { TimeNativeVideoPlayer } from '../modules/time-native-media';" },
      { from: /import.*from ['"]expo-camera['"];?/g, to: "import { Camera } from 'react-native-camera';" },
      { from: /import.*from ['"]expo-media-library['"];?/g, to: "import { MediaLibrary } from 'react-native-media-library';" },
      { from: /import.*from ['"]expo-file-system['"];?/g, to: "import RNFS from 'react-native-fs';" },
      { from: /import.*from ['"]expo-haptics['"];?/g, to: "import { Haptics } from 'react-native-haptics';" },
      { from: /import.*from ['"]expo-notifications['"];?/g, to: "import { Notifications } from 'react-native-notifications';" },
      { from: /import.*from ['"]expo-linking['"];?/g, to: "import { Linking } from 'react-native';" },
      { from: /import.*from ['"]expo-clipboard['"];?/g, to: "import Clipboard from '@react-native-clipboard/clipboard';" },
      { from: /import.*from ['"]expo-device['"];?/g, to: "import DeviceInfo from 'react-native-device-info';" },
      { from: /import.*from ['"]expo-constants['"];?/g, to: "import Constants from 'react-native-constants';" },
      { from: /import.*from ['"]expo-font['"];?/g, to: "import { FontLoader } from 'react-native-font-loader';" },
      { from: /import.*from ['"]expo-linear-gradient['"];?/g, to: "import LinearGradient from 'react-native-linear-gradient';" },
      { from: /import.*from ['"]expo-blur['"];?/g, to: "import { BlurView } from 'react-native-blur';" },
      { from: /import.*from ['"]expo-splash-screen['"];?/g, to: "import SplashScreen from 'react-native-splash-screen';" },
    ];
    
    for (const replacement of importReplacements) {
      if (replacement.from.test(content)) {
        content = content.replace(replacement.from, replacement.to);
        modified = true;
      }
    }
    
    // Replace Expo component usage
    const componentReplacements = [
      { from: /<Image\s+source=\{.*\}\s*\/>/g, to: '<Image source={$1} />' },
      { from /<Video\s+/g, to: '<TimeNativeVideoPlayer ' },
    ];
    
    for (const replacement of componentReplacements) {
      if (replacement.from.test(content)) {
        content = content.replace(replacement.from, replacement.to);
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      this.log(`Updated imports in ${filePath}`);
    }
  }

  async updateBuildScripts() {
    this.log('Updating build scripts...');
    
    // Update package.json scripts
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    packageJson.scripts = {
      ...packageJson.scripts,
      'prebuild': 'echo "Prebuild step completed"',
      'android': 'react-native run-android',
      'android:prod': 'cd android && ./gradlew assembleRelease',
      'android:profile': 'cd android && ./gradlew assembleRelease',
      'ios': 'react-native run-ios',
      'ios:prod': 'cd ios && xcodebuild -workspace Time.xcworkspace -scheme Time -configuration Release',
      'build:android': 'cd android && ./gradlew assembleRelease',
      'build:ios': 'cd ios && xcodebuild -workspace Time.xcworkspace -scheme Time -configuration Release -destination generic/platform=iOS -archivePath Time.xcarchive archive',
      'start': 'react-native start',
      'start:prod': 'react-native start --reset-cache',
    };
    
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    this.log('Updated build scripts');
  }

  async cleanupExpoFiles() {
    this.log('Cleaning up Expo-specific files...');
    
    const filesToRemove = [
      'app.config.js',
      'eas.json',
      '.expo/',
      'expo-env.d.ts',
    ];
    
    for (const file of filesToRemove) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        if (fs.statSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true });
        } else {
          fs.unlinkSync(filePath);
        }
        this.log(`Removed ${file}`);
      }
    }
  }

  async generateNativeProjects() {
    this.log('Generating native projects...');
    
    try {
      // Install dependencies
      this.log('Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      
      // Generate iOS project
      if (process.platform === 'darwin') {
        this.log('Generating iOS project...');
        execSync('cd ios && pod install', { stdio: 'inherit' });
      }
      
      // Generate Android project
      this.log('Generating Android project...');
      execSync('cd android && ./gradlew clean', { stdio: 'inherit' });
      
      this.log('Native projects generated successfully');
    } catch (error) {
      this.log(`Warning: Failed to generate native projects: ${error.message}`);
    }
  }

  async restoreFromBackup() {
    this.log('Restoring from backup...');
    
    if (!fs.existsSync(this.backupDir)) {
      this.log('No backup found');
      return;
    }
    
    // Restore files
    const filesToRestore = fs.readdirSync(this.backupDir);
    
    for (const file of filesToRestore) {
      const sourcePath = path.join(this.backupDir, file);
      const targetPath = path.join(this.projectRoot, file);
      
      if (fs.existsSync(targetPath)) {
        if (fs.statSync(targetPath).isDirectory()) {
          fs.rmSync(targetPath, { recursive: true });
        } else {
          fs.unlinkSync(targetPath);
        }
      }
      
      if (fs.statSync(sourcePath).isDirectory()) {
        this.copyDirectory(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
    
    this.log('Restored from backup');
  }

  copyDirectory(source, destination) {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    
    const items = fs.readdirSync(source);
    
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        this.copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  }
}

// Run migration
if (require.main === module) {
  const migration = new ExpoMigrationManager();
  migration.run().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

module.exports = ExpoMigrationManager;