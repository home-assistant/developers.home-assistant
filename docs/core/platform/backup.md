---
title: "Backup"
---

When Home Assistant is creating a backup, there might be a need to pause certain operations in the integration, or dumping data, so it can properly be restored.

This is done by adding 2 functions (`async_pre_backup` and `async_post_backup`) to `backup.py`

## Adding support

The quickest way to add backup support to a new integration is by using our built-in scaffold template. From a Home Assistant dev environment, run `python3 -m script.scaffold backup` and follow the instructions.

If you prefer to go the manual route, create a new file in your integration folder called `backup.py` and implement the following method:

```python
from homeassistant.core import HomeAssistant


async def async_pre_backup(hass: HomeAssistant) -> None:
    """Perform operations before a backup starts."""

async def async_post_backup(hass: HomeAssistant) -> None:
    """Perform operations after a backup finishes."""
```
