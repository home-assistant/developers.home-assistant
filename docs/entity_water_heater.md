---
title: Water Heater Entity
sidebar_label: Water Heater
---

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| min_temp | float | 110°F | The minimum temperature that can be set.
| max_temp | float | 140°F | The maximum temperature that can be set.
| temperature | float | none | The current temperature in °C or °F.
| operation_mode | string | none | The current operation mode.
| operation_list | list | none | List of possible operation modes.
| away_mode | string | none | The current status of away mode. (on, off)

The allowed operation modes are specified in the base component and implementations of the water_heater component cannot differ.

Properties have to follow the units defined in the `unit_system`.

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

## Methods
### `set_temperature` or `async_set_temperature`
Sets the temperature the water heater should heat water to.

### `set_operation_mode`or `async_set_operation_mode`
Sets the operation mode of the water heater. Must be in the operation_list.

### `turn_away_mode_on` or `async_turn_away_mode_on`
Set the water heater to away mode.

### `turn_away_mode_off` or `async_turn_away_mode_off`
Set the water heater back to the previous operation mode. Turn off away mode.
