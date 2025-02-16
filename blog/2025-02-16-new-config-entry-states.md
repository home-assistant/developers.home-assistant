---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changed config entry state transitions"
---

Config entry state transitions when unloading and removing entries has been modified:

- A new state `ConfigEntryState.UNLOAD_IN_PROGRESS` is added, which is set before the integration's `async_unload_entry` is called
  Rationale:
    - Make it easier to write cleanup code which should run after the last config entry has been unloaded
    - Improve debugging of issues related to reload and unload of config entries

- The config entry state is set to to `ConfigEntryState.FAILED_UNLOAD` when the integration's `async_unload_entry` returns False
  Rationale: If `async_unload_entry`, we can't assume the integration is still loaded, most likely it has partially unloaded itself, especially considering this is the pattern we recommend:
  ```py
  async def async_unload_entry(hass: HomeAssistant, entry: MyConfigEntry) -> bool:
    """Unload a config entry."""
    # async_unload_platforms returns False if at least one platform did not unload
    if (unload_ok := await hass.config_entries.async_unload_platforms(entry, PLATFORMS))
        entry.runtime_data.listener()
    # Finish cleanup not related to platforms
    return unload_ok
    ```

- The config entry is removed from `hass.config_entries` before call the integration's `async_remove_entry` is called
  Rationale:
    - Make it easier to write cleanup code which should run after the last config entry has been removed

Custom integration authors need to review and update their integrations' `async_unload_entry` and `async_remove_entry` if needed.
The most common pattern which requires an update is this:

```python
async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    loaded_entries = [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.state == ConfigEntryState.LOADED
    ]
    if len(loaded_entries) == 1:
        # The last config entry is being unloaded, release shared resources, unregister services etc.
        ...
```

This can now be simplified, if the custom integration's minimum Home Assistant version is set to 2025.3.0:
```python
async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    if not hass.config_entries.async_loaded_entries(DOMAIN):
        # The last config entry is being unloaded, release shared resources, unregister services etc.
        ...
```


If the custom integrations needs to be backwards compatible with previous releases of Home Assistant Core:
```python
async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    other_loaded_entries = [
        _entry
        for _entry in hass.config_entries.async_loaded_entries(DOMAIN)
        if _entry.entry_id != entry.entry_id
    ]
    if not other_loaded_entries:
        # The last config entry is being unloaded, release shared resources, unregister services etc.
        ...
```

The [config entry documentation](docs/config_entries_index) is updated.

The [home assistant core PR #138522](https://github.com/home-assistant/core/pull/138522) gives more background.
