---
author: Zack Barett
authorURL: https://github.com/zsarnett
title: "Paper Elements are being removed"
---

In 2022.3, we are removing all of our `paper-dropdown-menu` and `paper-input` elements in the Frontend Repository. This means that any custom card that was previously using these elements in your cards or card editors will no longer render correctly and will require updates to your codebase.

As previsously stated, Custom Cards using the elements used in the Home Assistant Frontend has never been supported

## Why did we do this?

We are converting our code base from the deprecated `paper` elements to the new [Material Web Components](https://github.com/material-components/material-components-web-components) from Google. This is to keep our frontend up to date with the latest components and features.

## What should custom cards do?
 
You can replace your paper elements with mwc elements but there is no gaurentee that these elements will be loaded when your users load your editor or cards. As well as no guarentee that we use these elements forever.

This comes back to the [blog post by Bram](https://developers.home-assistant.io/blog/2020/10/02/lazyMoreInfo):

> Is there a solution to all these problems? So custom cards can provide the same uniform user experience, without the risk of having breaking changes every release?

> The best solution we see is a set of elements created by the custom card community. This set would have its own namespace that would not collide with that of the elements that Home Assistant uses. All custom cards could use these elements, without the risk of breaking changes.
