---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Deprecation of the home_assistant_start flag of async_initialize_triggers"
---

The dedicated `home_assistant_start` flag of `async_initialize_triggers` is deprecated and will be removed in Home Assistant Core 2027.8. During the deprecation period the parameter no longer has any effect.

The flag existed because the `homeassistant` start trigger was a pseudo trigger: instead of acting like a real trigger, it relied on the caller of the trigger API passing `home_assistant_start=True` so that `async_initialize_triggers` would fire the trigger during startup.

The start trigger has been rewritten to work as a real trigger, so the flag is no longer needed. Callers of `async_initialize_triggers` should simply stop passing `home_assistant_start`.

To make the new implementation possible, the rewrite adds `HomeAssistant.async_add_startup_job`, which registers a job to be called after all listeners to `EVENT_HOMEASSISTANT_START` have executed, but before `EVENT_HOMEASSISTANT_STARTED` is fired. This mirrors the approach already used for the homeassistant shutdown trigger, and avoids adding yet another core state and event to the already complex relationship between core states and events.

For more details, see [core PR 175160](https://github.com/home-assistant/core/pull/175160).
