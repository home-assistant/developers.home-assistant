---
author: Josef Zweck
authorURL: https://github.com/zweckj
title: Initialize a `DataUpdateCoordinator` with `_async_setup`
---

In Home Assistant 2024.8, we are introducing the `_async_setup` method for coordinators. 
This method allows you to run asynchronous code to prepare your `DataUpdateCoordinator`
or to load data that only needs to be loaded once.

You can override `_async_setup` in your coordinator, and it will be automatically
called during `coordinator.async_config_entry_first_refresh()`.
It offers the same error handling as `_async_update_data` and will handle `ConfigEntryError`
and `ConfigEntryAuthFailed` accordingly.

## Example

```python
# Example of a custom DataUpdateCoordinator with the `_async_setup` method
# This example demonstrates how to initialize data that only needs to be loaded once.

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

and call it during platform setup

```python
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    coordinator = MyUpdateCoordinator(hass)

    # This will first call _async_setup() now
    # and if that succeeded, _async_update_data()
    await coordinator.async_config_entry_first_refresh()
```
## Avoiding checks for initialization status

This change allows you to refactor code that loaded the initial data in 
the `_async_update_data` method by checking an initialization variable, like

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

