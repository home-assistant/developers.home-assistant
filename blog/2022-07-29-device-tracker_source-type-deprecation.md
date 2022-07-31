---
author: Marc Mueller
authorURL: https://github.com/cdce8p
title: "Device tracker deprecations for 2022.9"
---

For Home Assistant Core 2022.9, we have deprecated the `device_tracker`
`SOURCE_TYPE_*` constants.
Use the new [`SourceType`](/docs/core/entity/device-tracker) enum instead.

Deprecated constants:

- `SOURCE_TYPE_GPS`
- `SOURCE_TYPE_ROUTER`
- `SOURCE_TYPE_BLUETOOTH`
- `SOURCE_TYPE_BLUETOOTH_LE`
