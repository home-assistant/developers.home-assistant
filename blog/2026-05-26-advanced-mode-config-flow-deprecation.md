---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Deprecation of advanced mode in data entry flow"
---

## Summary

User profile [advanced mode is going away](https://github.com/OpenHomeFoundation/roadmap/issues/54), one implication of this is that the `FlowHandler.show_advanced_options` property has been deprecated and will be removed with the release of Home Assistant Core 2027.6.
During the deprecation period, `FlowHandler.show_advanced_options` unconditionally returns `True` to not make options gated by this flag inaccessible to users.

Integrations authors need to update integrations to use an alternative user friendly way to present additional options in the UI, for example a section.

## Background

The Advanced mode toggle in the user profile is a single binary switch that gates a collection of unrelated features across Home Assistant, from app (add-on) visibility (Terminal & SSH) to configuration options and UI elements, and we've been working on removing it during the past year.

For a more in-depth explanation, see [roadmap issue #54](https://github.com/OpenHomeFoundation/roadmap/issues/54).
