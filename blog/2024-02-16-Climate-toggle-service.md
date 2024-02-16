---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: "New Climate entity toggle method"
---

As of Home Assistant Core 2024.3 we have added a new `toggle` method to `ClimateEntity` and users can now call `climate.toggle` in their service calls.

Integrations that support `turn_on` and `turn_off` implicitly also support the `toggle` method.

Example (default implementation):

```python
async def async_toggle(self) -> None:
    """Toggle the entity."""
    if self.hvac_mode == HVACMode.OFF:
        await self.async_turn_on()
    else:
        await self.async_turn_off()

```