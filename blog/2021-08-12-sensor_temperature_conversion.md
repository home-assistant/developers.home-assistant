---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: Temperature conversions moving to SensorEntity
---

Temperature conversions are moving from the state machine to the SensorEntity base class.
To facilitate this, the sensor entity model has been updated with two new properties, 
`native_value` and `native_unit_of_measurement`. This allows us to add additional
unit conversions in the future instead of relying on the integrations to do it themselves.

Sensor implementations should no longer implement the `state()` property function or set
the `_attr_state` attribute. Sensor implementations should also not implement the
`unit_of_measurement` property function, set the `_attr_unit_of_measurement` attribute
or set the `unit_of_measurement` member of `EntityDescription`.

### native_value

The value reported by the sensor.
The actual state written to the state machine may be modified by `SensorEntity` due to
unit conversions.

### native_unit_of_measurement

The unit of measurement of the sensor, if any.
The `unit_of_measurement` written to the state machine may be modified by `SensorEntity`
due to unit conversions.
