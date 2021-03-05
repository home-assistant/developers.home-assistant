---
title: Entity Registry
sidebar_label: Introduction
---

import Acceptable from '../src/_includes/unique_ids.mdx'
import Unacceptable from '../src/_includes/unique_ids.mdx'

The entity registry is a registry where Home Assistant keeps track of entities. Any entity that is added to Home Assistant which specifies the [`unique_id` attribute](/core/entity.md#generic-properties) will be registered in the registry.

Being registered has the advantage that the same entity will always get the same entity ID. It will also prevent other entities from using that entity ID.

A user is also able to override the name of an entity in the entity registry. When set, the name of the entity registry is used in favor of the name the device might give itself.

## Unique ID

It is important that it is not possible for the user to change the unique ID, because they system would lose all its settings related to it.

An entity is looked up in the registry based on a combination of the platform type (e.g., `light`), and the integration name (domain) (e.g. hue) and the unique ID of the entity. Entities should not include the `domain` (e.g., `your_integration`) and platform type (e.g., `light`) in their Unique ID as the system already accounts for these identifiers.

If a device has a single unique id but provides multiple entities, combine the unique id with unique identifiers for the entities. For example, if a device measures both temperature and humidity, you can uniquely identify the entities using `{unique_id}-{sensor_type}`.

## Unique ID requirements

#### Example acceptable sources for a unique ID:

<Acceptable />

#### Unique ID of last resort:

- Config Entry ID

#### Unacceptable sources for a unique ID:

<Unacceptable />