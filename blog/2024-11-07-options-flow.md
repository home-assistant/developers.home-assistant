---
author: epenet
authorURL: https://github.com/epenet
title: "New options flows properties"
---

New helper properties have been added to the `OptionsFlow` to facilitate access to the config entry:
- `self._config_entry_id` gives you access to the ID of the config entry
- `self.config_entry` gives you access to the config entry

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

The main purpose of the `OptionsFlowWithConfigEntry` class was to provide `self.config_entry` property, and it is recommended to avoid using it in new code.

Custom components that wish to drop references to `OptionsFlowWithConfigEntry` may need further code adjustments if there are references to `self.options`:
- if you are only reading the options values, then it is recommended that you adjust the reads to `self.config_entry.options` (see https://github.com/home-assistant/core/pull/129895)
- if you are updating/mutating the options values inside a single step, then it may be necessary to first clone the options (`options = deepcopy(dict(self.config_entry.options))` (see https://github.com/home-assistant/core/pull/129928)
- if you are updating/mutating the options values through multiple step, then it may be necessary to clone the options inside the class initialisation (`self.options = deepcopy(dict(config_entry.options))` (see https://github.com/home-assistant/core/pull/129890)

More details can be found in the [options flow](/docs/config_entries_options_flow_handler) documentation.
