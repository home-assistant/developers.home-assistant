---
author: Paul Bottein
authorURL: https://github.com/piitaya
title: "Properties changes for ha-state-icon"
---

In Home Assistant 2024.2, integration have a new way to provide icons. To support this new feature, `ha-state-icon` component properties have changed.

[Read more about icon translations in our documentation](/docs/core/entity#icons).

If you are a custom card developer and you use this component, you have to adjust the properties passed the component to avoid wrong icons displayed in your custom card.

### Before 2024.2

```html
<ha-state-icon .state="${stateObj}"></ha-state-icon>
```

### After 2024.2

```html
<ha-state-icon .hass="${hass}" .stateObj="${stateObj}"></ha-state-icon>
```

### Backward compatibility

If you want to support both old and new version on Home Assistant, you can pass all the properties.

```html
<ha-state-icon
  .hass="${hass}"
  .stateObj="${stateObj}"
  .state="${stateObj}"
></ha-state-icon>
```
