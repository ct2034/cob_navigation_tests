#!/usr/bin/env python
import roslib
import rospy
roslib.load_manifest('tf')
from tf2_msgs.msg import TFMessage
from geometry_msgs.msg import TransformStamped
import tf

class TfRepub:
        
        
    #   GROUND TRUTH TF --> NORMAL TF  
    def callback_gttf(self, data):
        tf_msg = TFMessage()
        for tf in data.transforms:
            for frame in self.frames_out:
                if (frame == tf.header.frame_id) \
                and self.is_new(tf.header.stamp, frame):
                    tf.header.frame_id = self.prefix + tf.header.frame_id
                    tf.header.stamp = rospy.Time.now()
                    self.last_msg[frame] = rospy.Time.now()
                    tf_msg.transforms.append(tf)
                if (frame == tf.child_frame_id) \
                and self.is_new(tf.header.stamp, frame):
                    tf.child_frame_id = self.prefix + tf.child_frame_id
                    tf.header.stamp = rospy.Time.now()
                    self.last_msg[frame] = rospy.Time.now()
                    tf_msg.transforms.append(tf)
        self.tf_pub.publish(tf_msg)
        #rospy.loginfo(tf_msg)
        
        
    #   NORMAL TF --> GROUND TRUTH TF    
    def callback_tf(self, data):
        tf_msg = TFMessage()
        for tf in data.transforms:
            for frame in self.frames_in:
                if ((frame == tf.header.frame_id) or (frame == tf.child_frame_id)) \
                and self.is_new(tf.header.stamp, frame):
                    tf.header.stamp = rospy.Time.now()
                    self.last_msg[frame] = rospy.Time.now()
                    tf_msg.transforms.append(tf)
        self.gttf_pub.publish(tf_msg)
        #rospy.loginfo("tf")
        
        
    def is_new(self, time, frame):
        return (time != self.last_msg[frame])
        
        
    def __init__(self):
        rospy.init_node('tf_repub', anonymous=True)
        
        self.frame_odom = ["/odom_combined"]
        self.frame_base = ["/base_footprint"]
        self.frame_global = ["/map"]
        self.frame_gt = ["/gazebo_gt"]
        
        self.last_msg = dict.fromkeys( self.frames_in )
        
        self.prefix = "gt_"

        self.tf_list = tf.TransformListener()
        rospy.Subscriber("tf", TFMessage, self.callback_tf)
        rospy.loginfo("---> Set up listener to tf succesfully !!")

        self.tf_pub = tf.TransformBroadcaster()
        rospy.Subscriber("gt_tf", TFMessage, self.callback_gttf)
        rospy.loginfo("---> Set up publisher to tf succesfully !!")

        while not rospy.is_shutdown():
            try:
                (trans,rot) = listener.lookupTransform('/turtle2', '/turtle1', rospy.Time(0))
            except (tf.LookupException, tf.ConnectivityException, tf.ExtrapolationException):
                continue  

        rospy.spin()
    
        
if __name__ == '__main__':
    tf_repub = TfRepub()
