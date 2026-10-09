---
title: Water heater entity
sidebar_label: Water heater
---

Derive entity platforms from [`homeassistant.components.water_heater.WaterHeaterEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/water_heater/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name                  | Type        | Default   | Description
| --------------------- | ----------- | --------- | -----------
| `min_temp`            | `float`     | 110°F     | The minimum temperature that can be set.
| `max_temp`            | `float`     | 140°F     | The maximum temperature that can be set.
| `native_current_temperature` | `float` | `None` | The current temperature.
| `native_target_temperature` | `float` | `None` | The temperature we are trying to reach.
| `native_target_temperature_high` | `float` | `None` | Upper bound of the temperature we are trying to reach.
| `native_target_temperature_low` | `float` | `None` | Lower bound of the temperature we are trying to reach.
| `target_temperature_step` | `float`  | `None`    | The supported step size a target temperature can be increased or decreased, in `native_temperature_unit`.
| `native_temperature_unit` | `str`   | `NotImplementedError` | The unit the entity reports temperatures in. One of `UnitOfTemperature.CELSIUS`, `UnitOfTemperature.FAHRENHEIT`, or `UnitOfTemperature.KELVIN`.
| `current_operation`   | `string`    | `None`    | The current operation mode.
| `operation_list`      | `List[str]` | `None`    | List of possible operation modes.
| `supported_features`  | `WaterHeaterEntityFeature` | `WaterHeaterEntityFeature(0)` (no features) | List of supported features.
| `is_away_mode_on`     | `bool`      | `None`    | The current status of away mode.

The allowed operation modes are the states specified in the base component and implementations of the water_heater component cannot differ.

### Temperature units

Temperature properties, including `min_temp` and `max_temp`, have to follow the unit defined in `native_temperature_unit`. The water heater entity converts the temperatures to the unit system configured by the user before writing them to the state machine, and adds a `temperature_unit` state attribute that holds the unit of the converted temperatures. The `temperature_unit` state attribute is set by the base class and can't be overridden by integrations.

Temperatures passed to `set_temperature` are converted to `native_temperature_unit` before the method is called.

## States

| State | Description
| ----- | -----------
| `STATE_ECO` | Energy efficient mode, provides energy savings and fast heating.
| `STATE_ELECTRIC` | Electric only mode, uses the most energy.
| `STATE_PERFORMANCE` | High performance mode.
| `STATE_HIGH_DEMAND` | Meet high demands when water heater is undersized.
| `STATE_HEAT_PUMP` | Slowest to heat, but uses less energy.
| `STATE_GAS` | Gas only mode, uses the most energy.
| `STATE_OFF` | The water heater is off.

## Supported features

Supported features are defined by using values in the `WaterHeaterEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value                | Description               |
| -------------------- | ------------------------- |
| `TARGET_TEMPERATURE` | Temperature can be set    |
| `OPERATION_MODE`     | Operation mode can be set |
| `AWAY_MODE`          | Away mode can be set      |
| `ON_OFF`             | Can be turned on or off   |

## Methods

### `set_temperature` or `async_set_temperature`

Sets the temperature the water heater should heat water to.

### `set_operation_mode`or `async_set_operation_mode`

Sets the operation mode of the water heater. Must be in the operation_list.

### `turn_away_mode_on` or `async_turn_away_mode_on`

Set the water heater to away mode.

### `turn_away_mode_off` or `async_turn_away_mode_off`

Set the water heater back to the previous operation mode. Turn off away mode.

### `turn_on` or `async_turn_on`

Turns the water heater on.

### `turn_off` or `async_turn_off`

Turns the water heater off.
