---
author: Marc Mueller
authorURL: https://github.com/cdce8p
title: "Improved typing for hass.data"
---

In the past, one of the challenges with `hass.data` was to correctly assign type information. Since it was typed as `dict[str, Any]`, the only options were annotation assignments or `cast` like:

```py
data: MyData = hass.data[SOME_KEY]
```

This had several disadvantages. Not only was it necessary to annotate ever assignment, type checkers basically pretended that the annotation would always be correct. Especially during refactoring, it could easily happen that one instance was missed and, while type-checking still succeeded, the actual code would be broken.

To fix that, it's now possible to use two new key types `HassKey` and `HassEntryKey`. With a little bit of magic, type checkers are now able to infer the type and make sure it's correct. Even when storing data.


An example could look like this:
```py
# <integration>/__init__.py
from homeassistant.util.hass_dict import HassKey

MY_KEY: HassKey["MyData"] = HassKey(DOMAIN)

@dataclass
class MyData:
    client: MyClient
    other_data: dict[str, Any]

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    client = MyClient(...)

    hass.data[MY_KEY] = MyData(client, {...})
    hass.data[MY_KEY] = 1  # mypy error
```

```py    
# <integration>/switch.py
from . import MY_KEY

async def async_setup_platform(
    hass: HomeAssistant,
    config: ConfigType,
    async_add_entities: AddEntitiesCallback,
    discovery_info: DiscoveryInfoType | None = None,
) -> None:
    data = hass.data[MY_KEY]
    reveal_type(data)  # MyData
    
    async_add_entities([MySwitch(data.client)])
```

Storing data in a dict by `entry.entry_id`? It's often better to just store it inside the `ConfigEntry` directly. See the recent [blog post](/blog/2024/04/30/store-runtime-data-inside-config-entry) about it. If that isn't an option, use `HassEntryKey`.

```py
# <integration>/__init__.py
from homeassistant.util.hass_dict import HassEntryKey

MY_KEY: HassEntryKey["MyData"] = HassEntryKey(DOMAIN)

async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
) -> bool:
    client = MyClient(...)
    
    hass.data.setdefault(MY_KEY, {})[entry.entry_id] = MyData(client, {...})
```
