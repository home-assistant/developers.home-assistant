---
title: "Entity Architecture"
sidebar_label: Entity
---

![Architecture overview of Hass.io](/img/en/architecture/entities_architecture.png)

## Configuration

Configuration is provided by the [configuration.yaml file](configuration_yaml_index.md) or by a [Config Entry](config_entries_index.md).

## Component

Examples of components: `light`, `switch`.

The component is responsible for defining the Abstract Entity Class and services to control the entities.

## Entity Component

The Entity Component is responsible for:

 - Distributing the configuration to the platforms
 - Forward config entries and discoveries
 - Collect entities for service calls
 - Optionally maintain a group of all entities

## Entity Platform

The Entity Platform manages all entities for the platform and polls them for updates if necessary.

When adding entities, the Entity Platform will query the Entity Registry to make sure that the entities to be added have the correct entity IDs.

## Entity Registry

The [Entity Registry](entity_registry_index.md) will track entities and allows users to store extra settings for an entity.

## Platform

Examples of platforms: `light.hue`, `switch.wemo`.

Platform uses configuration to query the external device/service and add entities to the entity platform.
