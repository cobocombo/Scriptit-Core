###################################################

#!/usr/bin/env python3
"""
Scriptit-Core GitHub Release Notes Generator

This script generates formatted markdown release notes for a given
Scriptit-Core GitHub repository milestone.

Features:
- Fetches issues for a specified milestone
- Groups issues by predefined labels
- Skips pull requests
- Formats output as clean markdown
- Optionally copies output to the system clipboard (--copy)

Usage:
  python release-notes-generator.py -m <milestone_number> [--copy]
"""

###################################################

import requests
import argparse
import sys
import subprocess

###################################################

OWNER = "cobocombo"
REPO = "Scriptit-Core"

###################################################

def get_args():
  """
  Parse and validate command line arguments.

  Requires a milestone number via -m / --milestone.
  Optionally accepts --copy to copy output to clipboard.

  Exits with usage information if milestone is missing or invalid.
  """
  parser = argparse.ArgumentParser(description="Generate GitHub release notes by milestone")
  parser.add_argument("-m","--milestone", help="Milestone number (must be a number)")
  parser.add_argument("--copy", action="store_true", help="Copy output to clipboard")

  args = parser.parse_args()

  if not args.milestone or not args.milestone.isdigit():
    parser.print_usage()
    sys.exit(1)
  return args

def main():
  """
  Fetch GitHub issues for a given milestone and generate formatted release notes.

  - Groups issues by predefined labels
  - Skips pull requests
  - Formats output as markdown
  - Optionally copies output to clipboard when --copy is used
  """
  args = get_args()
  milestone_number = args.milestone
  labels_order = ["bug", "documentation", "enhancement", "techdebt"]

  url = f"https://api.github.com/repos/{OWNER}/{REPO}/issues"
  params = {
    "milestone": milestone_number,
    "state": "all",
    "per_page": 100
  }

  response = requests.get(url, params=params)
  issues = response.json()
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

  print(output)

  if args.copy:
    try:
      subprocess.run("pbcopy", input=output.encode(), check=True)
      print("📋 Copied to clipboard!")
    except Exception as e:
      print(f"❌ Failed to copy to clipboard: {e}")

###################################################

if __name__ == "__main__":
  main()
  
###################################################
