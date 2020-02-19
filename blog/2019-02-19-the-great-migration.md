---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: The Great Migration
---

Home Assistant is based around components. One type of components is the one that provide an entity abstraction for a type of device, like lights, switches or media players. Historically, to integrate with these abstractions, you would create a platform for this component. If the light component would be `light/`, the integration would create its platform as `light/hue.py`. This way, all logic for the lights was kept together.

As Home Assistant grown, so has the capabilities/size of the devices/services that we've integrated with. It's no longer that an integration is just a platform for an entity component, it is five platforms + a component to manage the connection. With integrations that big, having the files be spread out as `light/zwave.py`, `switch/zwave.py`, `cover/zwave.py` etc becomes a maintenance hell. It also makes distribution of custom components harder, as now users need to create files across different folders.

So with Home Assistant 0.87 we started a migration. Instead of looking up platforms for entity components as `light/hue.py`, we will now look it up as `hue/light.py`. The content of the file will stay exactly the same. By moving the files out of the entity component folder, we will also be able to break up big entity components into multiple files, to support maintainability.

This change has been implemented mostly backwards compatible with a minor breaking change for custom components: if you override a built-in platform, you will now need to use the new `hue/light.py` filename format.

With the consolidation of integration files into a single folder, we're also going to enforce a new rule: all platforms will be loaded from the same source as the component. This means that if you want to override a built-in component/platform with a custom version, you will need to copy over all component and platform files, not just the one you want to load. By doing so, we can prevent custom platforms or components from breaking if a Home Assistant upgrade moves internal files/values around.

## Notes for custom component developers

- Components are created in `<config>/custom_components/<integration name>/`. Always make sure you create at least an empty `__init__.py` file in that folder.
- If you make a platform for an entity component, put it in the folder with the name of the integration: `<integration name>/light.py`
- If you want to share an adjusted version of a Home Assistant integration, copy over ALL the files. Do your users a favor and stick to relative imports to avoid having your component break during an upgrade. Example of a relative import is `from . import DATA_BRIDGE`.

## Resources

Related architecture issues:

 - [Embedded platforms and the road to packaged components](https://github.com/home-assistant/architecture/issues/124)
 - [Disable partial custom component overlays](https://github.com/home-assistant/architecture/issues/141)
 - [Config structure for embedded platforms](https://github.com/home-assistant/architecture/issues/142)
