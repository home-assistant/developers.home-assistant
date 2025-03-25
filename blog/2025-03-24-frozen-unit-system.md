---
author: Shay Levy
authorURL: https://github.com/thecode
title: "UnitSystem dataclass is now frozen"
---

`UnitSystem` class is changed to a frozen data class, and all intances derived from it are now frozen.

The following unit systems that derived from the `UnitSystem` class are now frozen:

- `METRIC_SYSTEM`
- `US_CUSTOMARY_SYSTEM`

The reason for this change is that Unit systems are constants that should not be modified. An integration that modifies these constants can break unit conversions and create undesired output for other components of Home Assistant.

With a frozen data class an attempt to modify the UnitSystem constant will fail:

```python
dataclasses.FrozenInstanceError: cannot assign to field 'temperature_unit'
```

This change was introduced in the [home assistant core PR #140954](https://github.com/home-assistant/core/pull/140954).
