---
author: davet2001
authorURL: https://github.com/davet2001
title: "Removal of deprecated unit conversion utilities"
---

The following utilities were [deprecated in Home Assistant 2022.10](/blog/2022/09/28/deprecate-conversion-utilities)) and have now been removed as of 2023.11:

  - `homeassistant/util/distance`
  - `homeassistant/util/pressure`
  - `homeassistant/util/speed`
  - `homeassistant/util/temperature`
  - `homeassistant/util/volume`

Please use the corresponding static classes from `homeassistant/util/unit_conversion`:

  - `DistanceConverter`
  - `PressureConverter`
  - `SpeedConverter`
  - `TemperatureConverter`
  - `VolumeConverter`

These were already unused within the built-in Home Assistant integrations, and community integrations using them should have seen warnings for the past 12 months.  Attempting to import the original utilities will now result in an error.
