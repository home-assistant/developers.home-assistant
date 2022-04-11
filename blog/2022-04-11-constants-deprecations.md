---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorTwitter: frenck
title: "Constant deprecations for 2022.5
---

For Home Assistant Core 2022.5, we have deprecated many constants and replaced
them with enums.

All `SUPPORT_*` constants have been deprecated, and are summerised
in a [previously published blog article](/blog/2022/04/02/support-constants-deprecation).

Additionally, the following constants have been deprecated:

- **Light**

  Deprecated constants:

  - `COLOR_MODE_UNKNOWN`
  - `COLOR_MODE_ONOFF`
  - `COLOR_MODE_BRIGHTNESS`
  - `COLOR_MODE_COLOR_TEMP`
  - `COLOR_MODE_HS`
  - `COLOR_MODE_XY`
  - `COLOR_MODE_RGB`
  - `COLOR_MODE_RGBW`
  - `COLOR_MODE_RGBWW`
  - `COLOR_MODE_WHITE`

  Use the new [`ColorMode`](/docs/core/entity/light#color-modes) enum instead.
