---
author: epenet
authorURL: https://github.com/epenet
title: "Add new precipitation and precipitation intensity units"
---

As of Home Assistant Core 2022.11, the following constants are deprecated:

  - `PRECIPITATION_INCHES_PER_HOUR` replaced by `PRECIPITATION_INTENSITY_INCHES_PER_HOUR`
  - `PRECIPITATION_MILLIMETERS_PER_HOUR` replaced by `PRECIPITATION_INTENSITY_MILLIMETERS_PER_HOUR`
  - `SPEED_INCHES_PER_DAY` replaced by `PRECIPITATION_INTENSITY_INCHES_PER_DAY`
  - `SPEED_INCHES_PER_HOUR` replaced by `PRECIPITATION_INTENSITY_INCHES_PER_HOUR`
  - `SPEED_MILLIMETERS_PER_DAY` replaced by `PRECIPITATION_INTENSITY_MILLIMETERS_PER_DAY`

Please note that it is also recommended to migration to the following units for precipitation measurements:

  - `LENGTH_INCHES` replaced by `PRECIPITATION_INCHES`
  - `LENGTH_MILLIMETERS` replaced by `PRECIPITATION_MILLIMETERS`
