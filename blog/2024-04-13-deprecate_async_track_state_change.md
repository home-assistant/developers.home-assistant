---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Replacing `async_track_state_change` with `async_track_state_change_event`"
---

`async_track_state_change` is deprecated and will be removed in Home Assistant 2025.5. `async_track_state_change_event` should be used instead.

`async_track_state_change` always creates a top-level listener for `EVENT_STATE_CHANGED`, which would have to reject all state changes that did not match the desired entities. This design presented a performance problem when there were many integrations using `async_track_state_change`. `async_track_state_change` has been phased out in `core` since the introduction of `async_track_state_change`, with the last instance being removed in 2024.5.

Example with `async_track_state_change`:

```python
from homeassistant.core import State, callback
from homeassistant.helper.event import async_track_state_change

@callback
def _async_on_change(entity_id: str, old_state: State | None, new_state: State | None) -> None:
    ...

unsub = async_track_state_change(hass, "sensor.one", _async_on_change)
unsub()
```

Example replacement with `async_track_state_change_event`:

```python
from homeassistant.core import Event, EventStateChangedData, callback
from homeassistant.helper.event import async_track_state_change_event

@callback
def _async_on_change(event: Event[EventStateChangedData]) -> None:
    entity_id = event.data["entity_id"]
    old_state = event.data["old_state"]
    new_state = event.data["new_state"]
    ...

unsub = async_track_state_change_event(hass, "sensor.one", _async_on_change)
unsub()
```