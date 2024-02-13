---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: Altering config entries
---

Starting from Home Assistant 2024.3, modifications to a `ConfigEntry` should use `hass.config_entries.async_update_entry`.
Directly setting attributes on the `ConfigEntry` object is deprecated and will start to fail in version 2024.10 and later.
There is no deprecation period for directly setting `unique_id` on the `ConfigEntry` as doing so will corrupt the internal state, and doing so will start to fail immediately.

The following attributes must now be set via `hass.config_entries.async_update_entry`:

- data
- minor_version
- options
- pref_disable_new_entities
- pref_disable_polling
- title
- unique_id
- version

Tests must ensure that `MockConfigEntry` objects are added to Home Assistant via `entry.add_to_hass(hass)` before calling `hass.config_entries.async_update_entry`.