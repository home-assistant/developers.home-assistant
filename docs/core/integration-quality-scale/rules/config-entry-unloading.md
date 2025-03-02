---
title: "Support config entry unloading"
related_rules:
  - entity-event-setup
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Integrations should support config entry unloading.
This allows Home Assistant to unload the integration on runtime, allowing the user to remove the integration or to reload it without having to restart Home Assistant.

This improves the user experience, since the user can do more actions without having to restart Home Assistant.

## Example implementation

In the `async_unload_entry` interface function, the integration should clean up any subscriptions and close any connections opened during the setup of the integration.

In this example we have a listener, stored in the `runtime_data` of the config entry, which we want to clean up to avoid memory leaks.

`__init__.py`:
```python showLineNumbers
async def async_unload_entry(hass: HomeAssistant, entry: MyConfigEntry) -> bool:
    """Unload a config entry."""
    if (unload_ok := await hass.config_entries.async_unload_platforms(entry, PLATFORMS))
        entry.runtime_data.listener()
    return unload_ok
```

:::info
Integrations can use `entry.async_on_unload` to register callbacks which will be called when the config entry is unloaded or if it fails to set up.
This can be useful to clean up resources without having to keep track of the removal methods yourself.
The registered callbacks will be called if :
 - `async_setup_entry` raises either `ConfigEntryError`, `ConfigEntryAuthFailed`, or `ConfigEntryNotReady`
 - `async_unload_entry` succeeds, i.e., it returns True and does not raise.

Note that integrations always need to implement `async_unload_entry` to support config entry unloading, just calling `entry.async_on_unload` is not enough.
:::

## Additional resources

More information about config entries and their lifecycle can be found in the [config entry documentation](/docs/config_entries_index).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>