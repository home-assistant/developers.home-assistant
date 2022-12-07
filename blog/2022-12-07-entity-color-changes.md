---
author: Paul Bottein
authorURL: https://github.com/piitaya
title: "Entity state color changes"
---

From the Home Assistant Core 2022.12 release, we are using different colors per domain when an entity is active. The `--paper-item-icon-active-color` CSS variable is no longer used.

This means that any theme that has previously overridden this css variable will use the built-in colors for active states. All theses new colors are available as css variables too.

:::caution
As we only officially support the `primary-color` and `accent-color` properties for themes, some colors can be added or removed between releases.
:::

More details about theme configuration can be found in the [Home Assistant documentation](https://www.home-assistant.io/integrations/frontend/#defining-themes).
