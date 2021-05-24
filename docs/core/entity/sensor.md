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
| last_reset | `datetime.datetime` | `None` | The time when an accumulating sensor such as an electricity usage meter, gas meter, water meter etc. was initialized. If the time of initialization is unknown and the meter will never reset, set to UNIX epoch 0: `datetime.fromtimestamp(0)`. When changing `last_reset`, the `state` must be a valid number.
| state_class | string | `None` | Type of state.
| unit_of_measurement | string | `None` | The unit of measurement that the sensor is expressed in.

### Available device classes

If specifying a device class, your sensor entity will need to also return the correct unit of measurement.

| Type | Unit | Description
| ---- | ---- | -----------
| battery | % | % of battery that is left.
| carbon_dioxide | ppm | parts per million of carbon dioxide concentration
| carbon_monoxide | ppm | parts per million of carbon monoxide concentration
| humidity | % | % of humidity in the air.
| illuminance | lx/lm | Light level.
| signal_strength | dB/dBm | Signal strength.
| temperature | °C/°F | Temperature.
| timestamp | ISO8601 | Timestamp.
| power | W,kW | Power.
| pressure | hPa,mbar | Pressure.
| current | A | Current.
| energy | Wh,kWh | Energy.
| power_factor | % | Power Factor.
| voltage | V | Voltage.

### Available state classes

| Type | Description
| ---- | -----------
| measurement | The state represents _a measurement in present time_, not a historical aggregation such as statistics or a prediction of the future.
