---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Deprecating `async_add_hass_job`"
---

As part of an effort to improve performance and simplify the core job API, `async_add_hass_job` is deprecated and will be removed from Home Assistant in 2025.5.

Calls should be replaced with `async_run_hass_job` instead.