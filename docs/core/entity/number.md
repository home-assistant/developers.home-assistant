---
title: Number Entity
sidebar_label: Number
---

A `number` is an entity that allows the user to input an arbitrary value to an integration. Derive entity platforms from [`homeassistant.components.number.NumberEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/number/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| device_class | string | `None` | Type of number.
| mode | string | `auto` | Defines how the number should be displayed in the UI. It's recommended to use the default `auto`. Can be `box` or `slider` to force a display mode.
| native_max_value | float | 100 | The maximum accepted value in the number's `native_unit_of_measurement` (inclusive)
| native_min_value | float | 0 | The minimum accepted value in the number's `native_unit_of_measurement` (inclusive)
| native_step | float | **See below** | Defines the resolution of the values, i.e. the smallest increment or decrement in the number's | native_unit_of_measurement | string | `None` | The unit of measurement that the number's value is expressed in. If the `native_unit_of_measurement` is °C or °F, and its `device_class` is temperature, the number's `unit_of_measurement` will be the preferred temperature unit configured by the user and the number's `state` will be the `native_value` after an optional unit conversion.
| native_value | float | **Required** | The value of the number in the number's `native_unit_of_measurement`.
`native_unit_of_measurement`

Other properties that are common to all entities such as `icon`, `name` etc are also applicable.

The default step value is dynamically chosen based on the range (max - min) values. If the difference between max_value and min_value is greater than 1.0, then the default step is 1.0. If, however, the range is smaller, then the step is iteratively divided by 10 until it becomes lower than the range.

### Available device classes

If specifying a device class, your number entity will need to also return the correct unit of measurement.

| Type | Supported units | Description
| ---- | ---- | -----------
| temperature | °C, °F | Temperature.

## Methods

### Set value

Called when the user or an automation wants to update the value.

```python
class MyNumber(NumberEntity):
    # Implement one of these methods.

    def set_native_value(self, value: float) -> None:
        """Update the current value."""

    async def async_set_native_value(self, value: float) -> None:
        """Update the current value."""

```
