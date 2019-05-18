---
title: Entity Registry
sidebar_label: Introduction
---

The entity registry is a registry where Home Assistant keeps track of entities. Any entity that is added to Home Assistant and has a unique ID will be registered in the registry.

Being registered has the advantage that the same entity will always get the same entity ID. It will also prevent other entities from using that entity ID.

A user is also able to override the name of an entity in the entity registry. When set, the name of the entity registry is used in favor of the name the device might give itself.

## Unique ID requirements

An entity is looked up in the registry based on a combination of the plaform type (e.g., `light`), and the integration name (domain) (ie hue) and the unique ID of the entity. It is therefore very important that the unique ID is unique! It is also important that it is not possible for the user to change the unique ID, because that means it will lose all its settings related to it.

Good sources for a unique ID:

- Serial number of a device
- MAC address of a device
- latitude/longitude

If a device has a single serial but provides multiple entities, combine the serial with unique identifiers for the entities. For example, if a device measures both temperature and humidity, you can uniquely identify the entities using `{serial}-{sensor_type}`.