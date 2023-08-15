---
author: epenet
authorURL: https://github.com/epenet
title: "Store is now a Generic class"
---

As of Home Assistant Core 2022.8, a Store (from `homeassistant/helpers/storage.py`) is defined as a Generic `Store(Generic[_T])`. It is recommended that the type of data being stored be defined in the Store definition. It should be JSON-serializable (dict or list), for example:
  - Standard definition using a dict: `self._store = Store[dict[str, int]](hass, STORAGE_VERSION, STORAGE_KEY)`
  - Using a TypedDict: `self._store = Store[EnergyPreferences](hass, STORAGE_VERSION, STORAGE_KEY)`
  - Accessing an existing Store: `store: Store[dict[str, Any]] = hass.data[DOMAIN][DATA_STORE]`
  - Inherited Store: `class MyCustomStorage(Store[list[int]]):`
  
For more information about generics, see [PEP 483](https://peps.python.org/pep-0483/#generic-types)
