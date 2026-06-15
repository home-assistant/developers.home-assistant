---
title: Device tracker entity
sidebar_label: Device tracker
---

A device tracker is a read-only entity that provides presence information. There are three types of device tracker entities available for integrations to extend, `BaseScannerEntity`, `ScannerEntity` and `TrackerEntity`.

## BaseScannerEntity

A BaseScannerEntity reports the connected state of a device, for example to a bluetooth beacon. If the device is connected the BaseScannerEntity's state will be the name of the associated zone, e.g `home` if associated with the home zone, and if the device is not connected the state will be `not_home`.

The base class sets the `in_zones` state attribute. It will be populated with the `entity_id` of the associated zone and zones containing it, sorted by size, when the device is connected and empty when not connected.

The base class also sets the `tracking_type` capability attribute to `TrackingType.CONNECTION`.

Derive a platform entity from [`homeassistant.components.device_tracker.config_entry.BaseScannerEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/device_tracker/config_entry.py)

### Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name          | Type                         | Default             | Description                         |
| ------------- | ---------------| ------------------- | ----------------------------------- |
| is_connected  | `bool \| None` | **Required**        | The connection state of the device. |
| source_type   | `SourceType`   | **Required**        | The source type of the device.      |

## ScannerEntity

A ScannerEntity reports the connected state of a device on the local network. If the device is connected the ScannerEntity's state will be the name of the associated zone, e.g `home` if associated with the home zone, and if the device is not connected the state will be `not_home`.

The base class sets the `in_zones` state attribute. It will be populated with the `entity_id` of the associated zone and zones containing it, sorted by size, when the device is connected and empty when not connected.

The base class also sets the `tracking_type` capability attribute to `TrackingType.CONNECTION`.

ScannerEntity is based on BaseScannerEntity and is meant for tracking devices which connect to an IP network and can be identified by MAC address.

Derive a platform entity from [`homeassistant.components.device_tracker.config_entry.ScannerEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/device_tracker/config_entry.py)

### Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name          | Type           | Default             | Description                         |
| ------------- | ---------------| ------------------- | ----------------------------------- |
| hostname      | `str \| None`  | `None`              | The hostname of the device.         |
| ip_address    | `str \| None`  | `None`              | The IP address of the device.       |
| is_connected  | `bool \| None` | **Required**        | The connection state of the device. |
| mac_address   | `str \| None`  | `None`              | The MAC address of the device.      |
| source_type   | `SourceType`   | `SourceType.ROUTER` | The source type of the device.      |

### DHCP discovery

If the device tracker `source_type` is `router` and the `ip_address`, `mac_address`, and `hostname` properties have been set, the data will
speed up `DHCP discovery` as the system will not have to wait for
DHCP discover packets to find existing devices.

## TrackerEntity

A TrackerEntity tracks the location of a device and reports it either as a zone name or `home` or `not_home` states. A TrackerEntity can use GPS coordinates or a list of `Zone` entity_ids to determine its state. Either `in_zones` or `latitude` and `longitude` should be set to report state. If both `in_zones` and `latitude` + `longitude` are present, `in_zones` has priority. If `in_zones` is not provided, the base class calculates an `in_zones` list, including both the active and passive zones the device is currently in. The state of the entity is either the first active zone in the `in_zones` list, `home` if the first active zone is the home zone or `not_home` if there is no active zone in the `in_zones` list.

The base class sets the `tracking_type` capability attribute to `TrackingType.POSITION`.

Derive a platform entity from [`homeassistant.components.device_tracker.config_entry.TrackerEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/device_tracker/config_entry.py)

### Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name              | Type                | Default          | Description                              |
| ----------------- | --------------------| ---------------- | ---------------------------------------- |
| in_zones          | `list[str] \| None` | `None`           | The zones the device is in, including passive zones. Should be sorted by size of the zone, then by distance to center of zones. |
| latitude          | `float \| None`     | `None`           | The latitude coordinate of the device, ignored if `in_zones` is not `None`.   |
| location_accuracy | `float`             | `0`              | The location accuracy (m) of the device. |
| longitude         | `float \| None`     | `None`           | The longitude coordinate of the device, ignored if `in_zones` is not `None`.  |
| source_type       | SourceType          | `SourceType.GPS` | The source type of the device.           |
