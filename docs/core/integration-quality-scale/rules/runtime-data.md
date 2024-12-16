---
title: "Use ConfigEntry.runtime_data to store runtime data"
related_rules:
  - strict-typing
  - test-before-setup
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

The `ConfigEntry` object has a `runtime_data` attribute that can be used to store runtime data.
This is useful for storing data that is not persisted to the configuration file storage, but is needed during the lifetime of the configuration entry.

By using `runtime_data`, we maintain consistency for developers to store runtime data in a consistent and typed way.
Because of the added typing, we can use tooling to avoid typing mistakes.

## Example implementation

The type of a `ConfigEntry` can be extended with the type of the data put in `runtime_data`.
In the following example, we extend the `ConfigEntry` type with `MyClient`, which means that the `runtime_data` attribute will be of type `MyClient`.

`__init__.py`:
```python {1,4,9} showLineNumbers
type MyIntegrationConfigEntry = ConfigEntry[MyClient]


async def async_setup_entry(hass: HomeAssistant, entry: MyIntegrationConfigEntry) -> bool:
    """Set up my integration from a config entry."""

    client = MyClient(entry.data[CONF_HOST])

    entry.runtime_data = client

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True
```

:::info
If the integration implements `strict-typing`, the use of a custom typed `MyIntegrationConfigEntry` is required and must be used throughout.
:::

## Additional resources

More information about configuration entries and their lifecycle can be found in the [config entry documentation](/docs/config_entries_index).

## Exceptions

Runtime data was previously stored in the `hass.data` untyped dictionary, and checks have been added to ensure this is no longer the case.
If an integration still needs to access `hass.data` directly, the rule should be marked as `exempt` rather than `done` with a corresponding comment.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>
