---
author: G Johansson
authorURL: https://github.com/gjohansson-ST
title: "Excluding all state attributes from recording using MATCH_ALL"
---

The way how state attributes are excluded from the recording was previously changed in September 2023.

The previous implementation was limited as there was no way to handle dynamic attributes or any easy way to simply exclude all attributes instead of listing them individually.

It is now possible within an integration to tell recording to not record any attribute by using the `MATCH_ALL` constant, which will automatically remove all attributes from recording except `device_class`, `state_class`, `unit_of_measurement`, and `friendly_name.`

```python
from homeassistant.const import MATCH_ALL

class ExampleEntity(Entity):
    """Implementation of an entity."""

    _unrecorded_attributes = frozenset({MATCH_ALL})

```

More details can be found in the [entity documentation](/docs/core/entity#excluding-state-attributes-from-recorder-history).

Background for the original change is in [architecture discussion #964](https://github.com/home-assistant/architecture/discussions/964).
