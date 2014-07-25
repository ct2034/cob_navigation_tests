#!/usr/bin/env python

import json, os, sys, commands, re, string
from time import localtime, strftime
import pylab
import matplotlib.pyplot as plt
import numpy as np

class SimpleViewer( object ):

  def __init__( self, sshrepo, branch, navigation, robot, scene, readmeFname, automode):
    #self.sshrepo = sshrepo
    self.branch = branch
    self.navigation = navigation
    self.robot = robot
    self.scene = scene
    self.readmeFname = readmeFname
    self.automode = automode
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
    elif "." in ll_out: # Folder exists but isn't a repo
      print "Removing folder and cloning " + self.reponame
      print commands.getoutput("rm -rf " + self.tmpdir + "/" + self.reponame)
      print commands.getoutput("cd " + self.tmpdir + "; git clone " + sshrepo)
    else:
      raise Exception('Uncovered Event of data in clone()')
    return (self.tmpdir + "/" + self.reponame)
    
    
  def parseInput(self, max):
    inp = 1
    inps = []
    print "---\nplease enter multiple numbers and a return after the last\nor 0 for all:"
    while inp in range(1, max):
      try:
        inp =  input(" >>") 
        inps.append(inp)
      except SyntaxError:
        inp = False
    if len(inps) is 1:
      return inps[0]
    else:  
      return inps  
    
    
  def listTests(self):
    this_path = self.path
    print "Available tests: "
    all_tests = []
    actual_tests = []
    i = 1
    navs = []
    out = commands.getoutput("ls " + this_path)
    if (self.navigation is "_") and ("No such" in out):  #wildcard but not existing
      navs = []
    elif (self.navigation is "_") and not ("No such" in out): #wildcard and existing
      navs = string.split(out, "\n")
      if self.readmeFname in navs:
        navs.pop(navs.index(self.readmeFname))
    else: #no wildcard
      navs = []
      navs.append(self.navigation)
    for nav in navs:
      robs = []
      out = commands.getoutput("ls " + this_path + "/" + nav)
      if (self.robot is "_") and ("No such" in out):  #wildcard but not existing
        robs = []
      elif (self.robot is "_") and not ("No such" in out): #wildcard and existing
        robs = string.split(out, "\n")
      else: #no wildcard
        robs = []
        robs.append(self.robot)
      for rob in robs:
        scens = []
        out = commands.getoutput("ls " + this_path + "/" + nav + "/" + rob)
        if (self.scene is "_") and ("No such" in out):  #wildcard but not existing
          scens = []
        elif (self.scene is "_") and not ("No such" in out): #wildcard and existing
          scens = string.split(out, "\n")
        else: #no wildcard
          scens = []
          scens.append(self.scene)
        for scen in scens:          
          tests = string.split(commands.getoutput("ls " + this_path + "/" + nav + "/" + rob + "/" + scen), "\n")
          if not ("No such" in tests): 
            print string.join([nav, rob, scen], " ")
            for test in tests:
              if re.match("^.+json$", test):
                print " " + str(i) + ": " + test
                i += 1
                all_tests.append([nav, rob, scen, test])
    if self.automode:
      inp = 0
    elif i > 2:
      inp = self.parseInput(i)
    elif i is 1:
      inp = 1      
    elif i is 0:
      print ">> No tests matching"
    else:
      raise Exception('Uncovered Event of data in listTests() No 1')
    if isinstance( inp, int ):
      print "inp: " + str(inp)
      if inp is 0:
        return all_tests
      elif inp > 0:       
        return this_path + "/" + string.join(all_tests[inp-1], "/")
      else:
        raise Exception('Uncovered Event of data in listTests() No 2')
    else:
      for oneinp in inp:
        actual_tests.append( all_tests[oneinp-1] )
      return actual_tests
  
           
           
  def showSingle(self, single_path):        
    print (">> showing: " + single_path)
    results_file = open(single_path, "r").read()
    data_json = json.loads(results_file)[0]
    fig = self.makeFigSingle( data_json)              
    plt.show()
    return         
           
           
  def saveSingle(self, single_path):        
    print (">> reading: " + single_path)
    results_file = open(single_path, "r").read()
    data_json = json.loads(results_file)[0]
    fig = self.makeFigSingle( data_json)              
    fname = re.search(".+(?=[.j])", single_path).group(0)
    fig.savefig(fname + "png")
    return              
    
  def getInfo(self, data_json, sep):
    return string.join([ data_json['navigation'], data_json['robot'], str(data_json['scenario']), str(data_json['localtimeFormatted']) ], sep)
    
    
  def makeFigSingle(self, data_json):
    # print data_json.keys()
    info_str = self.getInfo(data_json, " ")
    fig = plt.figure(figsize=(20,10))
    ax_points = fig.add_subplot(121)
    if ("points" in data_json.keys()) and (data_json['points']): # points in the dict
      points = {}
      pl_points = {}
      for tfframe in data_json['points'].keys():
        points[tfframe] = np.array(data_json['points'][tfframe])
        pl_points[tfframe], = ax_points.plot(points[tfframe][:,1], points[tfframe][:,2])
      ax_points.set_aspect('equal')
      ax_points.legend(pl_points.values(), points.keys(), 'best')
      ax_points.set_title('Covered Route - '+info_str)
      ax_points.set_xlabel('x [m]')
      ax_points.set_ylabel('y [m]')
    else:
      ax_points.text( 0.5, 0.5, 'No Points Data', verticalalignment='center', horizontalalignment='center')
      ax_points.axis('off')
    if ('delta_jumps' in data_json.keys()) and (data_json['delta_jumps']): # jumps in the dict
      if isinstance(data_json['delta_nrof_jumps'], list):
        jumps_name = "delta_jumps (trhd: " + str(data_json['delta_nrof_jumps'][0]) + " m/s)"
      else:
        jumps_name = "delta_jumps"
      points[jumps_name] = np.array(data_json["delta_jumps"])
      pl_points[jumps_name], = ax_points.plot(points[jumps_name][:,1], points[jumps_name][:,2], 'mo')
      ax_points.legend(pl_points.values(), points.keys(), 'best')
    ax_deltas = fig.add_subplot(222)  
    if ("deltas" in data_json.keys()) and (data_json['deltas']): # deltas in the dict    
      deltas = {}
      pl_deltas = {}
      delta_arr = np.array(data_json['deltas'])
      pl_x, = ax_deltas.plot(delta_arr[:,0], delta_arr[:,1])
      pl_y, = ax_deltas.plot(delta_arr[:,0], delta_arr[:,2])
      pl_p, = ax_deltas.plot(delta_arr[:,0], delta_arr[:,3])
      ax_deltas.legend((pl_x, pl_y, pl_p), ('x', 'y', 'phi'), 'best')
      ax_deltas.set_title('Deltas - '+info_str)
      ax_deltas.set_xlabel('Time [s]')
      ax_deltas.set_ylabel('Deviation [m, rad]')
    else:
      ax_deltas.text( 0.5, 0.5, 'No Delta Data', verticalalignment='center', horizontalalignment='center')
      ax_deltas.axis('off')
    if ('delta_jumps' in data_json.keys()) and (data_json['delta_jumps']): # jumps in the dict
      jumps_arr = np.array(data_json["delta_jumps"])
      pl_jumps, = ax_deltas.plot(jumps_arr[:,0], np.zeros(len(jumps_arr[:,0])), 'mo')
      ax_deltas.legend((pl_x, pl_y, pl_p, pl_jumps), ('x', 'y', 'phi', 'jumps'), 'best')
    ax_covars = fig.add_subplot(224)
    if ("covariances" in data_json.keys()) and (data_json['covariances']): # points in the dict
      covars = {}
      pl_covars = {}
      covars_arr = np.array(data_json['covariances'])
      pl_x, = ax_covars.plot(covars_arr[:,0], covars_arr[:,1])
      pl_y, = ax_covars.plot(covars_arr[:,0], covars_arr[:,2])
      pl_p, = ax_covars.plot(covars_arr[:,0], covars_arr[:,3])
      ax_covars.legend((pl_x, pl_y, pl_p), ('x', 'y', 'phi'), 'best')
      ax_covars.set_title('Covariance - '+info_str)
      ax_covars.set_xlabel('Time [s]')
      ax_covars.set_ylabel('Covariance [m, rad]')
      ax_covars.set_ylim(
        ( np.min(covars_arr[:,1:3])-.003 ), 
        ( np.max(covars_arr[:,1:3])+.004 ) 
      )
    else:
      ax_covars.text( 0.5, 0.5, 'No Covariance Data', verticalalignment='center', horizontalalignment='center')
      ax_covars.axis('off') 
    return fig
    
        
  def compare(self, paths):
    fig_deltas = plt.figure(figsize=(10,10))
    ax_deltas = fig_deltas.add_subplot(111)
    bar_width = 0.2
    colors = ['r', 'b', 'g']
    infos = []
    i = 0
    for path in paths:
      fname = self.path + "/" + string.join(path, "/")
      f = open(fname, "r").read()
      data_json = json.loads(f)[0]
      info_str = self.getInfo(data_json, "\n")
      # ---------
      if ("deltas_means" in data_json.keys()) and data_json['deltas_means']:
        for co in range(0, 3):
          ax_deltas.bar( i + co*bar_width, np.abs(data_json['deltas_means'][co]), bar_width, yerr=data_json['deltas_stds'][co], color=colors[co] )
        infos.append(info_str)
        i += 1
      ticksar = np.array(range(0, i), dtype = 'float')+(bar_width*1.5)
      plt.xticks(ticksar, infos, rotation=90, size='small')
      ax_deltas.set_title('Deltas')
    infos = []
    i = 0
    # ---------
    fig_covar = plt.figure(figsize=(10,10))  
    ax_covar = fig_covar.add_subplot(111)
    for path in paths:
      fname = self.path + "/" + string.join(path, "/")
      f = open(fname, "r").read()
      data_json = json.loads(f)[0]
      info_str = self.getInfo(data_json, "\n")
      # ---------
      if ("covariance_means" in data_json.keys()) and data_json['covariance_means']:
        for co in range(0, 3):
          ax_covar.bar( i + co*bar_width, np.abs(data_json['covariance_means'][co]), bar_width, yerr=data_json['covariance_stds'][co], color=colors[co] )
        infos.append(info_str)
        i += 1
      ticksar = np.array(range(0, i), dtype = 'float')+(bar_width*1.5)
      plt.xticks(ticksar, infos, rotation=90, size='small')
      ax_covar.set_title('Covariance') 
    infos = []
    i = 0
    # ---------
    fig_jumps = plt.figure(figsize=(10,10))  
    ax_jumps_n = fig_jumps.add_subplot(121)
    ax_jumps_m = fig_jumps.add_subplot(122)
    for path in paths:
      fname = self.path + "/" + string.join(path, "/")
      f = open(fname, "r").read()
      data_json = json.loads(f)[0]
      info_str = self.getInfo(data_json, "\n")
      # --------- 
      if ("delta_nrof_jumps" in data_json.keys()) and data_json['delta_nrof_jumps']:
        co = 0
        ax_jumps_n.bar( i + co*bar_width, data_json['delta_nrof_jumps'][1], bar_width, color=colors[co] )
        co = 1
        ax_jumps_m.bar( i + co*bar_width, data_json['delta_max_jump'], bar_width, color=colors[co] )
        infos.append(info_str)
        i += 1
      ticksar = np.array(range(0, i), dtype = 'float')+(bar_width*0.5)
      plt.xticks(ticksar, infos, rotation=90, size='small')
      ax_jumps_n.set_title('Number of Jumps') 
      ax_jumps_m.set_title('Maximal Jump') 
      ax_jumps_m.set_ylabel('Jump \'Speed\' [m/s]')
    plt.show()
     
    

  def saveOrComp(self, paths):
    if self.automode:
      inp = 0
    else:
      inp = "None"
    while inp not in [1, 0]:
      inp = input("1 for compare, 0 for save images >")
    if 0 is inp: # SAVE
      self.saveAll(paths)
      self.writeReadme(paths)
    elif 1 is inp: # COMPARE
      self.compare(paths)
    else:
      raise Exception('Uncovered Event of data in listTests() No 1')

   
  def saveAll(self, paths):
    for path in paths:
      fname = self.path + "/" + string.join(path, "/")
      self.saveSingle(fname)
      
      
  def writeReadme(self, paths):
    fname = self.tmpdir + "/" + self.reponame + "/" + self.readmeFname
    #deleting old readme
    print commands.getoutput("rm " + fname)
    f = open(fname, 'w')
    f.write('# Test Results overview\n')
    f.write('This Overviwe is created by this script:\n')
    f.write('https://github.com/ct2034/cob_navigation_tests/blob/hydro_dev/navigation_test_analysis/src/navigation_test_analysis/simple_viewer.py <br>\n')
    f.write('_Call it locally for options to compare test data._\n')
    old = "old"
    for path in paths:
      jaml = "/" + string.join(path, "/")
      name = re.search(".+(?=[.j])", jaml).group(0)
      title = "### " + string.join([path[0], path[1], path[2]]) + "\n"
      if not (old == title):
        f.write(title)
      old = title
      f.write("![" + string.join([path[0], path[1], path[2]]) + "](" + name + "png)\n")
    f.close()
    
    
  def commit(self):
    print commands.getoutput("cd " + self.tmpdir + "/" + self.reponame + "; git add . ; git commit -m\'automatic image update " + strftime("%a, %d %b %Y %X +0000", localtime()) + "\';  git push origin " + self.branch)
    
      
if __name__ == '__main__':
  sshrepo= "git@github.com:ct2034/cob_navigation_tests_results.git"
  branch = "master"
  readmeFname = "README.md"
  if len(sys.argv) is 4:
    navigation = sys.argv[1]
    robot = sys.argv[2]
    scene = sys.argv[3]    
    viewer = SimpleViewer(sshrepo, branch, navigation, robot, scene, readmeFname, False)
    paths = viewer.listTests()
    if isinstance(paths[0], list): #multiple tests
      viewer.saveOrComp(paths)
    else: #single tests
      viewer.showSingle(paths)
  elif (len(sys.argv) is 2) and ('AUTO' in sys.argv[1]):     
    viewer = SimpleViewer(sshrepo, branch, "_", "_", "_", readmeFname, True)
    paths = viewer.listTests()
    viewer.saveAll(paths)
    viewer.writeReadme(paths)
    viewer.commit()
  else:    
    print "Please pass the following arguments: navigation robot scene\nOr pass a '_' as a wildcard\nOr call with AUTO to update all images"
