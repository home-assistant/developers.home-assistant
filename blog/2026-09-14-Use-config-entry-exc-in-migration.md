---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Use Config Entry exceptions in integration migration method"
---

Integration migration `async_migrate_entry` method can now raise config entry exceptions instead of only being limited to return `False`. This is preferred to provide more context and being translatable.

Integrations that fetch data from other services during migration can raise `ConfigEntryNotReady` to have the migration retried automatically later (as during setup), which helps with timeouts and other errors that may resolve on their own.

By returning `False` or raising any other exception than `ConfigEntryNotReady` the migration stops and the config entry state is set to `migration_error` which is a non-recoverable state.
This previously required the user to restart Home Assistant to retry the migration.
The new correct way to handle it is to raise a repair, After the user fixes the issue, call `hass.config_entries.async_retry_migration(entry_id)` to retry the migration.

More info in the [config flow documentation](/docs/core/integration/config_flow#handle-returns-raise-exceptions-in-migrations).

## Example migration function which raises if client has an issue

```python
from homeassistant.helpers.issue_registry import IssueSeverity, async_create_issue

async def async_migrate_entry(hass, config_entry: ConfigEntry):
    """Migrate old entry."""
    _LOGGER.debug("Migrating configuration from version %s.%s",
        config_entry.version, config_entry.minor_version
    )

    if config_entry.version == 1:
        
        try:
            new_info = await client.get_info()
        except ConnectionError as exc:
            raise ConfigEntryNotReady(
                translation_key="key",
                translation_domain=DOMAIN,
            ) from exc
        except AuthenticationError as exc:
            async_create_issue(
                hass,
                DOMAIN,
                "migrate_could_not_auth",
                is_fixable=True,
                is_persistent=False,
                severity=IssueSeverity.ERROR,
                translation_key="migrate_could_not_auth",
                translation_placeholders={"title": config_entry.title},
            )
            raise ConfigEntryError(translation_key="migrate_could_not_auth") from exc

        new_data = {**config_entry.data, "some_data": new_info["some_data"]}
        hass.config_entries.async_update_entry(
            config_entry, data=new_data, version=2
        )

    _LOGGER.debug("Migration to configuration version %s.%s successful",
        config_entry.version, config_entry.minor_version,
    )

    return True
```

## Example repair which will retry the migration

```python
async def async_step_fix_issue(
    self, user_input: dict[str, Any] | None = None
) -> RepairsFlowResult:
    """Fix the issue and retry migration."""
    errors: dict[str, str] = {}
    if user_input is None:
        # TODO fix issue
        ...
        await self.hass.config_entries.async_retry_migration(self.entry_id)
        return self.async_create_entry(data={})

    return self.async_show_form(
        step_id="fix_issue",
        data_schema=vol.Schema({}),
        errors=errors,
    )
```
