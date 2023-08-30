---
author: Paul Bottein
authorURL: https://github.com/piitaya
authorTwitter: piitaya
title: Entity state formatting
---

In the Home Assistant Core 2023.9 release, we introduced 3 new methods to the `hass` object to allow entity state formatting with localization support for custom cards:

- `hass.formatEntityState`
- `hass.formatEntityAttributeValue`
- `hass.formatEntityAttributeName`

Example:

```js
hass.formatEntityState(hass.states["cover.living_room_shutter"]); 
// It will return "Open" if the user language is English.
// It will return "Ouvert" if the user language is French.
```

For more details, refer to the [entity state formatting documentation](/docs/frontend/data#entity-state-formatting).
