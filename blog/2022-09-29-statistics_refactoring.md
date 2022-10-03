---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Long term statistics now tracks the source entity's unit"
---

Long term statistics now allows showing statistics in a different unit than it's stored in. For example, it's possible to show statistics stored as `kWh` as `Wh`, `kWh` or `MWh`.

The changes are implemented in a series of PRs:
- https://github.com/home-assistant/core/pull/78031
- https://github.com/home-assistant/core/pull/78578
- https://github.com/home-assistant/core/pull/79370

The background is that we allow overriding the unit of several sensor device classes, and this override should also be reflected when viewing long term statistics.

This affects authors of code calling the following WS APIs:
 - `recorder/adjust_sum_statistics` - A new mandatory parameter `adjustment_unit_of_measurement` has been added, which defines the unit used by the `adjustment` parameter.
 - `recorder/statistics_during_period` - In case of statistics generated from sensor entities, the unit of returned statistics will be converted to the sensor's `unit_of_measurement`. This behavior can be controlled by passing the optional `units` parameter.
 