---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Waiting for config entry platforms"
---

Before 2022.8, it was impossible to `await` config entry platforms forwards without a deadlock if one of the platforms loaded by the config entry was not already loaded.

Integrations need to be refactored to replace calls to `hass.config_entries.async_setup_platforms` with `hass.config_entries.async_forward_entry_setups` and/or await all `hass.config_entries.async_forward_entry_setup` to ensure that Home Assistant does not inadvertently reload the integration while entities and platforms are still being set up.

`hass.config_entries.async_setup_platforms` is scheduled to be removed in 2022.12.