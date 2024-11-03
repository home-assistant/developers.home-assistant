---
author: epenet
authorURL: https://github.com/epenet
title: "New options flows properties, and deprecated OptionsFlowWithConfigEntry"
---

New helper properties have been added to the `OptionsFlow` to facilitate access to the config entry:
- `self._config_entry_id` gives you access to the ID of the config entry
- `self.config_entry` gives you access to the config entry
- `self.options` gives you access to a mutable copy of the config entry options

With the addition of these properties to the base `OptionsFlow`, setting `self.config_entry` or `self.options` property is deprecated and will fail from 2025.12.

Since the main purpose of the `OptionsFlowWithConfigEntry` class was to provide these two properties, it is also deprecated.

Custom components will need to be adjusted to drop references to `OptionsFlowWithConfigEntry`, and/or stop setting the value of `self.config_entry` / `self.options`. Most likely it is no longer needed to pass the config_entry to the flow initialiser.

Old code with `OptionsFlow` properties:
```
@staticmethod
@callback
def async_get_options_flow(
    config_entry: ConfigEntry,
) -> OptionsFlowHandler:
    """Create the options flow."""
    return OptionsFlowHandler(config_entry)

class OptionsFlowHandler(OptionsFlow):
    def __init__(self, config_entry: ConfigEntry) -> None:
        self.config_entry = config_entry
        self.options = dict(config_entry.options)
        self._conf_app_id: str | None = None
```

Old code with `OptionsFlowWithConfigEntry`:
```
@staticmethod
@callback
def async_get_options_flow(
    config_entry: ConfigEntry,
) -> OptionsFlowHandler:
    """Create the options flow."""
    return OptionsFlowHandler(config_entry)

class OptionsFlowHandler(OptionsFlowWithConfigEntry):
    def __init__(self, config_entry: ConfigEntry) -> None:
        super().__init__(config_entry)
        self._conf_app_id: str | None = None
```

New code:
```
@staticmethod
@callback
def async_get_options_flow(
    config_entry: ConfigEntry,
) -> OptionsFlowHandler:
    """Create the options flow."""
    return OptionsFlowHandler()

class OptionsFlowHandler(OptionsFlow):
    def __init__(self) -> None:
        self._conf_app_id: str | None = None
```

More details can be found in the [options flow](/docs/config_entries_options_flow_handler) documentation.
