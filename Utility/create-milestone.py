############################################################

#!/usr/bin/env python3
"""
create-milestone.py

Create a GitHub milestone for the Scriptit-Core repository.

Requirements:
- Must be run from the Utility folder
- Requires a GitHub personal access token stored in github-token.txt

Usage:
  python create-milestone.py --name "v1.10" --description "New release" --date "2026-05-01"
"""

############################################################

import os
import sys
import argparse
import requests

############################################################

OWNER = "cobocombo"
REPO = "Scriptit-Core"
TOKEN_FILE = "github-token.txt"

############################################################

def fail(message):
  """ Print error message and exit. """
  
  print(f"❌ {message}")
  sys.exit(1)

########################################
  
def status(message):
  """ Print status message. """
  
  print(f"➡️  {message}")
  
########################################

def get_args():
  """ Parse CLI arguments. """
  
  parser = argparse.ArgumentParser(description="Create GitHub milestone")
  parser.add_argument("--name", required=True, help="Milestone name")
  parser.add_argument("--description", required=True, help="Milestone description")
  parser.add_argument("--date", required=True, help="Due date (YYYY-MM-DD)")
  return parser.parse_args()
  
########################################

def validate_environment():
  """ Ensure script is run from Utility folder. """
  
  current_dir = os.getcwd()
  if os.path.basename(current_dir) != "Utility":
    fail("Script must be run from the Utility folder.")

########################################
    
def get_token():
  """ Read GitHub token from file. """
  
  if not os.path.isfile(TOKEN_FILE):
    fail("github-token.txt not found in Utility folder.")
  with open(TOKEN_FILE, "r") as f:
    token = f.read().strip()
  if not token:
    fail("GitHub token file is empty.")
  return token

########################################  
  
def create_milestone(name, description, date, token):
  """ Call GitHub API to create a milestone. """
  
  url = f"https://api.github.com/repos/{OWNER}/{REPO}/milestones"

  headers = {
    "Authorization": f"token {token}",
    "Accept": "application/vnd.github+json"
  }

  data = {
    "title": name,
    "description": description,
    "due_on": f"{date}T00:00:00Z"
  }

  response = requests.post(url, headers=headers, json=data)

  if response.status_code != 201:
    fail(f"GitHub API error: {response.status_code} - {response.text}")

  status("Milestone created successfully! ✅")

###################################################

def main():
  """ Main execution flow. """
  
  validate_environment()
  args = get_args()
  token = get_token()

  status("Creating milestone...")
  create_milestone(args.name, args.description, args.date, token)

###################################################

if __name__ == "__main__":
  main()

###################################################