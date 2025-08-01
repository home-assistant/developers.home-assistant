---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "The DeviceEntry.suggested_area attribute has been deprecated and will be removed"
---

The `DeviceEntry.suggested_area` attribute has been deprecated and will be removed in HA Core 2026.9. Also, `suggested_area` will no longer be present in `EVENT_DEVICE_REGISTRY_UPDATED` events when HA Core 2026.9 is released.

Custom integrations should not access `DeviceEntry.suggested_area`. If it's important to know which area a device is part of, use `DeviceEntry.area_id` instead.

During the deprecation period, accessing `DeviceEntry.suggested_area` will log a warning.

For more details, refer to the [DeviceEntry documentation](/docs/device_registry_index#device-properties) and core [PR 149730](https://github.com/home-assistant/core/pull/149730) which deprecated `DeviceEntry.suggested_area`.
