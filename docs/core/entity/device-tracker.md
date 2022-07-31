---
title: Device Tracker Entity
sidebar_label: Device Tracker
---

A device tracker is a read-only entity that provides presence information. There are two types of device tracker entities, a ScannerEntity and a TrackerEntity.

## ScannerEntity

A ScannerEntity reports the connected state of a device on the local network. If the device is connected the ScannerEntity will have state `home` and if the device is not connected the state will be `not_home`.

Derive a platform entity from [`homeassistant.components.device_tracker.config_entry.ScannerEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/device_tracker/config_entry.py)

### Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

:::caution
ScannerEntity does not support attribute shorthand for [property implementation](../entity.md#entity-class-or-instance-attributes)
:::

| Name          | Type    | Default      | Description                                       |
| ------------- | ------- | ------------ | ------------------------------------------------- |
| source_type   | SourceType | **Required** | The source type, eg `gps` or `router`, of the device. |
| is_connected  | boolean | **Required** | The connection state of the device.               |
| battery_level | integer | `None`       | The battery level of the device.                  |
| ip_address    | string  | `None`       | The IP address of the device.                     |
| mac_address   | string  | `None`       | The MAC address of the device.                    |
| hostname      | string  | `None`       | The hostname of the device.                       |

### DHCP discovery

If the device tracker `source_type` is `router` and the `ip_address`, `mac_address`, and `hostname` properties have been set, the data will
speed up `DHCP discovery` as the system will not have to wait for
DHCP discover packets to find existing devices.

## TrackerEntity

A TrackerEntity tracks the location of a device and reports it either as a location name, a zone name or `home` or `not_home` states. A TrackerEntity normally receives GPS coordinates to determine its state.

Derive a platform entity from [`homeassistant.components.device_tracker.config_entry.TrackerEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/device_tracker/config_entry.py)

### Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

:::caution
TrackerEntity does not support attribute shorthand for [property implementation](../entity.md#entity-class-or-instance-attributes)
:::

| Name              | Type    | Default      | Description                                       |
| ----------------- | ------- | ------------ | ------------------------------------------------- |
| source_type       | SourceType | **Required** | The source type, eg `gps` or `router`, of the device. |
| latitude          | string  | **Required** | The latitude coordinate of the device.            |
| longitude         | string  | **Required** | The longitude coordinate of the device.           |
| battery_level     | integer | `None`       | The battery level of the device.                  |
| location_accuracy | integer | `None`       | The location accuracy (m) of the device.          |
| location_name     | string  | `None`       | The location name of the device.                  |
