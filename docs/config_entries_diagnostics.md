---
title: Config entry diagnostics
---

Config entries can provide diagnostics to help the user gather data about an integration and do troubleshooting. Diagnostics can be provided for the config entry but also individually for each device entry.

:::warning
It is very important to ensure that no sensitive data (passwords, tokens, or location data) is exposed. To help with this, you can use the `async_redact_data` utility function to redact sensitive data from the diagnostics output.
:::

The following is an example showing both config entry and device entry diagnostics:

```python
TO_REDACT = [
    CONF_API_KEY,
    APPLIANCE_CODE
]

async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: MyConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""

    return {
        "entry_data": async_redact_data(entry.data, TO_REDACT),
        "data": entry.runtime_data.data,
    }

async def async_get_device_diagnostics(
    hass: HomeAssistant, config_entry: ConfigEntry, device: DeviceEntry
) -> dict[str, Any]:
    """Return diagnostics for a device."""
    appliance = _get_appliance_by_device_id(hass, device.id)
    return {
        "details": async_redact_data(appliance.raw_data, TO_REDACT),
        "data": appliance.data,
    }
```

An integration can provide both types of diagnostics or just one of them.
