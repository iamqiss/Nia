#!/usr/bin/env python3
import os
import re
import sys
from pathlib import Path

def replace_in_file(file_path, replacements):
    """Replace text in a file based on replacement dictionary"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original_content = content
        
        # Apply all replacements
        for old_text, new_text in replacements.items():
            content = re.sub(old_text, new_text, content, flags=re.IGNORECASE)
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated: {file_path}")
            return True
        return False
        
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")
        return False

def rename_files_and_dirs(root_path, replacements):
    """Rename files and directories based on replacement patterns"""
    renamed_items = []
    
    # Walk through all files and directories (bottom-up for directories)
    for root, dirs, files in os.walk(root_path, topdown=False):
        # Rename files first
        for file_name in files:
            new_name = file_name
            for old_text, new_text in replacements.items():
                new_name = re.sub(old_text, new_text, new_name, flags=re.IGNORECASE)
            
            if new_name != file_name:
                old_path = os.path.join(root, file_name)
                new_path = os.path.join(root, new_name)
                try:
                    os.rename(old_path, new_path)
                    renamed_items.append(f"File: {old_path} → {new_path}")
                    print(f"✓ Renamed file: {file_name} → {new_name}")
                except Exception as e:
                    print(f"✗ Error renaming file {old_path}: {e}")
        
        # Rename directories
        for dir_name in dirs:
            new_name = dir_name
            for old_text, new_text in replacements.items():
                new_name = re.sub(old_text, new_text, new_name, flags=re.IGNORECASE)
            
            if new_name != dir_name:
                old_path = os.path.join(root, dir_name)
                new_path = os.path.join(root, new_name)
                try:
                    os.rename(old_path, new_path)
                    renamed_items.append(f"Directory: {old_path} → {new_path}")
                    print(f"✓ Renamed directory: {dir_name} → {new_name}")
                except Exception as e:
                    print(f"✗ Error renaming directory {old_path}: {e}")
    
    return renamed_items

def get_file_extensions():
    """Return file extensions to process"""
    return [
        # JavaScript/TypeScript
        '.js', '.jsx', '.ts', '.tsx',
        # React Native
        '.json', '.metro.config.js',
        # C++
        '.cpp', '.cc', '.cxx', '.c++',
        '.h', '.hpp', '.hh', '.hxx',
        # Build files
        '.cmake', '.txt',  # CMakeLists.txt
        # Config files
        '.yaml', '.yml', '.toml', '.ini', '.conf',
        # Documentation
        '.md', '.rst', '.txt',
        # Package files
        '.xml',  # Android manifest
        '.plist', # iOS plist files
        # Other common
        '.py', '.sh', '.bat',
    ]

def should_process_file(file_path):
    """Check if file should be processed"""
    file_path = Path(file_path)
    
    # Skip binary files and common ignore patterns
    ignore_patterns = [
        'node_modules', '.git', 'build', 'dist', 'target',
        '__pycache__', '.pytest_cache', 'coverage',
        '.vscode', '.idea', '.DS_Store',
        'Thumbs.db', '*.log', '*.tmp'
    ]
    
    # Check if file is in ignored directory
    for pattern in ignore_patterns:
        if pattern in str(file_path):
            return False
    
    # Check file extension
    return file_path.suffix.lower() in get_file_extensions()

def rename_bluesky_to_time():
    """Main function to rename Bluesky to Time across the entire project"""
    
    print("🚀 Starting Bluesky → Time renaming process...")
    print("=" * 60)
    
    # Get current directory or ask user
    current_dir = os.getcwd()
    project_root = input(f"Enter project root path (or press Enter for current: {current_dir}): ").strip()
    
    if not project_root:
        project_root = current_dir
    
    if not os.path.exists(project_root):
        print(f"❌ Error: Directory {project_root} does not exist!")
        sys.exit(1)
    
    # Define all replacements
    replacements = {
        # Bluesky replacements (case-insensitive)
        r'\bbluesky\b': 'Time',
        r'\bBluesky\b': 'Time',
        r'\bBLUESKY\b': 'TIME',
        r'\bblue-sky\b': 'time',
        r'\bBlue-Sky\b': 'Time',
        
        # Package/Bundle identifiers
        r'com\.bluesky\b': 'com.time',
        r'app\.bluesky\b': 'app.time',
        
        # Sonet replacements (for C++ namespaces)
        r'\bsonet\b': 'time',
        r'\bSonet\b': 'Time', 
        r'\bSONET\b': 'TIME',
        
        # Namespace declarations
        r'namespace\s+sonet': 'namespace time',
        r'namespace\s+Sonet': 'namespace Time',
        r'namespace\s+SONET': 'namespace TIME',
        
        # Using statements
        r'using\s+namespace\s+sonet': 'using namespace time',
        r'using\s+namespace\s+Sonet': 'using namespace Time',
        r'using\s+namespace\s+SONET': 'using namespace TIME',
        
        # Scope resolution
        r'\bsonet::': 'time::',
        r'\bSonet::': 'Time::',
        r'\bSONET::': 'TIME::',
        
        # Common variations
        r'sonet_': 'time_',
        r'Sonet_': 'Time_',
        r'SONET_': 'TIME_',
    }
    
    print(f"📁 Processing directory: {project_root}")
    print(f"🔍 Will process files with extensions: {', '.join(get_file_extensions())}")
    print()
    
    # Confirm before proceeding
    confirm = input("⚠️  This will modify files in place. Continue? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ Operation cancelled.")
        sys.exit(0)
    
    print("\n🔄 Step 1: Updating file contents...")
    print("-" * 40)
    
    # Process all files
    files_updated = 0
    files_processed = 0
    
    for root, dirs, files in os.walk(project_root):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            
            if should_process_file(file_path):
                files_processed += 1
                if replace_in_file(file_path, replacements):
                    files_updated += 1
    
    print(f"\n📊 Content Update Summary:")
    print(f"   Files processed: {files_processed}")
    print(f"   Files updated: {files_updated}")
    
    print("\n🔄 Step 2: Renaming files and directories...")
    print("-" * 40)
    
    # Rename files and directories
    renamed_items = rename_files_and_dirs(project_root, {
        r'\bbluesky\b': 'time',
        r'\bBluesky\b': 'Time',
        r'\bsonet\b': 'time',
        r'\bSonet\b': 'Time',
    })
    
    print(f"\n📊 Rename Summary:")
    print(f"   Items renamed: {len(renamed_items)}")
    
    if renamed_items:
        print("\n📝 Renamed items:")
        for item in renamed_items[:10]:  # Show first 10
            print(f"   {item}")
        if len(renamed_items) > 10:
            print(f"   ... and {len(renamed_items) - 10} more")
    
    print("\n" + "=" * 60)
    print("✅ Renaming complete!")
    print("\n🔍 Next steps:")
    print("   1. Check your build configuration files")
    print("   2. Update any hardcoded paths or URLs")
    print("   3. Update documentation and README files")
    print("   4. Test compilation for both React Native and C++ projects")
    print("   5. Update app store listings and metadata")
    print("\n💡 Pro tip: Search for any remaining 'bluesky' or 'sonet' references manually!")

def main():
    try:
        rename_bluesky_to_time()
    except KeyboardInterrupt:
        print("\n\n❌ Operation cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
