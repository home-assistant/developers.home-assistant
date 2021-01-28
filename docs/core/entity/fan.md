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
| preset_mode | str | None | Return the current preset_mode. One of the values in preset_modes. |
| preset_modes | list | None | Get the list of available preset_modes. This is an arbitrary list of str and should not contain any speeds. |

## Deprecated Properties

The fan entity model has changed to use percentages in the range from 0 (off) to 100 instead
of the named speeds. The new model replaces `speed` and `speed_list` with `percentage`, `preset_mode`, and `preset_modes`. This change allowed us to expand the number of supported speeds to accommodate additional fan models in Home Assistant. 

To maintain backwards compatibility with integations that have not updated to the new model, the deprecated properties will remain until at least the end of 2021. Integrations must update their [Turn on](#turn-on) function to consume `percentage` or `preset_mode` instead of `speed`.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| speed | str | None | Return the current speed. One of the values in speed_list. |
| speed_list | list | None| Get the list of available speeds. The allowed values are "off", "low", "medium" and "high". Use the corresponding constants SPEED_OFF, SPEED_LOW, SPEED_MEDIUM, SPEED_HIGH. |

## Supported Features

| Constant | Description |
|----------|--------------------------------------|
| 'SUPPORT_DIRECTION' | The fan supports changing the direction.
| 'SUPPORT_SET_SPEED' | The fan supports setting the speed percentage and optional preset modes.
| 'SUPPORT_OSCILLATE' | The fan supports oscillation.
| 'SUPPORT_PRESET_MODE' | The fan supports preset modes.

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

### Set preset mode

Only implement this method if the flag `SUPPORT_PRESET_MODE` is set.

```python
class FanEntity(ToggleEntity):
    # Implement one of these methods.

    def set_preset_mode(self, preset_mode: str) -> None:
        """Set the preset mode of the fan."""

    async def async_set_preset_mode(self, preset_mode: str) -> None:
        """Set the preset mode of the fan."""
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

:::tip Converting speeds

Home Assistant includes a utility to convert speeds.

If the device has a list of named speeds:

```python
from homeassistant.util.percentage import ordered_list_item_to_percentage, percentage_to_ordered_list_item

ORDERED_NAMED_FAN_SPEEDS = ["one", "two", "three", "four", "five", "six"]  # off is not included

percentage = ordered_list_item_to_percentage(ORDERED_NAMED_FAN_SPEEDS, "three")

named_speed = percentage_to_ordered_list_item(ORDERED_NAMED_FAN_SPEEDS, 23)
```

If the device has a numeric range of speeds:

```python
from homeassistant.util.percentage import ranged_value_to_percentage, percentage_to_ranged_value

SPEED_RANGE = (1, 255)  # off is not included

percentage = ranged_value_to_percentage(SPEED_RANGE, 127)

value_in_range = math.ceil(percentage_to_ranged_value(SPEED_RANGE, 50))
```
:::

### Turn on

```python
class FanEntity(ToggleEntity):
    # Implement one of these methods.

    def turn_on(self, speed: Optional[str] = None, percentage: Optional[int] = None, preset_mode: Optional[str] = None, **kwargs: Any) -> None:
        """Turn on the fan."""

    async def async_turn_on(self, speed: Optional[str] = None, percentage: Optional[int] = None, preset_mode: Optional[str] = None, **kwargs: Any) -> None:
        """Turn on the fan."""
```

:::tip `speed` is deprecated.

For new intergrations, `speed` should not be implemented and only `percentage` and `preset_mode` should be used.

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
