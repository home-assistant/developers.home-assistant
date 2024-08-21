---
author: Michael Arthur
authorURL: https://github.com/mikey0000
title: "New returning type in LawnMowerActivity"
---

As of Home Assistant Core 2024.9, integrations implementing `LawnMowerEntity` can indicate that their mower is returning to the dock by using the new `LawnMowerActivity.RETURNING` state.

## Example

```python
    async def async_dock(self) -> None:
        """Start docking."""
        self._attr_activity = LawnMowerActivity.RETURNING
        self.async_write_ha_state()
```

or by returning `LawnMowerActivity.RETURNING` in the activity property of your `lawn_mower` entity.

```python
    @property
    def activity(self) -> LawnMowerActivity:
        """Return the state of the mower."""
        mower = self.mower
        if mower.state is RETURNING:
            return LawnMowerActivity.RETURNING
        ...
```
