---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Template helper function template.attach is deprecated"
---

With the merge of [core PR #89242](https://github.com/home-assistant/core/pull/124656), which landed in Home Assistant Core 2023.4, it's no longer necessary to call `template.attach` and the function is no longer used by core.

The function is now marked as deprecated, scheduled for removal in HA Core 2025.10.
