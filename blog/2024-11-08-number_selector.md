---
author: epenet
authorURL: https://github.com/epenet
title: "Return an integer in number selector"
---

The [Number selector](https://www.home-assistant.io/docs/blueprint/selectors/#number-selector) has been expanded and now also includes an `as_int` parameter.

Using this in [config flows](/docs/data_entry_flow_index#show-form) will remove the need to add an extra validation to the schema.

Example:

```python
vol.Schema(
    {
        vol.Optional(CONF_ADDRESS): NumberSelector(
            NumberSelectorConfig(
                as_int=True, min=1, max=255, mode=NumberSelectorMode.BOX
            )
        ),
    }
)
```

Old code:

```python
vol.Schema(
    {
        vol.Optional(CONF_ADDRESS): vol.All(
            NumberSelector(
                NumberSelectorConfig(
                    min=1, max=255, mode=NumberSelectorMode.BOX
                )
            ),
            vol.Coerce(int),
        ),
    }
)
```
