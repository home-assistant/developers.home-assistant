---
title: "Entities: integrating devices & services"
sidebar_label: "Introduction"
---

Integrations can represent devices & services in Home Assistant. The data points are represented as entities. Entities are standardized by other integrations like `light`, `switch`, etc. Standardized entities come with services for control, but an integration can also provide their own services in case something is not standardized.

An entity abstracts away the internal working of Home Assistant. As an integrator you don't have to worry about how services or the state machine work. Instead, you extend an entity class and implement the necessary properties and methods for the device type that you're integrating.

<img className='invertDark'
  src='/img/en/architecture/integrating-devices-services.svg'
  alt='Integrating devices & services' />

Configuration is provided by the [configuration.yaml file](../configuration_yaml_index.md) or by a [Config Entry](../config_entries_index.md).

The entity integration is responsible for defining the abstract entity class and services to control the entities.

The Entity Component helper is responsible for distributing the configuration to the platforms, forward discovery and collect entities for service calls.

The Entity Platform helper manages all entities for the platform and polls them for updates if necessary. When adding entities, the Entity Platform is responsible for registering the entity with the device and entity registries.

Integration Platform uses configuration to query the external device/service and create entities to be added. It is also possible for integration platforms to register entity services. These services will only target the platform entities (across all platforms that belong to the integration) and are hosted under the device integration domain (ie. hue.activate_scene).

## Entity interaction with Home Assistant Core

The integration entity class that inherits from the entity base class is responsible for fetching the data and handle the service calls. If polling is disabled, it is also responsible for telling Home Assistant when data is available.

<img className='invertDark'
  src='/img/en/architecture/entity-core-interaction.svg'
  alt='Entities interacting with core' />

The entity base class (defined by the entity integration)  is responsible for formatting the data and writing it to the state machine.

The entity registry will write an `unavailable` state for any registered entity that is not currently backed by an entity object.

## Entity data hierarchy

<img className='invertDark'
  style={{maxWidth: "200px"}}
  src='/img/en/architecture/entity-data-hierarchy.svg'
  alt='Entity hierarchy' />

Delete, disable or re-enable any object and all objects below will be adjusted accordingly.
