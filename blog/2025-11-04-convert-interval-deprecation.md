---
author: Davide Perteghella
authorURL: https://github.com/krahabb
title: "TemperatureConverter.convert_interval deprecation"
---

The method `convert_interval` in `TemperatureConverter` (allowing conversions between °F and °C intervals) has been deprecated in favor of `TemperatureDeltaConverter.convert`.
The new converter and device class are now the preferred way to deal with temperature intervals.

For details, see [core PR 155689](https://github.com/home-assistant/core/pull/155689) and [core PR 147358](https://github.com/home-assistant/core/pull/147358).
