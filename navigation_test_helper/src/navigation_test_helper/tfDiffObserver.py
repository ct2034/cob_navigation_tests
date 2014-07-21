import roslib
roslib.load_manifest( 'navigation_test_helper' )

import rospy, tf
from threading import Thread, RLock
import time

import numpy, math

class TFDiffObserver( Thread ):
    def __init__( self, topicNameA, topicNameB, numPoints=300, jumpThreshhold=.01 ):
        Thread.__init__( self )
        self._topicNameA = topicNameA
        self._topicNameB = topicNameB
        self._tfListener = None
        self._initialized = None
        self._lock = RLock()
        self._active = True
        self._dT = 0.01
        self._deltas = []
        self._stds = [] # standard devaitons for x, y, phi
        self._means = [] # mean values for        - " -
        self._numPoints = numPoints
        self._previousDelta = []
        self._previousTime = 0
        self._initialStep = True
        self._currentMaxJump = 0.
        self._jumpThreshhold = jumpThreshhold
        self._jumpLocations = []
        self._numberAboveThreshhold = 0

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
                self._tfListener.waitForTransform( self._topicNameA,
                        self._topicNameB, rospy.Time( 0 ),
                        rospy.Duration( timeout )) # <- TF listenter waits here
                self._initialized = True
                return True
            except tf.Exception,e:
                print 'TFDiffObserver: Could not get transformation from %s to %s within timeout %s' % (
                        self._topicNameA, self._topicNameB, timeout )
                return False
            except Exception,e:
                print 'TFDiffObserver: Exception occured: %s' % e
                return False

    def run( self ):
        self.initialize()
        while self.isActive():
            timestamp = rospy.Time.now().to_sec()
            dPos, dQuat = self._tfListener.lookupTransform(
                self._topicNameA, self._topicNameB, rospy.Time( 0 )) # <- TF listenter is setup here
            self._storeDelta( timestamp, dPos, dQuat )
            time.sleep( self._dT )
        self._thinPoints()
        self._buildStatistics()

    def _thinPoints( self ):
        factor = int( len( self._deltas ) / self._numPoints )
        if factor > 0:
            self._deltas = self._deltas[ ::factor ] # SOLVING - ValueError: slice step cannot be zero

    def _storeDelta( self, timestamp, dPos, dQuat ):
        dEuler = tf.transformations.euler_from_quaternion( dQuat )
        self._deltas.append( ( timestamp, dPos[ 0 ], dPos[ 1 ], dEuler[ 2 ]))
        self._checkJump( timestamp, dPos[ 0 ], dPos[ 1 ], dEuler[ 2 ] )

    def _buildStatistics( self ):
        delta_array = numpy.array(self._deltas)
        for i in range(3): # for x, y, phi (0 is timestamp)
            self._stds.append( numpy.std( delta_array[:,i+1].astype(float) ) )
            self._means.append( numpy.mean( delta_array[:,i+1].astype(float) ) )
        #print "*********** DELTA STATISTICS ****************"
        #print "Stds: " , self._stds
        #print "Means: " , self._means
        
    def _checkJump( self, timestamp, x, y, phi):
        newdelta = numpy.array([x, y], dtype=numpy.float64)
        newtime = timestamp
        if not self._initialStep:
            dist = numpy.linalg.norm(newdelta-self._previousDelta) / (newtime-self._previousTime)
            if dist > self._currentMaxJump:
                self._currentMaxJump = dist
                #print "New currentMaxJump: %e" % dist
                #print "numpy.linalg.norm(newdelta-self._previousDelta): %e" % ( numpy.linalg.norm(newdelta-self._previousDelta) )
                #print "newtime-self._previousTime: %e" % ( self._previousTime-newtime ) 
            if dist > self._jumpThreshhold: 
                self._numberAboveThreshhold+=1
                #print "New numberAboveThreshhold: ", self._numberAboveThreshhold, " with dist: ", dist
                dPos, dQuat = self._tfListener.lookupTransform( '/map', self._topicNameA, rospy.Time(0))
                timestamp = rospy.Time.now().to_sec()
                dEuler = tf.transformations.euler_from_quaternion( dQuat )
                self._jumpLocations.append( ( timestamp, dPos[ 0 ], dPos[ 1 ], dEuler[ 2 ]))
                #print "at location: ", dPos[ 0 ], dPos[ 1 ], dEuler[ 2 ]    
            self._previousTime = newtime    
        self._initialStep = False
        self._previousDelta = newdelta
                        
    def isActive( self ):
        with self._lock:
            return not rospy.is_shutdown() and self._active

    def stop( self ):
        with self._lock:
            self._active = False

    def serialize( self ):
        return self._deltas[:]

    def serializeStds( self ):
        return self._stds[:]

    def serializeMeans( self ):
        return self._means[:]
        
    def serializeJumps( self ):
        return self._jumpLocations[:]
        
    def serializeNumJumps( self ):
        return [self._jumpThreshhold, self._numberAboveThreshhold]
        
    def serializeMaxJump( self ):
        return self._currentMaxJump
