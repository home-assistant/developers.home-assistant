---
title: "Asking for a restart"
---

Some changes only take effect after Home Assistant restarts. Think of an update to a custom integration, or a setting that is read once at startup. Instead of raising a repair issue for this, an integration asks for a restart. Home Assistant collects all of these into one indicator for the user, listing which integrations asked.

## Updates

For an update entity, set `post_restart_required` and you are done. Once an install finishes without raising, the update entity asks for the restart for you.

```python
class MyUpdate(UpdateEntity):
    _attr_post_restart_required = True
```

It can also be set on the entity description, with `UpdateEntityDescription(post_restart_required=True)`. See the [update entity](/docs/core/entity/update) for the details.

## Anything else

For everything that is not an update, call the helper with your integration's domain:

```python
from homeassistant.helpers import system_state

system_state.async_set_home_assistant_restart_required(hass, DOMAIN)
```

The domain is shown to the user, so they know what is waiting for the restart. Asking more than once is fine; your integration is listed once.

The helper must be called from the event loop.

## There is no way to clear it

Once asked, the restart stays pending until Home Assistant restarts. There is no API to take it back. A fresh start clears it, which is exactly the point: the change you asked for has been applied by then.

Only ask once the change is actually waiting. Do not ask in advance, in case the user might change something.

## Reboots

There is no way for an integration to ask for a reboot. A reboot of the host is a Home Assistant OS matter, which Supervisor tracks and Home Assistant shows to the user. When a reboot is pending, the user is not shown a separate restart, because a reboot restarts Home Assistant as well.

## Reading the state

Integrations do not need to read the state; it is meant for the frontend and for automations. The frontend subscribes with the `subscribe_system_state` WebSocket command, available to admin users. It receives the current state right away, and again on every change:

```json
{
  "home_assistant_restart_required": true,
  "home_assistant_restart_sources": ["demo", "hacs"],
  "host_reboot_required": false
}
```
