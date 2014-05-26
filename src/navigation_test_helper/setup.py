#!/usr/bin/env python

from distutils.core import setup
from catkin_pkg.python_setup import generate_distutils_setup

d = generate_distutils_setup(
   ##  don't do this unless you want a globally visible script
   scripts=['src/git.py'], 
   packages=['navigation_test_helper'],
   package_dir={'': 'src'}
)

setup(**d)

## this is creates according to http://wiki.ros.org/catkin/migrating_from_rosbuild and http://docs.ros.org/api/catkin/html/user_guide/setup_dot_py.html
