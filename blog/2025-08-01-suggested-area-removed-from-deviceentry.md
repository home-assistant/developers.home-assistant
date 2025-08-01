---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "The DeviceEntry.suggested_area attribute is deprecated and will be removed"
---

The `DeviceEntry.suggested_area` attribute is deprecated and will be removed in HA Core 2026.9. Also, `suggested_area` will no longer be present in `EVENT_DEVICE_REGISTRY_UPDATED` events when HA Core 2026.9 is released.

Note:
Setting `suggested_area` in `DeviceInfo`, and passing `suggested_area` to `DeviceRegistry.async_get_or_create` is still supported, although that may change in the future.

Use `DeviceEntry.area_id` to determine a device’s area in custom integrations. Don’t access `DeviceEntry.suggested_area`.

During the deprecation period, accessing `DeviceEntry.suggested_area` will log a warning.

For more details, refer to the [DeviceEntry documentation](/docs/device_registry_index#device-properties) and core [PR 149730](https://github.com/home-assistant/core/pull/149730) which deprecated `DeviceEntry.suggested_area`.
