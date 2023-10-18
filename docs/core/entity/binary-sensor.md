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
| `BinarySensorDeviceClass.BATTERY` | on means low, off means normal.
| `BinarySensorDeviceClass.BATTERY_CHARGING` | on means charging, off means not charging.
| `BinarySensorDeviceClass.CO` | on means carbon monoxide detected, off means no carbon monoxide (clear).
| `BinarySensorDeviceClass.COLD` | on means cold, off means normal.
| `BinarySensorDeviceClass.CONNECTIVITY` | on means connected, off means disconnected.
| `BinarySensorDeviceClass.DOOR` | on means open, off means closed.
| `BinarySensorDeviceClass.GARAGE_DOOR` | on means open, off means closed.
| `BinarySensorDeviceClass.GAS` | on means gas detected, off means no gas (clear).
| `BinarySensorDeviceClass.HEAT` | on means hot, off means normal.
| `BinarySensorDeviceClass.LIGHT` | on means light detected, off means no light.
| `BinarySensorDeviceClass.LOCK` | on means open (unlocked), off means closed (locked).
| `BinarySensorDeviceClass.MOISTURE` | on means wet, off means dry.
| `BinarySensorDeviceClass.MOTION` | on means motion detected, off means no motion (clear).
| `BinarySensorDeviceClass.MOVING` | on means moving, off means not moving (stopped).
| `BinarySensorDeviceClass.OCCUPANCY` | on means occupied, off means not occupied (clear).
| `BinarySensorDeviceClass.OPENING` | on means open, off means closed.
| `BinarySensorDeviceClass.PLUG` | on means plugged in, off means unplugged.
| `BinarySensorDeviceClass.POWER` | on means power detected, off means no power.
| `BinarySensorDeviceClass.PRESENCE` | on means home, off means away.
| `BinarySensorDeviceClass.PROBLEM` | on means problem detected, off means no problem (OK).
| `BinarySensorDeviceClass.RUNNING` | on means running, off means not running.
| `BinarySensorDeviceClass.SAFETY` | on means unsafe, off means safe.
| `BinarySensorDeviceClass.SMOKE` | on means smoke detected, off means no smoke (clear).
| `BinarySensorDeviceClass.SOUND` | on means sound detected, off means no sound (clear).
| `BinarySensorDeviceClass.TAMPER` | on means tampering detected, off means no tampering (clear)
| `BinarySensorDeviceClass.UPDATE` | on means update available, off means up-to-date. The use of this device class should be avoided, please consider using the [`update`](/docs/core/entity/update) entity instead.
| `BinarySensorDeviceClass.VIBRATION` | on means vibration detected, off means no vibration.
| `BinarySensorDeviceClass.WINDOW` | on means open, off means closed.
