---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Updated guidelines for helper integrations linking to other integration's device"
---

Helper integrations should not add their own config entries to the source entity's device or to a user selected device. Instead, they should just link their entities to the device of the source entity.

Adding the helper config entry to another integration's device is no longer supported and will stop working in Home Assistant Core 2026.8.

### Background

The architecture proposal [home-assistant/architecture#1226](https://github.com/home-assistant/architecture/discussions/1226) makes device connections and identifiers unique per integration domain instead of globally unique. This is not an issue for most integrations, but helper integrations with config flows are an exception.

### Suggested change

#### Link the helper entity directly to the source integration's device

In the helper entity's constructor, set `self.device_entry` to the source device
```py
class HelperEntity(Entity)

    def __init__(hass: HomeAssistant, source_entity_id: str, ...) -> None:
        self.device_entry = async_entity_id_to_device(
            hass,
            source_entity_id,
        )
```

#### Do not add the helper config entry to the source device directly

Do not add the config entry to the source device directly, meaning that this pattern is no longer allowed
```py
device_registry.async_update_device(
    source_device.id,
    add_config_entry_id=helper_config_entry.entry_id,
)
```

#### Do not add the helper config entry to the source device implicitly

Don’t set `self._attr_device_info` and don’t override `device_info` to return identifiers and connections for a device from another integration as that will mean the helper config entry is added to the source device. Instead, Set `self.device_entry` in the helper entity to link the helper entity to another integration's device as in the example above.

#### Cleaning up the device registry

A helper function, `homeassistant.helpers.helper_integration.async_remove_helper_config_entry_from_source_device` is available to aid the clean up. Core integrations have been modified to call this helper from a config entry migration step.

#### Handling removed devices

It is up to the helper integration to decide how to handle a removed device; most core helpers set `self.device_entry` to `None`. Note that `DeviceRegistry.async_get` returns `None` if passed a `device_id` which doesn't exist.

#### Sample implementations

The derivative core integration, which previously added its config entry to the source entity's device, has been updated to just link the helper entity to the source entity's device in core [PR #148674](https://github.com/home-assistant/core/pull/148674).

The template core integration, which previously added its config entry to a user selected device, has been updated to just link the helper entity to the user selected device in core [PR #148756](https://github.com/home-assistant/core/pull/148756).
