---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Updated guidelines for helper integrations linking to other integration's device"
---

Helper integrations should not add their own config entries to the source entity's device or to a user selected device. Instead, they should just link their entities to the device of the source entity.

Adding the helper config entry to another integration's device is no longer supported and will stop working in Home Assistant Core 2026.8.

### Background

The architecture proposal [home-assistant/architecture#1226](https://github.com/home-assistant/architecture/discussions/1226) limits devices to a single config entry. This is not an issue for most integrations, but helper integrations with config flows are an exception.

### Suggested change

#### Do not add the helper config entry to the source device directly

Do not add the config entry to the source device directly, it means this pattern is no longer allowed
```py
device_registry.async_update_device(
    source_device.id,
    add_config_entry_id=helper_config_entry.entry_id,
)
```

#### Do not add the helper config entry to the source device implicitly

Set `self.device_entry` in the helper entity to link the helper entity to the correct device; don’t set `self._attr_device_info` and don’t override `device_info` as that will mean the helper config entry is added to the source device.

#### Cleaning up the device registry

A helper function, `homeassistant.helpers.helper_integration.async_remove_helper_config_entry_from_source_device` is available to aid the clean up.

#### Sample implementations

The derivative core integration, which previously added its config entry to the source entity's device, has been updated to just link the helper entity to the source entity's device in core [PR #148674](https://github.com/home-assistant/core/pull/148674).

The template core integration, which previously added its config entry to a user selected device, has been updated to just link the helper entity to the user selected device in core [PR #148756](https://github.com/home-assistant/core/pull/148756).
