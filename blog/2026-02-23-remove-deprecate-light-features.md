---
author: epenet
authorURL: https://github.com/epenet
title: "Remove deprecated light features"
---

### Summary of changes

In October 2022, Home Assistant migrated the preferred color temperature unit from mired to kelvin.

In [March 2024](/blog/2024-02-12-light-color-mode-mandatory), Home Assistant requested explicit `supported_color_modes` and `color_mode` properties (triggering deprecation of legacy fallback color mode support).

In [January 2025](/blog/2024-12-14-kelvin-preferred-color-temperature-unit), Home Assistant requested explicit Kelvin support (triggering deprecation of mired support).

It is now time to cleanup the legacy code and remove the corresponding attributes, constants and properties:
* Remove deprected `ATTR_COLOR_TEMP`, `ATTR_MIN_MIREDS` `ATTR_MAX_MIREDS`, `ATTR_KELVIN`, `COLOR_MODE_***` and `SUPPORT_***` constants
* Remove state attributes `ATTR_COLOR_TEMP`, `ATTR_MIN_MIREDS` and `ATTR_MAX_MIREDS`
* Remove support for `ATTR_KELVIN` and `ATTR_COLOR_TEMP` arguments from the `light.turn_on` service call
* Remove support for `LightEntity.color_temp`, `LightEntity.min_mireds` and `LightEntity.max_mireds` properties from the entity
* Remove support for `LightEntity._attr_color_temp`, `LightEntity._attr_min_mireds` and `LightEntity._attr_max_mireds` shorthand attributes from the entity

Additionally, failing to provide valid `supported_color_modes` and `color_mode` properties no longer works and will raise an error.

### Examples

#### Custom minimum/maximum color temperature

```python
class MyLight(LightEntity):
    """Representation of a light."""

    # Old
    # _attr_min_mireds = 200 # 5000K
    # _attr_max_mireds = 400 # 2500K

    # New
    _attr_min_color_temp_kelvin = 2500 # 400 mireds
    _attr_max_color_temp_kelvin = 5000 # 200 mireds
```

#### Default minimum/maximum color temperature

```python
from homeassistant.components.light import DEFAULT_MAX_KELVIN, DEFAULT_MIN_KELVIN

class MyLight(LightEntity):
    """Representation of a light."""

    # Old did not need to have _attr_min_mireds / _attr_max_mireds set
    # New needs to set the default explicitly
    _attr_min_color_temp_kelvin = DEFAULT_MIN_KELVIN
    _attr_max_color_temp_kelvin = DEFAULT_MAX_KELVIN
```

#### Dynamic minimum/maximum color temperature

```python
from homeassistant.util import color as color_util

class MyLight(LightEntity):
    """Representation of a light."""

    # Old
    # def min_mireds(self) -> int:
    #     """Return the coldest color_temp that this light supports."""
    #     return device.coldest_temperature
    #
    # def max_mireds(self) -> int:
    #     """Return the warmest color_temp that this light supports."""
    #     return device.warmest_temperature

    # New
    def min_color_temp_kelvin(self) -> int:
        """Return the warmest color_temp that this light supports."""
        return color_util.color_temperature_mired_to_kelvin(device.warmest_temperature)

    def max_color_temp_kelvin(self) -> int:
        """Return the coldest color_temp that this light supports."""
        return color_util.color_temperature_mired_to_kelvin(device.coldest_temperature)
```

#### Checking color temperature in service call

```python
from homeassistant.components.light import ATTR_COLOR_TEMP_KELVIN
from homeassistant.util import color as color_util

class MyLight(LightEntity):
    """Representation of a light."""
    def turn_on(self, **kwargs: Any) -> None:
        """Turn on the light."""
        # Old
        # if ATTR_COLOR_TEMP in kwargs:
        #     color_temp_mired = kwargs[ATTR_COLOR_TEMP]
        #     color_temp_kelvin = color_util.color_temperature_mired_to_kelvin(color_temp_mired)

        # Old
        # if ATTR_KELVIN in kwargs:
        #     color_temp_kelvin = kwargs[ATTR_KELVIN]
        #     color_temp_mired = color_util.color_temperature_kelvin_to_mired(color_temp_kelvin)

        # New
        if ATTR_COLOR_TEMP_KELVIN in kwargs:
            color_temp_kelvin = kwargs[ATTR_COLOR_TEMP_KELVIN]
            color_temp_mired = color_util.color_temperature_kelvin_to_mired(color_temp_kelvin)
```

### Background information

* [Community discussion about Kelvin temperature](https://community.home-assistant.io/t/wth-is-light-temperature-not-in-kelvin/467449/6)
* [Core PR #79591: Migration to Kelvin](https://github.com/home-assistant/core/pull/79591)
* [Architecture discussion #564](https://github.com/home-assistant/architecture/discussions/564)
* [Color modes documentation](/docs/core/entity/light#color-modes)
