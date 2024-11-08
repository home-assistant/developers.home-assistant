---
author: epenet
authorURL: https://github.com/epenet
title: "Number selector adds integer return value support"
---

The [Number selector](https://www.home-assistant.io/docs/blueprint/selectors/#number-selector) now includes an `as_int` parameter.

Set this parameter in [config flows](/docs/data_entry_flow_index#show-form) to eliminate the extra schema validation step.

New implementation (using `as_int` parameter):

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

Previous implementation (with explicit integer conversion):

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
