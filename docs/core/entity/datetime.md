---
title: Date/Time Entity
sidebar_label: Date/Time
---

A `datetime` is an entity that allows the user to input a timestamp to an integration. Derive entity platforms from [`homeassistant.components.datetime.DateTimeEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/datetime/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

Properties that are common to all entities such as `icon`, `name` etc are applicable to this entity type.

## Methods

### Set value

Called when the user or an automation wants to update the value.

```python
class MyDateTime(DateTimeEntity):
    # Implement one of these methods.

    def set_value(self, dt_value: datetime) -> None:
        """Update the current value."""

    async def async_set_value(self, dt_value: datetime) -> None:
        """Update the current value."""

```
