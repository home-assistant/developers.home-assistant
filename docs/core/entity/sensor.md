---
title: Sensor Entity
sidebar_label: Sensor
---

A sensor is a read-only entity that provides some information. Information has a value and optionally, a unit of measurement.

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| state | string | **Required** | The value of the sensor.
| device_class | string | `None` | Type of sensor.
| last_reset | `datetime.datetime` | `None` | The time when an accumulating sensor such as an electricity usage meter, gas meter, water meter etc. was initialized. If the time of initialization is unknown, set it to `None`. Note that the `datetime.datetime` returned by the `last_reset` property will be converted to an ISO 8601-formatted string when the entity's state attributes are updated. When changing `last_reset`, the `state` must be a valid number.
| state_class | string | `None` | Type of state.
| unit_of_measurement | string | `None` | The unit of measurement that the sensor is expressed in.

### Available device classes

If specifying a device class, your sensor entity will need to also return the correct unit of measurement.

| Type | Unit | Description
| ---- | ---- | -----------
| aqi | | Air Quality Index
| battery | % | % of battery that is left.
| carbon_dioxide | ppm | parts per million of carbon dioxide concentration
| carbon_monoxide | ppm | parts per million of carbon monoxide concentration
| humidity | % | % of humidity in the air.
| gas | m³/ft³ | Volume of gas.
| illuminance | lx/lm | Light level.
| nitrogen_dioxide | µg/m³ | Concentration of Nitrogen Dioxide |
| nitrogen_monoxide | µg/m³ | Concentration of Nitrogen Monoxide |
| nitrous_oxide | µg/m³ | Concentration of Nitrous Oxide |
| ozone | µg/m³ | Concentration of Ozone |
| pm1 | µg/m³ | Concentration of particulate matter less than 1 micrometer |
| pm25 | µg/m³ | Concentration of particulate matter less than 2.5 micrometers |
| pm10 | µg/m³ | Concentration of particulate matter less than 10 micrometers |
| signal_strength | dB/dBm | Signal strength.
| sulphur_dioxide | µg/m³ | Concentration of sulphure dioxide |
| temperature | °C/°F | Temperature.
| timestamp | ISO8601 | Timestamp.
| power | W,kW | Power.
| pressure | hPa,mbar | Pressure.
| current | A | Current.
| energy | Wh,kWh | Energy.
| power_factor | % | Power Factor.
| voltage | V | Voltage.
| monetary | ISO 4217 | Monetary value with a currency

### Available state classes

| Type | Description
| ---- | -----------
| measurement | The state represents _a measurement in present time_, not a historical aggregation such as statistics or a prediction of the future. Examples of what should be classified `measurement` are: current temperature, accumulated energy consumption, accumulated cost.  Examples of what should not be classified as `measurement`: Forecasted temperature for tomorrow, yesterday's energy consumption or anything else that doesn't include the _current_ measurement. For supported sensors, statistics of hourly min, max and average sensor readings or of the accumulated growth or decline of the sensor's value since it was first added is updated hourly.
| total_increasing | The state represents a monotonically increasing total, e.g. an amount of consumed gas, water or energy. When supported, statistics of the accumulated growth of the sensor's value since it was first added is updated hourly.


## Long-term Statistics

Home Assistant has support for storing sensors as long-term statistics if the entity has
the right properties. A requirement to opt-in for statistics is that the sensor has
`state_class` set to one of the valid state classes: `measurement` or
`total_increasing`.

### Entities tracking a total amount

Entities tracking a total amount have a value that may optionally reset periodically,
like this month's energy consumption, today's energy production or the yearly growth of
a stock portfolio.

#### `STATE_CLASS_MEASUREMENT`

For sensors with state_class `STATE_CLASS_MEASUREMENT`, the `last_reset` attribute can
optionally be set to gain manual control of meter cycles; each time last_reset changes
the corresponding value is used as the zero-point when calculating `sum` statistics.
If last_reset is not set, the sensor's value when it was first added is used as the
zero-point when calculating `sum` statistics.

Example of `STATE_CLASS_MEASUREMENT` without last_reset:

| t                      | state  | sum    |
| :--------------------- | -----: | -----: |
|   2021-08-01T13:00:00  |  1000  |     0  |
|   2021-08-01T14:00:00  |  1010  |    10  |
|   2021-08-01T15:00:00  |     0  | -1000  |
|   2021-08-01T16:00:00  |     5  |  -995  |

Example of `STATE_CLASS_MEASUREMENT` with last_reset:

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
reading decreases will not be used as zero-point when calculating `sum` statistics,
instead the zero-point will be set to 0.

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
|   2021-08-01T15:00:00  |     5  |  15  |
|   2021-08-01T16:00:00  |    10  |  20  |

### Value entities

Home Assistant tracks the min, max and mean value during the statistics period. The
`state_class` property must be set to `measurement`.

All sensors with a unit of measurement of `%` are automatically tracked. Other entities
opt-in based on their `device_class`.
