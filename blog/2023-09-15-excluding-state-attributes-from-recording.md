---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "New way of excluding state attributes from recording"
---

The way in which state attributes are excluded from recording has changed

The recorder platforms have been replaced with two new attribute which can be set in classes derived from `Entity`:
- `_component_unstored_attributes: frozenset[str]` - This should be set by base component entity classes, e.g. `LightEntity`
- `_platform_unstored_attributes: frozenset[str]` - This should be set by derived platform classes, e.g. `HueLight` to exclude 
additional, integration specific, attributes from recording.


More details can be found in the [entity documentation](/docs/core/entity#excluding-state-attributes-from-recorder-history).

Background for the change is in [architecture discussion #964](https://github.com/home-assistant/architecture/discussions/964).
