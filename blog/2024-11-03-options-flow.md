---
author: epenet
authorURL: https://github.com/epenet
title: "New properties for options flows, and deprecated OptionsFlowWithConfigEntry"
---

New helper properties have been added to the `OptionsFlow` to facilitate access to the config entry:
- `self._config_entry_id` gives you access to the ID of the config entry
- `self.config_entry` gives you access to the config entry
- `self.options` gives you access to a mutable copy of the config entry options

With the addition of these properties to the base `OptionsFlow`, setting `self.config_entry` or `self.options` is deprecated and will fail from 2025.12.

Since the main purpose of the `OptionsFlowWithConfigEntry` class was to provide these two properties, it is also deprecated.

More details can be found in the [options flow](/docs/config_entries_options_flow_handler) documentation.
