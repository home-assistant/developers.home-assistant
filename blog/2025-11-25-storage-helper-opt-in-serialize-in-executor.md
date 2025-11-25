---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Serialization of Store data in worker thread is now opt-in"
---

The `Store` class from `homeassistant/helpers/storage.py` accepts a new constructor argument `serialize_in_event_loop`

If `serialize_in_event_loop` is `True` (the default):
 - The `data_func` passed to `Store.async_delay_save` is called from the event loop
 - Data produced by `data_func` passed to `Store.async_delay_save` is serialized to JSON in the event loop
 - Data passed to `Store.async_save` is serialized to JSON in the event loop

If `serialize_in_event_loop` is `False`:
 - The `data_func` passed to `Store.async_delay_save` is called from a separate thread, which means it must be thread safe and must not access the hass object
 - Data produced by `data_func` passed to `Store.async_delay_save` is serialized to JSON in a separate thread, which means it must be thread safe
 - Data passed to `Store.async_save` is serialized to JSON in a separate thread, which means it must be thread safe

The behavior has changed; `data_func` passed to `Store.async_delay_save` was previously always called from a separate thread and data produced by it or data passed to `Store.async_save` was previously always serialized by a separate thread.

The reason for the change is that it was not documented that `data_func` would be called by a thread other than the event loop or that JSON serialization would happen in a thread other than the event loop, and the `data_func` and data produced by it or passed to `Store.async_save` was generally not thread safe.

For more details, see [core PR 157158](https://github.com/home-assistant/core/pull/157158) and [core PR 157263](https://github.com/home-assistant/core/pull/157263).
