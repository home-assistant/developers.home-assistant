---
title: "Device Triggers"
sidebar_label: Triggers
---

Device triggers are automation triggers that are tied to a specific device. Examples are "light turned on" or "water detected".

Device triggers are defined as dictionaries. These dictionaries are created by your integration and are consumed by your integration to attach the trigger.

To get started with device automation triggers, create a new file `device_trigger.py`. The file will need to contain the following functions and constants:

## `TRIGGER_SCHEMA`

This is a voluptuous schema that verifies that a specific dictionary represents a config that your integration can handle. This should extend the TRIGGER_SCHEMA from `device_automation/__init__.py`.

## `async async_get_triggers(hass, device_id)`

Return a list of triggers.

## `async async_attach_trigger(hass, config, action, automation_info)`

Given one of your own trigger configs, make it so the `action` is called whenever the trigger is triggered. Return value is a function that detaches the trigger.
