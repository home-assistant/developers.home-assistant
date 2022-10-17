---
author: epenet
authorURL: https://github.com/epenet
title: "Deprecate Unit System constants and properties"
---

As of Home Assistant Core 2022.11, the `is_metric` and `name` properties of a unit system are deprecated 
and should not be used.

Custom components referencing these properties will need to be adjusted to use instance checks instead.

Correct:
```python
if hass.config.units is IMPERIAL_SYSTEM:
    pass

if hass.config.units is METRIC_SYSTEM:
    pass
```

To avoid confusion with future unit systems, the constants `CONF_UNIT_SYSTEM_IMPERIAL` 
and `CONF_UNIT_SYSTEM_METRIC` are also deprecated and should no longer be referenced:
  - if they were used to compare against the `name` of a unit system, 
  then this is no longer needed.
  - if they were used for another reason, then local constants should be created instead.
