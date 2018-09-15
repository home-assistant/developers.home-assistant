---
title: Vacuum Entity
sidebar_label: Vacuum
id: version-0.74.0-entity_vacuum
original_id: entity_vacuum
---

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| name | string | **Required** | Name of the device.
| state | string | **Required** | One of the states listed in the states section.
| battery_level | int | `none` | Current battery level.
| battery_icon | string | function | Battery icon to show in UI.
| cleaning_mode | string | `none` | The current cleaning mode.
| cleaning_mode_list | list | `NotImplementedError()`| List of available fan speeds and cleaning modes.
| error | string | **Required** with `STATE_ERROR` | An error message if the vacuum is in `STATE_ERROR`.


## States
| State | Description
| ----- | -----------
| `STATE_CLEANING` | The vacuum is currently cleaning.
| `STATE_DOCKED` | The vacuum is currently docked, it is assumed that docked can also mean charging.
| `STATE_PAUSED` | The vacuum was cleaning but was paused without returning to the dock.
| `STATE_IDLE` | The vacuum is not paused, not docked and does not have any errors.
| `STATE_RETURNING` | The vacuum is done cleaning and is currently returning to the dock, but not yet docked.
| `STATE_ERROR` | The vacuum encountered an error while cleaning, the error can be specified as a property on the entity.

## Methods

### `turn_on` or `async_turn_on`
Turn the vacuum on and start cleaning.

### `turn_off`or `async_turn_off`
Turn the vacuum off stopping the cleaning and returning home.

### `return_to_base` or `async_return_to_base`
Set the vacuum cleaner to return to the dock.

### `stop` or `async_stop`
Stop the vacuum cleaner, do not return to base.

### `clean_spot` or `async_clean_spot`
Perform a spot clean-up.

### `locate` or `async_locate`
Locate the vacuum cleaner.

### `set_cleaning_mode` or `async_set_cleaning_mode`
Set the cleaning mode.

### `send_command` or `async_send_command`
Send a command to a vacuum cleaner.
