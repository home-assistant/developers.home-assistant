---
title: Integration system health
sidebar_label: "System health"
---

The system health platform allows integrations to provide information that helps users understand the state of the integration. This can include details such as the availability of an endpoint, the current server that the integration is connected to, how much of a request quota is still available, etc.

Users can find the aggregated system health by going to **Settings** -> **System** -> **Repairs** and selecting **System information** in the overflow menu (top right).

## Implementing the system health platform

Add a `system_health.py` file to the integration and implement the `async_register` method, to register the info callback:

```python
"""Provide info to system health."""

from homeassistant.components import system_health
from homeassistant.core import HomeAssistant, callback

@callback
def async_register(hass: HomeAssistant, register: system_health.SystemHealthRegistration) -> None:
    """Register system health callbacks."""
    register.async_register_info(system_health_info)
```

The info callback should return a dictionary whose values can be of any type, including coroutines. In case a coroutine is set for a dictionary entry, the frontend will display a waiting indicator and will automatically update once the coroutine finishes and provides a result.

```python
async def system_health_info(hass: HomeAssistant) -> dict[str, Any]:
    """Get info for the info page."""
    config_entry: ExampleConfigEntry = hass.config_entries.async_entries(DOMAIN)[0]
    quota_info = await config_entry.runtime_data.async_get_quota_info()

    return {
        "consumed_requests": quota_info.consumed_requests,
        "remaining_requests": quota_info.requests_remaining,
        # checking the url can take a while, so set the coroutine in the info dict
        "can_reach_server": system_health.async_check_can_reach_url(hass, ENDPOINT),
    }
```

:::tip
The system_health component provides the `async_check_can_reach_url` helper as a way to easily implement checking the availability of a URL.
:::


Translate each key in the info dictionary using the `system_health` section in the `strings.json` file, to provide good descriptions:

```json
  "system_health": {
    "info": {
      "can_reach_server": "Reach Example server",
      "remaining_requests": "Remaining allowed requests"
    }
  }
```
