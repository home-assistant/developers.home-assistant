---
author: Wendelin Peleska
authorURL: https://github.com/wendevlin
title: "Frontend component updates in 2026.11"
---

## Component updates

### Removed ha-md-list and ha-md-list-item

`ha-md-list` and `ha-md-list-item` were removed. Use `ha-list-base` with `ha-list-item-base` for static rows, or `ha-list-item-button` for clickable rows. The `--md-list-item-*` CSS properties no longer have any effect; use `--ha-row-item-*` and `--ha-list-*` instead.

### ha-outlined-icon-button

`ha-outlined-icon-button` now builds on `ha-icon-button` instead of Material Web. Use `--ha-icon-button-size` for the size (default `40px`) and the new `--ha-outlined-icon-button-outline-color` for the outline. The `--md-outlined-icon-button-*` and `--md-sys-color-outline` properties no longer have any effect.

### Chip CSS properties

The chips no longer use the Material Web property names. Rename the properties you set on `ha-assist-chip`, `ha-input-chip` and `ha-filter-chip`:

```css
--md-assist-chip-*  →  --ha-assist-chip-*
--md-input-chip-*   →  --ha-input-chip-*
--md-filter-chip-*  →  --ha-filter-chip-*
```

`--md-sys-color-on-surface` no longer colors the assist chip label; use `--ha-assist-chip-label-text-color`.

### Removed ha-formfield

`ha-formfield` was removed, so a leftover `ha-formfield` no longer renders its label. `ha-switch` and `ha-checkbox` render their own label, so put the label in the control's default slot:

```diff
-<ha-formfield .label=${label}>
-  <ha-switch .checked=${checked}></ha-switch>
-</ha-formfield>
+<ha-switch .checked=${checked}>${label}</ha-switch>
```

The label is now a real `<label>` around the input, so clicking it toggles the control. When `ha-switch` is disabled, only the control is dimmed; the label uses `--disabled-text-color`.

### Removed --mdc-typography-* properties

The frontend stopped reading the `--mdc-typography-*` CSS properties. Setting them in a theme or on a component no longer has any effect; use the `--ha-font-*` theme variables, such as `--ha-font-size-m` and `--ha-font-family-body`, instead.
