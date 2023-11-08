---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "Updated to the Vacuum entity integration"
---

The Vacuum entity has seen some recent changes:
- The `VacuumEntity` base class was superseded by `StateVacuumEntity` by [PR 15573](https://github.com/home-assistant/core/pull/15573) which was merged in August 2018, and has now been scheduled for removal in Home Assistant Core 2024.2.0. All core integrations are already updated, but custom component integration authors need to update their integrations. [PR 95920](https://github.com/home-assistant/core/pull/95920) is a recent example of migrating from `VacuumEntity` to `StateVacuumEntity`.
- Services supported by `VacuumEntity` and `StateVacuumEntity` differ, but the documentation was a bit ambiguous causing some integrations to implement services from the wrong base class. This is now prevented by [PR 95833](https://github.com/home-assistant/core/pull/95833). All core integrations are already updated, but custom component integration authors need to update their integrations.
- The `battery_icon` + `battery_level` state attributes have been deprecated. Integrations can instead report battery status by adding a `sensor` with device class `battery` to the same device as the `vacuum` entity, see architecture discussion [938](https://github.com/home-assistant/architecture/discussions/938) for details.
- The `map` state attribute has been deprecated. Integrations can instead provide a map image by adding an `image` entity to the same device as the `vacuum` entity, see architecture discussion [939](https://github.com/home-assistant/architecture/discussions/939) for details.

For more details, refer to the [`vacuum` documentation](/docs/core/entity/vacuum).
