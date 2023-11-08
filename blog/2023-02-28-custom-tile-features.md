---
author: Paul Bottein
authorURL: https://github.com/piitaya
authorTwitter: piitaya
title: Custom tile features
---

In the Home Assistant Core 2022.3 release, we add custom features for the [tile card](https://www.home-assistant.io/dashboards/tile/). If you are a developer of custom cards, you can now build your own features to the tile card instead of building a whole card.

![Screenshot showing example of custom tile feature](/img/en/blog/2023-02-28-custom-tile-features/example.png)

```yaml
type: tile
entity: button.push
features:
  - type: custom:button-press-tile-feature
```

Custom tile features can even be added to the tile card editor like any other built-in tile feature using similar syntax as custom cards.

```js
window.customTileFeatures = window.customTileFeatures || [];
window.customTileFeatures.push({
  type: "button-press-tile-feature",
  name: "Button press",
});
```

For more details, see the [custom tile features](/docs/frontend/custom-ui/custom-card/#tile-features) documentation.
