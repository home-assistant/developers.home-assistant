---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: New device class selector
---
[Selectors](https://www.home-assistant.io/docs/blueprint/selectors/) has been expanded and now also includes a `DeviceClassSelector`.

Using this in [config flows](/docs/data_entry_flow_index#show-form) will allow frontend to automatically translate device classes into the proper names.

This means that the `SelectSelector` should not be used anymore to select device classes. When the selector is replaced, stale translations should be removed.

Example:

```python
vol.Schema(
    {
        vol.Optional(CONF_DEVICE_CLASS): DeviceClassSelector(
            DeviceClassSelectorConfig(
                domain=Platform.SENSOR,
            )
        ),
    }
)
```
