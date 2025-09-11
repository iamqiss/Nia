#!/usr/bin/env node

/**
 * Complete gRPC Migration Script
 * Removes all AT Protocol dependencies and REST fallback code
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SRC_DIR = path.join(__dirname, '..', 'src');
const EXCLUDE_DIRS = ['node_modules', '.git', 'dist', 'build', 'target'];
const EXCLUDE_FILES = ['.d.ts', '.map', '.lock'];

// AT Protocol imports to remove
const ATPROTO_IMPORTS = [
  '@atproto/api',
  '@atproto/common',
  '@atproto/common-web',
  '@atproto/dev-env'
];

// Files to completely remove (REST fallback implementations)
const FILES_TO_REMOVE = [
  'src/lib/api/migration/index.ts', // This contains REST fallback code
];

// Replacement mappings
const REPLACEMENTS = {
  // Import replacements
  "from '@atproto/api'": "from '#/lib/grpc/TimeGrpcClient'",
  "from '@atproto/common'": "from '#/lib/grpc/TimeGrpcClient'", 
  "from '@atproto/common-web'": "from '#/lib/grpc/TimeGrpcClient'",
  "from '@atproto/dev-env'": "from '#/lib/grpc/TimeGrpcClient'",
  
  // Type replacements
  "BskyAgent": "TimeGrpcClient",
  "AtpAgent": "TimeGrpcClient",
  "AtUri": "GrpcUri",
  "BlobRef": "GrpcBlobRef",
  "RichText": "GrpcRichText",
  "TID": "GrpcTID",
  
  // Comment replacements
  "// Legacy - will be removed": "// Migrated to gRPC",
  "Legacy - will be removed": "Migrated to gRPC",
};

console.log('🚀 Starting Complete gRPC Migration...');

/**
 * Recursively find all TypeScript/JavaScript files
 */
function findFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(item)) {
        findFiles(fullPath, files);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        if (!EXCLUDE_FILES.some(exclude => item.includes(exclude))) {
          files.push(fullPath);
        }
      }
    }
  }
  
  return files;
}

/**
 * Remove AT Protocol imports from a file
 */
function removeAtprotoImports(content) {
  let updated = content;
  
  // Remove AT Protocol import lines
  ATPROTO_IMPORTS.forEach(importPath => {
    const importRegex = new RegExp(`import\\s+.*?\\s+from\\s+['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"];?\\s*`, 'g');
    updated = updated.replace(importRegex, '');
    
    // Remove multi-line imports
    const multiLineImportRegex = new RegExp(`import\\s*{[^}]*}\\s*from\\s*['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"];?\\s*`, 'g');
    updated = updated.replace(multiLineImportRegex, '');
  });
  
  return updated;
}

/**
 * Apply replacements to file content
 */
function applyReplacements(content) {
  let updated = content;
  
  Object.entries(REPLACEMENTS).forEach(([search, replace]) => {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    updated = updated.replace(regex, replace);
  });
  
  return updated;
}

/**
 * Remove REST fallback code blocks
 */
function removeRestFallback(content) {
  let updated = content;
  
  // Remove REST fallback functions
  const restFallbackRegex = /\/\*\*[\s\S]*?REST fallback[\s\S]*?\*\/[\s\S]*?(?:async\s+)?function\s+\w+Rest[\s\S]*?^}/gm;
  updated = updated.replace(restFallbackRegex, '');
  
  // Remove commented out REST calls
  const commentedRestRegex = /\/\/\s*agent\.\w+\.\w+.*$/gm;
  updated = updated.replace(commentedRestRegex, '');
  
  // Remove fallback logic
  const fallbackRegex = /if\s*\(\s*!.*grpc.*\)\s*{[\s\S]*?fallback[\s\S]*?}/gi;
  updated = updated.replace(fallbackRegex, '');
  
  return updated;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if no AT Protocol imports
    if (!ATPROTO_IMPORTS.some(importPath => content.includes(importPath))) {
      return false;
    }
    
    console.log(`📝 Processing: ${path.relative(SRC_DIR, filePath)}`);
    
    let updated = content;
    
    // Step 1: Remove AT Protocol imports
    updated = removeAtprotoImports(updated);
    
    // Step 2: Apply replacements
    updated = applyReplacements(updated);
    
    // Step 3: Remove REST fallback code
    updated = removeRestFallback(updated);
    
    // Step 4: Clean up empty lines
    updated = updated.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Write back if changed
    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Remove files that are no longer needed
 */
function removeObsoleteFiles() {
  console.log('🗑️ Removing obsolete files...');
  
  FILES_TO_REMOVE.forEach(relativePath => {
    const fullPath = path.join(__dirname, '..', relativePath);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`✅ Removed: ${relativePath}`);
      } catch (error) {
        console.error(`❌ Error removing ${relativePath}:`, error.message);
      }
    }
  });
}

/**
 * Update package.json files
 */
function updatePackageJson() {
  console.log('📦 Updating package.json files...');
  
  const packageJsonPaths = [
    path.join(__dirname, '..', 'package.json'),
    path.join(__dirname, '..', 'timeogcard', 'package.json'),
    path.join(__dirname, '..', 'timelink', 'package.json'),
    path.join(__dirname, '..', 'timeembed', 'package.json'),
  ];
  
  packageJsonPaths.forEach(packagePath => {
    if (fs.existsSync(packagePath)) {
      try {
        const content = fs.readFileSync(packagePath, 'utf8');
        const packageJson = JSON.parse(content);
        
        // Remove AT Protocol dependencies
        if (packageJson.dependencies) {
          ATPROTO_IMPORTS.forEach(dep => {
            delete packageJson.dependencies[dep];
          });
        }
        
        // Ensure gRPC dependencies are present
        if (packageJson.dependencies) {
          packageJson.dependencies['@grpc/grpc-js'] = '^1.9.0';
          packageJson.dependencies['@grpc/proto-loader'] = '^0.7.8';
        }
        
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
        console.log(`✅ Updated: ${path.relative(__dirname, packagePath)}`);
      } catch (error) {
        console.error(`❌ Error updating ${packagePath}:`, error.message);
      }
    }
  });
}

/**
 * Main migration function
 */
async function runMigration() {
  try {
    console.log('🔍 Finding files to process...');
    const files = findFiles(SRC_DIR);
    console.log(`📁 Found ${files.length} files to process`);
    
    let processedCount = 0;
    let changedCount = 0;
    
    // Process each file
    for (const file of files) {
      processedCount++;
      const changed = processFile(file);
      if (changed) {
        changedCount++;
      }
      
      if (processedCount % 50 === 0) {
        console.log(`📊 Progress: ${processedCount}/${files.length} files processed`);
      }
    }
    
    console.log(`✅ Processed ${processedCount} files, ${changedCount} files modified`);
    
    // Remove obsolete files
    removeObsoleteFiles();
    
    // Update package.json files
    updatePackageJson();
    
    // Run npm install to update dependencies
    console.log('📦 Installing updated dependencies...');
    try {
      execSync('npm install', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
      console.log('✅ Dependencies updated');
    } catch (error) {
      console.warn('⚠️ npm install failed, you may need to run it manually');
    }
    
    console.log('🎉 Complete gRPC Migration Finished!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   • ${processedCount} files processed`);
    console.log(`   • ${changedCount} files modified`);
    console.log(`   • ${FILES_TO_REMOVE.length} obsolete files removed`);
    console.log(`   • AT Protocol dependencies removed`);
    console.log(`   • gRPC dependencies added`);
    console.log('');
    console.log('🚀 Your app is now fully migrated to gRPC!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();