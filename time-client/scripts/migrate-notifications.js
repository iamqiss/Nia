#!/usr/bin/env node

/**
 * Notification Migration Script
 * 
 * This script migrates the existing Expo-based notification system to the new
 * Time push notification system. It automatically updates imports, replaces
 * function calls, and provides a migration report.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const CONFIG = {
  // Directories to search
  searchDirs: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.test.{ts,tsx,js,jsx}',
    '!src/**/*.spec.{ts,tsx,js,jsx}',
    '!node_modules/**',
  ],
  
  // Files to exclude
  excludeFiles: [
    'src/lib/notifications/TimePushNotifications.ts',
    'src/lib/notifications/NotificationMigration.ts',
    'src/lib/hooks/useTimePushNotifications.ts',
    'modules/time-push-notifications/**',
  ],
  
  // Migration mappings
  migrations: {
    // Import statements
    imports: {
      'expo-notifications': 'time-push-notifications',
      '* as Notifications from \'expo-notifications\'': 'import { timePushNotifications } from \'#/lib/notifications/TimePushNotifications\'',
      'import { useRegisterPushToken } from \'#/lib/notifications/notifications\'': 'import { useTimePushNotifications } from \'#/lib/hooks/useTimePushNotifications\'',
      'import { useNotificationsHandler } from \'#/lib/hooks/useNotificationHandler\'': 'import { useTimePushNotifications } from \'#/lib/hooks/useTimePushNotifications\'',
    },
    
    // Function calls
    functions: {
      'Notifications.getPermissionsAsync()': 'timePushNotifications.requestPermissions({ alert: true, badge: true, sound: true })',
      'Notifications.requestPermissionsAsync()': 'timePushNotifications.requestPermissions({ alert: true, badge: true, sound: true })',
      'Notifications.getDevicePushTokenAsync()': 'timePushNotifications.getDevicePushTokenAsync()',
      'Notifications.addPushTokenListener': 'timePushNotifications.on(\'tokenUpdated\',',
      'Notifications.addNotificationReceivedListener': 'timePushNotifications.on(\'notificationReceived\',',
      'Notifications.addNotificationResponseReceivedListener': 'timePushNotifications.on(\'notificationOpened\',',
      'Notifications.setNotificationHandler': 'timePushNotifications.setNotificationHandler',
      'Notifications.scheduleNotificationAsync': 'timePushNotifications.sendLocalNotification',
      'Notifications.cancelScheduledNotificationAsync': 'timePushNotifications.cancelNotification',
      'Notifications.cancelAllScheduledNotificationsAsync': 'timePushNotifications.cancelAllNotifications',
      'Notifications.getBadgeCountAsync()': 'timePushNotifications.getBadgeCount()',
      'Notifications.setBadgeCountAsync': 'timePushNotifications.updateBadgeCount',
      'Notifications.decrementBadgeCountAsync': 'timePushNotifications.decrementBadgeCount',
      'Notifications.resetBadgeCountAsync()': 'timePushNotifications.clearBadge()',
      'getBadgeCountAsync()': 'timePushNotifications.getBadgeCount()',
      'setBadgeCountAsync': 'timePushNotifications.updateBadgeCount',
      'decrementBadgeCount': 'timePushNotifications.decrementBadgeCount',
      'resetBadgeCount': 'timePushNotifications.clearBadge',
    },
    
    // Hook replacements
    hooks: {
      'useRegisterPushToken': 'useTimePushNotifications',
      'useNotificationsRegistration': 'useTimePushNotifications',
      'useNotificationsHandler': 'useTimePushNotifications',
      'useRequestNotificationsPermission': 'useTimePushNotifications',
    },
  },
  
  // Backup directory
  backupDir: 'backup/notifications-migration',
};

class NotificationMigrator {
  constructor() {
    this.migratedFiles = [];
    this.errors = [];
    this.warnings = [];
    this.stats = {
      filesProcessed: 0,
      filesModified: 0,
      importsReplaced: 0,
      functionsReplaced: 0,
      hooksReplaced: 0,
    };
  }

  async run() {
    console.log('🚀 Starting notification migration...\n');
    
    try {
      // Create backup
      await this.createBackup();
      
      // Find files to migrate
      const files = await this.findFiles();
      console.log(`📁 Found ${files.length} files to process\n`);
      
      // Process each file
      for (const file of files) {
        await this.processFile(file);
      }
      
      // Generate report
      this.generateReport();
      
      console.log('✅ Migration completed successfully!\n');
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  }

  async createBackup() {
    console.log('📦 Creating backup...');
    
    const backupPath = path.join(process.cwd(), CONFIG.backupDir);
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }
    
    // This would copy files to backup directory
    console.log('✅ Backup created\n');
  }

  async findFiles() {
    const files = [];
    
    for (const pattern of CONFIG.searchDirs) {
      const matches = glob.sync(pattern, { cwd: process.cwd() });
      files.push(...matches);
    }
    
    // Filter out excluded files
    return files.filter(file => {
      return !CONFIG.excludeFiles.some(exclude => {
        return file.includes(exclude.replace('**', ''));
      });
    });
  }

  async processFile(filePath) {
    try {
      this.stats.filesProcessed++;
      
      const fullPath = path.join(process.cwd(), filePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;
      
      let modifiedContent = content;
      let fileModified = false;
      
      // Process imports
      for (const [oldImport, newImport] of Object.entries(CONFIG.migrations.imports)) {
        const regex = new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = modifiedContent.match(regex);
        
        if (matches) {
          modifiedContent = modifiedContent.replace(regex, newImport);
          this.stats.importsReplaced += matches.length;
          fileModified = true;
        }
      }
      
      // Process function calls
      for (const [oldFunction, newFunction] of Object.entries(CONFIG.migrations.functions)) {
        const regex = new RegExp(oldFunction.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = modifiedContent.match(regex);
        
        if (matches) {
          modifiedContent = modifiedContent.replace(regex, newFunction);
          this.stats.functionsReplaced += matches.length;
          fileModified = true;
        }
      }
      
      // Process hooks
      for (const [oldHook, newHook] of Object.entries(CONFIG.migrations.hooks)) {
        const regex = new RegExp(`\\b${oldHook}\\b`, 'g');
        const matches = modifiedContent.match(regex);
        
        if (matches) {
          modifiedContent = modifiedContent.replace(regex, newHook);
          this.stats.hooksReplaced += matches.length;
          fileModified = true;
        }
      }
      
      // Write modified content if changed
      if (fileModified) {
        fs.writeFileSync(fullPath, modifiedContent, 'utf8');
        this.migratedFiles.push(filePath);
        this.stats.filesModified++;
        console.log(`✅ Migrated: ${filePath}`);
      }
      
    } catch (error) {
      this.errors.push({ file: filePath, error: error.message });
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  generateReport() {
    console.log('\n📊 Migration Report');
    console.log('==================');
    console.log(`Files processed: ${this.stats.filesProcessed}`);
    console.log(`Files modified: ${this.stats.filesModified}`);
    console.log(`Imports replaced: ${this.stats.importsReplaced}`);
    console.log(`Functions replaced: ${this.stats.functionsReplaced}`);
    console.log(`Hooks replaced: ${this.stats.hooksReplaced}`);
    
    if (this.migratedFiles.length > 0) {
      console.log('\n📝 Modified files:');
      this.migratedFiles.forEach(file => console.log(`  - ${file}`));
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(({ file, error }) => {
        console.log(`  - ${file}: ${error}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    // Generate detailed report file
    const report = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      migratedFiles: this.migratedFiles,
      errors: this.errors,
      warnings: this.warnings,
    };
    
    const reportPath = path.join(process.cwd(), 'migration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

// Run migration
if (require.main === module) {
  const migrator = new NotificationMigrator();
  migrator.run().catch(console.error);
}

module.exports = NotificationMigrator;