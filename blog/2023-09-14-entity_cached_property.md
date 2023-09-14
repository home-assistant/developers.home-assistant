---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: Entities with dynamic `device_class` or `attribution`
---

The `Entity` base class now caches `device_class` and `attribution` using the python `@cached_property` decorator. The cache allows Home Assistant to avoid recalculating the device class and attribution each time the state for the entity is written to the state machine since these values are rarely if ever, expected to change.

If your custom integration defines `device_class` or `attribution` using a `@property`, it should switch to using `@cached_property` instead unless these values can change at run time. Integrations should avoid changing `device_class` at run time since anything that consumes the state may be unable to handle the `device_class` unexpectedly changing.

The `@cached_property` decorator should be imported from `homeassistant.backports.functools` since the built-in `@cached_property` contains undocumented locking functionality that is not desirable and has been removed in cpython 3.12 and later. For more information, see [cached_property](https://docs.python.org/3.12/library/functools.html#functools.cached_property)