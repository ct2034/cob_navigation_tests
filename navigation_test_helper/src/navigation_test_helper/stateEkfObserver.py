import roslib
roslib.load_manifest( 'navigation_test_helper' )

import rospy, tf
from threading import Thread, RLock
import time

import numpy, math

from geometry_msgs.msg import PoseWithCovarianceStamped

class StateEkfObserver( Thread ):
    def __init__( self, topicName, numPoints ):
        Thread.__init__( self )
        self._topicName = topicName
        self._tfListener = None
        self._initialized = None
        self._lock = RLock()
        self._active = True
        self._dT = 0.01
        self._covar = []
        self._stds = [] # standard devaitons for x, y, phi
        self._means = [] # mean values for        - " -
        self._numPoints = numPoints

    def initialize( self, timeout=None ):
        if not timeout:
            while self.isActive() and not self.isInitialized():
                self._initializeOnce( 5 )
        else:
            self._initializeOnce( timeout )


    def isInitialized( self ):
        with self._lock:
            return self._initialized

    def _initializeOnce( self, timeout=5.0 ):
        with self._lock:
            if self.isInitialized(): return True
            if not self._tfListener:
                self._tfListener = tf.TransformListener() # <- TF listenter is initialized here
            try:
                rospy.Subscriber("state_ekf", PoseWithCovarianceStamped, self.callback)
                self._initialized = True
                return True
            except tf.Exception,e:
                print 'stateEkfObserver: Could not get message from %s within timeout %s' % (
                        self._topicName, timeout )
                return False
            except Exception,e:
                print 'stateEkfObserver: Exception occured: %s' % e
                return False

    def callback( self, data ):
		timestamp = rospy.Time.now().to_sec()
		self._covar.append( ( timestamp, data.pose.covariance[0], data.pose.covariance[7], data.pose.covariance[35]))

    def run( self ):
        self.initialize()
        while self.isActive():
            #timestamp = rospy.Time.now().to_sec()
            #dPos, dQuat = self._tfListener.lookupTransform(
            #    self._topicNameA, self._topicNameB, rospy.Time( 0 )) # <- TF listenter is setup here
            #self._storeDelta( timestamp, dPos, dQuat )
            time.sleep( self._dT )

    def _thinPoints( self ):
        factor = int( len( self._covar ) / self._numPoints )
        if factor > 0:
            self._covar = self._covar[ ::factor ]

    def _buildStatistics( self ):
        covar_array = numpy.array(self._covar)
        for i in range(3): # for x, y, phi (0 is timestamp)
            self._stds.append( numpy.std( covar_array[:,i+1].astype(float) ) )
            self._means.append( numpy.mean( covar_array[:,i+1].astype(float) ) )
        print "*********** COVAR STATISTICS ****************"
        print "Stds: " , self._stds
        print "Means: " , self._means

    def isActive( self ):
        with self._lock:
            return not rospy.is_shutdown() and self._active

    def stop( self ):
        with self._lock:
            self._active = False

    def serialize( self ):
        self._thinPoints()
        self._buildStatistics()
        return self._covar[:]

    def serializeStds( self ):
        return self._stds[:]

    def serializeMeans( self ):
        return self._means[:]
