---
author: epenet
authorURL: https://github.com/epenet
title: "Rename Imperial unit system to US Customary"
---

As of Home Assistant Core 2022.11, the `IMPERIAL_SYSTEM` is deprecated and should not be referenced.

Custom integrations referencing this unit system need to be adjusted accordingly.

Correct:
```python
if hass.config.units is US_CUSTOMARY_SYSTEM:
    pass

if hass.config.units is METRIC_SYSTEM:
    pass
```

Please also note the [deprecation of unit system constants and properties](/blog/2022/10/14/deprecate-unit-system)
