---
title: "Place common patterns in common modules"
---

## Reasoning

The Home Assistant codebase has a few common patterns that have originated over time.
For example, the majority of new integrations use a coordinator to centralize their data fetching.
The coordinator should be placed in `coordinator.py`.
This increases consistency between integrations and makes it easier to find the coordinator for a specific integration.

The second common pattern is the base entity.
Since a lot of integrations provide more types of entities, a base entity can prove useful to reduce code duplication.
The base entity should be placed in `entity.py`.

The third common pattern relates to action definition and registration.
Placing these in a separate module helps improve code clarity and separation of concern.
The action definition and registration should be placed in `services.py`.

The efforts done to increase consistency between integrations have a positive impact on the quality of the codebase and the developer experience.

## Example implementation

In this example we have a coordinator, stored in `coordinator.py`, and a base entity, stored in `entity.py`.

`coordinator.py`
```python showLineNumbers
class MyCoordinator(DataUpdateCoordinator[MyData]):
    """Class to manage fetching data."""

    def __init__(self, hass: HomeAssistant, client: MyClient) -> None:
        """Initialize coordinator."""
        super().__init__(
            hass,
            logger=LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=1),
        )
        self.client = client
```

`entity.py`
```python showLineNumbers
class MyEntity(CoordinatorEntity[MyCoordinator]):
    """Base entity for MyIntegration."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: MyCoordinator) -> None:
        """Initialize the entity."""
        super().__init__(coordinator)
        self._attr_device_info = ...
```

`services.py`
```python showLineNumbers
async def _async_get_schedule(call: ServiceCall) -> ServiceResponse:
    """Get the schedule for a specific range."""
    if not (entry := hass.config_entries.async_get_entry(call.data[ATTR_CONFIG_ENTRY_ID])):
        raise ServiceValidationError("Entry not found")
    if entry.state is not ConfigEntryState.LOADED:
        raise ServiceValidationError("Entry not loaded")
    client = cast(MyConfigEntry, entry).runtime_data
    ...

@callback
def async_setup_services(hass: HomeAssistant) -> None:
    """Register the services."""

    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_SCHEDULE,
        async_get_schedule,
        _async_get_schedule,
        schema=SERVICE_GET_SCHEDULE_SCHEMA,
        supports_response=SupportsResponse.ONLY,
        description_placeholders={"example_url": "https://schedule.example.com"}
    )
```

## Exceptions

There are no exceptions to this rule.

