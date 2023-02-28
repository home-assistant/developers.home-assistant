---
title: Number Entity
sidebar_label: Number
---

A `number` is an entity that allows the user to input an arbitrary value to an integration. Derive entity platforms from [`homeassistant.components.number.NumberEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/number/__init__.py)

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| device_class | string | `None` | Type of number.
| mode | string | `auto` | Defines how the number should be displayed in the UI. It's recommended to use the default `auto`. Can be `box` or `slider` to force a display mode.
| native_max_value | float | 100 | The maximum accepted value in the number's `native_unit_of_measurement` (inclusive)
| native_min_value | float | 0 | The minimum accepted value in the number's `native_unit_of_measurement` (inclusive)
| native_step | float | **See below** | Defines the resolution of the values, i.e. the smallest increment or decrement in the number's | native_unit_of_measurement | string | `None` | The unit of measurement that the number's value is expressed in. If the `native_unit_of_measurement` is °C or °F, and its `device_class` is temperature, the number's `unit_of_measurement` will be the preferred temperature unit configured by the user and the number's `state` will be the `native_value` after an optional unit conversion.
| native_value | float | **Required** | The value of the number in the number's `native_unit_of_measurement`.
| native_unit_of_measurement | string | None | The unit of measurement that the sensor's value is expressed in. If the `native_unit_of_measurement` is °C or °F, and its `device_class` is temperature, the sensor's `unit_of_measurement` will be the preferred temperature unit configured by the user and the sensor's `state` will be the `native_value` after an optional unit conversion.

Other properties that are common to all entities such as `icon`, `name` etc are also applicable.

The default step value is dynamically chosen based on the range (max - min) values. If the difference between max_value and min_value is greater than 1.0, then the default step is 1.0. If, however, the range is smaller, then the step is iteratively divided by 10 until it becomes lower than the range.

### Available device classes

If specifying a device class, your number entity will need to also return the correct unit of measurement.

| Constant | Supported units | Description
| ---- | ---- | -----------
| `NumberDeviceClass.APPARANT_POWER` | VA | Apparent power |
| `NumberDeviceClass.AQI` | None | Air Quality Index
| `NumberDeviceClass.ATMOSPHERIC_PRESSURE` | cbar, bar, hPa, inHg, kPa, mbar, Pa, psi | Atmospheric pressure, statistics will be stored in Pa.
| `NumberDeviceClass.BATTERY` | % | Percentage of battery that is left
| `NumberDeviceClass.CARBON_DIOXIDE` | ppm | Concentration of carbon dioxide.
| `NumberDeviceClass.CARBON_MONOXIDE` | ppm | Concentration of carbon monoxide.
| `NumberDeviceClass.CURRENT` | A, mA | Current
| `NumberDeviceClass.DATA_RATE` | bit/s, kbit/s, Mbit/s, Gbit/s, B/s, kB/s, MB/s, GB/s, KiB/s, MiB/s, GiB/s | Data rate
| `NumberDeviceClass.DATA_SIZE` | bit, kbit, Mbit, Gbit, B, kB, MB, GB, TB, PB, EB, ZB, YB, KiB, MiB, GiB, TiB, PiB, EiB, ZiB, YiB | Data size
| `NumberDeviceClass.DISTANCE` | km, m, cm, mm, mi, yd, in | Generic distance
| `NumberDeviceClass.ENERGY` | Wh, kWh, MWh, MJ, GJ | Energy, this device class should used to represent energy consumption, for example an electricity meter. Represents _power_ over _time_. Not to be confused with `power`.
| `NumberDeviceClass.ENERGY_STORAGE` | Wh, kWh, MWh, MJ, GJ | Stored energy, this device class should be used to represent stored energy, for example the amount of electric energy currently stored in a battery or the capacity of a battery. Represents _power_ over _time_. Not to be confused with `power`.
| `NumberDeviceClass.FREQUENCY` | Hz, kHz, MHz, GHz | Frequency
| `NumberDeviceClass.GAS` | m³, ft³, CCF | Volume of gas. Gas consumption measured as energy in kWh instead of a volume should be classified as energy.
| `NumberDeviceClass.HUMIDITY` | % | Relative humidity
| `NumberDeviceClass.ILLUMINANCE` | lx | Light level
| `NumberDeviceClass.IRRADIANCE` | W/m², BTU/(h⋅ft²) | Irradiance
| `NumberDeviceClass.MOISTURE` | % | Moisture
| `NumberDeviceClass.MONETARY` | [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) | Monetary value with a currency.
| `NumberDeviceClass.NITROGEN_DIOXIDE` | µg/m³ | Concentration of nitrogen dioxide |
| `NumberDeviceClass.NITROGEN_MONOXIDE` | µg/m³ | Concentration of nitrogen monoxide |
| `NumberDeviceClass.NITROUS_OXIDE` | µg/m³ | Concentration of nitrous oxide |
| `NumberDeviceClass.OZONE` | µg/m³ | Concentration of ozone |
| `NumberDeviceClass.PM1` | µg/m³ | Concentration of particulate matter less than 1 micrometer |
| `NumberDeviceClass.PM25` | µg/m³ | Concentration of particulate matter less than 2.5 micrometers |
| `NumberDeviceClass.PM10` | µg/m³ | Concentration of particulate matter less than 10 micrometers |
| `NumberDeviceClass.POWER` | W, kW | Power.
| `NumberDeviceClass.POWER_FACTOR` | %, None | Power Factor
| `NumberDeviceClass.PRECIPITATION` | cm, in, mm | Precipitation
| `NumberDeviceClass.PRECIPITATION_INTENSITY` | in/d, in/h, mm/d, mm/h | Precipitation intensity
| `NumberDeviceClass.PRESSURE` | cbar, bar, hPa, inHg, kPa, mbar, Pa, psi | Pressure.
| `NumberDeviceClass.REACTIVE_POWER` | var | Reactive power |
| `NumberDeviceClass.SIGNAL_STRENGTH` | dB, dBm | Signal strength
| `NumberDeviceClass.SOUND_PRESSURE` | dB, dBA | Sound pressure
| `NumberDeviceClass.SPEED` | ft/s, in/d, in/h, km/h, kn, m/s, mph, mm/d | Generic speed
| `NumberDeviceClass.SULPHUR_DIOXIDE` | µg/m³ | Concentration of sulphure dioxide |
| `NumberDeviceClass.TEMPERATURE` | °C, °F, K | Temperature.
| `NumberDeviceClass.VOLATILE_ORGANIC_COMPOUNDS` | µg/m³ | Concentration of volatile organic compounds
| `NumberDeviceClass.VOLTAGE` | V, mV | Voltage
| `NumberDeviceClass.VOLUME` | L, mL, gal, fl. oz., m³, ft³, CCF | Generic volume, this device class should be used to represent a consumption, for example the amount of fuel consumed by a vehicle.
| `NumberDeviceClass.VOLUME_STORAGE` | L, mL, gal, fl. oz., m³, ft³, CCF | Generic stored volume, this device class should be used to represent a stored volume, for example the amount of fuel in a fuel tank.
| `NumberDeviceClass.WATER` | L, gal, m³, ft³, CCF | Water consumption
| `NumberDeviceClass.WEIGHT` | kg, g, mg, µg, oz, lb, st | Generic mass; `weight` is used instead of `mass` to fit with every day language.
| `NumberDeviceClass.WIND_SPEED` | ft/s, km/h, kn, m/s, mph | Wind speed

## Restoring number states

Numbers which restore the state after restart or reload should not extend `RestoreEntity` because  that does not store the `native_value`, but instead the `state` which may have been modifed by the number base entity. Numbers which restore the state should extend `RestoreNumber` and call `await self.async_get_last_number_data` from `async_added_to_hass` to get access to the stored `native_min_value`,  `native_max_value`,  `native_step`,  `native_unit_of_measurement` and `native_value`.

## Methods

### Set value

Called when the user or an automation wants to update the value.

```python
class MyNumber(NumberEntity):
    # Implement one of these methods.

    def set_native_value(self, value: float) -> None:
        """Update the current value."""

    async def async_set_native_value(self, value: float) -> None:
        """Update the current value."""

```
