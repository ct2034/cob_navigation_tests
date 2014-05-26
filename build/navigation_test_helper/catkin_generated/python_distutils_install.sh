#!/bin/sh -x

if [ -n "$DESTDIR" ] ; then
    case $DESTDIR in
        /*) # ok
            ;;
        *)
            /bin/echo "DESTDIR argument must be absolute... "
            /bin/echo "otherwise python's distutils will bork things."
            exit 1
    esac
    DESTDIR_ARG="--root=$DESTDIR"
fi

cd "/home/ch/ros/hydro_ws/src/navigation_test_helper"

# Note that PYTHONPATH is pulled from the environment to support installing
# into one location when some dependencies were installed in another
# location, #123.
/usr/bin/env \
    PYTHONPATH="/home/ch/ros/hydro_ws/install/lib/python2.7/dist-packages:/home/ch/ros/hydro_ws/build/lib/python2.7/dist-packages:$PYTHONPATH" \
    CATKIN_BINARY_DIR="/home/ch/ros/hydro_ws/build" \
    "/usr/bin/python" \
    "/home/ch/ros/hydro_ws/src/navigation_test_helper/setup.py" \
    build --build-base "/home/ch/ros/hydro_ws/build/navigation_test_helper" \
    install \
    $DESTDIR_ARG \
    --install-layout=deb --prefix="/home/ch/ros/hydro_ws/install" --install-scripts="/home/ch/ros/hydro_ws/install/bin"
