---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "The number of decimals used when displaying a sensor state is now configurable"
---

The number of decimal digits shown when displaying a sensor state is now configurable by the user. Integrations can suggest the number of
decimal digits by setting the property `suggested_display_precision`. Integrations are encouraged to remove rounding for display and instead set property `suggested_display_precision`.

Round for presentation is done by the frontend, as well as by new template functions introduced in [core PR #87619](https://github.com/home-assistant/core/pull/87619).

The number of displayed decimal digits is influenced by unit conversion:
  - Converting from a smaller to a larger unit increases the display precision
  - Converting from a larger to a smaller unit decreases the display precision if the integration has set `suggested_display_precision`
  - Minimum precision when converting from a larger to a smaller unit is 0, i.e. there's no rounding to tens, hundreds etc.

The number of displayed decimal digits is not influenced by unit conversion if the user has set the display precision themselves.

Note:
A similar concept where the sensor's state was rounded, detailed in [an earlier blog post](/blog/2023/01/25/sensor_rounding), has been reverted.
