---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "The media player STANDBY state is deprecated"
---

The media player state `MediaPlayerState.STANDBY` has been deprecated as decided in [home-assistant/architecture#799](https://github.com/home-assistant/architecture/discussions/799) and will be removed in Home Assistant Core 2026.8.
Integrations should use `MediaPlayerState.IDLE` or `MediaPlayerState.OFF` instead.

For more details, see the [media player developer documentation](/docs/core/entity/media-player#states).
