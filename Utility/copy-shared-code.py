############################################################
# IMPORTS
############################################################

import os
import shutil

############################################################
# FUNCTIONS
############################################################

def copy_shared_code():
    """"Copy js and css folders to Resources."""

    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    shared_dir = os.path.join(root_dir, "Source", "Shared")
    desktop_resources_dir = os.path.join(root_dir, "Source", "Desktop", "Resources")

    js_source = os.path.join(shared_dir, "JS")
    css_source = os.path.join(shared_dir, "CSS")
    if not os.path.exists(js_source) or not os.path.exists(css_source):
      print("Error: 'js' or 'css' folder not found in Shared directory.")
      return

    if not os.path.exists(desktop_resources_dir):
      print("Error: Resources folder not found in Desktop directory.")
      return

    js_dest = os.path.join(desktop_resources_dir, "JS")
    if os.path.exists(js_dest):
      shutil.rmtree(js_dest)
    shutil.copytree(js_source, js_dest)
    print(f"Copied 'js' folder to {js_dest}")

    css_dest = os.path.join(desktop_resources_dir, "CSS")
    if os.path.exists(css_dest):
        shutil.rmtree(css_dest)
    shutil.copytree(css_source, css_dest)
    print(f"Copied 'css' folder to {css_dest}")

############################################################
# MAIN
############################################################

if __name__ == "__main__":
  copy_shared_code()

############################################################