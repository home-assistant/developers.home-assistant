---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Utility function homeassistant.util.dt.utc_to_timestamp is deprecated"
---

The utility function `homeassistant.util.dt.utc_to_timestamp` is deprecated and will be removed in Home Assistant Core 2026.1, custom integrations which call it should instead call the stdlib method `datetime.datetime.timestamp()`

The reason for deprecation is that the stdlib method is just as fast as the utility function.

More details can be found in the [core PR](https://github.com/home-assistant/core/pull/131787).