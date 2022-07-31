---
author: Zack Barett
authorURL: https://github.com/zsarnett
title: "Paper Elements are being removed"
---

In the Home Assistant Core 2022.3 release, we are removing all of the `paper-dropdown-menu` and `paper-input` elements in the Frontend Repository. This means that any custom card that was previously using these elements in the card or card editor will no longer render correctly and will require updates to its codebase.

Custom Cards using the elements used in the Home Assistant Frontend have never been supported.

## Why did we do this?

We are converting our codebase from the deprecated `paper` elements to the new [Material Web Components](https://github.com/material-components/material-components-web-components) from Google. This is to keep our frontend up to date with the latest components and features.

## What should custom cards do?

Our advice is to bundle the Material Web Components in your custom card using [Scoped Custom Element Registry](https://github.com/lit/lit/tree/main/packages/labs/scoped-registry-mixin). The Home Assistant Frontend loads the [polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/scoped-custom-element-registry) needed for this to work starting with the release of Home Assistant 2022.3.

This will allow any custom card to utilize the same MWC elements that are used in the Lovelace Editors. You can see an example of this usage in the [Boilerplate Card](https://github.com/custom-cards/boilerplate-card). Other HA elements like the icon picker (`<ha-icon-picker>`) are not supported in this same way.

See [this old blog post](https://developers.home-assistant.io/blog/2020/10/02/lazyMoreInfo#what-about-external-elements) for more information.
