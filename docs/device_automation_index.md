---
title: "Device automations"
sidebar_label: Introduction
---

:::warning
We are currently exploring alternatives to device automations. Existing device automations will continue to work but developing new device automations is strongly discouraged.
:::

Device Automations provide users with a device-centric layer on top of the core concepts of Home Assistant. When creating automations, users no longer have to deal with core concepts like states and events. Instead, they will be able to pick a device and then pick from a list of pre-defined triggers, conditions and actions.

Integrations can hook into this system by exposing functions to generate the pre-defined triggers, conditions, actions and having functions that can listen for the triggers, check the condition and execute the action.

Device automations are not exposing extra functionality but are a way for users to not have to learn new concepts. Device automations are using events, state and service action helpers under the hood.

### Secondary device automations

Some devices may expose a lot of device automation. To not overwhelm the user, a device automation can be marked as secondary. A device automation which is marked as secondary will still be shown to the user, but may be shown after other device automations or may require the user to select a "show more" option or similar.

If the device automation references an entity via an `entity_id` key, the secondary flag will automatically be set to `True` if the referenced entity is hidden or if the referenced entity's entity category is not `None`. The example below shows how to mark a device automation as secondary.

```python
from homeassistant.const import (
    CONF_DEVICE_ID,
    CONF_DOMAIN,
    CONF_PLATFORM,
    CONF_TYPE,
)
from homeassistant.helpers import device_registry as dr

async def async_get_triggers(hass, device_id):
    """Return a list of triggers."""

    device_registry = dr.async_get(hass)
    device = device_registry.async_get(device_id)

    triggers = []

    # Determine which triggers are supported by this device_id ...

    triggers.append({
        # Required fields of TRIGGER_BASE_SCHEMA
        CONF_PLATFORM: "device",
        CONF_DOMAIN: "mydomain",
        CONF_DEVICE_ID: device_id,
        # Required fields of TRIGGER_SCHEMA
        CONF_TYPE: "less_important_trigger",
        # Mark the trigger as secondary
        "metadata": {"secondary": True},
    })

    return triggers
```
