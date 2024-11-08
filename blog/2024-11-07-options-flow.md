---
author: epenet
authorURL: https://github.com/epenet
title: "New options flows properties"
---

New helper properties have been added to the `OptionsFlow`:
- `self._config_entry_id` provides the config entry ID
- `self.config_entry` returns the config entry

With the addition of these properties to the base `OptionsFlow`, setting `self.config_entry` property is deprecated and will fail from 2025.12.

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

Furthermore, the main purpose of the `OptionsFlowWithConfigEntry` class was to provide `self.config_entry` property, and it is recommended to avoid using it in new code.

Custom components that wish to drop references to `OptionsFlowWithConfigEntry` may need further code adjustments if there are references to `self.options`:
- if you are only reading the options values, then it is recommended that you adjust the reads to `self.config_entry.options` (see [PR #129895](https://github.com/home-assistant/core/pull/129895))
- if you are updating/mutating the options values inside a single step, then it may be necessary to first copy the options (`options = deepcopy(dict(self.config_entry.options))` (see [PR #129928](https://github.com/home-assistant/core/pull/129928))
- if you are updating/mutating the options values through multiple step, then it may be necessary to copy the options inside the class initialisation (`self.options = deepcopy(dict(config_entry.options))` (see [PR #129890]( https://github.com/home-assistant/core/pull/129890))

More details can be found in the [options flow](/docs/config_entries_options_flow_handler) documentation.
