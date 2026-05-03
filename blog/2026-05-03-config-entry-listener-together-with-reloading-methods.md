---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "The use of config entry listener with reloading methods in config flow"
---

As of Home Assistant Core 2025.6, the use of a config entry listener in combination with using any reloading methods in a config flow has been deprecated, and from 2025.11 will result in an error.

## Background

Using a config entry listener which can reload the integration in combination with any of the reloading methods in a config flow makes the integration reload twice and it can create a race condition.

## Alternatives how to solve

- Remove the config entry listener and rely only on reloading methods in your config flow
- Instead of `async_update_reload_and_abort()` use `async_update_and_abort()`
- When using `_abort_if_unique_id_configured()` use it with the parameter `reload_on_update=False`


More details can be found in the [core PR](https://github.com/home-assistant/core/pull/169198).
