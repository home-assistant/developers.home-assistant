---
title: Cover Entity
sidebar_label: Cover
---

A cover entity controls an opening or cover, such as a garage door or a window shade. Derive a platform entity from [`homeassistant.components.cover.CoverEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/cover/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

### Platform Properties (to be implemented by deriving platform classes)

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| current_cover_position | int | None | The current position of cover where 0 means closed and 100 is fully open.  Required with `SUPPORT_SET_POSITION`.
| current_cover_tilt_position | int | None | The current tilt position of the cover where 0 means closed/no tilt and 100 means open/maximum tilt.  Required with `SUPPORT_SET_TILT_POSITION`
| is_opening | bool | None | If the cover is opening or not. Used to determine `state`.
| is_closing | bool | None | If the cover is closing or not. Used to determine `state`.
| is_closed | bool | `NotImplementedError()` | If the cover is closed or not.  if the state is unknown, return `None`. Used to determine `state`.

### Entity Properties (base class properties which may be overridden)

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| device_class | string | None | Describes the type/class of the cover. Must be `None` or one of the valid values from the table below.
| supported_features | int (bitwise) | Value determined from `current_cover_position` and `current_cover_tilt_position` | Describes the supported features. See the related table below for details.

### Device Classes

:::tip
When specifying a device class, you should use the `CoverDeviceClass` enum. For example when specifying the type `awning` from below you should use `CoverDeviceClass.AWNING`.
:::

| Type | Description
|----------|-----------------------|
| `awning` | Control of an awning, such as an exterior retractible window, door, or patio cover.
| `blind` | Control of blinds, which are linked slats that expand or collapse to cover an opening or may be tilted to partially cover an opening, such as window blinds.
| `curtain` | Control of curtains or drapes, which is often fabric hung above a window or door that can be drawn open.
| `damper` | Control of a mechanical damper that reduces air flow, sound, or light.
| `door` | Control of a door that provides access to an area which is typically part of a structure.
| `garage` | Control of a garage door that provides access to a garage.
| `gate` | Control of a gate that provides access to a driveway or other area. Gates are found outside of a structure and are typically part of a fence.
| `shade` | Control of shades, which are a continuous plane of material or connected cells that expanded or collapsed over an opening, such as window shades.
| `shutter` | Control of shutters, which are linked slats that swing out/in to cover an opening or may be tilted to partially cover an opening, such as indoor or exterior window shutters.
| `window` | Control of a physical window that opens and closes or may tilt.

### States

| Constant | Description
|----------|------------------------|
| `STATE_OPENING` | The cover is in the process of opening to reach a set position.
| `STATE_OPEN` | The cover has reached the open position.
| `STATE_CLOSING` | The cover is in the process of closing to reach a set position.
| `STATE_CLOSED` | The cover has reach the closed position.

## Supported Features

Supported features are defined by using values in the `CoverEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value               | Description                                                                      |
| ------------------- | -------------------------------------------------------------------------------- |
| `OPEN`              | The cover supports being opened.                                                 |
| `CLOSE`             | The cover supports being closed.                                                 |
| `SET_POSITION`      | The cover supports moving to a specific position between opened and closed.      |
| `STOP`              | The cover supports stopping the current action (open, close, set position)       |
| `OPEN_TILT`         | The cover supports being tilting open.                                           |
| `CLOSE_TILT`        | The cover supports being tilting closed.                                         |
| `SET_TILT_POSITION` | The cover supports moving to a specific tilt position between opened and closed. |
| `STOP_TILT`         | The cover supports stopping the current tilt action (open, close, set position)  |

## Methods

### Open cover

Only implement this method if the flag `SUPPORT_OPEN` is set.

```python
class MyCover(CoverEntity):
    # Implement one of these methods.

    def open_cover(self, **kwargs):
        """Open the cover."""

    async def async_open_cover(self, **kwargs):
        """Open the cover."""
```

### Close cover

Only implement this method if the flag `SUPPORT_CLOSE` is set.

```python
class MyCover(CoverEntity):
    # Implement one of these methods.

    def close_cover(self, **kwargs):
        """Close cover."""

    async def async_close_cover(self, **kwargs):
        """Close cover."""
```

### Set cover position

Only implement this method if the flag `SUPPORT_SET_POSITION` is set.

```python
class MyCover(CoverEntity):
    # Implement one of these methods.

    def set_cover_position(self, **kwargs):
        """Move the cover to a specific position."""

    async def async_set_cover_position(self, **kwargs):
        """Move the cover to a specific position."""
```

### Stop cover

Only implement this method if the flag `SUPPORT_STOP` is set.

```python
class MyCover(CoverEntity):
    # Implement one of these methods.

    def stop_cover(self, **kwargs):
        """Stop the cover."""

    async def async_stop_cover(self, **kwargs):
        """Stop the cover."""
```

### Open cover tilt

Only implement this method if the flag `SUPPORT_OPEN_TILT` is set.

```python
class MyCover(CoverEntity):
    # Implement one of these methods.

    def open_cover_tilt(self, **kwargs):
        """Open the cover tilt."""

    async def async_open_cover_tilt(self, **kwargs):
        """Open the cover tilt."""
```

### Close cover tilt

Only implement this method if the flag `SUPPORT_CLOSE_TILT` is set.

```python
class MyCover(CoverEntity):
    # Implement one of these methods.

    def close_cover_tilt(self, **kwargs):
        """Close the cover tilt."""

    async def async_close_cover_tilt(self, **kwargs):
        """Close the cover tilt."""
```

### Set cover tilt position

Only implement this method if the flag `SUPPORT_SET_TILT_POSITION` is set.

```python
class MyCover(CoverEntity):
    # Implement one of these methods.

    def set_cover_tilt_position(self, **kwargs):
        """Move the cover tilt to a specific position."""

    async def async_set_cover_tilt_position(self, **kwargs):
        """Move the cover tilt to a specific position."""
```

### Stop cover tilt

Only implement this method if the flag `SUPPORT_STOP_TILT` is set.

```python
class MyCover(CoverEntity):
    # Implement one of these methods.

    def stop_cover_tilt(self, **kwargs):
        """Stop the cover."""

    async def async_stop_cover_tilt(self, **kwargs):
        """Stop the cover."""
```
