---
author: Abílio Costa
authorURL: https://github.com/abmantis
authorImageURL: https://avatars.githubusercontent.com/u/974569?v=4
title: "Standard event type for doorbell event entities"
---

Doorbell event entities now have a standard `ring` event type. Integrations that use `EventDeviceClass.DOORBELL` must include `DoorbellEventType.RING` in their `event_types` list.

See the [architecture discussion](https://github.com/home-assistant/architecture/discussions/1363) for the full background.

<!--truncate-->

## Why

Previously, each integration used its own string for the "doorbell was pressed" event — `ding`, `ring`, `doorbell_chime`, `single_press`, etc. This inconsistency made it impossible to build generic doorbell automations that work across all integrations.

The new `DoorbellEventType.RING` standard event type solves this by ensuring every doorbell integration fires a common `ring` event when the doorbell is pressed.

## What to do

Import `DoorbellEventType` from `homeassistant.components.event` and include `DoorbellEventType.RING` in your doorbell entity's `event_types`. Fire it whenever the doorbell is pressed:

```python
from homeassistant.components.event import DoorbellEventType, EventDeviceClass, EventEntity


class MyDoorbellEvent(EventEntity):

    _attr_device_class = EventDeviceClass.DOORBELL
    _attr_event_types = [DoorbellEventType.RING]

    @callback
    def _async_handle_event(self) -> None:
        """Handle the doorbell press event."""
        self._trigger_event(DoorbellEventType.RING)
        self.async_write_ha_state()
```

Additional custom event types (e.g., `double_press`, `long_press`) are still allowed alongside the standard `ring` type.

## Migrating from a non-standard event type

If your integration currently uses a different event type for the doorbell press (e.g., `ding`), fire both during the deprecation period:

```python
_attr_event_types = [DoorbellEventType.RING, "ding"]

@callback
def _async_handle_event(self) -> None:
    """Handle the doorbell press event."""
    self._trigger_event(DoorbellEventType.RING)
    self.async_write_ha_state()
    self._trigger_event("ding")
    self.async_write_ha_state()
```

Doorbell entities that do not include `DoorbellEventType.RING` will log a deprecation warning and will **stop working in Home Assistant 2027.4**.

For full details, see the [event entity documentation](/docs/core/entity/event).
