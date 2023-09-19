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
| is_on| <code>bool &#124; None</code> | `None` | **Required**. If the binary sensor is currently on or off.
| device_class | <code>BinarySensorDeviceClass &#124; None</code> | `None` | Type of binary sensor.

### Available device classes

| Constant | Description
| ----- | -----------
| `BinarySensorDeviceClass.BATTERY` | On means low, Off means normal.
| `BinarySensorDeviceClass.BATTERY_CHARGING` | On means charging, Off means not charging.
| `BinarySensorDeviceClass.CO` | On means carbon monoxide detected, Off means no carbon monoxide (clear).
| `BinarySensorDeviceClass.COLD` | On means cold, Off means normal.
| `BinarySensorDeviceClass.CONNECTIVITY` | On means connected, Off means disconnected.
| `BinarySensorDeviceClass.DOOR` | On means open, Off means closed.
| `BinarySensorDeviceClass.GARAGE_DOOR` | On means open, Off means closed.
| `BinarySensorDeviceClass.GAS` | On means gas detected, Off means no gas (clear).
| `BinarySensorDeviceClass.HEAT` | On means hot, Off means normal.
| `BinarySensorDeviceClass.LIGHT` | On means light detected, Off means no light.
| `BinarySensorDeviceClass.LOCK` | On means open (unlocked), Off means closed (locked).
| `BinarySensorDeviceClass.MOISTURE` | On means wet, Off means dry.
| `BinarySensorDeviceClass.MOTION` | On means motion detected, Off means no motion (clear).
| `BinarySensorDeviceClass.MOVING` | On means moving, Off means not moving (stopped).
| `BinarySensorDeviceClass.OCCUPANCY` | On means occupied, Off means not occupied (clear).
| `BinarySensorDeviceClass.OPENING` | On means open, Off means closed.
| `BinarySensorDeviceClass.PLUG` | On means plugged in, Off means unplugged.
| `BinarySensorDeviceClass.POWER` | On means power detected, Off means no power.
| `BinarySensorDeviceClass.PRESENCE` | On means home, Off means away.
| `BinarySensorDeviceClass.PROBLEM` | On means problem detected, Off means no problem (OK).
| `BinarySensorDeviceClass.RUNNING` | On means running, Off means not running.
| `BinarySensorDeviceClass.SAFETY` | On means unsafe, Off means safe.
| `BinarySensorDeviceClass.SMOKE` | On means smoke detected, Off means no smoke (clear).
| `BinarySensorDeviceClass.SOUND` | On means sound detected, Off means no sound (clear).
| `BinarySensorDeviceClass.TAMPER` | On means tampering detected, Off means no tampering (clear)
| `BinarySensorDeviceClass.UPDATE` | On means update available, Off means up-to-date. The use of this device class should be avoided, please consider using the [`update`](/docs/core/entity/update) entity instead.
| `BinarySensorDeviceClass.VIBRATION` | On means vibration detected, Off means no vibration.
| `BinarySensorDeviceClass.WINDOW` | On means open, Off means closed.
