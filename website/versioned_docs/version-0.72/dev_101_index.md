---
title: Development 101
sidebar_label: Introduction
id: version-0.72-dev_101_index
original_id: dev_101_index
---

The goal of development 101 is to get you familiar with the basics of developing for Home Assistant. Before we start, please make sure you familiarize yourself with the [architecture](architecture_index.md).

To get our code running inside Home Assistant we're going to create a custom component. The first step is to locate your config folder. You can find the path to your config folder by opening the Home Assistant frontend, click on the <img src='/img/dev-tools/about-icon.png' alt='service developer tool icon' class="inline" width="38" />. It's the path after the text "Path to configuration.yaml".

Inside your configuration directory create a new folder called `custom_components`. It might be that one already exists, that's fine too. This is the folder that Home Assistant will look at when looking for custom code.

> The Home Assistant API has two variants: a synchronous and an asynchronous version (asyncio). This development course will focus on the synchronous version.

To verify that everything is working correctly, let's create a small Hello World component. To do so, create a file called `hello_world.py` in your custom components folder. Copy paste the following content to it:

```python
# The domain of your component. Equal to the filename of your component.
DOMAIN = "hello_world"


def setup(hass, config):
    """Setup the hello_world component."""
    # States are in the format DOMAIN.OBJECT_ID.
    hass.states.set('hello_world.Hello_World', 'Works!')

    # Return boolean to indicate that initialization was successfully.
    return True
```

Last step is to add `hello_world:` entry to your `configuration.yaml` file.

```yaml
# Hello World component
hello_world:
```

After running `hass`, we should see log entries stating that `hello_world` component was loaded. What is more, additional state card shall appear within main panel.

```log
2018-04-03 21:44:20 INFO (MainThread) [homeassistant.loader] Loaded hello_world from custom_components.hello_world
2018-04-03 21:44:20 INFO (MainThread) [homeassistant.setup] Setting up hello_world
```

<img
  src='/img/en/frontend/hello-world-state-card.png'
  alt='State card showing that Hello World component is working as intended.'
/>
