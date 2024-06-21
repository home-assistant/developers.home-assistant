---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Sensor entity can now do rounding of numerical values"
---

Note:
The changes described here have been reverted and replaced with rounding for presentation, more details can be found in [this blog post](/blog/2023/02/08/sensor_presentation_rounding).

`SensorEntity` can now do rounding of a numerical `native_value` when it's converted to the sensor state. This is implemented as a part of [core PR #86074](https://github.com/home-assistant/core/pull/86074). The rounding is opt-in by integrations setting the `native_precision` property. It is recommended that this property is set by integrations because it ensures the number of decimals is reasonable also after unit conversion.

A summary of the changes, copied from the PR description:

- By default, no rounding is done
  - Integrations can influence the state precision by setting a new property `native_precision`
- The state precision is influenced by unit conversion
  - Converting from a smaller to a larger unit increases the display precision
  - Converting from a larger to a smaller unit decreases the display precision if the integration has set `native_precision`
  - Minimum precision when converting from a larger to a smaller unit is 0, i.e. there's no rounding to tens, hundreds etc.
- User can override the display precision from the frontend
  - There's no minimum precision, i.e. rounding to tens, hundreds, etc. is possible by setting a negative precision
- Integrations are encouraged to drop rounding for display and instead set property `native_precision`
- Trailing zeroes are added to the sensor state's string representation to match the precision if:
  - The precision is set by user
  - The `native_precision` property is not `None`
  - Unit conversion is done
