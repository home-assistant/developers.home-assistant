---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: MQTT publish API changes
---
In the future, the MQTT publish API will require explicit values for `qos` and `retain`. Passing `None` for either argument will no longer be supported.
Custom integrations should update their code to accept the defaults, or pass valid typed arguments.
The fallbacks of `None` to a valid value for `qos` and `retain` will stop working with HA Core 2027.6.

The new API signatures are:

```python
def publish(
    hass: HomeAssistant,
    topic: str,
    payload: PublishPayloadType,
    qos: int = 0,
    retain: bool = False,
    encoding: str | None = DEFAULT_ENCODING,
) -> None:
    """Publish message to a MQTT topic."""
    hass.create_task(async_publish(hass, topic, payload, qos, retain, encoding))
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
) -> None:
    """Publish message to a MQTT topic."""
```
