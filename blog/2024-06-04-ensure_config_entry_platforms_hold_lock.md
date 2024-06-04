---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: Ensuring config entries are not unloaded while their platforms are setting up.
---

Calling `hass.config_entries.async_forward_entry_setups` after a config entry has been loaded is deprecated and will stop working in Home Assistant 2025.1. Instead, call `hass.config.entries.async_late_forward_entry_setups`, which holds a lock to prevent the config entry from being unloaded while platforms are being set up.

Calling `hass.config_entries.async_forward_entry_setup` is deprecated and will be removed in Home Assistant 2025.6. It's crucial to update your code to ensure compatibility and efficiency. Instead, use the new functions:

await `hass.config_entries.async_forward_entry_setups` as it can load multiple platforms at once and is more efficient since it does not require a separate import executor job for each platform. `hass.config_entries.async_forward_entry_setups` must always be awaited to ensure that it finishes before the config entry setup is complete. For more details, review [this blog post](https://developers.home-assistant.io/blog/2022/07/08/config_entry_forwards).

- If platforms must be loaded late (after the config entry is set up), use `hass.config_entries.async_late_forward_entry_setup` instead.

Please note that the shorter deprecation period for not using `async_late_forward_entry_setups` since not holding the lock may require restarting Home Assistant to get an integration back into a functional state after it has been unloaded while platform setup was in progress.

