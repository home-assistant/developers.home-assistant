---
author: Zack Barett
authorURL: https://github.com/zsarnett
title: "Paper Elements are being removed"
---

In 2022.3, we are removing all of the `paper-dropdown-menu` and `paper-input` elements in the Frontend Repository. This means that any custom card that was previously using these elements in the card or card editor will no longer render correctly and will require updates to its codebase.

Custom Cards using the elements used in the Home Assistant Frontend has never been supported.

## Why did we do this?

We are converting our codebase from the deprecated `paper` elements to the new [Material Web Components](https://github.com/material-components/material-components-web-components) from Google. This is to keep our frontend up to date with the latest components and features.

## What should custom cards do?
 
Custom Card Creators should bundle the components they rely on. This way they can control the version that is being used. The MWC components support registering their elements with custom names so they don't conflict with the Home Assistant frontend: [example from ESP Web Tools](https://github.com/esphome/esp-web-tools/blob/main/src/components/ewt-checkbox.ts)

