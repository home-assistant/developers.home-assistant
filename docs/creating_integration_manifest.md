---
title: "Integration Manifest"
sidebar_label: "Manifest"
---

Every integration has a manifest file to specify basic information about an integration. This file is stored as `manifest.json` in your integration directory. It is required to add such a file.

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
  "quality_scale": "platinum",
  "iot_class": "local_polling"
  "loggers": ["aiohue"]
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
  "requirements": [],
  "iot_class": "cloud_polling"
}
```

## Domain

The domain is a short name consisting of characters and underscores. This domain has to be unique and cannot be changed. Example of the domain for the mobile app integration: `mobile_app`. The domain key has to match the directory this file is in.

## Name

The name of the integration.

## Version

For core integrations, this should be omitted.

The version of the integration is required for custom integrations. The version needs to be a valid version recognized by [AwesomeVersion](https://github.com/ludeeus/awesomeversion) like [CalVer](https://calver.org/) or [SemVer](https://semver.org/).

## Integration Type

Define what kind of integration this is. Currently accepted values are `integration` and `helper`. Helpers are integrations that provide entities to help the user with automations like input boolean, derivative or group.

Defaults to `integration` if not set.

## Documentation

The website containing documentation on how to use your integration. If this integration is being submitted for inclusion in Home Assistant, it should be `https://www.home-assistant.io/integrations/<domain>`

## Issue Tracker

The issue tracker of your integration, where users reports issues if they run into one.
If this integration is being submitted for inclusion in Home Assistant, it should be omitted. For built-in integrations, Home Assistant will automatically generate the correct link.

## Dependencies

Dependencies are other Home Assistant integrations that you want Home Assistant to set up successfully prior to the integration being loaded. This can be necessary in case you want to offer functionality from that other integration, like using webhooks or an MQTT connection.

Built-in integrations shall only specify other built-in integrations in `dependencies`. Custom integrations may specify both built-in and custom integrations in `dependencies`.

## After dependencies

This option is used to specify dependencies that might be used by the integration but aren't essential. When `after_dependencies` is present, set up of an integration will wait for the `after_dependencies` to be set up before being set up. It will also make sure that the requirements of `after_dependencies` are installed so methods from the integration can be safely imported.  For example, if the `camera` integration might use the `stream` integration in certain configurations, adding `stream` to `after_dependencies` of `camera`'s manifest, will ensure that `stream` is loaded before `camera` if it is configured.  If `stream` is not configured, `camera` will still load.

Built-in integrations shall only specify other built-in integrations in `after_dependencies`. Custom integrations may specify both built-in and custom integrations in `after_dependencies`.

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

### Custom integration requirements

Custom integrations should only include requirements that are not required by the Core [requirements.txt](https://github.com/home-assistant/core/blob/dev/requirements.txt).

## Loggers

The `loggers` field is a list of names that the integration's requirements use for their [getLogger](https://docs.python.org/3/library/logging.html?highlight=logging#logging.getLogger) calls.

## Supported Brands

Some products are supported by integrations that are not named after the product. For example, Roborock vacuums are integrated via the Xiaomi Miio (xiaomi_miio) integration.

By using the `supported_brands` manifest entry it's possible to specify other brands that work with this integration.

Example:

```json
{
  "supported_brands": {
    "roborock": "Roborock"
  }
}
```

The key is a domain, like we use for integrations. The value is the title.
Each integration domain can only exist once. So a domain is either an existing integration or referred as a "supported brand" by a single existing integration.

The logo for this domain should be added to our [brands repository](https://github.com/home-assistant/brands/).

Result:

- Roborock is listed on our user documentation website under integrations with an automatically generated stub page that directs the user to the integration to use.
- Roborock is listed in Home Assistant when clicking "add integration". When selected, we first show a "redirect text", then the user continues to the Xioami Miio config flow.


## Bluetooth

If your integration supports discovery via bluetooth, you can add a matcher to your manifest. If the user has the `bluetooth` integration loaded, it will load the `bluetooth` step of your integration's config flow when it is discovered. We support listening for Bluetooth discovery by matching on `local_name`, `service_uuid`, `service_data_uuid`, `manufacturer_id`, and `manufacturer_data_start`. The `manufacturer_data_start` field expects a list of bytes encoded as integer values from 0-255. The manifest value is a list of matcher dictionaries, your integration is discovered if all items of any of the specified matchers are found in the Bluetooth data. It's up to your config flow to filter out duplicates.

The following example will match Nespresso Prodigio machines:

```json
{
  "bluetooth": [
    {
      "local_name": "Prodigio_*"
    }
  ]
}
```

The following example will match service data with a 128 bit uuid used for SwitchBot bot and curtain devices:

```json
{
  "bluetooth": [
    {
      "service_uuid": ["cba20d00-224d-11e6-9fb8-0002a5d5c51b"]
    }
  ]
}
```

If you want to match service data with a 16 bit uuid, you will have to convert it to a 128 bit uuid first, by replacing the 3rd and 4th byte in `00000000-0000-1000-8000-00805f9b34fb` with the 16 bit uuid. For example, for Switchbot sensor devices, the 16 bit uuid is `0xfd3d`, the corresponding 128 bit uuid becomes `0000fd3d-0000-1000-8000-00805f9b34fb`. The following example will therefore match service data with a 16 bit uuid used for SwitchBot sensor devices:

```json
{
  "bluetooth": [
    {
      "service_data_uuid": ["0000fd3d-0000-1000-8000-00805f9b34fb"]
    }
  ]
}
```

The following example will match HomeKit devices:


```json
{
  "bluetooth": [
    {
      "manufacturer_id": 76,
      "manufacturer_data_start": [6]
    }
  ]
}
```


## Zeroconf

If your integration supports discovery via [Zeroconf](https://en.wikipedia.org/wiki/Zero-configuration_networking), you can add the type to your manifest. If the user has the `zeroconf` integration loaded, it will load the `zeroconf` step of your integration's config flow when it is discovered.

Zeroconf is a list so you can specify multiple types to match on.

```json
{
  "zeroconf": ["_googlecast._tcp.local."]
}
```

Certain zeroconf types are very generic (i.e., `_printer._tcp.local.`, `_axis-video._tcp.local.` or `_http._tcp.local`). In such cases you should include a Name (`name`), or Properties (`properties`) filter:

```json
{
  "zeroconf": [
    {"type":"_axis-video._tcp.local.","properties":{"macaddress":"00408c*"}},
    {"type":"_axis-video._tcp.local.","name":"example*"},
    {"type":"_airplay._tcp.local.","properties":{"am":"audioaccessory*"}},
   ]
}
```

Note that all values in the `properties` filters must be lowercase, and may contain a fnmatch type wildcard.

## SSDP

If your integration supports discovery via [SSDP](https://en.wikipedia.org/wiki/Simple_Service_Discovery_Protocol), you can add the type to your manifest. If the user has the `ssdp` integration loaded, it will load the `ssdp` step of your integration's config flow when it is discovered. We support SSDP discovery by the SSDP ST, USN, EXT, and Server headers (header names in lowercase), as well as data in [UPnP device description](https://openconnectivity.org/developer/specifications/upnp-resources/upnp/basic-device-v1-0/). The manifest value is a list of matcher dictionaries, your integration is discovered if all items of any of the specified matchers are found in the SSDP/UPnP data. It's up to your config flow to filter out duplicates.

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

## MQTT

If your integration supports discovery via MQTT, you can add the topics used for discovery. If the user has the `mqtt` integration loaded, it will load the `mqtt` step of your integration's config flow when it is discovered.

MQTT discovery works by subscribing to MQTT topics specified in the manifest.json.

```json
{
  "mqtt": [
    "tasmota/discovery/#"
  ]
}
```

## DHCP

If your integration supports discovery via dhcp, you can add the type to your manifest. If the user has the `dhcp` integration loaded, it will load the `dhcp` step of your integration's config flow when it is discovered. We support passively listening for DHCP discovery by the `hostname` and [OUI](https://en.wikipedia.org/wiki/Organizationally_unique_identifier), or matching device registry mac address when `registered_devices` is set to `true`. The manifest value is a list of matcher dictionaries, your integration is discovered if all items of any of the specified matchers are found in the DHCP data. It's up to your config flow to filter out duplicates.

If an integration wants to receive discovery flows to update the IP Address of a device when it comes
online, but a `hostname` or `oui` match would be too broad, and it has registered in the device registry with mac address using the `CONNECTION_NETWORK_MAC`,
it should add a DHCP entry with `registered_devices` set to `true`.

If the integration supports `zeroconf` or `ssdp`, these should be preferred over `dhcp` as it generally offers a better
user experience.

The following example has three matchers consisting of two items. All of the items in any of the three matchers must match for discovery to happen by this config.

For example:

-  If the `hostname` was `Rachio-XYZ` and the `macaddress` was `00:9D:6B:55:12:AA`, the discovery would happen.
-  If the `hostname` was `Rachio-XYZ` and the `macaddress` was `00:00:00:55:12:AA`, the discovery would not happen.
-  If the `hostname` was `NotRachio-XYZ` and the `macaddress` was `00:9D:6B:55:12:AA`, the discovery would not happen.


```json
{
  "dhcp": [
    {
    "hostname": "rachio-*",
    "macaddress": "009D6B*"
    },
    {
    "hostname": "rachio-*",
    "macaddress": "F0038C*"
    },
    {
    "hostname": "rachio-*",
    "macaddress": "74C63B*"
    }
  ]
}
```

Example with setting `registered_devices` to `true`:

```json
{
  "dhcp": [
    {
    "hostname": "myintegration-*",
    },
    {
    "registered_devices": true,
    }
  ]
}
```

## USB

If your integration supports discovery via usb, you can add the type to your manifest. If the user has the `usb` integration loaded, it will load the `usb` step of your integration's config flow when it is discovered. We support discovery by VID (Vendor ID), PID (Device ID), Serial Number, Manufacturer, and Description by extracting these values from the USB descriptor. For help identifiying these values see [How To Identify A Device](https://wiki.debian.org/HowToIdentifyADevice/USB). The manifest value is a list of matcher dictionaries. Your integration is discovered if all items of any of the specified matchers are found in the USB data. It's up to your config flow to filter out duplicates.

:::warning
Some VID and PID combinations are used by many unrelated devices. For example VID `10C4` and PID `EA60` matches any Silicon Labs CP2102 USB-Serial bridge chip. When matching these type of devices, it is important to match on `description` or another identifer to avoid an unexpected discovery.
:::

The following example has two matchers consisting of two items. All of the items in any of the two matchers must match for discovery to happen by this config.

For example:

-  If the `vid` was `AAAA` and the `pid` was `AAAA`, the discovery would happen.
-  If the `vid` was `AAAA` and the `pid` was `FFFF`, the discovery would not happen.
-  If the `vid` was `CCCC` and the `pid` was `AAAA`, the discovery would not happen.
-  If the `vid` was `1234`, the `pid` was `ABCD`, the `serial_number` was `12345678`, the `manufacturer` was `Midway USB`, and the `description` was `Version 12 Zigbee Stick`, the discovery would happen.

```json
{
  "usb": [
    {
    "vid": "AAAA",
    "pid": "AAAA"
    },
    {
    "vid": "BBBB",
    "pid": "BBBB"
    },
    {
    "vid": "1234",
    "pid": "ABCD",
    "serial_number": "1234*",
    "manufacturer": "*midway*",
    "description": "*zigbee*"
    },
  ]
}
```

## Integration Quality Scale

The [Integration Quality Scale](https://www.home-assistant.io/docs/quality_scale/) scores an integration on the code quality and user experience. Each level of the quality scale consists of a list of requirements. If an integration matches all requirements, it's considered to have reached that level.

When your integration has no score, then don't add it to the manifest of your integration. However, be sure to look at the [Integration Quality Scale](https://www.home-assistant.io/docs/quality_scale/) list of requirements. It helps to improve the code and user experience tremendously.

We highly recommend getting your integration scored.

```json
{
 "quality_scale": "silver"
}
```

## IoT Class

The [IoT Class][iot_class] describes how an integration connects with, e.g., a device or service. For more information
about IoT Classes, read the blog about ["Classifying the Internet of Things"][iot_class].

The following IoT classes are accepted in the manifest:

- `assumed_state`: We are unable to get the state of the device. Best we can do is to assume the state based on our last command.
- `cloud_polling`: The integration of this device happens via the cloud and requires an active internet connection. Polling the state means that an update might be noticed later.
- `cloud_push`: Integration of this device happens via the cloud and requires an active internet connection. Home Assistant will be notified as soon as a new state is available.
- `local_polling`: Offers direct communication with device. Polling the state means that an update might be noticed later.
- `local_push`: Offers direct communication with device. Home Assistant will be notified as soon as a new state is available.
- `calculated`: The integration does not handle communication on its own, but provides a calculated result.

[iot_class]: https://www.home-assistant.io/blog/2016/02/12/classifying-the-internet-of-things/#classifiers
