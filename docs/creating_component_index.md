---
title: "Creating components"
sidebar_label: "Introduction"
---

Alright, you learned about the [manifest](creating_integration_manifest.md), so it's time to write your first code for your integration. AWESOME. Don't worry, we've tried hard to keep it as easy as possible.

Examples of integrations are available from [our example repository](https://github.com/home-assistant/example-custom-config/tree/master/custom_components/).

## Example component

Add `hello_state:` to your `configuration.yaml` file and create a file `<config_dir>/custom_components/hello_state/__init__.py` with the below code to test it locally.

```python
DOMAIN = 'hello_state'

def setup(hass, config):
    hass.states.set('hello_state.world', 'Paulus')

    # Return boolean to indicate that initialization was successfully.
    return True
```

And if you prefer an async component:

```python
DOMAIN = 'hello_state'

async def async_setup(hass, config):
    hass.states.async_set('hello_state.world', 'Paulus')

    # Return boolean to indicate that initialization was successfully.
    return True
```

That's it! If you load this, you will see a new state in the state machine.
