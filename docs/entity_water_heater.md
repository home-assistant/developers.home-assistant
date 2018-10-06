---
title: Water Heater Entity
sidebar_label: Water Heater
---

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| min_temp | float | 110°F | The minimum temperature that can be set.
| max_temp | float | 140°F | The maximum temperature that can be set.
| temperature | float | none | The current temperature in °C or °F.
| operation_mode | string | none | The current operation mode.
| operation_list | list | none | List of possible operation modes.
| away_mode | string | none | The current status of away mode. (on, off)

Properties have to follow the units defined in the `unit_system`.