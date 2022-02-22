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
 
You can replace your `paper` elements with `mwc` elements but there is no gaurentee that these elements will be loaded when your users load your editor or cards, like it also was not guaranteed for `paper` elements. We can also not guarentee that we will use these elements forever, and an update of these elements could include breaking changes. We can not support this use case.

Or advise is to bundle your own elements, that don't collide with the elements Home Assistant uses.

See [this old blog post](https://developers.home-assistant.io/blog/2020/10/02/lazyMoreInfo#what-about-external-elements) for more information.
