---
title: "Deprecating"
---

A deprecation is a breaking change scheduled for the future: the old behavior keeps working, everyone affected is warned, and the removal happens in a later release.

Any removals must be deprecated first. This holds even when you believe only a handful of users are affected, because an entity, action, or constant can be referenced from automations, scripts, and dashboards we cannot see.

| Who is affected | Minimum period |
| --- | --- |
| Users (YAML configuration, actions, entities, attributes, integrations) | 6 months |
| Developers (constants, helpers, entity properties, platform APIs used by custom integrations) | 12 months |

A deprecation period may be extended if the ecosystem has not caught up, but it is never shortened. State the release the removal happens in as `breaks_in_ha_version`, in the [calendar version format](/docs/versioning).

Use `IssueSeverity.WARNING` for as long as the old behavior still works, and `IssueSeverity.ERROR` only once it has stopped, because the integration is gone or a migration failed and the user's configuration is no longer in effect. The same split applies to log levels when removing developer-facing features which can't raise a repair issue. 


## User-facing deprecations

Every deprecation that needs input from the user gets a [repair issue](/docs/core/platform/repairs). Scope the `issue_id` per config entry when an integration can be set up more than once, otherwise the issues collide. After the deprecation period has ended, create a follow-up pull request removing the repair issue and old behavior.

Every issue you register under your own domain needs a matching `issues.<translation_key>` entry in the integration's [`strings.json`](/docs/internationalization/core). Issues registered under `HOMEASSISTANT_DOMAIN`, such as `deprecated_yaml`, reuse text that already lives in core and need nothing locally.


### Dropping YAML support for an integration

To drop YAML support for the whole integration, add a [config flow](/docs/core/integration/config_flow) and an import flow to the integration and raise the core `deprecated_yaml` repair issue with `integration_title` and `domain` placeholders. Because that issue text lives in the `homeassistant` domain, register it with `HOMEASSISTANT_DOMAIN` and set `issue_domain` to your own domain.

```python
async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration."""
    if DOMAIN not in config:
        return True

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_IMPORT}, data=config[DOMAIN]
    )
    if (
        result.get("type") is FlowResultType.ABORT
        and (reason := result["reason"]) != "single_instance_allowed"
    ):
        async_create_import_error_issue(hass, reason)
        return True

    ir.async_create_issue(
        hass,
        HOMEASSISTANT_DOMAIN,
        f"deprecated_yaml_{DOMAIN}",
        breaks_in_ha_version="2027.1.0",
        is_fixable=False,
        issue_domain=DOMAIN,
        severity=ir.IssueSeverity.WARNING,
        translation_key="deprecated_yaml",
        translation_placeholders={"domain": DOMAIN, "integration_title": "Example"},
    )
    return True
```

Raise the `deprecated_yaml` issue only after the import succeeded. If it is raised up front and the import later aborts, the user is told their configuration was imported when it was not. When the import does abort, their configuration is not in effect, so raise your own issue with `ERROR` severity instead.

Once the deprecation period has passed and YAML handling itself is gone, leave `cv.config_entry_only_config_schema(DOMAIN)` behind as the `CONFIG_SCHEMA`. It logs an error and raises a repair issue for anyone who still has the integration in `configuration.yaml`.

### Deprecating individual YAML config keys

If you would rather like to only deprecate a single YAML key or a group of YAML keys (e.g. because deprecating the whole YAML config at once is too complex), we raise a repair issue in `async_setup`, where the YAML is read, and only when the key is actually present. The key keeps working until the deprecation period is over.

```python
async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration."""
    if CONF_IPV6 in config[DOMAIN]:
        ir.async_create_issue(
            hass,
            DOMAIN,
            "deprecated_ipv6",
            breaks_in_ha_version="2027.1.0",
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key="deprecated_ipv6",
        )

    ...
```

Once the period is over, do not just drop the key from the schema. Leave `cv.removed(CONF_IPV6)` in its place, which tells the user the option is gone instead of failing with a generic validation error.


### Actions

Create a repair issue from the handler:

```python
async def render_image(call: ServiceCall) -> ServiceResponse:
    ir.async_create_issue(
        call.hass,
        DOMAIN,
        "deprecated_generate_image",
        breaks_in_ha_version="2026.9.0",
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key="deprecated_generate_image",
    )
```

Deprecating a single parameter of an action works the same way, but only raise the issue when the parameter is actually passed.

### Entities and attributes

When an attribute becomes its own entity, an entity is replaced by one on a different platform, or an entity is removed entirely, (create the new entity first and) keep the old one working during the deprecation period.

Raise the issue for every deprecated entity that still exists and is enabled. Use `automations_with_entity()` and `scripts_with_entity()` to make the message more specific and warn users about specific automations or scripts breaking. [Disabling the entity](https://www.home-assistant.io/common-tasks/general/#enabling-or-disabling-entities) is how the user acknowledges the deprecation. Once it is disabled and nothing references it, remove the registry entry so it is not recreated. The issue itself is not persistent, so it disappears on the next restart on its own.

```python
def async_deprecate_entity(
    hass: HomeAssistant,
    entity_registry: er.EntityRegistry,
    description: ExampleSwitchEntityDescription,
) -> bool:
    """Return whether the deprecated entity should still be created."""
    entity_id = entity_registry.async_get_entity_id(
        Platform.SWITCH, DOMAIN, description.unique_id
    )
    if entity_id is None:
        return False

    items = automations_with_entity(hass, entity_id) + scripts_with_entity(hass, entity_id)
    if entity_registry.async_get(entity_id).disabled and not items:
        entity_registry.async_remove(entity_id)
        return False

    ir.async_create_issue(
        hass,
        DOMAIN,
        f"deprecated_entity_{entity_id}",
        breaks_in_ha_version="2027.2.0",
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key="deprecated_entity_used" if items else "deprecated_entity",
        translation_placeholders={
            "entity_id": entity_id,
            "new_entity_id": description.replacement_entity_id,
        }
        | ({"items": "\n".join(items)} if items else {}),
    )
    return True
```

Call it from the platform's `async_setup_entry`, where the entities are built, so its return value decides what gets added:

```python
async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the switch platform."""
    entity_registry = er.async_get(hass)
    entities = [ExampleSwitch(coordinator, description) for description in SWITCHES]
    entities.extend(
        ExampleSwitch(coordinator, description)
        for description in DEPRECATED_SWITCHES
        if async_deprecate_entity(hass, entity_registry, description)
    )
    async_add_entities(entities)
```

Returning `False` for an entity that does not exist yet means the deprecated entity is only recreated for users who already had it, so new users never get it.

The message has to name every place the entity might be used, not just automations and scripts, and tell the user that disabling it is what removes it:

```json
"deprecated_entity": {
  "title": "Deprecated switch detected",
  "description": "The switch `{entity_id}` is deprecated because it has been replaced with `{new_entity_id}`.\n\nUpdate your dashboards, templates, automations and scripts to use the replacement entity, then disable the deprecated switch and restart Home Assistant."
},
"deprecated_entity_used": {
  "title": "[%key:component::example::issues::deprecated_entity::title%]",
  "description": "The switch `{entity_id}` is deprecated because it has been replaced with `{new_entity_id}`.\n\nThe switch was used in the following automations or scripts:\n{items}\n\nUpdate the above, along with any dashboards and templates that use it, to use the replacement entity, then disable the deprecated switch and restart Home Assistant."
}
```

### Removing an integration

When an integration stops working entirely and there are no plans to update it, it should be removed, while raising a repair letting users know what happened. This is done by stripping it down to a stub that raises an `ERROR` issue and keeping a minimal `config_flow.py` in place so existing entries still load. The established translation key is `integration_removed`, which should get added in `strings.json` with an explanation of why it was removed:

```python
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the integration from a config entry."""

    ir.async_create_issue(
        hass,
        DOMAIN,
        DOMAIN,
        is_fixable=False,
        severity=ir.IssueSeverity.ERROR,
        translation_key="integration_removed",
        translation_placeholders={
            "entries": f"/config/integrations/integration/{DOMAIN}",
        },
    )
    return True
```

The `entries` placeholder is a link to the user's existing config entries:

```json
"integration_removed": {
  "title": "The Example integration has been removed",
  "description": "The Example integration has been removed from Home Assistant, as the vendor shut down the API it relied on.\n\nTo resolve this issue, remove the (now defunct) integration entries from your Home Assistant setup. [Click here to see your existing Example integration entries]({entries})."
}
```

Delete the issue again in `async_unload_entry`, but only once the last config entry for the domain has unloaded.

When the integration is being replaced by a successor rather than disappearing, use `WARNING` with a `breaks_in_ha_version` instead, and abort the config flow with a `deprecated` reason so no new entries can be created.

### Documenting and testing

The deprecation is announced through the repair issue and the release notes. Do not leave a deprecation notice behind on [home-assistant.io](/docs/documenting/standards), as that documentation describes only what currently works.

Test with the `issue_registry` fixture that the issue is created, and that it is deleted again when the last config entry unloads.

## Developer-facing deprecations

Anything other integrations import or subclass counts as a core API, whether it lives in `homeassistant/helpers/`, `homeassistant/const.py`, or an entity platform such as `homeassistant/components/sensor/`. Deprecating one affects custom integration authors, who need a release cycle of their own to react. These get 12 months, and an announcement post on this site's [blog](/blog) naming the replacement if applicable and the removal version.

These mechanisms log a warning attributed to the offending integration. They do **not** create a repair issue, as users cannot fix a custom integration's code.

### Constants, aliases, and enum members

Register the replacement under a `_DEPRECATED_`-prefixed name and install the three module hooks, so that reading the old name warns once:

```python
from functools import partial

from homeassistant.helpers.deprecation import (
    DeprecatedConstantEnum,
    all_with_deprecated_constants,
    check_if_deprecated_constant,
    dir_with_deprecated_constants,
)

_DEPRECATED_CONCENTRATION_GRAMS_PER_CUBIC_METER = DeprecatedConstantEnum(
    UnitOfDensity.GRAMS_PER_CUBIC_METER, "2027.8"
)

# These can be removed if no deprecated constants are in this module anymore
__getattr__ = partial(check_if_deprecated_constant, module_globals=globals())
__dir__ = partial(dir_with_deprecated_constants, module_globals_keys=[*globals().keys()])
__all__ = all_with_deprecated_constants(globals())
```

Use `DeprecatedConstant` for a plain value, `DeprecatedConstantEnum` for an enum member, and `DeprecatedAlias` when a class or function moved. To deprecate a single member of an enum you are keeping, use the `EnumWithDeprecatedMembers` metaclass instead:

```python
class MediaPlayerState(
    StrEnum,
    metaclass=EnumWithDeprecatedMembers,
    deprecated={
        "STANDBY": ("MediaPlayerState.OFF or MediaPlayerState.IDLE", "2026.8.0"),
    },
):
    """State of media player entities."""

    OFF = "off"
    IDLE = "idle"
    STANDBY = "standby"
```

:::note

Deprecated constants only warn when the caller can be attributed to an integration. Access from core code or from a test is silent, which is why the test helpers below reach the constant through a custom integration.

:::

### Functions, methods, and classes

```python
@deprecated_function(
    "homeassistant.helpers.sun.get_astral_observer",
    breaks_in_ha_version="2027.7",
)
@callback
def get_astral_location(hass: HomeAssistant) -> tuple[Location, Elevation]:
```

`@deprecated_class` warns on instantiation and is the tool for keeping a renamed class around as an alias. Both take the replacement as a string. To deprecate a leading `hass` argument you no longer need, use `@deprecated_hass_argument`, which warns and then strips it.

### Patterns of use

When the problem is not a symbol but a pattern, such as setting a property you want gone or calling a registration function that a platform now replaces, use `report_usage()`. It distinguishes core code from integrations, so a mistake inside core fails loudly while integrations only get a warning:

```python
report_usage(
    "calls system_health.async_register_info, which is deprecated; "
    "add a system_health platform instead",
    breaks_in_ha_version="2027.1",
    core_behavior=ReportBehavior.ERROR,
    exclude_integrations={DOMAIN},
)
```

The first argument, `what`, is inserted into `Detected that integration 'domain' {what}`, so write it as a verb phrase.

`report_usage()` runs in core, so it identifies the responsible integration by walking the call stack. That works when the integration called the deprecated function itself. It does not work when core merely reads something the integration set earlier, such as a deprecated entity property, because by then the integration is no longer on the stack. Pass `integration_domain` in that case, from an object that knows its own origin, such as `self.platform.platform_name` on an entity.

Who gets what is controlled by three separate parameters, each taking a `ReportBehavior` of `IGNORE` (say nothing), `LOG` (log at `level`, once per caller) or `ERROR` (log and raise `RuntimeError`):

| Parameter | Applies to | Default |
| --- | --- | --- |
| `core_behavior` | code in `homeassistant/` with no integration in the stack | `ERROR` |
| `core_integration_behavior` | a built-in integration | `LOG` |
| `custom_integration_behavior` | a custom integration | `LOG` |

The defaults are what you usually want: core code fails loudly in tests, while integrations only get a warning. Lower `core_integration_behavior` to `IGNORE` while you are still migrating built-in integrations, so the warning reaches custom integration authors without flooding logs with offenders you are already fixing.

### Testing

`tests/common.py` provides `import_and_test_deprecated_constant`, `import_and_test_deprecated_constant_enum`, `import_and_test_deprecated_alias`, and `help_test_all` for symbols. The `mock_integration_frame` fixture covers `report_usage` warnings.
