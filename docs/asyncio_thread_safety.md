---
title: "Thread Safety with asyncio"
---

Developing with asyncio requires careful attention to thread safety, as nearly all asyncio objects are not thread-safe. If you are just getting started with asyncio, review Python's documentation on [Developing with asyncio](https://docs.python.org/3/library/asyncio-dev.html) for tips to avoid pitfalls. 

Home Assistant has its conventions for deciding how to run a function based on whether it is decorated with `@callback`; for more details, see [Working with Async](asyncio_working_with_async.md). 

Be sure to enable [`asyncio` debug mode](https://docs.python.org/3/library/asyncio-dev.html#debug-mode) and [Home Assistant's built-in debug mode](https://www.home-assistant.io/integrations/homeassistant/#debug) during development as many thread safety errors can be detected automatically.

## Solving thread safety errors

You may have reached this page because Home Assistant detected and reported a thread safety error. Beginning in version 2024.5.0, Home Assistant can detect, report, and block some non-threaded operations to prevent system instability. Before the Home Assistant could detect these errors, they may have led to unexpected restarts or undefined behaviors, as they can corrupt the internal asyncio state. Below are some tips on how to correct non-threaded operations.

### hass.async_create_task

`hass.async_create_task` should only be called from the event loop thread. When creating a task from another thread, instead use `hass.create_task`