#!/usr/bin/env python3

import os
import re
import uuid
import shutil
from pathlib import Path

def generate_uuid():
    """Generate a UUID for Xcode project file"""
    return str(uuid.uuid4()).upper().replace('-', '')

def add_files_to_xcode_project(project_path, generated_dir):
    """Add generated gRPC files to Xcode project"""
    
    # Read the project file
    with open(project_path, 'r') as f:
        content = f.read()
    
    # Create backup
    backup_path = project_path + '.backup'
    shutil.copy2(project_path, backup_path)
    print(f"Created backup: {backup_path}")
    
    # Find all generated files
    generated_files = []
    for root, dirs, files in os.walk(generated_dir):
        for file in files:
            if file.endswith(('.cc', '.h', '.swift')):
                rel_path = os.path.relpath(os.path.join(root, file), os.path.dirname(project_path))
                generated_files.append(rel_path)
    
    print(f"Found {len(generated_files)} generated files")
    
    # Generate UUIDs for new file references
    file_refs = {}
    build_files = {}
    
    for file_path in generated_files:
        file_uuid = generate_uuid()
        build_uuid = generate_uuid()
        
        file_refs[file_path] = file_uuid
        build_files[file_path] = build_uuid
    
    # Add file references to PBXFileReference section
    file_ref_section = "/* Begin PBXFileReference section */"
    file_ref_end = "/* End PBXFileReference section */"
    
    new_file_refs = []
    for file_path, file_uuid in file_refs.items():
        file_name = os.path.basename(file_path)
        file_type = "sourcecode.cpp.objcpp" if file_path.endswith('.cc') else "sourcecode.c.h" if file_path.endswith('.h') else "sourcecode.swift"
        
        new_file_refs.append(f'\t\t{file_uuid} /* {file_name} */ = {{isa = PBXFileReference; lastKnownFileType = {file_type}; name = {file_name}; path = {file_path}; sourceTree = "<group>"; }};')
    
    # Insert new file references
    start_pos = content.find(file_ref_section) + len(file_ref_section)
    end_pos = content.find(file_ref_end)
    
    if start_pos > len(file_ref_section) and end_pos > start_pos:
        before = content[:start_pos]
        after = content[end_pos:]
        middle = content[start_pos:end_pos]
        
        new_content = before + '\n' + '\n'.join(new_file_refs) + middle + after
    else:
        print("Could not find PBXFileReference section")
        return False
    
    # Add build files to PBXBuildFile section
    build_file_section = "/* Begin PBXBuildFile section */"
    build_file_end = "/* End PBXBuildFile section */"
    
    new_build_files = []
    for file_path, build_uuid in build_files.items():
        file_uuid = file_refs[file_path]
        file_name = os.path.basename(file_path)
        
        new_build_files.append(f'\t\t{build_uuid} /* {file_name} in Sources */ = {{isa = PBXBuildFile; fileRef = {file_uuid} /* {file_name} */; }};')
    
    # Insert new build files
    start_pos = new_content.find(build_file_section) + len(build_file_section)
    end_pos = new_content.find(build_file_end)
    
    if start_pos > len(build_file_section) and end_pos > start_pos:
        before = new_content[:start_pos]
        after = new_content[end_pos:]
        middle = new_content[start_pos:end_pos]
        
        new_content = before + '\n' + '\n'.join(new_build_files) + middle + after
    else:
        print("Could not find PBXBuildFile section")
        return False
    
    # Add files to Sources build phase
    sources_section = "/* Sources */ = {"
    sources_end = "};"
    
    # Find the Sources build phase
    sources_start = new_content.find(sources_section)
    if sources_start == -1:
        print("Could not find Sources build phase")
        return False
    
    # Find the end of the Sources build phase
    sources_end_pos = new_content.find(sources_end, sources_start)
    if sources_end_pos == -1:
        print("Could not find end of Sources build phase")
        return False
    
    # Add build file references to Sources
    before_sources = new_content[:sources_end_pos]
    after_sources = new_content[sources_end_pos:]
    
    sources_build_files = []
    for file_path, build_uuid in build_files.items():
        file_name = os.path.basename(file_path)
        sources_build_files.append(f'\t\t\t\t{build_uuid} /* {file_name} in Sources */,')
    
    new_content = before_sources + '\n' + '\n'.join(sources_build_files) + '\n\t\t\t' + after_sources
    
    # Write the modified project file
    with open(project_path, 'w') as f:
        f.write(new_content)
    
    print(f"Successfully added {len(generated_files)} files to Xcode project")
    print("Files added:")
    for file_path in generated_files:
        print(f"  - {file_path}")
    
    return True

def main():
    project_path = "/workspace/time-client/ios/Time.xcodeproj/project.pbxproj"
    generated_dir = "/workspace/time-client/ios/Time/Generated"
    
    if not os.path.exists(project_path):
        print(f"Project file not found: {project_path}")
        return 1
    
    if not os.path.exists(generated_dir):
        print(f"Generated directory not found: {generated_dir}")
        return 1
    
    try:
        success = add_files_to_xcode_project(project_path, generated_dir)
        if success:
            print("✅ Successfully added gRPC files to Xcode project")
            print("📝 Note: You may need to open the project in Xcode to verify the files were added correctly")
            return 0
        else:
            print("❌ Failed to add files to Xcode project")
            return 1
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

if __name__ == "__main__":
    exit(main())