---
title: "Firing events"
---

Some integration represents a device or service that has events, like when motion is detected or a momentary button is pushed. An integration can make these available to users by firing them as events in Home Assistant.

Your integration should fire events of type `<domain>_event`. For example, the ZHA integration fires `zha_event` events.

If the event is related to a specific device/service, it should be correctly attributed. Do this by adding a `device_id` attribute to the event data that contains the device identifier from the device registry.

If a device or service only fires events, you need to [manually register it in the device registry](device_registry_index.md#manual-registration).

## Making events accessible to users

[Device triggers](device_automation_trigger.md) should be used to make events accessible to users. With a device trigger a user will be able to see all available events for the device and use it in their automations.

## What not to do

Event related code should not be part of the entity logic of your integration. You want to enable the logic of converting your integration events to Home Assistant events from inside `async_setup_entry` inside `__init__.py`.

Entity state should not represent events. For example, you don't want to have a binary sensor that is `on` for 30 seconds when an event happens.
