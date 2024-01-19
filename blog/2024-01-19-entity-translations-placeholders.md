---
author: Joost Lekkerkerker
authorURL: https://github.com/joostlek
authorImageURL: https://avatars.githubusercontent.com/u/7083755?v=4
title: "Introducing entity translation placeholders"
---

It's now possible to provide static values to be used in an entity translation via the use of placeholders.
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

In the case when a translation placeholder was expected but not provided by the entity a warning is logged once.
When this happens on a system that is not on a stable version (dev, nightly or beta) an error will be raised to be able to catch errors quickly.

Please don't forget to be kind towards your translators, as they need to be able to understand what kind of name or value will be passed in from the placeholder name ❤️.