---
title: Date Entity
sidebar_label: Date
---

A `date` is an entity that allows the user to input a date to an integration. Derive entity platforms from [`homeassistant.components.date.DateEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/date/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| native_value | date | **Required** | The value of the date.

Other properties that are common to all entities such as `icon`, `name` etc are also applicable.

## Methods

### Set value

Called when the user or an automation wants to update the value.

```python
class MyDate(DateEntity):
    # Implement one of these methods.

    def set_value(self, value: date) -> None:
        """Update the current value."""

    async def async_set_value(self, value: date) -> None:
        """Update the current value."""

```
