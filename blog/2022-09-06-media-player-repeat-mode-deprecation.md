---
author: epenet
authorURL: https://github.com/epenet
title: "Deprecating Repeat Mode constants in media player"
---

As of Home Assistant Core 2022.10, all `REPEAT_MODE*` constants for media player are deprecated:

  - `REPEAT_MODE_ALL`
  - `REPEAT_MODE_OFF`
  - `REPEAT_MODE_ONE`
  - `REPEAT_MODES`

  Use the new `RepeatMode` enum instead.
