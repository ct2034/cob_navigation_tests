import roslib
roslib.load_manifest( 'navigation_test_helper' )

import rospy, tf
from threading import Thread, RLock
import time

class TFDiffObserver( Thread ):
    def __init__( self, topicNameA, topicNameB, dT=1 ):
        Thread.__init__( self )
        self._topicNameA = topicNameA
        self._topicNameB = topicNameB
        self._tfListener = None
        self._lock       = RLock()
        self._active     = True
        self._dT         = dT
        self._deltas     = []

    def initialize( self, timeout=None ):
        if not timeout:
            while not rospy.is_shutdown() and not self.isInitialized():
                self._initializeOnce( 5 )
        else:
            self._initializeOnce( timeout )


    def isInitialized( self ):
        with self._lock:
            return self._tfListener != None

    def _initializeOnce( self, timeout=5.0 ):
        with self._lock:
            if self.isInitialized(): return True
            try:
                self._tfListener = tf.TransformListener()
                self._tfListener.waitForTransform( self._topicNameA,
                        self._topicNameB, rospy.Time( 0 ),
                        rospy.Duration( timeout ))
                return True
            except tf.Exception,e:
                print 'Could not get transformation from %s to %s within timeout %s' % (
                        self._topicNameA, self._topicNameB, timeout )
                return False

    def run( self ):
        self.initialize()
        while not rospy.is_shutdown() and self.isActive():
            timestamp   = rospy.Time.now().to_sec()
            dPos, dQuat = self._tfListener.lookupTransform(
                self._topicNameA, self._topicNameB, rospy.Time( 0 ))
            self._storeDelta( timestamp, dPos, dQuat )
            time.sleep( self._dT )

    def _storeDelta( self, timestamp, dPos, dQuat ):
        dEuler = tf.transformations.euler_from_quaternion( dQuat )
        self._deltas.append( ( timestamp, dPos[ 0 ], dPos[ 1 ], dEuler[ 2 ]))


    def isActive( self ):
        with self._lock:
            return self._active

    def stop( self ):
        with self._lock:
            self._active = False

    def serialize( self ):
        return self._deltas[:]