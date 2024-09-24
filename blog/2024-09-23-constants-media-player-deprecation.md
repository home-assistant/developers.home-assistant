---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Start deprecating constants for Media player"
---

As of Home Assistant Core 2022.5, the feature flag constants used in `MediaPlayerEntity` were deprecated and replaced by the `MediaPlayerEntityFeature` enum. Later, in 2022.10, the repeat mode, media type, and media class constants were deprecated and replaced by `RepeatMode`, `MediaType`, and `MediaClass`, respectively.

However, no proper deprecation was done, so we start the one-year deprecation period in 2024.10, and the constants will stop working from 2025.10 to ensure all custom integration authors have time to adjust.
