---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Long term statistics now tracks the source entity's unit"
---

Long term statistics now tracks the unit of the source in a new column `state_unit_of_measurement` in addition to the existing column `unit_of_measurement` in the `statistics_metadata` database table. The meaning of the two columns is:

- `unit_of_measurement` - The unit which statistics is stored in. For sensor device classes where it's allowed for the user to override the unit, this is  a normalized unit, for example `kWh` for energy sensors.
- `state_unit_of_measurement` - The unit which statistics should be displayed in. For sensors, this is the same as the `unit_of_measurement` state attribute.

The changes are implemented in a series of PRs:
- https://github.com/home-assistant/core/pull/78031
- https://github.com/home-assistant/core/pull/78578
- https://github.com/home-assistant/core/pull/78932

The background is that we allow overriding the unit of several sensor device classes, and this override should also be reflected when viewing long term statistics.

This affects authors of custom integrations or web based services importing long term statistics:
 - The type `StatisticsMetaData` has a new member `state_unit_of_measurement`, which must be set correctly in calls to `async_add_external_statistics`
- A new mandatory field `state_unit_of_measurement` has been added to the metadata parameter in WS API `recorder/import_statistics`.
 
This also affects authors of code calling the following WS APIs:
 - `recorder/adjust_sum_statistics` - A new mandatory parameter `display_unit` has been added, which defines the unit used by the `adjustment` parameter.
 - `recorder/get_statistics_metadata` - The result now includes the `display_unit_of_measurement` for each returned metadata entry. The `display_unit_of_measurement` is the value of the `state_unit_of_measurement` database column.
 - `recorder/list_statistic_ids` - The result now includes a `display_unit_of_measurement` for each returned metadata entry. The `display_unit_of_measurement` is the value of the `state_unit_of_measurement` database column.
 - `recorder/statistics_during_period` - The returned statistics will be according to each statistic_id's `state_unit_of_measurement`. This behavior can be controlled by passing the optional `units` parameter.
 