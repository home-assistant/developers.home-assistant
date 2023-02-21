---
author: Jan Bouwhuis
authorURL: https://twitter.com/jbouwh
title: Deprecated callback signatures for MQTT subscribe removed
---

Home Assistant's MQTT integration [no longer supports](https://github.com/home-assistant/core/pull/88543)
deprecated callback signatures for MQTT subscribe.

Integrations that still used a deprecated callback signature for the callback function on MQTT subscribe will break. An exception will be raised if a not supported callback type is detected.

Examples of deprecated callback functions that will no longer work:

```python
async def async_deprecated_callback1(topic: str, payload: ReceivePayloadType, qos: int) -> None:
    """Deprecated async callback example 1."""
    ...


@callback
def async_deprecated_callback2(topic: str, payload: ReceivePayloadType, qos: int) -> None:
    """Deprecated async callback example 2."""
    ...
```

Example of a correct callback signature:

```python
@callback
def async_correct_callback(msg: msg: ReceiveMessage) -> None:
    """Callback example 1."""
    ...
```
