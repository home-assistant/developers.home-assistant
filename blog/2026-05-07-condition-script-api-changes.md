---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changes to the condition and script APIs"
---

## Summary

The condition and script APIs have been changed.

Conditions are now instances of condition classes, which are evaluated by calling the `async_check` method and discarded by calling the `async_unload` method. Also, conditions may optionally implement an `async_setup` method. Note that users of conditions don't need to call the condition's `async_setup` method.

During a deprecation period, which ends with the relase of Home Assistant Core 2027.1, it's possible to use the condition object as a callable.

Scripts also have an `async_unload` method which must be called when the script is no longer needed.

## Impact on custom integrations

### Custom integrations which create condtions and scripts

Custom integrations which create conditions should evaluate conditions by calling the `async_check` method and call the `async_unload` method when the condition is no longer needed.

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

# Evaluate the condtion
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
script = await Script(hass, validated_config, ...)

...

# Execute the script
result = await script_obj.async_run(...)
...

# Discard the script
await script.async_unload()
```

### Custom integrations which implement conditions

No change is required, but integrations may choose to implement an `async_setup` method.
