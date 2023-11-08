---
author: Paul Bottein
authorURL: https://github.com/piitaya
title: "Entity state color changes"
---

From the Home Assistant Core 2022.12 release, we are using different colors per domain when an entity is active. These CSS variables are no longer used:

- `--paper-item-icon-active-color`
- `--state-icon-active-color`

This means that any theme that has previously overridden these CSS variables will use the built-in colors for active states. All theses new colors are available as CSS variables too.

:::caution
As we only officially support the `primary-color` and `accent-color` properties for themes, some colors can be added or removed between releases.
:::

More details about theme configuration can be found in the [Home Assistant documentation](https://www.home-assistant.io/integrations/frontend/#defining-themes).
