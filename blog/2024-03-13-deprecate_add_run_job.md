---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Deprecating `async_run_job` and `async_add_job`"
---

`async_run_job` and `async_add_job` are deprecated and will be removed in Home Assistant 2025.4. This deprecation does not apply to the sync API `add_job` method, which is not planned to be removed.

Instead, its more efficient to use one of the other job methods, as the method of calling the job does not ever have to be worked out:

If the callable is a coroutine function running from a config entry:
`entry.async_add_background_task`, `entry.async_add_task`

If the callable is a coroutine function running from another place:
`hass.async_add_background_task`, `hass.async_add_task`

If the callable should run in the executor:
`hass.async_create_executor_job`
