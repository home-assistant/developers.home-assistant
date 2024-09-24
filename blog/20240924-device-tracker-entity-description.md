---
author: epenet
authorURL: https://github.com/epenet
title: "Enforce SourceType and add shorthand attributes and EntityDescription to device_tracker"
---

The `source_type` property of device_tracker entities is now always expected to be a `SourceType` enum value. Standard strings are no longer valid.

`ScannerEntity` and `TrackerEntity` also now have dedicated `ScannerEntityDescription` and `TrackerEntityDescription`.
These now need to be used as base class when associating an `EntityDescription` to the `Entity`, together with the compulsory `source_type` property.

The following shorthand attributes have also been added:
- `BaseTrackerEntity._attr_battery_level`
- `BaseTrackerEntity._attr_source_type`
- `TrackerEntity._attr_latitude`
- `TrackerEntity._attr_location_accuracy`
- `TrackerEntity._attr_location_name`
- `TrackerEntity._attr_longitude`
- `ScannerEntity._attr_hostname`
- `ScannerEntity._attr_ip_address`
- `ScannerEntity._attr_mac_address`
