---
title: "Entities use has_entity_name = True"
related_rules:
  - entity-translations
  - entity-device-class
  - devices
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

`has_entity_name` is an entity attribute that is used to improve the naming of entities in Home Assistant.
It is introduced to show a better name of the entity to the user depending on the context where the name is shown.

We consider this a good practice because it allows for consistency in naming between integrations.

## Example implementation

In the example below, if the name of the device is "My device" and the field is "temperature", the name of the entity will be shown as "My device temperature".

`sensor.py`
```python {4} showLineNumbers
class MySensor(SensorEntity):
    """Representation of a sensor."""

    _attr_has_entity_name = True

    def __init__(self, device: Device, field: str) -> None:
        """Initialize the sensor."""
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, device.id)},
            name=device.name,
        )
        self._attr_name = field
```

However, when the name of the entity is set to `None`, the name of the device will be used as the name of the entity.
In this case, the lock entity will just be called "My device".
This should be done for the main feature of the device.

`lock.py`
```python {4-5,11} showLineNumbers
class MyLock(LockEntity):
    """Representation of a lock."""

    _attr_has_entity_name = True
    _attr_name = None

    def __init__(self, device: Device) -> None:
        """Initialize the lock."""
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, device.id)},
            name=device.name,
        )
```

## Additional resources

More information about entity naming can be found in the [entity](/docs/core/entity#has_entity_name-true-mandatory-for-new-integrations) documentation.
More information about devices can be found in the [device](/docs/device_registry_index) documentation.

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>