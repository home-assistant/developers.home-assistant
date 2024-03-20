---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "New state timestamp State.last_reported"
---

The `State` object is now always updated and an event is always fired when an integration sets the state of an entity, regardless of any change to the state or a state attribute. This is implemented by adding a new timestamp, `State.last_reported` and a new event `state_reported`.

The `state_reported` event is fired in large volume, and must be used with care to avoid detrimental effects on system load:
 - Event listeners which subscribe to all events are not called when `state_reported` is fired.
 - It's not allowed to listen to `state_reported` events for all entities.
 - When listening to `state_reported`, an `event_filter` must be used to screen out events for other entities.
 - When listening to `state_reported`, the `run_immediately` flag must be set.
 
### Background

Home Assistant previously discarded state writes where neither the state nor the state attributes were changed, unless the integration set the `force_update` flag. This behavior made it very difficult for integrations to correctly do time series analysis of numerical sensor state. It also meant the user didn't know if an integration is updating a sensor or not.

The new timestamp and associated event were discussed in architecure discussion [#1062](https://github.com/home-assistant/architecture/discussions/1062).

### Custom integration impact

The following APIs have breaking changes:
- The `time_fired` argument for `hass.bus.async_fire` now accepts a `float` timestamp instead of a `datetime` object.
- The signature of event filters which can be passed to `hass.bus.async_listen` has changed.
- The `time_fired: datetime | None` argument for `Event()` has been replaced with `time_fired_timestamp: float | None`.
- A new argument `last_reported: datetime` has been added to `State()` in the middle of the argument list.

For more details, see [`core PR #113511`](https://github.com/home-assistant/core/pull/113511) and [`core PR #113798`](https://github.com/home-assistant/core/pull/113798).
