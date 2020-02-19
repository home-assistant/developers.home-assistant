---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: Introducing Integrations
---

We have finished [the great migration](/blog/2019/02/19/the-great-migration.html). The result will be released as part of Home Assistant 0.92. The release has been a bit delayed because we had a lot of things to fix! With the migration done, we now consider components and platforms that share the same name to be part of the same integration. Each integration is either a single Python file, or a folder with an `__init__.py`. file. We have updated the documentation and introduced a new section for [integrations](/docs/en/creating_integration_file_structure.html).

Home Assistant 0.92 introduces a new [`manifest.json`](/docs/en/creating_integration_manifest.html) for integrations. This file, which is optional for custom components, is used by integrations to specify metadata: name, link to the documentation, dependencies, requirements and code owners. We are exploring leveraging `manifest.json` for additional future features, like tracking breaking changes or allowing custom components to provide config flows and being discovered.

With all these changes, we had to drop a few deprecated things and change some behavior:

 - Platforms can no longer be in the directory of the entity component, like `light/my_platform.py`. Instead, create a new `my_platform` folder in your custom_components, create an empty `__init__.py` file and move `light/my_platform.py` to `my_platform/light.py`.
 - Platforms can no longer have dependencies or requirements. Instead, create a [`manifest.json`](/docs/en/creating_integration_manifest.html) in the `my_platform` folder to specify them, or add `REQUIREMENTS` or `DEPENDENCIES` constants to the `__init__.py` file.
 - A platform will now always require the component, if available, to be set up first.
 - It is no longer possible to provide translations for components that are contained in a single Python file. Convert them to an integration in [a directory](/docs/en/creating_integration_file_structure.html).
 - If you want to override a built-in integration, you need to specify a `manifest.json` for your custom integration. Note that we strongly discourage overriding built-in integrations. Instead, if you want to run an integration with custom changes change the integration name. For example if you want to run a custom version of the MQTT integration, named `mqtt` in Home Assistant:
    - Copy the content of the `mqtt` folder from [the Home Assistant repository](https://github.com/home-assistant/home-assistant/tree/dev/homeassistant/components/mqtt) to a new folder `<config>/custom_components/mqtt_custom/`
    - Open `mqtt_custom/manifest.json` and change the value for `domain` from `mqtt` to `mqtt_custom`
    - Open `mqtt_custom/__init__.py` and change the value of `DOMAIN` from `mqtt` to `mqtt_custom`
    - Anywhere in your config where you referenced `mqtt`, reference `mqtt_custom`. So use `mqtt_custom:` to specify the host and use `platform: mqtt_custom` when specifying platforms.
