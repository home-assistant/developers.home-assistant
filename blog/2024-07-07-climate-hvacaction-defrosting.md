---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: "New HVACAction DEFROSTING"
---

The `ClimateEntity` has an `hvac_action` property which is describing what the climate entity is currently doing (which is not the same as it's mode).

We have added `DEFROSTING` as a possible `HVACAction` to represent when an entity is currently defrosting.

Defrosting is when the system runs in reverse for some time to melt down accumulated ice, typically in colder environments and should not be mixed with, as example, cars that is defrosting by heating their windows.

```python
from homeassistant.components.climate.const import HVACAction

class MyClimateEntity(ClimateEntity):
    """Implementation of my climate entity."""

    def hvac_action(self) -> HVACAction | None:
        """Return the current running hvac operation if supported."""
        return HVACAction.DEFROSTING

```

More details can be found in the [climate entity documentation](/docs/core/entity/climate#hvac-action)

Background for the original change is in [architecture discussion #1090](https://github.com/home-assistant/architecture/discussions/1090).
