---
title: "Device Triggers"
sidebar_label: Triggers
---

Device triggers are automation triggers that are tied to a specific device. Examples are "light turned on" or "water detected".

Device triggers are defined as dictionaries. These dictionaries are created by your integration and are consumed by your integration to attach the trigger.

Device triggers can be provided by the integration that provides the device (e.g. ZHA, deCONZ) or the entity integrations that the device has entities with (e.g. light, switch).
An example of the former is events not tied to an entity e.g. key press on a remote control or touch panel, while an example of the latter could be that a light has been turned on.

Home Assistant includes a template to get started with device triggers. To get started, run inside a development environment `python3 -m script.scaffold device_trigger`.

The template will create a new file `device_trigger.py` in your integration folder and a matching test file. The file contains the following functions and constants:

#### `TRIGGER_SCHEMA`

This is a voluptuous schema that verifies that a specific dictionary represents a config that your integration can handle. This should extend the TRIGGER_BASE_SCHEMA from `device_automation/__init__.py`.

#### `async def async_get_triggers(hass, device_id)`

Return a list of triggers.

#### `async def async_attach_trigger(hass, config, action, automation_info)`

Given one of your own trigger configs, make it so the `action` is called whenever the trigger is triggered. Return value is a function that detaches the trigger.
