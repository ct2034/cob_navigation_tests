#!/usr/bin/env python
# creates a relay to a python script source file, acting as that file.
# The purpose is that of a symlink
with open("/home/ch/ros/hydro_ws/src/navigation_test_helper/src/git.py", 'r') as fh:
    exec(fh.read())
