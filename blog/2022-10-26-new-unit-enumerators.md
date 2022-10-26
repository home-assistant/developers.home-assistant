---
author: epenet
authorURL: https://github.com/epenet
title: "Introducing new unit enumerators"
---

As of Home Assistant Core 2022.11, the following unit constants are deprecated and replaced 
by a corresponding enum:

  - `UnitOfEnergy` enumerator replaces `ENERGY_KILO_WATT_HOUR`, `ENERGY_MEGA_WATT_HOUR`,
  and `ENERGY_WATT_HOUR`
  - `UnitOfSpeed` enumerator replaces `SPEED_FEET_PER_SECOND`, `SPEED_METERS_PER_SECOND`,
  `SPEED_KILOMETERS_PER_HOUR`, `SPEED_KNOTS`, and `SPEED_MILES_PER_HOUR`
  - `UnitOfVolumetricFlux` enumerator replaces `PRECIPITATION_MILLIMETERS_PER_HOUR`,
  `PRECIPITATION_INCHES_PER_HOUR`, `SPEED_MILLIMETERS_PER_DAY`, `SPEED_INCHES_PER_DAY`,
  and `SPEED_INCHES_PER_HOUR`
