---
author: Joost Lekkerkerker
authorURL: https://github.com/joostlek
authorImageURL: https://avatars.githubusercontent.com/u/7083755?v=4
title: "Introducing entity translation placeholders"
---

It's now possible to provide static values to be used in an entity translation using placeholders.
You can pass placeholders via the `translation_placeholders` property of an entity.

An example sensor:
```python
class TestEntity(SensorEntity):
    """Example entity."""
    
    _attr_has_entity_name = True
    _attr_translation_key = "temperature"
    
    def __init__(self) -> None:
        """Initialize example entity."""
        self._attr_translation_placeholders = {"channel_id": "2"}
        self._attr_device_info = DeviceInfo(
            name="Example device"
        )
```
The `strings.json` file would look like:
```json
{
  "entity": {
    "sensor": {
      "temperature": {
        "name": "Temperature channel {channel_id}"
      }
    }
  }
}
```

The resulting entity would be called `Example device Temperature channel 2`.

A warning is logged once when a translation placeholder is expected but not provided by the entity.
When this happens on a system that is not on a stable version (dev, nightly, or beta), an error will be raised to be able to catch the mistakes quickly.

Please don't forget to be kind towards your translators, as they need to understand what kind of name or value will be passed in from the placeholder name ❤️.