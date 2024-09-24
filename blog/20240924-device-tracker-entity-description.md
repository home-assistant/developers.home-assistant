---
author: epenet
authorURL: https://github.com/epenet
title: "Enforce SourceType and add EntityDescription to device_tracker"
---

The `source_type` property of device_tracker entities is now always expected to be a `SourceType` enum value. Standard strings are no longer accepted.

`ScannerEntity` and `TrackerEntity` also now have dedicated `ScannerEntityDescription` and `TrackerEntityDescription`. These now need to be used 
as base class when associating an `EntityDescription` to the `Entity`, together with the compulsory `source_type` property.

For entities not using EntityDescription, a shorthand attribute `_attr_source_type` has also been added.
