---
title: Water Heater Entity
sidebar_label: Water Heater
---

Derive entity platforms from [`homeassistant.components.water_heater.WaterHeaterEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/water_heater/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name                    | Type                        | Default                 | Description                                                                                           |
| ----------------------- | --------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| min_temp                | float                       | 110°F                   | The minimum temperature that can be set.                                                              |
| max_temp                | float                       | 140°F                   | The maximum temperature that can be set.                                                              |
| current_temperature     | float                       | `None`                  | The current temperature.                                                                              |
| target_temperature      | float                       | `None`                  | The temperature we are trying to reach.                                                               |
| target_temperature_high | float                       | `None`                  | Upper bound of the temperature we are trying to reach. `target_temperature` should be None when used. |
| target_temperature_low  | float                       | `None`                  | Lower bound of the temperature we are trying to reach. `target_temperature` should be None when used. |
| temperature_unit        | str                         | `NotImplementedError`   | One of `TEMP_CELSIUS`, `TEMP_FAHRENHEIT`, or `TEMP_KELVIN`.                                           |
| current_operation       | WaterHeaterOperationCurrent | `None`                  | The current operation performed.                                                                      |
| operation_mode          | WaterHeaterOperationMode    | `None`                  | Currently wanted operation mode.                                                                      |
| operation_modes         | list                        | `NotImplementedError()` | Available operation modes.                                                                            |
| supported_features      | int                         | 0                       | List of supported features.                                                                           |
| preset_mode             | string                      | `NotImplementedError()` | The current selected preset. Requires `SUPPORT_PRESET_MODE`.                                          |
| preset_modes            | list                        | `NotImplementedError()` | The available presets. Requires `SUPPORT_PRESET_MODE`.                                                |

The allowed operation modes are the states specified in the base component and implementations of the water_heater component cannot differ.

Properties have to follow the units defined in the `temperature_unit`.

## Operation Mode

You are only allowed to use the built-in modes, provided by the `WaterHeaterOperationMode`
enum. If you want another mode, add a preset instead.

Alternative active modes (like `BOOST`) are expected to automatically return back to `ON` after a limited time.

| Name    | Description                                                                            |
| ------- | -------------------------------------------------------------------------------------- |
| `OFF`   | Heater is off.                                                                         |
| `ON`    | Heater is on, following selected preset.                                               |
| `BOOST` | A short term boost of temperature is requested, pump will return to ON once completed. |

## Current Operation

You are only allowed to use the built-in modes, provided by the `WaterHeaterCurrentOperation`
enum. If you want another mode, add a preset instead.

| Name                    | Description                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `OFF`                   | Heater is off.                                                                                                          |
| `IDLE`                  | Heater is currently idle.                                                                                               |
| `HEATING`               | Heater is currently heating.                                                                                               |
| `LEGIONELLA_PREVENTION` | Heater is running a legionella prevention program.                                                                      |
| `BOOSTING`              | A short term boost of temperature is running, could  be user selected by `operation_mode` or due to background process. |

## Supported Features

Supported features are defined by using values in the `WaterHeaterEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value                | Description               |
| -------------------- | ------------------------- |
| `TARGET_TEMPERATURE` | Temperature can be set.    |
| `OPERATION_MODE`     | Operation mode can be set. |

### Presets

A device can have different presets that it might want to show to the user. Common presets are "Away" or "Eco". There are a couple of built-in presets that will offer translations, but you're also allowed to add custom presets.

| Name               | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `ECO`              | Device is running an energy-saving preset                        |
| `AWAY`             | Device is in a low energy away preset                            |
| `NORMAL`           | Device is in a normal operation preset                           |
| `LUXURY`           | Device is in luxury mode with high water temperatures available  |
| `AUTO`             | Device is in automatic or smart mode                             |
| `FROST_PROTECTION` | Device is maintaining low temperature for just frost protection. |


## Methods

### `set_temperature` or `async_set_temperature`

Sets the temperature the water heater should heat water to

### `set_operation_mode`or `async_set_operation_mode`

Sets the operation mode of the water heater. Must be in the operation_modes list.

### `set_preset_mode` or `async_set_preset_mode`

Set the water heater preset mode. Must be in the preset_modes list.
