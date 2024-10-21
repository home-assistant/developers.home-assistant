---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "New alarm control panel state property"
---

As of Home Assistant Core 2024.11, the constants used to return state in `AlarmControlPanelEntity` are deprecated and replaced by the `AlarmControlPanelState` enum.

Also with this change, integrations should set the `alarm_state` property instead of directly setting the `state` property directly.

There is a one-year deprecation period, and the constants will stop working from 2025.11 to ensure all custom integration authors have time to adjust.

### Example

```python

from homeassistant.components.alarm_control_panel import AlarmControlPanelEntity, AlarmControlPanelState

class MyAlarm(AlarmControlPanelEntity):
    """My alarm."""

    @property
    def alarm_state(self) -> AlarmControlPanelState | None:
        """Return the state of the alarm."""
        if self.device.is_on():
            return AlarmControlPanelState.ARMED_AWAY
        return AlarmControlPanelState.DISARMED

```

More details can be found in the [alarm control panel documentation](/docs/core/entity/alarm-control-panel#states).
