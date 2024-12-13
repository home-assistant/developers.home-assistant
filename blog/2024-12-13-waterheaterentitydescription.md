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

More details can be found in the [Water heater documentation](/docs/core/entity/water-heater).
