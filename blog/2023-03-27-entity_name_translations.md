---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Translating the name and attributes of entities"
---

It's now possible to translate the name of entities, and this is preferred over hard coding a name in natural language in the Python implementation. Also, entity components provide shared translations, for example, for binary sensor device classes, which should be used to avoid translating the same thing multiple times.

Also, the frontend now has full support for translated entity state attributes for both the names and their values.


:::warning
Pointing to translations via the `translation_key` property is currently only supported for entities with a `unique_id`.

Additionally, translating entity names requires that the `has_entity_name` property is set to `True`.
:::

## Translating entity name
The following example `strings.json` is for a `sensor` entity with its `translation_key` property set to `thermostat_mode`:

```json
{
  "entity": {
    "sensor": {
      "thermostat_mode": {
        "name": "Thermostat mode"
      }
    }
  }
}
```

The following example `strings.json` is for a `sensor` entity with its `translation_key` property set to `temperature_sensor` where a shared translation provided by the `sensor` integration is used:

```json
{
  "entity": {
    "sensor": {
      "temperature_sensor": {
        "name": "[%key:component::sensor::entity_component::temperature::name%]"
      }
    }
  }
}
```

## Translating entity attributes
The following example `strings.json` is for a `demo` domain `climate` entity with its `translation_key` property set to `ubercool`, which has custom `fan_mode` and `swing_mode` settings:


```json
{
  "entity": {
    "climate": {
      "ubercool": {
        "state_attributes": {
          "fan_mode": {
            "state": {
              "auto_high": "Auto High",
              "auto_low": "Auto Low",
              "on_high": "On High",
              "on_low": "On Low"
            }
          },
          "swing_mode": {
            "state": {
              "1": "1",
              "2": "2",
              "3": "3",
              "auto": "Auto",
              "off": "Off"
            }
          }
        }
      }
    }
  }
}
```

For more details, see the [`entity name translation`](/docs/internationalization/core/#name-of-entities) [`entity attribute translation`](/docs/internationalization/core#entity-state-attributes) and [`entity`](/docs/core/entity#generic-properties) documentation.
