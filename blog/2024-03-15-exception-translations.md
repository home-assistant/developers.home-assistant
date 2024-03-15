---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Raising exceptions with translations
---

### Logging exceptions with translation support

Translation support applies to `HomeAssistantError` and subclasses like `ServiceValidationError`. When a `translation_domain` and `translation_key` is set and the error message is added in `strings.json`, it is no longer needed to add the error message string for the local logging. Home Assistant will automatically fetch the English error message from the translation cache.

When raising `HomeAssistantError` or a subclass with translation support we should remove the log message from the argument list to enable it to be fetched from the translation cache.

For example:

```python
async def async_select_index(hass: HomeAssistant, index: int) -> None:
    """Setup the config entry for my device."""
    try:
        check_index(index)
    except ValueError as exc:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="invalid_index",
            translation_placeholders={
                "index": index,
            },
        ) from exc
```
