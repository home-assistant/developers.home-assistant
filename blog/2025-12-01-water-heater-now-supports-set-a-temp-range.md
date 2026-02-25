---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Water heater now supports setting a temperature range"
---

As of Home Assistant Core 2025.12, the `WaterHeaterEntity` now also supports setting a temperature range in addition to only setting a temperature.

Entities needs to set the `TARGET_TEMPERATURE_RANGE` supported feature to enable use of setting a target temperature range.

```python
from typing import Any
from homeassistant.components.water_heater import (
    WaterHeaterEntity,
    WaterHeaterEntityFeature,
)
from homeassistant.components.water_heater.const import (
    ATTR_TARGET_TEMP_LOW,
    ATTR_TARGET_TEMP_HIGH,
)

class MyWaterHeater(WaterHeaterEntity):
    """My water heater."""

    @property
    def supported_features(self) -> WaterHeaterEntityFeature:
        """Return the supported features."""
        return WaterHeaterEntityFeature.TARGET_TEMPERATURE_RANGE

    async def async_set_temperature(self, **kwargs: Any) -> None:
        """Set new target temperature."""
        min_temp = kwargs[ATTR_TARGET_TEMP_LOW]
        max_temp = kwargs[ATTR_TARGET_TEMP_HIGH]
        self.my_device.set_temperature(min_temp, max_temp)

```

More details can be found in the [water_heater documentation](/docs/core/entity/water-heater#supported-features).
