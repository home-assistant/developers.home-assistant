---
title: "Fetching Data"
---

Your integration will need to fetch data from an API to be able to provide this to Home Assistant. This API can be available over the web (local or cloud), sockets, serial ports exposed via USB sticks, etc.

# Push vs Poll

APIs come in many different shapes and forms but at its core they fall in two categories: push and poll.

With push, we subscribe to an API and we get notified by the API when new data is available. It pushes the changes to us. Push APIs are great because they consume less resources. When a change happens, we can get notified of a change and don't have to re-fetch all the data and find changes. Because entities can be disabled, you should make sure that your entity subscribes inside the `async_added_to_hass` callback and unsubscribes inside `async_will_remove_from_hass`.

With polling, we will fetch the latest data from the API at a specified interval. Your integration will then supply this data to its entity, which is written to Home Assistant.

Because polling is so common, Home Assistant by default assumes that your entity is based on polling. If this is not the case, return `False` from the `should_poll` property. When you disable polling, your integration will be responsible for calling one of the methods to indicate to Home Assistant that it's time to write the entity state to Home Assistant:

- `Entity.schedule_update_ha_state(update_data=False)`/`Entity.async_schedule_update_ha_state(update_data=False)` will schedule an update of the entity. If `update_data` is set to `True`, Home Assistant will call your entities update method (`update()`/`async_update()`) prior to writing the state.
- `Entity.async_write_ha_state()` is an async callback that will write the state to the state machine within yielding to the event loop. It will not call your entity update method.

# Polling API endpoints

We're going to explain a few different API types ones here and the best way to integrate them in Home Assistant. Note that some integrations will encounter a combination of the ones below.

## One API endpoint with all the data

This API will have a single method to fetch data for all the entities that you have in Home Assistant. In this case we'll want to poll this endpoint on an interval and then let entities know as soon as new data is available.

Home Assistant provides a Data Update Coordinator class to help you manage this as efficient as possible.

```python
import logging

from homeassistant.helpers import debounce, entity
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed


_LOGGER = logging.getLogger(__name__)

async def create_coordinator(api):
    async def async_update_data():
        """Fetch data from API endpoint."""
        try:
            await api.fetch_data()
        except ApiError:
            raise UpdateFailed


    coordinator = DataUpdateCoordinator(
        hass,
        _LOGGER,
        # Name of the data. For logging purposes.
        "sensor",
        async_update_data,
        # Polling interval. Will only be polled if there are subscribers.
        timedelta(seconds=30),
        # Debouncer to limit request_refresh
        debounce.Debouncer(
            hass,
            _LOGGER,
            # Timeout to wait between refreshes
            0.3,
            # When a refresh is requested, should we refresh right await and then wait
            # Or should we wait and refresh at the end of timeout.
            True
        ),
    )

    # Fetch initial data so we have data when entities subscribe
    await coordinator.async_refresh()

    return coordinator


class MyEntity(entity.Entity):

    def __init__(self, coordinator):
        self.coordinator = coordinator

    @property
    def should_poll(self):
        """No need to poll. Coordinator notifies entity of updates."""
        return False

    @property
    def available(self):
        """Return if entity is available."""
        return not self.coordinator.failed_last_update

    async def async_added_to_hass(self):
        """When entity is added to hass."""
        self.coordinator.async_add_listener(
            self.async_write_ha_state
        )

    async def async_will_remove_from_hass(self):
        """When entity will be removed from hass."""
        self.coordinator.async_remove_listener(
            self.async_write_ha_state
        )

    async def async_turn_on(self, **kwargs):
        """Turn the light on.

        Example method how to request data updates.
        """
        # Do the turning on.
        # ...

        # Update the data
        await self.coordinator.async_request_refresh()

    async def async_update(self):
        """Update the entity.

        Only used by the generic entity update service.
        """
        await self.coordinator.async_request_refresh()
```

## One API endpoint per device

If your one API endpoint is mapping to multiple entities, please see the previous section. Even if there are many endpoints, it's best to use a coordinator per endpoint to manage this data.

If you can map exactly one endpoint to a single device, you can fetch the data for this entity inside the `update()`/`async_update()` methods. Make sure polling is set to `True` and Home Assistant will call this method regularly.

If your entities need to fetch data before being written to Home Assistan for the first time, pass `True` to the `add_entities` method: `add_entities([MyEntity()], True)`.

You can control the polling interval for your integration by defining a `SCAN_INTERVAL` constant in your platform.

```python
from datetime import timedelta

SCAN_INTERVAL = timedelta(seconds=5)
```

# Request Parallelism

> This is an advanced topic.

Home Assistant has built-in logic to make sure that integrations don't hammer services/APIs and consume all available resources in Home Assistant. This logic is built around limiting the number of parallel requests. This logic is automatically used during service calls and entity updates.

Home Assistant controls the number of parallel requests by maintaining a [semaphore](https://docs.python.org/3/library/asyncio-sync.html#asyncio.Semaphore). For example, if the semaphore allows 1 parallel connection, updates and service calls will wait if one is in progress. If the value is 0, the integration is itself responsible for limiting the number of parallel requests if necessary.

The default value for parallel requests for a platform is decided based on the first entity that is added to Home Assistant. It's 1 if the entity defines the `async_update` method, else it's 0. (this is a legacy decision)

Platforms can override teh default by defining the `PARALLEL_UPDATES` constant in their platform (ie `rflink/light.py`).
