---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Device filter has been removed from target selector"
---

The ability to filter on devices has been removed from the [target selector documentation](https://www.home-assistant.io/docs/blueprint/selectors/#target-selector).

Hassfest has been updated to [fail on services with device filter on targets](https://github.com/home-assistant/core/pull/152794).

In Home Assistant Core 2026.11, validation of target selector with a device filter will fail.

### Background

Device filter on target selectors was not supported by core helpers which extract entities from targets, which meant the device filter was ignored if the user had picked a floor, area, label or category. Also, the device filter was not respected by frontend when picking entities for the target.

All core integrations were reviewed, and there was no case where a target selector with a device filter was correctly used. Hence, it was decided to remove the device filter from the target selector instead of implementing support for it in core and frontend.

### Impact on custom integration and blueprint authors

Custom integrations and blueprints which use target selectors with a device filter need to be updated to remove the device filter.

Please reach out on Discord if you have a valid use case for device filter on target selectors.
