---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: New sensor properties for long-term statistics
---

The sensor entity model has been updated with two new properties, `state_class` and `last_reset`. The driver for both the new properties is to enable automatic generation of long-term statistics.

### state_class

Sensor device classes such as `DEVICE_CLASS_TEMPERATURE` are used to represent wildly different types of data, for example:

- A regularly updated temperature measurement
- Historical or statistic data, for example daily average temperature
- Future data, for example tomorrow's forecast

Differentiating between those sensors which represent a measurement and those which don't is needed in order to automatically make a reasonable selection of sensors to include in long-term statistics.

The [`state_class`](https://developers.home-assistant.io/docs/core/entity/sensor#properties) property classifies the type of state: The state could be a _measurement in present time_ from a temperature sensor or an energy meter_, a _historic value_ such as the average temperature during the last 24 hours or the amount of energy used last month, or a _predicted value_ such as a weather forecast or the next garbage pickup schedule. If `state_class="measurement"`, the state represents a current value, and not a historical aggregation or a prediction of the future. Otherwise, `state_class=None`. There is an [architecture discussion](https://github.com/home-assistant/architecture/discussions/557) with some additional background.

Note that _measurement in present time_ above does not imply that the state has to be updated with a certain frequency, or that the sensor is not allowed to do indirect measurements such as integrating power to calculate energy. To put it in another way, if the sensor represents the latest observation or the newest data point in a time series it qualifies as `state_class="measurement"`.

### last_reset

The time when an accumulating sensor such as an electricity usage meter, gas meter, water meter etc. was initialized. If the time of initialization is unknown and the meter will never reset, set to UNIX epoch 0: `homeassistant.util.dt.utc_from_timestamp(0)`. Note that the `datetime.datetime` returned by the `last_reset` property will be converted to an ISO 8601-formatted string when the entity's state attributes are updated. When changing `last_reset`, the `state` must be a valid number.
