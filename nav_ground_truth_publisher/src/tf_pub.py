#!/usr/bin/env python
import roslib
import rospy
roslib.load_manifest('tf')
from tf2_msgs.msg import TFMessage
from geometry_msgs.msg import TransformStamped
from geometry_msgs.msg import PoseWithCovarianceStamped
import tf

class TfPub:
    def __init__(self):
        rospy.init_node('gt_tf_pub', anonymous=True)
        self.PoseTopic = rospy.get_param('~pose_topic')
        self.BaseFrame = rospy.get_param('~base_frame')
        self.GlobalFrame = rospy.get_param('~global_frame')
        
        rospy.Subscriber(self.PoseTopic, PoseWithCovarianceStamped, self.callback)
        rospy.loginfo("---> Set up Listener to " + self.PoseTopic + " succesfully !!")
        self.tf_br = tf.TransformBroadcaster()
        rospy.loginfo("---> Set up TransformBroadcaster succesfully !!")
        

    def callback(self, msg):
        transf = TransformStamped
        self.tf_br.sendTransform((msg.pose.pose.position.x, msg.pose.pose.position.y, msg.pose.pose.position.z),
                                 (msg.pose.pose.orientation.x, msg.pose.pose.orientation.y, msg.pose.pose.orientation.z, msg.pose.pose.orientation.w), 
                                 rospy.Time.now(),
                                 self.BaseFrame,
                                 self.GlobalFrame)
        rospy.loginfo("new tf published " + self.BaseFrame)
    
        
if __name__ == '__main__':
    tf_pub = TfPub()
    
    rospy.spin()
