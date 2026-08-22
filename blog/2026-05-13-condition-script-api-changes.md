---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changes to the condition and script APIs"
---

## Summary

The condition and script APIs have been changed.

Conditions are now instances of condition classes, which are evaluated by calling the `async_check` method and discarded by calling the `async_unload` method. Also, conditions may optionally implement an `_async_setup` or `_async_unload` method. Note that users of conditions don't need to call the condition's `async_setup` method.

During a deprecation period, which ends with the release of Home Assistant Core 2027.1, it's possible to use the condition object as a callable.

Scripts also have an `async_unload` method which must be called when the script is no longer needed.

## Impact on custom integrations

### Custom integrations which create conditions or scripts

Custom integrations which create condition objects should evaluate them by calling the `async_check` method and call the `async_unload` method when the condition is no longer needed.

Example:

```python
from homeassistant.helpers.condition import (
    async_condition_from_config,
    async_validate_condition_config,
)

# Validate condition config
validated_config = await async_validate_condition_config(hass, config)

# Create a condition
condition = await async_condition_from_config(hass, validated_config)

...

# Evaluate the condition
result = condition.async_check(...)
...

# Discard the condition
condition.async_unload()
```

Custom integrations which create scripts should call the `async_unload` method when the script is no longer needed.

Example:

```python
from homeassistant.helpers.script import (
    Script,
    async_validate_actions_config,
)

# Validate script config
validated_config = await async_validate_actions_config(hass, config)

# Create a script
script = Script(hass, validated_config, ...)

...

# Execute the script
result = await script.async_run(...)
...

# Discard the script
await script.async_unload()
```

### Custom integrations which provide a condition platform

Integrations which provide a condition platform don't need to change, but may implement `_async_setup` and `_async_unload` method if the platform needs to perform async initialization or do tear down.

Example:

```python

from homeassistant.core import HomeAssistant
from homeassistant.helpers.condition import (
    Condition,
    ConditionCheckParams,
    ConditionConfig,
)
from homeassistant.helpers.typing import ConfigType

class CustomCondition(Condition):
    """A custom condition."""

    @classmethod
    async def async_validate_config(
        cls, hass: HomeAssistant, config: ConfigType
    ) -> ConfigType:
        """Validate config."""
        ...

    def __init__(self, hass: HomeAssistant, config: ConditionConfig) -> None:
        """Initialize condition."""
        super().__init__(hass, config)
        ...

    async def _async_setup(self) -> None:
        """Set up the condition checker."""
        ...

    def _async_unload(self) -> None:
        """Clean up any resources held by the checker."""
        ...

    def _async_check(self, **kwargs: Unpack[ConditionCheckParams]) -> bool:
        """Check the condition."""
        ...
```
