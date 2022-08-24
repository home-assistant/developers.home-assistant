---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Globally available HomeAssistant object (hass)"
---

It's now possible to get a reference to the `HomeAssistant` instance by calling `core.async_get_hass()`.

Although this means it's no longer strictly necessary to pass `hass` around, the recommendation is still to only use `core.async_get_hass` where it's very cumbersome or downright impossible to pass `hass` to the code which needs it.
An example where this can be useful is voluptuous validators, which previously couldn't access `hass` because voluptuous has no way of passing user data to validators.

```python
@callback
def async_get_hass() -> HomeAssistant:
    """Return the HomeAssistant instance.
    Raises LookupError if no HomeAssistant instance is available.
    This should be used where it's very cumbersome or downright impossible to pass
    hass to the code which needs it.
    """
```
