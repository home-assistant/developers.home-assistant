---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Climate entity now validates temperature provided in action calls"
---

As of Home Assistant Core 2024.8, we have implemented validation for the temperature action call provided by the `ClimateEntity`.

Integrations no longer need to check this within their own set temperature methods (`async_set_temperature`/`set_temperature`).

However, it's important that integrations specify the `min_temp` and `max_temp` properties correctly, or the user might not be able to set their correct temperature if validation fails.
Likewise, integrations that handle devices which can operate on both `Celsius` and `Fahrenheit` need to convert their respective `min_temp` and `max_temp` values accordingly.


### Example

Converts a device's native min/max value into the temperature_unit specified by the integration.

```python

class MyClimateEntity(ClimateEntity):
    """Implementation of my climate entity."""

    @property
    def min_temp(self) -> float:
        """Return the minimum temperature."""
        return TemperatureConverter.convert(
                self.device.min_temp, UnitOfTemperature.CELSIUS, self.temperature_unit
            )

    @property
    def max_temp(self) -> float:
        """Return the maximum temperature."""
        return TemperatureConverter.convert(
                self.device.max_temp, UnitOfTemperature.CELSIUS, self.temperature_unit
            )

```
