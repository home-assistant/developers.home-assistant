---
title: "Entities are assigned an appropriate EntityCategory"
---

## Reasoning

Entities should be assigned an appropriate EntityCategory to ensure that they are correctly classified and can be easily identified, when the default category is inappropriate.
The entity category is used in, for example, auto-generated dashboards.

## Example implementation

In this example, we have a sensor that returns a diagnostic value.

`sensor.py`
```python {4} showLineNumbers
class MySensor(SensorEntity):
    """Representation of a sensor."""

    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, ...) -> None:
```

## Additional resources

To learn more about the registry properties, checkout the [documentation](/docs/core/entity#registry-properties) about it.

## Exceptions

There are no exceptions to this rule.
