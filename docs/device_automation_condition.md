---
title: "Device Conditions"
sidebar_label: Conditions
---

Device conditions allow a user to check if a certain device condition is met. Examples are is a light on or is the floor wet.

Device conditions are defined as dictionaries. These dictionaries are created by your integration and are passed to your integration to createa a function that checks the condition.

To get started with device conditions, create a new file `device_condition.py`. The file will need to contain the following functions and constants:

## `CONDITION_SCHEMA`

This is the schema for conditions. The base schema should be extended from `homeassistant.helpers.config_validation.DEVICE_CONDITION_BASE_SCHEMA`.

## `async async_get_conditions(hass, device_id)`

Return a list of conditions that this device supports.

## `async async_condition_from_config(config, config_validation)`

Create a condition function from a function. The condition functions should be an async-friendly callback that
