---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorImageURL: /img/profile/frenck.png
authorTwitter: frenck
title: Icon translations
---

In Home Assistant 2024.2, we will introduce a new way to provide icons for integrations: Icon translations.

Icon translations work similarly to our regular translations for entities, which can translate the state of an entity or entity attribute state into any language. Icon translations work in a similar way, but instead of translating the state into the end-user language, it translates the state into an icon.

Each integration can now provide an `icons.json` file, containing a mapping of states to icons. Here is an example of a Moon `sensor` entity that provides different icons for each state:

```json
{
  "entity": {
    "sensor": {
      "phase": {
        "default": "mdi:moon",
        "state": {
          "new_moon": "mdi:moon-new",
          "first_quarter": "mdi:moon-first-quarter",
          "full_moon": "mdi:moon-full",
          "last_quarter": "mdi:moon-last-quarter"
        }
      }
    }
  }
}
```

Icon translations also support translating entity attribute states.

[Read more about icon translations in our documentation](/docs/core/entity#icons).

## Service icons

This change is backward-compatible. The existing `icon` property of entities will continue to work as it did before. However, we recommend the use of the icon translation over the `icon` property.

Additionally, services provided by integrations now also support icons and can be provided in the same icon translations file. These icons are used in the Home Assistant UI when displaying the service in places like the automation and script editors. The following example shows how to provide icons for the `light.turn_on` and `light.turn_off` services:

```json
{
  "services": {
    "turn_on": "mdi:lightbulb-on",
    "turn_off": "mdi:lightbulb-off"
  }
}
```

[Read more about service icons in our documentation](/docs/dev_101_services#icons).

