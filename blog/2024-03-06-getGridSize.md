---
author: Paul Bottein
authorURL: https://github.com/piitaya
authorTwitter: piitaya
title: "Grid section support for custom cards"
---

The `2024.3` Home Assistant introduced a new type of view: the [section view](https://rc.home-assistant.io/dashboards/sections/).

To support this new view, your card must provide a `getGridSize` method. Otherwise, your card will be full width on the grid. The section grid is composed of 4 columns and as many row as needed.

If you want your custom card to take 2 columns and 1 row (the same as tile card), you must define the follow code.

```js
class MyCustomCard {
  /*
    ...all your existing custom card code
  */

  // This will tell the grid section that
  // your card will take 2 columns and 1 row.
  public getGridSize() {
    return [2, 1];
  }
}
```

This method must returns the space your card on the grid section as a array containing the number of columns and rows. It is recommended that the size doesn't rely on state or other dynamic state attributes to avoid any layout change when the state change. Try to rely only on some fixed state attributes (e.g. `supported features`) and the card configuration to have a predictable size.

For more information about this new grid system, see [the blog post](https://home-assistant.io/blog/2024/03/04/dashboard-chapter-1/).
