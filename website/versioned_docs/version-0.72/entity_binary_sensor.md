---
title: Binary Sensor Entity
sidebar_label: Binary Sensor
id: version-0.72-entity_binary_sensor
original_id: entity_binary_sensor
---

A binary sensor is a sensor that can only have two states.

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| is_on| boolean | **Required** | If the binary sensor is currently on or off.
| device_class | string | `None` | Type of binary sensor.

### Available device classes

| Value | Description
| ----- | -----------
| battery | On means low, Off means normal.
| cold | On means cold, Off means normal.
| connectivity | On means connected, Off means disconnected.
| door | On means open, Off means closed.
| garage_door | On means open, Off means closed.
| gas | On means gas detected, Off means no gas (clear).
| heat | On means hot, Off means normal.
| light | On means light detected, Off means no light.
| lock | On means open (unlocked), Off means closed (locked).
| moisture | On means wet, Off means dry.
| motion | On means motion detected, Off means no motion (clear).
| moving | On means moving, Off means not moving (stopped).
| occupancy | On means occupied, Off means not occupied (clear).
| opening | On means open, Off means closed.
| plug | On means plugged in, Off means unplugged.
| power | On means power detected, Off means no power.
| presence | On means home, Off means away.
| problem | On means problem detected, Off means no problem (OK).
| safety | On means unsafe, Off means safe.
| smoke | On means smoke detected, Off means no smoke (clear).
| sound | On means sound detected, Off means no sound (clear).
| vibration | On means vibration detected, Off means no vibration.
| window | On means open, Off means closed.
