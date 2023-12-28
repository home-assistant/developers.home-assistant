---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Deprecating all magic numbers for supported features"
---

As of Home Assistant Core 2024.1, all usage of magic numbers for supported features is deprecated,
and each entity platform has provided an `EntityFeature` enum to replace them.

This applies to, the following platforms:

- **Alarm Control Panel**

  Use the new [`AlarmControlPanelEntityFeature`](/docs/core/entity/alarm-control-panel#supported-features) enum instead.

- **Camera**

  Use the new [`CameraEntityFeature`](/docs/core/entity/camera#supported-features) enum instead.

- **Cover**

  Use the new [`CoverEntityFeature`](/docs/core/entity/cover#supported-features) enum instead.

- **Climate**

  Use the new [`ClimateEntityFeature`](/docs/core/entity/climate#supported-features) enum instead.

- **Humidifier**

  Use the new [`HumidifierEntityFeature`](/docs/core/entity/humidifier#supported-features) enum instead.

- **Fan**

  Use the new [`FanEntityFeature`](/docs/core/entity/fan#supported-features) enum instead.

- **Light**

  Use the new [`LightEntityFeature`](/docs/core/entity/light#supported-features) enum instead.

- **Lock**

  Use the new [`LockEntityFeature`](/docs/core/entity/lock#supported-features) enum instead.

- **Media Player**

  Use the new [`MediaPlayerEntityFeature`](/docs/core/entity/media-player#supported-features) enum instead.

- **Remote**

  Use the new [`RemoteEntityFeature`](/docs/core/entity/remote#supported-features) enum instead.

- **Siren**

  Use the new [`SirenEntityFeature`](/docs/core/entity/siren#supported-features) enum instead.

- **Vacuum**

  Use the new [`VacuumEntityFeature`](/docs/core/entity/vacuum#supported-features) enum instead.

- **Water Heater**

  Use the new [`WaterHeaterEntityFeature`](/docs/core/entity/water-heater#supported-features) enum instead.