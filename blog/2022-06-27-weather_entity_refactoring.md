---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Weather entity refactoring to support unit conversions"
---

`WeatherEntity` now supports temperature unit conversion following a similar pattern
as the unit conversion supported by `NumberEntity` and `SensorEntity`.

Precipitation, pressure, temperature, visibility and wind speed are automatically
converted according to the unit system configured by the users. In addition, users can
override units for specific weather entities.

To make this possible, custom component integrations should be updated to override
properties `native_precipitation_unit`, `native_pressure`, `native_pressure_unit`,
 `native_temperature`, `native_temperature_unit`,`native_visibility`, `native_visibility_unit`,
 `native_wind_speed` and `native_wind_speed_unit`, instead of `precipitation_unit`,
 `pressure`, `pressure_unit`, `temperature`, `temperature_unit`,`visibility`, `visibility_unit`,
 `wind_speed` and `wind_speed_unit`.

The same renaming has been done for the corresponding `_attr_*` attributes as well
as for members of the `Forecast` typed dict

In Home Assistant Core 2023.1, overriding `precipitation_unit`,
 `pressure`, `pressure_unit`, `temperature`, `temperature_unit`,`visibility`, `visibility_unit`,
 `wind_speed`, `wind_speed_unit`, setting `_attr_precipitation_unit`,
 `_attr_pressure`, `_attr_pressure_unit`, `_attr_temperature`, `_attr_temperature_unit`,
 `_attr_visibility`, `_attr_visibility_unit`, `_attr_wind_speed`, `_attr_wind_speed_unit` and
setting `precipitation`, `pressure`, `temperature`, `templow`, `wind_speed` on instances of
`Forecast` is no longer supported.
