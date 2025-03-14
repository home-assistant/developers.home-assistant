---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changed implementation of media player toggle"
---

The implementation of the toggle action service has been adjusted in the media player base class,
the media player will be turned on if it is in states `off` or `standby`, otherwise it will be
turned on.

Before this change, the media player would also be turned on if it was in state `idle`.

Custom integrations which have overridden the `async_toggle` may need to update their implementations.

The change is introduced in the [home assistant core PR #78192](https://github.com/home-assistant/core/pull/78192).
