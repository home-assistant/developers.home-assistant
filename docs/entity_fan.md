---
title: Fan Entity
sidebar_label: Fan
---

A fan entity is a device that controls the different vectors of your fan such as speed, direction and oscillation. Derive entity platforms from ['homeassistant.components.fan.FanDevice'](https://github.com/home-assistant/home-assistant/blob/dev/homeassistant/components/fan/__init__.py).

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| current_direction | str | None | Return the current direction of the fan |
| is_on | boolean | None |Return true if the entity is on |
| speed | str | None | Return the current speed. One of the values in speed_list. | 
| speed_list | list | None| Get the list of available speeds. The allowed values are "off", "low", "medium" and "high". Use the corresponding constants SPEED_OFF, SPEED_LOW, SPEED_MEDIUM, SPEED_HIGH. |
| supported_features | int | 0 | Flag supported features |


## Supported Features

| Constant | Description |
|----------|--------------------------------------|
| 'SUPPORT_DIRECTION' | The fan supports changing the direction.
| 'SUPPORT_SET_SPEED' | The fan supports setting the speed.
| 'SUPPORT_OSCILLATE' | The fan supports oscillation.



## Methods

### Set direction

Only implement this method if the flag `SUPPORT_DIRECTION` is set.

```python
class FanEntity(ToggleEntity):
    # Implement one of these methods.

    def set_direction(self, direction: str) -> None:
        """Set the direction of the fan."""

    async def async_set_direction(self, direction: str) -> None:
        """Set the direction of the fan."""
```

### Set speed

Only implement this method if the flag `SUPPORT_SET_SPEED` is set.

```python
class FanEntity(ToggleEntity):
    # Implement one of these methods.

    def set_speed(self, speed: str) -> None:
        """Set the speed of the fan."""

    async def async_set_speed(self, speed: str) -> None:
        """Set the speed of the fan."""
```

### Turn on

```python
class FanEntity(ToggleEntity):
    # Implement one of these methods.

    def turn_on(self, speed: str = None, **kwargs: Any) -> None:
        """Turn on the fan."""

    async def async_turn_on(self, speed: str = None, **kwargs: Any) -> None:
        """Turn on the fan."""
```

### Turn off

```python
class FanEntity(ToggleEntity):
    # Implement one of these methods.

    def turn_off(self, **kwargs: Any) -> None:
        """Turn the fan off."""

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the fan off."""
```

### Toggle

Optional. If not implemented will default to checking what method to call using the is_on property.

```python
class FanEntity(ToggleEntity):
    # Implement one of these methods.

    def toggle(self, **kwargs: Any) -> None:
        """Toggle the fan."""

    async def async_toggle(self, **kwargs: Any) -> None:
        """Toggle the fan."""
```

### Oscillate

Only implement this method if the flag `SUPPORT_OSCILLATE` is set.

```python
class FanEntity(ToggleEntity):
    # Implement one of these methods.

    def oscillate(self, oscillating: bool) -> None:
        """Oscillate the fan."""

    async def async_oscillate(self, oscillating: bool) -> None:
        """Oscillate the fan."""
```






