---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: Avoid unnecessary callbacks with DataUpdateCoordinator
---

The `DataUpdateCoordinator` can now reduce unnecessary updates when API data can be compared.

When using the `DataUpdateCoordinator`, the data being polled is often expected to stay mostly the same. For example, if you are polling a light that is only turned on once a week, that data may be the same nearly all the time. The default behavior is always calling back listeners when the data is updated, even if it does not change. If the data returned from the API can be compared for changes with the Python `__eq__` method, set `always_update=False` when creating the `DataUpdateCoordinator` to avoid unnecessary callbacks and writes to the state machine.
