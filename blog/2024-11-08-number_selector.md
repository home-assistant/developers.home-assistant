---
author: epenet
authorURL: https://github.com/epenet
title: "Number selector adds integer return value support"
---

### Summary of changes
Passing an integer step to a [Number selector](https://www.home-assistant.io/docs/blueprint/selectors/#number-selector) will now validate the user input as an integer.

Set this parameter in [config flows](/docs/data_entry_flow_index#show-form) to eliminate the extra schema validation step.

New implementation (using an integer step):

```python
vol.Schema(
    {
        vol.Optional(CONF_ADDRESS): NumberSelector(
            NumberSelectorConfig(
                min=1, max=255, mode=NumberSelectorMode.BOX, step=1
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

### Backwards compatibility

To improve backwards compatibility, the default value has been adjust from `step=1` to `step=1.0`.

However, integrations that set the step explicitly to an integer value may need to adjust the step to the corresponding float to allow float values.

New implementation (using an float step) to ensure a float is accepted:

```python
NumberSelector(
    NumberSelectorConfig(
        min=0, max=100, mode=NumberSelectorMode.BOX, step=5.0
    )
)
```

Previous implementation:

```python
NumberSelector(
    NumberSelectorConfig(
        min=0, max=100, mode=NumberSelectorMode.BOX, step=5
    )
)
```
