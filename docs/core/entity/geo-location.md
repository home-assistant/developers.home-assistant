---
title: Geolocation entity
sidebar_label: Geolocation
---

A geolocation entity represents an external event with an associated location, for example an earthquake, a wildfire, or another point of interest published by an external feed. Each entity carries coordinates and is typically shown as a marker on the map.

A geolocation entity is derived from the [`homeassistant.components.geo_location.GeolocationEvent`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/geo_location/__init__.py).

## States

The state of a geolocation entity is the distance from the event's location to the Home Assistant instance's configured home location, rounded to one decimal. The state is managed by the base entity class and cannot be overridden; set the `distance` property instead. The unit of the distance is declared through the standard `unit_of_measurement` property.

## Properties

:::tip
Properties should always only return information from memory and not do I/O (like network requests). Implement `update()` or `async_update()` to fetch data.
:::

| Name      | Type            | Default      | Description                                                                    |
| --------- | --------------- | ------------ | ------------------------------------------------------------------------------ |
| source    | `str`           | **Required** | Source of the event, typically the domain of the integration providing it.     |
| distance  | `float \| None` | `None`       | Distance from the home location to the event, in `unit_of_measurement`.        |
| latitude  | `float \| None` | `None`       | Latitude of the event.                                                         |
| longitude | `float \| None` | `None`       | Longitude of the event.                                                        |

Other properties that are common to all entities such as `icon`, `name` etc. are also applicable.

The `latitude`, `longitude` and `source` values are exposed as state attributes automatically; coordinates are rounded to five decimals.

## Lifecycle

Unlike most entities, geolocation entities usually represent short-lived external events rather than devices: integrations add entities as new events appear in the external feed and remove them once the events are no longer reported. A common pattern is a manager that subscribes to feed updates and, on each update, adds entities for new events, updates existing ones, and removes entities for vanished events by calling their `async_remove(force_remove=True)` method — the `force_remove` flag ensures a registered entity is removed from the state machine entirely instead of lingering as unavailable. Entities created with a unique ID should also remove their entity registry entry.

The [GDACS integration](https://github.com/home-assistant/core/blob/dev/homeassistant/components/gdacs/geo_location.py) is an example of this pattern, and the [demo platform](https://github.com/home-assistant/core/blob/dev/homeassistant/components/demo/geo_location.py) provides a minimal implementation.
