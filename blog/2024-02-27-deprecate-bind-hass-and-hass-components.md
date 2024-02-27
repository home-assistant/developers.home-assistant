---
author: Jan-Philipp Benecke
authorURL: https://github.com/jpbede
authorImageURL: https://avatars.githubusercontent.com/u/3989428?s=96&v=4
title: "Deprecate use of @bind_hass and hass.components"
---

As of Home Assistant 2024.3, we deprecate the use of the `@bind_hass` decorator 
and thus also the use of `hass.components`. A warning will be logged if used.

Starting from Home Assistant 2024.9, the `@bind_hass` decorator and 
`hass.components` will be removed and will no longer work.

## Use of `@bind_hass` decorator

Integrations that use the `@bind_hass` decorator should be updated to remove them and pass the `hass` object as first parameter to the function instead:

### New example

```python
from homeassistant.core import HomeAssistant
from homeassistant.components.persistent_notification import async_create

def create_notification(hass: HomeAssistant, message: str):
    """Create a notification."""
    async_create(
        hass,
        message, 
        title='Important notification'
    )

async def async_setup(hass: HomeAssistant, config):
    """Set up the component."""
    create_notification(hass, "You're already using the latest version!")
```

### Old example

```python
from homeassistant.core import HomeAssistant
from homeassistant.loader import bind_hass
from homeassistant.components.persistent_notification import async_create

@bind_hass
def create_notification(hass: HomeAssistant, message: str):
    """Create a notification."""
    async_create(
        hass,
        message, 
        title='Important notification'
    )

async def async_setup(hass: HomeAssistant, config):
    """Set up the component."""
    create_notification("You're already using the latest version!")
```

## Use of `hass.components` 

Integrations that use `hass.components` should be updated to import the functions and classes directly from the integration package and pass the `hass` object as first parameter:

### New example

```python
from homeassistant.core import HomeAssistant
from homeassistant.components.persistent_notification import async_create

async def async_setup(hass: HomeAssistant, config):
    """Set up the component."""
    async_create(
        hass, 
        "You're already using the latest version!", 
        title='Important notification'
    )
```

### Old example

```python
from homeassistant.core import HomeAssistant

async def async_setup(hass: HomeAssistant, config):
    """Set up the component."""
    hass.components.persistent_notification.async_create(
        "You're already using the latest version!", 
        title='Important notification'
    )
```
