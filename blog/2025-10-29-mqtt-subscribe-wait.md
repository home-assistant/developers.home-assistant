---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Option added to add a callback for status updates on an MQTT subscription
---

## Option added to add a callback on an MQTT subscription

Integrations that use MQTT might need to wait for a subscription to complete before they initiate actions. The default behavior is that a subscription is queued and debounced, so callers usually do not wait for broker confirmation. Some integrations must guarantee that the broker finished the subscription. To support this requirement, the MQTT subscribe API adds a `on_subscribe_status` callback option.

The new async signature for MQTT subscribe that supports the new wait option is:

```python
@bind_hass
async def async_subscribe(
    hass: HomeAssistant,
    topic: str,
    msg_callback: Callable[[ReceiveMessage], Coroutine[Any, Any, None] | None],
    qos: int = DEFAULT_QOS,
    encoding: str | None = DEFAULT_ENCODING,
    on_subscribe_status: CALLBACK_TYPE,
) -> CALLBACK_TYPE:
    """Subscribe to an MQTT topic.

    Call the return value to unsubscribe.
    """
    ...
```

Example where we want to publish a status update after the subscription is ready:

```python
from homeassistant.components import mqtt

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Setup integration with awaited MQTT subscription."""

    @callback
    def async_subscribe_callback(msg: ReceiveMessage) -> None:
        """Callback example."""
        # Do stuff

    def _on_subscribe() -> None:
        """Publish an online state when we are ready to receive updates."""
        hass.async_create_task(
            mqtt.async_publish(
                hass, "myintegration/status", "online", 0, retain=True
            )
        )

    # Subscribe and wait
    unsubscribe_callback = await mqtt.async_subscribe(
        hass,
        "myintegration/updates",
        async_subscribe_callback,
        qos=1,
        on_subscribe_status=_on_subscribe_status
    )

    # Do some stuff
    ...
```

## Receive status updates on for as specific MQTT subscription

In case a subscription is already pending, or when we want to keep monitoring, the  `mqtt.async_on_subscribe_done` helper can be used to monitor its subscription, to allow doing additional task. Make sure the same QoS is used.

Example:

```python
from homeassistant.components import mqtt

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Setup integration MQTT subscription monitoring."""

    def _on_subscribe_status() -> None:
        """Integration ."""
        # Do stuff

    # Await a pending subscription
    await mqtt.async_on_subscribe_done(
        hass,
        "myintegration/status",
        qos=1,
        on_subscribe_status=_on_subscribe_status,
    )

    # Do stuff
```
