---
title: Text Entity
sidebar_label: Text
---

A text entity is an entity that allows the user to input a text value to an integration. Derive entity platforms from [`homeassistant.components.text.TextEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/text/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data or build a mechanism to push state updates to the entity class instance.
:::

| Name         | Type   | Default      | Description                                                                      |
|--------------|--------|--------------|----------------------------------------------------------------------------------|
| mode         | string | `text`       | Defines how the text should be displayed in the UI. Can be `text` or `password`. |
| native_max   | int    | 100          | The maximum number of characters in the text value (inclusive).                  |
| native_min   | int    | 0            | The minimum number of characters in the text value (inclusive).                  |
| pattern      | str    | `None`       | A regex pattern that the text value must match to be valid.                      |
| native_value | str    | **Required** | The value of the text.                                                           |

Other properties that are common to all entities such as `icon`, `name` etc. are also applicable.


## Methods

### Set value

```python
class MyTextEntity(TextEntity):
    # Implement one of these methods.

    def set_value(self, value: str) -> None:
        """Set the text value."""

    async def async_set_value(self, value: str) -> None:
        """Set the text value."""
```
