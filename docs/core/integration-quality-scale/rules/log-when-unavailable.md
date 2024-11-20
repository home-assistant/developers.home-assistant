---
title: "If internet/device/service is unavailable, log once when unavailable and once when back connected (IQS009)"
related_rules:
  - entity-unavailable
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

When a device or service is not reachable, the entities will usually go to unavailable.
To allow the user to find out why this is happening, the integration should log when this happens.
Be sure to log only once in total to avoid spamming the logs.

When the device or service is reachable again, the integration should log that as well.
This can prove useful for using the logs to find out when the device or service was unavailable and when it was back online.

:::info
Logging should happen at `info` level.
:::

## Example implementation

Since there are many different ways this can be implemented, we will only provide the example for integrations using the coordinator and for entities updating via `async_update`.

### Example for integrations using the coordinator

In this example, we have an integration that uses a coordinator to fetch data.
The coordinator has the logic for logging once built in.
The only thing that you need to do in the coordinator is to raise `UpdateFailed` when the device or service is unavailable.

`coordinator.py`
```python {18} showLineNumbers
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
    
    async def _async_update_data(self) -> MyData:
        try:
            return await self.client.get_data()
        except MyException as ex:
            raise UpdateFailed(f"The device is unavailable: {ex}")
```

### Example for entities updating via `async_update`

In this example, we have a sensor that updates its value via `async_update`.
The example will log when the sensor is unavailable and log when the sensor is back online.
Note that an instance attribute is used to track if the message has been logged to avoid spamming the logs.

`sensor.py`
```python {10-12,16-18} showLineNumbers
class MySensor(SensorEntity):

    _unavailable_logged: bool = False

    async def async_update(self) -> None:
        try:
            data = await self.client.get_data()
        except MyException as ex:
            self._attr_available = False
            if not self._unavailable_logged:
                _LOGGER.info("The sensor is unavailable: %s", ex)
                self._unavailable_logged = True
        else:
            self._attr_available = True
            self._attr_native_value = data.value
            if self._unavailable_logged:
                _LOGGER.info("The sensor is back online")
                self._unavailable_logged = False
```

## Additional resources

For more information about managing integration state, see the [documentation](../../../integration_fetching_data)

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>
