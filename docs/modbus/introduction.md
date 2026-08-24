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

## Sharing one connection with other integrations

A Modbus link addresses many units, and a device answers one request at a time.
Two integrations that each open their own socket to one device compete for it.

The Modbus integration hands out units over connections it shares, so ask it for
one instead of building your own:

```python
from homeassistant.components.modbus import async_get_unit
from modbus_connection import ModbusTcpParams


async def async_setup_entry(hass: HomeAssistant, entry: MyConfigEntry) -> bool:
    """Set up my device from a config entry."""
    unit = async_get_unit(
        hass,
        entry,
        ModbusTcpParams(host=entry.data[CONF_HOST], port=entry.data[CONF_PORT]),
        entry.data[CONF_UNIT_ID],
    )
    device = MyDevice(unit)
    ...
```

Collect the connection details in your own config flow, as you would any other.
Two integrations that ask with equal details get units over one connection, so
their requests serialize behind it.

The connection itself is not stored anywhere: it exists while an integration
holds a unit on it, and closes when the last holder's config entry unloads. Your
own entry data is untouched.

Asking for a unit performs no I/O, so a device that is powered down does not stop
your integration setting up. The first read opens the link, and a dropped link
opens again on the next request. Do not reload your entry when a connection
drops.

Asking for a device already in use over different link settings raises
`HomeAssistantError`. One connection cannot honour two baud rates at once.
