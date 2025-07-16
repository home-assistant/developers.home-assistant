---
title: "Mark entity unavailable if appropriate"
related_rules:
  - log-when-unavailable
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

If we can't fetch data from a device or service, we should mark it as unavailable.
We do this to reflect a better state, than just showing the last known state.

If we can successfully fetch data but are temporarily missing a few pieces of data, we should mark the entity state as unknown instead.

## Example implementation

Since there are many different ways this can be implemented, we will only provide the example for integrations using the coordinator and for entities updating via `async_update`.

### Example for integrations using the coordinator

In this example, we have an integration that uses a coordinator to fetch data.
The coordinator, when combined with a `CoordinatorEntity` has the logic for availability built-in.
If there is any extra availability logic needed, be sure to incorporate the `super().available` value.
In the sensor in the example, we mark the entity unavailable when the update fails, or when the data for that device is missing.

`coordinator.py`
```python {18} showLineNumbers
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
```python {6} showLineNumbers
class MySensor(SensorEntity, CoordinatorEntity[MyCoordinator]):

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return super().available and self.identifier in self.coordinator.data
```

### Example for entities updating via `async_update`

In this example, we have a sensor that updates its value via `async_update`.
If we can't fetch the data, we set the entity as unavailable using shorthand notation.
If we can fetch the data, we set the entity as available and update the value.

`sensor.py`
```python {7,9} showLineNumbers
class MySensor(SensorEntity):

    async def async_update(self) -> None:
        try:
            data = await self.client.get_data()
        except MyException as ex:
            self._attr_available = False
        else:
            self._attr_available = True
            self._attr_native_value = data.value
```

## Additional resources

For more information about managing integration state, see the [documentation](/docs/integration_fetching_data).

## Exceptions

If an integration has a way to turn on a device, either via a user-defined automation trigger or by automatically creating a secondary control channel (e.g., using Wake On Lan or Infra-Red blaster) - then the device should be reported as `off` when it is in standby and unresponsive to the main channel (e.g., TCP).
If no such method exists, and the device cannot be controlled in its current state, it should be reported as `unavailable`.

An example scenario, for a media player that enters standby mode and can only be turned on using an external device (e.g., an IR blaster):

- When first added to Home Assistant, and there's no active connection, the device will be shown as `unavailable`.
- If the user configures an automation (e.g., using an IR blaster) to turn it on, the device will be shown as `off` while in standby.
- Once turned on via the external method, and the main connection is established, the state will update to `on`.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>