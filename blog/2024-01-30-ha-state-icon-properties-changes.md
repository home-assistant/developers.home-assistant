---
author: Paul Bottein
authorURL: https://github.com/piitaya
title: "Properties changes for ha-state-icon"
---

In Home Assistant 2024.2, integrations have a new way to provide icons. To support this new feature, `ha-state-icon` component properties have changed.

[Read more about icon translations in our documentation](/docs/core/entity#icons).

If you are a custom card developer using this component, you must adjust the properties passed to the component to avoid displaying the wrong icons in your custom card.

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
