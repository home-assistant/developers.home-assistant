---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "New vacuum state property"
---

As of Home Assistant Core 2025.1, the constants used to return state in `StateVacuumEntity` are deprecated and replaced by the `VacuumActivity` enum.

Also with this change, integrations should set the `activity` property instead of directly setting the `state` property.

There is a one-year deprecation period, and the constants will stop working from 2026.1 to ensure all custom integration authors have time to adjust.

### Example

```python

from homeassistant.components.vacuum import VacuumActivity

class MyVacuumCleaner(StateVacuumEntity):
    """My vacuum cleaner."""

    @property
    def activity(self) -> VacuumActivity | None:
        """Return the state of the vacuum."""
        if self.device.is_cleaning():
            return VacuumActivity.CLEANING
        return VacuumActivity.DOCKED

```

More details can be found in the [vacuum documentation](/docs/core/entity/vacuum#states).
