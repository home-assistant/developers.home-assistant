---
title: Sous-Vide Entity
sidebar_label: Sous-Vide
id: version-0.74.0-entity_sous_vide
original_id: entity_sous_vide
---

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| name | string | **Required** | Name of the device.
| state | string | **Required** | One of the states listed in the states section.
| precision | float | **Required** | Precision of the cooker's temperature measurements.
| unit_of_measurement | string | **Required** | Temperature unit that the cooker measures in.
| min_temperature | float | **Required** | The minimum temperature the cooker can be set to.
| max_temperature | float | **Required** | The maximum temperature the cooker can be set to.
| target_temperature | float | **Required** | The current target temperature the cooker is set to.
| current_temperature | float | **Required** | The current temperature of the cooker.


## States
| State | Description
| ----- | -----------
| `STATE_OFF` | The cooker is currently idle.
| `STATE_ON` | The cooker is currently heating.
| `STATE_PROBLEM` | The cooker is in some kind of an error state.

## Methods

### `turn_on` or `async_turn_on`
Turn the cooker on and start heating to the target temperature.

### `turn_off`or `async_turn_off`
Turn the cooker off and stop heating.

### `set_temperature` or `async_set_temperature`
Set the target temperature that the cooker should heat to.