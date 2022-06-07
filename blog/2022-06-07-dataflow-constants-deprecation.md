---
author: epenet
authorURL: https://github.com/epenet
title: "Deprecating Data Flow constants"
---

As of Home Assistant Core 2022.7, all `RESULT_TYPE_*` constants are deprecated,
each entity platform is providing an `EntityFeature` enum to replace them.

This applies to, the following platforms:

- **Flow Result**

  Deprecated result type constants:

  - `RESULT_TYPE_FORM`
  - `RESULT_TYPE_CREATE_ENTRY`
  - `RESULT_TYPE_ABORT`
  - `RESULT_TYPE_EXTERNAL_STEP`
  - `RESULT_TYPE_EXTERNAL_STEP_DONE`
  - `RESULT_TYPE_SHOW_PROGRESS`
  - `RESULT_TYPE_SHOW_PROGRESS_DONE`
  - `RESULT_TYPE_MENU`

  Use the new `FlowResultType` enum instead.

  Use the new [`WaterHeaterEntityFeature`](/docs/core/entity/water-heater#supported-features) enum instead.
