---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Support for platform translations in separate files will be removed"
---

The method for integrations to provide translations for states of its entities under other integrations, for example to translate an integration's sensors was changed in November 2022, and support for the old method will be removed in Home Assistant Core 2024.5.0.

Once Home Assistant Core 2024.5.0 is released, integrations can no longer use custom device classes together with a `strings.<platform name>.json` file. Instead, entities must set the `translation_key` property on an entity and include that `translation_key` in the integration's `strings.json`.

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
