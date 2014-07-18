#!/usr/bin/env python

import json, os, sys
import pylab
import matplotlib.pyplot as plt
import numpy as np

class SimpleViewer( object ):

  def __init__( self, results_path ):
    #self.repo = Repo(repo_path)
    #assert self.repo.bare == False
    
    results_filen = results_path + "/2dnav_ipa_eband/cob3-6/scene2/result_16e4937f-6fcd-483b-9018-1c813924e246.bag.json"
    print (">> results_path: " + results_path)
    
    results_file = open(results_path, "r").read()
    data_json = json.loads(results_file)[0]
    
    print ">> keys in the file:"
    print data_json.keys()
    
    deltas = np.absolute(np.array(data_json['deltas']))
    points_bl = np.array(data_json['points']['/base_link'])
    points_gt = np.array(data_json['points']['/gazebo_gt'])
    
    info_str = " - " + data_json['robot'] \
    + " " + str(data_json['scenario']) \
    + " " + str(data_json['navigation']) \
    + " " + str(data_json['localtimeFormatted'])
    
    print info_str
    
    fig_deltas = plt.figure()
    ax_deltas = fig_deltas.add_subplot(111)
    pl_x, = ax_deltas.plot(deltas[:,0], deltas[:,1])
    pl_y, = ax_deltas.plot(deltas[:,0], deltas[:,2])
    pl_p, = ax_deltas.plot(deltas[:,0], deltas[:,3])
    plt.legend((pl_x, pl_y, pl_p), ('x', 'y', 'phi'), 'upper left')
    ax_deltas.set_title('Deltas'+info_str)
    ax_deltas.set_xlabel('Zeit [ms]')
    ax_deltas.set_ylabel('Abweichung [m, rad]')
    
    fig_points = plt.figure()
    ax_points = fig_points.add_subplot(111)
    pl_bl, = ax_points.plot(points_bl[:,1], points_bl[:,2])
    pl_gt, = ax_points.plot(points_gt[:,1], points_gt[:,2])
    plt.legend((pl_bl, pl_gt), ('Lokalisierung', 'Ground Truth'), 'lower right')
    ax_points.set_title('Fahrweg'+info_str)
    ax_points.set_xlabel('x [m]')
    ax_points.set_ylabel('y [m]')
    
    plt.show()

    #fig.legend((l1, l2), ('Line 1', 'Line 2'), 'upper left')
    
    #plt.plot(deltas[:,0], deltas[:,1:4])
    #plt.plot(points[:,1], points[:,2])
    #plt.show()

    
  
if __name__ == '__main__':
  if len(sys.argv) < 2:
    results_path = "$HOME/results/2dnav_ipa_eband/cob3-6/scene2/result_16e4937f-6fcd-483b-9018-1c813924e246.bag.json"
  else:
    results_path = sys.argv[1]
  
  viewer = SimpleViewer(os.path.expandvars(results_path))
