---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Option added to wait for an MQTT subscription
---

## Option added to wait for an MQTT subscription

Integrations that use MQTT might need to wait for a subscription to complete. The default behavior is that a subscription is queued and debounced, so callers usually do not wait for broker confirmation. Some integrations must guarantee that the broker finished the subscription. To support this requirement, the MQTT subscribe API adds a `wait` option.

The new async signature for MQTT subscribe that supports the new wait option is:

```python
@bind_hass
async def async_subscribe(
    hass: HomeAssistant,
    topic: str,
    msg_callback: Callable[[ReceiveMessage], Coroutine[Any, Any, None] | None],
    qos: int = DEFAULT_QOS,
    encoding: str | None = DEFAULT_ENCODING,
    wait: bool = False,
) -> CALLBACK_TYPE:
    """Subscribe to an MQTT topic.

    Call the return value to unsubscribe.
    """
    ...
```

Example:

```python
from homeassistant.components import mqtt

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Setup integration with awaited MQTT subscribe."""

    @callback
    def async_subscribe_callback(msg: ReceiveMessage) -> None:
        """Callback example."""
        # Do stuff

    # Subscribe and wait
    unsubscribe_callback = mqtt.async_subscribe(
        hass, "myintegration/status", async_subscribe_callback, wait=True
    )

    # Do some stuff
    ...

    # Unsubscribe
    unsubscribe_callback()
```
