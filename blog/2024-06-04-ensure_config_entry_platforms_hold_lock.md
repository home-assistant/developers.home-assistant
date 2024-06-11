---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: Forwarding setup to config entry platforms
---

Calling `hass.config_entries.async_forward_entry_setup` is deprecated and will be removed in Home Assistant 2025.6. Instead, await `hass.config_entries.async_forward_entry_setups` as it can load multiple platforms at once and is more efficient since it does not require a separate import executor job for each platform.

`hass.config_entries.async_forward_entry_setups` must always be awaited to ensure that it finishes before the config entry setup is complete. For more details, review [this blog post](https://developers.home-assistant.io/blog/2022/07/08/config_entry_forwards).
