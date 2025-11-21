---
title: Vacuum entity
sidebar_label: Vacuum
---

Derive entity platforms from [`homeassistant.components.vacuum.StateVacuumEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/vacuum/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description 
| ---- | ---- | ------- | ----------- 
| fan_speed | string | `None` | The current fan speed. 
| fan_speed_list | list | `NotImplementedError()` | List of available fan speeds. 
| cleaning_mode | string | `None` | The current cleaning mode. 
| cleaning_modes | list | `["Vacuuming", "Mopping", "Vacuuming and mopping"]` | List of available cleaning modes. 
| water_level | string | `None` | The current water level. 
| water_levels | list | `["Slightly dry", "Moist", "Wet"]` | List of available water levels. 
| auto_empty_count | int | `None` | Auto empty count. 
| empty_required | bool | `None` | Whether dust bag replacement is required. 
| is_dock_empty_required | bool | `False` | Required base dust collector replacement. 
| battery_level | int | `None` | **Deprecated** - Battery level (use separate battery sensor instead). 
| battery_icon | string | Auto-generated | **Deprecated** - Battery icon (use separate battery sensor instead). 

## States

Setting the state should return an enum from VacuumActivity in the `activity` property.

:::warning
Setting the `state` property directly is deprecated and will be removed in 2026.1. Always use the `activity` property with the `VacuumActivity` enum instead.
:::

| Value | Description 
| ----- | ----------- 
| `CLEANING` | The vacuum is currently cleaning (generic cleaning state). 
| `VACUUMING` | The vacuum is currently vacuuming. 
| `MOPPING` | The vacuum is currently mopping. 
| `VACUUMING_AND_MOPPING` | The vacuum is vacuuming and mopping simultaneously. 
| `DOCKED` | The vacuum is currently docked, it is assumed that docked can also mean charging. 
| `AUTO_EMPTYING` | The vacuum is auto-emptying its dust bin. 
| `CLEANING_MOPS` | The vacuum is cleaning mop pads. 
| `DRYING_MOPS` | The vacuum is drying mop pads. 
| `IDLE` | The vacuum is not paused, not docked and does not have any errors. 
| `PAUSED` | The vacuum was cleaning but was paused without returning to the dock. 
| `RETURNING` | The vacuum is done cleaning and is currently returning to the dock, but not yet docked. 
| `ERROR` | The vacuum encountered an error while cleaning. 

## Supported features

Supported features are defined by using values in the `VacuumEntityFeature` enum
and are combined using the bitwise or (`|`) operator.
Note that all vacuum entity platforms derived from `homeassistant.components.vacuum.StateVacuumEntity`
must set the `VacuumEntityFeature.STATE` flag.

| Value            | Description                                                                      
| ---------------- | -------------------------------------------------------------------------------- 
| `AUTO_EMPTY`     | The vacuum supports auto-emptying its dust bin.                                  
| `BATTERY`        | **Deprecated** - The vacuum supports battery level (use separate sensor instead).
| `CLEAN_SPOT`     | The vacuum supports spot cleaning.                                               
| `CLEANING_MODE`  | The vacuum supports setting cleaning mode.                                       
| `DRYING_MOP`     | The vacuum supports drying mops.                                                 
| `FAN_SPEED`      | The vacuum supports setting fan speed.                                           
| `LOCATE`         | The vacuum supports locating.                                                    
| `MAP`            | The vacuum supports retrieving its map.                                          
| `MOP`            | The vacuum supports mopping.                                                     
| `MOP_VACUUM`     | The vacuum supports combined mopping and vacuuming.                              
| `PAUSE`          | The vacuum supports the pause command.                                           
| `RETURN_HOME`    | The vacuum supports the return to the dock command.                              
| `SEND_COMMAND`   | The vacuum supports sending a command to the vacuum.                             
| `START`          | The vacuum supports the start command.                                           
| `STATE`          | The vacuum supports returning its state.                                         
| `STATUS`         | **Deprecated** - Not supported by StateVacuumEntity.                             
| `STOP`           | The vacuum supports the stop command.                                            
| `TURN_OFF`       | **Deprecated** - Not supported by StateVacuumEntity.                             
| `TURN_ON`        | **Deprecated** - Not supported by StateVacuumEntity.                             
| `WATER_LEVEL`    | The vacuum supports setting water level.                                         

## Methods

### `clean_spot` or `async_clean_spot`

Perform a spot clean-up.

### `locate` or `async_locate`

Locate the vacuum cleaner.

### `pause` or `async_pause`

Pause the cleaning task.

### `return_to_base` or `async_return_to_base`

Set the vacuum cleaner to return to the dock.

### `send_command` or `async_send_command`

Send a command to a vacuum cleaner.

**Parameters:**
- `command` (str, required): Command to execute
- `params` (dict | list, optional): Parameters for the command

### `set_fan_speed` or `async_set_fan_speed`

Set the fan speed.

**Parameters:**
- `fan_speed` (str, required): Fan speed to set

### `set_cleaning_mode` or `async_set_cleaning_mode`

Set the cleaning mode.

**Parameters:**
- `cleaning_mode` (str, required): Cleaning mode to set (e.g., "Vacuuming", "Mopping", "Vacuuming and mopping")

### `set_water_level` or `async_set_water_level`

Set the water level.

**Parameters:**
- `water_level` (str, required): Water level to set (e.g., "Slightly dry", "Moist", "Wet")

### `start` or `async_start`

Start or resume the cleaning task.

### `stop` or `async_stop`

Stop the vacuum cleaner, do not return to base.

## Attributes

The vacuum entity exposes the following attributes in addition to the standard entity attributes:

| Attribute | Type | Description 
| --------- | ---- | ----------- 
| `battery_level` | int | **Deprecated** - Battery level percentage (0-100). Use a separate battery sensor instead. 
| `battery_icon` | string | **Deprecated** - Battery icon. Use a separate battery sensor instead. 
| `fan_speed` | string | Current fan speed (if `FAN_SPEED` feature is supported). 
| `fan_speed_list` | list | List of available fan speeds (if `FAN_SPEED` feature is supported). 
| `cleaning_mode` | string | Current cleaning mode (if `CLEANING_MODE` feature is supported). 
| `cleaning_mode_list` | list | List of available cleaning modes (if `CLEANING_MODE` feature is supported). 
| `water_level` | string | Current water level (if `WATER_LEVEL` feature is supported). 
| `water_level_list` | list | List of available water levels (if `WATER_LEVEL` feature is supported). 

## Device Automation

The vacuum entity supports device automation triggers, conditions, and actions:

### Triggers

| Type | Description 
| ---- | ----------- 
| `cleaning` | Triggered when the vacuum starts cleaning (includes CLEANING, VACUUMING, MOPPING, VACUUMING_AND_MOPPING states). 
| `docked` | Triggered when the vacuum docks (includes DOCKED, AUTO_EMPTYING, CLEANING_MOPS, DRYING_MOPS states). 

