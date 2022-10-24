---
author: epenet
authorURL: https://github.com/epenet
title: "Deprecate IMPERIAL_SYSTEM unit system and linked constants and properties"
---

As of Home Assistant Core 2022.11, the `IMPERIAL_SYSTEM` is deprecated, replaced by `US_CUSTOMARY_SYSTEM`.
The `is_metric` and `name` properties of a unit system are likewise deprecated and should not be used.

Custom integrations referencing this unit system or these properties will need to be adjusted to use instance checks instead.

Correct:
```python
if hass.config.units is METRIC_SYSTEM:
    pass

if hass.config.units is US_CUSTOMARY_SYSTEM:
    pass
```

To avoid confusion with future unit systems, the constants `CONF_UNIT_SYSTEM_IMPERIAL` 
and `CONF_UNIT_SYSTEM_METRIC` are also deprecated and should no longer be referenced:
  - if they were used to compare against the `name` of a unit system, 
  then this is no longer needed.
  - if they were used for another reason, then local constants should be created instead.
