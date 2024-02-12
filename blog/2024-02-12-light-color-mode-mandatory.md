---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "It is now required for lights to set color mode"
---


## Change

It is now required for light entities to set the `supported_color_modes` and `color_mode` properties, and a warning will be logged asking users to report an issue if that's not done.

In addition, a warning will be logged if the light reports an invalid combination of `supported_color_modes` or a `color_mode` other than `ColorMode.UNKNOWN` which is not included in the light's `supported_color_modes`.

In the Home Assistant 2025.3 release, the warnings will be removed and lights which have still not been upgraded to color mode, or which violate the color mode rules, will no longer work.

More details can be found in the [documentation](/docs/core/entity/light#color-modes).
