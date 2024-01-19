---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorImageURL: /img/profile/frenck.png
authorTwitter: frenck
title: Icon translations
---

In Home Assistant 2024.2 we will introduce a new way to provide icons for integrations: Icon translations.

Icon translations work similar to our regular translations for entities, which can translation the state of an entity or entity attribute state, into any language. Icon translations work in a similar way, but instead of translating the state into the end-users language, it translates the state into icon.

Each integration can now provide an `icons.json` file, which contains a mapping of states to icons. Here is an example of an Moon `sensor` entity, that provides different icons for each state:

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

Icon translations also support translating entity attributes states.

[Read more about icon translations in our documentation](/docs/core/entity#icons).

This change is backward-compatible. The existing `icon` property of an entities will continue to work as it did before. However, we recommend the use of the icon translation over the `icon` property.
