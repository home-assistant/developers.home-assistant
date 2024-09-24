---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Deprecating state constants for camera"
---

As of Home Assistant Core 2024.10, the constants used as returning state in `Camera` are deprecated and replaced by the `CameraState` enum.

There is a one-year deprecation period, and the constants will stop working from 2025.10 to ensure all custom integration authors have time to adjust.

As the `state` property is not meant to be overwritten, in most cases this change will only affect other Entity properties or tests.
