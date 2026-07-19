---
title: "Frontend design"
sidebar_label: "Design"
---

We maintain a design portal at [https://design.home-assistant.io](https://design.home-assistant.io) that provides information about various frontend aspects such as:

* UI components that can be reused.
* Dashboard cards in various configurations and states.
* Easy way to compare components and cards between light and dark themes.
* Notes about specific wording in Home Assistant.

When new components or features are added to the frontend, those need to be added to the design portal. This portal page explains the details on how to do so: [https://design.home-assistant.io/#design.home-assistant.io/editing](https://design.home-assistant.io/#design.home-assistant.io/editing)

:::note
While the portal is publicly named "design", it is referred to as "gallery" in the frontend repository. That is why the source code lives in `gallery/src`, and you can run the gallery locally with `yarn dev:gallery` (a wrapper around `gallery/script/develop_gallery`). It is served on http://localhost:8100 and accepts the same [background lifecycle flags](/docs/frontend/development#managing-the-dev-server-in-the-background) as the other dev servers.
:::
