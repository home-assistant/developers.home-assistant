---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Deprecating `async_run_job` and `async_add_job`"
---

`async_run_job` and `async_add_job` are deprecated and will be removed in Home Assistant 2025.4. This deprecation does not apply to the sync API `add_job` method, which is not planned to be removed.

Instead, callables should be wrapped in `HassJob` and passed to `async_run_hass_job` or `async_add_hass_job.` The `hass_job` methods must only work out how to call the callable once.

When using the `run_job` variant, if the callable never changes, it's more efficient to use one of the other job methods, as the method of calling the job does not ever have to be worked out.

If the callable is a coroutine function running from a config entry:
`entry.async_add_background_task`, `entry.async_add_task`

If the callable is a coroutine function running from another place:
`hass.async_add_background_task`, `hass.async_add_task`

If the callable should run in the executor:
`hass.async_create_executor_job`