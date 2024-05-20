---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: Handling time zones without blocking the event loop
---

Constructing `ZoneInfo` objects may do blocking I/O to load the zone info from disk if the timezone passed is not in the cache.

`dt_util.async_get_time_zone` is now available to replace `dt_util.get_time_zone` to fetch a time zone in the event loop which is async safe and will not do blocking I/O in the event loop.

`hass.config.set_time_zone` is deprecated and replaced with `hass.config.async_set_time_zone`. `hass.config.set_time_zone` will be removed in 2025.6. Setting the time zone only affects tests, as no integration should be calling this function in production. 

Examining `dt_util.DEFAULT_TIME_ZONE` directly is deprecated and `dt_util.get_default_time_zone()` should be used instead.

If your integration needs to construct `ZoneInfo` objects in the event loop, it is recommended to use the [`aiozoneinfo` library](https://pypi.org/project/aiozoneinfo/).