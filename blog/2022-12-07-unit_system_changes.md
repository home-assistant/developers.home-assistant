---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Summary of unit system related changes"
---

The last few months saw many changes to the supported unit systems, and how numerical sensors are influenced by them. This blog post attempts to summarize the changes.

- The unit used for the state of a sensor whose device class is either of `distance`, `gas`, `precipitation`, `precipitation_intensity`, `speed`, `volume`, `water`, `weight`, or `wind_speed` is influenced by the unit system and automatically converted.
  - Integrations can override the unit system rules by setting the entity property `suggested_unit_of_measurement`.
  - To avoid breaking changes, the unit of a sensor is automatically converted according to the unit system rules *only the first time the sensor is added to Home Assistant*. This means sensors already in the user's system won't be affected by the new unit conversion rule.
  - If the user changes the unit system in their preferences, the units of sensors already in the user's system won't be affected by the unit system change.
  - Integrations, in most cases, no longer have to do any unit conversion as it is now automatically handled.
  - Existing integration specific code implementing unit conversion can, in most cases, be removed as the sensor's state will be automatically converted after the custom code is removed. For details on how this works, see [core PR #83228](https://github.com/home-assistant/core/pull/83228). Note: This only works for sensors with a `unique_id`.
  - Custom option flows which allows the user to select sensor units for an integration can, in most cases, be removed. The user can instead override the sensor's unit via entity settings in frontend if the automatic conversion according to the selected unit system is not to their liking. Note: This only works for sensors with a `unique_id`.
- The behavior of temperature sensors is mostly unchanged; the unit of a temperature sensors state will always reflect the unit system unless:
  - The user has overridden the unit via entity settings in the frontend.
  - The temperature sensor has a non-None `suggested_unit_of_measurement` property.
- The `IMPERIAL_SYSTEM` unit system has been deprecated, and replaced with `US_CUSTOMARY_SYSTEM`. Furthermore, the `is_metric` and `name` properties of a unit system are deprecated and should not be used. More details about these changes can be found in this [blog post](/blog/2022/10/14/deprecate-unit-system).
- The unit conversion utilities have been refactored and moved, unit converters are now available as static classes in `homeassistant/util/unit_conversion`. More details about these changes can be found in this [blog post](/blog/2022/09/28/deprecate-conversion-utilities).
