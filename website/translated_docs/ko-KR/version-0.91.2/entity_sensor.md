---
title: Sensor Entity
sidebar_label: Sensor
id: version-0.91.2-entity_sensor
original_id: entity_sensor
---

A sensor is a read-only entity that provides some information. Information has a value and optionally, a unit of measurement.

## Properties

> Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.

| Name                  | 구분     | Default      | 설명                                                       |
| --------------------- | ------ | ------------ | -------------------------------------------------------- |
| state                 | string | **Required** | The value of the sensor.                                 |
| unit_of_measurement | string | `None`       | The unit of measurement that the sensor is expressed in. |
| device_class          | string | `None`       | Type of sensor.                                          |

### Available device classes

If specifying a device class, your sensor entity will need to also return the correct unit of measurement.

| 구분              | Unit     | 설명                         |
| --------------- | -------- | -------------------------- |
| battery         | %        | % of battery that is left. |
| humidity        | %        | % of humidity in the air.  |
| illuminance     | lx/lm    | Light level.               |
| signal_strength | dB/dBm   | Signal strength.           |
| temperature     | °C/°F    | Temperature.               |
| timestamp       | ISO8601  | Timestamp.                 |
| power           | W,kW     | Power.                     |
| pressure        | hPa,mbar | Pressure.                  |