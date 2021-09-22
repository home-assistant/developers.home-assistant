---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "New sensor state class: total"
---

A new state class, `total` has been added and the `last_reset` attribute has been
added back to `SensorEntity` and is no longer deprecated. The driver for the change
is to support cases where `total_increasing`, which was introduced in Home Assistant
2021.9, is too restrictive to cover all cases. Note that setting `last_reset` for sensors
with state class `measurement` is still deprecated.

In addition, the total accumulated increases and decreases are updated together with the
total accumulated increase and decrease.

### State classes

There are 3 defined state classes:

- `measurement`, the state represents a measurement in present time, for example a
   temperature, electric power, etc. For supported sensors, statistics of min,
   max and average sensor readings are updated periodically.
- `total`, the state represents a total amount that can both increase and
   decrease, e.g. a net energy meter. When supported, the accumulated growth
   or decline of the sensor's value since it was first added is updated periodically.
- `total_increasing`, a monotonically increasing total, e.g. an amount of
   consumed gas, water or energy. When supported, the accumulated growth of the sensor's
   value since it was first added is updated periodically.

#### State class `total`
For sensors with state class `total`, the `last_reset` attribute can
optionally be set to gain manual control of meter cycles.
The sensor's state when it's first added to Home Assistant is used as an initial
zero-point. When a `last_reset` changes, the zero-point will be set to 0.
If last_reset is not set, the sensor's value when it was first added is used as the
zero-point when calculating `sum` statistics.

Example of state class `total` without last_reset:

| t                      | state  | sum    | sum_increase | sum_decrease |
| :--------------------- | -----: | -----: | -----------: | -----------: |
|   2021-08-01T13:00:00  |  1000  |     0  |           0  |           0  |
|   2021-08-01T14:00:00  |  1010  |    10  |          10  |           0  |
|   2021-08-01T15:00:00  |     0  | -1000  |          10  |        1010  |
|   2021-08-01T16:00:00  |     5  |  -995  |          15  |        1010  |

Example of state class `total` with last_reset:

| t                      | state  | last_reset          | sum    | sum_increase | sum_decrease |
| :--------------------- | -----: | ------------------- | -----: | -----------: | -----------: |
|   2021-08-01T13:00:00  |  1000  | 2021-08-01T13:00:00 |     0  |           0  |           0  |
|   2021-08-01T14:00:00  |  1010  | 2021-08-01T13:00:00 |    10  |          10  |           0  |
|   2021-08-01T15:00:00  |  1005  | 2021-08-01T13:00:00 |     5  |          10  |           5  |
|   2021-08-01T16:00:00  |     0  | 2021-09-01T16:00:00 |     5  |          10  |           5  |
|   2021-08-01T17:00:00  |     5  | 2021-09-01T16:00:00 |    10  |          15  |           5  |

Example of state class `total` where the there initial state at the beginning
of the new meter cycle is not 0, but 0 is used as zero-point:

| t                      | state  | last_reset          | sum    | sum_increase | sum_decrease |
| :--------------------- | -----: | ------------------- | -----: | -----------: | -----------: |
|   2021-08-01T13:00:00  |  1000  | 2021-08-01T13:00:00 |     0  |           0  |           0  |
|   2021-08-01T14:00:00  |  1010  | 2021-08-01T13:00:00 |    10  |          10  |           0  |
|   2021-08-01T15:00:00  |  1005  | 2021-08-01T13:00:00 |     5  |          10  |           5  |
|   2021-08-01T16:00:00  |     5  | 2021-09-01T16:00:00 |    10  |          15  |           5  |
|   2021-08-01T17:00:00  |    10  | 2021-09-01T16:00:00 |    15  |          20  |           5  |


#### State class `total_increasing`

For sensors with state_class `total_increasing`, a decreasing value is
interpreted as the start of a new meter cycle or the replacement of the meter. It is
important that the integration ensures that the value cannot erroneously decrease in 
the case of calculating a value from a sensor with measurement noise present. This state
class is useful for gas meters, electricity meters, water meters etc.

The sensor's state when it's first added to Home Assistant is used as an initial
zero-point. When a new meter cycle is detected the zero-point will be set to 0.
Please refer to the tables below for how this affects the statistics.

Example of state class `total_increasing` with a new meter cycle:

| t                      | state  | sum  | sum_increase | sum_decrease |
| :--------------------- | -----: | ---: | -----------: | -----------: |
|   2021-08-01T13:00:00  |  1000  |   0  |           0  |           0  |
|   2021-08-01T14:00:00  |  1010  |  10  |          10  |           0  |
|   2021-08-01T15:00:00  |     0  |  10  |          10  |           0  |
|   2021-08-01T16:00:00  |     5  |  15  |          15  |           0  |

Example of state class `total_increasing` where the there initial state at the beginning
of the new meter cycle is not 0, but 0 is used as zero-point:

| t                      | state  | sum  | sum_increase | sum_decrease |
| :--------------------- | -----: | ---: | -----------: | -----------: |
|   2021-08-01T13:00:00  |  1000  |   0  |           0  |           0  |
|   2021-08-01T14:00:00  |  1010  |  10  |          10  |           0  |
|   2021-08-01T15:00:00  |     5  |  15  |          15  |           0  |
|   2021-08-01T16:00:00  |    10  |  20  |          20  |           0  |
