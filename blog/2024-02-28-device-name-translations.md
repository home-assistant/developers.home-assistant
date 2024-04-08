---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Introducing device name translations"
---

It's now possible to provide translations for device names, including support for
static values to be used as placeholders.

An example sensor with a translated device name:
```python
class TestEntity(SensorEntity):
    """Example entity."""
    
    _attr_has_entity_name = True
    
    def __init__(self) -> None:
        """Initialize example entity."""
        self._attr_device_info = DeviceInfo(
            translation_key="n_ch_power_strip",
            translation_placeholders={"number_of_sockets": "2"},
        )
```
The `strings.json` file would look like:
```json
{
  "device": {
    "n_ch_power_strip": {
      "name": "Power strip with {number_of_sockets} sockets"
    }
  }
}
```

The resulting device would be called `Power strip with 2 sockets`.

A warning is logged when a translation placeholder is expected but not provided by the device.
When this happens on a system that is not on a stable version (dev, nightly, or beta), an error will be raised to be able to catch the mistakes quickly.

Please don't forget to be kind towards your translators, as they need to understand what kind of name or value will be passed in from the placeholder name ❤️.