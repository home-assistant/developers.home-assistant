---
author: Jan-Philipp Benecke
authorURL: https://github.com/jpbede
authorImageURL: https://avatars.githubusercontent.com/u/3989428?s=96&v=4
title: "Deprecate hass.helpers usage"
---

As of Home Assistant 2024.5, we deprecate the use of `hass.helpers`.
Using `hass.helpers` will issue a warning in the logs.
Authors of custom integrations are encouraged to update their code 
to prevent any issues before Home Assistant 2024.11.

Starting from Home Assistant 2024.11, `hass.helpers` will be removed and will no longer work.

Integrations that use `hass.helpers` should be updated to import the functions and classes directly
from the integration package and pass the `hass` object as first parameter.

### New example

```python
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

async def async_setup(hass: HomeAssistant, config):
    """Set up the component."""
    client = async_get_clientsession(hass)
```

### Old example

```python
from homeassistant.core import HomeAssistant

async def async_setup(hass: HomeAssistant, config):
    """Set up the component."""
    client = hass.helpers.aiohttp_client.async_get_clientsession()
```
