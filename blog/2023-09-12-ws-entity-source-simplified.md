---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "The websocket command entity/source has been modified"
---

The websocket command `entity/source` has been greatly simplified:
- It's no longer possible to get information for a single entity
- Only the domain of the entities is included in the response, `custom_component`, `config_entry` and `source` are no longer present.

### New response example
```json
{
  "light.entity_1": {
    "domain": "template",
  },
  "switch.entity_2": {
    "domain": "shelly",
  },
}
```

### Old response example
```json
{
  "light.entity_1": {
    "custom_component": false,
    "domain": "template",
    "source": "platform_config",
  },
  "switch.entity_2": {
    "custom_component": false,
    "config_entry": "<config_entry_id>",
    "domain": "shelly",
    "source": "config_entry",
  },
}
```


The change was introduced in [core PR#99439](https://github.com/home-assistant/core/pull/99439)
