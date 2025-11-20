---
author: Abílio Costa
authorURL: https://github.com/abmantis
title: "Sensor device classes now have default display precision"
---

If a numeric sensor doesn't have a suggested display precision set by its integration, Home Assistant will now use a default display precision based on the sensor's device class.

New device classes should be added to `UNITS_PRECISION` in `homeassistant/components/sensor/const.py`, along with the proper unit and the desired default display precision. See the docstring of that constant for more details on how to choose the right unit and precision.

The rounding that was previously applied to the sensor state when a unit conversion was happening is now removed, and the sensor state contains the full raw value.

It is still recommended that integrations set the `suggested_display_precision` on their sensors. This change is a fallback mechanism to ensure a consistent experience across all numeric sensors.

For more details check the implementation [pull request](https://github.com/home-assistant/core/pull/145013) and the [Sensor entity documentation](/docs/core/entity/sensor).
