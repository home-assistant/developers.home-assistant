---
author: epenet
authorURL: https://github.com/epenet
title: "New properties for options flows, and deprecated OptionsFlowWithConfigEntry"
---

New helper properties have been added to the `OptionsFlow` to facilitate access to the config entry:
- `self._config_entry_id` gives you access to the ID of the config entry
- `self.config_entry` gives you access to the config entry
- `self.options` gives you access to a mutable copy of the config entry

With the addition of these properties to the base `OptionsFlow`, inheriting `OptionsFlowWithConfigEntry` is also deprecated.
