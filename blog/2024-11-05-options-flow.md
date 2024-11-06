---
author: epenet
authorURL: https://github.com/epenet
title: "New options flows properties, and deprecated OptionsFlowWithConfigEntry"
---

New helper properties have been added to the `OptionsFlow` to facilitate access to the config entry:
- `self._config_entry_id` gives you access to the ID of the config entry
- `self.config_entry` gives you access to the config entry

With the addition of these properties to the base `OptionsFlow`, setting `self.config_entry` property is deprecated and will fail from 2025.12.

Since the main purpose of the `OptionsFlowWithConfigEntry` class was to provide this property, it is also deprecated.

Custom components will need to be adjusted to drop references to `OptionsFlowWithConfigEntry`, and/or stop setting the value of `self.config_entry`. Most likely it is no longer needed to pass the config_entry to the flow initialiser.

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

Old code with `OptionsFlowWithConfigEntry`:
```python
@staticmethod
@callback
def async_get_options_flow(
    config_entry: ConfigEntry,
) -> OptionsFlowHandler:
    """Create the options flow."""
    return OptionsFlowHandler(config_entry)

class OptionsFlowHandler(OptionsFlowWithConfigEntry):
    """Options flow handler."""

    def __init__(self, config_entry: ConfigEntry) -> None:
        """Initialize options flow."""
        super().__init__(config_entry)
        self._conf_app_id: str | None = None
```

More details can be found in the [options flow](/docs/config_entries_options_flow_handler) documentation.
