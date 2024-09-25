---
title: Device tracker entity
sidebar_label: Device tracker
---

A device tracker is a read-only entity that provides presence information. There are two types of device tracker entities, a ScannerEntity and a TrackerEntity.

## ScannerEntity

A ScannerEntity reports the connected state of a device on the local network. If the device is connected the ScannerEntity will have state `home` and if the device is not connected the state will be `not_home`.

Derive a platform entity from [`homeassistant.components.device_tracker.config_entry.ScannerEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/device_tracker/config_entry.py)

### Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name          | Type                         | Default             | Description                         |
| ------------- | ---------------------------- | ------------------- | ----------------------------------- |
| battery_level | <code>int &#124; None</code> | `None`              | The battery level of the device.    |
| hostname      | <code>str &#124; None</code> | `None`              | The hostname of the device.         |
| ip_address    | <code>str &#124; None</code> | `None`              | The IP address of the device.       |
| is_connected  | `bool`                       | **Required**        | The connection state of the device. |
| mac_address   | <code>str &#124; None</code> | `None`              | The MAC address of the device.      |
| source_type   | `SourceType`                 | `SourceType.ROUTER` | The source type of the device.      |

### DHCP discovery

If the device tracker `source_type` is `router` and the `ip_address`, `mac_address`, and `hostname` properties have been set, the data will
speed up `DHCP discovery` as the system will not have to wait for
DHCP discover packets to find existing devices.

## TrackerEntity

A TrackerEntity tracks the location of a device and reports it either as a location name, a zone name or `home` or `not_home` states. A TrackerEntity normally receives GPS coordinates to determine its state. Either `location_name` or `latitude` and `longitude` should be set to report state.

Derive a platform entity from [`homeassistant.components.device_tracker.config_entry.TrackerEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/device_tracker/config_entry.py)

### Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name              | Type                           | Default          | Description                              |
| ----------------- | ------------------------------ | ---------------- | ---------------------------------------- |
| battery_level     | <code>int &#124; None</code>   | `None`           | The battery level of the device.         |
| latitude          | <code>float &#124; None</code> | `None`           | The latitude coordinate of the device.   |
| location_accuracy | `int`                          | `0`              | The location accuracy (m) of the device. |
| location_name     | <code>str &#124; None</code>   | `None`           | The location name of the device.         |
| longitude         | <code>float &#124; None</code> | `None`           | The longitude coordinate of the device.  |
| source_type       | SourceType                     | `SourceType.GPS` | The source type of the device.           |
