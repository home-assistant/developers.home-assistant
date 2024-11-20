---
title: "Clean up stale devices"
related_rules:
  - dynamic-devices
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

When a device is removed from a hub or account, it should also be removed from Home Assistant.
This way, the user interface will not show devices that are no longer available.

We should only remove devices that we are sure are no longer available.
If you can't be sure if a device is still available, be sure to implement `async_remove_config_entry_device`.
This allows the user to delete the device from the device registry manually.

## Example implementation

In this example, we have a coordinator that fetches data from a service.
When the data is updated, we check if any devices have been removed.
If so, we remove them from the device registry.
This also causes all entities associated with the device to be removed.

`coordinator.py`
```python {13,20-30} showLineNumbers
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
        self.previous_devices: set[str] = set()

    async def _async_update_data(self) -> dict[str, MyDevice]:
        try:
            data = await self.client.get_data()
        except MyException as ex:
            raise UpdateFailed(f"The service is unavailable: {ex}")
        current_devices = set(data)
        if (stale_devices := self.previous_devices - current_devices):
            device_registry = dr.async_get(self.hass)
            for device_id in stale_devices:
                device = device_registry.async_get(identifiers={(DOMAIN, device_id)})
                if device:
                    device_registry.async_update_device(
                        device_id=device.id,
                        remove_config_entry_id=self.config_entry.entry_id,
                    )
            self.previous_devices = current_devices
        return data
```

To show a second example where someone can delete the device from the device registry manually, we implement `async_remove_config_entry_device` in `__init__.py`.
Having this function defined will enable the delete button on the device page in the UI.
In this example, the integration is only able to get updates for a device and not get a full list of connected devices, hence it can't automatically delete devices.
In `async_remove_config_entry_device`, we should implement a function that checks if the device is still available.
If it is not, we return `True` to allow the user to delete the device manually.
Here, we assume that the device is not working if we haven't got any updates for it in a while.

`__init__.py`
```python showLineNumbers
async def async_remove_config_entry_device(
    hass: HomeAssistant, config_entry: MyConfigEntry, device_entry: dr.DeviceEntry
) -> bool:
    """Remove a config entry from a device."""
    return not any(
        identifier
        for identifier in device_entry.identifiers
        if identifier[0] == DOMAIN
        and identifier[1] in config_entry.runtime_data.data
    )
```

## Additional resources

For more info on devices, checkout the [device registry documentation](../../../device_registry_index).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>