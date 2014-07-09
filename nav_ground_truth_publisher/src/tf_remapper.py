#!/usr/bin/env python
import roslib
import rospy
roslib.load_manifest('tf')
from tf2_msgs.msg import TFMessage
from geometry_msgs.msg import TransformStamped
import tf

# the genral ide on this is based on: http://answers.ros.org/question/175013/removingdeletingignoring-odom-tf-data/?answer=175018#post-id-175018

class TfRemapper:
        
        
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
        rospy.init_node('tf_remapper', anonymous=True)
        
        self.frames_in = ["map", "odom_combined", "base_footprint", "base_link"]
        self.frames_out = ["base_link"]
        
        self.last_msg = dict.fromkeys( self.frames_in )
        
        self.prefix = "gt_"

        self.tf_pub = rospy.Publisher('tf', TFMessage, queue_size=1)
        rospy.Subscriber("tf", TFMessage, self.callback_tf)
        rospy.loginfo("---> Set up listener to tf succesfully !!")

        self.gttf_pub = rospy.Publisher('gt_tf', TFMessage, queue_size=1)
        rospy.Subscriber("gt_tf", TFMessage, self.callback_gttf)
        rospy.loginfo("---> Set up listener to gt_tf succesfully !!")

        rospy.spin()
    
        
if __name__ == '__main__':
    tf_remapper = TfRemapper()
