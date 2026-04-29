---
author: Wendelin Peleska
authorURL: https://github.com/wendevlin
title: "Frontend component updates in 2026.5"
---

## Component updates

### ha-progress-bar

A new component that replaces the mwc-progress-bar in our codebase and is fully themeable. Checkout this [PR](https://github.com/home-assistant/frontend/pull/51489) if you want to have a fully custom progressbar.

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

`ha-switch` was migrated to webawesome. It got a lot of css properties to make it easy to customize. But we also removed some tokens from the old switch:

Removed tokens:

```css
--switch-unchecked-button-color
--switch-unchecked-track-color
--switch-unchecked-color
--switch-checked-button-color
--switch-checked-track-color
--switch-checked-color
```

### ha-checkbox

`ha-checkbox` was also migrated to webawesome and got new css properties. So you cannot use mdc tokens anymore for it, but we added a bunch tokens to customize the new checkbox.

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

`ha-textarea` was migrated to webawesome and got new css properties. So you cannot use mdc tokens anymore for it, but we added a bunch tokens to customize the new textarea. 

The api changed slightly. To have your textarea grow in size you have to set the prop `resize` to `auto`

### ha-adaptive-popover

You may now the (pretty new) component `ha-adaptive-dialog` its a combination of dialog and bottom-sheet and shows the dialog on desktop and bottom sheet on mobile. We added a new component `ha-adaptive-popover` which is the popover version of the adaptive dialog. It shows a popover on desktop and a bottom sheet on mobile. It is based on ha-adaptive-dialog and used in the tile card date picker feature for now.

### Removed ha-fab

`ha-fab` was removed, we use just a normal `ha-button` now, since the position styling was always done from the parent component.

## Style updates

### box shadow tokens

We added new global box shadow tokens: `--ha-box-shadow-s`, `--ha-box-shadow-m`, `--ha-box-shadow-l`

But we also removed the old box shadow tokens:

```css
--ha-color-shadow-light
--ha-color-shadow-dark
--ha-shadow-offset-x-...
--ha-shadow-blur-...
--ha-shadow-spread-..
```


### surface colors

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