---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: "LockEntity supports open/opening state"
---

As of Home Assistant Core 2024.4 we have added a `open` and `opening` state to `LockEntity`

This is useful if you have locks which can differentiate between `unlocked` (not locked but latched) state and `open` (unlocked and latch withdrawn) state.

`LockEntity` already supports the [`open` method](/docs/core/entity/lock#open) by implementing the feature flag `LockEntityFeature.OPEN`

Example (default implementation):

```python
class MyLock(LockEntity):

    @property
    def is_opening(self) -> bool:
        """Return true if lock is open."""
        return self._state == STATE_OPENING

    @property
    def is_open(self) -> bool:
        """Return true if lock is open."""
        return self._state == STATE_OPEN

    async def async_open(self, **kwargs: Any) -> None:
        """Open the door latch."""
        self._state = STATE_OPEN
        self.async_write_ha_state()

```