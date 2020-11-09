---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: System Health and Templates
---

In Home Assistant 0.118, there will be two changes that could impact your custom integration.

## Removed deprecated `helpers.template.extract_entities`

The previously deprecated `extract_entities` method from the Template helper has been removed ([PR 42601](https://github.com/home-assistant/core/pull/42601)). Instead of extracting entities and then manually listen for state changes, use the new `async_track_template_result` from the Event helper. It will dynamically make sure that every touched entity is tracked correctly.

```python
from homeassistant.helpers.event import async_track_template_result, TrackTemplate

template = "{{ light.kitchen.state == 'on' }}"

async_track_template_result(
    hass,
    [TrackTemplate(template, None)],
    lambda event, updates: print(event, updates),
)
```

## Improved System Health

Starting with Home Assistant 0.118, we're deprecating the old way of providing system health information for your integration. Instead, create a `system_health.py` file in your integration ([PR 42785](https://github.com/home-assistant/core/pull/42785)).

Starting this release, you can also include health checks that take longer to resolve ([PR 42831](https://github.com/home-assistant/core/pull/42831)), like checking if the service is online. The results will be passed to the frontend when they are ready.

```python
"""Provide info to system health."""
from homeassistant.components import system_health
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN


@callback
def async_register(
    hass: HomeAssistant, register: system_health.RegisterSystemHealth
) -> None:
    """Register system health callbacks."""
    register.async_register_info(system_health_info)


async def system_health_info(hass):
    """Get info for the info page."""
    client = hass.data[DOMAIN]

    return {
      "server_version": client.server_version,
      "can_reach_server": system_health.async_check_can_reach_url(
          hass, client.server_url
      )
    }
```
