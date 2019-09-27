---
title: Device Actions
sidebar_label: Actions
id: version-0.99.3-device_automation_action
original_id: device_automation_action
---

Device actions allow a user to have a device do something. Examples are to turn a light on or open a door.

Device actions are defined as dictionaries. These dictionaries are created by your integration and are passed to your integration to create a function that performs the action.

Device actions can be provided by the integration that provides the device (e.g. ZHA, deCONZ) or the entity integrations that the device has entities with (e.g. light, switch).
An example of the former could be to reboot the device, while an example of the latter could be to turn a light on.

Home Assistant includes a template to get started with device actions. To get started, run inside a development environment `python3 -m script.scaffold device_action`.

The template will create a new file `device_action.py` in your integration folder and a matching test file. The file contains the following functions and constants:

## `ACTION_SCHEMA`

This is the schema for actions. The base schema should be extended from `homeassistant.helpers.config_validation.DEVICE_ACTION_BASE_SCHEMA`.

## `async async async_get_actions(hass, device_id)`

Return a list of actions that this device supports.

## `async async_call_action_from_config(hass, config, variables, context)`

Execute the passed in action.
