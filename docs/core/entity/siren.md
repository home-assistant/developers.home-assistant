---
title: Siren entity
sidebar_label: Siren
---

A siren entity is a device whose main purpose is to control siren devices like a doorbell or chime. Derive entity platforms from [`homeassistant.components.siren.SirenEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/siren/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data or build a mechanism to push state updates to the entity class instance.
:::

| Name                    | Type   | Default                               | Description                                                                             |
| ----------------------- | ------ | ------------------------------------- | --------------------------------------------------------------------------------------- |
| is_on                   | bool           | `None`                                | Whether the device is on or off.                                                        |
| available_tones         | list or dict   | `NotImplementedError()`               | The list or dictionary of available tones on the device to pass into the `turn_on` service action. If a dictionary is provided, when a user uses the dict value of a tone, it will get converted to the corresponding dict key before being passed on to the integration platform. Requires `SUPPORT_TONES` feature.           |

### Tones

A device can have different tones that are played. Integrations are responsible for providing the available tones when supported.

### Supported features

Supported features constants are combined using the bitwise or (`|`) operator.

| Name                      | Description                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `SirenEntityFeature.TONES`           | The device supports different tones (the tone can be passed in to `turn_on` service action).                                |
| `SirenEntityFeature.DURATION`        | The device supports setting a duration for the tone (the duration can be passed in to `turn_on` service action).            |
| `SirenEntityFeature.VOLUME_SET`      | The device supports setting the volume level of the device (the volume level can be passed in to `turn_on` service action). |


## Methods

### Turn on

There are three optional input parameters that can be passed into the service action call, each gated by a supported feature flag. If the corresponding flag isn't set when a given input parameter is provided in the service action call, it will be filtered out from the call by the base platform before being passed to the integration.

| Parameter Name 	| Data Validation                       	| Supported Feature Flag 	|
|----------------	|---------------------------------------	|------------------------	|
| `tone`         	| `vol.Any(vol.Coerce(int), cv.string)` 	| `SUPPORT_TONES`        	|
| `duration`     	| `cv.positive_int`                     	| `SUPPORT_DURATIONS`    	|
| `volume_level` 	| `cv.small_float`                      	| `SUPPORT_VOLUME_SET`   	|

```python
class MySirenEntity(SirenEntity):
    # Implement one of these methods.

    def turn_on(self, **kwargs) -> None:
        """Turn the device on."""

    async def async_turn_on(self, **kwargs) -> None:
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
