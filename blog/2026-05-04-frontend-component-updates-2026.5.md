---
author: Wendelin Peleska
authorURL: https://github.com/wendevlin
title: "Frontend component updates in 2026.5"
---

## Component updates

### ha-progress-bar

A new component replaces `mwc-progress-bar` in our codebase and is fully themeable. Check out this [PR](https://github.com/home-assistant/frontend/pull/51489) for a fully custom progress bar.

New component specific tokens:

```css
--ha-progress-bar-indicator-color
--ha-progress-bar-indicator-background
--ha-progress-bar-track-color
--ha-progress-bar-track-height
--ha-progress-bar-border-radius
--ha-progress-bar-animation-duration
--ha-progress-bar-indicator-highlight-image
--ha-progress-bar-indicator-highlight-width
--ha-progress-bar-indicator-highlight-height
```

### ha-switch

`ha-switch` was migrated to webawesome. It now has many CSS properties to make customization easier. We also removed some tokens from the old switch:

Removed tokens:

```css
--switch-unchecked-button-color
--switch-unchecked-track-color
--switch-unchecked-color
--switch-checked-button-color
--switch-checked-track-color
--switch-checked-color
```

New component specific tokens:

```css
--ha-switch-size
--ha-switch-thumb-size
--ha-switch-width
--ha-switch-background-color
--ha-switch-thumb-background-color
--ha-switch-background-color-hover
--ha-switch-thumb-background-color-hover
--ha-switch-checked-background-color
--ha-switch-checked-thumb-background-color
--ha-switch-checked-background-color-hover
--ha-switch-checked-thumb-background-color-hover
--ha-switch-border-color
--ha-switch-thumb-border-color
--ha-switch-thumb-border-color-hover
--ha-switch-checked-border-color
--ha-switch-checked-thumb-border-color
--ha-switch-checked-border-color-hover
--ha-switch-checked-thumb-border-color-hover
--ha-switch-thumb-box-shadow
--ha-switch-disabled-opacity
--ha-switch-required-marker
--ha-switch-required-marker-offset
```

### ha-checkbox

`ha-checkbox` was also migrated to webawesome and got new CSS properties. You can no longer use MDC tokens for it, but we added a set of tokens to customize the new checkbox.

New component specific tokens:

```css
--ha-checkbox-size
--ha-checkbox-border-color
--ha-checkbox-border-color-hover
--ha-checkbox-background-color
--ha-checkbox-background-color-hover
--ha-checkbox-checked-background-color
--ha-checkbox-checked-background-color-hover
--ha-checkbox-checked-icon-color
--ha-checkbox-checked-icon-scale
--ha-checkbox-border-radius
--ha-checkbox-border-width
--ha-checkbox-required-marker
--ha-checkbox-required-marker-offset
```

### ha-textarea

`ha-textarea` was migrated to webawesome and got new CSS properties. You can no longer use MDC tokens for it, but we added a set of tokens to customize the new textarea.

The API changed slightly. To make your textarea grow in size, set the `resize` prop to `auto`.

### ha-adaptive-popover

You might already know the (fairly new) `ha-adaptive-dialog` component. It combines a dialog and bottom sheet by showing a dialog on desktop and a bottom sheet on mobile.
We added `ha-adaptive-popover` as the popover counterpart to the adaptive dialog. It shows a popover on desktop and a bottom sheet on mobile. It is based on `ha-adaptive-dialog` and is currently used in the tile card date picker feature.

### Removed ha-fab

`ha-fab` was removed, we use just a normal `ha-button` now, since the position styling was always done from the parent component.

## Style updates

### Box shadow tokens

We added new global box shadow tokens: `--ha-box-shadow-s`, `--ha-box-shadow-m`, `--ha-box-shadow-l`

But we also removed the old box shadow tokens:

```css
--ha-color-shadow-light
--ha-color-shadow-dark
--ha-shadow-offset-x-...
--ha-shadow-blur-...
--ha-shadow-spread-..
```


### Surface colors

In the next release we plan to change the way we handle surface background colors. The tokens are introduced now but are just used for ha-tooltip.

New tokens:

```css
--ha-color-surface-default
--ha-color-surface-low
--ha-color-surface-lower
--ha-color-surface-default-inverted
--ha-color-surface-low-inverted
--ha-color-surface-lower-inverted
```