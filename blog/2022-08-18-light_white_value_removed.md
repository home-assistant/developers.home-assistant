---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "LightEntity no longer supports white_value"
---

`LightEntity` no longer supports `white_value`, it's replaced by
[color mode](/docs/core/entity/light#color-modes) `white`.

### Background
Light's `white_value` was deprecated in Home Assistant Core 2021.4 by 
[PR #47720](https://github.com/home-assistant/core/pull/47720)
and replaced by color mode `white` in Home Assistant Core 2021.7 by 
[PR #51411](https://github.com/home-assistant/core/pull/51411).
