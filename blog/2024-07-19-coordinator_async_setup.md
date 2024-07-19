---
author: Josef Zweck
authorURL: https://github.com/zweckj
title: Initialize a `DataUpdateCoordinator` with `_async_setup`
---

In Home Assistant 2024.8, we are introducing an _async_setup method for coordinators that 
allows you to run async code to prepare your DataUpdateCoordinator, 
or to load data that only needs to be loaded once.

`_async_setup` can be overwritten in your coordinator and will be automatically
called during `coordinator.async_config_entry_first_refresh()`.
It offers the same error handling as `_async_update_data` and will handle `ConfigEntryError`
and `ConfigEntryAuthFailed` accordingly.

## Example

```python
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

class MyUpdateCoordinator(DataUpdateCoordinator[MyDataType]):
    """Class to handle fetching data from the API centrally."""

    def __init__(
        self,
        hass: HomeAssistant,
    ) -> None:
        """Initialize coordinator."""
        super().__init__(hass, _LOGGER, name=DOMAIN, update_interval=SCAN_INTERVAL)
        self.prereq_data: SomeData | None = None
        self.my_api = MyApi()


    async def _async_setup(self) -> None:
        """Do initialization logic."""
        self.prereq_data = await self.my_api.get_initial_data()

    async def _async_update(self) -> MyDataType:
        """Do the usual update"""
        return await self.my_api.update(self.prereq_data)
```

This also allows you to change code that loaded the initial data in 
the `_async_update_data` by checking an initialization variable, like

```python
async def _async_update_data(self) -> ...:
    if not self.something:
        self.something = self.client.fetch()
    return self.client.fetch_data()
```

into

```python
async def _async_setup(self) -> None:
    self.something = self.client.fetch()

async def _async_update_data(self) -> ...:
    return self.client.fetch_data()
```

