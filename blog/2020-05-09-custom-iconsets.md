---
author: Bram Kragten
authorURL: https://github.com/bramkragten
authorTwitter: bramkragten
title: Custom icon sets
---

If you are the maintainer of a custom icon set, you might need to update it.

In Home Assistant core version 0.110 we will change the way our icons are loaded. We no longer load all the `mdi` icons at once, and they will not become DOM elements.
This will save us almost 5000 DOM elements and will reduce loading time.

This also means we no longer use or load `<ha-iconset-svg>`, if your icon set relied on this element, you will have to change your icon set.

We introduced a new API where you can register your custom icon set with an async function, that we will call with the icon name as parameter.
We expect a promise with an object of the icon requested. Your icon set can decide on a strategy for loading and caching.

The format of the API is:
```ts
window.customIconsets: {
  [iconset_name: string]: (icon_name: string) => Promise< { path: string; viewBox?: string } > 
};
```
`path` is the path of the `svg`. This is the string that is in the `d` attribute of the `<path>` element.
The `viewBox` is optional and will default to `0 0 24 24`.

An very simple example of this for the icon `custom:icon`:

```js
async function getIcon(name) {
  return {
    path: "M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",
  };
}
window.customIconsets = window.customIconsets || {};
window.customIconsets["custom"] = getIcon;
```

Home Assistant will call the fuction `getIcon("icon")` when the icon `custom:icon` is set.
