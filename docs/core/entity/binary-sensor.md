---
title: Binary Sensor Entity
sidebar_label: Binary Sensor
---

A binary sensor is a sensor that can only have two states. Derive entity platforms from [`homeassistant.components.binary_sensor.BinarySensorEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/binary_sensor/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| is_on| boolean | `None` | **Required**. If the binary sensor is currently on or off.
| device_class | string | `None` | Type of binary sensor.

### Available device classes

:::tip
When specifying a device class, you should use the `BinarySensorDeviceClass` enum. For example when specifying the type `battery` from below you should use `BinarySensorDeviceClass.BATTERY`.
:::

| Type | Description
| ----- | -----------
| battery | On means low, Off means normal.
| battery_charging | On means charging, Off means not charging.
| co | On means carbon monoxide detected, Off means no carbon monoxide (clear).
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
| running | On means running, Off means not running.
| safety | On means unsafe, Off means safe.
| smoke | On means smoke detected, Off means no smoke (clear).
| sound | On means sound detected, Off means no sound (clear).
| tamper | On means tampering detected, Off means no tampering (clear)
| update | On means update available, Off means up-to-date. The use of this device class should be avoided, please consider using the [`update`](/docs/core/entity/update) entity instead.
| vibration | On means vibration detected, Off means no vibration.
| window | On means open, Off means closed.
