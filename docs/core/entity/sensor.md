---
title: Sensor Entity
sidebar_label: Sensor
---

A sensor is a read-only entity that provides some information. Information has a value and optionally, a unit of measurement. Derive entity platforms from [`homeassistant.components.sensor.SensorEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/sensor/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| device_class | string | `None` | Type of sensor.
| last_reset | `datetime.datetime` | `None` | The time when an accumulating sensor such as an electricity usage meter, gas meter, water meter etc. was initialized. If the time of initialization is unknown, set it to `None`. Note that the `datetime.datetime` returned by the `last_reset` property will be converted to an ISO 8601-formatted string when the entity's state attributes are updated. When changing `last_reset`, the `state` must be a valid number.
| native_unit_of_measurement | string | `None` | The unit of measurement that the sensor's value is expressed in. If the `native_unit_of_measurement` is °C or °F, and its `device_class` is temperature, the sensor's `unit_of_measurement` will be the preferred temperature unit configured by the user and the sensor's `state` will be the `native_value` after an optional unit conversion.
| native_value | `None`, `datetime.date`, `datetime.datetime`, `decimal.Decimal`, float, int, string | **Required** | The value of the sensor in the sensor's `native_unit_of_measurement`. Using a `device_class` may restrict the types that can be returned by this property.
| options | list | `None` | In case this sensor provides a textual state, this property can be used to provide a list of possible states. Requires the `enum` device class to be set. Cannot be combined with `state_class` or `native_unit_of_measurement`.
| state_class | string | `None` | Type of state. If not `None`, the sensor is assumed to be numerical and will be displayed as a line-chart in the frontend instead of as discrete values.
| suggested_display_precision | int | `None` | The number of decimals which should be used in the sensor's state when it's displayed.
| suggested_unit_of_measurement | string | `None` | The unit of measurement to be used for the sensor's state. For sensors with a `unique_id`, this will be used as the initial unit of measurement, which users can then override. For sensors without a `unique_id`, this will be the unit of measurement for the sensor's state. This property is intended to be used by integrations to override automatic unit conversion rules, for example, to make a temperature sensor always display in `°C` regardless of whether the configured unit system prefers `°C` or `°F`, or to make a distance sensor always display in miles even if the configured unit system is metric.

:::tip
Instead of adding `extra_state_attributes` for a sensor entity, create an additional sensor entity. Attributes that do not change are only saved in the database once. If `extra_state_attributes` and the sensor value both frequently change, this can quickly increase the size of the database.
:::

### Available device classes

If specifying a device class, your sensor entity will need to also return the correct unit of measurement.

| Constant | Supported units | Description
| ---- | ---- | -----------
| `SensorDeviceClass.APPARENT_POWER` | VA | Apparent power |
| `SensorDeviceClass.AQI` | None | Air Quality Index
| `SensorDeviceClass.ATMOSPHERIC_PRESSURE` | cbar, bar, hPa, inHg, kPa, mbar, Pa, psi | Atmospheric pressure.
| `SensorDeviceClass.BATTERY` | % | Percentage of battery that is left
| `SensorDeviceClass.CARBON_DIOXIDE` | ppm | Concentration of carbon dioxide.
| `SensorDeviceClass.CARBON_MONOXIDE` | ppm | Concentration of carbon monoxide.
| `SensorDeviceClass.CURRENT` | A, mA | Current
| `SensorDeviceClass.DATA_RATE` | bit/s, kbit/s, Mbit/s, Gbit/s, B/s, kB/s, MB/s, GB/s, KiB/s, MiB/s, GiB/s | Data rate
| `SensorDeviceClass.DATA_SIZE` | bit, kbit, Mbit, Gbit, B, kB, MB, GB, TB, PB, EB, ZB, YB, KiB, MiB, GiB, TiB, PiB, EiB, ZiB, YiB | Data size
| `SensorDeviceClass.DATE` | | Date. Requires `native_value` to be a Python `datetime.date` object, or `None`.
| `SensorDeviceClass.DISTANCE` | km, m, cm, mm, mi, yd, in | Generic distance
| `SensorDeviceClass.DURATION` | d, h, min, s, ms | Time period. Should not update only due to time passing. The device or service needs to give a new data point to update.
| `SensorDeviceClass.ENERGY` | Wh, kWh, MWh, MJ, GJ | Energy, this device class should used for sensors representing energy consumption, for example an electricity meter. Represents _power_ over _time_. Not to be confused with `power`.
| `SensorDeviceClass.ENERGY_STORAGE` | Wh, kWh, MWh, MJ, GJ | Stored energy, this device class should be used for sensors representing stored energy, for example the amount of electric energy currently stored in a battery or the capacity of a battery. Represents _power_ over _time_. Not to be confused with `power`.
| `SensorDeviceClass.ENUM` | | The sensor has a limited set of (non-numeric) states. The `options` property must be set to a list of possible states when using this device class.
| `SensorDeviceClass.FREQUENCY` | Hz, kHz, MHz, GHz | Frequency
| `SensorDeviceClass.GAS` | m³, ft³, CCF | Volume of gas. Gas consumption measured as energy in kWh instead of a volume should be classified as energy.
| `SensorDeviceClass.HUMIDITY` | % | Relative humidity
| `SensorDeviceClass.ILLUMINANCE` | lx | Light level
| `SensorDeviceClass.IRRADIANCE` | W/m², BTU/(h⋅ft²) | Irradiance
| `SensorDeviceClass.MOISTURE` | % | Moisture
| `SensorDeviceClass.MONETARY` | [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) | Monetary value with a currency.
| `SensorDeviceClass.NITROGEN_DIOXIDE` | µg/m³ | Concentration of nitrogen dioxide |
| `SensorDeviceClass.NITROGEN_MONOXIDE` | µg/m³ | Concentration of nitrogen monoxide |
| `SensorDeviceClass.NITROUS_OXIDE` | µg/m³ | Concentration of nitrous oxide |
| `SensorDeviceClass.OZONE` | µg/m³ | Concentration of ozone |
| `SensorDeviceClass.PM1` | µg/m³ | Concentration of particulate matter less than 1 micrometer |
| `SensorDeviceClass.PM25` | µg/m³ | Concentration of particulate matter less than 2.5 micrometers |
| `SensorDeviceClass.PM10` | µg/m³ | Concentration of particulate matter less than 10 micrometers |
| `SensorDeviceClass.POWER` | W, kW | Power.
| `SensorDeviceClass.POWER_FACTOR` | %, None | Power Factor
| `SensorDeviceClass.PRECIPITATION` | cm, in, mm | Accumulated precipitation
| `SensorDeviceClass.PRECIPITATION_INTENSITY` | in/d, in/h, mm/d, mm/h | Precipitation intensity
| `SensorDeviceClass.PRESSURE` | cbar, bar, hPa, inHg, kPa, mbar, Pa, psi | Pressure.
| `SensorDeviceClass.REACTIVE_POWER` | var | Reactive power |
| `SensorDeviceClass.SIGNAL_STRENGTH` | dB, dBm | Signal strength
| `SensorDeviceClass.SOUND_PRESSURE` | dB, dBA | Sound pressure
| `SensorDeviceClass.SPEED` | ft/s, in/d, in/h, km/h, kn, m/s, mph, mm/d | Generic speed
| `SensorDeviceClass.SULPHUR_DIOXIDE` | µg/m³ | Concentration of sulphure dioxide |
| `SensorDeviceClass.TEMPERATURE` | °C, °F, K | Temperature.
| `SensorDeviceClass.TIMESTAMP` | | Timestamp. Requires `native_value` to return a Python `datetime.datetime` object, with time zone information, or `None`.
| `SensorDeviceClass.VOLATILE_ORGANIC_COMPOUNDS` | µg/m³ | Concentration of volatile organic compounds
| `SensorDeviceClass.VOLATILE_ORGANIC_COMPOUNDS_PARTS` | ppm, ppb | Ratio of volatile organic compounds
| `SensorDeviceClass.VOLTAGE` | V, mV | Voltage
| `SensorDeviceClass.VOLUME` | L, mL, gal, fl. oz., m³, ft³, CCF | Generic volume, this device class should be used for sensors representing a consumption, for example the amount of fuel consumed by a vehicle.
| `SensorDeviceClass.VOLUME_STORAGE` | L, mL, gal, fl. oz., m³, ft³, CCF | Generic stored volume, this device class should be used for sensors representing a stored volume, for example the amount of fuel in a fuel tank.
| `SensorDeviceClass.WATER` | L, gal, m³, ft³, CCF | Water consumption
| `SensorDeviceClass.WEIGHT` | kg, g, mg, µg, oz, lb, st | Generic mass; `weight` is used instead of `mass` to fit with every day language.
| `SensorDeviceClass.WIND_SPEED` | ft/s, km/h, kn, m/s, mph | Wind speed

### Available state classes

:::caution
Choose the state class for a sensor with care. In most cases, state class `measurement` or state class `total` without `last_reset` should be chosen, this is explained further in [How to choose `state_class` and `last_reset`](#how-to-choose-state_class-and-last_reset) below.
:::

| Type | Description
| ---- | -----------
| measurement | The state represents _a measurement in present time_, not a historical aggregation such as statistics or a prediction of the future. Examples of what should be classified `measurement` are: current temperature, humidity or electric power.  Examples of what should not be classified as `measurement`: Forecasted temperature for tomorrow, yesterday's energy consumption or anything else that doesn't include the _current_ measurement. For supported sensors, statistics of hourly min, max and average sensor readings is updated every 5 minutes.
| total | The state represents a total amount that can both increase and decrease, e.g. a net energy meter. Statistics of the accumulated growth or decline of the sensor's value since it was first added is updated every 5 minutes. This state class should not be used for sensors where the absolute value is interesting instead of the accumulated growth or decline, for example remaining battery capacity or CPU load; in such cases state class `measurement` should be used instead.
| total_increasing | Similar to `total`, with the restriction that the state represents a monotonically increasing positive total which periodically restarts counting from 0, e.g. a daily amount of consumed gas, weekly water consumption or lifetime energy consumption. Statistics of the accumulated growth of the sensor's value since it was first added is updated every 5 minutes. A decreasing value is interpreted as the start of a new meter cycle or the replacement of the meter.

### Entity options

Sensors can be configured by the user, this is done by storing `sensor` entity options in the sensor's entity registry entry.

| Option | Description
| ------ | -----------
| unit_of_measurement | The sensor's unit of measurement can be overridden for sensors with device class `pressure` or `temperature`.

## Restoring sensor states

Sensors which restore the state after restart or reload should not extend `RestoreEntity` because  that does not store the `native_value`, but instead the `state` which may have been modifed by the sensor base entity. Sensors which restore the state should extend `RestoreSensor` and call `await self.async_get_last_sensor_data` from `async_added_to_hass` to get access to the stored `native_value` and `native_unit_of_measurement`.


## Long-term Statistics

Home Assistant has support for storing sensors as long-term statistics if the entity has
the right properties. To opt-in for statistics, the sensor must have
`state_class` set to one of the valid state classes: `measurement`, `total` or
`total_increasing`.
For certain device classes, the unit of the statistics is normalized to for example make
it possible to plot several sensors in a single graph.

### Entities not representing a total amount

Home Assistant tracks the min, max and mean value during the statistics period. The
`state_class` property must be set to `measurement`, and the `device_class` must not be
either of `energy`, `gas`, or `monetary`

### Entities representing a total amount

Entities tracking a total amount have a value that may optionally reset periodically,
like this month's energy consumption, today's energy production or the yearly growth of
a stock portfolio. The sensor's value when the first statistics is compiled is used as
the initial zero-point.

#### How to choose `state_class` and `last_reset`
It's recommended to use state class `total` without `last_reset` whenever possible, state class `total_increasing` or `total` with `last_reset` should only be used when state class `total` without `last_reset` does not work for the sensor.

Examples
- The sensor's value never resets, e.g. a lifetime total energy consumption or production: state_class `total`, `last_reset` not set or set to `None`
- The sensor's value may reset to 0, and its value can only increase: state class `total_increasing`. Examples: energy consumption aligned with a billing cycle, e.g. monthly, an energy meter resetting to 0 every time it's disconnected
- The sensor's value may reset to 0, and its value can both increase and decrease: state class `total`, `last_reset` updated when the value resets. Examples: net energy consumption aligned with a billing cycle, e.g. monthly.
- The sensor's state is reset with every state update, for example a sensor updating every minute with the energy consumption during the past minute: state class `total`, `last_reset` updated every state change.

#### State class `total`
For sensors with state class `total`, the `last_reset` attribute can
optionally be set to gain manual control of meter cycles.
The sensor's state when it's first added to Home Assistant is used as an initial
zero-point. When `last_reset` changes, the zero-point will be set to 0.
If last_reset is not set, the sensor's value when it was first added is used as the
zero-point when calculating `sum` statistics.

To put it in another way: the logic when updating the statistics is to update
the sum column with the difference between the current state and the previous state
unless `last_reset` has been changed, in which case don't add anything.

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
the case of calculating a value from a sensor with measurement noise present. There is
some tolerance, a decrease between state changes of < 10% will not trigger a new meter
cycle. This state class is useful for gas meters, electricity meters, water meters etc.
The value when the sensor reading decreases will not be used as zero-point when calculating
`sum` statistics, instead the zero-point will be set to 0.

To put it in another way: the logic when updating the statistics is to update
the sum column with the difference between the current state and the previous state
unless the difference is negative, in which case don't add anything.

Example of state class `total_increasing`:

| t                      | state  | sum  |
| :--------------------- | -----: | ---: |
|   2021-08-01T13:00:00  |  1000  |   0  |
|   2021-08-01T14:00:00  |  1010  |  10  |
|   2021-08-01T15:00:00  |     0  |  10  |
|   2021-08-01T16:00:00  |     5  |  15  |

Example of state class `total_increasing` where the sensor does not reset to 0:

| t                      | state  | sum  |
| :--------------------- | -----: | ---: |
|   2021-08-01T13:00:00  |  1000  |   0  |
|   2021-08-01T14:00:00  |  1010  |  10  |
|   2021-08-01T15:00:00  |     5  |  15  |
|   2021-08-01T16:00:00  |    10  |  20  |
