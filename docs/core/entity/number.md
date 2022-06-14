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
| value | float | **Required** | Current value of the entity
| min_value | float | 0 | The minimum accepted value (inclusive)
| max_value | float | 100 | The maximum accepted value (inclusive)
| step | float | **See below** | Defines the resolution of the values, i.e. the smallest increment or decrement
| mode | string | `auto` | Defines how the number should be displayed in the UI. It's recommended to use the default `auto`. Can be `box` or `slider` to force a display mode.

Other properties that are common to all entities such as `icon`, `unit_of_measurement`, `name` etc are also applicable.

The default step value is dynamically chosen based on the range (max - min) values. If the difference between max_value and min_value is greater than 1.0, then the default step is 1.0. If, however, the range is smaller, then the step is iteratively divided by 10 until it becomes lower than the range.

## Restoring number states

Numbers which restore the state after restart or reload should not extend `RestoreEntity` because  that does not store the `native_value`, but instead the `state` which may have been modifed by the number base entity. Numbers which restore the state should extend `RestoreNumber` and call `await self.async_get_last_number_data` from `async_added_to_hass` to get access to the stored `native_min_value`,  `native_max_value`,  `native_step`,  `native_unit_of_measurement` and `native_value`.

## Methods

### Set value

Called when the user or automation wants to update the value.

```python
class MyNumber(NumberEntity):
    # Implement one of these methods.

    def set_value(self, value: float) -> None:
        """Update the current value."""

    async def async_set_value(self, value: float) -> None:
        """Update the current value."""

```
