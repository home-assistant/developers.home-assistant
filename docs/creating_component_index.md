---
title: "Creating your first integration"
---

Alright, you learned about the [manifest](creating_integration_manifest.md), so it's time to write your first code for your integration. AWESOME. Don't worry, we've tried hard to keep it as easy as possible. From a Home Assistant development environment, type the following and follow the instructions:

```shell
python3 -m script.scaffold integration
```

This will set you up with everything that you need to build an integration that is able to be set up via the user interface. More extensive examples of integrations are available from [our example repository](https://github.com/home-assistant/example-custom-config/tree/master/custom_components/).

## The minimum

The scaffold integration contains a bit more than just the bare minimum. The minimum is that you define a `DOMAIN` constant that contains the domain of the integration. The second part is that it needs to define a setup method that returns a boolean if the set up was successful.

```python
DOMAIN = "hello_state"


def setup(hass, config):
    hass.states.set("hello_state.world", "Paulus")

    # Return boolean to indicate that initialization was successful.
    return True
```

And if you prefer an async component:

```python
DOMAIN = "hello_state"


async def async_setup(hass, config):
    hass.states.async_set("hello_state.world", "Paulus")

    # Return boolean to indicate that initialization was successful.
    return True
```

To load this, add `hello_state:` to your `configuration.yaml` file and create a file `<config_dir>/custom_components/hello_state/__init__.py` with one of the two codeblocks above to test it locally.

## What the scaffold offers

When using the scaffold script, it will go past the bare minimum of an integration. It will include a config flow, tests for the config flow and basic translation infrastructure to provide internationalization for your config flow.
