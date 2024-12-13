---
author: epenet
authorURL: https://github.com/epenet
title: "Use Kelvin as the preferred color temperature unit"
---

### Summary of changes

In October 2022, Home Assistant migrated the preferred color temperature unit from mired to kelvin.

It is now time to add deprecation warnings for the deprecated attributes, constants and properties:
* Deprecate state and capability attributes `ATTR_COLOR_TEMP`, `ATTR_MIN_MIREDS` and `ATTR_MAX_MIREDS`
* Deprecate constants `ATTR_KELVIN` and `ATTR_COLOR_TEMP` from the `light.turn_on` service call
* Deprecate properties `LightEntity.color_temp`, `LightEntity.min_mireds` and `LightEntity.max_mireds`

### Background information
- [Community discussion about Kelvin temperature](https://community.home-assistant.io/t/wth-is-light-temperature-not-in-kelvin/467449/6)
- [Core PR #79591: Migration to Kelvin](https://github.com/home-assistant/core/pull/79591)
- [Architecture discussion #564](https://github.com/home-assistant/architecture/discussions/564)
