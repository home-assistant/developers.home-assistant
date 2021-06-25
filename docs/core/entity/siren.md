---
title: Siren Entity
sidebar_label: Siren
---

A siren entity is a device whose main purpose is to control siren devices like a doorbell or chime. Derive entity platforms from [`homeassistant.components.siren.SirenEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/siren/__init__.py)

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name                    | Type   | Default                               | Description                                                                             |
| ----------------------- | ------ | ------------------------------------- | --------------------------------------------------------------------------------------- |
| is_on                   | bool   | `NotImplementedError()`               | Whether the device is on or off.                                                        |

### Tones

A device can have different tones that are played. Integrations are responsible for providing the available tones when supported.

### Supported features

Supported features constants are combined using the bitwise or (`|`) operator.

| Name                      | Description                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `SUPPORT_TONES`           | The device supports different tones (the tone is passed in to `turn_on` service).                                |
| `SUPPORT_VOLUME_SET`      | The device supports setting the volume level of the device (the volume level is passed in to `turn_on` service). |
| `SUPPORT_DURATION`        | The device supports setting a duration for the tone (the duration is passed in to `turn_on` service).            |


## Methods

### Turn on

```python
class MySirenEntity(SirenEntity):
    # Implement one of these methods.

    def turn_on(self, **kwargs):
        """Turn the device on."""

    async def async_turn_on(self, **kwargs):
        """Turn the device on."""
```

### Turn off

```python
class MySirenEntity(SirenEntity):
    # Implement one of these methods.

    def turn_off(self, **kwargs):
        """Turn the device off."""

    async def async_turn_off(self, **kwargs):
        """Turn the device off."""
```
