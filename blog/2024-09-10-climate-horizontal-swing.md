---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Climate entity now supports independent horizontal swing"
---

As of Home Assistant Core 2024.10, we have implemented an independent property and method for controling horizontal swing in `ClimateEntity`.

Integrations that supports completely independent control and state for vertical and horizontal swing can now use the previous `swing_mode` for vertical support only and use the new `swing_horizontal_mode` for providing the horizontal vane state.

Integrations that don't have independent control should still keep using the current `swing_mode` for both vertical and horizontal support.


### Example

Example requirements to implement `swing` and `swing_horizontal` in your climate entity.

```python

class MyClimateEntity(ClimateEntity):
    """Implementation of my climate entity."""

    @property
    def supported_features(self) -> ClimateEntityFeature:
        """Return the list of supported features."""
        return ClimateEntityFeature.SWING_MODE | ClimateEntityFeature.SWING_HORIZONTAL_MODE

    @property
    def swing_mode(self) -> str | None:
        """Return the swing setting.

        Requires ClimateEntityFeature.SWING_MODE.
        """
        return self._attr_swing_mode

    @property
    def swing_modes(self) -> list[str] | None:
        """Return the list of available swing modes.

        Requires ClimateEntityFeature.SWING_MODE.
        """
        return self._attr_swing_modes

    @property
    def swing_mode(self) -> str | None:
        """Return the swing setting.

        Requires ClimateEntityFeature.SWING_HORIZONTAL_MODE.
        """
        return self._attr_swing_horizontal_mode

    @property
    def swing_modes(self) -> list[str] | None:
        """Return the list of available swing modes.

        Requires ClimateEntityFeature.SWING_HORIZONTAL_MODE.
        """
        return self._attr_swing_horizontal_modes

    async def async_set_swing_mode(self, swing_mode: str) -> None:
        """Set new target swing operation."""
        await self.api.set_swing_mode(swing_mode)

    async def async_set_swing_horizontal_mode(self, swing_horizontal_mode: str) -> None:
        """Set new target horizontal swing operation."""
        await self.api.set_swing_horizontal_mode(swing_horizontal_mode)

```
