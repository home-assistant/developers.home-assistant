---
author: Josef Zweck
authorURL: https://github.com/zweckj
title: Set up your DataUpdateCoordinator with a setup method
---

In Home Assistant 2024.8, we are introducing the `_async_setup` method for the data update coordinator. 
This method allows you to run asynchronous code to prepare your `DataUpdateCoordinator` instance
or to load data that only needs to be loaded once.

You can override `_async_setup` in your coordinator, and it will be automatically
called during `coordinator.async_config_entry_first_refresh()`.
It offers the same error handling as `_async_update_data` and will handle `ConfigEntryError`
and `ConfigEntryAuthFailed` accordingly.

## Example

```python

class MyUpdateCoordinator(DataUpdateCoordinator[MyDataType]):

    prereq_data: SomeData

    def __init__(
        self,
        hass: HomeAssistant,
    ) -> None:
        """Initialize coordinator."""
        super().__init__(hass, _LOGGER, name=DOMAIN, update_interval=SCAN_INTERVAL)
        self.my_api = MyApi()


    async def _async_setup(self) -> None:
        """Do initialization logic."""
        self.prereq_data = await self.my_api.get_initial_data()

    async def _async_update_data(self) -> MyDataType:
        """Do the usual update"""
        return await self.my_api.update(self.prereq_data)
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

## More information

Read more about this in the [documentation](https://developers.home-assistant.io/docs/integration_fetching_data/)
