---
author: Paulus Schoutsen
authorURL: https://github.com/balloob
title: "Deprecating modbus.get_hub in favor of async_get_unit"
---

As of Home Assistant Core 2026.10, `modbus.get_hub` is deprecated. It will be removed in Home Assistant Core 2027.10. Custom integrations that call it get a warning in the log until then, and stop working after that.

## Background

`get_hub` attaches an integration to a Modbus hub the user configured in YAML, under a name the integration has to be told. The user has to set up the hub by hand before the integration can work, and two integrations that need the same bus cannot share it.

In July we announced our plan to [modernize Modbus in Home Assistant](/blog/2026/07/05/modernizing-modbus). Home Assistant Core 2026.9 delivered the first piece: `async_get_unit`. An integration collects the connection details in its own config flow, the same as any other integration, and asks the Modbus integration for a unit on them. Integrations that ask with equal details share one connection. Nothing is configured in YAML and nothing extra is persisted.

## What to do

Replace the call to `get_hub` with a call to `async_get_unit`:

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

This is not a one-to-one swap. Your config flow has to collect the connection details required by the transport, for example host and port, besides unit ID, that the user used to write in the YAML hub, and the device-specific communication should move into a library built on [`modbus-connection`](https://home-assistant-libs.github.io/modbus-connection/). The [Modbus developer documentation](/docs/modbus/introduction) describes both, with example code and a reference device library.

More details can be found in the [core PR](https://github.com/home-assistant/core/pull/179933).
