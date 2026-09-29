---
title: "Integration platforms"
sidebar_label: "Platforms"
---

Home Assistant has various built-in integrations that abstract device types. There are [lights](core/entity/light.md), [switches](core/entity/switch.md), [covers](core/entity/cover.md), [climate devices](core/entity/climate.md), and [many more](core/entity.md). Your integration provides entities to these by adding a platform for each entity type it supports.

To add a platform, create a file named after the entity type in your integration folder. To provide a light, add a `light.py`; to provide a sensor, add a `sensor.py`, and so on.

Each platform file implements an `async_setup_entry` function that creates the entities for a config entry. Your integration forwards its config entry to those platforms from its own `async_setup_entry`:

```python
PLATFORMS = [Platform.LIGHT, Platform.SENSOR]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the integration from a config entry."""
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True
```

See [config entries](config_entries_index.md#for-platforms) for the full platform setup and unload flow. The [`detailed_hello_world_push`](https://github.com/home-assistant/example-custom-config/tree/master/custom_components/detailed_hello_world_push/) example integration shows this in practice, forwarding to a `sensor` and a `cover` platform.

### Interfacing with devices

One Home Assistant rule is that the integration should never interface directly with devices. Instead, it should interact with a third-party Python 3 library. This way, Home Assistant can share code with the Python community and keep the project maintainable.

Once you have your Python library [ready and published to PyPI](api_lib_index.md), add it to the [manifest](creating_integration_manifest.md). It will now be time to implement the Entity base class that is provided by the integration that you are creating a platform for.

Find your integration at the [entity index](core/entity.md) to see what methods and properties are available to implement.
