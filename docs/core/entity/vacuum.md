---
title: Vacuum Entity
sidebar_label: Vacuum
---

Derive entity platforms from [`homeassistant.components.vacuum.StateVacuumEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/vacuum/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

:::note
`VacuumEntity` is deprecated and will be removed in future releases. Please use or migrate to the `StateVacuumEntity`
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| battery_icon | string | function | Battery icon to show in UI.
| battery_level | int | `none` | Current battery level.
| error | string | **Required** with `STATE_ERROR` | An error message if the vacuum is in `STATE_ERROR`.
| fan_speed | string | `none` | The current fan speed.
| fan_speed_list | list | `NotImplementedError()`| List of available fan speeds.
| name | string | **Required** | Name of the entity.
| state | string | **Required** | One of the states listed in the states section.

## States

| State | Description
| ----- | -----------
| `STATE_CLEANING` | The vacuum is currently cleaning.
| `STATE_DOCKED` | The vacuum is currently docked, it is assumed that docked can also mean charging.
| `STATE_IDLE` | The vacuum is not paused, not docked and does not have any errors.
| `STATE_PAUSED` | The vacuum was cleaning but was paused without returning to the dock.
| `STATE_RETURNING` | The vacuum is done cleaning and is currently returning to the dock, but not yet docked.
| `STATE_ERROR` | The vacuum encountered an error while cleaning, the error can be specified as a property on the entity.

## Supported Features

Supported features are defined by using values in the `VacuumEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value          | Description                                          |
| -------------- | ---------------------------------------------------- |
| `BATTERY`      | The vacuum supports retrieving battery status.       |
| `CLEAN_SPOT`   | The vacuum supports spot cleaning.                   |
| `FAN_SPEED`    | The vacuum supports setting fan speed.               |
| `LOCATE`       | The vacuum supports locating.                        |
| `MAP`          | The vacuum supports retrieving its map.              |
| `PAUSE`        | Pause the vacuum.                                    |
| `RETURN_HOME`  | Return to the dock.                                  |
| `SEND_COMMAND` | The vacuum supports sending a command to the vacuum. |
| `START`        | The vacuum supports the start command.               |
| `STATE`        | The vacuum supports returning it state.              |
| `STATUS`       | The vacuum supports returning it status.             |
| `STOP`         | Stop the vacuum and return to the dock.              |
| `TURN_OFF`     | The vacuum turns off.                                |
| `TURN_ON`      | The vacuum turns on.                                 |

## Methods

### `clean_spot` or `async_clean_spot`

Perform a spot clean-up.

### `locate` or `async_locate`

Locate the vacuum cleaner.

### `return_to_base` or `async_return_to_base`

Set the vacuum cleaner to return to the dock.

### `send_command` or `async_send_command`

Send a command to a vacuum cleaner.

### `set_fan_speed` or `async_set_fan_speed`

Set the fan speed.

### `stop` or `async_stop`

Stop the vacuum cleaner, do not return to base.

### `turn_on` or `async_turn_on`

Turn the vacuum on and start cleaning.

### `turn_off` or `async_turn_off`

Turn the vacuum off stopping the cleaning and returning home.
