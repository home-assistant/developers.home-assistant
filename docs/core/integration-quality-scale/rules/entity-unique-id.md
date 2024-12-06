---
title: "Entities have a unique ID"
related_rules:
  - unique-config-entry
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

In the past, entities weren't persisted.
Home Assistant didn't track which entities it knew from the past and which it did not.
To allow customizations to entities, like renaming the entity or changing the unit of measurement, Home Assistant needed a way to keep track of each individual entity across restarts.

To solve this, Home Assistant introduced the entity registry.
The entity registry is a central place where Home Assistant keeps track of all entities it knows about.
Each entity in the entity registry has a unique ID, which is unique per integration domain and per platform domain.

If an entity doesn't have a unique ID, the user has less control over the entity.
Thus, making sure that entities have a unique ID improves the user experience.

## Example implementation

In this example there is a temperature sensor that sets its unique ID using the shorthand notation.

`sensor.py`:
```python {6} showLineNumbers
class MySensor(SensorEntity):
    """Representation of a sensor."""

    def __init__(self, device_id: str) -> None:
        """Initialize the sensor."""
        self._attr_unique_id = f"{device_id}_temperature"
```

## Additional resources

More information about the requirements for a unique identifier can be found in the [documentation](/docs/entity_registry_index#unique-id-requirements).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>