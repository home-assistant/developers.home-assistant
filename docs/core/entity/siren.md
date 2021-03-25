---
title: Siren Entity
sidebar_label: Siren
---

A siren entity is a device whose main purpose is to control siren devices like a doorbell or chime. Derive entity platforms from [`homeassistant.components.siren.SirenEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/siren/__init__.py)

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name                    | Type   | Default                               | Description                                                                             |
| ----------------------- | ------ | ------------------------------------- | --------------------------------------------------------------------------------------- |
| volume_level            | float  | `None`                                | The volume level for the device.                                        |
| active_tone             | string | `NotImplementedError()`               | The active tone for the device. Requires `SUPPORT_TONES`.                               |
| available_tones         | list   | `NotImplementedError()`               | The available tones for the device. Requires `SUPPORT_TONES`.                           |
| is_on                   | bool   | `NotImplementedError()`               | Whether the device is on or off.                                                        |

### Tones

A device can have different tones that are played. Integrations are responsible for providing the available tones when supported.

### Supported features

Supported features constants are combined using the bitwise or (`|`) operator.

| Name                      | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| `SUPPORT_TONES`           | The device supports different tones.                           |
| `SUPPORT_VOLUME_SET`      | The device supports setting the volume level of the device.    |


## Methods

### Set volume level

```python
class MySirenEntity(SirenEntity):
    # Implement one of these methods.

    def set_volume_level(self, volume_level: float):
        """Set new volume level."""

    async def async_set_volume_level(self, volume_level: float):
        """Set new volume level."""
```

### Set active tone

This should only be implemented if the tone can be changed.

```python
class MySirenEntity(SirenEntity):
    # Implement one of these methods.

    def set_active_tone(self, tone: str):
        """Set new active tone."""

    async def async_set_active_tone(self, tone: str):
        """Set new active tone."""
```

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
