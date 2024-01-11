---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "Changes to FlowManager.async_show_progress"
---

`FlowHandler.async_show_progress` has a new argument `progress_task`.

If `progress_task` is passed, `FlowManager` will:
- Send an event to fronted once the task has finished
- Cancel the `progress_task` if the user closes the config flow dialog before the task is done

This means derived classes are no longer responsible for interaction between the progress task state and the UI.

`FlowHandler.async_show_progress` will log a warning if it's called without a `progress_task`. In a Home Assistant code release 2024.8, the call will instead fail.

More details can be found in the [documentation](/docs/data_entry_flow_index/#show-progress--show-progress-done) and in [core PR #107668](https://github.com/home-assistant/core/pull/107668).
