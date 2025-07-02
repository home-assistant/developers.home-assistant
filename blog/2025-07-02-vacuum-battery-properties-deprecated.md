---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
authorImageURL: https://avatars.githubusercontent.com/u/62932417?v=4
authorTwitter: GJohansson
title: "Vacuum battery properties are deprecated"
---

As of Home Assistant Core 2025.8, the two properties for battery in `StateVacuumEntity`, `battery_level` and `battery_icon`, has been deprecated.

The `battery_level` and `battery_icon` properties should be replaced by a separate sensor with the `battery` sensor device class and optionally a customized icon if the default icon of the battery sensor device class isn't wanted.
Optionally consider to also provide a binary sensor with the `charging` device class if it's currently charging or not.

There is a one-year deprecation period, and the two battery properties will stop working from 2026.8 to ensure all custom integration authors have time to adjust.

More details can be found in the [architectural decision](https://github.com/home-assistant/architecture/discussions/938).
