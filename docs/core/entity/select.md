---
title: Select Entity
sidebar_label: Select
---

A `select` is an entity that allows the user to select an option from a list of limited options provided by the integration. Derive entity platforms from [`homeassistant.components.select.SelectEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/select/__init__.py)

This entity should only be used in cases there is no better fitting option available.
For example, a bulb can have user selectable light effects. While that could be done using this `select` entity, it should really be part of the `light` entity, which already supports light effects.

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| current_option | str | None | The current select option
| options | list | **Required** | A list of available options as strings

Other properties that are common to all entities such as `icon`, `unit_of_measurement`, `name` etc are also applicable.

## Methods

### Select option

Called when the user or automation wants to change the current selected option.

```python
class MySelect(SelectEntity):
    # Implement one of these methods.

    def select_option(self, option: str) -> None:
        """Change the selected option."""

    async def async_select_option(self, option: str) -> None:
        """Change the selected option."""

```
