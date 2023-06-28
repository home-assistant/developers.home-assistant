---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "Changes to entity naming"
---

There have been a couple of changes to entity naming:
- Marking an entity as the single main feature of a device is now done by explicitly setting the entity's `name` property to `None`, implicitly marking an entity as the single main feature of a device by not setting the `name` property is no longer supported.
- Unnamed entities from certain platforms now get a default name based on their device class, this includes `binary_sensor`, `button`, `number` and `sensor` entities.

More details can be found in the [entity naming documentation](/docs/core/entity#entity-naming).
