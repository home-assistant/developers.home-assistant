---
author: epenet
authorURL: https://github.com/epenet
title: "Add new precipitation intensity units"
---

As of Home Assistant Core 2022.11, the following constants are deprecated for volumetric flux (like precipitation intensity), replaced by `UnitOfVolumetricFlux` enum:

  - `PRECIPITATION_INCHES_PER_HOUR` replaced by `UnitOfVolumetricFlux.INCHES_PER_HOUR`
  - `PRECIPITATION_MILLIMETERS_PER_HOUR` replaced by `UnitOfVolumetricFlux.MILLIMETERS_PER_HOUR`
  - `SPEED_INCHES_PER_DAY` replaced by `UnitOfVolumetricFlux.INCHES_PER_DAY`
  - `SPEED_INCHES_PER_HOUR` replaced by `UnitOfVolumetricFlux.INCHES_PER_HOUR`
  - `SPEED_MILLIMETERS_PER_DAY` replaced by `UnitOfVolumetricFlux.MILLIMETERS_PER_DAY`
