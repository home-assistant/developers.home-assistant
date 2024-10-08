---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Deprecating state constants for cover"
---

As of Home Assistant Core 2024.11, the constants used to return state in `CoverEntity` are deprecated and replaced by the `CoverState` enum.

There is a one-year deprecation period, and the constants will stop working from 2025.11 to ensure all custom integration authors have time to adjust.

As the `state` property is not meant to be overwritten, in most cases this change will only affect other Entity properties or tests rather than the `state` property.

More details can be found in the [cover documentation](/docs/core/entity/cover#states).