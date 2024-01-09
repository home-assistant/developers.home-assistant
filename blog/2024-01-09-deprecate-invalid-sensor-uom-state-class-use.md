---
author: J. Benecke
authorURL: https://github.com/jpbede
authorImageURL: https://avatars.githubusercontent.com/u/3989428?s=96&v=4
title: "Deprecate invalid use of sensor units of measurements and state classes"
---

Since Home Assistant Core 2022.12, a warning is issued in the logs if a sensor entity that has a device class 
uses units of measurement and status classes incorrectly, taking their device class into account.

An invalid use would be a sensor entity that has a device class of `SensorDeviceClass.TEMPERATURE` but uses 
the unit of measurement `%` instead of `°C` or `°F`; or the state class `SensorStateClass.TOTAL` 
instead of `SensorStateClass.MEASUREMENT`.

There will be a six-month deprecation period to ensure all custom integration authors have time to adjust.
As of Home Assistant Core 2024.8, the warning will then be replaced by an error.