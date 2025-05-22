---
author: Frenck
authorURL: https://github.com/frenck
authorTwitter: frenck
title: "Icon translations now support ranges"
---

Icon translations now support defining icons based on numeric ranges. This means integration authors can define icons that change based on numeric values without implementing custom logic in their code.

Previously, icon translations only supported state-based icons, where specific states would map to specific icons. While this works well for discrete states like "on"/"off", it required custom code to handle numeric values like battery levels or signal strength indicators.

Range-based icons are defined in the `icons.json` file:

```json
{
  "entity": {
    "sensor": {
      "battery_level": {
        "default": "mdi:battery",
        "range": {
          "0": "mdi:battery-outline",
          "10": "mdi:battery-10",
          "20": "mdi:battery-20",
          "30": "mdi:battery-30",
          "40": "mdi:battery-40",
          "50": "mdi:battery-50",
          "60": "mdi:battery-60",
          "70": "mdi:battery-70",
          "80": "mdi:battery-80",
          "90": "mdi:battery-90",
          "100": "mdi:battery"
        }
      }
    }
  }
}
```

The system selects the icon associated with the highest range value that's less than or equal to the entity's current value. For example:

- A value of 15 will show the `mdi:battery-10` icon
- A value of 45 will show the `mdi:battery-40` icon
- A value of 100 will show the `mdi:battery` icon

For implementation details, see the [icon translations documentation](/docs/core/integration-quality-scale/rules/icon-translations#range-based-icons).
