---
title: Water heater entity
sidebar_label: Water heater
---

Derive entity platforms from [`homeassistant.components.water_heater.WaterHeaterEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/water_heater/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name                  | Type        | Default   | Description
| --------------------- | ----------- | --------- | -----------
| `min_temp`            | `float`     | 110°F     | The minimum temperature that can be set.
| `max_temp`            | `float`     | 140°F     | The maximum temperature that can be set.
| `current_temperature` | `float`     | `None`    | The current temperature.
| `target_temperature`  | `float`     | `None`    | The temperature we are trying to reach.
| `target_temperature_high` | `float` | `None`    | Upper bound of the temperature we are trying to reach.
| `target_temperature_low` | `float`  | `None`    | Lower bound of the temperature we are trying to reach.
| `target_temperature_step` | `float`  | `None`    | The supported step size a target temperature can be increased or decreased.
| `temperature_unit`    | `str`       | `NotImplementedError` | One of `TEMP_CELSIUS`, `TEMP_FAHRENHEIT`, or `TEMP_KELVIN`.
| `current_operation`   | `string`    | `None`    | The current operation mode.
| `operation_list`      | `List[str]` | `None`    | List of possible operation modes.
| `supported_features`  | `List[str]` | `NotImplementedError` | List of supported features.
| `is_away_mode_on`     | `bool`      | `None`    | The current status of away mode.

The allowed operation modes are the states specified in the base component and implementations of the water_heater component cannot differ.

Properties have to follow the units defined in the `temperature_unit`.

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
