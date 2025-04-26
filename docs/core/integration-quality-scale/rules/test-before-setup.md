---
title: "Check during integration initialization if we are able to set it up correctly"
related_rules:
  - runtime-data
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

When we initialize an integration, we should check if we are able to set it up correctly.
This way we can immediately let the user know that it doesn't work.

Implementing these checks increases the confidence that the integration will work correctly and provides a user-friendly way to show errors.
This will improve the user experience.

## Example implementation

When the reason for the failure is temporary (like a temporary offline device), we should raise `ConfigEntryNotReady` and Home Assistant will retry the setup later.
If the reason for the failure is that the password is incorrect or the api key is invalid, we should raise `ConfigEntryAuthFailed` and Home Assistant will ask the user to reauthenticate (if the reauthentication flow is implemented).
If we don't expect the integration to work in the foreseeable future, we should raise `ConfigEntryError`.

`__init__.py`:
```python {6-13} showLineNumbers
async def async_setup_entry(hass: HomeAssistant, entry: MyIntegrationConfigEntry) -> bool:
    """Set up my integration from a config entry."""

    client = MyClient(entry.data[CONF_HOST])

    try:
        await client.async_setup()
    except OfflineException as ex:
        raise ConfigEntryNotReady("Device is offline") from ex
    except InvalidAuthException as ex:
        raise ConfigEntryAuthFailed("Invalid authentication") from ex
    except AccountClosedException as ex:
        raise ConfigEntryError("Account closed") from ex

    entry.runtime_data = client

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True
```

:::info
Please note that this may also be implemented implicitly when using a data update coordinator via `await coordinator.async_config_entry_first_refresh()`.
:::

## Additional resources

More information about config entries and their lifecycle can be found in the [config entry documentation](/docs/config_entries_index).

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>
