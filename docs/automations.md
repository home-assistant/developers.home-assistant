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
from typing import TYPE_CHECKING, cast

import voluptuous as vol

from homeassistant.const import CONF_TARGET
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.trigger import Trigger, TriggerActionRunner, TriggerConfig
from homeassistant.helpers.typing import ConfigType

_CONFIG_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_TARGET): cv.TARGET_FIELDS,
    }
)


class OccupancyClearedTrigger(Trigger):
    """Trigger when occupancy is cleared."""

    @classmethod
    async def async_validate_config(
        cls, hass: HomeAssistant, config: ConfigType
    ) -> ConfigType:
        """Validate trigger-specific config."""
        return cast(ConfigType, _CONFIG_SCHEMA(config))

    def __init__(self, hass: HomeAssistant, config: TriggerConfig) -> None:
        """Initialize trigger."""
        super().__init__(hass, config)
        if TYPE_CHECKING:
            assert config.target is not None
        self._target = config.target

    async def async_attach_runner(
        self, run_action: TriggerActionRunner
    ) -> CALLBACK_TYPE:
        """Attach the trigger."""

        @callback
        def async_remove() -> None:
            """Remove trigger."""
            # Your code to unregister the trigger

        @callback
        def async_on_cleared(entity_id: str) -> None:
            """Handle occupancy cleared."""
            payload = {"entity_id": entity_id}
            description = f"Occupancy cleared for {entity_id}"
            run_action(payload, description)

        # Dummy example method to register your listener for the target entities
        register_for_occupancy_cleared(self._target, async_on_cleared)

        return async_remove
```


### Registering triggers

Implement `async_get_triggers` in the `trigger` platform to register all the integration's triggers.
Each trigger is identified by a unique string (e.g., `"occupancy_cleared"` in the example above).

```python
async def async_get_triggers(hass: HomeAssistant) -> dict[str, type[Trigger]]:
    """Return triggers provided by this integration."""
    return {
        "occupancy_cleared": OccupancyClearedTrigger,
    }
```

### Trigger description

Triggers should have their description in a `triggers.yaml` file. The description specifies the structure of the triggers and is used by the frontend, for example.

The following snippet shows a trigger that takes a target binary sensor with a specific device class.

```yaml
occupancy_cleared:
  target:
    entity:
      domain: binary_sensor
      device_class: presence
```

### Naming triggers

Naming triggers consistently helps users predict how every integration behaves. A user who has learned how one integration names its triggers should be able to guess how another one does.

The core principle is that a trigger names an event that just happened. It leads with the entity type and reads as a statement.

Use a single, consistent entity type across all of an integration's triggers, conditions, and actions. This is the human-friendly name for the kind of device, for example "light", "fan", "cover", "lock", "alarm", "media player", "vacuum cleaner", "climate-control device", or "lawn mower". Do not mix variants such as "vacuum" and "vacuum cleaner", and always include the entity type, even for sensor-style and zone-style entries.

#### Titles

Lead with the entity type, then describe the event, following the pattern `[Entity type] [event]`. Choose the sub-pattern that fits the kind of event rather than forcing every event into the simple past tense.

- **Punctual transition** — simple past tense, for instantaneous state changes: "Light turned on", "Door opened", "Lock locked", "Alarm armed", "Button pressed".
- **Start or end of an ongoing activity** — `started` / `stopped` / `paused` plus a present participle, for an activity the device performs over time. Simple past would wrongly imply the activity finished ("Vacuum cleaned" sounds completed, "Vacuum cleaner started cleaning" does not): "Climate-control device started cooling", "Lawn mower started mowing", "Vacuum cleaner paused cleaning", "Battery started charging".
- **Measurement change or threshold** — `[measurement] changed` or `[measurement] crossed threshold`: "Temperature changed", "Battery level crossed threshold", "Light brightness changed".
- **Detection (binary sensors)** — `[phenomenon] detected` or `[phenomenon] cleared`: "Motion detected", "Smoke cleared".
- **Status threshold** — `[Entity type] became [status]` or `[Entity type] no longer [status]`, for a device entering or leaving a status that has no natural past-tense verb. Do not leave these as bare adjectives such as "Battery low", which read as a state rather than an event: "Battery became low", "Battery no longer low", "Update became available", "Satellite became idle".

Lead with the entity type even for sensor and zone triggers. Prefer "Dropdown selection changed" over "Selection changed", and "Zone entered" over "Entered zone".

#### Descriptions

Follow the pattern `Triggers when one or more [entity type plural] [present tense verb phrase].`

- "Triggers when one or more lights turn on."
- "Triggers when one or more lawn mowers start mowing."
- "Triggers when one or more locks lock."

Rules:

- Open with "Triggers when". A trigger fires at the moment the event happens, so "when" is more natural and more accurate than "after".
- Use "one or more [plural]", not "a" or a singular noun.
- Use present tense verbs ("turn on", "ring", "return"), even though the title is past tense.
- End with a period.

#### Keys

Keys are lowercase snake_case, and the key should match the meaning of its title.

- **Punctual transition**: `turned_on`, `turned_off`, `opened`, `closed`, `locked`, `armed`, `pressed`.
- **Activity start or end**: `started_cooling`, `started_mowing`, `paused_cleaning`, `started_charging`, `stopped_charging`.
- **Measurement**: `level_changed`, `level_crossed_threshold`, `target_temperature_changed`, `target_temperature_crossed_threshold`.
- **Detection**: `detected`, `cleared`.
- **Status threshold**: `became_low`, `no_longer_low`, `became_available`. Do not use bare `low` or `not_low`; match the "became" wording of the title.
- **Subtypes** prefix the noun: `awning_opened`, `blind_closed`, `co2_changed`.

Do not repeat the domain in the key. In the update domain use `became_available`, not `update_became_available`. Do not use placeholder keys such as `_`.

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
    def _async_check(
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

### Naming conditions

Conditions follow the same consistency principle as [triggers](#naming-triggers), reusing the integration's single, consistent entity type. The difference is that a condition tests a current state rather than naming an event. It leads with the entity type and reads as a statement.

#### Titles

Follow the pattern `[Entity type] is [state]`:

- "Light is on"
- "Climate-control device is cooling"
- "Lock is locked"

Use `[Entity type] is not [state]` for negation, for example "Media player is not playing".

For value-based conditions, use the variant `[Entity type] [property]`, for example "Climate-control device target temperature" or "Media player volume". Include the entity type even for value conditions, and avoid bare property names such as "Volume".

#### Descriptions

Follow the pattern `Tests if one or more [entity type plural] are [state].`

- "Tests if one or more lights are on."
- "Tests if one or more locks are locked."

For the value-based variant, use `Tests the [property] of one or more [entity type plural].`, for example "Tests the temperature of one or more entities."

#### Keys

Use the `is_` prefix for every condition. This keeps conditions visually distinct from triggers and actions.

- **Boolean**: `is_on`, `is_off`, `is_locked`, `is_cooling`, `is_detected`.
- **Negation**: `is_not_<state>`, such as `is_not_playing`, `is_not_low`, `is_not_detected`.
- **Mode or specific value**: `is_hvac_mode`, `is_operation_mode`, `is_option_selected`.
- **Value-based**: `is_<property>`, such as `is_target_temperature`, `is_brightness`, `is_value`. Keep the `is_` prefix here too.
- **Subtypes**: `[subtype]_is_[state]`, such as `awning_is_closed`, `blind_is_open`.
