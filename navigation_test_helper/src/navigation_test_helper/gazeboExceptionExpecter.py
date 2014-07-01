#!/usr/bin/env python
import roslib, math
import rospy, rostopic

if __name__ == '__main__':
  rospy.init_node('gazeboExceptionExpecter', anonymous=True)
  try:
    rospy.loginfo( "running sim here! Rob (wo~): " )
    robot = rospy.get_param( 'robot' ) 
    rospy.loginfo( robot )
    rospy.loginfo( "running sim here! Rob (with~): " )
    robot = rospy.get_param( '~robot' ) 
    rospy.loginfo( robot )
  except KeyError as e:
    rospy.loginfo( "Got a KeyError from Gazebo as expected:")
    rospy.loginfo( e)
    pass

