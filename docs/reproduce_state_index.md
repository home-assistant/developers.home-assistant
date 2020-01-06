---
title: "Reproduce State / Scene support"
---

Home Assistant has support for scenes. Scenes are a collection of (partial) entity states. When a scene is activated, Home Assistant will try to call the right services to get the specified scenes in their specified state.

Integrations are responsible for adding support to Home Assistant to be able to call the right services to reproduce the states in a scene.

## Adding support

The quickest way to add reproduce state support to a new integration is by using our built-in scaffold template. From a Home Assistant dev environment, run `python3 -m script.scaffold reproduce_state` and follow the instructions.

If you prefer to go the manual route, create a new file in your integration folder called `reproduce_state.py` and implement the following method:

```python
import asyncio
from typing import Iterable, Optional
from homeassistant.core import Context, State
from homeassistant.helpers.typing import HomeAssistantType


async def async_reproduce_states(
    hass: HomeAssistantType, states: Iterable[State], context: Optional[Context] = None
) -> None:
    """Reproduce component states."""
    # TODO reproduce states
```
