---
title: "Service actions are registered in async_setup"
related_rules:
  - action-exceptions
  - common-modules
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Integrations can add their own service actions to Home Assistant.
In the past, they have been frequently registered in the `async_setup_entry` method and removed in the `async_unload_entry` method.
The result of this is that the service actions are only available when there is a loaded entry.
This is not ideal, since this way we can't validate automations users create that use these service actions, since it is possible that the configuration entry could not be loaded.

We rather prefer integrations to set up their service actions in the `async_setup` method.
This way we can let the user know why the service action did not work, if the targeted configuration entry is not loaded.
The validation should happen inside the service action, and should raise `ServiceValidationError` if the input is invalid.

## Example implementation

The example below is a snippet where the service action is registered in the `async_setup` method.
In this example, the service call requires a configuration entry id as parameter.
This is used to first fetch the configuration entry, and then check if it is loaded.
If the configuration entry does not exist or the configuration entry that we found is not loaded, we raise a relevant error which is shown to the user.

`__init__.py`:
```python {13-19} showLineNumbers
from .services import register_services

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up my integration."""
    register_services(hass)
    ...
```

`services.py`:
```python {13-19} showLineNumbers
async def _async_get_schedule(call: ServiceCall) -> ServiceResponse:
    """Get the schedule for a specific range."""
    if not (entry := hass.config_entries.async_get_entry(call.data[ATTR_CONFIG_ENTRY_ID])):
        raise ServiceValidationError("Entry not found")
    if entry.state is not ConfigEntryState.LOADED:
        raise ServiceValidationError("Entry not loaded")
    client = cast(MyConfigEntry, entry).runtime_data
    ...

def register_services(hass: HomeAssistant) -> bool:
    """Register the services."""
    hass.services.async_register(
        DOMAIN,
        "get_shedule",
        _async_get_schedule,
        schema=SERVICE_GET_SCHEDULE_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
```

## Additional resources

For more information on how to set up service actions, see the [service documentation](../../../dev_101_services).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>
