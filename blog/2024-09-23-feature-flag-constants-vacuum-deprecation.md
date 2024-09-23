---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Deprecating state constants for lock"
---

As of Home Assistant Core 2022.5, the feature flag constants used in `StateVacuumEntity` was deprecated and replaced by the `VacuumEntityFeature` enum.

However, there was no proper deprecation done and therefore we start the one-year deprecation period in 2024.10, and the the constants will stop to work from 2025.10 to ensure all custom integration authors have time to adjust.
