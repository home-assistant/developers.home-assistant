---
title: Siren Entity
sidebar_label: Siren
---

A siren entity is a device whose main purpose is to control siren devices like a doorbell or chime. Derive entity platforms from [`homeassistant.components.siren.SirenEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/siren/__init__.py)

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data or build a mechanism to push state updates to the entity class instance.

| Name                    | Type   | Default                               | Description                                                                             |
| ----------------------- | ------ | ------------------------------------- | --------------------------------------------------------------------------------------- |
| is_on                   | bool   | `NotImplementedError()`               | Whether the device is on or off.                                                        |

### Tones

A device can have different tones that are played. Integrations are responsible for providing the available tones when supported.

### Supported features

Supported features constants are combined using the bitwise or (`|`) operator.

| Name                      | Description                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `SUPPORT_TONES`           | The device supports different tones (the tone can be passed in to `turn_on` service).                                |
| `SUPPORT_DURATION`        | The device supports setting a duration for the tone (the duration can be passed in to `turn_on` service).            |
| `SUPPORT_VOLUME_SET`      | The device supports setting the volume level of the device (the volume level can be passed in to `turn_on` service). |


## Methods

### Turn on

There are three optional input parameters that can be passed into the service call:
- `tone`: `vol.Any(vol.Coerce(int), cv.string)`
- `duration`: `cv.positive_int`
- `volume_level`: `cv.small_float`

Each input parameter is gated by a supported feature flag. If the corresponding flag isn't set when a given input parameter is provided in the service call, it will be filtered out from the service call by the base platform before being passed to the integration. The input parameter to supported feature flag is as follows:
- `tone`: `SUPPORT_TONES`
- `duration`: `SUPPORT_DURATIONS`
- `volume_level`: `SUPPORT_VOLUME_SET`

Only include the parameters that your integration supports in your turn on function definition as the rest will always be `None`

```python
class MySirenEntity(SirenEntity):
    # Implement one of these methods.

    def turn_on(
            self,
            tone: int | str = None,
            duration: int = None,
            volume_level: float = None,
            **kwargs
        ) -> None:
        """Turn the device on."""

    async def async_turn_on(
            self,
            tone: int | str = None,
            duration: int = None,
            volume_level: float = None,
            **kwargs
        ) -> None:
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
