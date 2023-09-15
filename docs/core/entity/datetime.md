---
title: Date/Time Entity
sidebar_label: Date/Time
---

A `datetime` is an entity that allows the user to input a timestamp to an integration. Derive entity platforms from [`homeassistant.components.datetime.DateTimeEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/datetime/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| native_value | <code>datetime &#124; None</code> | **Required** | The value of the datetime. Must include timezone info.

Other properties that are common to all entities such as `icon`, `name` etc are also applicable.

## Methods

### Set value

Called when the user or an automation wants to update the value. The input datetime will always be in UTC.

```python
class MyDateTime(DateTimeEntity):
    # Implement one of these methods.

    def set_value(self, value: datetime) -> None:
        """Update the current value."""

    async def async_set_value(self, value: datetime) -> None:
        """Update the current value."""

```
