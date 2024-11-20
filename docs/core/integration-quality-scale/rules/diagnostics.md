---
title: "Implements diagnostics"
---

## Reasoning

Diagnostics are an easy way for the user to gather data about the integration and can prove useful when debugging an integration.

We consider it a good practice to have the diagnostics implemented.
Something to keep in mind is that the diagnostics should not expose any sensitive information, such as passwords, tokens, or coordinates.

## Example implementation

In the following example we provide diagnostics which includes data from various sources, such as the configuration and the current state of the integration.
Since the configuration may contain sensitive information, we redact the sensitive information before returning the diagnostics.

`diagnostics.py`:
```python showLineNumbers
TO_REDACT = [
    CONF_API_KEY,
    CONF_LATITUDE,
    CONF_LONGITUDE,
]

async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: MyConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""

    return {
        "entry_data": async_redact_data(entry.data, TO_REDACT),
        "data": entry.runtime_data.data,
    }
```

## Exceptions

There are no exceptions to this rule.