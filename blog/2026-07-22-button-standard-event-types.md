---
author: Abílio Costa
authorURL: https://github.com/abmantis
authorImageURL: https://avatars.githubusercontent.com/u/974569?v=4
title: "Standard event types for button event entities"
---

Button event entities now have a set of standard event types, provided by the new `ButtonEventType` enum. Integrations that use `EventDeviceClass.BUTTON` should use these types instead of custom strings whenever the interaction maps to one of them.

See the [architecture discussion](https://github.com/home-assistant/architecture/discussions/1377) for the full background.

<!--truncate-->

## Why

Previously, each integration picked its own strings for button interactions — `single`, `click`, `hold`, `double_press`, and so on. This inconsistency made it impossible to build generic button automations that work across integrations, and prevented the frontend from offering meaningful trigger suggestions.

The new `ButtonEventType` standard event types solve this by giving every button integration a shared vocabulary for the common interactions.

## The event types

`ButtonEventType` defines six standard event types:

- `ButtonEventType.PRESS_START`: the button was pressed down.
- `ButtonEventType.PRESS_END`: the button was released after a brief press (the standard "click").
- `ButtonEventType.LONG_PRESS_START`: the button was held past a duration threshold.
- `ButtonEventType.LONG_PRESS_END`: the button was released after a long hold.
- `ButtonEventType.MULTI_PRESS_ONGOING`: an intermediate press in a multi-press sequence was detected.
- `ButtonEventType.MULTI_PRESS_END`: a multi-press sequence completed.

The `MULTI_PRESS_ONGOING` and `MULTI_PRESS_END` events include a `multi_press_count` attribute in their event data (the `ATTR_MULTI_PRESS_COUNT` constant) with the number of presses.

**None of these are mandatory.** Unlike the doorbell `ring` event, there is no required type here. Each integration maps only the interactions its hardware can actually produce, and lists just those in `event_types`.

## What to do

Import `ButtonEventType` from `homeassistant.components.event` and include the types your device supports in the entity's `event_types`. Fire them as the interactions happen:

```python
from homeassistant.components.event import (
    ATTR_MULTI_PRESS_COUNT,
    ButtonEventType,
    EventDeviceClass,
    EventEntity,
)


class MyButtonEvent(EventEntity):

    _attr_device_class = EventDeviceClass.BUTTON
    _attr_event_types = [
        ButtonEventType.PRESS_END,
        ButtonEventType.LONG_PRESS_END,
        ButtonEventType.MULTI_PRESS_END,
    ]

    @callback
    def _async_handle_multi_press(self, count: int) -> None:
        """Handle a completed multi-press sequence."""
        self._trigger_event(
            ButtonEventType.MULTI_PRESS_END,
            {ATTR_MULTI_PRESS_COUNT: count},
        )
        self.async_write_ha_state()
```

### Single-event devices

If a device only emits a single event per interaction, with no separate press and release, map it to the matching `_end` type (`PRESS_END` for short presses, `LONG_PRESS_END` for holds, and so on). This keeps the "button was pressed" trigger consistent across devices without synthesizing events the hardware never sends.

## No migration required

This change only adds the shared constants; nothing is deprecated and no integration is forced to migrate. Custom event types are still allowed alongside the standard ones. Adopt `ButtonEventType` when it fits your device.

For full details, see the [event entity documentation](/docs/core/entity/event).
