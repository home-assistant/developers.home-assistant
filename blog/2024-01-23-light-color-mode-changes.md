---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "Changes to light color mode when lights display an effect"
---

## Background

The primary reason for introducing light color modes was that a light's state should not be ambiguous. As an example, a light which supports color and white with adjustable color temperature must be in either color mode `hs` (for example) or `color_temp`.

However, effects complicate this because when the same light is rendering an effect, none of the `hs_color`, `color_temp` or `brightness` state attributes may be meaningful.

## Changes

### Requirements on `color_mode` are less strict when a light is rendering an effect

More restrictive color modes than what's otherwise supported by the light are allowed when an effect is active:
- A light which supports colors is allowed to indicate color modes `on_off` and `brightness` when controlled by an effect
- A light which supports brightness is allowed to indicate color mode `on_off` when controlled by an effect.

For example, a light which has its supported_color_modes set to `{"hs", "color_temp"}` is allowed to set its `color_mode` to `on_off` when rendering an effect which can't be adjusted and to `brightness` when rendering an effect which allows brightness to be controlled.

### A special effect `EFFECT_OFF` which means no effect / turn off effect has been added

There was previously no standard way for a light which supports effects to show that no effect is active.
This has been solved by adding an the pre-defined effect `EFFECT_OFF` to indicate no effect is active.

More details can be found in the [documentation](/docs/core/entity/light#color-modes) and in [architecture discussion #960](https://github.com/home-assistant/architecture/discussions/960).
