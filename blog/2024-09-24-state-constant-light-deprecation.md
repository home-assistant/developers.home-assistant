---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Deprecating state constant for light"
---

As of Home Assistant Core 2024.10, the constant `STATE_ON` used to return state in `LightEntity` are deprecated when imported from `homeassistant.components.light`. It has been replaced by the `LightState` enum.

There is a one-year deprecation period, and the constants will stop working from 2025.10 to ensure all custom integration authors have time to adjust.

As the `state` property is not meant to be overwritten, in most cases this change will only affect other Entity properties, methods or tests rather than the `state` property.
