---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Deprecating state constants for lock"
---

As of Home Assistant Core 2024.10, the constants used as returning state in `LockEntity` is deprecated and replaced by the `LockState` enum.

There is a one-year deprecation period, and the constants will stop working from 2025.10 to ensure all custom integration authors have time to adjust.

As the `state` property is not meant to be overwritten, in most cases this is only related for use in other properties or in tests rather in a `state` property.
