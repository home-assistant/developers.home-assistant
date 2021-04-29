---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: Changed enter and exit criteria for zones
---
The enter and exit criteria for zones have recently changed, the updated code will be included in Home Assistant Core 2021.5

### Background
Location updates from device trackers have a center location and an accuracy.
The true location of the device can be anywhere within the circle centered at location, with radius accuracy.

Likewise, zones are circular defined by a center location and a radius.

The old criteria for zones  would at every location update find the zone nearest to the center of the location update where the circles defined by the location update and the zone were overlapping, no matter how big the circle defined by the location update was.
This criteria meant it was possible to jump in to a very small zone based on a highly inaccurate location update.

To illustrate further, @justus502 made an illustration:
<img src="https://user-images.githubusercontent.com/14281572/115867224-165ab080-a43b-11eb-9deb-68d0763e321e.png" width="500" height="500">

The brown circles are the GPS-coordinates in the center and the (in)accuracy sent by the device.
The green circles are zones and their center in the middle.
The red circle is the actual location of the device.

The old code would consider the device to be within all three zones (the green circles), and would pick the one to the upper left.
The newer code will no longer enter a zone unless the location (the brown circle) is entirely within the green circle, this means none of the three zones in the illustration would be entered.
Once a zone has been entered however, less accurate location updates (a larger brown circle) are allowed, and the zone won't be exited unless the location (brown circle) is no longer overlapping the zone (the green circle).