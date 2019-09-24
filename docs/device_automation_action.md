---
title: "Device Actions"
sidebar_label: Actions
---

Device actions allow a user to have a device to something. Examples are to turn a light on or open the door.

Device actions are defined as dictionaries. These dictionaries are created by your integration and are passed to your integration to create a function that checks the condition.

To get started with device actions, create a new file `device_action.py`. The file will need to contain the following functions and constants:

## `ACTION_SCHEMA`

This is the schema for actions. The base schema should be extended from `homeassistant.helpers.config_validation.DEVICE_ACTION_BASE_SCHEMA`.

## `async async async_get_actions(hass, device_id)`

Return a list of actions that this device supports.

## `async async_call_action_from_config(hass, config, variables, context)`

Execute the passed in action.
