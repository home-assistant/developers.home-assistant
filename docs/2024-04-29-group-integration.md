---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Changes in setup entity platforms with group integration
---

## Changes in setup entity platforms with group integration

By default, the `group` integration allows entities to be grouped. If the default `ON`/`OFF` states for an entity default to `on` and `off`, then `grouping` is supported by default. The setup changes, though, for Entity platforms that can be grouped but have alternative states, e.g., `cover` (`open`/`closed`) or `person` (`home`/`not_home`), or platforms that are meant to be excluded, such as `sensor`. These entity platforms must implement `async_describe_on_off_states` in the `group.py` module.

In `async_describe_on_off_states`, the `domain` needs to be the first argument passed to the `registry` methods `on_off_states` and `exclude_domain`. When registering alternative `ON`/`OFF` states with `registry.on_off_state`, in addition to the `ON` states, the default `ON` state needs to be passed.

### Example registering alternative states

New signature for `registry.on_off_states`:

```python
    @callback
    def on_off_states(
        self, domain: str, on_states: set[str], default_on_state:str, off_state: str
    ) -> None:
        """Register on and off states for the current domain."""
    ...
```

Example `group.py` for the `vacuum` entity platform registering alternative `ON`/`OFF` states. Note the the first `ON` state now is considered to be the default `ON` state.

```python
"""Describe group states."""

from typing import TYPE_CHECKING

from homeassistant.const import STATE_OFF, STATE_ON
from homeassistant.core import HomeAssistant, callback

if TYPE_CHECKING:
    from homeassistant.components.group import GroupIntegrationRegistry

from .const import DOMAIN, STATE_CLEANING, STATE_ERROR, STATE_RETURNING


@callback
def async_describe_on_off_states(
    hass: HomeAssistant, registry: "GroupIntegrationRegistry"
) -> None:
    """Describe group on off states."""
    registry.on_off_states(
        DOMAIN,
        {
            STATE_ON,
            STATE_CLEANING,
            STATE_RETURNING,
            STATE_ERROR,
        },
        STATE_ON,
        STATE_OFF,
    )
```

### Example excluding an entity platform from group entities

New signature for `registry.exclude_domain`:

```python
    @callback
    def exclude_domain(self, domain: str) -> None:
        """Exclude the current domain."""
        ...
```

Example `group.py` for the `sensor` entity platform to exclude sensor entities from `group` entities.

```python
"""Describe group states."""

from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant, callback

if TYPE_CHECKING:
    from homeassistant.components.group import GroupIntegrationRegistry

from .const import DOMAIN


@callback
def async_describe_on_off_states(
    hass: HomeAssistant, registry: "GroupIntegrationRegistry"
) -> None:
    """Describe group on off states."""
    registry.exclude_domain(DOMAIN)
```
