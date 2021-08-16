---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "New sensor state classes: total and total_increasing"
---

Two new state classes, `STATE_CLASS_TOTAL` and `STATE_CLASS_TOTAL_INCREASING` have been
added. In addition, it is no longer mandatory to set the `last_reset` attribute for
`sum` statistics to be generated. The driver for the changes is to make it easier to
integrate with devices, like utility meters.

### State classes

There are now 3 defined state classes:

- `STATE_CLASS_MEASUREMENT`, the state represents a measurement in present time, for 
   example a temperature, electric power, etc. For supported sensors, statistics of 
   hourly min, max and average sensor readings are compiled.
- `STATE_CLASS_TOTAL`, the state represents a total amount that can both increase and
   decrease, e.g. the value of a stock portfolio. When supported, the accumulated growth
   or decline of the sensor's value since it was first added is updated hourly.
- `STATE_CLASS_TOTAL_INCREASING`, a monotonically increasing total, e.g. an amount of
   consumed gas, water or energy. When supported, the accumulated growth of the sensor's
   value since it was first added is updated hourly.

#### `STATE_CLASS_MEASUREMENT`

For sensors with state_class `STATE_CLASS_MEASUREMENT`, it is deprecated to set the
`last_reset` attribute, and it will be ignored in Home Assistant 2021.10.

#### `STATE_CLASS_TOTAL`

For sensors with state_class `STATE_CLASS_TOTAL`, the `last_reset` attribute can
optionally be set to gain manual control of meter cycles; each time last_reset changes
the corresponding value is used as the zero-point when calculating `sum` statistics.
If last_reset is not set, the sensor's value when it was first added is used as the
zero-point when calculating `sum` statistics.

Example of `STATE_CLASS_TOTAL` without last_reset:

| t                      | state  | sum    |
| :--------------------- | -----: | -----: |
|   2021-08-01T13:00:00  |  1000  |     0  |
|   2021-08-01T14:00:00  |  1010  |    10  |
|   2021-08-01T15:00:00  |     0  | -1000  |
|   2021-08-01T16:00:00  |     5  |  -995  |

Example of `STATE_CLASS_TOTAL` with last_reset:

| t                      | state  | last_reset          | sum    |
| :--------------------- | -----: | ------------------- | -----: |
|   2021-08-01T13:00:00  |  1000  | 2021-08-01T13:00:00 |     0  |
|   2021-08-01T14:00:00  |  1010  | 2021-08-01T13:00:00 |    10  |
|   2021-08-01T15:00:00  |  1005  | 2021-08-01T13:00:00 |     5  |
|   2021-08-01T16:00:00  |     0  | 2021-09-01T16:00:00 |     5  |
|   2021-08-01T17:00:00  |     5  | 2021-09-01T16:00:00 |    10  |


#### `STATE_CLASS_TOTAL_INCREASING`

For sensors with state_class `STATE_CLASS_TOTAL_INCREASING`, a decreasing value is
interpreted as the start of a new meter cycle or the replacement of the meter. It is
important that the integration ensures that the value cannot erroneously decrease in 
the case of calculating a value from a sensor with measurement noise present. The
last_reset attribute will be ignored when compiling statistics. This state class is
useful for gas meters, electricity meters, water meters etc. The value when the sensor
reading decreases will be used as zero-point when calculating `sum` statistics.

Example of `STATE_CLASS_TOTAL_INCREASING`:

| t                      | state  | sum  |
| :--------------------- | -----: | ---: |
|   2021-08-01T13:00:00  |  1000  |   0  |
|   2021-08-01T14:00:00  |  1010  |  10  |
|   2021-08-01T15:00:00  |     0  |  10  |
|   2021-08-01T16:00:00  |     5  |  15  |

Example of `STATE_CLASS_TOTAL_INCREASING` where the sensor does not reset to 0:

| t                      | state  | sum  |
| :--------------------- | -----: | ---: |
|   2021-08-01T13:00:00  |  1000  |   0  |
|   2021-08-01T14:00:00  |  1010  |  10  |
|   2021-08-01T15:00:00  |     5  |  10  |
|   2021-08-01T16:00:00  |     10 |  15  |
