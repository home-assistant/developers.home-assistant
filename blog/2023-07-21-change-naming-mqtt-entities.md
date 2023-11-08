---
author: Jan Bouwhuis
authorURL: https://twitter.com/jbouwh
title: The naming of MQTT entities changes to correspond with HA guidelines
---

The way MQTT entities are named and how device configuration can be shared between discovered entities has changed

### Sharing of device configuration

Discovered MQTT entities can share device configuration, meaning one entity can include the full device configuration and other entities can link to that device by only setting mandatory fields.
The mandatory fields were previously limited to at least one of `connection` and `identifiers`, but has now been extended to at least one of `connection` and `identifiers` as well as the `name`.

### Naming of MQTT entities

Naming of MQTT entities has been changed to be aligned with the [entity naming guidelines](https://developers.home-assistant.io/docs/core/entity/#entity-naming):

- The `has_entity_name` entity will be set to `True` on all MQTT entities
- Unnamed `binary_sensor`, `button`, `number` and `sensor` entities will now be named by their device class instead of being named `MQTT binary sensor" etc.
- It's now allowed to set an MQTT entity's name to `None` to mark it as the main feature of a device
