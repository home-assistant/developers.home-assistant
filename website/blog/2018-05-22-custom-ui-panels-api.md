---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: Updates for Custom UI and Custom Panels
---

With the release of Home Assistant 0.70, we've migrated the build pipeline for our frontend from being based on HTML imports to ES module imports (more on this later). One of the effects of this is that we're no longer using the `window` object to share classes, data and utilities with other pieces of code.

This might impact you if you dependend on some of this. Examples are Polymer (`window.Polymer`) or one of our utilitity functions that used to be available as `window.hassUtil`, `window.HAWS` or `window.hassMixins`.

To give developers time to migrate, we're adding a temporary legacy support layer that will expose some of our internals again on the `window` object. We've already added `window.Polymer`, `window.Polymer.Element` and `window.Polymer.html`. If you're using other specific things from the window object, [please let us know](https://github.com/home-assistant/home-assistant-polymer/issues/1157).

Th legacy support layer will no longer be included in releases happening after July 2018.
