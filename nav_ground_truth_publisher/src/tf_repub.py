#!/usr/bin/env python
import roslib
import rospy
roslib.load_manifest('tf')
from tf2_msgs.msg import TFMessage
from geometry_msgs.msg import TransformStamped
import tf

class TfRepub:
        
    def __init__(self):
        rospy.init_node('tf_repub', anonymous=True)
        
        self.frame_odom = "/odom_combined"
        self.frame_odom_gt = "/odom_gt"
        self.frame_base = "/base_footprint"
        self.frame_global = "/map"
        self.frame_gt = "/gazebo_gt"
        self.rate = 10.0
        
        self.tf_list = tf.TransformListener()
        #rospy.Subscriber("tf", TFMessage, self.callback_tf)
        rospy.loginfo("---> Set up tfListener succesfully !!")
        self.tf_br = tf.TransformBroadcaster()
        rospy.loginfo("---> Set up tfBroadcaster succesfully !!")

        #self.tf_pub = tf.TransformBroadcaster()
        #rospy.Subscriber("gt_tf", TFMessage, self.callback_gttf)
        #rospy.loginfo("---> Set up publisher to tf succesfully !!")

        rate = rospy.Rate(self.rate)
        
        while not rospy.is_shutdown():
            try:
                (trans,rot) = self.tf_list.lookupTransform(self.frame_odom, self.frame_base, rospy.Time(0))
                print trans[0]
                
            except (tf.LookupException, tf.ConnectivityException, tf.ExtrapolationException) as e:
                print "a tf Exception occured ..."
                continue  
                
            #print "Callback trans[0] : " + str( trans[0] )
            self.tf_br.sendTransform(trans, rot, rospy.Time.now(), self.frame_odom, self.frame_gt)
            
            rate.sleep()

        rospy.spin()
        
      
    
        
if __name__ == '__main__':
    tf_repub = TfRepub()
