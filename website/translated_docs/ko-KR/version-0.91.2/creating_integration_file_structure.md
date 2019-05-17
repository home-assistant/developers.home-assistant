---
title: Integration File Structure
sidebar_label: File Structure
id: version-0.91.2-creating_integration_file_structure
original_id: creating_integration_file_structure
---

Each integration is stored inside a directory named after the integration domain. The domain is a short name consisting of characters and underscores. This domain has to be unique and cannot be changed. Example of the domain for the mobile app integration: `mobile_app`. So all files for this integration are in the folder `mobile_app/`.

The bare minimum content of this folder looks like this:

- `manifest.json`: The manifest file describes the integration and its dependencies. [More info](creating_integration_manifest.md)
- `__init__.py`: The component file. If the integration only offers a platform, you can keep this file limited to a docstring introducing the integration `"""The Mobile App integration."""`.

## Integrating devices - `light.py`, `switch.py` etc

If your integration is going to integrate one or more devices, you will need to do this by creating a platform that interacts with an entity integration. For example, if you want to represent a light device inside Home Assistant, you will create `light.py`, which will contain a light platform for the light integration.

- More info on [available entity integrations](entity_index.md).
- More info on [creating platforms](creating_platform_index.md).

## Integrating services - `services.yaml`

If your integration is going to register services, it will need to provide a description of the available services. The description is stored in `services.yaml`. [More information about `services.yaml`.](dev_101_services.md)

## Where Home Assistant looks for integrations

Home Assistant will look for an integration when it sees the domain referenced in the config file (i.e. `mobile_app:`) or if it is a dependency of another integration. Home Assistant will look at the following locations:

- `<config directory>/custom_components/<domain>`
- `homeassistant/components/<domain>` (built-in integrations)

You can override a built-in integration by having an integration with the same domain in your `config/custom_components` folder. Note that overriding built-in components is not recommended as you will no longer get updates. It is recommended to pick a unique name.