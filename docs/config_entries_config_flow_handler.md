---
title: Integration Configuration
sidebar_label: Configuration
---

Integrations can be set up via the user interface by adding support for a config flow to create a config entry. Components that want to support config entries will need to define a Config Flow Handler. This handler will manage the creation of entries from user input, discovery or other sources (like Hass.io).

Config Flow Handlers control the data that is stored in a config entry. This means that there is no need to validate that the config is correct when Home Assistant starts up. It will also prevent breaking changes, because we will be able to migrate configuration entries to new formats if the version changes.

When instantiating the handler, Home Assistant will make sure to load all dependencies and install the requirements of the component.

## Updating the manifest

You need to update your integrations manifest to inform Home Assistant that your integration has a config flow. This is done by adding `config_flow: true` to your manifest ([docs](creating_integration_manifest.md#config-flow)).

## Defining your config flow

Config entries uses the [data flow entry framework](data_entry_flow_index.md) to define their config flows. The config flow needs to be defined in the file `config_flow.py` in your integration folder, extend `homeassistant.config_entries.ConfigFlow` and pass a `domain` key as part of inheriting `ConfigFlow`.

```python
from homeassistant import config_entries
from .const import DOMAIN


class ExampleConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Example config flow."""
```

Once you have updated your manifest and created the `config_flow.py`, you will need to run `python3 -m script.hassfest` (one time only) for Home Assistant to activate the config entry for your integration.

## Defining steps

Your config flow will need to define steps of your configuration flow. The docs for [Data Entry Flow](data_entry_flow_index.md) describe the different return values of a step. Here is an example on how to define the `user` step.

```python
import voluptuous as vol

class ExampleConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    async def async_step_user(self, info):
        if info is not None:
            pass  # TODO: process info

        return self.async_show_form(
            step_id="user", data_schema=vol.Schema({vol.Required("password"): str})
        )
```

There are a few step names reserved for system use:

| Step name   | Description                                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discovery` | _DEPRECATED_ Invoked if your integration has been discovered by the discovery integration.                                                                    |
| `homekit`   | Invoked if your integration has been discovered via HomeKit as specified [using `homekit` in the manifest](creating_integration_manifest.md#homekit).         |
| `mqtt`      | Invoked if your integration has been discovered via MQTT as specified [using `mqtt` in the manifest](creating_integration_manifest.md#mqtt).             |
| `ssdp`      | Invoked if your integration has been discovered via SSDP/uPnP as specified [using `ssdp` in the manifest](creating_integration_manifest.md#ssdp).             |
| `user`      | Invoked when a user initiates a flow via the user interface.                                                                                                  |
| `zeroconf`  | Invoked if your integration has been discovered via Zeroconf/mDNS as specified [using `zeroconf` in the manifest](creating_integration_manifest.md#zeroconf). |

## Unique IDs

A config flow can attach a unique ID to a config flow to avoid the same device being set up twice. When a unique ID is set, it will immediately abort if another flow is in progress for this unique ID. You can also quickly abort if there is already an existing config entry for this ID. Config entries will get the unique ID of the flow that creates them.

Call inside a config flow step:

```python
await self.async_set_unique_id(device_unique_id)
self._abort_if_unique_id_configured()
```

By setting a unique ID, users will have the option to ignore the discovery of your config entry. That way, they won't be bothered about it anymore.
If the integration uses HomeKit, Zeroconf/mDNS or SSDP/uPnP to be discovered, supplying a unique ID is required.

If a unique ID isn't available, alternatively, the `zeroconf`, `homekit`, `ssdp` and `discovery` steps can be omitted, even if they are configured in
the integration manifest. In that case, the `user` step will be called when the item is discovered.

Alternatively, if an integration can't get a unique ID all the time (e.g., multiple devices, some have one, some don't), a helper is available
that still allows for discovery, as long as there aren't any instances of the integrations configured yet.

```python
if device_unique_id:
  await self.async_set_unique_id(device_unique_id)
await self._async_handle_discovery_without_unique_id()
```

### Unignoring

Your configuration flow can add support to re-discover the previously ignored entry by implementing the unignore step in the config flow.

```python
async def async_step_unignore(self, user_input):
    unique_id = user_input["unique_id"]
    await self.async_set_unique_id(unique_id)

    # TODO: Discover devices and find the one that matches the unique ID.

    return self.async_show_form(…)
```

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

To get started, run `python3 -m script.scaffold config_flow_discovery` and follow the instructions. This will create all the boilerplate necessary to configure your integration using discovery.

## Configuration via OAuth2

Home Assistant has built-in support for integrations that offer account linking using [the OAuth2 authorization framework](https://tools.ietf.org/html/rfc6749). To be able to leverage this, you will need to structure your Python API library in a way that allows Home Assistant to be responsible for refreshing tokens. See our [API library guide](api_lib_index.md) on how to do this.

The built-in OAuth2 support works out of the box with locally configured client ID / secret and with the Home Assistant Cloud Account Linking service. This service allows users to link their account with a centrally managed client ID/secret. If you want your integration to be part of this service, reach out to us at [hello@home-assistant.io](mailto:hello@home-assistant.io).

To get started, run `python3 -m script.scaffold config_flow_oauth2` and follow the instructions. This will create all the boilerplate necessary to configure your integration using OAuth2.

## Translations

Translations for the config flow handlers are defined under the `config` key in the component translation file `strings.json`. Example of the Hue component:

```json
{
  "title": "Philips Hue Bridge",
  "config": {
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

When the translations are merged into Home Assistant, they will be automatically uploaded to [Lokalise](https://lokalise.co/) where the translation team will help to translate them in other languages. While developing locally, you will need to run `python3 -m script.translations develop` to see changes made to `strings.json` [More info on translating Home Assistant.](translations.md)
