---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "New sensor state class: total_increasing"
---

A new state class, `total_increasing` has been added. In addition, the
`last_reset` attribute is removed from `SensorEntity`. The driver for the changes is to
make it easier to integrate with devices, like utility meters.

### State classes

There are 2 defined state classes:

- `measurement`, the state represents a measurement in present time, for 
   example a temperature, electric power, the value of a stock portfolio, etc. For
   supported sensors, statistics of hourly min, max and average sensor readings or of
   the accumulated growth or decline of the sensor's value since it was first added is
   updated hourly.
- `total_increasing`, a monotonically increasing total, for example an amount of
   consumed gas, water or energy. When supported, the accumulated growth of the sensor's
   value since it was first added is updated hourly.

#### `STATE_CLASS_TOTAL_INCREASING`

For sensors with state_class `STATE_CLASS_TOTAL_INCREASING`, a decreasing value is
interpreted as the start of a new meter cycle or the replacement of the meter. It is
important that the integration ensures that the value cannot erroneously decrease in 
the case of calculating a value from a sensor with measurement noise present. This state
class is useful for gas meters, electricity meters, water meters etc.

The sensor's state when it's first added to Home Assistant is used as an initial
zero-point. When a new meter cycle is detected the zero-point will be set to 0.
Please refer to the tables below for how this affects the statistics.

Example of `STATE_CLASS_TOTAL_INCREASING` with a new meter cycle:

| t                      | state  | sum  |
| :--------------------- | -----: | ---: |
|   2021-08-01T13:00:00  |  1000  |   0  |
|   2021-08-01T14:00:00  |  1010  |  10  |
|   2021-08-01T15:00:00  |     0  |  10  |
|   2021-08-01T16:00:00  |     5  |  15  |

Example of `STATE_CLASS_TOTAL_INCREASING` where the there initial state at the beginning
of the new meter cycle is not 0, but 0 is used as zero-point:

| t                      | state  | sum  |
| :--------------------- | -----: | ---: |
|   2021-08-01T13:00:00  |  1000  |   0  |
|   2021-08-01T14:00:00  |  1010  |  10  |
|   2021-08-01T15:00:00  |     5  |  15  |
|   2021-08-01T16:00:00  |    10  |  20  |

This state class used to be represented by state class `measurement` in combination with a `last_reset` value. This approach has been deprecated and will be interpreted as a `total_increasing` state class instead with an automatic last reset.
