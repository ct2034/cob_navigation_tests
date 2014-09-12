# Run navigation tests

There is three ways to use the navigation tests: 
  1. simulation on your local machine 
  2. tests on a real robot and
  3. simulation on a jenkins continuous integration server.

## local simulation test

1. Create a testing workspace
´´´bash
mkdir -p ~/ros/testing_ws/src
cd ~/ros/testing_ws
catkin_init_workspace 
´´´

2. Make sure to clone the following sources:
  * 
