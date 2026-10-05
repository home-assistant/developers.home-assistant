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
