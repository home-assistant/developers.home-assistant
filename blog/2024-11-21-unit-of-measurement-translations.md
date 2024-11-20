---
author: Abílio Costa
authorURL: https://github.com/abmantis
title: "Translating units of measurement"
---

Home Assistant 2024.12 will support the translation of custom units of measurement. Previously, those would have been hardcoded in their integrations.

Just like for entity names, integrations just need to provide the unit designation in the `strings.json` file (with the new `unit_of_measurement` key) and set the respective `translation_key` on the entity definition.

Check our [backend localization documentation](/docs/internationalization/core#unit-of-measurement-of-entities) for details.
