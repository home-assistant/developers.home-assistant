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
async function getIcons(name) {
  return {
    path:
      "M21.8,13H20V21H13V17.67L15.79,14.88L16.5,15C17.66,15 18.6,14.06 18.6,12.9C18.6,11.74 17.66,10.8 16.5,10.8A2.1,2.1 0 0,0 14.4,12.9L14.5,13.61L13,15.13V9.65C13.66,9.29 14.1,8.6 14.1,7.8A2.1,2.1 0 0,0 12,5.7A2.1,2.1 0 0,0 9.9,7.8C9.9,8.6 10.34,9.29 11,9.65V15.13L9.5,13.61L9.6,12.9A2.1,2.1 0 0,0 7.5,10.8A2.1,2.1 0 0,0 5.4,12.9A2.1,2.1 0 0,0 7.5,15L8.21,14.88L11,17.67V21H4V13H2.25C1.83,13 1.42,13 1.42,12.79C1.43,12.57 1.85,12.15 2.28,11.72L11,3C11.33,2.67 11.67,2.33 12,2.33C12.33,2.33 12.67,2.67 13,3L17,7V6H19V9L21.78,11.78C22.18,12.18 22.59,12.59 22.6,12.8C22.6,13 22.2,13 21.8,13M7.5,12A0.9,0.9 0 0,1 8.4,12.9A0.9,0.9 0 0,1 7.5,13.8A0.9,0.9 0 0,1 6.6,12.9A0.9,0.9 0 0,1 7.5,12M16.5,12C17,12 17.4,12.4 17.4,12.9C17.4,13.4 17,13.8 16.5,13.8A0.9,0.9 0 0,1 15.6,12.9A0.9,0.9 0 0,1 16.5,12M12,6.9C12.5,6.9 12.9,7.3 12.9,7.8C12.9,8.3 12.5,8.7 12,8.7C11.5,8.7 11.1,8.3 11.1,7.8C11.1,7.3 11.5,6.9 12,6.9Z",
  };
}
window.customIconsets = window.customIconsets || {};
window.customIconsets["custom"] = getIcons;
```

Home Assistant will call the fuction `getIcons("icon")` when the icon `custom:icon` is set.
