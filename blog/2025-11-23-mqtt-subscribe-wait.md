---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Add a status callback for MQTT subscriptions
---

## Add a status callback for MQTT subscriptions

Integrations that use MQTT might need to wait for a subscription to complete before they initiate actions. The default behavior is that a subscription is queued and debounced, so callers usually do not wait for broker confirmation. Some integrations must guarantee that the broker finished the subscription. The  `mqtt.async_on_subscribe_done` helper can be used to monitor  MQTT subscriptions, to allow doing additional task. Make sure the same QoS is used as in the MQTT subscription.

Example:

```python
from homeassistant.components import mqtt

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Setup integration MQTT subscription monitoring."""

    def _on_subscribe_status() -> None:
        """Handle subscription ready signal."""
        # Do stuff

    # Handle subscription ready status update
    await mqtt.async_on_subscribe_done(
        hass,
        "myintegration/status",
        qos=1,
        on_subscribe_status=_on_subscribe_status,
    )

    # Do stuff
```
