---
title: "Modbus in Home Assistant"
sidebar_label: Modbus
---

Modbus is a polling-based communication protocol, used over both serial lines and TCP. It is widely used in the smart home for devices like solar inverters, energy meters, and other industrial equipment that has made its way into our homes.

## Writing Modbus libraries

We require each integration to implement a library that handles the device-specific communication. To help build these libraries, we maintain [`modbus-connection`](https://home-assistant-libs.github.io/modbus-connection/), a Python package.

`modbus-connection` provides:

- A common, backend-neutral interface on top of [pymodbus](https://github.com/pymodbus-dev/pymodbus) and [tmodbus](https://github.com/wlcrs/tmodbus), two popular Modbus libraries, so you can swap backends without changing your code.
- A device modelling framework to map a device's data to typed Python attributes and read it in as few requests as possible ([example from Trovis](https://github.com/Tom-Bom-badil/trovis-modbus/blob/main/src/trovis_modbus/heating_circuit.py)).
- A `pytest` plugin to make testing your library easy.

For a complete example of the pattern, see [trovis-modbus](https://github.com/Tom-Bom-badil/trovis-modbus), a device library built on `modbus-connection`, and [trovis-modbus-hass](https://github.com/Tom-Bom-badil/trovis-modbus-hass), the Home Assistant integration that consumes it.
