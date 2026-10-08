---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Climate entities now expose their temperature unit"
---

As of Home Assistant Core 2026.11, climate entities have a new `temperature_unit` state attribute, and the temperature properties integrations implement have been renamed with a `native_` prefix.

### Background

The climate entity converts all temperatures it writes to the state machine to the unit system configured by the user. Until now, the unit was not part of the state, so anyone reading the state had to know that climate temperatures follow the configured unit system. This is inconsistent with other entities, such as `sensor`, `number` and `weather`, which expose the unit next to the value.

### The `temperature_unit` state attribute

The `temperature_unit` state attribute holds the unit of the temperatures in the state, which is the temperature unit of the user's configured unit system. It's set by the `ClimateEntity` base class and can't be overridden by integrations.

### Renamed properties

Integrations specify temperatures in the unit used by the device, and the base class converts them. To make that clear, and to match how `sensor`, `number` and `weather` entities name native values, the following properties and their `_attr_` shorthand attributes have been renamed:

| Old name | New name |
| --- | --- |
| `current_temperature` | `native_current_temperature` |
| `target_temperature` | `native_target_temperature` |
| `target_temperature_high` | `native_target_temperature_high` |
| `target_temperature_low` | `native_target_temperature_low` |
| `temperature_unit` | `native_temperature_unit` |

The old names keep working, but implementing them, setting the `_attr_` attributes or reading them logs a warning. Support for the old names will be removed in Home Assistant Core 2027.11.

`min_temp`, `max_temp` and `target_temperature_step` are not renamed, and are still specified in the native unit.

More details can be found in the [climate entity documentation](/docs/core/entity/climate#temperature-units).

### Example

Old:

```python
class MyClimateEntity(ClimateEntity):
    _attr_temperature_unit = UnitOfTemperature.CELSIUS

    @property
    def current_temperature(self) -> float | None:
        return self.device.temperature

    async def async_update(self) -> None:
        self._attr_target_temperature = await self.device.get_setpoint()
```

New:

```python
class MyClimateEntity(ClimateEntity):
    _attr_native_temperature_unit = UnitOfTemperature.CELSIUS

    @property
    def native_current_temperature(self) -> float | None:
        return self.device.temperature

    async def async_update(self) -> None:
        self._attr_native_target_temperature = await self.device.get_setpoint()
```
