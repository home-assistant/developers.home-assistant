---
title: Analog Switch Entity
sidebar_label: Analog Switch
---

An analog_switch is an entity that allows the user to input an arbitrary number to an integration. Derive entity platforms from [`homeassistant.components.analog_switch.AnalogSwitchEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/analog_switch/__init__.py)

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| state | float | **Required** | Current value of the analog switch
| min_value | float | 0 | The minimum accepted value (inclusive)
| max_value | float | 100 | The maximum accepted value (inclusive)
| step | float | **See below** | Defines the resolution of the values, i.e. the smallest increment or decrement
| mode | string | "slider" | Appearance to the user. Either MODE_SLIDER or MODE_BOX
| device_class | string | None | What type of device this. See below for the available device classes.

Other properties that are common to all entities such as `icon`, `unit_of_measurement`, `name` etc are also applicable.

The default step value is dynamically chosen based on the range (max - min) values. If the difference between max_value and min_value is greater than 1.0, then the default step is 1.0. If however the range is smaller, then the step is iteratively devided by 10 until it becomes lower than the range.

## Methods

### Set value

Called when the user or automation wants to update the value.

```python
class MyAnalogSwitch(AnalogSwitchEntity):
    # Implement one of these methods.

    def set_value(self, value: float) -> None:
        """Update the current value."""

    async def async_set_value(self, value: float) -> None:
        """Update the current value."""

```

### Increment

Optional. If not implemented will default to setting a new value based on current `state` and `step` properties.

```python
class MyAnalogSwitch(AnalogSwitchEntity):
    # Implement one of these methods.

    def increment(self) -> None:
        """Increment value."""

    async def async_increment(self) -> None:
        """Increment value."""

```

### Decrement

Optional. If not implemented will default to setting a new value based on current `state` and `step` properties.

```python
class MyAnalogSwitch(AnalogSwitchEntity):
    # Implement one of these methods.

    def decrement(self) -> None:
        """Decrement value."""

    async def async_decrement(self) -> None:
        """Decrement value."""

```

### Available device classes
Optional. What type of device this.
| Value | Constant | Description
| ----- | -------- | -----------
| brightness | DEVICE_CLASS_BRIGHTNESS | Entity is a brightness controller
| strength | DEVICE_CLASS_STRENGTH | Entity controlls strength of something
| volume | DEVICE_CLASS_VOLUME | Entity controlls the volume
| speed | DEVICE_CLASS_SPEED | Entity controlls speed
| level | DEVICE_CLASS_LEVEL | Entity controlls the level of something
