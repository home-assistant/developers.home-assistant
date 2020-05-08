---
title: "Integration Manifest"
sidebar_label: "Manifest"
---

Since 0.92.0, every integration has a manifest file to specify basic information about an integration. This file is stored as `manifest.json` in your integration directory. It is required to add such a file, except for custom components.

```json
{
  "domain": "hue",
  "name": "Philips Hue",
  "documentation": "https://www.home-assistant.io/components/hue",
  "issue_tracker": "https://github.com/balloob/hue/issues",
  "dependencies": ["mqtt"],
  "after_dependencies": ["http"],
  "codeowners": ["@balloob"],
  "requirements": ["aiohue==1.9.1"],
  "quality_scale": "platinum"
}
```

Or a minimal example that you can copy into your project:

```json
{
  "domain": "your_domain_name",
  "name": "Your Integration",
  "documentation": "https://www.example.com",
  "dependencies": [],
  "codeowners": [],
  "requirements": []
}
```

## Domain

The domain is a short name consisting of characters and underscores. This domain has to be unique and cannot be changed. Example of the domain for the mobile app integration: `mobile_app`.

## Name

The name of the integration.

## Documentation

The website containing documentation on how to use your integration. If this integration is being submitted for inclusion in Home Assistant, it should be `https://www.home-assistant.io/integrations/<domain>`

## Issue Tracker

The issue tracker of your integration, where users reports issues if they run into one.
If this integration is being submitted for inclusion in Home Assistant, it should be omitted. For built-in integrations, Home Assistant will automatically generate the correct link.

## Dependencies

Dependencies are other Home Assistant integrations that you want Home Assistant to set up successfully prior to the integration being loaded. This can be necessary in case you want to offer functionality from that other integration, like using webhooks or an MQTT connection.

## After dependencies

This option is used to specify optional dependencies that might be used. When `after_dependencies` is present, set up of an integration will wait for the other dependency to be set up before being set up. It will also make sure that the requirements of `after_dependencies` are installed so methods from the integration can be safely imported.  

## Code Owners

GitHub usernames or team names of people that are responsible for this integration. You should add at least your GitHub username here, as well as anyone who helped you to write code that is being included.

## Config Flow

Specify the `config_flow` key if your integration has a config flow to create a config entry. When specified, the file `config_flow.py` needs to exist in your integration.

```json
{
  "config_flow": true
}
```

## Requirements

Requirements are Python libraries or modules that you would normally install using `pip` for your component. Home Assistant will try to install the requirements into the `deps` subdirectory of the Home Assistant [configuration directory](https://www.home-assistant.io/docs/configuration/) if you are not using a `venv` or in something like `path/to/venv/lib/python3.6/site-packages` if you are running in a virtual environment. This will make sure that all requirements are present at startup. If steps fail, like missing packages for the compilation of a module or other install errors, the component will fail to load.

Requirements is an array of strings. Each entry is a `pip` compatible string. For example, the media player Cast platform depends on the Python package PyChromecast v3.2.0: `["pychromecast==3.2.0"]`.

### Custom requirements during development & testing

During the development of a component, it can be useful to test against different versions of a requirement. This can be done in two steps, using `pychromecast` as an example:

```shell
pip install pychromecast==3.2.0 --target ~/.homeassistant/deps
hass --skip-pip
```

This will use the specified version, and prevent Home Assistant from trying to override it with what is specified in `requirements`.

If you need to make changes to a requirement to support your component, it's also possible to install a development version of the requirement using `pip install -e`:

```shell
git clone https://github.com/balloob/pychromecast.git
pip install -e ./pychromecast
hass --skip-pip
```

It is also possible to use a public git repository to install a requirement.  This can be useful, for example, to test changes to a requirement dependency before it's been published to PyPI. The following example will install the `except_connect` branch of the `pycoolmaster` library directly from GitHub unless version `0.2.2` is currently installed:

```json
{
  "requirements": ["git+https://github.com/issacg/pycoolmaster.git@except_connect#pycoolmaster==0.2.2"]
}
```

## Zeroconf

If your integration supports discovery via [Zeroconf](https://en.wikipedia.org/wiki/Zero-configuration_networking), you can add the type to your manifest. If the user has the `zeroconf` integration loaded, it will load the `zeroconf` step of your integration's config flow when it is discovered.

```json
{
  "zeroconf": ["_googlecast._tcp.local."]
}
```

## SSDP

If your integration supports discovery via [SSDP](https://en.wikipedia.org/wiki/Simple_Service_Discovery_Protocol), you can add the type to your manifest. If the user has the `ssdp` integration loaded, it will load the `ssdp` step of your integration's config flow when it is discovered. We support SSDP discovery by ST, and all data in UPnP device description. The manifest value is a list of matcher dictionaries, your integration is discovered if all items of any of the specified matchers are found in the SSDP/UPnP data. It's up to your config flow to filter out duplicates.

The following example has one matcher consisting of three items, all of which must match for discovery to happen by this config.

```json
{
  "ssdp": [
    {
      "st": "roku:ecp",
      "manufacturer": "Roku",
      "deviceType": "urn:roku-com:device:player:1-0"
    }
  ]
}
```

## HomeKit

If your integration supports discovery via HomeKit, you can add the supported model names to your manifest. If the user has the `zeroconf` integration loaded, it will load the `homekit` step of your integration's config flow when it is discovered.

HomeKit discovery works by testing if the discovered modelname starts with any of the model names specified in the manifest.json.

```json
{
  "homekit": {
    "models": [
      "LIFX"
    ]
  }
}
```

Discovery via HomeKit does not mean that you have to talk the HomeKit protocol to communicate with your device. You can communicate with the device however you see fit.

When a discovery info is routed to your integration because of this entry in your manifest, the discovery info is no longer routed to integrations that listen to the HomeKit zeroconf type.

## Integration Quality Scale

The [Integration Quality Scale](https://www.home-assistant.io/docs/quality_scale/) scores an integration on the code quality and user experience. Each level of the quality scale consists of a list of requirements. If an integration matches all requirements, it's considered to have reached that level.

When your integration has no score, then don't add it to the manifest of your integration. However, be sure to look at the [Integration Quality Scale](https://www.home-assistant.io/docs/quality_scale/) list of requirements. It helps to improve the code and user experience tremendously.

We highly recommend getting your integration scored.

```json
{
 "quality_scale": "silver"
}
```
