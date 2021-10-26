---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "Device configuration URL and entity categories"
---

Home Assistant Core 2021.11 introduces two new concepts to make managing devices easier,
device configuration URL and entity categories.

### Device configuration URL

It's now possible to provide a configuration_url as part of the device registry information.
The configuration_url is used in the device card to allow the user to visit the device
for configuration or diagnostics which is not available in Home Assistant.
Note that the URL linked to is not proxied by Home Assistant, so this typically won't work
when connecting to Home Assistant remotely.

[![Screenshot showing visit device](/img/en/blog/2021-10-26-config-entity/configuration_url.png)](/img/en/blog/2021-10-26-config-entity/configuration_url.png)

### Entity categories 

Entities now have an optional property `entity_category` for classifying non-primary
entities. Set to `config` for entities that allow changing the configuration of a device,
for example, a switching entity making it possible to turn the background illumination of a
switch on and off. Set to `diagnostic` for an entity exposing some configuration parameter
or diagnostics of a device but does not allow changing it, for example, a sensor showing
RSSI or MAC address with allowed values.

Entities which have the `entity_category` set:
- Are not included in a service call targetting a whole device or area.
- Are, by default, not exposed to Google Assistant or Alexa.
- Are shown on a separate card on the device configuration page.
- Do not show up on the automatically generated Lovelace Dashboards.

[![Screenshot showing seperation of entity categories](/img/en/blog/2021-10-26-config-entity/entity_categories.png)](/img/en/blog/2021-10-26-config-entity/entity_categories.png)