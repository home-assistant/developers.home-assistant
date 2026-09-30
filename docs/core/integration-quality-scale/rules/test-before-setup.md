---
title: "Check during integration initialization if we are able to set it up correctly"
sidebar_label: 🥉 test-before-setup
related_rules:
  - runtime-data
  - entity-unavailable
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

When we initialize an integration, we should check if we are able to set it up correctly.
This way we can immediately let the user know that it doesn't work.

Implementing these checks increases the confidence that the integration will work correctly and provides a user-friendly way to show errors.
This will improve the user experience.

When the device or service is temporarily unreachable during setup, the integration can choose between two approaches:

- **Defer setup** until the device or service is reachable, by raising `ConfigEntryNotReady`. Home Assistant will then retry the setup later. This is usually the simplest approach to implement.
- **Continue setup** without contacting the device or service, and create the entities anyway. This can be a better fit for devices that are expected to be offline regularly, like a solar inverter that shuts down at night or a TV that is turned off. If the integration chooses this approach, the entities must be marked as unavailable until the device or service can be reached, and any information that couldn't be fetched during setup (like device info) must be fetched once the device or service becomes reachable.

Errors that are not temporary must always be reported during setup when they are detected.
If the password is incorrect or the API key is invalid, raise `ConfigEntryAuthFailed`, and if we don't expect the integration to work in the foreseeable future, raise `ConfigEntryError`.

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
Please note that this may also be implemented implicitly by awaiting a helper that raises on the integration's behalf, either `await coordinator.async_config_entry_first_refresh()` on a data update coordinator or `await session.async_ensure_token_valid()` on an [OAuth2 session](/docs/core/integration/config_flow#oauth2-error-handling).
:::

### Example of continuing setup when the device is offline

In this example, the device is regularly offline, so the integration continues setup when it can't be reached.
Instead of `async_config_entry_first_refresh()`, the coordinator is refreshed with `async_refresh()`, which doesn't raise when the update fails.
Entities based on `CoordinatorEntity` are then marked as unavailable until the coordinator successfully fetches data.
Authentication errors raised from the coordinator's update method still start the reauthentication flow.

`__init__.py`:
```python {7} showLineNumbers
async def async_setup_entry(hass: HomeAssistant, entry: MyIntegrationConfigEntry) -> bool:
    """Set up my integration from a config entry."""

    client = MyClient(entry.data[CONF_HOST])
    coordinator = MyCoordinator(hass, entry, client)

    await coordinator.async_refresh()

    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True
```

## Additional resources

More information about config entries and their lifecycle can be found in the [config entry documentation](/docs/config_entries_index).

## Exceptions

If it is impossible for an integration to validate the configuration during setup, or it's a pure local calculation, the integration is exempt

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>
