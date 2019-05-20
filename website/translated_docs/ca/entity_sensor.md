---
title: Sensor Entity
sidebar_label: Sensor
---

A sensor is a read-only entity that provides some information. Information has a value and optionally, a unit of measurement.

## Propietats

> Les propietats han de retornar només informació en memòria i no fer transaccions I/O (com peticions web). Implementa el mètode `update()` or `async_update()` per obtenir les dades.

| Name                  | Tipus  | Per defecte    | Descripció                                               |
| --------------------- | ------ | -------------- | -------------------------------------------------------- |
| state                 | string | **Obligatori** | The value of the sensor.                                 |
| unit_of_measurement | string | `Cap`          | The unit of measurement that the sensor is expressed in. |
| device_class          | string | `Cap`          | Type of sensor.                                          |

### Available device classes

If specifying a device class, your sensor entity will need to also return the correct unit of measurement.

| Tipus           | Unit     | Descripció                 |
| --------------- | -------- | -------------------------- |
| battery         | %        | % of battery that is left. |
| humidity        | %        | % of humidity in the air.  |
| illuminance     | lx/lm    | Light level.               |
| signal_strength | dB/dBm   | Signal strength.           |
| temperature     | °C/°F    | Temperature.               |
| timestamp       | ISO8601  | Timestamp.                 |
| power           | W,kW     | Power.                     |
| pressure        | hPa,mbar | Pressure.                  |