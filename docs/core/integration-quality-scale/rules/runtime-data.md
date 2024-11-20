---
title: "Use ConfigEntry.runtime_data to store runtime data"
related_rules:
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

## Additional resources

More information about configuration entries and their lifecycle can be found in the [config entry documentation](../../../config_entries_index).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>