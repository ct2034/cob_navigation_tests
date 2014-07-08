#!/usr/bin/env python
import roslib
import rospy
roslib.load_manifest('tf')
from tf2_msgs.msg import TFMessage
import tf

def callback_gttf(data):
    #rospy.loginfo(rospy.get_caller_id()+"I heard gt_tf %s",data)
    rospy.loginfo("gt_tf\n")
    
def callback_tf(data):
    #rospy.loginfo(rospy.get_caller_id()+"I heard tf %s",data)
    rospy.loginfo("tf\n")
    
def listener():
    rospy.init_node('tf_remapper', anonymous=True)

    rospy.Subscriber("tf", TFMessage, callback_tf)
    tf_pub = rospy.Publisher('tf', TFMessage, queue_size=1)
    rospy.loginfo("---> Set up listener to tf succesfully !!")

    rospy.Subscriber("gt_tf", TFMessage, callback_gttf)
    gttf_pub = rospy.Publisher('gt_tf', TFMessage, queue_size=1)
    rospy.loginfo("---> Set up listener to gt_tf succesfully !!")

    rospy.spin()
        
if __name__ == '__main__':
    listener()
