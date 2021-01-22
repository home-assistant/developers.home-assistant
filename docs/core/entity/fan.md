---
title: Fan Entity
sidebar_label: Fan
---

A fan entity is a device that controls the different vectors of your fan such as speed, direction and oscillation. Derive entity platforms from ['homeassistant.components.fan.FanDevice'](https://github.com/home-assistant/home-assistant/blob/dev/homeassistant/components/fan/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| current_direction | str | None | Return the current direction of the fan |
| is_on | boolean | None |Return true if the entity is on |
| oscillating | boolean | None | Return true if the fan is oscillating |
| percentage | int | None | Return the current speed percentage. Must be a value between 0 (off) and 100 |
| supported_features | int | 0 | Flag supported features |

## Deprecated Properties

The fan entity model has changed to use percentages in the range from 0 (off)-100 instead
of the named speeds. The new model replaces `speed` and `speed_list` with `percentage`. This change allowed us to expand the number of supported speeds to accommodate additional fan models in Home Assistant. 

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| speed | str | None | Return the current speed. One of the values in speed_list. |
| speed_list | list | None| Get the list of available speeds. The allowed values are "off", "low", "medium" and "high". Use the corresponding constants SPEED_OFF, SPEED_LOW, SPEED_MEDIUM, SPEED_HIGH. |

## Supported Features

| Constant | Description |
|----------|--------------------------------------|
| 'SUPPORT_DIRECTION' | The fan supports changing the direction.
| 'SUPPORT_SET_SPEED' | The fan supports setting the speed percentage.
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

### Set speed percentage

Only implement this method if the flag `SUPPORT_SET_SPEED` is set.

```python
class FanEntity(ToggleEntity):
    # Implement one of these methods.

    def set_percentage(self, percentage: int) -> None:
        """Set the speed percentage of the fan."""

    async def async_set_percentage(self, percentage: int) -> None:
        """Set the speed percentage of the fan."""
```

### Turn on

```python
class FanEntity(ToggleEntity):
    # Implement one of these methods.

    def turn_on(self, speed: Optional[str] = None percentage: Optional[int] = None, **kwargs: Any) -> None:
        """Turn on the fan."""

    async def async_turn_on(self, speed: Optional[str] = None, percentage: Optional[int] = None, **kwargs: Any) -> None:
        """Turn on the fan."""
```

:::tip `speed` is deprecated.

For intergrations that implemented `speed` before the model changed to percentage,
add the following code to the beginning of the function for backwards compatibility:

```
        if percentage is not None and speed is None:
            speed = self.percentage_to_speed(percentage)
```

For intergrations that implemented `percentage` after the model deprecated `speed`,
add the following code to the beginning of the function for backwards compatibility:

```
        if speed is not None and percentage is None:
            percentage = self.self.speed_to_percentage(speed)
```
:::

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
