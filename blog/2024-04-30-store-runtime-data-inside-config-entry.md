---
author: Marc Mueller
authorURL: https://github.com/cdce8p
title: "Store runtime data inside the config entry"
---

Often integration need to setup and keep track of custom data like coordinators, api connections or code objects. Previously those would all be stored inside `hass.data` which made keeping track of it difficult.

With recent changes, it's now possible to use `entry.runtime_data` for that. The config entry is already available when setting up platforms and gets cleaned up automatically. No more deleting the key from `hass.data` after unload.

It also better supports type checking. `ConfigEntry` is generic now, so it's possible to pass the data type along. Use a typed data structure like `dataclass` for that. To simplify the annotation, it's recommended to define a type alias for it.

An example could look like this
```py
# <integration>/__init__.py

# The type alias needs to be suffixed with 'ConfigEntry'
MyConfigEntry = ConfigEntry["MyData"]

@dataclass
class MyData:
    client: MyClient
    other_data: dict[str, Any]

async def async_setup_entry(
    hass: HomeAssistant,
    entry: MyConfigEntry,  # use type alias instead of ConfigEntry
) -> bool:
    client = MyClient(...)
    
    # Assign the runtime_data
    entry.runtime_data = MyData(client, {...})
```

```py
# <integration>/switch.py

from . import MyConfigEntry

async def async_setup_entry(
    hass: HomeAssistant,
    entry: MyConfigEntry,  # use type alias instead of ConfigEntry
    async_add_entities: AddEntitiesCallback,
) -> None:
    # Access the runtime data form the config entry
    data = entry.runtime_data
    
    async_add_entities([MySwitch(data.client)])
```
