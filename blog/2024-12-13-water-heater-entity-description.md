---
author: L Boué
authorURL: https://github.com/lboue
authorTwitter: lboue
title: "Changed name of WaterHeaterEntityDescription"
---

A naming error of the entity description was found in the Water Heater integration, and we have now renamed `WaterHeaterEntityEntityDescription` to `WaterHeaterEntityDescription`.
As there were no Core integrations and no custom integrations published on HACS using the entity description, we did not add a deprecation period. The changed entity description will be released in the 2025.1 release.

See details in the core PR: [#132888](https://github.com/home-assistant/core/pull/132888).
