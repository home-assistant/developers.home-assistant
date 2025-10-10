---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Device filter has been removed from target selector"
---

The device filter option is no longer supported by the target selector and has been removed from the [target selector documentation](https://www.home-assistant.io/docs/blueprint/selectors/#target-selector).

Hassfest has been updated to [fail on services with device filter on targets](https://github.com/home-assistant/core/pull/152794).

Validation of target selectors that specify a device filter will fail in Home Assistant Core 2026.11.

### Background

Core helpers that extract entities from targets did not support the device filter. When the user picked a floor, area, label, or category, the filter was ignored. The frontend also ignored the device filter when selecting entities for a target.

A review of all core integrations found no correct uses of a device filter on target selectors. We removed the device filter from the target selector rather than implement support for it in Core and the frontend.

### Impact on custom integrations and blueprints

Update custom integrations and blueprints to remove device filters from target selectors.

If you have a valid use case for device filters on target selectors, reach out on Discord.
