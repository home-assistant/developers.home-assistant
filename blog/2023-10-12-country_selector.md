---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: "Country selector"
---

[Selectors](https://www.home-assistant.io/docs/blueprint/selectors/) has been expanded and now also includes a `CountrySelector`.

Using this in [config flows](/docs/data_entry_flow_index#show-form) will allow frontend to automatically translate the country codes into the proper country names.

Example:

```python
vol.Schema(
    {
        vol.Optional(CONF_COUNTRY): CountrySelector(
            CountrySelectorConfig(
                countries=["DE", "US"],
            )
        ),
    }
)
```
