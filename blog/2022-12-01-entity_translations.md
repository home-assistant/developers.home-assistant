---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Translating the state of entities"
---

The method for integrations to provide translations for states of its entities under other integrations, for example to translate an integration's sensors has changed.

Integrations should no longer use custom device classes together with a `strings.<platform name>.json` file. Instead, entities should set the `translation_key` property on an entity and include that `translation_key` in the integration's `strings.json`.

:::warning
Pointing to translations via the `translation_key` property is currently only supported for entities with a `unique_id`.
:::

The following example `strings.json` is for a Moon domain `sensor` entity with its `translation_key` property set to `phase`:

```json
{
  "entity": {
    "sensor": {
      "phase": {
        "state": {
          "new_moon": "New moon",
          "first_quarter": "First quarter",
          "full_moon": "Full moon",
          "last_quarter": "Last quarter"
        }
      }
    }
  }
}
```

For more details, see the [`translation`](/docs/internationalization/core/#state-of-entities) and [`entity`](/docs/core/entity#generic-properties) documentation.
