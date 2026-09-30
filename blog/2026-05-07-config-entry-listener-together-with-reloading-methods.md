---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Deprecating config entry listener with reloading methods in config flow"
---

As of Home Assistant Core 2026.6, using a config entry listener together with any reloading methods in a config flow is deprecated and will result in an error from 2026.12.

## Background

Using a config entry listener together with any reloading methods in a config flow can cause the integration to reload twice and/or create a race condition.

## Possible solutions

- Remove the config entry listener and rely only on the reloading methods in your config flow.
- Use `async_update_and_abort()` instead of `async_update_reload_and_abort()`.
- Set `reload_on_update=False` when calling `_abort_if_unique_id_configured()`.

More details can be found in the [core PR](https://github.com/home-assistant/core/pull/169198).
