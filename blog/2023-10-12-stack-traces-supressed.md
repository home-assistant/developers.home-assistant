---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
title: Stack traces of expected errors suppressed on stable versions of HomeAssistant.
---

The Home Assistant exception class `HomeAssistantError` and its subclasses are use to raise expected errors which means a stack trace is not warranted. Printing a stack trace is still very helpful during development though.

The change introduced in [core PR#101762](https://github.com/home-assistant/core/pull/101762) will avoid spamming users with stack traces that run stable releases of Home Assistant, while also not obstructing development.

### Potential future follow-up

Make it possible to enable logging stack trace for HomeAssistantError also on stable builds.
