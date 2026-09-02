---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Deprecating config entry listener with reloading methods in config flow"
---

Integration migration method can now raise config entry exceptions instead of only being limited to return `False`. This is useful to provide more context and additionally being translatable.

Additionally by raising `ConfigEntryNotReady` it will automatically try again later (same as during setup).

More info in the [config flow documentation](/docs/core/integration/config_flow#handle-returns-raise-exceptions-in-migrations).

```python
# Example migration function which raises if client has issue
async def async_migrate_entry(hass, config_entry: ConfigEntry):
    """Migrate old entry."""
    _LOGGER.debug("Migrating configuration from version %s.%s", config_entry.version, config_entry.minor_version)

    if config_entry.version == 1:
        
        try:
            new_info = await client.get_info()
        except SomeException:
            raise ConfigEntryNotReady(
                translation_key="key",
                translation_domain=DOMAIN,
            ) from exc
        new_data = {**config_entry.data, "some_data": new_info["some_data"]}
        pass

        hass.config_entries.async_update_entry(
            config_entry, data=new_data, version=2
        )

    _LOGGER.debug("Migration to configuration version %s.%s successful", config_entry.version, config_entry.minor_version)

    return True
```
