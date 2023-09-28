---
author: Kendell R
authorURL: https://github.com/KTibow
title: Localize handling update
---

`hass.localize` has been changed to add warnings in the following cases:

1. If you try to pass undefined, like this:
```js
hass.localize("ui.card.climate.heating", { name: undefined })
```
This is probably unintentional, as `{name}` will show up as a blank space. If this is intentional, pass an empty string instead. If this isn't intentional, add special handling for this case.
2. If you use the old localization format, like this:
```js
hass.localize("ui.card.climate.heating", "name", "Thermostat")
```
You shouldn't be doing that because we switched away from this format a while ago. Instead, do something like this:
```js
hass.localize("ui.card.climate.heating", { name: "Thermostat" })
```

While `hass.localize` functions exactly as before, these changes mean that the typing of `hass.localize` can be more explicit and that the internal message parser could be migrated to another library in the future.
