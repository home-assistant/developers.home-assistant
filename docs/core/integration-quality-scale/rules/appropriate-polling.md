---
title: "If it's a polling integration, set an appropriate polling interval"
related_rules:
  - parallel-updates
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

In an ideal world, all integrations would have a push-based data interface, where the device or service would let us know when new data is available.
This would decrease the amount of requests Home Assistant would make.

However, in the real world, many devices and services are not capable of push-based communication, so we have to resort to polling.
To do this responsibly, we should set an appropriate polling interval that will serve the majority of users.

There is no real definition of what an appropriate polling interval is, as it depends on the device or service being polled.
For example, we should not poll an air quality sensor every 5 seconds, as the data will not change that often.
In those cases, more than 99% of the users will be fine with a polling interval of a minute or more.

To give another example, if we poll a cloud service for solar panel data where the data is updated every hour.
It would not make sense for us to poll every minute, as the data will not change between the polls.

For the users that do want to have more frequent updates, they can [define a custom polling interval](https://www.home-assistant.io/common-tasks/general/#defining-a-custom-polling-interval)

## Example implementation

There are two ways to set the polling interval.
Which one to use depends on how the integration polls for data.
When using an update coordinator, the polling interval can be set by setting the `update_interval` parameter or attribute in the coordinator.
When using the built-in entity update method, having set the `should_poll` entity attribute to `True`, the polling interval can be set by setting the `SCAN_INTERVAL` constant in the platform module.

`coordinator.py`:
```python {10} showLineNumbers
class MyCoordinator(DataUpdateCoordinator[MyData]):
    """Class to manage fetching data."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize coordinator."""
        super().__init__(
            hass,
            logger=LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=1),
        )
```

`sensor.py`:
```python {1} showLineNumbers
SCAN_INTERVAL = timedelta(minutes=1)

class MySensor(SensorEntity):
    """Representation of a Sensor."""

    _attr_should_poll = True
```

## Additional resources

More information about polling can be found in the [documentation](/docs/integration_fetching_data).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>