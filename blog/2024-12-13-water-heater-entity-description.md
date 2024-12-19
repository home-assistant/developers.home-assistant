---
author: L Boué
authorURL: https://github.com/lboue
authorTwitter: lboue
title: "Changed name of WaterHeaterEntityDescription"
---

A naming error of the entity description was found in the Water Heater integration, and we have now renamed `WaterHeaterEntityEntityDescription` to `WaterHeaterEntityDescription` in the 2025.1 release.
The old `WaterHeaterEntityEntityDescription` is deprecated, due for removal in 2026.1, and developpers are advised to use the new `WaterHeaterEntityDescription` instead.

See details in the core PR: [#132888](https://github.com/home-assistant/core/pull/132888).
