---
title: Integration diagnostics
sidebar_label: "Diagnostics"
---

Integrations can provide diagnostics to help the user gather data to aid in troubleshooting. Diagnostics can be provided for config entries but also individually for each device entry.

Users can download config entry diagnostics from the config entry options menu, on the integration page. For device diagnostics, users can download them from the device menu.

:::warning
It is critical to ensure that no sensitive data is exposed. This includes but is not limited to:
- Passwords and API keys
- Authentication tokens
- Location data
- Personal information
- Device identifiers

To help with this, you can use the `async_redact_data` utility function from `homeassistant.helpers.redact` to safely remove sensitive data from the diagnostics output.
:::

The following is an example on how to implement both config entry and device entry diagnostics:

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
    hass: HomeAssistant, entry: MyConfigEntry, device: DeviceEntry
) -> dict[str, Any]:
    """Return diagnostics for a device."""
    appliance = _get_appliance_by_device_id(hass, device.id)
    return {
        "details": async_redact_data(appliance.raw_data, TO_REDACT),
        "data": appliance.data,
    }
```

An integration can provide both types of diagnostics or just one of them.
