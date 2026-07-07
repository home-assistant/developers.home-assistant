---
title: "Modbus in Home Assistant"
sidebar_label: Modbus
---

Modbus is a polling-based communication protocol, used over both serial lines and TCP. It is widely used in the smart home for devices like solar inverters, energy meters, and other industrial equipment that has made its way into our homes.

A Modbus connection is a single, exclusive resource: only one party can talk on the bus at a time. A serial (RS-485) bus, or a TCP-to-serial gateway, can carry many devices at once, sometimes from different manufacturers. Rather than have each device integration open its own connection, the [`modbus_connection`](https://github.com/home-assistant/core/tree/dev/homeassistant/components/modbus_connection) integration owns the connection and lends per-unit handles to consumer integrations, so several device integrations can talk to the same bus without stepping on each other. A device integration should always route through `modbus_connection` rather than connecting directly.

## Consuming a shared connection

The `modbus_connection` integration is set up in the UI: the user adds a config entry describing the transport (serial or TCP) and it keeps that connection open. A device integration never opens or closes a Modbus connection itself. It borrows a handle for a single unit from a `modbus_connection` config entry.

To consume a shared connection, a device integration:

1. Adds `modbus_connection` to its `dependencies` in [`manifest.json`](creating_integration_manifest.md).
2. In its own config flow, asks the user to select a `modbus_connection` config entry and a unit ID. Use a `ConfigEntrySelector` limited to the `modbus_connection` integration so only a Modbus connection can be picked:

```python
import voluptuous as vol

from homeassistant.helpers.selector import (
    ConfigEntrySelector,
    ConfigEntrySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
)

STEP_USER_DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_CONNECTION): ConfigEntrySelector(
            ConfigEntrySelectorConfig(integration="modbus_connection"),
        ),
        vol.Required(CONF_UNIT_ID): NumberSelector(
            NumberSelectorConfig(min=1, max=247, mode=NumberSelectorMode.BOX),
        ),
    }
)
```

Store the selected connection's `entry_id` and the unit ID in the config entry data.

3. In `async_setup_entry`, borrow the unit with `async_get_unit`, hand it to your device model, and reload the entry when the connection is lost:

```python
from homeassistant.components.modbus_connection import async_get_unit


async def async_setup_entry(hass: HomeAssistant, entry: MyConfigEntry) -> bool:
    """Set up my device from a config entry."""
    # async_get_unit raises ConnectionNotReady when the shared connection entry
    # is missing or not loaded. It is a ConfigEntryNotReady, so letting it
    # propagate gives Home Assistant's normal setup-retry behaviour.
    unit = async_get_unit(
        hass, entry.data[CONF_CONNECTION], int(entry.data[CONF_UNIT_ID])
    )
    device = MyDevice(unit)

    ...  # store runtime data, set up your coordinator and platforms

    # The unit is bound to the connection that is live now. When that connection
    # drops, modbus_connection rebuilds it, so reload to re-borrow a unit on the
    # fresh connection instead of holding a dead one.
    entry.async_on_unload(
        unit.on_connection_lost(
            lambda: hass.config_entries.async_schedule_reload(entry.entry_id)
        )
    )
    return True
```

`async_get_unit(hass, connection_entry_id, unit_id)` is a callback that returns a backend-neutral `ModbusUnit` bound to the given unit ID. Hand that unit to your device model (see [Writing Modbus libraries](#writing-modbus-libraries)) rather than reading from it directly. The underlying `ModbusConnection` never leaves the `modbus_connection` integration, so consumers cannot accidentally open, close, or reconfigure the shared connection.

You do not need to catch `ConnectionNotReady`. Because it is a `ConfigEntryNotReady`, letting it propagate out of your `async_setup_entry` gives Home Assistant's setup-retry behaviour, and the entry is retried automatically once the `modbus_connection` entry finishes loading.

## Writing Modbus libraries

We require each integration to implement a library that handles the device-specific communication. To help build these libraries, we maintain [`modbus-connection`](https://home-assistant-libs.github.io/modbus-connection/), a Python package.

`modbus-connection` provides:

- A common, backend-neutral interface on top of [pymodbus](https://github.com/pymodbus-dev/pymodbus) and [tmodbus](https://github.com/wlcrs/tmodbus), two popular Modbus libraries, so you can swap backends without changing your code.
- A device modelling framework to map a device's data to typed Python attributes and read it in as few requests as possible ([example from Trovis](https://github.com/Tom-Bom-badil/trovis-modbus/blob/main/src/trovis_modbus/heating_circuit.py)).
- A `pytest` plugin to make testing your library easy.

For a complete example of the pattern, see [trovis-modbus](https://github.com/Tom-Bom-badil/trovis-modbus), a device library built on `modbus-connection`, and [trovis-modbus-hass](https://github.com/Tom-Bom-badil/trovis-modbus-hass), the Home Assistant integration that consumes it.
