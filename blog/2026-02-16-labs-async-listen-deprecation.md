---
author: Artur Pragacz
authorURL: https://github.com/arturpragacz
title: "async_listen in Labs is deprecated"
---

The `async_listen` helper in the `labs` integration has been deprecated in favor of `async_subscribe_preview_feature`.

The new `async_subscribe_preview_feature` function provides a more consistent API, where the listener callback receives an `EventLabsUpdatedData` parameter containing the updated feature state. This eliminates the need to separately call `async_is_preview_feature_enabled` inside the listener to check the current value.

### Old usage

```python
from homeassistant.components.labs import async_is_preview_feature_enabled, async_listen

def my_listener() -> None:
    if async_is_preview_feature_enabled(hass, DOMAIN, "my_feature"):
        # feature enabled
        ...

async_listen(
    hass,
    domain=DOMAIN,
    preview_feature="my_feature",
    listener=my_listener,
)
```

### New usage

```python
from homeassistant.components.labs import EventLabsUpdatedData, async_subscribe_preview_feature

async def my_listener(event_data: EventLabsUpdatedData) -> None:
    if event_data["enabled"]:
        # feature enabled
        ...

async_subscribe_preview_feature(
    hass,
    domain=DOMAIN,
    preview_feature="my_feature",
    listener=my_listener,
)
```

Note that the new listener is a coroutine function and receives `EventLabsUpdatedData` as a parameter.

`async_listen` will be removed in Home Assistant 2027.3.

For more details, see [core PR #162648](https://github.com/home-assistant/core/pull/162648).
