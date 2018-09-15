---
title: Config Flow Handlers
id: version-0.72-config_entries_config_flow_handler
original_id: config_entries_config_flow_handler
---

Config Entries uses the [Data Flow Entry framework](data_entry_flow_index.md) to allow users to create entries. Components that want to support config entries will need to define a Config Flow Handler. This handler will manage the creation of entries from user input, discovery or other sources (like hassio).

Config Flow Handlers control the data that is stored in a config entry. This means that there is no need to validate that the config is correct when Home Assistant starts up. It will also prevent breaking changes, because we will be able to migrate configuration entries to new formats if the version changes.

When instantiating the handler, Home Assistant will make sure to load all dependencies and install the requirements of the component.

To register your config flow handler with Home Assistant, register it with the config entries `HANDLERS` registry:

```python
from homeassistant import config_entries, data_entry_flow

@config_entries.HANDLERS.register(DOMAIN)
class ExampleConfigFlow(data_entry_flow.FlowHandler):
```

> Temporarily, all config flow handlers will also need to add their component name to the `FLOWS` constant in `homeassistant/config_entries.py`. We are working on automating discovery.

## Initializing a config flow from an external source

You might want to initialize a config flow programmatically. For example, if we discover a device on the network that requires user interaction to finish setup. To do so, pass a source parameter and optional user input when initializing the config entry:

```python
await hass.config_entries.flow.async_init(
    'hue', source=data_entry_flow.SOURCE_DISCOVERY, data=discovery_info)
```

The config flow handler will need to add a step to support the given source. The step should follow the same return values as a normal step.

```python
@config_entries.HANDLERS.register(DOMAIN)
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    async def async_step_discovery(self, info):
        # Handle discovery info
```

If the result of the step is to show a form, the user will be able to continue
the flow from the config panel.

## Translations

Translations for the config flow handlers are defined under the `config` key in the component translation file `strings.json`. Example of the Hue component:

```json
{
  "config": {
    "title": "Philips Hue Bridge",
    "step": {
      "init": {
        "title": "Pick Hue bridge",
        "data": {
          "host": "Host"
        }
      },
      "link": {
        "title": "Link Hub",
        "description": "Press the button on the bridge to register Philips Hue with Home Assistant.\n\n![Location of button on bridge](/static/images/config_philips_hue.jpg)"
      }
    },
    "error": {
      "register_failed": "Failed to register, please try again",
      "linking": "Unknown linking error occurred."
    },
    "abort": {
      "discover_timeout": "Unable to discover Hue bridges",
      "no_bridges": "No Philips Hue bridges discovered",
      "all_configured": "All Philips Hue bridges are already configured",
      "unknown": "Unknown error occurred",
      "cannot_connect": "Unable to connect to the bridge",
      "already_configured": "Bridge is already configured"
    }
  }
}
```
