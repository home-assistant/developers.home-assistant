---
author: epenet
authorURL: https://github.com/epenet
title: "New options flow properties"
---

### Summary of changes
New helper properties have been added to the `OptionsFlow`:
- `self._config_entry_id` provides the config entry ID
- `self.config_entry` returns the config entry

### Backwards compatibility
Until Home Assistant Core 2025.12, it is possible to set `self.config_entry` manually, but doing so will log a warning asking users to open an issue on the custom integration's bug tracker.

New code:
```python
@staticmethod
@callback
def async_get_options_flow(
    config_entry: ConfigEntry,
) -> OptionsFlowHandler:
    """Create the options flow."""
    return OptionsFlowHandler()

class OptionsFlowHandler(OptionsFlow):
    """Options flow handler."""

    def __init__(self) -> None:
        """Initialize options flow."""
        self._conf_app_id: str | None = None
```

Old code with `OptionsFlow` properties:
```python
@staticmethod
@callback
def async_get_options_flow(
    config_entry: ConfigEntry,
) -> OptionsFlowHandler:
    """Create the options flow."""
    return OptionsFlowHandler(config_entry)

class OptionsFlowHandler(OptionsFlow):
    """Options flow handler."""

    def __init__(self, config_entry: ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry
        self._conf_app_id: str | None = None
```

### Special handling of OptionsFlowWithConfigEntry
The main purpose of the `OptionsFlowWithConfigEntry` class was to provide `self.config_entry` property, which is now already provided by the parent class.
There are currently no plans to remove the `OptionsFlowWithConfigEntry` class, but it is kept for backward compatibility only and it should be avoided in new code.

Custom integrations that wish to drop references to `OptionsFlowWithConfigEntry` will need to consider how they are referencing `self.options`:
- if `self.options` is not referenced, then the migration to `OptionsFlow` is straightforward (see [PR #129651](https://github.com/home-assistant/core/pull/129651))
- if you are only reading the options values, then it is recommended that you adjust the reads to `self.config_entry.options` (see [PR #129895](https://github.com/home-assistant/core/pull/129895))
- if you are updating/mutating the options values inside a single step, then it may be necessary to first copy the options (`options = deepcopy(dict(self.config_entry.options))` (see [PR #129928](https://github.com/home-assistant/core/pull/129928))
- if you are updating/mutating the options values through multiple step, then it may be necessary to copy the options inside the class initialisation (`self.options = deepcopy(dict(config_entry.options))` (see [PR #129890]( https://github.com/home-assistant/core/pull/129890))

More details can be found in the [options flow](/docs/config_entries_options_flow_handler) documentation.
