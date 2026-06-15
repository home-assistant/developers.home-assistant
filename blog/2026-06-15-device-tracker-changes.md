---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changes to device tracker entity models"
---

## Summary

There have been multiple recent changes to the device tracker entity model:

- The `battery_level` property has been deprecated
- The `location_name` property of `TrackerEntity` has been deprecated
- A new entity base class `BaseScannerEntity` has been introduced
- Users can associate scanners with other zones than the home zone
- `TrackerEntity` has a new property `in_zones`
- `BaseScannerEntity` and `ScannerEntity` have a new state attribute `in_zones`
- A new capability attribute `tracking_type` has been introduced
- Zones are now calculated by size, then distance to center when calculating the state of `TrackerEntity`

## Details

### Deprecation of `battery_level`

The `battery_level` property has been deprecated in all device tracker base classes, and will stop working in Home Assistant Core 2027.7. Integrations should communicate battery level via a battery sensor instead.

More details can be found in  [architecture proposal #627](https://github.com/home-assistant/architecture/discussions/627)

### Deprecation of `location_name`

The `location_name` property of `TrackerEntity` has been deprecated, and will stop workin in Home Assistant Core 2027.7.

Integrations with device trackers which do not know or do not want to report the exact coordinates and today use `location_name` to report the name of a zone should instead report a list of zone entity ids ghrough the `in_zones` property.
Device trackers which use `location_name` to give extra context can instead do that via a separate sensor or an extra state attribute.

More details can be found in  [architecture proposal #1387](https://github.com/home-assistant/architecture/discussions/1387)

### Introduction of the `BaseScannerEntity` base class

The [`BaseScannerEntity`](/docs/core/entity/device-tracker#basescannerentity) class should be used by integrations which have scanners which do not track connection to a WLAN or other local network, for example scanners which track connection to a BLE beacon.

### Users can associate `BaseScannerEntity` and `ScannerEntity` with any zone

`BaseScannerEntity` and `ScannerEntity` store the associated zone as an entiy registry option. The base class will set the state of the entity to the name of the associated zone when connected, and the `in_zones` state attribute to all zones which contain the associated zone.

More details can be found in  [architecture proposal #1389](https://github.com/home-assistant/architecture/discussions/1389)

### Introduction of the `in_zones` state attribute

A new state attribute `in_zones` is present in the state of device tracker entities. The state attribute is automatically calculated by `BaseScannerEntity` and `ScannerEntity`. `TrackerEntity` will derive the `in_zones` state attribute from the [`in_zones` property](https://developers.home-assistant.io/docs/core/entity/device-tracker#properties-2) if not `None`, if it is `None` it will be calculated from the reported location.

The `in_zones` state attribute is a list of zone entity IDs sorted by size, with the smallest zone first, then by distance to center.

### Introduction of the `tracking_type` capability attribute

A new capability attribute `tracking_type` is present in the state of device tracker entities. The state attribute is set to `connection` by `BaseScannerEntity` and `ScannerEntity` and to `location` by `TrackerEntity`. Integrations should not override this behavior.
