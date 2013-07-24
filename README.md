Navigation Test
===============

## Todo

#### High Priority
- Include ~~video and~~ map topics into bag file
- Move generic launchfile settings into seperate yaml file. 
  Eventually only the four arguments exclude cob specific parameter, robot, navigation, scenario_name, yaml_config are passed to navigation_test_skeleton
- In case of an error, display the actual metrics of the test ( distance, duration, rotation )
- Start / Stop Service for bagrecorder and collision detection
- Include Dummy Prepare Robot Service that does nothing and set it as default
- Include Parameter to dynamically configure recorded camera topics

##### Mid Priority
- Adjustable video frequency
- Include ros dependency for avconv in github.org/ros/rosdistro
- Sometimes a collision is detected on initial simulation startup due to the robot falling on the ground
- Pass array of bumper topics to navigation_test_collisions
- Highlight error messages thrown during startup (e.g. bagPath not writable)

#### Implemented
- ~~Create navigation_test_video_publisher that serves as a gateway between fileserver and webserver~~
- ~~Distinguish between navigation component results (aborted and other)~~
- ~~Distinguish between failure and error in rostset~~
- ~~Fix application developer view in component_catalogue~~
- ~~Enhance bag_recorder to ignore non-published topics~~
- ~~Update component catalogue filter to display the last x results globally ( not for each series )~~
- ~~Make navigation_test_analysis a daemon waiting for new bag files~~
- ~~Record video file in navigation_test_analysis and upload to seperate fileserver~~
