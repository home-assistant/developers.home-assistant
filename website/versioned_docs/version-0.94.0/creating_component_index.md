---
title: Creating a Minimal Component
sidebar_label: Minimal Component
id: version-0.94.0-creating_component_index
original_id: creating_component_index
---

Alright, you learned about the [manifest](creating_integration_manifest.md), so it's time to write your first code for your integration. AWESOME. Don't worry, we've tried hard to keep it as easy as possible.

More extensive examples of integrations are available from [our example repository](https://github.com/home-assistant/example-custom-config/tree/master/custom_components/).

## The code

Each component needs to have 2 basic parts: it needs to define a `DOMAIN` constant that contains the domain of the integration. The second part is that it needs to define a setup method that returns a boolean if the set up was successful. So let's take a look at how this looks:

```python
DOMAIN = 'hello_state'

def setup(hass, config):
    hass.states.set('hello_state.world', 'Paulus')

    # Return boolean to indicate that initialization was successful.
    return True
```

And if you prefer an async component:

```python
DOMAIN = 'hello_state'

async def async_setup(hass, config):
    hass.states.async_set('hello_state.world', 'Paulus')

    # Return boolean to indicate that initialization was successful.
    return True
```

That's it! If you load this, you will see a new state in the state machine.

To load this, add `hello_state:` to your `configuration.yaml` file and create a file `<config_dir>/custom_components/hello_state/__init__.py` with one of the two codeblocks above to test it locally.
