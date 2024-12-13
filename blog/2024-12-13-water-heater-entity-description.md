---
author: L Boué
authorURL: https://github.com/lboue
authorTwitter: lboue
title: "Fix typo in WaterHeaterEntityDescription name"
---

A naming error was found in the water heater code componant. So we renamed `WaterHeaterEntityEntityDescription` to `WaterHeaterEntityDescription`.
This should have no effect because:
- no core integrations are using this entity description
- no custom integrations published on HACS are using this entity description

See details in the core PR: [#132888](https://github.com/home-assistant/core/pull/132888).
