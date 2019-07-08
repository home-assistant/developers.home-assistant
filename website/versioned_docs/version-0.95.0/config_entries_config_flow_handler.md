---
title: Integration Configuration
sidebar_label: Configuration
id: version-0.95.0-config_entries_config_flow_handler
original_id: config_entries_config_flow_handler
---

> This option is currently only available for built-in components.

Integrations can be set up via the user interface by adding support for a config config to create a config entry. Components that want to support config entries will need to define a Config Flow Handler. This handler will manage the creation of entries from user input, discovery or other sources (like Hass.io).

Config Flow Handlers control the data that is stored in a config entry. This means that there is no need to validate that the config is correct when Home Assistant starts up. It will also prevent breaking changes, because we will be able to migrate configuration entries to new formats if the version changes.

When instantiating the handler, Home Assistant will make sure to load all dependencies and install the requirements of the component.

## Updating the manifest

You need to update your integrations manifest to inform Home Assistant that your integration has a config flow. This is done by adding `config_flow: true` to your manifest ([docs](creating_integration_manifest.md#config-flow)).

## Defining your config flow

Config entries uses the [data flow entry framework](data_entry_flow_index.md) to define their config flows. The config flow needs to be defined in the file `config_flow.py` in your integration folder.

To define it, extend the ConfigFlow base class from the config entries module, and decorate it with the `HANDLERS.register` decorator:

```python
from homeassistant import config_entries

@config_entries.HANDLERS.register(DOMAIN)
class ExampleConfigFlow(config_entries.ConfigFlow):
```

## Defining steps

Your config flow will need to define steps of your configuration flow. The docs for [Data Entry Flow](data_entry_flow_index.md) describe the different return values of a step. Here is an example on how to define the `user` step.

```python
@config_entries.HANDLERS.register(DOMAIN)
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    async def async_step_user(self, info):
        if info is not None:
            # process info

        return self.async_show_form(
            step_id='init',
            data_schema=vol.Schema({
              vol.Required('password'): str
            })
        )
```

There are a few step names reserved for system use:

| Step name | Description |
| --------- | ----------- |
| `user` | Invoked when a user initiates a flow via the user interface.
| `zeroconf` | Invoked if your integration has been discovered via Zeroconf/mDNS as specified [using `zeroconf` in the manifest](creating_integration_manifest.md#zeroconf).
| `homekit` | Invoked if your integration has been discovered via HomeKit as specified [using `homekit` in the manifest](creating_integration_manifest.md#homekit).
| `ssdp` | Invoked if your integration has been discovered via SSDP/uPnP as specified [using `ssdp` in the manifest](creating_integration_manifest.md#ssdp).
| `discovery` | _DEPRECATED_ Invoked if your integration has been discovered by the discovery integration.

## Discovery steps

When an integration is discovered, their respective discovery step is invoked with the discovery information. The step will have to check the following things:

 - Make sure there are no other instances of this config flow in progress of setting up the discovered device. This can happen if there are multiple ways of discovering that a device is on the network.
 - Make sure that the device is not already set up.
 - Invoking a discovery step should never result in a finished flow and a config entry. Always confirm with the user.

 ## Discoverable integrations that require no authentication

If your integration is discoverable without requiring any authentication, you'll be able to use the Discoverable Flow that is built-in. This flow offers the following features:

 - Detect if devices/services can be discovered on the network before finishing the config flow.
 - Support all manifest-based discovery protocols.
 - Limit to only 1 config entry. It is up to the config entry to discover all available devices.

```python
"""Config flow for LIFX."""
from homeassistant.helpers import config_entry_flow
from homeassistant import config_entries

import aiolifx

from .const import DOMAIN


async def _async_has_devices(hass):
    """Return if there are devices that can be discovered."""
    lifx_ip_addresses = await aiolifx.LifxScan(hass.loop).scan()
    return len(lifx_ip_addresses) > 0


config_entry_flow.register_discovery_flow(
    # Domain of your integration
    DOMAIN,
    # Title of the created config entry
    'LIFX',
    # async method that returns a boolean if devices/services are found
    _async_has_devices,
    # Connection class of the integration
    config_entries.CONN_CLASS_LOCAL_POLL
)
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
