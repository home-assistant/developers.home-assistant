---
title: "Devices added after integration setup"
related_rules:
  - stale-devices
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Like explained in the rule [stale-devices](/docs/core/integration-quality-scale/rules/stale-devices), devices should be removed automatically when we can be sure that the device is not connected anymore.
This rule explains the other side, once a new device is connected, we should automatically create the relevant entities for the device.

This makes the user experience better, since the user only adds the device to the integration, and it will automatically show up in Home Assistant.

## Example implementation

In the example below we use a coordinator to fetch all the data from the service.
Every update `_check_device` will check if there are new devices to create entities for and add them to Home Assistant.

`coordinator.py`
```python showLineNumbers
class MyCoordinator(DataUpdateCoordinator[dict[str, MyDevice]]):
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

    async def _async_update_data(self) -> dict[str, MyDevice]:
        try:
            return await self.client.get_data()
        except MyException as ex:
            raise UpdateFailed(f"The service is unavailable: {ex}")
```

`sensor.py`
```python {9,11-16,18-21} showLineNumbers
async def async_setup_entry(
    hass: HomeAssistant,
    entry: MyConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up My integration from a config entry."""
    coordinator = entry.runtime_data

    known_devices: set[str] = set()

    def _check_device() -> None:
        current_devices = set(coordinator.data)
        new_devices = current_devices - known_devices
        if new_devices:
            known_devices.update(new_devices)
            async_add_entities([MySensor(coordinator, device_id) for device_id in new_devices])

    _check_device()
    entry.async_on_unload(
        coordinator.async_add_listener(_check_device)
    )
```

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>