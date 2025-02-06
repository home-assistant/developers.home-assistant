---
title: "Integration disables less popular (or noisy) entities"
related_rules:
  - appropriate-polling
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Home Assistant keeps track of how the states of entities changes.
This is done to be able to show the history of the entity in the UI.
Every state that is tracked takes up a bit of resources.
Entities that change state a lot (noisy entities), do this more often than entities that change state less often.

We consider it a good practice to disable less popular or noisy entities by default.
If users have a use case for such an entity, they can enable it.
This way users that don't have a use case for the entity, don't have to pay the cost of tracking the state of the entity.

There is no hard rule on what is considered a popular entity, since that depends on the integration and the device.
So for example, a bluetooth temperature sensor can have an entity that represents the signal strength of the device.
This entity is not very useful for most users, so it should be disabled by default.
While if there was an integration providing a device to measure signal strength, that entity would be useful for most users and should be enabled by default.

## Example implementation

In the example below, the entity is disabled by default.

`sensor.py`
```python {8} showLineNumbers
class MySignalStrengthSensor(SensorEntity):
    """Representation of a sensor."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_device_class = SensorDeviceClass.SIGNAL_STRENGTH
    _attr_native_unit_of_measurement = SIGNAL_STRENGTH_DECIBELS_MILLIWATT
    _attr_entity_registry_enabled_default = False

    def __init__(self, device: Device) -> None:
        """Initialize the sensor."""
        ...
```

## Additional resources

To learn more about the entity registry properties, checkout the [documentation](/docs/core/entity#registry-properties) about it.

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>