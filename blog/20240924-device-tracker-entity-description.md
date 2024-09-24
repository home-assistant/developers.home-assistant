---
author: epenet
authorURL: https://github.com/epenet
title: "Enforce SourceType and add shorthand attributes and EntityDescription to device_tracker"
---

The `source_type` property of device_tracker entities is now always expected to be a `SourceType` enum value. Standard strings are no longer valid.

`ScannerEntity` now has a dedicated `ScannerEntityDescription`, and the `source_type` defaults to `SourceType.ROUTER`.

`TrackerEntity` now has a dedicated `TrackerEntityDescription`, and the `source_type` defaults to `SourceType.GPS`.

These now need to be used as base class when associating an `EntityDescription` to the `Entity`.

The following shorthand attributes have also been added:
- `BaseTrackerEntity._attr_source_type`
- `TrackerEntity._attr_latitude`
- `TrackerEntity._attr_location_accuracy`
- `TrackerEntity._attr_location_name`
- `TrackerEntity._attr_longitude`
- `ScannerEntity._attr_hostname`
- `ScannerEntity._attr_ip_address`
- `ScannerEntity._attr_mac_address`
