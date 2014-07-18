#!/usr/bin/env python

import json, os, sys, commands, re, string
import pylab
import matplotlib.pyplot as plt
import numpy as np

class SimpleViewer( object ):

  def __init__( self, sshrepo, branch, navigation, robot, scene):
    #self.sshrepo = sshrepo
    #self.branch = branch
    self.navigation = navigation
    self.robot = robot
    self.scene = scene
    
    #self.config = [navigation, robot, scene]
    
    self.path = self.clone(sshrepo, branch)
  
  
  def clone(self, sshrepo, branch):
    self.tmpdir = "/tmp"
    self.reponame = re.search("(?<=/)[A-Za-z_]+(?=[.git])", sshrepo).group(0)
  
    #assert directory
    ll_out = commands.getoutput("ls -a " + self.tmpdir + "/" + self.reponame);
    
    if ".git" in ll_out: # Repository exists
      print "Pulling changes from " + self.reponame
      print commands.getoutput("cd " + self.tmpdir + "/" + self.reponame + "; git pull origin " + branch)
    elif "No such" in ll_out: # Folder doesn't exist
      print "Cloning " + self.reponame
      print commands.getoutput("cd " + self.tmpdir + "; git clone " + sshrepo)
    else: # Folder exists but isn't a repo
      print "Removing folder and cloning " + self.reponame
      print commands.getoutput("rm -rf " + self.tmpdir + "/" + self.reponame)
      print commands.getoutput("cd " + self.tmpdir + "; git clone " + sshrepo)
      
    return (self.tmpdir + "/" + self.reponame)
    
    
  def listTests(self):
    if "_" in [self.navigation, self.robot, self.scene]: # wildcard
      print "Available tests: "
      this_path = self.path
      all_tests = []
      
      i = 1
      if self.navigation is "_":
        navs = string.split(commands.getoutput("ls " + this_path), "\n")
        navs.pop(navs.index('README.md'))
      else:
        navs.append(self.navigation)
      #print navs
      
      for nav in navs:
      
        if self.robot is "_":
          robs = string.split(commands.getoutput("ls " + this_path + "/" + nav), "\n")
        else:
          robs = []
          robs.append(self.robot)
        #print robs
        
        for rob in robs:
      
          if self.navigation is "_":
            scens = string.split(commands.getoutput("ls " + this_path + "/" + nav + "/" + rob), "\n")
          else:
            scens.append(self.scene)
            
          for scen in scens:
          
            print string.join([nav, rob, scen], " ")
            
            tests = string.split(commands.getoutput("ls " + this_path + "/" + nav + "/" + rob + "/" + scen), "\n")
      
            for test in tests:
              print str(i) + ": " + test
              i += 1
              
              all_test.append(test)
        
      inp = "N"
      while inp not in range(1, i):
        inp = input("please enter a number >")
        
                
      return
          
    
    
    
    else: # unambiguous parameter
      print "Available tests for this combination: "
      this_path = self.path + "/" + self.navigation + "/" + self.robot + "/"  + self.scene
      tests = string.split(commands.getoutput("ls " + this_path), "\n")
      
      i = 1
      for test in tests:
        print str(i) + ": " + test
        i += 1
        
      inp = "N"
      while inp not in range(1, i):
        inp = input("please enter a number >")
        
      return this_path + "/" + tests[inp-1]
           
           
  def show(self, single_path):        
    print (">> showing: " + single_path)
    
    results_file = open(single_path, "r").read()
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
    
    return
  
if __name__ == '__main__':
  if len(sys.argv) is not 4:
    print "Please pass the following arguments: navigation robot scene\nOr pass a '_' as a wildcard"
 
  else:
    sshrepo= "git@github.com:ipa320/cob_navigation_tests_results.git"
    branch = "master"
    navigation = sys.argv[1]
    robot = sys.argv[2]
    scene = sys.argv[3]    
         
    viewer = SimpleViewer(sshrepo, branch, navigation, robot, scene)
    single_path = viewer.listTests()
    #viewer.show(single_path)
