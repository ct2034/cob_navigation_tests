execute_process(COMMAND "/home/ch/ros/hydro_ws/build/component_catalogue/catkin_generated/python_distutils_install.sh" RESULT_VARIABLE res)

if(NOT res EQUAL 0)
  message(FATAL_ERROR "execute_process(/home/ch/ros/hydro_ws/build/component_catalogue/catkin_generated/python_distutils_install.sh) returned error code ")
endif()
