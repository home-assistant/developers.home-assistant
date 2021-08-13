---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: Temperature conversions moving to SensorEntity
---

Temperature unit conversions are moving from the `Entity` base class to the `SensorEntity` base
class. Unit conversions will only be done if the sensor's `device_class` attribute is set
to `DEVICE_CLASS_TEMPERATURE`. If the `device_class` is not set or is not set to
`DEVICE_CLASS_TEMPERATURE` temperature conversion will take place during a transition
period and a warning will be logged.

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
