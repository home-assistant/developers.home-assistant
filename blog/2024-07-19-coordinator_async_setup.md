---
author: Josef Zweck
authorURL: https://github.com/zweckj
title: Setting up `DataUpdateCoordinators` with `_async_setup`
---

Until now, there was no clearly defined place where you would initialize your `DataUpdateCoordinator`,
or where you could load data, that only needs to be loaded once.

In Home Assistant 2024.8 we are introducing an `_async_setup` method for coordinators that changes that. 
`_async_setup` can be overwritten in your coordinator, and will be automatically
called during `coordinator.async_config_entry_first_refresh()`.
It offers the same error handling as `_async_update_data` and will handle `ConfigEntryError`
and `ConfigEntryAuthFailed` accordingly

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

