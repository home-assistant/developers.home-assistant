---
author: epenet
authorURL: https://github.com/epenet
title: "Store is now a Generic class"
---

As of Home Assistant Core 2022.8, a Store is defined as a Generic, based on the type of data being stored.

For example:
  - `self._store = Store[dict[str, int]](hass, STORAGE_VERSION, STORAGE_KEY)`
