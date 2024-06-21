---
author: Bram Kragten
authorURL: https://twitter.com/bramkragten
authorTwitter: bramkragten
title: Deprecating Polymer
---

The Home Assistant frontend used to use the [Polymer Library](https://polymer-library.polymer-project.org/3.0/docs/about_30) for her web components. Polymer has since been deprecated and superseded by [Lit](https://lit.dev).

In the last couple of years, we migrated most of the frontend to Lit, and we only have a few places and dependencies that still use Polymer.

This is good news, as Lit is way faster and lighter than Polymer.

In Home Assistant 2023.4, we finally removed the last piece of Polymer from the entry point of Home Assistant, meaning it is not loaded when the app starts, but only when a component needs it.

For custom cards and panels, we have supplied Polymer on the window object, so it was easier to access and use. But nowadays it is hardly used anymore, and since Home Assistant no longer uses it, it is mainly a big chunk of unused code that is slowing down the loading of Home Assistant.

That's why we decided to remove it.

In Home Assistant 2023.5 Polymer will no longer be provided by Home Assistant. If you use Polymer now, we recommend you switch to Lit. If you want to keep using Polymer, you will have to load Polymer yourself.

In Home Assistant 2023.4, we will log a warning every time Polymer is accessed. If you got a log message, find the custom card, panel, or more info that uses Polymer, and notify the author of this deprecation.