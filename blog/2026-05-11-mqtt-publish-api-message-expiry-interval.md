---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: MQTT publish API supports message expiry interval
---
The MQTT publish API now supports setting a message expiry interval.
Previously, retained messages were stored by the broker until they were replaced or explicitly cleared. With a `message_expiry_interval` set (in seconds), a published message — including a retained one — will automatically expire after the specified interval.
This option is only supported when using MQTT protocol version 5; it is ignored when using earlier protocol versions.

The new API signatures are:

```python
def publish(
    hass: HomeAssistant,
    topic: str,
    payload: PublishPayloadType,
    qos: int = 0,
    retain: bool = False,
    encoding: str | None = DEFAULT_ENCODING,
    *,
    message_expiry_interval: int | None = None,
) -> None:
    """Publish message to a MQTT topic."""
```

and

```python
async def async_publish(
    hass: HomeAssistant,
    topic: str,
    payload: PublishPayloadType,
    qos: int = 0,
    retain: bool = False,
    encoding: str | None = DEFAULT_ENCODING,
    *,
    message_expiry_interval: int | None = None,
) -> None:
    """Publish message to a MQTT topic."""
```
