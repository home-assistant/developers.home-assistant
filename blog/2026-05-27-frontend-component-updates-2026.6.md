---
author: Wendelin Peleska
authorURL: https://github.com/wendevlin
title: "Frontend component updates in 2026.6"
---

## Component updates

### ha-radio updates

`ha-radio` was removed from our codebase, we use the webawesome based `ha-radio-group` with `ha-radio-option` now. No need for a `ha-formfield` around a `ha-radio` anymore and you can use the new CSS properties to customize the radio group and options.

New component specific tokens:

```css
--ha-radio-group-required-marker
--ha-radio-group-required-marker-offset

--ha-radio-option-active-color
--ha-radio-option-heigh
--ha-radio-option-toggle-size
--ha-radio-option-border-width
--ha-radio-option-border-color
--ha-radio-option-border-color-hover
--ha-radio-option-background-color
--ha-radio-option-background-color-hover
--ha-radio-option-checked-background-color
--ha-radio-option-checked-icon-color
--ha-radio-option-checked-icon-scale
--ha-radio-option-control-margin
```
