---
author: Abílio Costa
authorURL: https://github.com/abmantis
title: "Translating units of measurement"
---

Home Assistant 2024.12 will support the translation of custom units of measurement. Previously, those would have been hardcoded in their integrations.

Just like for entity names, integrations just need to set the `translation_key` on the entity definition and provide the unit designation in the `strings.json` file (with the new `unit_of_measurement` key):

```json
{
  "entity": {
    "sensor": {
      "subscribers_count": {
        "unit_of_measurement": "subscribers"
      },
    }
  }
}
```

Check our [backend localization documentation](/docs/internationalization/core#unit-of-measurement-of-entities) for details.
