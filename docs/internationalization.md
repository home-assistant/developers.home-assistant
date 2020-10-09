---
title: "Internationalization"
---

The Home Assistant internationalization project includes preparing platforms and the frontend for localization, as well as the actual translation of localized strings.

Some components and platforms will have strings that need to be localized specifically for that platform. These strings are managed in the core [home-assistant](https://github.com/home-assistant/core) repository. The Home Assistant backend will serve strings to the clients based on the loaded components in the running instance.

There are also localizable strings that exist only on the frontend. These strings are managed in the [home-assistant frontend](https://github.com/home-assistant/frontend) repository. These strings are stored with the frontend and don’t depend on the backend configuration.

| Type              | Location |
| ----------------- | -------- |
| Entity states     | Core     |
| Config flows      | Core     |
| Options flows     | Core     |
| Device automation | Core     |
| Text in UI        | Frontend |

Our strings are translated by the community using the online translation tool [Lokalise](https://lokalise.co/).
