---
title: "Automations"
---

:::warning
The features in this page are still in very active development and should not be used yet by integrations. The API may change without a deprecation notice.
:::

## Triggers

Triggers start automations based on events, state changes, or conditions. Implement them in the `trigger` platform (`trigger.py`) of your integration by creating and registering trigger classes.

### Trigger class

Each trigger must inherit from `homeassistant.helpers.trigger.Trigger` and implement `async_validate_config` and `async_attach_runner`.
`async_validate_config` validates the configuration dict for the trigger, while
`async_attach_runner` sets up the trigger to call the provided action runner `run_action` every time the trigger fires.


Integrations that need to wait for the action to complete can await the `Task` returned by `run_action`: `await run_action(...)`.

```python
from typing import Any

import voluptuous as vol

from homeassistant.const import CONF_OPTIONS
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.trigger import Trigger, TriggerActionRunner, TriggerConfig
from homeassistant.helpers.typing import ConfigType

_OPTIONS_SCHEMA = vol.Schema({
    vol.Required("event_type"): cv.string,
})

_CONFIG_SCHEMA = vol.Schema({
    vol.Required(CONF_OPTIONS): _OPTIONS_SCHEMA,
})

class EventTrigger(Trigger):
    """Trigger on events."""

    _options: dict[str, Any]

    @classmethod
    async def async_validate_config(
        cls, hass: HomeAssistant, config: ConfigType
    ) -> ConfigType:
        """Validate trigger-specific config."""
        return _CONFIG_SCHEMA(config)

    def __init__(self, hass: HomeAssistant, config: TriggerConfig) -> None:
        """Initialize trigger."""
        super().__init__(hass, config)
        assert config.options is not None
        self._options = config.options

    async def async_attach_runner(
        self, run_action: TriggerActionRunner
    ) -> CALLBACK_TYPE:
        """Attach the trigger."""
        @callback
        def async_remove() -> None:
            """Remove trigger."""
            # Your code to unregister the trigger

        @callback
        def async_on_event(event_data: dict) -> None:
            """Handle event."""
            payload = {
                "event_type": event_data["type"],
                "data": event_data["data"],
            }
            description = f"Event {event_data['type']} detected"
            run_action(payload, description)

        # Dummy example method to register your event listener
        register_for_events(async_on_event)

        return async_remove
```


### Registering triggers

Implement `async_get_triggers` in the `trigger` platform to register all the integration's triggers.
Each trigger is identified by a unique string (for example, `"event"` in the example above).

```python
async def async_get_triggers(hass: HomeAssistant) -> dict[str, type[Trigger]]:
    """Return triggers provided by this integration."""
    return {
        "event": EventTrigger,
    }
```


## Conditions

When an automation is triggered, it may have conditions that have to be met for the action to be executed.
Conditions are defined in the `condition` platform (`condition.py`) of your integration by creating and registering condition classes.

### Condition class

Conditions inherit from `homeassistant.helpers.condition.Condition` and must implement `async_validate_config` and `_async_check`.
Just as with the [trigger class](#trigger-class), `async_validate_config` is used to validate the condition configuration.
`_async_check` is called whenever the condition needs to be checked and should return whether the condition is met.

In the following snippet we create a condition that can be configured to only pass when `binary_sensor.front_door` has a desired configured state.

```python
from typing import TYPE_CHECKING, Any, override

import voluptuous as vol

from homeassistant.const import (
    CONF_OPTIONS,
    CONF_STATE,
    STATE_OFF,
    STATE_ON,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.condition import Condition, ConditionConfig
from homeassistant.helpers.typing import ConfigType, TemplateVarsType

STATE_CONDITION_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_OPTIONS, default={}): {
            vol.Required(CONF_STATE): vol.In([STATE_ON, STATE_OFF]),
        },
    }
)


class DoorStateCondition(Condition):
    """State condition."""

    @classmethod
    @override
    async def async_validate_config(
        cls, hass: HomeAssistant, config: ConfigType
    ) -> ConfigType:
        """Validate config."""
        return STATE_CONDITION_SCHEMA(config)

    def __init__(self, hass: HomeAssistant, config: ConditionConfig) -> None:
        """Initialize condition."""
        super().__init__(hass, config)
        if TYPE_CHECKING:
            assert config.options
        self._state = config.options[CONF_STATE]

    @override
    async def _async_check(
        self, variables: TemplateVarsType = None, **kwargs: Any
    ) -> bool:
        """Check the condition."""

        # Do your condition checks here
        return get_example_state() == self._state
```

### Registering conditions

To register the conditions `async_get_conditions` should be implemented in the `condition` platform for that integration.
Each condition is identified by a unique string (e.g., `"door_state"` in the example below).

```python
async def async_get_conditions(hass: HomeAssistant) -> dict[str, type[Condition]]:
    """Return the door state conditions."""
    return {
        "door_state": DoorStateCondition,
    }
```

### Condition schema

Home Assistant uses the `conditions.yaml` file to know the structure of the conditions.
This file is similar to `triggers.yaml` and `services.yaml`.

For example, the following snippet shows the `door_state` condition described in the previous example.

```yaml
door_state:
  fields:
    state:
      required: true
      selector:
        select:
          options:
            - "on"
            - "off"
```
