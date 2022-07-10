---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Adopting a new way to name entities"
---

We are working on improving and standardizing our entity naming. This will allow us to show, in the UI, entities in the right context in the future while removing some error-prone magic mangling of entity names from the code base.

The short story is:

- Devices have their name as they have today, for example, "Dishwasher".
- Entities will have their own name (without device, area). Or, they may optionally set the name to `None` (in that case they inherit the device name).
- Device, Area, and Entity names all start with a capital letter, the rest of the words are lower case (unless it's a word that represents a brand/name/abbreviation of course).
- Every entity which has been migrated to follow these rules should set the [`has_entity_name`](https://developers.home-assistant.io/docs/core/entity#entity-naming) property to `True`.

During the migration period, we use the `has_entity_name` property to create "backward compatible" friendly names. In the future, we can show deprecation warnings for entities that don't set this property, and later, remove it entirely.

The frontend is going to be adjusted for this. It will be able to show the entities/devices in various ways, what suits the context the most.

### Example

This illustrates how devices and entities should be named according to the new recommendations (type: entity name / state object's `friendly_name` / `entity_id`).
Developers only need to set device name and entity name, the `friendly_name` and `entity_id` are automatically generated.

- Device: Dishwasher
  - Switch: `None` / Dishwasher / `switch.dishwasher`
  - Sensor: Power usage / Dishwasher Power usage / `sensor.dishwasher_power_usage`
- Device: Laundry machine
  - Switch: `None` / Laundry machine / `switch.laundry_machine`
  - Sensor: Power usage / Laundry machine Power usage / `sensor.laundry_machine_power_usage`

## Background

Home Assistant models the home of a user into three levels:

- Area (eg. Living Room)
- Device (eg. Switch)
- Entity (eg. Power usage)

Entities in Home Assistant are the data points provided by a device and can represent specific controls (a switch of the device, a light of the device).

Because Home Assistant used to only have entities in the first many years of its existence, a lot of functionality is based around entities in Home Assistant, the main one being the UI.

Let’s say you have 2 Shelly switches that report power usage named Dishwasher and Laundry Machine. Both devices have a switch entity and a power sensor. The devices and entities would previously look like this (type: entity name / state object `friendly_name` / `entity_id`):

- Device: Dishwasher
  - Switch: Dishwasher Switch / Dishwasher Switch / `switch.dishwasher_switch`
  - Sensor: Dishwasher Power usage / Dishwasher Power usage / `sensor.dishwasher_power_usage`
- Device: Laundry machine
  - Switch: Laundry machine Switch / Laundry machine Switch / `switch.laundry_machine_switch`
  - Sensor: Laundry machine Power usage / Laundry machine Power usage / `sensor.laundry_machine_power_usage`

### Why is this a problem?

There is not a single source of truth for a device name because entities included the device name in their name.

Because we “solved” a problem for the UI and the `entity_id` by including the device name in the entity name, we now have this solution applied to all places where we use entities and have to work around this solution.

This naming scheme makes it unnecessarily difficult to migrate the UI towards hierarchical views of areas->devices->entities instead of long lists of entities.
