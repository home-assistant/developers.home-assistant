---
title: "Modbus in Home Assistant"
sidebar_label: Modbus
---

Modbus is a polling-based communication protocol, used over both serial lines and TCP. It is widely used in the smart home for devices like solar inverters, energy meters, and other industrial equipment that has made its way into our homes.

A Modbus TCP device usually exposes only its own data, all in a single manufacturer's format. In these cases, treat Modbus as an implementation detail the user does not need to be aware of: in the config flow, ask for the host and port of the device and connect to it directly.

A serial (RS-485) bus — or a TCP-to-serial gateway — can instead carry many devices, sometimes from different manufacturers, requiring a single connection to be shared among multiple integrations. This scenario is not currently covered in Home Assistant.

## Writing Modbus libraries

We require each integration to implement a library that handles the device-specific communication. To help build these libraries, we maintain [`modbus-connection`](https://github.com/home-assistant-libs/modbus-connection).

`modbus-connection` provides:

- A common, backend-neutral interface on top of [pymodbus](https://github.com/pymodbus-dev/pymodbus) and [tmodbus](https://github.com/wlcrs/tmodbus), two popular Modbus libraries, so you can swap backends without changing your code.
- A device modelling framework to map a device's data to typed Python attributes and read it in as few requests as possible ([example from Trovis](https://github.com/Tom-Bom-badil/trovis-modbus/blob/main/src/trovis_modbus/heating_circuit.py)).
- A `pytest` plugin to make testing your library easy.
