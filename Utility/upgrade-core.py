###################################################

#!/usr/bin/env python3
"""
upgrade-core.py

Upgrade local Scriptit core files from the public GitHub repository.

This script is intended to be run from the Utility folder.

Workflow:
- Move from Utility -> ../Source/Scriptit.swiftpm
- Download Scriptit-Core from GitHub
- Extract archive
- Replace local iOS-Core folder
- Replace local Resources/JS-Core folder
- Clean up downloaded files
- Print progress throughout the process

Usage:
  python upgrade-core.py
"""

import os
import sys
import shutil
import zipfile
import tempfile
import requests

###################################################

REPO_ZIP_URL = "https://github.com/cobocombo/Scriptit-Core/archive/refs/heads/main.zip"

###################################################

def fail(message):
  """
  Print an error message and exit gracefully.
  """
  print(f"❌ {message}")
  sys.exit(1)

def status(message):
  """
  Print a progress status message.
  """
  print(f"➡️  {message}")

def remove_path(path):
  """
  Remove a file or folder if it exists.
  """
  if os.path.isdir(path):
    shutil.rmtree(path)
  elif os.path.isfile(path):
    os.remove(path)

def copy_folder(source, destination):
  """
  Replace destination folder with source folder contents.
  """
  remove_path(destination)
  shutil.copytree(source, destination)

def main():
  """
  Run the core upgrade process.
  """
  status("Starting core upgrade...")

  # Verify current folder
  current_dir = os.getcwd()
  current_name = os.path.basename(current_dir)

  if current_name != "Utility":
    fail("This script must be run from the Utility folder.")

  status(f"Current folder verified: {current_name}")

  # Build target path: ../Source/Scriptit.swiftpm
  parent_dir = os.path.dirname(current_dir)
  source_dir = os.path.join(parent_dir, "Source")
  scriptit_dir = os.path.join(source_dir, "Scriptit.swiftpm")

  if not os.path.isdir(source_dir):
    fail("Could not find Source folder one level above Utility.")

  if not os.path.isdir(scriptit_dir):
    fail("Could not find Scriptit.swiftpm inside Source.")

  status("Target folder located: Source/Scriptit.swiftpm")

  # Work inside Scriptit.swiftpm
  os.chdir(scriptit_dir)
  status("Changed directory to Scriptit.swiftpm")

  # Temp paths
  temp_dir = tempfile.mkdtemp(prefix="scriptit_upgrade_")
  zip_path = os.path.join(temp_dir, "core.zip")

  try:
    # Download zip
    status("Downloading Scriptit-Core from GitHub...")

    response = requests.get(REPO_ZIP_URL, stream=True)
    if response.status_code != 200:
      fail("Failed to download repository archive.")

    with open(zip_path, "wb") as file:
      for chunk in response.iter_content(chunk_size=8192):
        if chunk:
          file.write(chunk)

    status("Download complete.")

    # Extract zip
    status("Extracting archive...")

    with zipfile.ZipFile(zip_path, "r") as zip_ref:
      zip_ref.extractall(temp_dir)

    extracted_root = os.path.join(temp_dir, "Scriptit-Core-main")

    if not os.path.isdir(extracted_root):
      fail("Extracted repository folder not found.")

    status("Archive extracted.")

    # Source paths inside downloaded repo
    downloaded_swiftpm = os.path.join(
      extracted_root,
      "Source",
      "Scriptit-Core.swiftpm"
    )

    ios_core_source = os.path.join(downloaded_swiftpm, "iOS-Core")
    js_core_source = os.path.join(
      downloaded_swiftpm,
      "Resources",
      "JS-Core"
    )

    if not os.path.isdir(downloaded_swiftpm):
      fail("Missing Source/Scriptit-Core.swiftpm in downloaded repo.")

    if not os.path.isdir(ios_core_source):
      fail("Missing iOS-Core folder in downloaded repo.")

    if not os.path.isdir(js_core_source):
      fail("Missing Resources/JS-Core folder in downloaded repo.")

    # Local destination paths
    ios_core_dest = os.path.join(scriptit_dir, "iOS-Core")
    resources_dir = os.path.join(scriptit_dir, "Resources")
    js_core_dest = os.path.join(resources_dir, "JS-Core")

    if not os.path.isdir(resources_dir):
      fail("Missing local Resources folder inside Scriptit.swiftpm.")

    # Copy iOS-Core
    status("Updating local iOS-Core...")
    copy_folder(ios_core_source, ios_core_dest)
    status("iOS-Core updated.")

    # Copy JS-Core
    status("Updating local Resources/JS-Core...")
    copy_folder(js_core_source, js_core_dest)
    status("JS-Core updated.")

    status("Upgrade complete! ✅")

  finally:
    status("Cleaning up temporary files...")
    remove_path(temp_dir)
    status("Cleanup complete.")

###################################################

if __name__ == "__main__":
  main()

###################################################