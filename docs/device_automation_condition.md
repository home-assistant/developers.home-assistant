---
title: "Device Conditions"
sidebar_label: Conditions
---

Device conditions allow a user to check if a certain condition is met. Examples are is a light on or is the floor wet.

Device conditions are defined as dictionaries. These dictionaries are created by your integration and are passed to your integration to create a a function that checks the condition.

Device conditions can be provided by the integration that provides the device (e.g. ZHA, deCONZ) or the entity integrations that the device has entities with (e.g. light, humidity sensor).
An example of the latter could be to check if a light is on or the floor is wet.

Home Assistant includes a template to get started with device conditions. To get started, run inside a development environment `python3 -m script.scaffold device_condition`.

The template will create a new file `device_condition.py` in your integration folder and a matching test file. The file contains the following functions and constants:

## `CONDITION_SCHEMA`

This is the schema for conditions. The base schema should be extended from `homeassistant.helpers.config_validation.DEVICE_CONDITION_BASE_SCHEMA`.

## `async async_get_conditions(hass, device_id)`

Return a list of conditions that this device supports.

## `async async_condition_from_config(config, config_validation)`

Create a condition function from a function. The condition functions should be an async-friendly callback that
