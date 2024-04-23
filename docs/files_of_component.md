---
title: "Files of Component (Integration)"
sidebar_label: "Files of Component"
---

List of files for use in a custom component (integration).

### manifest.json

**Required!** \
[More information and examples here.](/docs/creating_integration_manifest)

Class [`loader.Manifest`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/loader.py#L200)

```json
{
  "domain": "your_domain_name",
  "name": "Your Integration",
  "version": "24.2",
  "codeowners": [],
  "dependencies": [],
  "documentation": "https://www.example.com",
  "integration_type": "hub"
}
```

### strings.json and &lt;language_code&gt;.json {#stringsjson}

[More information and examples here.](/docs/internationalization/core) \
[Info about `<language_code>.json` here.](/docs/internationalization/custom_integration)

Loading from [`translation.async_get_translations()`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/helpers/translation.py#L415)

```json
{
  "config": {
    "flow_title": "{title}",
    "step": {
      "confirm": {
        "description": "Do you want to set up Devialet device {device}?"
      },
      "user": {
        "description": "Please enter the host name or IP address of the Devialet device."
      }
    }
  }
}
```

### icons.json

[More information and examples here.](https://developers.home-assistant.io/docs/core/entity#icons)

```json
{
  "entity_component": {
    "_": {
      "default": "mdi:calendar-clock"
    }
  },
  "services": {
    "set_value": "mdi:calendar-edit"
  }
}
```

### services.yaml

[More information about services.yaml](/docs/dev_101_services)

[`helpers/service.py`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/helpers/service.py)

Typically this file is empty.

### \_\_init\_\_.py

**Required!** \
The entire file is interpreted as the class [`loader.ComponentProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/loader.py#L342).

All `async_*_entry*()` are called from the [`config_entries.ConfigEntry`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/config_entries.py#L266).

```python
"""The integration."""
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv, device_registry as dr
from homeassistant.helpers.typing import ConfigType

DOMAIN = "domain"
CONFIG_SCHEMA = cv.empty_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up integration."""
    return True


async def async_setup_entry(hass: HomeAssistant, config_entry: ConfigEntry) -> bool:
    """Set up a config entry."""
    return True


async def async_unload_entry(hass: HomeAssistant, config_entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    return True


async def async_migrate_entry(hass: HomeAssistant, config_entry: ConfigEntry) -> bool:
    """Migrate an old config entry."""
    return True


async def async_remove_entry(hass: HomeAssistant, config_entry: ConfigEntry) -> None:
    """Remove a config entry."""


async def async_remove_config_entry_device(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    device_entry: dr.DeviceEntry,
) -> bool:
    """Remove a config entry device."""
    return True


async def async_reset_platform(hass: HomeAssistant, integration_name: str) -> None:
    """Release resources."""

```

:::warning
`async_setup()` is called from `configuration.yaml`.
But `configuration.yaml` is deprecated.
Information [here](https://github.com/home-assistant/architecture/blob/master/adr/0010-integration-configuration.md) and
[here](https://github.com/home-assistant/architecture/blob/master/adr/0021-YAML-integration-configuration-deprecation-policy.md).
:::

### config.py

Call `async_validate_config()` in [`homeassistant/config.py`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/config.py#L1538).

```python
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

PACKAGE_MERGE_HINT = "list"


async def async_validate_config(hass: HomeAssistant, config: ConfigType) -> ConfigType:
    """Validate config."""
    return config
```

### config_flow.py

More information about [Config Flow](/docs/config_entries_config_flow_handler), [Options Flow](/docs/config_entries_options_flow_handler) and [Data Entry Flow](/docs/data_entry_flow_index).

You need to add `"config_flow": true` to `manifest.json` to activate this file.

Registers the completed [`config_entries.ConfigEntry`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/config_entries.py#L266) for call `__init__.async_setup_entry()`.

The first step ["user" is always for the UI](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/config/config_entries.py#L189).
But the default is ["init"](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/data_entry_flow.py#L632).

Used in the [`components/config`](https://github.com/home-assistant/core/tree/2024.4.3/homeassistant/components/config) by server and in the Frontend
([Dialogs](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/config-flow),
[Config Panels](https://github.com/home-assistant/frontend/tree/dev/src/panels/config),
[ConfigEntry](https://github.com/home-assistant/frontend/blob/dev/src/data/config_entries.ts),
etc.) by client.

Recommended variant with registration via [`ConfigFlow.__init_subclass__`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/config_entries.py#L2001):

```python
"""Config Flow"""
import voluptuous as vol
from homeassistant.config_entries import ConfigFlow, FlowResult, Any
from .const import DOMAIN


class ExampleConfig(ConfigFlow, domain=DOMAIN):
    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle a flow initiated by the user."""
        if user_input is not None:
            return self.async_create_entry(title=user_input["title"], data=user_input)

        # If there is no user input or there were errors, show the form again.
        return self.async_show_form(
            step_id="user", data_schema=vol.Schema({"title": str})
        )
```
:::tip
If the user added a component to `configuration.yaml`, then it is possible to call `config_flow.py` without UI from `__init__.async_setup()`:
```python
async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up integration."""
    hass.async_create_task(
        hass.config_entries.flow.async_init(
            DOMAIN,
            context={"source": "user"},
            data=config,
        )
    )
    return True
```
:::

:::danger
Legacy registration variant with decorator.
Doesn't work without problems in the latest version, but is [in the documentation](/docs/data_entry_flow_index#flow-handler).
```python
"""Config Flow"""
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowHandler, FlowResult, Any
from .const import DOMAIN


@config_entries.HANDLERS.register(DOMAIN)
class ExampleConfig(FlowHandler):
    @classmethod
    def async_supports_options_flow(cls, config_entry) -> bool:
        """Return options flow support for this handler."""
        return False

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle a flow initiated by the user."""
        if user_input is not None:
            return self.async_create_entry(title=user_input["title"], data=user_input)

        # If there is no user input or there were errors, show the form again.
        return self.async_show_form(
            step_id="user", data_schema=vol.Schema({"title": str})
        )
```
:::

### Platforms: button.py fan.py light.py lock.py sensor.py ... {#platforms}

The platform (this file) is an extension of the standard `Entity` with views in Frontend UI for device control.
Views for panels UI are available in
[Home Assistant Design](https://design.home-assistant.io) and
[Dashboards](https://www.home-assistant.io/dashboards/).

[More information and examples here.](/docs/core/entity)
And [entities architecture](/docs/architecture/devices-and-services).

List [`const.Platform`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/const.py#L33) for use in a custom component.

Class interaction:
1. Your component is [`helpers.entity_component.EntityComponent`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/helpers/entity_component.py#L69)
2. This file is [`helpers.entity_platform.EntityPlatform`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/helpers/entity_platform.py#L107)
3. Extension [`helpers.entity.Entity`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/helpers/entity.py#L440)

`Entity._attr_unique_id` [is needed](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/helpers/entity_platform.py#L721) to connect `Entity` to `ConfigEntry`.

`Entity.entity_id` changes automatically:
* if entity_id is not None: `f"{platform_name}." + entity_id.split(".")[1]`
* or `f"{platform_name}.{domain}_{unique_id}"`

This file is interpreted as the class [`helpers.entity_platform.EntityPlatformModule`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/helpers/entity_platform.py#L77).

```python
from datetime import timedelta
from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry, ConfigType
from homeassistant.helpers.entity_platform import AddEntitiesCallback, DiscoveryInfoType
from homeassistant.helpers import config_validation as cv
from .const import DOMAIN

# When _attr_should_poll == True
SCAN_INTERVAL = timedelta(seconds=15)

PLATFORM_SCHEMA = cv.PLATFORM_SCHEMA_BASE

# PARALLEL_UPDATES = 1

async def async_setup_platform(
    hass: HomeAssistant,
    config: ConfigType,
    async_add_entities: AddEntitiesCallback,
    discovery_info: DiscoveryInfoType | None = None,
) -> None:
    """Set up an integration platform async."""
    # async_add_entities([ActiveSensor()])

async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up an integration platform from a config entry."""
    # async_add_entities([ActiveSensor()])

# class ActiveSensor(SensorEntity):
#     _attr_should_poll = True
#     async def async_update(self) -> None:
#         """Called every SCAN_INTERVAL."""
```

## Other platforms

:::info
The list of platforms below is incomplete.
The list was compiled by searching the sources.
:::

### application_credentials.py

[More information and examples here.](/docs/core/platform/application_credentials)

[`components.application_credentials.ApplicationCredentialsProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/application_credentials/__init__.py#L260)

```python
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.components.application_credentials import (
    AuthorizationServer,
    ClientCredential,
)
from homeassistant.helpers.config_entry_oauth2_flow import AbstractOAuth2Implementation


async def async_get_authorization_server(hass: HomeAssistant) -> AuthorizationServer:
    """Return authorization server, for the default auth implementation."""


async def async_get_auth_implementation(
    hass: HomeAssistant, auth_domain: str, credential: ClientCredential
) -> AbstractOAuth2Implementation:
    """Return a custom auth implementation."""


async def async_get_description_placeholders(hass: HomeAssistant) -> dict[str, str]:
    """Return description placeholders for the credentials dialog."""
```

### backup.py

[More information and examples here.](/docs/core/platform/backup)

[`components.backup.manager.BackupPlatformProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/backup/manager.py#L46)

```python
from homeassistant.core import HomeAssistant


async def async_pre_backup(hass: HomeAssistant) -> None:
    """Perform operations before a backup starts."""


async def async_post_backup(hass: HomeAssistant) -> None:
    """Perform operations after a backup finishes."""
```

### Google Cast: cast.py {#google-cast}

[More information and examples here.](https://www.home-assistant.io/integrations/cast/)

[`components.cast.CastProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/cast/__init__.py#L35)

```python
from homeassistant.core import HomeAssistant
from homeassistant.components.cast import MediaType, BrowseMedia, Chromecast


async def async_get_media_browser_root_object(
    hass: HomeAssistant, cast_type: str
) -> list[BrowseMedia]:
    """Create a list of root objects for media browsing."""


async def async_browse_media(
    hass: HomeAssistant,
    media_content_type: MediaType | str,
    media_content_id: str,
    cast_type: str,
) -> BrowseMedia | None:
    """Browse media.

    Return a BrowseMedia object or None if the media does not belong to
    this platform.
    """


async def async_play_media(
    hass: HomeAssistant,
    cast_entity_id: str,
    chromecast: Chromecast,
    media_type: MediaType | str,
    media_id: str,
) -> bool:
    """Play media.

    Return True if the media is played by the platform, False if not.
    """
```

### Device Automations: device_trigger.py device_condition.py device_action.py {#device-automations}

[Introduction](/docs/device_automation_index)

`device_trigger.py`:
[information](/docs/device_automation_trigger) and
[`components.device_automation.trigger.DeviceAutomationTriggerProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/device_automation/trigger.py#L28),
[`helpers.trigger.TriggerProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/helpers/trigger.py#L48).

```python
import voluptuous as vol
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, Any
from homeassistant.helpers.trigger import TriggerActionType, TriggerInfo
from homeassistant.helpers.typing import ConfigType

TRIGGER_SCHEMA: vol.Schema


async def async_validate_trigger_config(
    hass: HomeAssistant, config: ConfigType
) -> ConfigType:
    """Validate config."""


async def async_attach_trigger(
    hass: HomeAssistant,
    config: ConfigType,
    action: TriggerActionType,
    trigger_info: TriggerInfo,
) -> CALLBACK_TYPE:
    """Attach a trigger."""


async def async_get_trigger_capabilities(
    hass: HomeAssistant, config: ConfigType
) -> dict[str, vol.Schema]:
    """List trigger capabilities."""


async def async_get_triggers(
    hass: HomeAssistant, device_id: str
) -> list[dict[str, Any]]:
    """List triggers."""
```

`device_condition.py`:
[information](/docs/device_automation_condition) and
[`components.device_automation.condition.DeviceAutomationConditionProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/device_automation/condition.py#L22),
[`helpers.condition.ConditionProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/helpers/condition.py#L99).

```python
import voluptuous as vol
from homeassistant.core import HomeAssistant, Any
from homeassistant.helpers.condition import ConditionCheckerType
from homeassistant.helpers.typing import ConfigType

CONDITION_SCHEMA: vol.Schema


async def async_validate_condition_config(
    hass: HomeAssistant, config: ConfigType
) -> ConfigType:
    """Validate config."""


def async_condition_from_config(
    hass: HomeAssistant, config: ConfigType
) -> ConditionCheckerType:
    """Evaluate state based on configuration."""


async def async_get_condition_capabilities(
    hass: HomeAssistant, config: ConfigType
) -> dict[str, vol.Schema]:
    """List condition capabilities."""


async def async_get_conditions(
    hass: HomeAssistant, device_id: str
) -> list[dict[str, Any]]:
    """List conditions."""
```

`device_action.py`:
[information](/docs/device_automation_action) and
[`components.device_automation.action.DeviceAutomationActionProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/device_automation/action.py#L18).

```python
import voluptuous as vol
from homeassistant.core import Context, HomeAssistant, Any
from homeassistant.helpers.typing import ConfigType

ACTION_SCHEMA: vol.Schema


async def async_validate_action_config(
    hass: HomeAssistant, config: ConfigType
) -> ConfigType:
    """Validate config."""


async def async_call_action_from_config(
    hass: HomeAssistant,
    config: ConfigType,
    variables: dict[str, Any],
    context: Context | None,
) -> None:
    """Execute a device action."""


async def async_get_action_capabilities(
    hass: HomeAssistant, config: ConfigType
) -> dict[str, vol.Schema]:
    """List action capabilities."""


async def async_get_actions(
    hass: HomeAssistant, device_id: str
) -> list[dict[str, Any]]:
    """List actions."""
```

### device_tracker.py

[`components.device_tracker.legacy.DeviceTrackerPlatform`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/device_tracker/legacy.py#L290)

```python
import voluptuous as vol
from homeassistant.components.device_tracker.legacy import (
    AsyncSeeCallback,
    DeviceScanner,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType


async def async_get_scanner(
    hass: HomeAssistant, config: dict[str, ConfigType]
) -> DeviceScanner:
    return None


### OR ###


async def async_setup_scanner(
    hass: HomeAssistant,
    config: ConfigType,
    async_see: AsyncSeeCallback,
    discovery_info: DiscoveryInfoType | None = None,
) -> bool:
    return True
```

### diagnostics.py

[More information and examples here.](https://www.home-assistant.io/integrations/diagnostics/)

[`components.diagnostics.DiagnosticsProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/diagnostics/__init__.py#L79)

```python
from homeassistant.core import HomeAssistant, Mapping, Any
from homeassistant.components.diagnostics import ConfigEntry, DeviceEntry


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, config_entry: ConfigEntry
) -> Mapping[str, Any]:
    """Return diagnostics for a config entry."""


async def async_get_device_diagnostics(
    hass: HomeAssistant, config_entry: ConfigEntry, device: DeviceEntry
) -> Mapping[str, Any]:
    """Return diagnostics for a device."""
```

### hardware.py

[`components.hardware.models.HardwareProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/hardware/models.py#L43)

```python
from homeassistant.core import HomeAssistant, callback
from homeassistant.components.hardware.models import HardwareInfo, USBInfo, BoardInfo


@callback
def async_info(hass: HomeAssistant) -> list[HardwareInfo]:
    """Return info."""
```

### intent.py

[More information and examples here.](/docs/intent_index)

[`components.intent.IntentPlatformProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/intent/__init__.py#L86)

```python
from homeassistant.core import HomeAssistant


async def async_setup_intents(self, hass: HomeAssistant) -> None:
    """Set up platform intents."""
```

### logbook.py

[More information and examples here.](https://www.home-assistant.io/integrations/logbook/)

[`components.logbook`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/logbook/__init__.py#L164)

```python
from typing import TYPE_CHECKING, Protocol, Callable, Any
from homeassistant.core import HomeAssistant
from homeassistant.components.logbook import LazyEventPartialState

if TYPE_CHECKING:

    class _async_describe_event(Protocol):
        def __call__(
            self,
            domain: str,
            event_name: str,
            describe_callback: Callable[[LazyEventPartialState], dict[str, Any]],
        ) -> None:
            """Teach logbook how to describe a new event."""


async def async_describe_events(
    hass: HomeAssistant, describe_event: _async_describe_event
) -> None:
    """Teach logbook how to describe a new event."""
```

### media_source.py

[More information and examples here.](https://www.home-assistant.io/integrations/media_source/)

[`components.media_source`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/media_source/__init__.py#L93)

```python
from homeassistant.core import HomeAssistant
from homeassistant.components.media_source.models import MediaSource


async def async_get_media_source(hass: HomeAssistant) -> MediaSource:
    """Represents a source of media files."""
```

### recorder.py

[More information and examples here.](https://www.home-assistant.io/integrations/recorder/)

[`components.recorder`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/recorder/__init__.py#L195)

```python
import datetime
from sqlalchemy.orm.session import Session
from homeassistant.core import HomeAssistant
from homeassistant.components.recorder import statistics


def compile_statistics(
    hass: HomeAssistant,
    session: Session,
    start: datetime.datetime,
    end: datetime.datetime,
) -> statistics.PlatformCompiledStatistics:
    """Compile statistics for all entities during start-end."""


def list_statistic_ids(
    hass: HomeAssistant,
    statistic_ids: list[str] | tuple[str] | None = None,
    statistic_type: str | None = None,
) -> dict:
    """Return all or filtered statistic_ids and meta data."""


def validate_statistics(
    hass: HomeAssistant,
) -> dict[str, list[statistics.ValidationIssue]]:
    """Validate statistics."""
```

### repairs.py

[More information and examples here.](/docs/core/platform/repairs)

[`components.repairs.models.RepairsProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/repairs/models.py#L18)

```python
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult
from homeassistant.components.repairs import ConfirmRepairFlow, RepairsFlow


class Issue1RepairFlow(RepairsFlow):
    """Handler for an issue fixing flow."""

    async def async_step_init(
        self, user_input: dict[str, str] | None = None
    ) -> FlowResult:
        """Handle the first step of a fix flow."""
        return await self.async_step_confirm()


async def async_create_fix_flow(
    hass: HomeAssistant,
    issue_id: str,
    data: dict[str, str | int | float | None] | None,
) -> RepairsFlow:
    """Create flow."""
    if issue_id == "issue_1":
        return Issue1RepairFlow()
```

### reproduce_state.py

[More information and examples here.](/docs/core/platform/reproduce_state)

[`helpers.state`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/helpers/state.py#L64)

```python
import asyncio
from typing import Iterable, Optional
from homeassistant.core import Context, HomeAssistant, State


async def async_reproduce_states(
    hass: HomeAssistant, states: Iterable[State], context: Optional[Context] = None
) -> None:
    """Reproduce component states."""
```

### significant_change.py

[More information and examples here.](/docs/core/platform/significant_change)

[`helpers.significant_change`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/helpers/significant_change.py)

```python
from typing import Any, Optional
from homeassistant.core import HomeAssistant, callback

@callback
def async_check_significant_change(
    hass: HomeAssistant,
    old_state: str,
    old_attrs: dict,
    new_state: str,
    new_attrs: dict,
    **kwargs: Any,
) -> bool | None:
    """Test if state significantly changed."""
```

### system_health.py

[`components.system_health.SystemHealthProtocol`](https://github.com/home-assistant/core/blob/2024.4.3/homeassistant/components/system_health/__init__.py#L34)

```python
from homeassistant.core import HomeAssistant
from homeassistant.components.system_health import SystemHealthRegistration


def async_register(hass: HomeAssistant, register: SystemHealthRegistration) -> None:
    """Register system health callbacks."""
```
