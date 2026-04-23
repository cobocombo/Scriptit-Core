###################################################

#!/usr/bin/env python3
"""
generate-new-release.py

Create a new GitHub release for Scriptit-Core.

Features:
- Creates a git tag
- Generates release notes from a milestone
- Uses milestone title as release name
- Publishes a GitHub release
- Opens release URL automatically
- Closes the milestone
- Prevents duplicate tags
- Prevents using closed milestones

Requirements:
- Must be run from Utility folder
- Requires github-token.txt

Usage:
  python generate-new-release.py --tag v1.10 --description "Release desc" --milestone 12
"""

############################################################

import os
import sys
import argparse
import requests
import subprocess

###################################################

OWNER = "cobocombo"
REPO = "Scriptit-Core"
TOKEN_FILE = "github-token.txt"

###################################################

def fail(message):
  """Print error message and exit."""
  
  print(f"❌ {message}")
  sys.exit(1)
  
########################################

def status(message):
  """Print status message."""
  
  print(f"➡️  {message}")

########################################
  
def get_args():
  """Parse and validate CLI arguments."""
  
  parser = argparse.ArgumentParser(description="Generate new GitHub release")
  parser.add_argument("--tag", required=True, help="Tag name (e.g. v1.10)")
  parser.add_argument("--description", required=True, help="Release description")
  parser.add_argument("--milestone", required=True, help="Milestone number")

  args = parser.parse_args()

  if not args.milestone.isdigit():
    fail("Milestone must be a number.")

  return args
  
########################################

def validate_environment():
  """Ensure script is run from Utility folder."""
  
  if os.path.basename(os.getcwd()) != "Utility":
    fail("Script must be run from the Utility folder.")
    
########################################

def get_token():
  """Read GitHub token from file."""
  
  if not os.path.isfile(TOKEN_FILE):
    fail("github-token.txt not found.")

  with open(TOKEN_FILE, "r") as f:
    token = f.read().strip()

  if not token:
    fail("GitHub token is empty.")

  return token

########################################

def get_milestone_info(milestone, token):
  """Fetch milestone title and validate it is open."""
  
  url = f"https://api.github.com/repos/{OWNER}/{REPO}/milestones/{milestone}"
  headers = {"Authorization": f"token {token}"}

  response = requests.get(url, headers=headers)

  if response.status_code != 200:
    fail("Failed to fetch milestone.")

  data = response.json()

  if data.get("state") == "closed":
    fail("Milestone is already closed.")

  return data["title"]

########################################

def tag_exists(tag, token):
  """Check if a tag already exists."""
  
  url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/ref/tags/{tag}"
  headers = {"Authorization": f"token {token}"}

  response = requests.get(url, headers=headers)

  return response.status_code == 200

########################################

def get_default_branch_sha(token):
  """Get the latest commit SHA of the default branch."""
  
  url = f"https://api.github.com/repos/{OWNER}/{REPO}"
  headers = {"Authorization": f"token {token}"}

  repo_data = requests.get(url, headers=headers).json()
  default_branch = repo_data.get("default_branch")

  if not default_branch:
    fail("Could not determine default branch.")

  branch_url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/ref/heads/{default_branch}"
  branch_data = requests.get(branch_url, headers=headers).json()

  return branch_data["object"]["sha"]
  
########################################  

def create_tag(tag, sha, token):
  """Create a new git tag in the repository."""
  
  if tag_exists(tag, token):
    fail(f"Tag '{tag}' already exists.")

  status(f"Creating tag {tag}...")

  url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/refs"
  headers = {"Authorization": f"token {token}"}

  data = {
    "ref": f"refs/tags/{tag}",
    "sha": sha
  }

  response = requests.post(url, headers=headers, json=data)

  if response.status_code != 201:
    fail(f"Failed to create tag: {response.text}")

  status("Tag created.")

########################################

def generate_release_notes(milestone, token):
  """Generate formatted release notes for a milestone."""
  
  status("Generating release notes...")
  labels_order = ["bug", "documentation", "enhancement", "techdebt"]

  url = f"https://api.github.com/repos/{OWNER}/{REPO}/issues"
  params = {
    "milestone": milestone,
    "state": "all",
    "per_page": 100
  }

  headers = {"Authorization": f"token {token}"}
  issues = requests.get(url, headers=headers, params=params).json()

  output = "# Release Notes\n\n"

  for label in labels_order:
    section = []

    for issue in issues:
      if "pull_request" in issue:
        continue

      issue_labels = [l["name"] for l in issue.get("labels", [])]

      if label in issue_labels:
        section.append(f"#{issue['number']}: {issue['title']}")

    if section:
      formatted_label = label.capitalize()
      if len(section) > 1:
        formatted_label += "s"

      output += f"## {formatted_label}\n\n"
      output += "\n".join(section) + "\n\n"

  return output

########################################

def create_release(tag, name, description, body, token):
  """Create and publish a GitHub release."""
  
  status("Creating GitHub release...")

  url = f"https://api.github.com/repos/{OWNER}/{REPO}/releases"
  headers = {"Authorization": f"token {token}"}

  data = {
    "tag_name": tag,
    "name": name,
    "body": f"{description}\n\n{body}",
    "draft": False,
    "prerelease": False
  }

  response = requests.post(url, headers=headers, json=data)

  if response.status_code != 201:
    fail(f"Failed to create release: {response.text}")

  release_data = response.json()
  release_url = release_data.get("html_url")

  status("Release published! 🚀")

  if release_url:
    status("Opening release in browser...")
    try:
      subprocess.run(["open", release_url])
    except Exception:
      print(f"🌐 {release_url}")

########################################

def close_milestone(milestone, token):
  """Close the specified milestone."""
  
  status("Closing milestone...")

  url = f"https://api.github.com/repos/{OWNER}/{REPO}/milestones/{milestone}"
  headers = {"Authorization": f"token {token}"}

  data = {"state": "closed"}

  response = requests.patch(url, headers=headers, json=data)

  if response.status_code != 200:
    fail(f"Failed to close milestone: {response.text}")

  status("Milestone closed.")

########################################

def main():
  """Execute the full release workflow."""
  
  validate_environment()
  args = get_args()
  token = get_token()

  milestone_title = get_milestone_info(args.milestone, token)

  sha = get_default_branch_sha(token)
  create_tag(args.tag, sha, token)

  notes = generate_release_notes(args.milestone, token)

  create_release(
    args.tag,
    milestone_title,
    args.description,
    notes,
    token
  )

  close_milestone(args.milestone, token)
  status("All done! ✅")

########################################

if __name__ == "__main__":
  main()

########################################