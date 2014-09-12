# Run navigation tests

There is three ways to use the navigation tests: 
  1. simulation on your local machine 
  2. tests on a real robot and
  3. simulation on a jenkins continuous integration server.

## local simulation test

1. Create a testing workspace
```bash
mkdir -p ~/ros/testing_ws/src
cd ~/ros/testing_ws/src
catkin_init_workspace 
```

2. Make sure to clone the following sources:
  * `git clone git@github.com:ct2034/cob_navigation_tests.git`
  * `git clone -b jenkins git@github.com:ct2034/ros_comm.git` (this is a special branch containing only the changed package rostest, you won't need this for indigo, where the changes are already included)
  * If you want to run tests on IPA-Navigation (what you probably want):
  ```
  git clone git@github.com:ipa320/ipa_navigation.git
  git clone git@github.com:ipa320/ipa_navigation_localization.git
  git clone git@github.com:ipa320/ipa_navigation_planning.git
  git clone git@github.com:ipa320/ipa_navigation_driver.git
  git clone git@github.com:ipa320/ipa_navigation_common.git
  ```
3. The test configuration is stored in a designated package. 
  * To create your own: fork the example setup: [https://github.com/ct2034/my_navigation_test] 
  * and clone your configuration: `git clone git@github.com:<<MY_USER>>/<<MY_CONFIG>>.git` (which works also with the example setup)
  
4. Setup a path to store the bag files:
  * `mkdir -p ~/ros/bagFiles`
  * `export BAG_PATH='~/ros/bagFiles/'`
