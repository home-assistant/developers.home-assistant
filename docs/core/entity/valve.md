---
title: Valve Entity
sidebar_label: Valve
---

A valve entity controls valve devices such as a the water or gas valves in your home. Derive a platform entity from [`homeassistant.components.valve.ValveEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/valve/__init__.py).

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ----------------------- | ---- | ------- | -----------
| current_valve_position | <code>int &#124; None</code> | `None` | The current position of the valve where 0 means closed and 100 is fully open.
| is_closed | <code>bool &#124; None</code> | **Required** | If the valve is closed or not. Used to determine `state`.
| is_closing | <code>bool &#124; None</code> | `None` | If the valve is closing or not. Used to determine `state`.
| is_opening | <code>bool &#124; None</code> | `None` | If the valve is opening or not. Used to determine `state`.

### Device Classes

| Constant | Description
|----------|-----------------------|
| `ValveDeviceClass.WATER` | Control of a water valve.
| `ValveDeviceClass.GAS` | Control of a gas valve.


### States

| Constant | Description
|----------|------------------------|
| `STATE_OPENING` | The valve is in the process of opening to reach a set position.
| `STATE_OPEN` | The valve has reached the open position.
| `STATE_CLOSING` | The valve is in the process of closing to reach a set position.
| `STATE_CLOSED` | The valve has reach the closed position.

## Supported Features

Supported features are defined by using values in the `ValveEntityFeature` enum
and are combined using the bitwise or (`|`) operator.

| Value               | Description                                                                      |
| ------------------- | -------------------------------------------------------------------------------- |
| `OPEN`              | The valve supports being opened.                                                 |
| `CLOSE`             | The valve supports being closed.                                                 |
| `SET_POSITION`      | The valve supports moving to a specific position between opened and closed.      |
| `STOP`              | The valve supports stopping the current action (open, close, set position)       |

## Methods

### Open valve

Only implement this method if the flag `SUPPORT_OPEN` is set.

```python
class MyValve(ValveEntity):
    # Implement one of these methods.

    def open_valve(self):
        """Open the valve."""

    async def async_open_valve(self):
        """Open the valve."""
```

### Close valve

Only implement this method if the flag `SUPPORT_CLOSE` is set.

```python
class MyValve(ValveEntity):
    # Implement one of these methods.

    def close_valve(self):
        """Close valve."""

    async def async_close_valve(self):
        """Close valve."""
```

### Set valve position

Only implement this method if the flag `SUPPORT_SET_POSITION` is set.

```python
class MyValve(ValveEntity):
    # Implement one of these methods.

    def set_valve_position(self):
        """Move the valve to a specific position."""

    async def async_set_valve_position(self):
        """Move the valve to a specific position."""
```

### Stop valve

Only implement this method if the flag `SUPPORT_STOP` is set.

```python
class MyValve(ValveEntity):
    # Implement one of these methods.

    def stop_valve(self):
        """Stop the valve."""

    async def async_stop_valve(self):
        """Stop the valve."""
```
