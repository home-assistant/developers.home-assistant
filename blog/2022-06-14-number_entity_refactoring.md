---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Number entity refactoring to support unit conversion"
---

`NumberEntity` now supports temperature unit conversion following a similar pattern
as the unit conversion supported by `SensorEntity`.

Temperature conversion will automatically be done for number entities with device
class set to `temperature` to the temperature unit configured by the user.

To make this possible, custom component integrations should be updated to override
properties `native_max_value`, `native_min_value`, `native_step`,
`native_unit_of_measurement`, `native_value` instead of `max_value`, `min_value`,
`step`, `unit_of_measurement`, `value` and to override methods `async_set_native_value`
and `set_native_value` instead of `async_set_value` and `set_value`.

The same renaming has been done for `_attr_*` attributes as well as members of
`NumberEntityDescription`.

In Home Assistant Core 2023.1, overriding `async_set_value`, `max_value`, `min_value`,
`set_value`, `step`, `unit_of_measurement`, `value`, setting `_attr_max_value`,
`_attr_min_value`, `_attr_unit_of_measurement`, `_attr_step`, `_attr_value` and
setting `max_value`, `min_value`, `unit_of_measurement`, `step` on instances of
`NumberEntityDescription` is no longer supported.
