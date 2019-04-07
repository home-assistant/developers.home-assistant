---
title: Integration Configuration
sidebar_label: Configuration
id: version-0.91.2-config_entries_config_flow_handler
original_id: config_entries_config_flow_handler
---

> This option is currently only available for built-in components.

Integrations can be set up via the user interface by adding support for config entries. Config entries uses the [data flow entry framework](data_entry_flow_index.md) to allow users to create entries. Components that want to support config entries will need to define a Config Flow Handler. This handler will manage the creation of entries from user input, discovery or other sources (like Hass.io).

Config Flow Handlers control the data that is stored in a config entry. This means that there is no need to validate that the config is correct when Home Assistant starts up. It will also prevent breaking changes, because we will be able to migrate configuration entries to new formats if the version changes.

When instantiating the handler, Home Assistant will make sure to load all dependencies and install the requirements of the component.

To register your config flow handler with Home Assistant, register it with the config entries `HANDLERS` registry:

```python
from homeassistant import config_entries

@config_entries.HANDLERS.register(DOMAIN)
class ExampleConfigFlow(config_entries.ConfigFlow):
```

All config flow handlers will also need to add their domain name to the `FLOWS` constant in `homeassistant/config_entries.py`.

## Discovering your config flow

Home Assistant has a discovery integration that scans the network for available devices and services and will trigger the config flow of the appropriate integration. Discovery is limited to UPnP and zeroconf/mDNS.

To have your integration be discovered, you will have to extend the [NetDisco library](https://github.com/home-assistant/netdisco) to be able to find your device. This is done by adding a new discoverable. [See the repository for examples of existing discoverable.](https://github.com/home-assistant/netdisco/tree/master/netdisco/discoverables)

Once done, you will have to update the discovery integration to make it aware which discovery maps to which integration, by updating [this list](https://github.com/home-assistant/home-assistant/blob/dev/homeassistant/components/discovery/__init__.py#L55).

Finally, you will have to add support to your config flow to be triggered from discovery. This is done by adding a new discovery step. Make sure that your discovery step does not automatically create an entry. All discovered config flows are required to have a confirmation from the user.

Once discovered, the user will be notified that they can continue the flow from the config panel.

```python
@config_entries.HANDLERS.register(DOMAIN)
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    async def async_step_discovery(self, info):
        # Handle discovery info
```

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

When the translations are merged into Home Assistant, they will be automatically uploaded to [Lokalise](https://lokalise.co/) where the translation team will help to translate them in other languages. [More info on translating Home Assistant.](internationalization_translation.md)

## Triggering other config flows

If you are writing an integration that discovers other integrations, you will want to trigger their config flows so the user can set them up. Do this by passing a source parameter and optional user input when initializing the config entry:

```python
await hass.config_entries.flow.async_init(
    'hue', data=discovery_info,
    context={'source': config_entries.SOURCE_DISCOVERY})
```
