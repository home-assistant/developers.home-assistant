---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorTwitter: frenck
title: "Constant deprecations for 2022.5"
---

For Home Assistant Core 2022.5, we have deprecated many constants and replaced
them with enums.

All `SUPPORT_*` constants have been deprecated, and are summerised
in a [previously published blog article](/blog/2022/04/02/support-constants-deprecation).

Additionally, the following constants have been deprecated:

- **Alarm Control Panel**

  Deprecated constants:

  - `FORMAT_TEXT`
  - `FORMAT_NUMBER`

  Use the new [`CodeFormat`](/docs/core/entity/alarm-control-panel#code-formats) enum instead.

- **Camera**

  Deprecated constants:

  - `STREAM_TYPE_HLS`
  - `STREAM_TYPE_WEB_RTC`

  Use the new [`StreamType`](/docs/core/entity/camera#properties) enum instead.

- **Climate**

  Deprecated constants:

  - `CURRENT_HVAC_COOL`
  - `CURRENT_HVAC_DRY`
  - `CURRENT_HVAC_FAN`
  - `CURRENT_HVAC_HEAT`
  - `CURRENT_HVAC_IDLE`
  - `CURRENT_HVAC_OFF`
  - `HVAC_MODE_AUTO`
  - `HVAC_MODE_COOL`
  - `HVAC_MODE_DRY`
  - `HVAC_MODE_FAN_ONLY`
  - `HVAC_MODE_HEAT_COOL`
  - `HVAC_MODE_HEAT`
  - `HVAC_MODE_OFF`

  Use the new [`HVACAction`](/docs/core/entity/climate#hvac-action) and [`HVACMode`](/docs/core/entity/climate#hvac-modes) enums instead.

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
